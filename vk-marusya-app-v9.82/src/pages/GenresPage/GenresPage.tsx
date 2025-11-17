import styles from './GenresPage.module.css';

import GenreCard from '../../components/GenresCard/GenresCard';

const GENRES = [
    { 
        name: 'Боевик', 
        englishName: 'action', 
        imageUrl: 'https://www.themoviedb.org/t/p/w500/qAKvO3hF7yW6PYbG8SnQlFHHZfI.jpg', // The Dark Knight
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #d63031 100%)'
    },
    { 
        name: 'Драма', 
        englishName: 'drama', 
        imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
    },
    { 
        name: 'Комедия', 
        englishName: 'comedy', 
        imageUrl: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)'
    },
    { 
        name: 'Ужасы', 
        englishName: 'horror', 
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)'
    },
    { 
        name: 'Фантастика', 
        englishName: 'scifi', 
        imageUrl: 'https://www.themoviedb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', // The Matrix
        gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)'
    },
    { 
        name: 'Триллер', 
        englishName: 'thriller', 
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)'
    },
    { 
        name: 'Романтика', 
        englishName: 'romance', 
        imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #fab1a0 0%, #e17055 100%)'
    },
    { 
        name: 'Приключения', 
        englishName: 'adventure', 
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #55a3ff 0%, #003d82 100%)'
    },
    { 
        name: 'Криминал', 
        englishName: 'crime', 
        imageUrl: 'https://www.themoviedb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', // The Godfather
        gradient: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)'
    },
    { 
        name: 'Семейный', 
        englishName: 'family', 
        imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
    },
    { 
        name: 'Документальный', 
        englishName: 'documentary', 
        imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #b2bec3 0%, #636e72 100%)'
    },
    { 
        name: 'Музыка', 
        englishName: 'music', 
        imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)'
    },
    { 
        name: 'Военный', 
        englishName: 'war', 
        imageUrl: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)'
    },
    { 
        name: 'Вестерн', 
        englishName: 'western', 
        imageUrl: 'https://www.themoviedb.org/t/p/w500/tHbMIIF51rguMNSastqoQwR0sBs.jpg', // Once Upon a Time in the West
        gradient: 'linear-gradient(135deg, #d63031 0%, #74b9ff 100%)'
    },
    { 
        name: 'Анимация', 
        englishName: 'animation', 
        imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)'
    },
    { 
        name: 'Стендап', 
        englishName: 'stand-up', 
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)'
    },
    { 
        name: 'ТВ-фильм', 
        englishName: 'tv-movie', 
        imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)'
    },
    { 
        name: 'Фэнтези', 
        englishName: 'fantasy', 
        imageUrl: 'https://www.themoviedb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', // The Lord of the Rings
        gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)'
    },
    { 
        name: 'Детектив', 
        englishName: 'mystery', 
        imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)'
    },
    { 
        name: 'История', 
        englishName: 'history', 
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80',
        gradient: 'linear-gradient(135deg, #e17055 0%, #fab1a0 100%)'
    }
];

const GenresPage: React.FC = () => {
    return (
        <div className={styles.page__container}>
            <h1 className={styles.title}>Жанры фильмов</h1>
            
            <div className={styles.genres__grid}>
                {GENRES.map(genre => (
                    <GenreCard 
                        key={genre.englishName}
                        name={genre.name}
                        englishName={genre.englishName}
                        imageUrl={genre.imageUrl}
                        gradient={genre.gradient}
                    />
                ))}
            </div>
        </div>
    );
};

export default GenresPage;