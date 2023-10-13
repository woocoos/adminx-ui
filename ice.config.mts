import { defineConfig } from '@ice/app';
import request from '@ice/plugin-request';
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';
import antd from '@ice/plugin-antd';
import jsxPlus from '@ice/plugin-jsx-plus';
import icestark from '@ice/plugin-icestark';
import urqlPlugin from '@knockout-js/ice-urql';

const ICE_BUILD_PUBLIC_PATH = process.env.ICE_BUILD_PUBLIC_PATH ?? '',
  ICE_DEV_PUBLIC_PATH = process.env.ICE_DEV_PUBLIC_PATH ?? '',
  NODE_ENV = process.env.NODE_ENV ?? '',
  ICE_PROXY_ADMINX = process.env.ICE_PROXY_ADMINX ?? '',
  ICE_STATIC_CDN = process.env.ICE_STATIC_CDN ?? '',
  ICE_PROXY_FILES = process.env.ICE_PROXY_FILES ?? '',
  ICE_PROXY_AUTH = process.env.ICE_PROXY_AUTH ?? '',
  ICE_API_ADMINX_PREFIX = process.env.ICE_API_ADMINX_PREFIX ?? '',
  ICE_API_AUTH_PREFIX = process.env.ICE_API_AUTH_PREFIX ?? '',
  ICE_API_FILES_PREFIX = process.env.ICE_API_FILES_PREFIX ?? '',
  minify = NODE_ENV === 'production' ? 'swc' : false;

const externals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'react-i18next': 'ReactI18next',
  'i18next': 'i18next',
  '@ant-design/pro-components': 'ProComponents',
  'antd': 'antd',
}

// The project config, see https://v3.ice.work/docs/guide/basic/config
export default defineConfig(() => ({
  ssg: false,
  ssr: false,
  minify,
  codeSplitting: 'page',
  devPublicPath: ICE_DEV_PUBLIC_PATH,
  publicPath: ICE_BUILD_PUBLIC_PATH,
  compileDependencies: NODE_ENV === 'development' ? [/@urql\/core/] : true,
  hash: NODE_ENV === 'development' ? false : true,
  routes: {
    ignoreFiles: [
      '**/components/**',   // 添加此配置忽略components被解析成路由组件
    ],
  },
  externals: ICE_STATIC_CDN ? externals : {},
  plugins: [
    icestark({ type: 'child' }),
    urqlPlugin(),
    request(),
    store(),
    auth(),
    jsxPlus(),
    antd({
      importStyle: false,
    }),
  ],
  proxy: {
    [ICE_API_ADMINX_PREFIX]: {
      target: ICE_PROXY_ADMINX,
      changeOrigin: true,
      pathRewrite: { [`^${ICE_API_ADMINX_PREFIX}`]: '' },
    },
    [ICE_API_AUTH_PREFIX]: {
      target: ICE_PROXY_AUTH,
      changeOrigin: true,
      pathRewrite: { [`^${ICE_API_AUTH_PREFIX}`]: '' },
    },
    [ICE_API_FILES_PREFIX]: {
      target: ICE_PROXY_FILES,
      changeOrigin: true,
      pathRewrite: { [`^${ICE_API_FILES_PREFIX}`]: '' },
    },
  },
}));

