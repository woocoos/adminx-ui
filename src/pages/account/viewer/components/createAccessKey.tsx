import { OauthClientGrantTypes } from '@/generated/adminx/graphql';
import { createAccessKey } from '@/services/adminx/user';
import { ProFormText, ModalForm } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';

type ProFormData = {
  name: string;
};

export default (props: {
  open: boolean;
  title: string;
  userId: string;
  onClose: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt();

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
      return {};
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      const result = await createAccessKey({
        name: values.name,
        grantTypes: OauthClientGrantTypes.ClientCredentials,
        userID: props.userId,
      })

      if (result?.id) {
        message.success(t('submit_success'));
        setSaveDisabled(true);
        props.onClose(true);
      }
      setSaveLoading(false);
      return false;
    };


  return (
    <ModalForm
      width={400}
      modalProps={{
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
    </ModalForm>
  );
};
