import { Outlet, Link, useLocation } from "ice";
import ProLayout from "@ant-design/pro-layout";
import { asideMenuConfig } from "@/menuConfig";
import AvatarDropdown from "@/components/Header/AvatarDropdown";
import I18nDropdown from "@/components/Header/I18nDropdown";
import store from "@/store";
import logo from "@/assets/logo.png";
import styles from "./layout.module.css";

export default function Layout() {
  const location = useLocation();
  const [userState] = store.useModel("user");
  const [basisState] = store.useModel("basis");

  if (["/login"].includes(location.pathname)) {
    return <Outlet />;
  }
  
  return (
    <ProLayout
      menu={{ defaultOpenAll: true }}
      className={styles.layout}
      logo={<img src={logo} alt="logo" />}
      title="Adminx Pro"
      location={{
        pathname: location.pathname,
      }}
      locale={basisState.locale}
      layout="mix"
      rightContentRender={() => (
        <>
          <I18nDropdown />
          <AvatarDropdown
            avatar={userState.currentUser.avatar}
            name={userState.currentUser.name}
          />
        </>
      )}
      menuDataRender={() => asideMenuConfig}
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom;
        }
        return <Link to={item.path}>{defaultDom}</Link>;
      }}
    >
      <Outlet />
    </ProLayout>
  );
}
