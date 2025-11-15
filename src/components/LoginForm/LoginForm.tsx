import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { loginUser, clearError, selectUserStatus, selectUserError } from '../../store/slices/userSlice';
import type { LoginData } from '../../types/user';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSwitchToRegister }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectUserStatus);
  const error = useAppSelector(selectUserError);
  useEffect(() => {
    return () => {
      dispatch(clearError());
      setFormErrors({});
    };
  }, [dispatch]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<LoginData>>({});

  const getFieldError = (name: keyof LoginData, value: string): string | undefined => {
    if (name === 'email') {
      if (!value) {
        return 'Email обязателен';
      }
      if (!/\S+@\S+\.\S+/.test(value)) {
        return 'Некорректный email';
      }
      return undefined;
    }

    if (name === 'password') {
      if (!value) {
        return 'Пароль обязателен';
      }
      if (value.length < 6) {
        return 'Пароль должен содержать минимум 6 символов';
      }
      return undefined;
    }

    return undefined;
  };
  // Валидация формы
  const validateForm = (): boolean => {
    const errors: Partial<LoginData> = {};

    (Object.keys(formData) as Array<keyof LoginData>).forEach((key) => {
      const errorMessage = getFieldError(key, formData[key]);
      if (errorMessage) {
        errors[key] = errorMessage;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const fieldName = name as keyof LoginData;
    const fieldError = getFieldError(fieldName, value);
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: fieldError,
    }));

    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(result)) {
        onClose();
        navigate('/profile');
      }
    } catch (error: unknown) {
      console.error('Ошибка при авторизации:', error);
    }
  };

  return (
    <div className={styles.form__container}>
      <h2 className={styles.form__title}>Вход в систему</h2>
      
      {error && (
        <div className={styles.error__message}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form__group}>
          <label htmlFor="email" className={styles.form__label}>
            Электронная почта
          </label>
          <div className={styles.input__container}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.form__input} ${formErrors.email ? styles.form__input_error : ''}`}
              placeholder="Электронная почта"
            />
            <svg className={styles.input__icon} width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {formErrors.email && (
            <span className={styles.field__error}>{formErrors.email}</span>
          )}
        </div>

        <div className={styles.form__group}>
          <label htmlFor="password" className={styles.form__label}>
            Пароль
          </label>
          <div className={styles.input__container}>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.form__input} ${formErrors.password ? styles.form__input_error : ''}`}
              placeholder="Пароль"
            />
            <svg className={styles.input__icon} width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {formErrors.password && (
            <span className={styles.field__error}>{formErrors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submit__button}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Выполняется вход...' : 'Войти'}
        </button>
      </form>

      <div className={styles.form__footer}>
        <p className={styles.switch__text}>
          Нет аккаунта?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className={styles.switch__button}
          >
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;