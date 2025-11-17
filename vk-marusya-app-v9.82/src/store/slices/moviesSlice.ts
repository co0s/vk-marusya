import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import $api from '../../services/api';
import type { IMovie } from '../../types/movie';
import { shuffleArray } from '../../hooks/shuffleArray/shuffleArray';
import { addTestTrailer } from '../../utils/testTrailers';
import { loadCacheFromStorage } from '../middleware/cacheMiddleware';


// --- Типы данных (позже их можно вынести) ---




// --- Начальное состояние ---
interface MoviesState {
  top10: IMovie[];
  randomMovie: IMovie | null;
  randomStatus: 'idle' | 'loading' | 'failed';
  // ДОБАВЛЯЕМ ПОЛЕ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ
  currentMovie: IMovie | null;
  filteredMovies: IMovie[];
  // Кэш для фильмов по жанрам
  genreCache: Record<string, IMovie[]>;
  currentGenre: string | null; // Текущий активный жанр
  // Пагинация для отфильтрованных фильмов
  displayedCount: number; // Сколько фильмов отображается для текущего жанра
  genreDisplayedCount: Record<string, number>; // Сколько фильмов отображается для каждого жанра
  moviesPerPage: number; // Сколько фильмов загружается за раз
  // ДОБАВЛЯЕМ ПОЛЯ ДЛЯ ПОИСКА
  searchResults: IMovie[];
  searchStatus: 'idle' | 'loading' | 'failed';
  status: 'idle' | 'loading' | 'failed';
}

// Загружаем кэш из sessionStorage при инициализации
const cachedData = loadCacheFromStorage();

const initialState: MoviesState = {
  top10: [],
  randomMovie: null,
  randomStatus: 'idle',
  currentMovie: null, // Инициализируем
  filteredMovies: [], // !!! ИНИЦИАЛИЗИРУЕМ !!!
  genreCache: cachedData?.genreCache || {}, // Загружаем из кэша или пустой объект
  currentGenre: cachedData?.currentGenre || null, // Загружаем из кэша или null
  displayedCount: 10, // Временное значение для текущего жанра
  genreDisplayedCount: cachedData?.genreDisplayedCount || {}, // Загружаем из кэша
  moviesPerPage: 10, // Загружаем по 10 фильмов
  searchResults: [], // Результаты поиска
  searchStatus: 'idle', // Отдельный статус для поиска
  status: 'idle',
};






// 3. НОВЫЙ THUNK: Получение случайного фильма
export const fetchRandomMovie = createAsyncThunk(
  'movies/fetchRandomMovie',
  async () => {
    // Пробуем использовать специальный endpoint для случайного фильма
    try {
      const randomResponse = await $api.get<IMovie>('/movie/random');
      if (randomResponse.data) {
        return addTestTrailer(randomResponse.data);
      }
    } catch (error) {
      console.log('[fetchRandomMovie] Endpoint /movie/random не найден, используем альтернативный метод', error);
    }

    // Альтернативный метод: загружаем случайную страницу и выбираем случайный фильм
    // Генерируем случайную страницу (от 1 до 100)
    const randomPage = Math.floor(Math.random() * 100) + 1;

    const response = await $api.get<{ docs: IMovie[] } | IMovie[]>('/movie', {
      params: {
        page: randomPage,
        limit: 10, // Берем 10 фильмов из случайной страницы
        sortField: '_id',
        sortType: 1,
        selectFields: 'id title originalTitle posterUrl rating tmdbRating releaseYear genres description trailerUrl plot runtime backdropUrl',
      }
    });

    let movies: IMovie[] = [];

    // Извлекаем массив из поля 'docs' или возвращаем пустой массив
    if (response.data && 'docs' in response.data && Array.isArray(response.data.docs)) {
      movies = response.data.docs;
    } else if (Array.isArray(response.data)) {
      movies = response.data;
    }

    if (movies.length > 0) {
      // Выбираем один СЛУЧАЙНЫЙ фильм из загруженных 10
      const randomIndex = Math.floor(Math.random() * movies.length);
      const selectedMovie = movies[randomIndex];

      // Добавляем тестовый трейлер для демонстрации
      return addTestTrailer(selectedMovie);
    }
    return null;
  }
);






