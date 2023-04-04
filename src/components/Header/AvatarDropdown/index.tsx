import React, { useCallback } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Dropdown, Avatar } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";
import styles from "./index.module.css";
import { logout } from "@/services/basis";
import store from "@/store";

interface AvatarDropdownProps {
  name: string;
  avatar: string;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ name, avatar }) => {
  const [, basisDispatcher] = store.useModel("basis");



  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event;
    if (key === "logout") {
      // 即使退出接口异常前端也需要直接退出掉所以不需要同步处理
      logout();
      basisDispatcher.logout()
    }
  }, []);

  const menu = {
    items: [
      {
        key: "logout",
        label: "退出登录",
        icon: <LogoutOutlined />,
        onClick: onMenuClick,
        className: styles.menu,
      },
    ],
  };
  return (
    <Dropdown menu={menu}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={avatar}
          alt="avatar"
        />
        <span>{name}</span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;
