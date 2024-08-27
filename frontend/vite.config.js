import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v2': {
        target: 'https://bankaccountdata.gocardless.com',
        changeOrigin: true,
        secure: true,
      },
    }
  }
})
