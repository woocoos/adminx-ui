import store from '@/store';
import { useEffect, useState } from 'react';
import menuList from './menu.json';
import { history } from 'ice';
import defaultAvatar from '@/assets/images/default-avatar.png';
import { Outlet, useLocation } from '@ice/runtime';
import i18n from '@/i18n';
import { MenuDataItem, useToken } from '@ant-design/pro-components';
import { monitorKeyChange } from '@/pkg/localStore';
import { Layout, useLeavePrompt } from '@knockout-js/layout';
import { getAppDeployConfig, logout, urlSpm } from '@/services/auth';
import { createFromIconfontCN } from '@ant-design/icons';
import { parseStorageUrl } from '@knockout-js/api';

const ICE_APP_CODE = process.env.ICE_APP_CODE ?? '',
  NODE_ENV = process.env.NODE_ENV ?? '',
  IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4214307_8x56lkek9tu.js"
  })

export default () => {
  const [userState, userDispatcher] = store.useModel('user'),
    [appState, appDispatcher] = store.useModel('app'),
    [open, setOpen] = useState(false),
    [checkLeave] = useLeavePrompt(),
    location = useLocation(),
    { token } = useToken(),
    [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    i18n.changeLanguage(appState.locale);
  }, [appState.locale]);

  useEffect(() => {
    if (userState.user?.avatar) {
      parseStorageUrl(userState.user.avatar).then(result => {
        if (result) {
          setAvatar(result);
        }
      })
    }
    monitorKeyChange([
      {
        key: 'tenantId',
        onChange(value) {
          userDispatcher.updateTenantId(value);
        },
      },
      {
        key: 'token',
        onChange(value) {
          userDispatcher.updateToken(value);
        },
      },
      {
        key: 'user',
        onChange(value) {
          userDispatcher.updateUser(value);
        },
      },
      {
        key: 'locale',
        onChange(value) {
          appDispatcher.updateLocale(value);
        },
      },
    ]);
  }, []);

  return ['/login', '/login/retrievePassword'].includes(location.pathname) ? <Outlet />
    : <Layout
      appCode={ICE_APP_CODE}
      pathname={location.pathname}
      IconFont={IconFont}
      onClickMenuItem={async (item, isOpen) => {
        if (checkLeave()) {
          const url = item.path ?? ''
          if (isOpen) {
            window.open(await urlSpm(url));
          } else {
            history?.push(await urlSpm(url));
          }
        }
      }}
      tenantProps={{
        value: userState.tenantId,
        onChange: (value) => {
          userDispatcher.saveTenantId(value);
        },
      }}
      i18nProps={{
        onChange: (value) => {
          appDispatcher.updateLocale(value);
        },
      }}
      avatarProps={{
        avatar: avatar || defaultAvatar,
        name: userState.user?.displayName,
        onLogoutClick: () => {
          if (checkLeave()) {
            logout();
          }
        },
      }}
      themeSwitchProps={{
        value: appState.darkMode,
        onChange: (value) => {
          appDispatcher.updateDarkMode(value);
        },
      }}
      aggregateMenuProps={{
        open: open,
        onChangeOpen: setOpen,
        onClick: async (menuItem, app, isOpen) => {
          if (checkLeave()) {
            let url = menuItem.route ?? '';
            const appDeployConfig = await getAppDeployConfig();
            if (appDeployConfig) {
              const adcData = appDeployConfig.find(adc => adc.appCode == app.code);
              if (adcData) {
                url = `${adcData.entry}${menuItem.route}`.replaceAll('//', '/');
              }
            }
            if (url) {
              url = await urlSpm(url);
              if (isOpen) {
                window.open(url);
              } else {
                if (url.toLowerCase().startsWith("http")) {
                  window.location.href = url;
                } else {
                  history?.push(url);
                }
              }
            }
            setOpen(false);
          }
        }
      }}
      proLayoutProps={{
        token: {
          sider: {
            colorMenuBackground: appState.darkMode ? 'linear-gradient(#141414, #000000 28%)' : token.colorBgContainer,
          },
        },
        [NODE_ENV === 'development' ? 'menu' : '']: {
          request: () => {
            const list: MenuDataItem[] = [];
            menuList.forEach(item => {
              const menuItem: MenuDataItem = { name: item.name };
              if (item.icon) {
                menuItem.icon = <IconFont type={item.icon} />;
              }
              if (item.path) {
                menuItem.path = item.path;
              }
              if (item.children) {
                menuItem.children = item.children;
              }
              list.push(menuItem);
            })
            return list;
          }
        }
      }}
    >
      <Outlet />
    </Layout>;
}
