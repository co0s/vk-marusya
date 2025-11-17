# 🎯 Пошаговая инструкция по созданию VK Marusya Cinema App

## 📋 Что вы создадите

Современное веб-приложение для просмотра информации о фильмах с:
- ✅ Авторизацией и регистрацией
- ✅ Поиском и фильтрацией фильмов
- ✅ Личным кабинетом и избранными фильмами
- ✅ Адаптивным дизайном
- ✅ Анимациями и плавными переходами

**Время выполнения:** 8-12 часов

---

## 🚀 Этап 1: Подготовка окружения (15 минут)

### 1.1 Проверьте версии

```bash
node --version    # Должно быть >= 18.x
npm --version     # Должно быть >= 9.x
```

Если версии не подходят, установите последнюю LTS версию Node.js с [nodejs.org](https://nodejs.org)

### 1.2 Создайте проект

```bash
# Создайте проект через Vite
npm create vite@latest vk-marusya-app -- --template react-ts

# Перейдите в папку проекта
cd vk-marusya-app

# Установите зависимости
npm install
```

### 1.3 Установите дополнительные библиотеки

```bash
# State management
npm install @reduxjs/toolkit react-redux

# Routing
npm install react-router-dom

# HTTP client
npm install axios

# Animations
npm install framer-motion gsap

# Types
npm install --save-dev @types/node
```

### 1.4 Проверьте, что всё работает

```bash
npm run dev
```

Откройте браузер на `http://localhost:5173` - должна открыться стартовая страница Vite.

---

## ⚙️ Этап 2: Настройка конфигурации (30 минут)

### 2.1 Настройте Vite

Откройте `vite.config.ts` и замените содержимое:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://cinemaguide.skillbox.cc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
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
  esbuild: {
    drop: ['console', 'debugger'],
  },
});
```

**Что это делает:**
- `server.proxy` - перенаправляет запросы `/api/*` на реальное API
- `manualChunks` - разделяет код на chunks для оптимизации
- `drop` - удаляет console.log в production

### 2.2 Настройте TypeScript

Откройте `tsconfig.json` и добавьте в `compilerOptions`:

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2.3 Создайте .env файл

Создайте `.env` в корне проекта:

```env
VITE_API_BASE_URL=https://cinemaguide.skillbox.cc
VITE_APP_NAME=VK Marusya Cinema
VITE_APP_VERSION=1.0.0
VITE_DEV_PORT=3000
```

---

## 📦 Этап 3: Создание структуры проекта (20 минут)

### 3.1 Создайте папки

Выполните в терминале:

```bash
# Windows PowerShell
mkdir src/components, src/pages, src/store, src/store/slices, src/store/middleware, src/services, src/hooks, src/types, src/utils, src/animations, src/styles

# Linux/Mac
mkdir -p src/{components,pages,store/{slices,middleware},services,hooks,types,utils,animations,styles}
```

### 3.2 Создайте типы данных

**Файл:** `src/types/movie.ts`

```typescript
export interface IMovie {
  id: number;
  title: string;
  originalTitle?: string;
  releaseDate: string;
  genres?: string[];
  plot?: string;
  posterUrl?: string;
  backdropUrl?: string;
  tmdbRating?: number;
  trailerUrl?: string;
  runtime?: number;
  director?: string;
  cast?: string[];
  language?: string;
  production?: string;
  awardsSummary?: string;
  budget?: string;
}

export interface IGenre {
  id: string;
  name: string;
}
```

**Файл:** `src/types/user.ts`

```typescript
export interface IUser {
  email: string;
  name: string;
  surname?: string;
  password?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname?: string;
}
```

---

## 🔌 Этап 4: Настройка API клиента (15 минут)

**Файл:** `src/services/api.ts`

```typescript
import axios from 'axios';

const $api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default $api;
```

**Важно:** `withCredentials: true` необходим для работы с cookie-based аутентификацией.

---

## 🗂 Этап 5: Redux Store (1 час)

### 5.1 Создайте store

**Файл:** `src/store/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 5.2 Типизированные хуки

**Файл:** `src/hooks/storeHooks.ts`

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### 5.3 Movies Slice

**Файл:** `src/store/slices/moviesSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import $api from '../../services/api';
import { IMovie, IGenre } from '../../types/movie';

interface MoviesState {
  top10: IMovie[];
  randomMovie: IMovie | null;
  randomStatus: 'idle' | 'loading' | 'failed';
  currentMovie: IMovie | null;
  filteredMovies: IMovie[];
  searchResults: IMovie[];
  genres: IGenre[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  top10: [],
  randomMovie: null,
  randomStatus: 'idle',
  currentMovie: null,
  filteredMovies: [],
  searchResults: [],
  genres: [],
  loading: false,
  error: null,
};

// Thunk для загрузки топ-10 фильмов
export const fetchTop10Movies = createAsyncThunk(
  'movies/fetchTop10',
  async () => {
    const response = await $api.get('/movie', {
      params: { count: 10 },
    });
    return response.data;
  }
);

// Thunk для случайного фильма
export const fetchRandomMovie = createAsyncThunk(
  'movies/fetchRandom',
  async () => {
    const response = await $api.get('/movie/random');
    return response.data;
  }
);

// Thunk для поиска фильмов
export const searchMovies = createAsyncThunk(
  'movies/search',
  async (query: string) => {
    const response = await $api.get('/movie', {
      params: { title: query },
    });
    return response.data;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Top 10 movies
    builder
      .addCase(fetchTop10Movies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTop10Movies.fulfilled, (state, action) => {
        state.loading = false;
        state.top10 = action.payload;
      })
      .addCase(fetchTop10Movies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      });

    // Random movie
    builder
      .addCase(fetchRandomMovie.pending, (state) => {
        state.randomStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchRandomMovie.fulfilled, (state, action) => {
        state.randomStatus = 'idle';
        state.randomMovie = action.payload;
      })
      .addCase(fetchRandomMovie.rejected, (state, action) => {
        state.randomStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch random movie';
      });

    // Search
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMovies.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearSearchResults, clearError } = moviesSlice.actions;
export default moviesSlice.reducer;
```

### 5.4 User Slice

**Файл:** `src/store/slices/userSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import $api from '../../services/api';
import { IUser, LoginData, RegisterData } from '../../types/user';
import type { RootState } from '../store';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  favorites: number[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  favorites: [],
  loading: false,
  error: null,
};

// Вход
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginData) => {
    const response = await $api.post('/auth/login', credentials);
    return { ...response.data, password: credentials.password };
  }
);

// Регистрация
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: RegisterData) => {
    await $api.post('/user', {
      email: data.email,
      password: data.password,
      name: data.name,
      surname: data.surname,
    });
    
    // Автоматический вход после регистрации
    const loginResponse = await $api.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
    
    return { ...loginResponse.data, password: data.password };
  }
);

// Проверка авторизации
export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const response = await $api.get('/profile');
    
    return {
      ...response.data,
      password: state.user.user?.password,
    };
  }
);

// Выход
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await $api.post('/auth/logout');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<number>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        localStorage.setItem(
          `vk-marusya-favorites-${state.user?.email}`,
          JSON.stringify(state.favorites)
        );
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
      localStorage.setItem(
        `vk-marusya-favorites-${state.user?.email}`,
        JSON.stringify(state.favorites)
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        
        const savedFavorites = localStorage.getItem(
          `vk-marusya-favorites-${action.payload.email}`
        );
        state.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.favorites = [];
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.favorites = [];
    });
  },
});

export const { addToFavorites, removeFromFavorites, clearError } =
  userSlice.actions;
export default userSlice.reducer;
```

---

## 🎨 Этап 6: Компоненты (3-4 часа)

### 6.1 Header

Создайте папку `src/components/Header/` и файлы:

**Header.tsx:**
```typescript
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/storeHooks';
import SearchBar from '../SearchBar/SearchBar';
import LoginButton from '../LoginButton/LoginButton';
import styles from './Header.module.css';

const Header = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          🎬 VK Cinema
        </Link>
        
        <SearchBar />
        
        <nav className={styles.nav}>
          <Link to="/genres">Жанры</Link>
          {isAuthenticated ? (
            <Link to="/profile" className={styles.userLink}>
              👤 {user?.name}
            </Link>
          ) : (
            <LoginButton />
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

**Header.module.css:**
```css
.header {
  background: #1a1a1a;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 1.5rem;
  margin-left: auto;
}

.nav a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.nav a:hover {
  color: #4a9eff;
}
```

### 6.2 SearchBar

**SearchBar.tsx:**
```typescript
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { searchMovies, clearSearchResults } from '../../store/slices/moviesSlice';
import SearchResultsDropdown from '../SearchResultsDropdown/SearchResultsDropdown';
import useDebounce from '../../hooks/useDebounce/useDebounce';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const dispatch = useAppDispatch();
  const { searchResults } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchMovies(debouncedQuery));
      setIsOpen(true);
    } else {
      dispatch(clearSearchResults());
      setIsOpen(false);
    }
  }, [debouncedQuery, dispatch]);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Поиск фильмов..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
      {isOpen && searchResults.length > 0 && (
        <SearchResultsDropdown
          results={searchResults}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
```

### 6.3 useDebounce Hook

**src/hooks/useDebounce/useDebounce.ts:**
```typescript
import { useState, useEffect } from 'react';

export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 📄 Этап 7: Страницы (2-3 часа)

### 7.1 HomePage

**src/pages/HomePage/HomePage.tsx:**
```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import {
  fetchTop10Movies,
  fetchRandomMovie,
} from '../../store/slices/moviesSlice';
import RandomMovieHero from '../../components/RandomMovieHero/RandomMovieHero';
import SimpleMovieCard from '../../components/SimpleMovieCard/SimpleMovieCard';
import styles from './HomePage.module.css';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { top10, randomMovie, randomStatus } = useAppSelector(
    (state) => state.movies
  );

  useEffect(() => {
    dispatch(fetchTop10Movies());
    dispatch(fetchRandomMovie());
  }, [dispatch]);

  const handleRefresh = () => {
    if (randomStatus === 'loading') return;
    dispatch(fetchRandomMovie());
  };

  return (
    <div className={styles.homePage}>
      <RandomMovieHero
        movie={randomMovie}
        onRefresh={handleRefresh}
        isLoading={randomStatus === 'loading'}
      />
      
      <section className={styles.top10Section}>
        <h2>Топ-10 фильмов</h2>
        <div className={styles.moviesGrid}>
          {top10.map((movie) => (
            <SimpleMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

---

## 🎭 Этап 8: Авторизация (1-2 часа)

### 8.1 LoginForm

**src/components/LoginForm/LoginForm.tsx:**
```typescript
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { loginUser, clearError } from '../../store/slices/userSlice';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm = ({ onClose, onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      onClose();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Вход</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Загрузка...' : 'Войти'}
      </button>
      
      <p>
        Нет аккаунта?{' '}
        <button type="button" onClick={onSwitchToRegister}>
          Зарегистрироваться
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
```

---

## 🚀 Этап 9: Анимации (1 час)

### 9.1 AnimatedRoute

**src/components/AnimatedRoute/AnimatedRoute.tsx:**
```typescript
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedRouteProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const AnimatedRoute = ({ children }: AnimatedRouteProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedRoute;
```

---

## ✅ Этап 10: Тестирование и запуск (30 минут)

### 10.1 Запустите dev-сервер

```bash
npm run dev
```

### 10.2 Протестируйте функционал

- ✅ Главная страница загружается
- ✅ Отображается случайный фильм
- ✅ Работает поиск фильмов
- ✅ Можно зарегистрироваться
- ✅ Можно войти
- ✅ Работает добавление в избранное

### 10.3 Соберите production версию

```bash
npm run build
npm run preview
```

---

## 🎉 Готово!

Вы создали полноценное веб-приложение для просмотра фильмов!

### Что дальше?

1. **Деплой на Netlify/Vercel** - см. DEVELOPMENT_GUIDE.md
2. **Добавьте больше функций:**
   - Пагинация для списков фильмов
   - Сортировка по рейтингу/дате
   - Темная/светлая тема
   - Больше анимаций

3. **Оптимизация:**
   - Добавьте кэширование
   - Оптимизируйте изображения
   - Добавьте PWA функционал

### 📚 Полезные ресурсы

- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Framer Motion](https://www.framer.com/motion/)

**Удачи в разработке! 🚀**
