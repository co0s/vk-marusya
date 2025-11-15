import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import type { RootState } from '../store';
import $api from '../../services/api';
import type { IUser, LoginData, RegisterData } from '../../types/user';
import type { IMovie } from '../../types/movie';

// --- Состояние пользователя ---
interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  favoriteMovies: IMovie[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

// --- Вспомогательные функции для работы с localStorage ---
const FAVORITES_STORAGE_PREFIX = 'vk-marusya-favorites';

const getFavoritesStorageKey = (email: string) => `${FAVORITES_STORAGE_PREFIX}-${email}`;

const loadFavoritesForUser = (email: string): IMovie[] => {
  try {
    const storageKey = getFavoritesStorageKey(email);
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      return JSON.parse(stored);
    }

    const legacyStored = localStorage.getItem(FAVORITES_STORAGE_PREFIX);
    if (legacyStored) {
      const parsed = JSON.parse(legacyStored) as IMovie[];
      saveFavoritesForUser(email, parsed);
      localStorage.removeItem(FAVORITES_STORAGE_PREFIX);
      return parsed;
    }

    return [];
  } catch (error) {
    console.error('Ошибка при загрузке избранного из localStorage:', error);
    return [];
  }
};

const saveFavoritesForUser = (email: string, favorites: IMovie[]): void => {
  try {
    localStorage.setItem(getFavoritesStorageKey(email), JSON.stringify(favorites));
  } catch (error) {
    console.error('Ошибка при сохранении избранного в localStorage:', error);
  }
};

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  favoriteMovies: [],
  status: 'idle',
  error: null,
};

type ErrorResponse = {
  message?: string;
  error?: string;
  errors?: Array<{ message?: string }>;
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) {
      return 'Неверный email или пароль';
    }

    if (status === 404) {
      return 'Пользователь не найден';
    }

    const data = error.response?.data as ErrorResponse | string | undefined;
    if (typeof data === 'string' && data.trim().length > 0) {
      return data;
    }

    if (data && typeof data === 'object') {
      if (data.message) {
        return data.message;
      }

      if (data.error) {
        return data.error;
      }

      if (Array.isArray(data.errors) && data.errors[0]?.message) {
        return data.errors[0].message as string;
      }
    }

    const statusText = error.response?.statusText;
    if (statusText) {
      return statusText;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const resolveUserFromPayload = (payload: unknown): IUser | undefined => {
  if (payload && typeof payload === 'object') {
    const candidate = payload as { user?: IUser } & Partial<IUser>;

    if (candidate.user && typeof candidate.user.email === 'string') {
      return candidate.user;
    }

    if (typeof candidate.email === 'string') {
      return candidate as IUser;
    }
  }

  return undefined;
};

// --- THUNK: Авторизация пользователя ---
export const loginUser = createAsyncThunk<IUser, LoginData>(
  'user/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await $api.post<unknown>('/auth/login', loginData);

      let user = resolveUserFromPayload(response.data);

      if (!user) {
        const profileResponse = await $api.get<IUser>('/profile');
        user = profileResponse.data;
      }

      if (!user) {
        throw new Error('Не удалось получить данные пользователя');
      }

      const userWithPassword: IUser = {
        ...user,
        password: loginData.password,
      };

      console.log('[loginUser] Пользователь успешно авторизован:', userWithPassword);
      return userWithPassword;
    } catch (error: unknown) {
      console.error('[loginUser] Ошибка авторизации:', error);
      const errorMessage = extractErrorMessage(error, 'Ошибка авторизации');
      return rejectWithValue(errorMessage);
    }
  }
);

