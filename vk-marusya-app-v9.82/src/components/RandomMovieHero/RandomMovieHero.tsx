import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import type { IMovie } from "../../types/movie";
import styles from "./RandomMovieHero.module.css";

import { FavouriteButton } from "../FavouriteButton/FavouriteButton";
import { RefreshButton } from "../RefreshButton/RefreshButtton";
import { TrailerModal } from "../TrailerModal/TrailerModal";
import RatingBadge from "../RatingBadge/RatingBadge";

// Интерфейс для пропсов
interface RandomMovieHeroProps {
  movie: IMovie;
  // Нам нужна кнопка "Обновить" (как в макете), поэтому нужен обработчик
  onRefresh: () => void;
  isLoading?: boolean;
}

const RandomMovieHero: React.FC<RandomMovieHeroProps> = ({
  movie,
  onRefresh,
  isLoading = false,
}) => {
  // Состояние для модального окна трейлера
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);

  // Безопасное чтение данных
  const imdbRating = movie.tmdbRating;

  // Обработчики для трейлера
  const handleTrailerClick = () => {
    if (movie?.trailerUrl) {
      setIsTrailerModalOpen(true);
    }
  };

  const handleCloseTrailer = () => {
    setIsTrailerModalOpen(false);
  };

  // Вёрстка по макету
  return (
    <div
      className={styles.hero__container}
      style={{
        backgroundSize: "cover",
        backgroundPosition: "left",
        display: "hidden",
      }}
    >
      {/* Внутренний контейнер контента */}
      <div className={styles.content__wrapper}>
        {/* 1. Блок с информацией */}
        <div className={styles.info__block}>
          {/* Мета-информация */}
          <div className={styles.meta__info}>
            {imdbRating && <RatingBadge rating={imdbRating} />}
            <span>{movie.releaseDate}</span>

            <span>
              {movie.genres?.slice(0, 2).join(", ") || "Жанры не указаны"}
            </span>
          </div>

          <h1 className={styles.title}>{movie.title}</h1>

          <p className={styles.plot}>
            {movie.plot || "Описание не предоставлено."}
          </p>

          {/* Кнопки */}
          <div className={styles.buttons__container}>
            <NavLink to={`/movie/${movie.id}`} className={styles.btn__primary}>
              О фильме
            </NavLink>
            <button
              className={styles.btn__secondary}
              onClick={handleTrailerClick}
              disabled={!movie.trailerUrl}
              style={{
                opacity: movie.trailerUrl ? 1 : 0.6,
                cursor: movie.trailerUrl ? "pointer" : "not-allowed",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ marginRight: "8px" }}
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Трейлер
            </button>
            <div className={styles.icon__buttons__group}>
              <FavouriteButton movie={movie} />
              <RefreshButton onRefresh={onRefresh} disabled={isLoading} />
            </div>
          </div>
        </div>

        {/* 2. Постер справа */}
        <div className={styles.poster__block}>
          <img
            src={
              movie.posterUrl || "https://placehold.co/300x450/1A1D2E/76a9fa"
            }
            alt={movie.title}
            className={styles.poster__img}
          />
        </div>
      </div>

      {/* Модальное окно трейлера */}
      <TrailerModal
        isOpen={isTrailerModalOpen && !!movie.trailerUrl}
        onClose={handleCloseTrailer}
        trailerUrl={movie.trailerUrl || ""}
        movieTitle={movie.title}
      />

      {isLoading && (
        <div className={styles.loading__overlay}>
          <div className={styles.loading__spinner}></div>
          <span className={styles.loading__label}>Обновляем подборку...</span>
        </div>
      )}
    </div>
  );
};

export default RandomMovieHero;
