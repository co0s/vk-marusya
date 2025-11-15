import { useState, useEffect } from 'react';

// Этот хук принимает значение (value) и задержку (delay)
export function useDebounce<T>(value: T, delay: number): T {
  // Локальное состояние для "отложенного" значения
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Запускаем таймер, который обновит значение через 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер, если value изменилось (пользователь еще печатает)
    // Это и есть "Debounce"
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Эффект перезапустится, если изменится значение

  return debouncedValue;
}