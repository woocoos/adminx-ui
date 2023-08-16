import { useEffect, useState } from 'react';
import { PageContainer, ProForm, ProFormText, ProFormTextArea, useToken } from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { getUserInfo, updateUserInfo } from '@/services/adminx/user';
import store from '@/store';
import { useTranslation } from 'react-i18next';
import { User } from '@/generated/adminx/graphql';
import { updateFormat } from '@/util';
import UploadFiles from '@/components/UploadFiles';
import { useLeavePrompt } from '@knockout-js/layout';

export default () => {
  const
    { t } = useTranslation(),
    { token } = useToken(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [, setLeavePromptWhen] = useLeavePrompt(),
    [userInfo, setUserInfo] = useState<User>(),
    [userState, userDispatcher] = store.useModel('user');

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      if (userState.user?.id) {
        const result = await getUserInfo(userState.user.id);
        if (result?.id) {
          setUserInfo(result as User);
          return result;
        }
      }
      return {};
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values) => {
      if (userState.user?.id) {
        setSaveLoading(true);
        const result = await updateUserInfo(userState.user.id, updateFormat(values, userInfo || {}));
        if (result?.id) {
          message.success(t('submit_success'));
          await userDispatcher.saveUser(result as User);
          setSaveDisabled(true);
        }
        setSaveLoading(false);
      }
    };

  return (
    <PageContainer
      header={{
        title: t('basic_info'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('info_center') },
            { title: t('basic_info') },
          ],
        },
      }}
    >
      <Card bordered={false}>
        <ProForm
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
          <ProFormText
            name="avatarFileID"
          >
            <UploadFiles accept='.jpg,.png' />
          </ProFormText>
          <ProFormText
            width="lg"
            name="displayName"
            label={t('display_name')}
            placeholder={`${t('please_enter_display_name')}`}
            rules={[
              {
                required: true,
                message: `${t('please_enter_display_name')}`,
              },
            ]}
          />
          <ProFormText
            width="lg"
            name="email"
            label={t('email')}
            placeholder={`${t('please_enter_email')}`}
            rules={[
              {
                required: true,
                message: `${t('please_enter_email')}`,
              },
              {
                type: 'email',
                message: `${t('format_error')}`,
              },
            ]}
          />
          <ProFormText
            name="mobile"
            width="lg"
            label={t('mobile')}
            placeholder={`${t('please_enter_mobile')}`}
          />
          <ProFormTextArea
            name="comments"
            width="lg"
            label={t('introduction')}
            placeholder={`${t('please_enter_introduction')}`}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
