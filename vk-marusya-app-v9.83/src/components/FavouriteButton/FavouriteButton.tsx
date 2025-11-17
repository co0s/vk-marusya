import { useSelector } from 'react-redux';
import styles from './FavouriteButton.module.css';
import { addFavoriteToServer, removeFavoriteFromServer, selectFavoriteMovies, selectIsAuthenticated } from '../../store/slices/userSlice';
import type { IMovie } from '../../types/movie';
import { useAppDispatch } from '../../hooks/storeHooks';
import { logger } from '../../utils/logger';

interface FavouriteButtonProps {
  movie: IMovie;
  className?: string;
}

// Переиспользуемый компонент кнопки "Избранное"
export const FavouriteButton = ({ movie, className }: FavouriteButtonProps) => {
  const dispatch = useAppDispatch();
  const favoriteMovies = useSelector(selectFavoriteMovies);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Проверяем, находится ли фильм в избранном
  const isFavorite = favoriteMovies.some(favMovie => favMovie.id === movie.id);
  
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Пожалуйста, войдите в систему, чтобы добавлять фильмы в избранное');
      return;
    }
    
    try {
      if (isFavorite) {
        await dispatch(removeFavoriteFromServer(movie.id)).unwrap();
      } else {
        await dispatch(addFavoriteToServer(movie)).unwrap();
      }
    } catch (error) {
      logger.error('Ошибка при изменении избранного:', error);
      alert('Не удалось изменить избранное. Попробуйте позже.');
    }
  };

  return (
    <button 
      className={`${styles.icon__button} ${styles.favorite__icon} ${isFavorite ? styles.favorite__active : ''} ${className || ''}`}
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <span className={styles.heartIcon} aria-hidden="true" />
    </button>
  );
};