import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import pkgs from './package.json' with { type: 'json' };

const version = pkgs.version || '0.0.1';
const isDev = process.env.NODE_ENV === 'development';
const basename = isDev ? '/' : '/workspace/wallnote';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@template': path.resolve(__dirname, './template'),
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
    lib: {
      entry:  'template/index.ts', // 设置入口文件
      formats: ['es'],
      fileName: (format) => `router.${format}.js` // 打包后的文件名
    },
    outDir: 'aidist',
  },
});
