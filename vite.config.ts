import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet']
  },
  define: {
    global: 'globalThis'
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
})
