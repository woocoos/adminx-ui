import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
  useToken,
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
  const { token } = useToken();
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
            label="旧密码"
            placeholder="请输入旧密码"
            rules={[
              {
                required: true,
                message: "请输入旧密码",
              },
            ]}
          />
          <ProFormText
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
          <ProFormText
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
                  if (value != formRef?.current?.getFieldValue("newPwd"))
                    return Promise.reject("确认新密码需与新密码一致");
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
