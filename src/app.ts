import { defineAppConfig, defineDataLoader, history } from "ice";
import { defineAuthConfig } from "@ice/plugin-auth/esm/types";
import { defineStoreConfig } from "@ice/plugin-store/esm/types";
import { defineRequestConfig } from "@ice/plugin-request/esm/types";
import { message } from 'antd';
import store from "@/store";
import "@/assets/styles/index.css"
import localStore from "@/pkg/localStore";
import { User, userPermissions } from "./services/user";
import { browserLanguage } from "./util";
import jwt_decode, { JwtPayload } from "jwt-decode";

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
  app: {
    rootId: 'app',
  },
}));

// 用来做初始化数据
export const dataLoader = defineDataLoader(async () => {
  let locale = await localStore.getItem<string>("locale"),
    token = await localStore.getItem<string>("token");

  const darkMode = await localStore.getItem<string>("darkMode"),
    compactMode = await localStore.getItem<string>("compactMode"),
    tenantId = await localStore.getItem<string>("tenantId"),
    user = await localStore.getItem<User>("user");

  if (token) {
    // 增加jwt判断token过期的处理
    try {
      const jwt = jwt_decode<JwtPayload>(token)
      if ((jwt.exp || 0) * 1000 < Date.now()) {
        token = ""
      }
    } catch (err) {
      token = ''
    }
  }
  if (!locale) {
    locale = browserLanguage()
  }

  return {
    basis: {
      locale,
      token,
      darkMode,
      compactMode,
      tenantId,
      user,
    },
  }
});

// 权限
export const authConfig = defineAuthConfig(async (appData) => {
  const { basis } = appData, initialAuth = {};
  // 判断路由权限
  if (!basis.token) {
    store.dispatch.basis.logout()
  } else {
    const ups = await userPermissions({}, {
      "Authorization": `Bearer ${basis.token}`,
      "X-Tenant-ID": basis.tenantId,
    });
    if (ups) {
      ups.forEach(item => {
        initialAuth[item.name] = true;
      })
    }
  }
  return {
    initialAuth
  }
});

// store数据项
export const storeConfig = defineStoreConfig(async (appData) => {
  const { basis } = appData;
  return {
    initialStates: {
      basis,
    },
  };
});

// 请求配置
export const requestConfig = defineRequestConfig(() => {
  return [
    {
      baseURL: "/api",
      interceptors: {
        request: {
          onConfig(config: any) {
            const basisState = store.getModelState('basis')
            if (!config.headers['Authorization'] && basisState.token) {
              config.headers['Authorization'] = `Bearer ${basisState.token}`
            }
            if (!config.headers['X-Tenant-ID'] && basisState.tenantId) {
              config.headers['X-Tenant-ID'] = basisState.tenantId
            }

            return config
          },
        },
        response: {
          onConfig(response) {
            if (response.status === 200 && response.data.errors) {
              // 提取第一个异常来展示
              if (response.data.errors?.[0]?.message) {
                message.error(response.data.errors?.[0]?.message)
              }
            }
            return response;
          },
          onError: (error) => {
            const errRes = error.response as any
            switch (errRes.status) {
              case 401:
                store.dispatch.basis.logout()
                break;
              case 403:
                message.error("无访问权限")
                break;
              case 404:
                message.error("找不到方法")
                break;
              case 500:
                message.error("服务端系统异常")
                break;
              default:
                if (errRes?.data?.errors?.[0]?.message) {
                  message.error(errRes?.data?.errors?.[0]?.message)
                } else {
                  message.error(errRes.statusText)
                }
            }
            // 请求出错：服务端返回错误状态码
            return error;
          },
        }
      },
    }
  ]
});

