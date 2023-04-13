import { definePageConfig } from "ice";
import { message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ProFormText, LoginForm } from "@ant-design/pro-form";
import styles from "./index.module.css";
import type { LoginParams, LoginRes } from "@/services/basis";
import { login } from "@/services/basis";
import { User, getUserInfo } from "@/services/user";
import store from "@/store";
import logo from "@/assets/logo.png";
import Sha256 from "crypto-js/sha256";

export default () => {
  const [, basisDispatcher] = store.useModel("basis");

  async function loginSuccess(result: LoginRes, user: User) {
    await basisDispatcher.login({ result, user })
    message.success("登录成功！");
    const urlParams = (new URL(window.location.href)).searchParams;
    location.replace(urlParams.get("redirect") || "/");
  }

  async function handleSubmit(values: LoginParams) {
    values.password = Sha256(values.password).toString();
    const result = await login(values);
    if (result.accessToken && result.user?.id) {
      const userInfo = await getUserInfo(
        `${result.user.id}`,
        ['loginProfile'],
        {
          "Authorization": `Bearer ${result.accessToken}`,
          "X-Tenant-ID": result.user?.domainId
        })
      if (userInfo?.id) {
        if (userInfo.loginProfile?.passwordReset) {
          // 需要强制设置新密码
        } else {
          await loginSuccess(result, userInfo)
          return true;
        }
      }
    }
    return false
  }

  return (
    <div className={styles.container}>
      <LoginForm
        title="Adminx Pro"
        logo={<img alt="logo" src={logo} />}
        subTitle="后台管理系统"
        initialValues={{
          username: "admin",
          password: "123456",
        }}
        onFinish={handleSubmit}
      >
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
        <ProFormText
          name="captcha"
          fieldProps={{
            size: "large",
            addonAfter: <img src={`/api/captcha?t=${Date.now()}`} height="32px" onClick={(e) => {
              const svgDom = e.target as HTMLImageElement
              svgDom.src = `/api/captcha?t=${Date.now()}`
            }} />,
          }}
          placeholder={"验证码"}
          rules={[
            {
              required: true,
              message: "请输入验证码!",
            },
          ]}
        />
        <div
          style={{
            marginBottom: 24,
          }}
        >
          {/* <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox> */}
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
