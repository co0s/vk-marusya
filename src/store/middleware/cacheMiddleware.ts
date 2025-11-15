import type { Middleware } from '@reduxjs/toolkit';

const CACHE_KEY = 'movies_genre_cache';

// Middleware для сохранения кэша жанров в sessionStorage
export const cacheMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Сохраняем кэш после успешной загрузки фильмов или при загрузке дополнительных
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const actionType = action.type as string;
    
    if (actionType === 'movies/fetchMoviesByFilter/fulfilled' || actionType === 'movies/loadMoreMovies') {
      try {
        const state = store.getState();
        const cacheData = {
          genreCache: state.movies.genreCache,
          currentGenre: state.movies.currentGenre,
          genreDisplayedCount: state.movies.genreDisplayedCount,
          timestamp: Date.now(),
        };
        
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log('[CACHE MIDDLEWARE] 💾 Кэш сохранен в sessionStorage');
      } catch (error) {
        console.error('[CACHE MIDDLEWARE] ❌ Ошибка сохранения кэша:', error);
      }
    }
  }

  return result;
};

// Функция для загрузки кэша из sessionStorage
export function loadCacheFromStorage() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      // Проверяем, не устарел ли кэш (например, старше 1 часа)
      const ONE_HOUR = 60 * 60 * 1000;
      if (Date.now() - data.timestamp < ONE_HOUR) {
        console.log('[CACHE LOADER] ✅ Загружен кэш из sessionStorage:', Object.keys(data.genreCache));
        return {
          genreCache: data.genreCache,
          currentGenre: data.currentGenre,
          genreDisplayedCount: data.genreDisplayedCount || {},
        };
      } else {
        console.log('[CACHE LOADER] ⏰ Кэш устарел, очищаем');
        sessionStorage.removeItem(CACHE_KEY);
      }
    }
  } catch (error) {
    console.error('[CACHE LOADER] ❌ Ошибка загрузки кэша:', error);
  }
  return null;
}
