import styles from "./RefreshButton.module.css";
// import refresh from '../../assets/refresh.png';

// Интерфейс для пропсов
interface RefreshButtonProps {
  onRefresh: () => void;
  disabled?: boolean;
}

// Кнопка "Обновить"
export const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh, disabled = false }) => (
  <button
    onClick={onRefresh}
    className={styles.icon__button}
    title={disabled ? 'Загрузка нового фильма...' : 'Показать другой случайный фильм'}
    disabled={disabled}
    aria-busy={disabled}
  >
    <span className={styles.refresh__icon}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4C14.7486 4 17.1749 5.38626 18.6156 7.5H16V9.5H22V3.5H20V5.99936C18.1762 3.57166 15.2724 2 12 2C6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4ZM20 12C20 16.4183 16.4183 20 12 20C9.25144 20 6.82508 18.6137 5.38443 16.5H8V14.5H2V20.5H4V18.0006C5.82381 20.4283 8.72764 22 12 22C17.5228 22 22 17.5228 22 12H20Z"
          fill="white"
        />
      </svg>
    </span>
  </button>
);
