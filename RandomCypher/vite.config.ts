import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/characters': {
        target: 'https://api.neople.co.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/characters/, '/cy/characters?apikey=') 
      }
    }
  }
})
