import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchMoviesByFilter, loadMoreMovies } from '../../store/slices/moviesSlice'; 
import SimpleMovieCard from "../../components/SimpleMovieCard/SimpleMovieCard"

import styles from './FilteredMoviesPage.module.css';
import type { IMovie } from '../../types/movie';




const FilteredMoviesPage: React.FC = () => {
    // Получаем имя жанра из URL
    const { genreName } = useParams<{ genreName: string }>();
    const genreTitle = genreName ? genreName.toUpperCase() : 'Фильмы';
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();
    // Читаем из state.movies
    const { filteredMovies, status, genreCache, currentGenre, displayedCount } = useSelector((state: RootState) => state.movies);

    // Загрузка фильмов по жанру
    useEffect(() => {
        if (genreName) {
            // Проверяем, нужно ли загружать данные
            const isCached = genreCache[genreName] && genreCache[genreName].length > 0;
            const isSameGenre = currentGenre === genreName;
            
            console.log(`[FilteredMoviesPage] Жанр: ${genreName}`);
            console.log(`[FilteredMoviesPage] В кэше: ${isCached ? 'Да' : 'Нет'}`);
            console.log(`[FilteredMoviesPage] Текущий жанр: ${currentGenre}`);
            console.log(`[FilteredMoviesPage] Тот же жанр: ${isSameGenre ? 'Да' : 'Нет'}`);
            
            // Всегда вызываем dispatch - логика кэширования внутри thunk
            dispatch(fetchMoviesByFilter({ genre: genreName }));
        }
    }, [dispatch, genreName, genreCache, currentGenre]);




    const handleGoBack = () => {
        navigate('/genres');
    };

    const handleLoadMore = () => {
        dispatch(loadMoreMovies());
    };

    // Вычисляем, сколько фильмов показывать
    const moviesToDisplay = filteredMovies.slice(0, displayedCount);
    const hasMore = displayedCount < filteredMovies.length;

    return (
        <div className={styles.page__container}>
            <div className={styles.titleRow}>
                <button 
                    type="button" 
                    className={styles.backButton}
                    onClick={handleGoBack}
                    aria-label="Назад к списку жанров"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.7071 5.29289C15.0976 5.68342 15.0976 6.31658 14.7071 6.70711L10.4142 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H10.4142L14.7071 17.2929C15.0976 17.6834 15.0976 18.3166 14.7071 18.7071C14.3166 19.0976 13.6834 19.0976 13.2929 18.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289Z" fill="white"/>
                    </svg>
                </button>
                <h1 className={styles.title}>Фильмы в жанре "{genreTitle}"</h1>
            </div>
            
            {status === 'loading' && (
                <div className={styles.loading__container}>
                    <div className={styles.loading__content}>
                        <div className={styles.loading__spinner}></div>
                        <div className={styles.loading__text}>Загрузка фильмов жанра "{genreTitle}"...</div>
                    </div>
                </div>
            )}
            
            {status === 'failed' && (
                <div className={styles.loading__container}>
                    <div className={styles.loading__content}>
                        <div className={styles.loading__text}>Ошибка загрузки. Попробуйте еще раз.</div>
                    </div>
                </div>
            )}

            {/* Показываем только первые N фильмов */}
            {Array.isArray(moviesToDisplay) && moviesToDisplay.length > 0 && (
                <>
                    <div className={styles.movies__grid}>
                        {moviesToDisplay.map((movie: IMovie) => (
                            <SimpleMovieCard 
                                key={movie.id} 
                                id={movie.id} 
                                poster={movie.posterUrl}
                                showRank={false}
                            />
                        ))}
                    </div>
                    
                    {/* Кнопка "Загрузить еще" */}
                    {hasMore && (
                        <div className={styles.loadMore__container}>
                            <button 
                                type="button"
                                className={styles.loadMore__button}
                                onClick={handleLoadMore}
                            >
                                Загрузить еще ({filteredMovies.length - displayedCount} фильмов)
                            </button>
                        </div>
                    )}
                </>
            )}
            
            {/* Это условие сработает, только если загрузка ('idle') завершена и массив пуст */}
            {(status === 'idle' && filteredMovies.length === 0) && (
                <p className="text-gray-400 p-10">По вашему запросу фильмов не найдено.</p>
            )}
        </div>
    );
};

export default FilteredMoviesPage;