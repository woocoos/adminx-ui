import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { AppRes, getAppResInfo, updateAppRes } from '@/services/app/resource';
import { DrawerForm, ProFormText } from '@ant-design/pro-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default (props: {
  open: boolean;
  title?: string;
  id?: string;
  appId: string;
  onClose: (isSuccess?: boolean) => void;
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
        const info = await getAppResInfo(props.id);
        if (info?.id) {
          return info;
        }
      }
      return {};
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: AppRes) => {
      setSaveLoading(true);
      const info = props.id ? await updateAppRes(props.id, {
        name: values.name,
      }) : null;
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
          { required: true, message: `${t('Please enter {{field}}'), { field: t('name') }}` },
        ]}
      />
      <ProFormText
        name="typeName"
        label={t('type name')}
        disabled={!!props.id}
        rules={[
          { required: true, message: `${t('Please enter {{field}}'), { field: t('type name') }}` },
        ]}
      />
      <ProFormText
        name="arnPattern"
        label={t('expression')}
        disabled={!!props.id}
        rules={[
          { required: true, message: `${t('Please enter {{field}}'), { field: t('expression') }}` },
        ]}
      />
    </DrawerForm>
  );
};
