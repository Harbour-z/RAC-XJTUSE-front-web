import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 配置代理
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        // target:'http://127.0.0.1:4523/m1/6727751-0-default',//测试apifox用地址
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/,'/api')
      },
      '/image': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/image/,'/image')
      },
    }
  }
})
