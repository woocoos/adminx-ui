import { TableOutlined, WarningOutlined, FormOutlined, DashboardOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const asideMenuConfig: MenuDataItem[] = [
  {
    name: '工作台',
    path: '/',
    icon: <DashboardOutlined />,
    framework: true,
  },
  {
    name: '表单',
    path: '/form',
    icon: <FormOutlined />,
    framework: true,
  },
  {
    name: '列表',
    path: '/list',
    icon: <TableOutlined />,
    framework: true,
  },
  {
    name: '用户列表',
    path: '/lowcode-preview/user/list',
    icon: <TableOutlined />,
  },
];

export { asideMenuConfig };
