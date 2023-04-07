import { defineAppConfig, defineDataLoader, history } from "ice";
import { defineAuthConfig } from "@ice/plugin-auth/esm/types";
import { defineStoreConfig } from "@ice/plugin-store/esm/types";
import { defineRequestConfig } from "@ice/plugin-request/esm/types";
import { message } from 'antd';
import store from "@/store";

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
  app: {
    rootId: 'app',
  },
}));

// 用来做初始化数据
export const dataLoader = defineDataLoader(async () => {
  const basis = await store.dispatch.basis.initBasis()

  return {
    basis,
  }
});

// 权限
export const authConfig = defineAuthConfig(async (appData) => {
  const { basis } = appData;
  // 判断路由权限
  if (!basis.token) {
    store.dispatch.basis.logout()
  }
  return {
    initialAuth: {
    }
  }
});

// 数据项
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
            return Promise.reject(error);
          },
        }
      },
    }
  ]
});

