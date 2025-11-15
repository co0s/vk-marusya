



import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SearchResultsDropdown.module.css';
import type { IMovie } from '../../types/movie';
import RatingBadge from '../RatingBadge/RatingBadge';

interface SearchResultsDropdownProps {
  results: IMovie[];
  onSelect?: () => void;
}

const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({ results, onSelect }) => {
  // Функция для обрезки текста
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Функция для форматирования года
  const formatYear = (year?: number) => {
    return year ? `(${year})` : '';
  };

  return (
    <ul className={styles.dropdown__container}>
      {results.slice(0, 8).map(movie => ( // Ограничиваем до 8 результатов
        <li key={movie.id} className={styles.dropdown__item}>
          <NavLink 
            to={`/movie/${movie.id}`} 
            className={styles.result__item}
            onClick={onSelect}
          >
            <div className={styles.poster__container}>
              <img 
                src={movie.posterUrl || 'https://placehold.co/40x60/2D3748/A0AEC0?text=No+Image'} 
                alt={movie.title}
                className={styles.poster}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/40x60/2D3748/A0AEC0?text=No+Image';
                }}
              />
            </div>
            <div className={styles.movie__info}>
              <div className={styles.title__row}>
                {movie.tmdbRating && (
                  <RatingBadge rating={movie.tmdbRating} className={styles.rating} />
                )}
                <div className={styles.title}>
                  {truncateText(movie.title, 40)}
                </div>
              </div>
              <div className={styles.meta__info}>
                {movie.originalTitle && movie.originalTitle !== movie.title && (
                  <span className={styles.original__title}>
                    {truncateText(movie.originalTitle, 35)}
                  </span>
                )}
                <span className={styles.year}>
                  {formatYear(movie.releaseYear)}
                </span>
              </div>
              {movie.genres && movie.genres.length > 0 && (
                <div className={styles.genres}>
                  {movie.genres.slice(0, 3).join(', ')}
                  {movie.genres.length > 3 && '...'}
                </div>
              )}
            </div>
          </NavLink>
        </li>
      ))}
      
      {results.length > 8 && (
        <li className={styles.more__results}>
          Показано 8 из {results.length} результатов
        </li>
      )}
    </ul>
  );
};

export default SearchResultsDropdown;