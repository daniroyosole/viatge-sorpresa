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
    target: 'es2015',
    commonjsOptions: {
      include: [/node_modules/]
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          leaflet: ['leaflet', 'react-leaflet']
        }
      }
    }
  },
  resolve: {
    alias: {
      'leaflet': 'leaflet/dist/leaflet.js'
    }
  }
})
