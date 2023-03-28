import {
  SettingOutlined,
  WarningOutlined,
  TeamOutlined,
  UserOutlined,
  ControlOutlined
} from "@ant-design/icons";
import type { MenuDataItem } from "@ant-design/pro-layout";

const asideMenuConfig: MenuDataItem[] = [
  {
    name: "工作台",
    path: "/",
    framework: true,
    icon: <ControlOutlined />,
  },
  {
    name: "个人中心",
    icon: <UserOutlined />,
    children: [
      {
        name: "基本信息",
        path: "/user/chginfo",
        framework: true,
      },
      {
        name: "修改密码",
        path: "/user/chgpwd",
        framework: true,
      },
    ],
  },
  {
    name: "组织协作",
    icon: <TeamOutlined />,
    children: [
      {
        name: "表单",
        path: "/form",
        framework: true,
      },
    ],
  },
  {
    name: "系统配置",
    icon: <SettingOutlined />,
    children: [
      {
        name: "列表",
        path: "/list",
        framework: true,
      },
    ],
  },
  // {
  //   name: "用户列表",
  //   path: "/lowcode-preview/user/list",
  //   icon: <SettingOutlined />,
  // },
];

export { asideMenuConfig };
