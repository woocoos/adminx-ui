import { defineConfig } from '@ice/app';
import request from '@ice/plugin-request';
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';
import icestark from '@ice/plugin-icestark';
import antd from '@ice/plugin-antd';
import jsxPlus from '@ice/plugin-jsx-plus';

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
export default defineConfig(() => ({
  ssr: false,
  ssg: false,
  minify,
  postcss:{
    plugins:[]
  },
  routes: {
    ignoreFiles: [
      '**/components/**',   // 添加此配置忽略components被解析成路由组件
    ],
  },
  plugins: [
    request(),
    store(),
    auth(),
    jsxPlus(),
    icestark({ type: 'framework' }),
    antd({
      importStyle: false,
    }),
  ],
  proxy: {
    '/api/graphql': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
      pathRewrite: { '^/api' : '' },
    },
    '/api': {
      target: 'http://127.0.0.1:10070/',
      changeOrigin: true,
      pathRewrite: { '^/api' : '' },
    },
  },
  compileDependencies: false,
}));