export const fetchTop10Movies = createAsyncThunk(
  'movies/fetchTop10',
  async () => {

    // Генерируем случайную страницу для загрузки (от 1 до 100)
    const randomPage = Math.floor(Math.random() * 100) + 1;

    console.log('[DEBUG] 🎬 Начинаем запрос фильмов...');
    console.log('[DEBUG] 📍 URL:', '/movie');
    console.log('[DEBUG] 📄 Страница:', randomPage);

    try {
      const response = await $api.get<{ docs: IMovie[], total?: number }>(
        '/movie', {
        params: {
          page: randomPage,
          limit: 10, // Загружаем 10 фильмов из случайной страницы
          selectFields: 'id posterUrl genres title originalTitle',
        }
      });

      console.log('[DEBUG] ✅ Ответ получен!');
      console.log('[DEBUG] 📦 Статус:', response.status);
      console.log('[DEBUG] 📦 response.data:', response.data);
      console.log('[DEBUG] 📦 Тип данных:', typeof response.data);

      let movies: IMovie[] = [];

      if (response.data && 'docs' in response.data && Array.isArray(response.data.docs)) {
        movies = response.data.docs;
        console.log('[DEBUG] ✅ Формат: { docs: [...] }');
      }
      else if (Array.isArray(response.data)) {
        movies = response.data;
        console.log('[DEBUG] ✅ Формат: [...]');
      } else {
        console.error('[DEBUG] ❌ НЕИЗВЕСТНЫЙ ФОРМАТ!', response.data);
      }

      console.log(`[DEBUG] 🎯 Загружено ${movies.length} фильмов`);
      console.log('[DEBUG] 🎬 Первые 3:', movies.slice(0, 3));

      const shuffledMovies = shuffleArray(movies);
      return shuffledMovies;
      
    } catch (error) {
      console.error('[DEBUG] ❌ ОШИБКА!');
      console.error('[DEBUG] ❌ Error:', error);
      if (error && typeof error === 'object') {
        const err = error as { message?: string; response?: { status?: number; data?: unknown } };
        console.error('[DEBUG] ❌ Message:', err.message);
        console.error('[DEBUG] ❌ Response:', err.response);
        console.error('[DEBUG] ❌ Status:', err.response?.status);
        console.error('[DEBUG] ❌ Data:', err.response?.data);
      }
      throw error;
    }
  }
);



// !!! НОВЫЙ THUNK: Загрузка полной информации о фильме по ID !!!
export const fetchMovieById = createAsyncThunk<IMovie | null, number>(
  'movies/fetchMovieById',
  async (movieId: number) => {

    try {
      // Используем правильный API endpoint
      const response = await $api.get<IMovie>(`/movie/${movieId}`);

      console.log(`[API SUCCESS] Фильм ID ${movieId} успешно загружен!`, response.data);

      // Добавляем тестовый трейлер для демонстрации
      return addTestTrailer(response.data);

    } catch (error) {
      console.error(`[API ERROR] Не удалось загрузить фильм с ID ${movieId}:`, error);

      // Возвращаем null при ошибке
      return null;
    }
  }
);









// --- НОВЫЙ THUNK: Загрузка фильмов по фильтру ---
interface FilterParams {
  genre?: string;
}

export const fetchMoviesByFilter = createAsyncThunk<
  { movies: IMovie[]; genre: string },
  FilterParams,
  { state: RootState }
>(
  'movies/fetchMoviesByFilter',
  async (filters, { getState }) => {
    const genre = filters.genre || '';
    const state = getState();
    
    console.log(`[fetchMoviesByFilter THUNK] 🎬 Запрос жанра: "${genre}"`);
    console.log(`[fetchMoviesByFilter THUNK] 📦 Состояние кэша:`, Object.keys(state.movies.genreCache));
    console.log(`[fetchMoviesByFilter THUNK] 🔍 Проверка кэша для "${genre}":`, state.movies.genreCache[genre]?.length || 0);
    
    // Проверяем кэш: если фильмы этого жанра уже загружены, возвращаем их
    if (state.movies.genreCache[genre] && state.movies.genreCache[genre].length > 0) {
      console.log(`[fetchMoviesByFilter THUNK] ✅ Используем кэш для жанра "${genre}" (${state.movies.genreCache[genre].length} фильмов)`);
      return { 
        movies: state.movies.genreCache[genre], 
        genre 
      };
    }

    console.log(`[fetchMoviesByFilter THUNK] 🌐 Загружаем фильмы для жанра "${genre}" из API...`);
    
    const allMovies: IMovie[] = [];
    const pagesToLoad = 10; // Загружаем 10 последовательных страниц
    
    // Используем последовательные страницы вместо случайных для стабильности
    for (let page = 1; page <= pagesToLoad; page++) {
      const params = {
        page: page,
        limit: 50, // Увеличиваем лимит для получения большего количества фильмов
        selectFields: 'id title originalTitle posterUrl rating tmdbRating releaseYear genres',
        'genres': genre, // Фильтрация по жанру на стороне API
      };

      try {
        const response = await $api.get<{ docs: IMovie[] } | IMovie[]>('/movie', { params });

        let movies: IMovie[] = [];

        // Проверяем, вернул ли API объект { docs: [...] }
        if (response.data && 'docs' in response.data && Array.isArray(response.data.docs)) {
          movies = response.data.docs;
        }
        // ИЛИ проверяем, вернул ли API просто массив [...]
        else if (Array.isArray(response.data)) {
          movies = response.data;
        }

        // Дополнительная клиентская фильтрация по жанру для надежности
        if (genre) {
          movies = movies.filter(movie => Array.isArray(movie.genres) && movie.genres.includes(genre));
        }

        allMovies.push(...movies);
        
        // Если набрали достаточно фильмов, можем остановиться
        if (allMovies.length >= 100) {
          break;
        }
      } catch (error) {
        console.error(`[fetchMoviesByFilter] Ошибка загрузки страницы ${page}:`, error);
      }
    }

    console.log(`[fetchMoviesByFilter] Загружено ${allMovies.length} фильмов по жанру "${genre}"`);

    // Перемешиваем результаты для разнообразия
    const shuffledMovies = shuffleArray(allMovies);
    
    return { 
      movies: shuffledMovies, 
      genre 
    };
  }
);

