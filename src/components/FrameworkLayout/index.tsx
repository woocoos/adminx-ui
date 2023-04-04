import { history } from "ice";
import { AppLink } from "@ice/stark-app";
import { Button, ConfigProvider, theme } from "antd";
import { MappingAlgorithm } from "antd/es/config-provider/context";
import store from "@/store";
import { useEffect, useState } from "react";
import { asideMenuConfig } from "@/components/FrameworkLayout/menuConfig";
import ProLayout from "@ant-design/pro-layout";
import AvatarDropdown from "@/components/Header/AvatarDropdown";
import I18nDropdown from "@/components/Header/I18nDropdown";
import DarkMode from "@/components/Header/DarkMode";
import CompactMode from "@/components/Header/CompactMode";
import styles from "./layout.module.css";
import logo from "@/assets/logo.png";
import defaultAvatar from "@/assets/images/default-avatar.png";

const Link = ({ to, children }) => {
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        history?.push(to);
      }}
    >
      {children}
    </a>
  );
};

export default function FrameworkLayout(props: {
  children: React.ReactNode;
  pathname: string;
  appLeave: { path: string };
  appEnter: { path: string };
}) {
  const { pathname, children, appLeave, appEnter } = props;
  const [basisState] = store.useModel("basis");

  // useEffect(() => {
  //   console.log("== app leave ==", appLeave);
  // }, [appLeave]);

  // useEffect(() => {
  //   console.log("== app enter ==", appEnter);
  // }, [appEnter]);

  const [algorithm, setAlgorithm] = useState<MappingAlgorithm[]>([
    theme.defaultAlgorithm,
  ]);
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

  if (["/login"].includes(pathname)) {
    return <>{children}</>;
  }

  if (pathname.split("/").includes("lowcode")) {
    return <>{children}</>;
  }
  return (
    <ConfigProvider
      theme={{
        algorithm: algorithm,
      }}
    >
      <ProLayout
        menu={{ defaultOpenAll: true }}
        className={styles.layout}
        logo={<img src={logo} alt="logo" />}
        title="Adminx"
        location={{
          pathname: pathname,
        }}
        locale={basisState.locale}
        layout="mix"
        rightContentRender={() => (
          <>
            <I18nDropdown />
            <AvatarDropdown
              avatar={basisState.user?.avatar || defaultAvatar}
              name={basisState.user?.displayName || ""}
            />
            <DarkMode />
            {/* <CompactMode /> */}
          </>
        )}
        menuDataRender={() => asideMenuConfig}
        menuItemRender={(item, defaultDom) => {
          if (!item.path) {
            return defaultDom;
          }
          const NavLink = item.framework ? Link : AppLink;

          return <NavLink to={item.path}>{defaultDom}</NavLink>;
        }}
      >
        {children}
      </ProLayout>
    </ConfigProvider>
  );
}
