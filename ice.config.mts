import { defineConfig } from '@ice/app';
import request from '@ice/plugin-request';
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';
import icestark from '@ice/plugin-icestark';

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
export default defineConfig(() => ({
  ssr: false,
  ssg: false,
  minify,
  plugins: [
    request(),
    store(),
    auth(),
    icestark({ type: 'framework' }),
  ],
  compileDependencies: false,
}));
