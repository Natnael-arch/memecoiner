import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/zora-api': {
        target: 'https://api.zora.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zora-api/, '/graphql'),
        secure: false,
      },
    },
  },
})