// --- НОВЫЙ THUNK: Поиск фильмов по названию ---
export const searchMovies = createAsyncThunk<IMovie[], string, { state: RootState }>(
  'movies/searchMovies',
  async (searchQuery) => {
    // Если поисковый запрос пустой, возвращаем пустой массив
    if (!searchQuery.trim()) {
      return [];
    }

    try {
      // Загружаем фильмы из нескольких случайных страниц для поиска
      const allMovies: IMovie[] = [];
      const pagesToLoad = 10; // Загружаем 10 случайных страниц для лучшего поиска

      for (let i = 0; i < pagesToLoad; i++) {
        const randomPage = Math.floor(Math.random() * 100) + 1;

        try {
          const response = await $api.get<{ docs: IMovie[] } | IMovie[]>('/movie', {
            params: {
              page: randomPage,
              limit: 10, // По 10 фильмов с каждой страницы
              selectFields: 'id title originalTitle posterUrl releaseYear genres',
            }
          });

          // Извлекаем данные из ответа
          if (response.data && 'docs' in response.data && Array.isArray(response.data.docs)) {
            allMovies.push(...response.data.docs);
          } else if (Array.isArray(response.data)) {
            allMovies.push(...response.data);
          }
        } catch (error) {
          console.error(`[searchMovies] Ошибка загрузки страницы ${randomPage}:`, error);
        }
      }

      // Клиентская фильтрация по поисковому запросу
      const query = searchQuery.toLowerCase().trim();
      const filteredMovies = allMovies.filter(movie =>
        movie.title?.toLowerCase().includes(query) ||
        movie.originalTitle?.toLowerCase().includes(query)
      );

      console.log(`[searchMovies] Найдено ${filteredMovies.length} фильмов по запросу "${searchQuery}" из ${allMovies.length} загруженных`);
      return filteredMovies.slice(0, 10); // Ограничиваем до 10 результатов

    } catch (error) {
      console.error('[searchMovies] Ошибка поиска:', error);
      return [];
    }
  }
);






