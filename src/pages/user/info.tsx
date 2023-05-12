import { useState } from 'react';
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
  useToken,
} from "@ant-design/pro-components";
import { Card, message } from "antd";
import { User, getUserInfo, updateUserInfo } from "@/services/user";
import store from "@/store";
import { useTranslation } from "react-i18next";
import { setLeavePromptWhen } from '@/components/LeavePrompt';

export default () => {
  const
    { t } = useTranslation(),
    { token } = useToken(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [basisState, basisDispatcher] = store.useModel("basis");

  setLeavePromptWhen(saveDisabled)

  const
    getRequest = async () => {
      setSaveLoading(false)
      setSaveDisabled(true)
      if (basisState.user?.id) {
        const userInfo = await getUserInfo(basisState.user.id)
        return userInfo || {}
      }
      return {}
    },
    onValuesChange = () => {
      setSaveDisabled(false)
    },
    onFinish = async (values: User) => {
      if (basisState.user?.id) {
        setSaveLoading(true)
        const userInfo = await updateUserInfo(basisState.user.id, values)
        if (userInfo?.id) {
          message.success(t('submit success'));
          await basisDispatcher.saveUser(userInfo)
          setSaveDisabled(true)
        }
        setSaveLoading(false)
      }
    }

  return (
    <PageContainer
      header={{
        title: t("Basic information"),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t("Individual center"), },
            { title: t("Basic information"), },
          ],
        },
      }}
    >
      <Card bordered={false}>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: t('submit'),
              resetText: t('reset')
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
            width="lg"
            name="displayName"
            label={t("display name")}
            placeholder={`${t("Please enter {{field}}", { field: t("display name") })}`}
            rules={[
              {
                required: true,
                message: `${t("Please enter {{field}}", { field: t("display name") })}`,
              },
            ]}
          />
          <ProFormText
            width="lg"
            name="email"
            label={t("email")}
            placeholder={`${t("Please enter {{field}}", { field: t("email") })}`}
            rules={[
              {
                required: true,
                message: `${t("Please enter {{field}}", { field: t("email") })}`,
              },
              {
                type: "email",
                message: `${t("formal error")}`,
              },
            ]}
          />
          <ProFormText
            name="mobile"
            width="lg"
            label={t("mobile")}
            placeholder={`${t("Please enter {{field}}", { field: t("mobile") })}`}
          />
          <ProFormTextArea
            name="comments"
            width="lg"
            label={t("introduction")}
            placeholder={`${t("Please enter {{field}}", { field: t("introduction") })}`}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
