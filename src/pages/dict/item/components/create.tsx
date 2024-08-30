import { AppDict, AppDictItemSimpleStatus, Org, OrgKind } from '@/generated/adminx/graphql';
import InputOrg from '@/pages/org/components/inputOrg';
import { createAppDictItemInfo, getAppDictItemInfo, updateAppDictItemInfo } from '@/services/adminx/dict';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useLeavePrompt } from '@knockout-js/layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProFormData = {
  org?: Org;
  name: string;
  code: string;
  comments?: string;
  status: AppDictItemSimpleStatus;
};

export default (props: {
  open?: boolean;
  title?: string;
  appDictId: string;
  id?: string | null;
  onClose?: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [info, setInfo] = useState<AppDict>(),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [saveLoading, setSaveLoading] = useState(false),
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
      if (props.id) {
        const result = await getAppDictItemInfo(props.id);
        if (result?.id) {
          setInfo(result as AppDict);
          return result;
        }
      }
      return {};
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      const result = props.id
        ? await updateAppDictItemInfo(props.id, updateFormat({
          name: values.name,
          comments: values.comments,
          status: values.status,
        }, info || {}))
        : await createAppDictItemInfo(props.appDictId, {
          orgID: values.org?.id,
          code: values.code,
          name: values.name,
          status: values.status,
          comments: values.comments,
        });
      if (result?.id) {
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
        name="org"
        label={t('organization')}
      >
        <InputOrg kind={OrgKind.Root} />
      </ProFormText>
      <ProFormText
        name="name"
        label={t('name')}
        rules={[
          { required: true, message: `${t('please_enter_name')}` },
        ]}
      />
      <ProFormText
        name="code"
        label={t('code')}
        disabled={!!props.id}
        rules={[
          { required: true, message: `${t('please_enter_code')}` },
        ]}
      />
      <ProFormSelect
        name="status"
        label={t('state')}
        options={[
          { value: AppDictItemSimpleStatus.Active, label: AppDictItemSimpleStatus.Active },
          { value: AppDictItemSimpleStatus.Disabled, label: AppDictItemSimpleStatus.Disabled },
          { value: AppDictItemSimpleStatus.Inactive, label: AppDictItemSimpleStatus.Inactive },
          { value: AppDictItemSimpleStatus.Processing, label: AppDictItemSimpleStatus.Processing },
        ]}
        rules={[
          { required: true, message: `${t('please_select')}` },
        ]}
      />
      <ProFormTextArea
        name="comments"
        label={t('description')}
        placeholder={`${t('please_enter_description')}`}
      />
    </DrawerForm>
  );
};
