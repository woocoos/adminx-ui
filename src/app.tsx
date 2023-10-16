import { defineAppConfig, defineDataLoader } from 'ice';
import { defineAuthConfig } from '@ice/plugin-auth/esm/types';
import { defineStoreConfig } from '@ice/plugin-store/esm/types';
import { defineRequestConfig } from '@ice/plugin-request/esm/types';
import { defineUrqlConfig, requestInterceptor } from "@knockout-js/ice-urql/types";
import store from '@/store';
import '@/assets/styles/index.css';
import { getItem, removeItem, setItem } from '@/pkg/localStore';
import { browserLanguage } from './util';
import jwtDcode, { JwtPayload } from 'jwt-decode';
import { User } from './generated/adminx/graphql';
import { defineChildConfig } from '@ice/plugin-icestark/types';
import { isInIcestark } from '@ice/stark-app';
import { userPermissions, setFilesApi } from '@knockout-js/api';
import { logout, parseSpm } from './services/auth';
import { RequestHeaderAuthorizationMode, getRequestHeaderAuthorization } from '@knockout-js/ice-urql/request';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

const ICE_API_ADMINX = process.env.ICE_API_ADMINX ?? '',
  ICE_HTTP_SIGN = process.env.ICE_HTTP_SIGN ?? '',
  ICE_APP_CODE = process.env.ICE_APP_CODE ?? '',
  ICE_LOGIN_URL = process.env.ICE_LOGIN_URL ?? '',
  ICE_API_AUTH_PREFIX = process.env.ICE_API_AUTH_PREFIX ?? '',
  ICE_API_FILES_PREFIX = process.env.ICE_API_FILES_PREFIX ?? '';

export const icestark = defineChildConfig(() => ({
  mount: (data) => {
    // 在微应用挂载前执行
    if (data?.customProps) {
      setItem('locale', data.customProps.app.locale);
      setItem('darkMode', data.customProps.app.darkMode);
      setItem('compactMode', data.customProps.app.compactMode);
      setItem('token', data.customProps.user.token);
      setItem('refreshToken', data.customProps.user.refreshToken);
      setItem('tenantId', data.customProps.user.tenantId);
      setItem('user', data.customProps.user.user);
    }
  },
  unmount: () => {
    // 在微应用卸载后执行
    removeItem('token');
    removeItem('refreshToken');
    removeItem('tenantId');
  },
}));

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
  app: {
    rootId: 'app',
  },
}));

// 用来做初始化数据
export const dataLoader = defineDataLoader(async () => {
  setFilesApi(ICE_API_FILES_PREFIX);
  if (!isInIcestark()) {
    const signCid = `sign_cid=${ICE_APP_CODE}`;
    if (document.cookie.indexOf(signCid) === -1) {
      removeItem('token');
      removeItem('refreshToken');
    }
    document.cookie = signCid;
    await parseSpm()
  }
  let locale = getItem<string>('locale'),
    token = getItem<string>('token'),
    refreshToken = getItem<string>('refreshToken'),
    darkMode = getItem<string>('darkMode'),
    compactMode = getItem<string>('compactMode'),
    tenantId = getItem<string>('tenantId'),
    user = getItem<User>('user');

  if (token) {
    // 增加jwt判断token过期的处理
    try {
      const jwt = jwtDcode<JwtPayload>(token);
      if ((jwt.exp || 0) * 1000 < Date.now()) {
        token = '';
      }
    } catch (err) {
      token = '';
    }
  }
  if (!locale) {
    locale = browserLanguage();
  }

  return {
    app: {
      locale,
      darkMode,
      compactMode,
    },
    user: {
      token,
      refreshToken,
      tenantId,
      user,
    },
  };
});

// urql
export const urqlConfig = defineUrqlConfig([
  {
    instanceName: 'default',
    url: ICE_API_ADMINX,
    exchangeOpt: {
      authOpts: {
        store: {
          getState: () => {
            const { token, tenantId, refreshToken } = store.getModelState('user')
            return {
              token: token ?? getItem<string>('token'),
              tenantId: tenantId ?? getItem<string>('tenantId'),
              refreshToken: refreshToken ?? getItem<string>('refreshToken'),
            }
          },
          setStateToken: (newToken) => {
            store.dispatch.user.updateToken(newToken)
          }
        },
        beforeRefreshTime: 5 * 60 * 1000,
        headerMode: ICE_HTTP_SIGN === 'ko' ? RequestHeaderAuthorizationMode.KO : undefined,
        login: ICE_LOGIN_URL,
        refreshApi: `${ICE_API_AUTH_PREFIX ?? '/api-auth'}/login/refresh-token`
      }
    }
  },
])


// 权限
export const authConfig = defineAuthConfig(async (appData) => {
  const initialAuth = {},
    token = appData?.user?.token ?? getItem<string>('token'),
    tenantId = appData?.user?.tenantId ?? getItem<string>('tenantId');

  // 判断路由权限
  if (!['/login', '/login/retrievePassword'].includes(location.pathname)) {
    if (token) {
      const ups = await userPermissions(ICE_APP_CODE, {
        Authorization: getRequestHeaderAuthorization(token, ICE_HTTP_SIGN === 'ko' ? RequestHeaderAuthorizationMode.KO : undefined),
        'X-Tenant-ID': tenantId,
      });
      if (ups) {
        ups.forEach(item => {
          if (item) {
            initialAuth[item.name] = true;
          }
        });
      }
    } else {
      await logout();
    }
  }
  return {
    initialAuth,
    NoAuthFallback: () => {
      const { t } = useTranslation()
      return (
        <Result status="403"
          title="403"
          subTitle={t('page_403')} />
      )
    }
  };
});

// store数据项
export const storeConfig = defineStoreConfig(async (appData) => {
  return {
    initialStates: {
      user: appData?.user,
      app: appData?.app,
    },
  };
});

// 请求配置
export const requestConfig = defineRequestConfig({
  interceptors: requestInterceptor({
    store: {
      getState: () => {
        const { token, tenantId } = store.getModelState('user');
        return {
          token: token ?? getItem<string>('token'),
          tenantId: tenantId ?? getItem<string>('tenantId'),
        }
      },
    },
    headerMode: ICE_HTTP_SIGN === 'ko' ? RequestHeaderAuthorizationMode.KO : undefined,
    login: ICE_LOGIN_URL,
  })
});

