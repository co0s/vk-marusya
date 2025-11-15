import styles from './GenresCard.module.css';

import { NavLink } from 'react-router-dom';

interface GenreCardProps {
    name: string;
    englishName: string; // Имя жанра на английском для API-запроса
    imageUrl: string; // Заглушка изображения для фона
    gradient?: string; // Градиент для оверлея
}




const GenreCard: React.FC<GenreCardProps> = ({ name, englishName, imageUrl, gradient }) => {
    
    // Переход на страницу фильтрации по жанру: /genres/action
    const toUrl = `/genres/${englishName.toLowerCase()}`;
    
    return (
        <NavLink to={toUrl} className={styles.card__link}>
            <div className={styles.card__container}>
                
                {/* Фоновое изображение */}
                <img 
                    src={imageUrl}
                    alt={name}
                    className={styles.poster__img}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/2D3748/A0AEC0?text=Нет+Изображения';
                    }}
                />
                
                {/* Градиентный оверлей */}
                {gradient && (
                    <div 
                        className={styles.gradient__overlay}
                        style={{ background: gradient }}
                    />
                )}
                
                {/* Название жанра */}
                <div className={styles.title__overlay}>
                    {name}
                </div>
            </div>
        </NavLink>
    );
};

export default GenreCard;