// --- Создание среза ---
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Экшен для загрузки следующей порции фильмов
    loadMoreMovies: (state) => {
      const genre = state.currentGenre || '';
      const totalMovies = state.genreCache[genre]?.length || 0;
      const currentCount = state.genreDisplayedCount[genre] || state.moviesPerPage;
      const newCount = Math.min(currentCount + state.moviesPerPage, totalMovies);
      
      state.displayedCount = newCount;
      state.genreDisplayedCount[genre] = newCount;
      
      console.log(`[loadMoreMovies] 📄 Жанр "${genre}": показываем ${newCount} из ${totalMovies} фильмов`);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTop10Movies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTop10Movies.fulfilled, (state, action) => {
        state.status = 'idle';
        // Redux Toolkit гарантирует иммутабельность
        state.top10 = action.payload;
      })
      .addCase(fetchTop10Movies.rejected, (state) => {
        state.status = 'failed';
      })
      // Обработка нового Thunk
      .addCase(fetchRandomMovie.pending, (state) => {
        state.randomStatus = 'loading';
      })
      .addCase(fetchRandomMovie.fulfilled, (state, action) => {
        if (action.payload) {
          state.randomMovie = action.payload;
          state.randomStatus = 'idle';
        } else {
          state.randomStatus = 'failed';
        }
      })
      .addCase(fetchRandomMovie.rejected, (state) => {
        state.randomStatus = 'failed';
      })
      // !!! ИСПРАВЛЕНИЕ: Детальный фильм должен менять статус !!!
      .addCase(fetchMovieById.pending, (state) => {
        state.status = 'loading';
        state.currentMovie = null; // Очищаем при начале новой загрузки
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        // Устанавливаем статус 'idle' и записываем фильм
        state.status = 'idle';
        state.currentMovie = action.payload;

        // !!! Дополнительная проверка на null: если API вернул 200, но без данных !!!
        if (!action.payload) {
          state.status = 'failed';
        }

      })
      .addCase(fetchMovieById.rejected, (state) => {
        // Устанавливаем статус 'failed' при ошибке сети/404
        state.status = 'failed';
        state.currentMovie = null;
      })

      // Обработка нового Thunk
      .addCase(fetchMoviesByFilter.pending, (state, action) => {
        // Проверяем, есть ли данные в кэше
        const genre = action.meta.arg.genre || '';
        
        console.log(`[REDUCER PENDING] 🔄 Жанр: "${genre}"`);
        console.log(`[REDUCER PENDING] 📦 Текущий жанр: "${state.currentGenre}"`);
        console.log(`[REDUCER PENDING] 📦 Кэш:`, Object.keys(state.genreCache));
        
        // Если переходим на новый жанр
        if (state.currentGenre !== genre) {
          console.log(`[REDUCER PENDING] 🧹 Очищаем старые фильмы (смена жанра)`);
          state.filteredMovies = [];
          
          // Если данные в кэше для нового жанра, показываем их сразу
          if (state.genreCache[genre] && state.genreCache[genre].length > 0) {
            console.log(`[REDUCER PENDING] ✅ Новый жанр в кэше, показываем (${state.genreCache[genre].length} фильмов)`);
            state.status = 'idle';
            state.filteredMovies = state.genreCache[genre];
            // Восстанавливаем сохраненный счетчик для этого жанра или используем начальное значение
            state.displayedCount = state.genreDisplayedCount[genre] || state.moviesPerPage;
          } else {
            console.log(`[REDUCER PENDING] ⏳ Данных нет, показываем лоадер`);
            state.status = 'loading';
            state.displayedCount = state.moviesPerPage; // Сбрасываем на 10
          }
        } else {
          // Тот же жанр, данные уже должны быть
          if (state.genreCache[genre] && state.genreCache[genre].length > 0) {
            console.log(`[REDUCER PENDING] ✅ Данные уже загружены для текущего жанра`);
            state.status = 'idle';
            state.filteredMovies = state.genreCache[genre];
            // Восстанавливаем сохраненный счетчик
            state.displayedCount = state.genreDisplayedCount[genre] || state.moviesPerPage;
          } else {
            state.status = 'loading';
          }
        }
        
        state.currentGenre = genre;
      })
      .addCase(fetchMoviesByFilter.fulfilled, (state, action) => {
        state.status = 'idle';
        const { movies, genre } = action.payload;
        
        console.log(`[REDUCER FULFILLED] ✅ Получено ${movies.length} фильмов для жанра "${genre}"`);
        console.log(`[REDUCER FULFILLED] 💾 Сохраняем в кэш`);
        
        // Сохраняем в кэш
        state.genreCache[genre] = movies;
        // Обновляем отфильтрованный список
        state.filteredMovies = movies;
        state.currentGenre = genre;
        // Сбрасываем счетчик на начальное значение для нового жанра
        state.displayedCount = state.moviesPerPage;
        state.genreDisplayedCount[genre] = state.moviesPerPage;
        
        console.log(`[REDUCER FULFILLED] 📦 Текущий кэш:`, Object.keys(state.genreCache));
      })
      .addCase(fetchMoviesByFilter.rejected, (state) => {
        state.status = 'failed';
        state.filteredMovies = []; // Очищаем при ошибке
      })

      // Обработка поиска фильмов
      .addCase(searchMovies.pending, (state) => {
        state.searchStatus = 'loading';
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchStatus = 'idle';
        state.searchResults = action.payload;
      })
      .addCase(searchMovies.rejected, (state) => {
        state.searchStatus = 'failed';
        state.searchResults = [];
      });

  },
});

// Экспортируем actions
export const { loadMoreMovies } = moviesSlice.actions;

export default moviesSlice.reducer;




