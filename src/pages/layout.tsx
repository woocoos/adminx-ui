import store from "@/store";
import { useEffect, useState } from "react";
import { userMenuList } from "@/components/FrameworkLayout/menuConfig";
import ProLayout from "@ant-design/pro-layout";
import AvatarDropdown from "@/components/Header/AvatarDropdown";
import I18nDropdown from "@/components/Header/I18nDropdown";
import DarkMode from "@/components/Header/DarkMode";
import styles from "./layout.module.css";
import logo from "@/assets/logo.png";
import defaultAvatar from "@/assets/images/default-avatar.png";
import { Outlet } from "@ice/runtime";
import i18n from "@/i18n";
import { ProConfigProvider, useToken } from "@ant-design/pro-components";
import LeavePrompt, { Link } from "@/components/LeavePrompt";
import { AliveScope } from 'react-activation'

export default function Layout() {
  const [basisState] = store.useModel("basis"),
    { token } = useToken();

  useEffect(() => {
    i18n.changeLanguage(basisState.locale);
  }, [basisState.locale])


  return ["/login"].includes(location.pathname) ? <Outlet /> :
    <ProConfigProvider
      dark={basisState.darkMode}
    >
      <LeavePrompt />
      <ProLayout
        token={{
          sider: {
            colorMenuBackground: basisState.darkMode ? "linear-gradient(#141414, #000000 28%)" : token.colorBgContainer
          }
        }}
        className={styles.layout}
        menu={{
          locale: true,
          request: userMenuList
        }}
        fixSiderbar
        logo={<img src={logo} alt="logo" />}
        title="Adminx"
        location={{
          pathname: location.pathname,
        }}
        layout="mix"
        rightContentRender={() => (
          <>
            <I18nDropdown />
            <AvatarDropdown
              avatar={defaultAvatar}
              name={basisState.user?.displayName || ""}
            />
            <DarkMode />
          </>
        )}
        menuItemRender={(item, defaultDom) => item.path ? <Link to={item.path}>{defaultDom}</Link> : defaultDom}
      >
        <AliveScope>
          <Outlet />
        </AliveScope>
      </ProLayout>
    </ProConfigProvider>
}
