import { useRef, useState } from 'react';
import { PageContainer, ProForm, ProFormInstance, ProFormText, useToken } from '@ant-design/pro-components';
import { Card, message } from 'antd';
import store from '@/store';
import { updatePassword } from '@/services/adminx/user';
import { useTranslation } from 'react-i18next';
import { setLeavePromptWhen } from '@/components/LeavePrompt';

type FormValues = { oldPwd: string; newPwd: string; reNewPwd: string };

export default () => {
  const formRef = useRef<ProFormInstance>(),
    { t } = useTranslation(),
    { token } = useToken(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [, basisDispatcher] = store.useModel('basis');

  setLeavePromptWhen(saveDisabled);

  const
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      return {};
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: FormValues) => {
      setSaveLoading(true);
      const result = await updatePassword(values.oldPwd, values.newPwd);
      if (result === true) {
        message.success(t('submit_success'));
        await basisDispatcher.logout();
        setSaveDisabled(true);
      }
      setSaveLoading(false);
    };


  return (
    <PageContainer
      header={{
        title: t('change_pwd'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('info_center') },
            { title: t('security_setting') },
            { title: t('change_pwd') },
          ],
        },
      }}
    >
      <Card bordered={false}>
        <ProForm
          formRef={formRef}
          submitter={{
            searchConfig: {
              submitText: t('submit'),
              resetText: t('reset'),
            },
            submitButtonProps: {
              loading: saveLoading,
              disabled: saveDisabled,
            },
          }}
          onFinish={onFinish}
          onReset={getRequest}
          request={getRequest}
          onValuesChange={onValuesChange}
        >
          <ProFormText.Password
            width="lg"
            name="oldPwd"
            label={t('old_pwd')}
            placeholder={`${t('please_enter_old_pwd')}`}
            rules={[
              {
                required: true,
                message: `${t('please_enter_old_pwd')}`,
              },
            ]}
          />
          <ProFormText.Password
            width="lg"
            name="newPwd"
            label={t('new_pwd')}
            placeholder={`${t('please_enter_new_pwd')}`}
            rules={[
              {
                required: true,
                message: `${t('please_enter_new_pwd')}`,
              },
            ]}
          />
          <ProFormText.Password
            name="reNewPwd"
            width="lg"
            label={t('confirm_new_pwd')}
            placeholder={`${t('please_enter_confirm_new_pwd')}`}
            rules={[
              {
                required: true,
                message: `${t('please_enter_confirm_new_pwd')}`,
              },
              {
                validator: (rule, value) => {
                  if (value != formRef?.current?.getFieldValue('newPwd')) {
                    return Promise.reject(t('confirm_new_pwd_accord'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
