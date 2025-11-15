import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./TrailerModal.module.css";
import { modalAnimation } from "../../animations/animations";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  movieTitle: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailerUrl,
  movieTitle,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Обработчик закрытия с анимацией
  const handleClose = useCallback(() => {
    setIsClosing(true);
    if (containerRef.current) {
      modalAnimation.hide(containerRef.current).then(() => {
        onClose();
        setIsClosing(false);
      });
    } else {
      onClose();
      setIsClosing(false);
    }
  }, [onClose]);

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Блокируем скролл страницы
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  // Обработка клика вне модального окна
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  // Получение ID видео из YouTube URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Конвертация YouTube URL в embed URL
  const getEmbedUrl = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    return url;
  };

  if (!isOpen || !trailerUrl) return null;

  return createPortal(
    <div
      className={`${styles.modal__backdrop} ${
        isClosing ? styles.modal__backdrop_closing : ""
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={containerRef}
        className={`${styles.modal__container} ${
          isClosing ? styles.modal__container_closing : ""
        }`}
        onAnimationStart={() => {
          if (containerRef.current) modalAnimation.show(containerRef.current);
        }}
      >
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>{movieTitle}</h2>
          <span className={styles.trailer__label}>Трейлер</span>
          <button
            className={styles.close__button}
            onClick={handleClose}
            aria-label="Закрыть трейлер"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.video__container}>
          <div className={styles.play__overlay}>
            <div className={styles.play__button}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <iframe
            src={getEmbedUrl(trailerUrl)}
            title={`${movieTitle} Трейлер`}
            className={styles.video__iframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
