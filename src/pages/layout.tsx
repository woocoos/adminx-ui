import store from '@/store';
import { useEffect } from 'react';
import { userMenuList } from '@/components/FrameworkLayout/menuConfig';
import AvatarDropdown from '@/components/Header/AvatarDropdown';
import I18nDropdown from '@/components/Header/I18nDropdown';
import DarkMode from '@/components/Header/DarkMode';
import styles from './layout.module.css';
import logo from '@/assets/images/woocoo.png';
import defaultAvatar from '@/assets/images/default-avatar.png';
import { Outlet } from '@ice/runtime';
import i18n from '@/i18n';
import { ProLayout, ProConfigProvider, useToken } from '@ant-design/pro-components';
import LeavePrompt, { Link } from '@/components/LeavePrompt';
import { AliveScope } from 'react-activation';
import TenantDropdown from '@/components/Header/TenantDropdown';
import { monitorKeyChange } from '@/pkg/localStore';
import { Client, Provider, cacheExchange, errorExchange, fetchExchange, mapExchange } from 'urql';


export default function Layout() {
  const [basisState, basisDispatcher] = store.useModel('basis'),
    { token } = useToken();

  useEffect(() => {
    i18n.changeLanguage(basisState.locale);
  }, [basisState.locale]);


  // useEffect(() => {
  //   monitorKeyChange([
  //     {
  //       key: 'tenantId',
  //       onChange(value) {
  //         basisDispatcher.updateTenantId(value);
  //       },
  //     },
  //     {
  //       key: 'token',
  //       onChange(value) {
  //         basisDispatcher.updateToken(value);
  //       },
  //     },
  //     {
  //       key: 'user',
  //       onChange(value) {
  //         basisDispatcher.updateUser(value);
  //       },
  //     },
  //     {
  //       key: 'locale',
  //       onChange(value) {
  //         basisDispatcher.updateLocale(value);
  //       },
  //     },
  //   ]);
  // }, []);


  const client = new Client({
    url: '/api/graphql/query',
    requestPolicy: "cache-and-network",
    fetchOptions: {
      headers: {
        "Authorization": `Bearer ${basisState.token}`,
        "X-Tenant-ID": basisState.tenantId,
      }
    },
    exchanges: [cacheExchange, fetchExchange, mapExchange({
      onResult: (result) => {
        console.log('onResult', result);
      },
      onError: (error, operation) => {
        console.log('onError', error, operation)
      }
    }), errorExchange({
      onResult: (result) => {
        console.log('--onResult', result);
      },
      onError: (error, operation) => {
        console.log('--onError', error, operation)
      }
    })],
  });

  return ['/login', '/login/retrievePassword'].includes(location.pathname) ? <Outlet />
    : <Provider value={client}>
      <ProConfigProvider dark={basisState.darkMode} >
        <LeavePrompt />
        <ProLayout
          token={{
            sider: {
              colorMenuBackground: basisState.darkMode ? 'linear-gradient(#141414, #000000 28%)' : token.colorBgContainer,
            },
          }}
          className={styles.layout}
          menu={{
            locale: true,
            request: userMenuList,
          }}
          fixSiderbar
          logo={<img src={logo} alt="logo" />}
          title="Adminx"
          location={{
            pathname: location.pathname,
          }}
          layout="mix"
          rightContentRender={() => (
            <>
              <I18nDropdown />
              <TenantDropdown />
              <AvatarDropdown
                avatar={defaultAvatar}
                name={basisState.user?.displayName || ''}
              />
              <DarkMode />
            </>
          )}
          menuItemRender={(item, defaultDom) => (item.path ? <Link to={item.path}>{defaultDom}</Link> : defaultDom)}
        >
          <AliveScope>
            <Outlet />
          </AliveScope>
        </ProLayout>
      </ProConfigProvider>
    </Provider>;
}
