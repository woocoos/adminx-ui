import { useState } from 'react';
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
  useToken,
} from "@ant-design/pro-components";
import { Card, message } from "antd";
import { graphqlApi } from "@/services/graphql";
import store from "@/store";
import { gid } from "@/util";

interface UserChgInfo {
  displayName: string
  email: string
  mobile: string
  comments: string
}

export default () => {
  const
    { token } = useToken(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [basisState, basisDispatcher] = store.useModel("basis");

  const
    getRequest = async () => {
      const userInfo = await graphqlApi(
        `query{
          node(id:"${gid("user", basisState.user.id)}"){
            ... on User{
              id,displayName,email,mobile,comments
            }
          }
        }`
      )
      setSaveLoading(false)
      setSaveDisabled(true)
      return userInfo?.data?.node
    },
    onValuesChange = () => {
      setSaveDisabled(false)
    },
    onFinish = async (values: UserChgInfo) => {
      setSaveLoading(true)
      const result = await graphqlApi(
        `mutation updateUser($input: UpdateUserInput!){
          action:updateUser(userID:"${basisState.user.id}",input:$input){
            id,displayName,email,mobile,comments
          }
        }`, { input: values }
      )
      if (result?.data?.action?.id) {
        message.success("提交成功");
        await basisDispatcher.saveUser(result.data.action)
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
        <ProForm<UserChgInfo>
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
