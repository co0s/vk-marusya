

import { configureStore, type Middleware } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import userReducer from './slices/userSlice';
import { cacheMiddleware } from './middleware/cacheMiddleware';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(cacheMiddleware as Middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;