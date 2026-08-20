import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@svg': path.resolve(__dirname, './src/components/svg'),
      // '@utils': path.resolve(__dirname, './src/utils'),
      // '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
      // '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    proxy: {
      '/app': 'http://localhost:3000'
    }
  }
})
