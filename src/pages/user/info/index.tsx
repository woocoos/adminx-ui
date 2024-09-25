import { useEffect, useState } from 'react';
import { PageContainer, ProForm, ProFormText, ProFormTextArea, useToken, ProFormSelect } from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { getUserInfo, updateUserInfo } from '@/services/adminx/user';
import store from '@/store';
import { useTranslation } from 'react-i18next';
import { User, UserGender } from '@/generated/adminx/graphql';
import { updateFormat } from '@/util';
import { UploadAvatar, useLeavePrompt } from '@knockout-js/layout';
import { definePageConfig } from 'ice';

const ICE_APP_CODE = process.env.ICE_APP_CODE ?? '';

type FormUser = User & {
  email?: string | null;
  mobile?: string | null;
};

export default () => {
  const
    { t } = useTranslation(),
    { token } = useToken(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [, setLeavePromptWhen] = useLeavePrompt(),
    [userInfo, setUserInfo] = useState<FormUser>(),
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
          let formUser = toFormUser(result as User)
          setUserInfo(formUser);
          return formUser;
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
        const result = await updateUserInfo(
          userState.user.id,
          updateFormat(values, userInfo || {}, ["email", "mobile"]),
          updateFormat({ email: values.email, mobile: values.mobile }, userInfo?.basicAddr || {}),
        );
        if (result?.id) {
          message.success(t('submit_success'));
          let formUser = toFormUser(result as User)
          setUserInfo(formUser);
          await userDispatcher.saveUser(result as User);
          setSaveDisabled(true);
        }
        setSaveLoading(false);
      }
    };

  const toFormUser = (user: User) => {
    return {
      ...user,
      email: user.basicAddr?.email,
      mobile: user.basicAddr?.mobile,
    } as FormUser;
  }

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
            name="avatar"
          >
            <UploadAvatar accept="image/*" directory={`${userState.tenantId}/${ICE_APP_CODE}/avatar`} />
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
          <ProFormSelect
            name="gender"
            width="lg"
            label={t('gender')}
            placeholder={`${t('please_enter_gender')}`}
            options={[
              { value: UserGender.Privacy, label: t('privacy') },
              { value: UserGender.Male, label: t('male') },
              { value: UserGender.Female, label: t('female') },
            ]}
            rules={[
              {
                required: true,
                message: `${t('please_enter_gender')}`,
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

export const pageConfig = definePageConfig(() => ({
  auth: ['/user/info'],
}));
