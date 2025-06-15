import { fileURLToPath, URL } from 'node:url'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import * as dotenv from 'dotenv'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

dotenv.config()

export default defineConfig({
   css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    port: process.env.VITE_APP_PORT as unknown as number,
    proxy: {
      '/v1': {
        target: process.env.VITE_PROXY_BACKEND_URL,
        changeOrigin: false,
        secure: false,
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
