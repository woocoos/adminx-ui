import { OrgRole, OrgRoleKind } from '@/generated/adminx/graphql';
import { createOrgRole, getOrgRoleInfo, updateOrgRole } from '@/services/adminx/org/role';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';

type ProFormData = {
  name: string;
  comments?: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string;
  orgId: string;
  kind: OrgRoleKind;
  onClose?: (isSuccess?: boolean) => void;
}) => {
  const
    { t } = useTranslation(),
    [orgRoleInfo, setOrgRoleInfo] = useState<OrgRole>(),
    [saveLoading, setSaveLoading] = useState(false),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
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
        const info = await getOrgRoleInfo(props.id);
        if (info?.id) {
          setOrgRoleInfo(info as OrgRole);
          return info;
        }
      }
      return result;
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      let isTrue = false;

      if (props.id) {
        const result = await updateOrgRole(props.id, updateFormat({
          kind: props.kind,
          name: values.name,
          comments: values.comments,
        }, orgRoleInfo || {}));
        if (result?.id) {
          isTrue = true;
        }
      } else {
        const result = await createOrgRole({
          kind: props.kind,
          name: values.name,
          comments: values.comments,
          orgID: props.orgId,
        });
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
      <ProFormTextArea
        name="comments"
        label={t('remarks')}
        placeholder={`${t('please_enter_remarks')}`}
      />
    </DrawerForm>
  );
};
