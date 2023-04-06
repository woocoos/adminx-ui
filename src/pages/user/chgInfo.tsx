import { useState } from 'react';
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
  useToken,
} from "@ant-design/pro-components";
import { Card, message } from "antd";
import { getUserInfo, updateUserInfo } from "@/services/graphql";
import store from "@/store";

export default () => {
  const
    { token } = useToken(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [basisState, basisDispatcher] = store.useModel("basis");

  const
    getRequest = async () => {
      setSaveLoading(false)
      setSaveDisabled(true)
      const userInfo = await getUserInfo(basisState.user.id)
      return userInfo || {}
    },
    onValuesChange = () => {
      setSaveDisabled(false)
    },
    onFinish = async (values) => {
      setSaveLoading(true)
      const userInfo = await updateUserInfo(basisState.user.id, values)
      if (userInfo?.id) {
        message.success("提交成功");
        await basisDispatcher.saveUser(userInfo)
        setSaveDisabled(true)
      }
      setSaveLoading(false)
    }

  return (
    <PageContainer
      header={{
        title: "基本信息",
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            {
              path: "",
              title: "个人中心",
            },
            {
              path: "",
              title: "基本信息",
            },
          ],
        },
      }}
    >
      <Card bordered={false}>
        <ProForm
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
          <ProFormText
            width="lg"
            name="displayName"
            label="显示名称"
            placeholder="请输入显示名称"
            rules={[
              {
                required: true,
                message: "请输入显示名称",
              },
            ]}
          />
          <ProFormText
            width="lg"
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            rules={[
              {
                required: true,
                message: "请输入邮箱",
              },
              {
                type: "email",
                message: "邮箱格式错误",
              },
            ]}
          />
          <ProFormText
            name="mobile"
            width="lg"
            label="手机"
            placeholder="请输入手机"
          />
          <ProFormTextArea
            name="comments"
            width="lg"
            label="个人简介"
            placeholder="请输入个人简介"
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
