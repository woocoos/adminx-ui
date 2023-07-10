import { defineConfig } from '@ice/app';
import request from '@ice/plugin-request';
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';
import antd from '@ice/plugin-antd';
import jsxPlus from '@ice/plugin-jsx-plus';
import icestark from '@ice/plugin-icestark';

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false,
  port = process.env.PORT,
  isNoMock = process.argv.includes('--no-mock'),
  mockItems = process.env.ICE_MOCK_ITEMS?.split(',') as string[],
  isMockItems = {
    adminx: mockItems.includes('adminx') && !isNoMock,
    files: mockItems.includes('files') && !isNoMock,
    auth: mockItems.includes('auth') && !isNoMock,
  };

export default defineConfig(() => ({
  ssg: false,
  ssr: false,
  minify,
  codeSplitting: 'page',
  devPublicPath: process.env.ICE_DEV_PUBLIC_PATH,
  publicPath: process.env.ICE_BUILD_PUBLIC_PATH,
  routes: {
    ignoreFiles: [
      '**/components/**',   // 添加此配置忽略components被解析成路由组件
    ],
  },
  plugins: [
    icestark({ type: 'child' }),
    request(),
    store(),
    auth(),
    jsxPlus(),
    antd({
      importStyle: false,
    }),
  ],
  proxy: {
    '/api-adminx': {
      target: isMockItems.adminx ? `http://localhost:${port}` : process.env.ICE_PROXY_ADMINX,
      changeOrigin: true,
      pathRewrite: { '^/api-adminx': isMockItems.adminx ? '/mock-api-adminx' : '' },
    },
    '/api-files': {
      target: isMockItems.files ? `http://localhost:${port}` : process.env.ICE_PROXY_FILES,
      changeOrigin: true,
      pathRewrite: { '^/api-files': isMockItems.files ? '/mock-api-files' : '' },
    },
    '/api-auth': {
      target: isMockItems.auth ? `http://localhost:${port}` : process.env.ICE_PROXY_AUTH,
      changeOrigin: true,
      pathRewrite: { '^/api-auth': isMockItems.auth ? '/mock-api-auth' : '' },
    },
  },
}));

