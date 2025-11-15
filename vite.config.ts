// --- Файл: vite.config.ts (В КОРНЕ ПРОЕКТА) ---

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- ВОТ НАША НАСТРОЙКА ПРОКСИ ---
  server: {
    port: 3000,
    proxy: {
      // Все запросы, начинающиеся с /api
      '/api': {
        // ...будут перенаправлены на этот сервер
        target: 'https://cinemaguide.skillbox.cc',
        // Обязательно, чтобы сервер думал, что мы с ним "одного происхождения"
        changeOrigin: true,
        // Убираем /api из пути при перенаправлении
        // /api/movie -> /movie
        rewrite: (path) => path.replace(/^\/api/, ''),
        // Правим cookie, чтобы браузер принял их для localhost
        cookieDomainRewrite: '',
        cookiePathRewrite: '/',
      },
    },
  },
  
  // Оптимизация для продакшена
  build: {
    // Удаление console.log в production через esbuild
    minify: 'esbuild',
    // Увеличиваем лимит для предупреждений о размере файлов
    chunkSizeWarningLimit: 1000,
    // Разделение кода для оптимизации загрузки
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'animation-vendor': ['framer-motion', 'gsap'],
        },
      },
    },
  },
  
  // Удаление console в production
  esbuild: {
    drop: ['console', 'debugger'],
  },
});