import React, { useState, useEffect } from "react";
import { Switch } from "antd";
import store from "@/store";

const I18nDropdown: React.FC = () => {
  const [basisState, basisDispatcher] = store.useModel("basis");

  return (
    <Switch
      style={{ margin: "0 12px" }}
      checkedChildren="默认"
      unCheckedChildren="紧凑"
      defaultChecked={!basisState.compactMode}
      onChange={(checked) => {
        basisDispatcher.updateCompactMode(!checked);
      }}
    />
  );
};

export default I18nDropdown;
