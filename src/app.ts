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
      name: 'seller',
      title: '商家平台',
      activePath: '/seller',
      loadScriptMode: 'import',
      entry: 'https://iceworks.oss-cn-hangzhou.aliyuncs.com/icestark/child-seller-ice-vite/index.html',
    },
    // 调试中
    // {
    //   name: 'lowcode',
    //   title: '低代码',
    //   activePath: '/lowcode',
    //   loadScriptMode: 'import',
    //   entry: 'http://localhost:5556/',
    // },
  ]),
  // icestark 提供的 AppRouter 组件的配置参数
  appRouter: {
    
  },
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
