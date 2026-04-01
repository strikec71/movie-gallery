import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ДОБАВЛЯЕМ БЛОК ТЕСТОВ:
  test: {
    environment: 'jsdom',
    globals: true, // Позволяет использовать expect и describe без импортов
  }
})