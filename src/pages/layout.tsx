import { Button, ConfigProvider, theme } from "antd";
import { MappingAlgorithm } from "antd/es/config-provider/context";
import store from "@/store";
import { useEffect, useState } from "react";
import { asideMenuConfig } from "@/components/FrameworkLayout/menuConfig";
import ProLayout from "@ant-design/pro-layout";
import AvatarDropdown from "@/components/Header/AvatarDropdown";
import I18nDropdown from "@/components/Header/I18nDropdown";
import DarkMode from "@/components/Header/DarkMode";
import styles from "./layout.module.css";
import logo from "@/assets/logo.png";
import defaultAvatar from "@/assets/images/default-avatar.png";
import { Link, Outlet } from "@ice/runtime";


export default function Layout() {
  const [basisState] = store.useModel("basis"),
    [algorithm, setAlgorithm] = useState<MappingAlgorithm[]>([
      theme.defaultAlgorithm,
    ]);

  const
    requestMenus = async () => {
      return asideMenuConfig
    }



  useEffect(() => {
    let algorithms: MappingAlgorithm[] = [];
    setAlgorithm([]);
    if (basisState.darkMode) {
      algorithms.push(theme.darkAlgorithm);
    } else {
      algorithms.push(theme.defaultAlgorithm);
    }
    if (basisState.compactMode) {
      algorithms.push(theme.compactAlgorithm);
    }
    setAlgorithm(algorithms);
  }, [basisState.darkMode, basisState.compactMode]);

  if (["/login"].includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: algorithm,
      }}
    >
      <ProLayout
        className={styles.layout}
        menu={{
          locale: true,
          request: requestMenus
        }}
        logo={<img src={logo} alt="logo" />}
        title="Adminx"
        location={{
          pathname: location.pathname,
        }}
        locale={basisState.locale}
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
        <Outlet />
      </ProLayout>
    </ConfigProvider>
  );
}