// --- THUNK: Регистрация пользователя ---
export const registerUser = createAsyncThunk<IUser, RegisterData>(
  'user/register',
  async (registerData, { rejectWithValue }) => {
    try {
      // Проверяем совпадение паролей на клиенте
      if (registerData.password !== registerData.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }

      const payload = {
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
        passwordConfirm: registerData.confirmPassword,
        name: registerData.name,
        surname: registerData.surname || '',
      };

      const response = await $api.post<unknown>('/user', payload);

      let user = resolveUserFromPayload(response.data);

      if (!user || user.email !== registerData.email) {
        try {
          const loginResponse = await $api.post<unknown>('/auth/login', {
            email: registerData.email,
            password: registerData.password,
          });
          const authenticatedUser = resolveUserFromPayload(loginResponse.data);
          if (authenticatedUser) {
            user = authenticatedUser;
          }
        } catch (authError) {
          console.warn('[registerUser] Не удалось автоматически авторизоваться после регистрации:', authError);
        }
      }

      if (!user || user.email !== registerData.email) {
        try {
          const profileResponse = await $api.get<IUser>('/profile');
          if (profileResponse.data?.email === registerData.email) {
            user = profileResponse.data;
          }
        } catch (profileError) {
          console.warn('[registerUser] Не удалось получить профиль после регистрации:', profileError);
        }
      }

      if (!user) {
        user = {
          email: registerData.email,
          name: registerData.name,
          surname: registerData.surname || '',
        };
      }

      const userWithPassword: IUser = {
        ...user,
        password: registerData.password,
      };

      console.log('[registerUser] Пользователь успешно зарегистрирован:', userWithPassword);
      return userWithPassword;
    } catch (error: unknown) {
      console.error('[registerUser] Ошибка регистрации:', error);
      const errorMessage = extractErrorMessage(error, 'Ошибка регистрации');
      return rejectWithValue(errorMessage);
    }
  }
);

// --- THUNK: Проверка авторизации (восстановление сессии) ---
export const checkAuth = createAsyncThunk<IUser | null>(
  'user/checkAuth',
  async () => {
    try {
      const response = await $api.get<IUser>('/profile');

      if (response.data) {
        console.log('[checkAuth] Пользователь найден:', response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        return null;
      }

      console.error('[checkAuth] Ошибка проверки авторизации:', error);
      return null;
    }
  }
);

// --- THUNK: Выход из системы ---
export const logoutUser = createAsyncThunk<void>(
  'user/logout',
  async () => {
    try {
      await $api.post('/auth/logout');
      console.log('[logoutUser] Пользователь вышел из системы');
    } catch (error) {
      console.error('[logoutUser] Ошибка при выходе:', error);
    }
  }
);



// --- Создание слайса ---
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Очистка ошибок
    clearError: (state) => {
      state.error = null;
    },
    // Ручная установка пользователя (для тестирования)
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.favoriteMovies = action.payload?.email ? loadFavoritesForUser(action.payload.email) : [];
    },
    // Добавление фильма в избранное
    addToFavorites: (state, action: PayloadAction<IMovie>) => {
      if (!state.user?.email) {
        return;
      }

      const movieExists = state.favoriteMovies.find(movie => movie.id === action.payload.id);
      if (!movieExists) {
        state.favoriteMovies.push(action.payload);
        saveFavoritesForUser(state.user.email, state.favoriteMovies);
      }
    },
    // Удаление фильма из избранного
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      if (!state.user?.email) {
        return;
      }

      state.favoriteMovies = state.favoriteMovies.filter(movie => movie.id !== action.payload);
      saveFavoritesForUser(state.user.email, state.favoriteMovies);
    },
  },
  extraReducers: (builder) => {
    builder
      // Авторизация
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.favoriteMovies = loadFavoritesForUser(action.payload.email);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.favoriteMovies = action.payload.email ? loadFavoritesForUser(action.payload.email) : [];
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
      // Проверка авторизации
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          const preservedPassword =
            state.user?.email === action.payload.email ? state.user?.password : undefined;

          state.user = {
            ...action.payload,
            ...(preservedPassword ? { password: preservedPassword } : {}),
          };
          state.isAuthenticated = true;
          state.favoriteMovies = loadFavoritesForUser(action.payload.email);
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.favoriteMovies = [];
        }
        state.status = 'idle';
      })
      
      // Выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.favoriteMovies = [];
        state.status = 'idle';
        state.error = null;
      })


  },
});

export const { clearError, setUser, addToFavorites, removeFromFavorites } = userSlice.actions;
export default userSlice.reducer;

// --- Селекторы ---
export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;
export const selectFavoriteMovies = (state: RootState) => state.user.favoriteMovies;