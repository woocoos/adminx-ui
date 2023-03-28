import { history } from "ice";
import { AppLink } from "@ice/stark-app";
import store from "@/store";
import { useEffect } from "react";
import { asideMenuConfig } from "@/components/FrameworkLayout/menuConfig";
import ProLayout from "@ant-design/pro-layout";
import AvatarDropdown from "@/components/Header/AvatarDropdown";
import I18nDropdown from "@/components/Header/I18nDropdown";
import styles from "./layout.module.css";
import logo from "@/assets/logo.png";

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
  const [userState] = store.useModel("user");
  const [basisState] = store.useModel("basis");

  useEffect(() => {
    console.log("== app leave ==", appLeave);
  }, [appLeave]);

  useEffect(() => {
    console.log("== app enter ==", appEnter);
  }, [appEnter]);

  if (["/login"].includes(pathname)) {
    return <>{children}</>;
  }

  if (pathname.split("/").includes("lowcode")) {
    return <>{children}</>;
  }
  return (
    <ProLayout
      menu={{ defaultOpenAll: true }}
      className={styles.layout}
      logo={<img src={logo} alt="logo" />}
      title="Adminx Pro"
      location={{
        pathname: pathname,
      }}
      locale={basisState.locale}
      layout="mix"
      rightContentRender={() => (
        <>
          <I18nDropdown />
          <AvatarDropdown
            avatar=""
            name={userState.currentUser?.user?.displayName || ""}
          />
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
  );
}
