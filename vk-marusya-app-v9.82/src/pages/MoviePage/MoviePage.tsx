import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchMovieById } from '../../store/slices/moviesSlice';
import { FavouriteButton } from '../../components/FavouriteButton/FavouriteButton';
import { TrailerModal } from '../../components/TrailerModal/TrailerModal';
import RatingBadge from '../../components/RatingBadge/RatingBadge';
import styles from './MoviePage.module.css';

const MoviePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const movieId = id ? parseInt(id, 10) : null;
    const dispatch = useDispatch<AppDispatch>();
    
    // Состояние для модального окна трейлера
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    
    const { currentMovie: movie, status } = useSelector((state: RootState) => state.movies);
    
    // Выводим объект фильма в консоль
    console.log('🎬 [MoviePage] Объект фильма:', movie);
    console.log('📊 [MoviePage] Статус загрузки:', status);
    console.log('🆔 [MoviePage] ID фильма:', movieId);

    // Обработчики для трейлера
    const handleTrailerClick = () => {
        if (movie?.trailerUrl) {
            setIsTrailerModalOpen(true);
        }
    };

    const handleCloseTrailer = () => {
        setIsTrailerModalOpen(false);
    };

    useEffect(() => {
        if (movieId !== null) {
            dispatch(fetchMovieById(movieId));
        }
    }, [dispatch, movieId]);

    if (status === 'loading') {
        return (
            <div className={styles.loading__container}>
                <div className={styles.loading__content}>
                    <div className={styles.loading__spinner}></div>
                    <div className={styles.loading__text}>Загрузка фильма...</div>
                </div>
            </div>
        );
    }

    if (status === 'failed' || !movie) {
        return (
            <div className={styles.loading__container}>
                <div className={styles.loading__content}>
                    <div className={styles.loading__text}>Ошибка загрузки фильма</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '8px' }}>
                        Фильм с ID {movieId} не найден
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={styles.hero__container}
            style={{
                backgroundImage: `url(${movie.backdropUrl || movie.posterUrl || ''})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Внутренний контейнер контента */}
            <div className={styles.content__wrapper}>
                
                {/* 1. Блок с информацией */}
                <div className={styles.info__block}>
                    
                    {/* Мета-информация */}
                    <div className={styles.meta__info}>
                        {movie.tmdbRating && (
                            <RatingBadge rating={movie.tmdbRating} />
                        )}
                        <span>{movie.releaseYear}</span>
                        <span>•</span>
                        <span>{movie.genres?.slice(0, 2).join(', ') || 'детектив'}</span>
                        <span>•</span>
                        <span>{movie.runtime} мин</span>
                    </div>

                    <h1 className={styles.title}>{movie.title}</h1>

                    <p className={styles.plot}>{movie.plot || 'Увлекательные приключения самого известного сыщика всех времен.'}</p>
                    
                    {/* Кнопки */}
                    <div className={styles.buttons__container}>
                        <button 
                            className={styles.btn__primary}
                            onClick={handleTrailerClick}
                            disabled={!movie.trailerUrl}
                        >
                            Трейлер
                        </button>
                        <FavouriteButton movie={movie} />
                    </div>
                </div>
                
                {/* 2. Постер справа */}
                <div className={styles.poster__block}>
                    <img 
                        src={movie.posterUrl || 'https://placehold.co/300x450/1A1D2E/76a9fa'}
                        alt={movie.title} 
                        className={styles.poster__img}
                    />
                </div>

            </div>

            {/* Секция "О фильме" */}
            <div className={styles.details__section}>
                <h2 className={styles.details__title}>О фильме</h2>
                
                <div className={styles.details__grid}>
                    <div className={styles.details__row}>
                        <span className={styles.details__label}>Язык оригинала</span>
                        <span className={styles.details__value}>{movie.language || 'Русский'}</span>
                    </div>
                    
                    <div className={styles.details__row}>
                        <span className={styles.details__label}>Бюджет</span>
                        <span className={styles.details__value}>{movie.budget || '250 000 руб.'}</span>
                    </div>
                    
                    <div className={styles.details__row}>
                        <span className={styles.details__label}>Выручка</span>
                        <span className={styles.details__value}>{movie.revenue || '2 835 000 руб.'}</span>
                    </div>
                    
                    <div className={styles.details__row}>
                        <span className={styles.details__label}>Режиссер</span>
                        <span className={styles.details__value}>{movie.director || 'Игорь Масленников'}</span>
                    </div>
                    
                    <div className={styles.details__row}>
                        <span className={styles.details__label}>Продакшен</span>
                        <span className={styles.details__value}>Ленфильм</span>
                    </div>
                    
                    <div className={styles.details__row}>
                        <span className={styles.details__label}>Награды</span>
                        <span className={styles.details__value}>Топ-250. 33 место</span>
                    </div>
                </div>
            </div>

            {/* Модальное окно трейлера */}
            <TrailerModal
                isOpen={isTrailerModalOpen && !!movie.trailerUrl}
                onClose={handleCloseTrailer}
                trailerUrl={movie.trailerUrl || ''}
                movieTitle={movie.title}
            />
        </div>
    );
};

export default MoviePage;
