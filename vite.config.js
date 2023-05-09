import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../dist'
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
