import React, { useEffect, useState, lazy, Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { logoutUser, checkAuth, selectUser, selectIsAuthenticated } from '../../store/slices/userSlice';
import Modal from '../Modal/Modal';
import styles from './LoginButton.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';

// Lazy loading для форм авторизации (загружаются только при открытии модалки)
const LoginForm = lazy(() => import('../LoginForm/LoginForm'));
const RegisterForm = lazy(() => import('../RegisterForm/RegisterForm'));

const LoginButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleOpenModal = (modalType: 'login' | 'register') => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleSwitchModal = (modalType: 'login' | 'register') => {
    setActiveModal(modalType);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const getDisplayName = () => {
    if (!user) return '';
    
    if (user.name && user.surname) {
      return `${user.name} ${user.surname}`;
    }
    
    return user.name || user.email;
  };

  // Если пользователь авторизован
  if (isAuthenticated && user) {
    return (
      <div className={styles.user__container}>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `${styles.user__profile} ${isActive ? styles.active : ''}`}
        >
          <div className={styles.user__avatar}>
            {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
          </div>
          <span className={styles.user__name}>
            {getDisplayName()}
          </span>
        </NavLink>
        
        <button 
          onClick={handleLogout}
          className={styles.logout__button}
          title="Выйти"
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
        </button>
      </div>
    );
  }

  // Если пользователь не авторизован
  return (
    <div className={styles.auth__container}>
      <button 
        className={styles.button}
        onClick={() => handleOpenModal('login')}
      >
        Войти
      </button>

      {/* Модальное окно входа */}
      <Modal 
        isOpen={activeModal === 'login'} 
        onClose={handleCloseModal}
      >
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</div>}>
          <LoginForm 
            onClose={handleCloseModal}
            onSwitchToRegister={() => handleSwitchModal('register')}
          />
        </Suspense>
      </Modal>

      <Modal
        isOpen={activeModal === 'register'}
        onClose={handleCloseModal}
      >
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</div>}>
          <RegisterForm
            onClose={handleCloseModal}
            onSwitchToLogin={() => handleSwitchModal('login')}
          />
        </Suspense>
      </Modal>
    </div>
  );
};

export default LoginButton;