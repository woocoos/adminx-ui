import React, { useState, useEffect } from "react";
import { Switch } from "antd";
import store from "@/store";

const I18nDropdown: React.FC = () => {
  const [basisState, basisDispatcher] = store.useModel("basis");

  return (
    <Switch
      style={{ margin: "0 12px" }}
      checkedChildren="亮"
      unCheckedChildren="暗"
      defaultChecked={!basisState.darkMode}
      onChange={(checked) => {
        basisDispatcher.updateDarkMode(!checked);
      }}
    />
  );
};

export default I18nDropdown;
