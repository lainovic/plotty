import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/plotty/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          leaflet: ['leaflet', 'react-leaflet'],
          mui: [
            '@emotion/react',
            '@emotion/styled',
            '@mui/base',
            '@mui/icons-material',
            '@mui/material',
            '@mui/system',
          ],
        },
      },
    },
  },
})
