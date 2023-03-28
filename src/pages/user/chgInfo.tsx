import {
    PageContainer,
    ProForm,
    ProFormInstance,
    ProFormRadio,
    ProFormText,
  } from "@ant-design/pro-components";
  import { Card, Col, message, Row, Space } from "antd";
  import { useRef, useState } from "react";
  
  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  
  export default () => {
    const formRef = useRef<ProFormInstance>();
    return (
      <PageContainer
        header={{
          title: "基本信息",
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
          <ProForm<{
            oldPwd: string;
            newPwd?: string;
            reNewPwd?: string;
          }>
            formRef={formRef}
            submitter={{
              render: (props, doms) => {
                return doms;
              },
            }}
            onFinish={async (values) => {
              await waitTime(2000);
              console.log(values);
              message.success("提交成功");
            }}
            params={{}}
            request={async () => {
              await waitTime(100);
              return {
                oldPwd: "",
                newPwd: "",
                reNewPwd: "",
              };
            }}
          >
            <ProFormText
              width="lg"
              name="oldPwd"
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
              name="newPwd"
              label="邮箱"
              placeholder="请输入邮箱"
              rules={[
                {
                  required: true,
                  message: "请输入邮箱",
                },
              ]}
            />
            <ProFormText
              name="reNewPwd"
              width="lg"
              label="手机"
              placeholder="请输入手机"
            />
            <ProFormText
              name="reNewPwd"
              width="lg"
              label="个人简介"
              placeholder="请输入个人简介"
            />
          </ProForm>
        </Card>
      </PageContainer>
    );
  };
  