import { NavLink } from "react-router-dom";

import styles from "./SimpleMovieCard.module.css";
// Временно создадим компонент-заглушку для карточки, чтобы увидеть данные
type SimpleMovieCardProps = {
  id: number;
  rank?: number;
  poster?: string; // Постер как строка (URL)
  showRank?: boolean;
};

const SimpleMovieCard = ({
  id,
  rank,
  poster,
  showRank = true,
}: SimpleMovieCardProps) => (
  <NavLink to={`/movie/${id}`}>
    <li className={styles.card__item}>
      {/* 2. НОМЕР РАНГА СВЕРХУ */}
      {showRank && typeof rank === "number" && (
        <span className={styles.rankBadge}>{rank}</span>
      )}
      {/* 3. ПОСТЕР ФИЛЬМА */}
      <div className={styles.poster__container}>
        <img
          src={
            poster ||
            "https://placehold.co/300x450/1A1D2E/76a9fa?text=Нет+Постера"
          }
          alt={`Постер ${id}`}
          className={styles.poster__img}
        />
      </div>
    </li>
  </NavLink>
);

export default SimpleMovieCard;
