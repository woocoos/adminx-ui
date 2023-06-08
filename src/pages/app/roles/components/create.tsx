import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { AppRole, createAppRole, getAppRoleInfo, updateAppRole } from '@/services/app/role';
import { DrawerForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default (props: {
  open?: boolean;
  title?: string;
  id?: string;
  appId?: string;
  onClose?: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  setLeavePromptWhen(saveDisabled);

  const
    onOpenChange = (open: boolean) => {
      if (!open) {
        props.onClose?.();
      }
      setSaveDisabled(true);
    },
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      if (props.id) {
        const info = await getAppRoleInfo(props.id);
        if (info?.id) {
          return info;
        }
      }
      return {
        autoGrant: true,
        editable: true,
      };
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: AppRole) => {
      setSaveLoading(true);
      const info = props.id ? await updateAppRole(props.id, values) : await createAppRole(props?.appId || '', values);
      if (info?.id) {
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
      <ProFormRadio.Group
        name="autoGrant"
        label={t('auto_authorization')}
        options={[
          { label: t('yes'), value: true },
          { label: t('no'), value: false },
        ]}
      />
      <ProFormRadio.Group
        name="editable"
        label={t('post_auth_editing')}
        options={[
          { label: t('yes'), value: true },
          { label: t('no'), value: false },
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
