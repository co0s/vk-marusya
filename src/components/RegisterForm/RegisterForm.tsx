import React, { useEffect, useState } from "react";
import type { RegisterData } from "../../types/user";
import styles from "./RegisterForm.module.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import {
  registerUser,
  clearError,
  selectUserStatus,
  selectUserError,
} from "../../store/slices/userSlice";

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onClose,
  onSwitchToLogin,
}) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectUserStatus);
  const error = useAppSelector(selectUserError);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<RegisterData>>({});

  const getFieldError = (
    name: keyof RegisterData,
    value: string,
    data: RegisterData
  ): string | undefined => {
    if (name === "email") {
      if (!value) {
        return "Email обязателен";
      }
      if (!/\S+@\S+\.\S+/.test(value)) {
        return "Некорректный email";
      }
      return undefined;
    }

    if (name === "password") {
      if (!value) {
        return "Пароль обязателен";
      }
      if (value.length < 6) {
        return "Пароль должен содержать минимум 6 символов";
      }
      return undefined;
    }

    if (name === "confirmPassword") {
      if (!value) {
        return "Подтверждение пароля обязательно";
      }
      if (value !== data.password) {
        return "Пароли не совпадают";
      }
      return undefined;
    }

    if (name === "name") {
      if (!value) {
        return "Имя обязательно";
      }
      if (value.length < 2) {
        return "Имя должно содержать минимум 2 символа";
      }
      return undefined;
    }

    return undefined;
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
      setFormErrors({});
    };
  }, [dispatch]);
  // Валидация формы
  const validateForm = (): boolean => {
    const errors: Partial<RegisterData> = {};

    (Object.keys(formData) as Array<keyof RegisterData>).forEach((key) => {
      const value = formData[key] ?? "";
      const errorMessage = getFieldError(key, value, formData);
      if (errorMessage) {
        errors[key] = errorMessage;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextData: RegisterData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextData);

    const fieldName = name as keyof RegisterData;
    const fieldError = getFieldError(fieldName, value, nextData);
    setFormErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
      ...(fieldName === "password"
        ? {
            confirmPassword: getFieldError(
              "confirmPassword",
              nextData.confirmPassword ?? "",
              nextData
            ),
          }
        : {}),
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
      const result = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(result)) {
        onClose();
        navigate("/profile");
      }
    } catch (error: unknown) {
      console.error("Ошибка при регистрации:", error);
    }
  };

  return (
    <div className={styles.form__container}>
      <h2 className={styles.form__title}>Регистрация</h2>

      {error && <div className={styles.error__message}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form__row}>
          <div className={styles.form__group}>
            <label htmlFor="name" className={styles.form__label}>
              Имя *
            </label>
            <div className={styles.input__container}>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.form__input} ${
                  formErrors.name ? styles.form__input_error : ""
                }`}
                placeholder="Имя"
              />
              <svg
                className={styles.input__icon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            {formErrors.name && (
              <span className={styles.field__error}>{formErrors.name}</span>
            )}
          </div>

          <div className={styles.form__group}>
            <label htmlFor="surname" className={styles.form__label}>
              Фамилия
            </label>
            <div className={styles.input__container}>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className={styles.form__input}
                placeholder="Фамилия"
              />
              <svg
                className={styles.input__icon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.form__group}>
          <label htmlFor="email" className={styles.form__label}>
            Электронная почта *
          </label>
          <div className={styles.input__container}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.form__input} ${
                formErrors.email ? styles.form__input_error : ""
              }`}
              placeholder="Электронная почта"
            />
            <svg
              className={styles.input__icon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="22,6 12,13 2,6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {formErrors.email && (
            <span className={styles.field__error}>{formErrors.email}</span>
          )}
        </div>

        <div className={styles.form__group}>
          <label htmlFor="password" className={styles.form__label}>
            Пароль *
          </label>
          <div className={styles.input__container}>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.form__input} ${
                formErrors.password ? styles.form__input_error : ""
              }`}
              placeholder="Пароль"
            />
            <svg
              className={styles.input__icon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {formErrors.password && (
            <span className={styles.field__error}>{formErrors.password}</span>
          )}
        </div>

        <div className={styles.form__group}>
          <label htmlFor="confirmPassword" className={styles.form__label}>
            Подтверждение пароля *
          </label>
          <div className={styles.input__container}>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`${styles.form__input} ${
                formErrors.confirmPassword ? styles.form__input_error : ""
              }`}
              placeholder="Подтвердите пароль"
            />
            <svg
              className={styles.input__icon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {formErrors.confirmPassword && (
            <span className={styles.field__error}>
              {formErrors.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submit__button}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>

      <div className={styles.form__footer}>
        <p className={styles.switch__text}>
          Уже есть аккаунт?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className={styles.switch__button}
          >
            Войти
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
