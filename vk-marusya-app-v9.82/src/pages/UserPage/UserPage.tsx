import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, NavLink } from 'react-router-dom';
import type { AppDispatch } from '../../store/store';
import { selectUser, selectIsAuthenticated, selectFavoriteMovies, logoutUser, checkAuth } from '../../store/slices/userSlice';
import { FavouriteButton } from '../../components/FavouriteButton/FavouriteButton';
import styles from './UserPage.module.css';

type TabType = 'favorites' | 'settings';

const UserPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const favoriteMovies = useSelector(selectFavoriteMovies);
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const savedTab = localStorage.getItem('userPageActiveTab');
    return (savedTab as TabType) || 'favorites';
  });
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    if (!initialCheckDone) {
      dispatch(checkAuth()).finally(() => {
        setInitialCheckDone(true);
      });
    }
  }, [dispatch, initialCheckDone]);

  // Показываем загрузку пока не завершена первоначальная проверка
  if (!initialCheckDone) {
    return (
      <div className={styles.loading__container}>
        <div className={styles.loading__content}>
          <div className={styles.loading__spinner}></div>
          <div className={styles.loading__text}>Проверка авторизации...</div>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован после проверки, перенаправляем на главную
  if (initialCheckDone && (!isAuthenticated || !user)) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    localStorage.setItem('userPageActiveTab', tab);
  };

  const getInitials = () => {
    if (!user) return '';
    const firstName = user.name || '';
    const lastName = user.surname || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return '';
    if (user.name && user.surname) {
      return `${user.name} ${user.surname}`;
    }
    return user.name || user.email;
  };

  const renderFavoritesTab = () => (
    <div className={styles.favorites__content}>
      {favoriteMovies.length === 0 ? (
        <div className={styles.empty__state}>
          <h3>У вас пока нет избранных фильмов</h3>
          <p>Добавляйте фильмы в избранное, нажимая на ❤️ в карточках фильмов</p>
        </div>
      ) : (
        <div className={styles.movies__grid}>
          {favoriteMovies.map((movie) => (
            <div key={movie.id} className={styles.movie__card}>
              <div className={styles.poster__container}>
                <NavLink to={`/movie/${movie.id}`}>
                  <img 
                    src={movie.posterUrl || 'https://placehold.co/300x450/1A1D2E/76a9fa?text=Нет+Постера'} 
                    alt={movie.title}
                    className={styles.poster__img}
                  />
                </NavLink>
                <div className={styles.favorite__button__overlay}>
                  <FavouriteButton movie={movie} />
                </div>
              </div>
              <div className={styles.movie__info}>
                <h4 className={styles.movie__title}>{movie.title}</h4>
                <p className={styles.movie__year}>{movie.releaseDate}</p>
                {movie.tmdbRating && (
                  <div className={styles.rating}>
                    <span className={styles.rating__badge}>
                      ⭐ {movie.tmdbRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className={styles.settings__content}>
      <div className={styles.profile__section}>
        <div className={styles.avatar__section}>
          <div className={styles.avatar__large}>
            {getInitials()}
          </div>
          <div className={styles.user__details}>
            <h2 className={styles.user__name}>{getDisplayName()}</h2>
          </div>
        </div>

        <div className={styles.info__section}>
          <div className={styles.info__grid}>
            <div className={styles.info__item}>
              <div className={styles.info__icon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.info__text}>
                <span className={styles.info__label}>Имя Фамилия</span>
                <span className={styles.info__value}>{getDisplayName()}</span>
              </div>
            </div>
            
            <div className={styles.info__item}>
              <div className={styles.info__icon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.info__text}>
                <span className={styles.info__label}>Электронная почта</span>
                <span className={styles.info__value}>{user?.email}</span>
              </div>
            </div>

            <div className={styles.info__item}>
              <div className={styles.info__icon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className={styles.info__text}>
                <span className={styles.info__label}>Пароль</span>
                <span className={styles.info__value}>{user?.password || 'Не задан'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions__section}>
          <button 
            onClick={handleLogout}
            className={styles.logout__button}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.user__page}>
      <div className={styles.container}>
        <div className={styles.page__header}>
          <h1 className={styles.page__title}>Мой аккаунт</h1>
        </div>

        <div className={styles.tabs__container}>
          <div className={styles.tabs__header}>
            <button
              className={`${styles.tab__button} ${activeTab === 'favorites' ? styles.tab__active : ''}`}
              onClick={() => handleTabChange('favorites')}
            >
              Избранные фильмы
              {favoriteMovies.length > 0 && (
                <span className={styles.tab__count}>{favoriteMovies.length}</span>
              )}
            </button>
            <button
              className={`${styles.tab__button} ${activeTab === 'settings' ? styles.tab__active : ''}`}
              onClick={() => handleTabChange('settings')}
            >
              Настройка аккаунта
            </button>
          </div>

          <div className={styles.tab__content}>
            {activeTab === 'favorites' ? renderFavoritesTab() : renderSettingsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;