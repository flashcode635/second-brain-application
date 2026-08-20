import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
      '@svg': `${import.meta.dirname}/src/components/svg`,
      // '@utils': path.resolve(__dirname, './src/utils'),
      // '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': `${import.meta.dirname}/src/assets`,
      // '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    proxy: {
      '/app': 'http://localhost:3000'
    }
  }
})
