import { useRef, useState } from "react";
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormText,
  useToken,
} from "@ant-design/pro-components";
import { Card, message } from "antd";
import store from "@/store";
import { updatePassword } from "@/services/user";
import { useTranslation } from "react-i18next";
import { setLeavePromptWhen } from "@/components/LeavePrompt";

type FormValues = { oldPwd: string, newPwd: string, reNewPwd: string }

export default () => {
  const formRef = useRef<ProFormInstance>(),
    { t } = useTranslation(),
    { token } = useToken(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [, basisDispatcher] = store.useModel("basis");

  setLeavePromptWhen(saveDisabled)

  const
    getRequest = async () => {
      setSaveLoading(false)
      setSaveDisabled(true)
      return {}
    },
    onValuesChange = () => {
      setSaveDisabled(false)
    },
    onFinish = async (values: FormValues) => {
      setSaveLoading(true)
      const result = await updatePassword(values.oldPwd, values.newPwd)
      if (result) {
        message.success(t('submit success'));
        await basisDispatcher.logout()
        setSaveDisabled(true)
      }
      setSaveLoading(false)
    }


  return (
    <PageContainer
      header={{
        title: t("Change password"),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t("Individual center"), },
            { title: t('security setting'), },
            { title: t('Change password'), },
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
              resetText: t('reset')
            },
            submitButtonProps: {
              loading: saveLoading,
              disabled: saveDisabled,
            }
          }}
          onFinish={onFinish}
          onReset={getRequest}
          request={getRequest}
          onValuesChange={onValuesChange}
        >
          <ProFormText.Password
            width="lg"
            name="oldPwd"
            label={t("old password")}
            placeholder={`${t("Please enter {{field}}", { field: t("old password") })}`}
            rules={[
              {
                required: true,
                message: `${t("Please enter {{field}}", { field: t("old password") })}`,
              },
            ]}
          />
          <ProFormText.Password
            width="lg"
            name="newPwd"
            label={t("new password")}
            placeholder={`${t("Please enter {{field}}", { field: t("new password") })}`}
            rules={[
              {
                required: true,
                message: `${t("Please enter {{field}}", { field: t("new password") })}`,
              },
            ]}
          />
          <ProFormText.Password
            name="reNewPwd"
            width="lg"
            label={t('confirm new password')}
            placeholder={`${t("Please enter {{field}}", { field: t("confirm new password") })}`}
            rules={[
              {
                required: true,
                message: `${t("Please enter {{field}}", { field: t("confirm new password") })}`,
              },
              {
                validator: (rule, value) => {
                  if (value != formRef?.current?.getFieldValue("newPwd")) {
                    return Promise.reject(t("confirm the new password must be the same as the new password"));
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
