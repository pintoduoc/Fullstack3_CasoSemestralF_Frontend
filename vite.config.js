import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // --- NUEVA SECCIÓN ---
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Tu API Gateway local
        changeOrigin: true
      }
    }
  }
})