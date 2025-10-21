import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/vagas': { target: 'http://localhost:5000', changeOrigin: true },
      '/veiculos': { target: 'http://localhost:5000', changeOrigin: true },
    }
  }
})
