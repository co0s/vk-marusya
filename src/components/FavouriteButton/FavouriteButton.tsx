import { useDispatch, useSelector } from 'react-redux';
import styles from './FavouriteButton.module.css';
import { addToFavorites, removeFromFavorites, selectFavoriteMovies, selectIsAuthenticated } from '../../store/slices/userSlice';
import type { IMovie } from '../../types/movie';

interface FavouriteButtonProps {
  movie: IMovie;
  className?: string;
}

// Переиспользуемый компонент кнопки "Избранное"
export const FavouriteButton = ({ movie, className }: FavouriteButtonProps) => {
  const dispatch = useDispatch();
  const favoriteMovies = useSelector(selectFavoriteMovies);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Проверяем, находится ли фильм в избранном
  const isFavorite = favoriteMovies.some(favMovie => favMovie.id === movie.id);
  
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      alert('Пожалуйста, войдите в систему, чтобы добавлять фильмы в избранное');
      return;
    }
    
    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      dispatch(addToFavorites(movie));
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