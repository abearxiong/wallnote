import { defineConfig, ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import pkgs from './package.json' with { type: 'json' };
import basicSsl from '@vitejs/plugin-basic-ssl';

const version = pkgs.version || '0.0.1';

const isDev = process.env.NODE_ENV === 'development';

const basename = isDev ? '/' : '/apps/wallnote';
const plugins = []
const isWeb = false;
const isKevisual = true;

if(isWeb) {
  plugins.push(basicSsl())
}
let proxy:Record<string, string | ProxyOptions> = {
}
if(isKevisual) {
  proxy = {
    '/api': {
      target: 'https://kevisual.xiongxiao.me',
      changeOrigin: true,
    },
    '/api/router': {
      target: 'ws://localhost:3000',
      changeOrigin: true,
      ws: true,
      rewriteWsOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
    '/root/center': {
      target: 'https://kevisual.xiongxiao.me',
      changeOrigin: true,
    },
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ...plugins],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: basename,
  define: {
    DEV_SERVER: JSON.stringify(process.env.NODE_ENV === 'development'),
    VERSION: JSON.stringify(version),
    BASE_NAME: JSON.stringify(basename),
  },
  build: {
    target: 'esnext',
  },
  server: {
    port: 6004,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/api/router': {
        target: 'ws://localhost:3000',
        changeOrigin: true,
        ws: true,
        rewriteWsOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      ...proxy,
    },
  },
});
