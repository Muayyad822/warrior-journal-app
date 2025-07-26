import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/hf': {
        target: 'https://huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hf/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add auth header on server side
            if (import.meta.env.VITE_HF_TOKEN) {
              proxyReq.setHeader('Authorization', `Bearer ${import.meta.env.VITE_HF_TOKEN}`);
            }
          });
        }
      }
    }
  }
})
