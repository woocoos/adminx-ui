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

type FormValues = { oldPwd: string, newPwd: string, reNewPwd: string }

export default () => {
  const formRef = useRef<ProFormInstance>(),
    { token } = useToken(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [, basisDispatcher] = store.useModel("basis");


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
        message.success("提交成功");
        await basisDispatcher.logout()
        setSaveDisabled(true)
      }
      setSaveLoading(false)
    }


  return (
    <PageContainer
      header={{
        title: "修改密码",
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            {
              path: "",
              title: "个人中心",
            },
            {
              path: "",
              title: "修改密码",
            },
          ],
        },
      }}
    >
      <Card bordered={false}>
        <ProForm
          formRef={formRef}
          submitter={{
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
            label="旧密码"
            placeholder="请输入旧密码"
            rules={[
              {
                required: true,
                message: "请输入旧密码",
              },
            ]}
          />
          <ProFormText.Password
            width="lg"
            name="newPwd"
            label="新密码"
            placeholder="请输入新密码"
            rules={[
              {
                required: true,
                message: "请输入新密码",
              },
            ]}
          />
          <ProFormText.Password
            name="reNewPwd"
            width="lg"
            label="确认新密码"
            placeholder="请输入确认新密码"
            rules={[
              {
                required: true,
                message: "请输入确认新密码",
              },
              {
                validator: (rule, value) => {
                  if (value != formRef?.current?.getFieldValue("newPwd")) {
                    return Promise.reject("确认新密码需与新密码一致");
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
