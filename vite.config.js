import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://thewarriorsjournal.vercel.app'
          : 'http://localhost:3000',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
