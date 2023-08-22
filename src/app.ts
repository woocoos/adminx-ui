import { defineAppConfig, defineDataLoader } from 'ice';
import { defineAuthConfig } from '@ice/plugin-auth/esm/types';
import { defineStoreConfig } from '@ice/plugin-store/esm/types';
import { defineRequestConfig } from '@ice/plugin-request/esm/types';
import { defineUrqlConfig, requestInterceptor } from "@knockout-js/ice-urql/types";
import store from '@/store';
import '@/assets/styles/index.css';
import { getItem, removeItem } from '@/pkg/localStore';
import { browserLanguage } from './util';
import jwtDcode, { JwtPayload } from 'jwt-decode';
import { User } from './generated/adminx/graphql';
import { defineChildConfig } from '@ice/plugin-icestark/types';
import { isInIcestark } from '@ice/stark-app';
import { userPermissions } from '@knockout-js/api';
import { logout, parseSpm } from './services/auth';

const ICE_API_ADMINX_PREFIX = process.env.ICE_API_ADMINX_PREFIX ?? '/api-adminx',
  ICE_API_ADMINX = process.env.ICE_API_ADMINX ?? `${ICE_API_ADMINX_PREFIX}/graphql/query`,
  ICE_API_AUTH_PREFIX = process.env.ICE_API_AUTH_PREFIX ?? '/api-auth',
  ICE_APP_CODE = process.env.ICE_APP_CODE ?? 'resource',
  ICE_LOGIN_URL = process.env.ICE_LOGIN_URL ?? '/login',
  ICE_SIGN_CID = process.env.ICE_SIGN_CID ?? `sign_cid=${ICE_APP_CODE}`;

export const icestark = defineChildConfig(() => ({
  mount: () => {
    // 在微应用挂载前执行
  },
  unmount: () => {
    // 在微应用卸载后执行
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
  if (!isInIcestark()) {
    if (document.cookie.indexOf(ICE_SIGN_CID) === -1) {
      removeItem('token')
      removeItem('refreshToken')
    }
    document.cookie = ICE_SIGN_CID
  }
  const spmData = await parseSpm()
  let locale = getItem<string>('locale'),
    token = spmData.tenantId ?? getItem<string>('token'),
    refreshToken = spmData.refreshToken ?? getItem<string>('refreshToken'),
    darkMode = getItem<string>('darkMode'),
    compactMode = getItem<string>('compactMode'),
    tenantId = spmData.tenantId ?? getItem<string>('tenantId'),
    user = spmData.user ?? getItem<User>('user');

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
              token, tenantId, refreshToken
            }
          },
          setStateToken: (newToken) => {
            store.dispatch.user.updateToken(newToken)
          }
        },
        login: ICE_LOGIN_URL,
        refreshApi: `${ICE_API_AUTH_PREFIX}/login/refresh-token`
      }
    }
  },
])


// 权限
export const authConfig = defineAuthConfig(async (appData) => {
  const { user } = appData,
    initialAuth = {};
  // 判断路由权限
  if (user.token) {
    const ups = await userPermissions(ICE_APP_CODE, {
      Authorization: `Bearer ${user.token}`,
      'X-Tenant-ID': user.tenantId,
    });
    if (ups) {
      ups.forEach(item => {
        if (item) {
          initialAuth[item.name] = true;
        }
      });
    }
  } else {
    logout();
  }
  return {
    initialAuth,
  };
});

// store数据项
export const storeConfig = defineStoreConfig(async (appData) => {
  const { app, user } = appData;
  return {
    initialStates: {
      app,
      user,
    },
  };
});

// 请求配置
export const requestConfig = defineRequestConfig(() => {
  return [
    {
      interceptors: requestInterceptor({
        store: {
          getState: () => {
            const { token, tenantId } = store.getModelState('user')
            return {
              token, tenantId
            }
          },
        },
        login: ICE_LOGIN_URL,
      })
    },
  ];
});

