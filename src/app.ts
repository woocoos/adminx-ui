import { defineAppConfig, history, defineDataLoader } from "ice";
import { fetchUserInfo } from "./services/user";
import { defineAuthConfig } from "@ice/plugin-auth/esm/types";
import { defineStoreConfig } from "@ice/plugin-store/esm/types";
import { defineRequestConfig } from "@ice/plugin-request/esm/types";
import { defineFrameworkConfig } from '@ice/plugin-icestark/esm/types';
import FrameworkLayout from '@/components/FrameworkLayout';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
  app: {
    rootId: 'app',
  },
}));

export const icestark = defineFrameworkConfig(() => ({
  // 用于微应用全局的 Layout
  layout: FrameworkLayout,
  // 配置微应用信息，可为异步方法
  getApps: () => ([
    {
      name: 'lowcode',
      title: '低代码编辑引擎',
      activePath: '/lowcode',
      entry: 'http://localhost:5556/index.html',
      props: {
        // 后续用户信息带入
      }
    },
    {
      name: 'lowcode-preview',
      title: '低代码UI',
      activePath: '/lowcode-preview',
      entry: 'http://localhost:5556/preview.html',
      props: {
        // 后续用户信息带入
      }
    },
  ]),
  // icestark 提供的 AppRouter 组件的配置参数
  appRouter: {},
}));

export const authConfig = defineAuthConfig(async (appData) => {
  const { userInfo = {} } = appData;

  if (userInfo.error) {
    history?.push(`/login?redirect=${window.location.pathname}`);
  }

  return {
    initialAuth: {
      admin: userInfo.userType === "admin",
      user: userInfo.userType === "user",
    },
  };
});

export const storeConfig = defineStoreConfig(async (appData) => {
  const { userInfo = {} } = appData;
  return {
    initialStates: {
      user: {
        currentUser: userInfo,
      },
    },
  };
});

export const requestConfig = defineRequestConfig(() => ({
  baseURL: "/api",
}));

export const dataLoader = defineDataLoader(async () => {
  const userInfo = await getUserInfo();
  return {
    userInfo,
  };
});

async function getUserInfo() {
  try {
    const userInfo = await fetchUserInfo();
    return userInfo;
  } catch (error) {
    return {
      error,
    };
  }
}
