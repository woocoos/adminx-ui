import styles from "./index.module.css";
import store from "@/store";
import { useTranslation } from "react-i18next";
import Login from "./components/login";
import { LoginRes } from "@/services/basis";
import { useState } from "react";
import MfaVerify from "./components/mfaVerify";
import { Result, message } from "antd";
import ResetPassword from "./components/resetPassword";

export default () => {
  const { t } = useTranslation(),
    [res, setRes] = useState<LoginRes>(),
    [, basisDispatcher] = store.useModel("basis");

  async function loginSuccess(result: LoginRes) {
    setRes(result)
    if (result?.accessToken) {
      await basisDispatcher.login(result)
      message.success(t("login success"));
      const urlParams = (new URL(window.location.href)).searchParams;
      location.replace(urlParams.get("redirect") || "/");
    }
  }

  return (
    <div className={styles.container}>
      {
        !res ?
          <Login
            onSuccess={loginSuccess}
          /> : ''
      }
      {
        res?.stateToken && res?.callbackUrl === '/login/verify-factor' ?
          <MfaVerify
            stateToken={res.stateToken}
            onSuccess={loginSuccess}
          /> : ''
      }
      {
        res?.stateToken && res?.callbackUrl === '/login/reset-password' ?
          <ResetPassword
            stateToken={res.stateToken}
            onSuccess={loginSuccess}
          /> : ''
      }
      {
        res?.accessToken ?
          <Result
            status="success"
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          /> : ''
      }

    </div>
  );
};