import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/get': {
        target: 'https://laby.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/get/, ''),
      },
      '/check': {
        target: 'https://api.mojang.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/check/, ''),
      },
    },
  },
})