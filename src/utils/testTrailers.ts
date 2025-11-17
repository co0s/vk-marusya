// Утилита для добавления тестовых трейлеров к фильмам
import type { IMovie } from '../types/movie';

// Список тестовых трейлеров популярных фильмов
const TEST_TRAILERS: Record<string, string> = {
  // Классические фильмы
  'The Godfather': 'https://www.youtube.com/watch?v=sY1S34973zA',
  'Pulp Fiction': 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
  'The Dark Knight': 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
  'Schindler\'s List': 'https://www.youtube.com/watch?v=gG22XNhtnoY',
  'Forrest Gump': 'https://www.youtube.com/watch?v=bLvqoHBptjg',
  'Fight Club': 'https://www.youtube.com/watch?v=qtRKdVHc-cE',
  'Inception': 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  'The Matrix': 'https://www.youtube.com/watch?v=vKQi3bIA1HI',
  'Goodfellas': 'https://www.youtube.com/watch?v=qo5jJpHtI1Y',
  'The Shawshank Redemption': 'https://www.youtube.com/watch?v=6hB3S9bIaco',
  'O Brother, Where Art Thou?': 'https://www.youtube.com/watch?v=YZdD0OxSvvo',
  
  // Современные фильмы
  'Interstellar': 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
  'Avengers: Endgame': 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
  'Joker': 'https://www.youtube.com/watch?v=zAGVQLHvwOY',
  'Parasite': 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
  'Once Upon a Time in Hollywood': 'https://www.youtube.com/watch?v=ELeMaP8EPAA',
  'Dune': 'https://www.youtube.com/watch?v=n9xhJrPXop4',
  'Spider-Man: No Way Home': 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
  'Top Gun: Maverick': 'https://www.youtube.com/watch?v=qSqVVswa420',
  
  // Дефолтный трейлер для неизвестных фильмов
  default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};

/**
 * Добавляет тестовые трейлеры к фильмам для демонстрации функциональности
 * @param movies - массив фильмов
 * @returns массив фильмов с добавленными трейлерами
 */
export const addTestTrailers = (movies: IMovie[]): IMovie[] => {
  return movies.map((movie, index) => {
    // Если у фильма уже есть трейлер, оставляем его
    if (movie.trailerUrl) {
      return movie;
    }

    // Ищем трейлер по названию фильма
    const trailerUrl = TEST_TRAILERS[movie.title] || 
                      TEST_TRAILERS[movie.originalTitle || ''] ||
                      // Добавляем трейлер к каждому 3-му фильму для разнообразия
                      (index % 3 === 0 ? TEST_TRAILERS.default : undefined);

    return {
      ...movie,
      trailerUrl
    };
  });
};

/**
 * Добавляет тестовый трейлер к одному фильму
 * @param movie - фильм
 * @returns фильм с добавленным трейлером
 */
export const addTestTrailer = (movie: IMovie): IMovie => {
  // Если у фильма уже есть трейлер, оставляем его
  if (movie.trailerUrl) {
    return movie;
  }

  // Ищем трейлер по названию фильма
  const trailerUrl = TEST_TRAILERS[movie.title] || 
                    TEST_TRAILERS[movie.originalTitle || ''] ||
                    TEST_TRAILERS.default;

  return {
    ...movie,
    trailerUrl
  };
};