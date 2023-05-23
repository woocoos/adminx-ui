import { userMenus } from "@/services/user";
import { formatTreeData } from "@/util";
import {
  SettingOutlined,
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
        path: "/user/info",
        framework: true,
      },
      {
        name: "安全设置",
        path: "/user/safety",
        framework: true,
      },
    ],
  },
  {
    name: "组织协作",
    icon: <TeamOutlined />,
    children: [
      {
        name: "部门管理",
        path: "/org/departments",
        framework: true,
      },
      {
        name: "用户管理",
        path: "/org/users",
        framework: true,
      },
      {
        name: "权限策略",
        path: "/org/policys",
        framework: true,
      },
      {
        name: "用户组",
        path: "/org/groups",
        framework: true,
      },
      {
        name: "角色",
        path: "/org/roles",
        framework: true,
      },
    ],
  },
  {
    name: "系统配置",
    icon: <SettingOutlined />,
    children: [
      {
        name: "组织管理",
        path: "/org/list",
        framework: true,
      },
      {
        name: "账户管理",
        path: "/account/list",
        framework: true,
      },
      {
        name: "应用管理",
        path: "/app/list",
        framework: true,
      },
    ],
  },
];

/**
 * 菜单的处理
 * @returns 
 */
export const userMenuList = async () => {
  const list: MenuDataItem[] = []
  if (process.env.ICE_CORE_MODE === 'development') {
    list.push(...asideMenuConfig)
  } else {
    if (process.env.ICE_APP_CODE) {
      const menus = await userMenus(process.env.ICE_APP_CODE)
      if (menus) {
        const menuList = menus.map(item => {
          const data: MenuDataItem = {
            id: item.id,
            name: item.name,
            icon: <i className={item.icon} />,
            parentId: item.parentID,
          }
          if (item.route) {
            data.path = item.route
          }
          return data
        })
        list.push(...formatTreeData(menuList, undefined, { key: 'id' }))
      }
    }
  }
  return list
}



