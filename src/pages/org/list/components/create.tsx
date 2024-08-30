import { Org, OrgKind, User, UserUserType } from '@/generated/adminx/graphql';
import InputAccount from '@/pages/account/components/inputAccount';
import { createOrgInfo, getOrgInfo, updateOrgInfo } from '@/services/adminx/org';
import { TreeEditorAction, formatTreeData, updateFormat } from '@/util';
import { DrawerForm, ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';

type SelectTreeData = {
  value: string;
  title: string;
  parentId?: string;
  children?: SelectTreeData[];
};

type ProFormData = {
  name: string;
  parentID: string;
  domain?: string;
  countryCode?: string;
  owner?: User;
  profile?: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string;
  kind: OrgKind;
  scene?: TreeEditorAction;
  parentDataSource: Org[];
  onClose?: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [oldInfo, setOldInfo] = useState<Org>();

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    parentRequest = async () => {
      const list: SelectTreeData[] = [
        {
          value: '0', title: t('top_org'), children: [],
        },
      ];

      if (props.parentDataSource.length) {
        list[0].children = formatTreeData(
          props.parentDataSource.map(item => {
            return {
              value: item.id,
              parentId: item.parentID,
              title: item.name,
            };
          })
          , undefined, { key: 'value', parentId: 'parentId', children: 'children' });
      } else {
      }
      return list;
    },
    onOpenChange = (open: boolean) => {
      if (!open) {
        if (checkLeave()) {
          props.onClose?.();
          setSaveDisabled(true);
        }
      } else {
        setSaveDisabled(true);
      }
    },
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      let result = {};
      if (props.id) {
        const orgInfo = await getOrgInfo(props.id);
        if (orgInfo?.id) {
          switch (props.scene) {
            case 'editor':
              result = orgInfo;
              break;
            case 'peer':
              result = { parentID: orgInfo.parentID };
              break;
            case 'child':
              result = { parentID: orgInfo.id };
              break;
            default:
              break;
          }
        }
      }
      setOldInfo(result as Org);
      return result;
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      let isTrue = false;
      if (props.scene === 'editor') {
        if (props.id) {
          const result = await updateOrgInfo(props.id, updateFormat({
            name: values.name,
            parentID: values.parentID,
            ownerID: values.owner?.id,
            domain: values.domain,
            countryCode: values.countryCode,
            profile: values.profile,
          }, oldInfo || {}));
          if (result?.id) {
            isTrue = true;
          }
        } else {
          const result = await createOrgInfo({
            name: values.name,
            parentID: values.parentID,
            ownerID: values.owner?.id,
            domain: values.domain,
            countryCode: values.countryCode,
            profile: values.profile,
          }, props.kind);
          if (result?.id) {
            isTrue = true;
          }
        }
      } else if (props.scene === 'peer') {
        const result = await createOrgInfo({
          name: values.name,
          parentID: values.parentID,
          ownerID: values.owner?.id,
          domain: values.domain,
          countryCode: values.countryCode,
          profile: values.profile,
        }, props.kind);
        if (result?.id) {
          isTrue = true;
        }
      } else if (props.scene === 'child') {
        const result = await createOrgInfo({
          name: values.name,
          parentID: values.parentID,
          ownerID: values.owner?.id,
          domain: values.domain,
          countryCode: values.countryCode,
          profile: values.profile,
        }, props.kind);
        if (result?.id) {
          isTrue = true;
        }
      }

      if (isTrue) {
        setSaveDisabled(true);
        props.onClose?.(true);
      }
      setSaveLoading(false);
      return false;
    };


  return (
    <DrawerForm
      drawerProps={{
        width: 500,
        destroyOnClose: true,
      }}
      submitter={{
        searchConfig: {
          submitText: t('submit'),
          resetText: t('cancel'),
        },
        submitButtonProps: {
          loading: saveLoading,
          disabled: saveDisabled,
        },
      }}
      title={props.title}
      open={props?.open}
      onReset={getRequest}
      request={getRequest}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
    >
      <ProFormText
        name="name"
        label={t('name')}
        rules={[
          { required: true, message: `${t('please_enter_name')}` },
        ]}
      />
      <ProFormTreeSelect
        name="parentID"
        label={t('parent_org')}
        disabled={!!props.id}
        request={parentRequest}
        rules={[
          { required: true, message: `${t('please_enter_parent_org')}` },
        ]}
      />
      <ProFormText
        x-if={props.kind === 'root'}
        disabled={!!oldInfo?.domain}
        name="domain"
        label={t('domain')}
        tooltip={t('domain_tooltip')}
      />
      <ProFormText
        x-if={props.kind === 'root'}
        name="countryCode"
        label={t('country_region')}
      />
      <ProFormText
        x-if={props.kind === 'root'}
        name="owner"
        label={t('manage_account')}
        tooltip={t('owner_tooltip')}
      >
        <InputAccount
          disabled={!!oldInfo?.ownerID}
          userType={UserUserType.Account}
        />
      </ProFormText>
      <ProFormTextArea
        name="profile"
        label={t('description')}
        placeholder={`${t('please_enter_description')}`}
      />
    </DrawerForm>
  );
};
