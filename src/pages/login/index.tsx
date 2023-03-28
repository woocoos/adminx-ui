import React, { useState } from "react";
import { definePageConfig, useAuth } from "ice";
import { message, Alert } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ProFormCheckbox, ProFormText, LoginForm } from "@ant-design/pro-form";
import styles from "./index.module.css";
import type { LoginParams, LoginRes } from "@/services/user";
import { login } from "@/services/user";
import store from "@/store";
import logo from "@/assets/logo.png";
import Sha256 from "crypto-js/sha256";

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

export default () => {
  const [loginResult, setLoginResult] = useState<LoginRes>();
  const [, userDispatcher] = store.useModel("user");

  async function handleSubmit(values: LoginParams) {
    try {
      values.password = Sha256(values.password).toString();
      const result = await login(values);
      if (result.accessToken) {
        message.success("登录成功！");
        userDispatcher.updateLoginRes(result);
        const urlParams = new URL(window.location.href).searchParams;
        location.href = urlParams.get("redirect") || "/";
        return;
      }
      // 如果失败去设置用户错误信息，显示提示信息
      setLoginResult(result);
    } catch (error) {
      message.error("登录失败，请重试！");
      console.log(error);
    }
  }
  return (
    <div className={styles.container}>
      <LoginForm
        title="Adminx Pro"
        logo={<img alt="logo" src={logo} />}
        subTitle="后台管理系统"
        initialValues={{
          username: "woocoo.com",
          password: "123456",
        }}
        onFinish={async (values) => {
          await handleSubmit(values as LoginParams);
        }}
      >
        {/* {loginResult.success === false && (
          <LoginMessage content="账户或密码错误(admin/123456)" />
        )} */}
        <ProFormText
          name="username"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined className={"prefixIcon"} />,
          }}
          placeholder={"用户名: admin or user"}
          rules={[
            {
              required: true,
              message: "请输入用户名!",
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined className={"prefixIcon"} />,
          }}
          placeholder={"密码: ice"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: "right",
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginForm>
    </div>
  );
};

export const pageConfig = definePageConfig(() => {
  return {
    title: "登录",
  };
});
