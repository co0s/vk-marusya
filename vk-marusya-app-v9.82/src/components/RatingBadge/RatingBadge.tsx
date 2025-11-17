import React from "react";
import styles from "./RatingBadge.module.css";

interface RatingBadgeProps {
  rating: number;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  className,
}) => {
  const getRatingClass = (rating: number) => {
    if (rating >= 8.0) return styles.rating__excellent; // Зеленый
    if (rating >= 6.0) return styles.rating__good; // Желтый
    if (rating >= 4.0) return styles.rating__average; // Серый
    return styles.rating__poor; // Красный
  };

  return (
    <span
      className={`${styles.rating__badge} ${getRatingClass(rating)} ${
        className || ""
      }`}
    >
      <span className={styles.rating__icon}>⭐</span>
      {rating.toFixed(1)}
    </span>
  );
};

export default RatingBadge;
