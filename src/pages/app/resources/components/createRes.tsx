import { getAppResInfo, updateAppRes } from '@/services/adminx/app/resource';
import { DrawerForm, ProFormText } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';

type ProFormData = {
  name: string;
  typeName?: string;
  arnPattern?: string;
};

export default (props: {
  open: boolean;
  title?: string;
  id?: string;
  appId: string;
  onClose: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
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
    onFinish = async (values: ProFormData) => {
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
          { required: true, message: `${t('please_enter_name')}` },
        ]}
      />
      <ProFormText
        name="typeName"
        label={t('type_name')}
        disabled={!!props.id}
        rules={[
          { required: true, message: `${t('please_enter_type_name')}` },
        ]}
      />
      <ProFormText
        name="arnPattern"
        label={t('expression')}
        disabled={!!props.id}
        rules={[
          { required: true, message: `${t('please_enter_expression')}` },
        ]}
      />
    </DrawerForm>
  );
};
