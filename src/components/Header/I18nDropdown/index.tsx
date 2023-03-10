import React, { useState, useEffect } from "react";
import i18n from "@/i18n";
import { Dropdown } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";
import styles from "./index.module.css";
import store from "@/store";

const I18nDropdown: React.FC = () => {
  const [basisState, basisDispatcher] = store.useModel("basis");
  const [locale, setLocale] = useState("");

  const onMenuClick = (event: MenuInfo) => {
      basisDispatcher.updateLocale(event.key);
      updateLocale(event.key);
    },
    updateLocale = (key: String) => {
      const mItem = menu.items.find((item) => item.key === key);
      if (mItem) {
        i18n.changeLanguage(mItem.key);
        setLocale(mItem.label);
      }
    };

  const menu = {
    items: [
      {
        key: "zh-CN",
        label: "简体",
        onClick: onMenuClick,
      },
      {
        key: "en-US",
        label: "English",
        onClick: onMenuClick,
      },
    ],
  };

  useEffect(() => {
    updateLocale(basisState.locale || navigator.language);
  }, []);

  return (
    <Dropdown menu={menu}>
      <span className={`${styles.action} ${styles.account}`}>
        <span>{locale}</span>
      </span>
    </Dropdown>
  );
};

export default I18nDropdown;
