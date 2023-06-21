import { User } from '@/__generated__/knockout/graphql';
import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { unbindMfa } from '@/services/basis';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Alert } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';


export default (props: {
  open: boolean;
  userInfo: User;
  onClose: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  setLeavePromptWhen(saveDisabled);

  const onFinish = async (values) => {
    setSaveLoading(true);
    const result = await unbindMfa(values.code);
    if (result) {
      props.onClose(true);
      setSaveDisabled(true);
    }
    setSaveLoading(false);
    return false;
  };

  return (<ModalForm
    title={`${t('unbind')} MFA`}
    open={props.open}
    width={500}
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
    onFinish={onFinish}
    onValuesChange={() => {
      setSaveDisabled(false);
    }}
    onOpenChange={(open) => {
      if (!open) {
        props.onClose();
      }
      setSaveDisabled(true);
    }}
  >
    <br />
    <Alert showIcon message={t('unbind_mfa_alert_msg')} />
    <br />
    <div style={{ width: '80%', margin: '0 auto' }}>
      <ProFormText
        name="code"
        label={t('security_code')}
        rules={[
          { required: true, message: `${t('please_enter_security_code')}` },
        ]}
      />
    </div>
    <br />
    <br />
    <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.45)' }}>{t('unbind_mfa_sub_text')}</div>
    <br />
    <br />
  </ModalForm>);
};
