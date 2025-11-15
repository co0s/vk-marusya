// --- Файл: src/pages/HomePage.tsx ---

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./HomePage.module.css";

// Импортируем типы и thunk из наших файлов store
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchTop10Movies,
  fetchRandomMovie,
} from "../../store/slices/moviesSlice";

import SimpleMovieCard from "../../components/SimpleMovieCard/SimpleMovieCard";
import RandomMovieHero from "../../components/RandomMovieHero/RandomMovieHero";

const HomePage = () => {
  /// Получаем доступ к dispatch и данным из Redux
  const dispatch = useDispatch<AppDispatch>();
  const { top10, randomMovie, randomStatus, status } = useSelector(
    (state: RootState) => state.movies
  );

  // Функция для обновления случайного фильма
  const handleRefreshRandom = () => {
    if (randomStatus !== 'loading') {
      dispatch(fetchRandomMovie());
    }
  };

  // 1. Загрузка фильмов
  useEffect(() => {
    // Загружаем фильмы если они еще не загружены
    if (top10.length === 0 && status !== "loading") {
      dispatch(fetchTop10Movies());
    }
  }, [dispatch, top10.length, status]);

  // 2. Загрузка СЛУЧАЙНОГО фильма
  useEffect(() => {
    
    if (!randomMovie && randomStatus !== 'loading') {
      dispatch(fetchRandomMovie());
    }
  }, [dispatch, randomMovie, randomStatus]);

  return (
    <div className={styles.main__container}>
      {/* --- БЛОК СЛУЧАЙНОГО ФИЛЬМА (HERO) --- */}
      {randomMovie ? (
        <div className="mb-12">
          <RandomMovieHero
            movie={randomMovie}
            onRefresh={handleRefreshRandom}
            isLoading={randomStatus === 'loading'}
          />
        </div>
      ) : randomStatus === 'loading' ? (
        <div className={styles.loading__container}>
          <div className={styles.loading__content}>
            <div className={styles.loading__spinner}></div>
            <div className={styles.loading__text}>Загружаем случайный фильм...</div>
          </div>
        </div>
      ) : randomStatus === 'failed' ? (
        <div className={styles.loading__container}>
          <div className={styles.loading__content}>
            <div className={styles.loading__text}>Не удалось загрузить случайный фильм. Попробуйте обновить позже.</div>
          </div>
        </div>
      ) : null}

      {/* --- КОНТЕЙНЕР ДЛЯ ОГРАНИЧЕННОГО КОНТЕНТА (Топ-10) --- */}
      <div className={styles.page__container}>
        {/* --- ТОП-10 --- */}

        <h2 className={styles.movies__title}>Cписок фильмов</h2>

        {/* Показываем лоадер во время загрузки */}
        {status === "loading" && (
          <div className={styles.loading__container}>
            <div className={styles.loading__content}>
              <div className={styles.loading__spinner}></div>
              <div className={styles.loading__text}>Загрузка фильмов...</div>
            </div>
          </div>
        )}

        {/* Показываем ошибку, если загрузка не удалась */}
        {status === "failed" && (
          <div className={styles.loading__container}>
            <div className={styles.loading__content}>
              <div className={styles.loading__text}>Ошибка загрузки. Попробуйте еще раз.</div>
            </div>
          </div>
        )}

        {/* 6. Рендерим карточки ТОЛЬКО, ЕСЛИ top10 - ЭТО МАССИВ И ОН НЕ ПУСТ */}
        {status === "idle" &&
          Array.isArray(top10) &&
          top10.length > 0 && (
            <div className="mb-20">
              <ul className={styles.movie__list}>
                {top10.slice(0, 10).map((movie, index) => (
                  <SimpleMovieCard
                    key={movie.id}
                    id={movie.id}
                    poster={movie.posterUrl} // ПЕРЕДАЕМ ПОСТЕР 
                    rank={index + 1}
                  />
                ))}
              </ul>
            </div>
          )}

        {/* Если список пуст */}
        {status === "idle" && top10.length === 0 && (
          <p className="text-gray-400">Список пуст.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
