import { ProFormText, LoginForm, ProFormInstance } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { LoginRes, loginResetPassword } from '@/services/basis';
import { useRef, useState } from 'react';
import Sha256 from 'crypto-js/sha256';

export default (
  props: {
    stateToken: string;
    onSuccess: (result: LoginRes) => void;
  },
) => {
  const { t } = useTranslation(),
    formRef = useRef<ProFormInstance>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  const onFinish = async (values: { password: string }) => {
    setSaveLoading(true);
    const result = await loginResetPassword(props.stateToken, Sha256(values.password).toString());
    if (result && !result.errors) {
      props.onSuccess(result);
    }
    setSaveLoading(false);
    return false;
  };

  return (
    <LoginForm
      formRef={formRef}
      title={t('reset password')}
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
      onValuesChange={() => {
        setSaveDisabled(false);
      }}
      onFinish={onFinish}
    >
      <br />
      <ProFormText.Password
        name="password"
        label={t('new password')}
        placeholder={`${t('Please enter {{field}}', { field: t('new password') })}`}
        rules={[
          {
            required: true,
            message: `${t('Please enter {{field}}', { field: t('new password') })}`,
          },
        ]}
      />
      <ProFormText.Password
        name="reNewPwd"
        label={t('confirm new password')}
        placeholder={`${t('Please enter {{field}}', { field: t('confirm new password') })}`}
        rules={[
          {
            required: true,
            message: `${t('Please enter {{field}}', { field: t('confirm new password') })}`,
          },
          {
            validator: (rule, value) => {
              if (value != formRef?.current?.getFieldValue('password')) {
                return Promise.reject(t('confirm the new password must be the same as the new password'));
              }
              return Promise.resolve();
            },
          },
        ]}
      />
    </LoginForm>
  );
};
