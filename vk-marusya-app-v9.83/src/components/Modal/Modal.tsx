import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { modalAnimation } from '../../animations/animations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Блокируем скролл body при открытом модале
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Закрытие по клику на backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.modal__backdrop} onClick={handleBackdropClick}>
      <div
        ref={containerRef}
        className={styles.modal__container}
        onAnimationStart={() => {
          if (containerRef.current) modalAnimation.show(containerRef.current);
        }}
      >
        <div className={styles.modal__header}>
          {title && (
            <h2 className={styles.modal__title}>{title}</h2>
          )}
          <button
            className={styles.modal__close}
            onClick={() => {
              if (containerRef.current) {
                modalAnimation.hide(containerRef.current).then(onClose);
              } else {
                onClose();
              }
            }}
            aria-label="Закрыть модальное окно"
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
        <div className={styles.modal__content}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;