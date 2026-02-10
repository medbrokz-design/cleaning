/**
 * Утилиты валидации данных
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Валидация имени
 */
export const validateName = (name: string): ValidationResult => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Имя обязательно для заполнения' };
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Имя должно содержать минимум 2 символа' };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, error: 'Имя слишком длинное' };
  }
  
  // Проверка на спецсимволы (кроме дефиса и пробела)
  if (!/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Имя содержит недопустимые символы' };
  }
  
  return { isValid: true };
};

/**
 * Валидация телефона
 */
export const validatePhone = (phone: string): ValidationResult => {
  const numbers = phone.replace(/\D/g, '');
  
  if (!numbers) {
    return { isValid: false, error: 'Телефон обязателен для заполнения' };
  }
  
  if (numbers.length < 11) {
    return { isValid: false, error: 'Введите полный номер телефона' };
  }
  
  if (numbers.length > 11) {
    return { isValid: false, error: 'Номер телефона слишком длинный' };
  }
  
  // Проверка казахстанского номера
  if (!numbers.startsWith('7')) {
    return { isValid: false, error: 'Введите номер в формате +7' };
  }
  
  return { isValid: true };
};

/**
 * Валидация email
 */
export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Email обязателен для заполнения' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Введите корректный email адрес' };
  }
  
  return { isValid: true };
};

/**
 * Валидация адреса
 */
export const validateAddress = (address: string): ValidationResult => {
  const trimmed = address.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Адрес обязателен для заполнения' };
  }
  
  if (trimmed.length < 5) {
    return { isValid: false, error: 'Укажите более подробный адрес' };
  }
  
  if (trimmed.length > 200) {
    return { isValid: false, error: 'Адрес слишком длинный' };
  }
  
  return { isValid: true };
};

/**
 * Валидация площади
 */
export const validateArea = (area: number): ValidationResult => {
  if (!area || area <= 0) {
    return { isValid: false, error: 'Укажите площадь' };
  }
  
  if (area < 10) {
    return { isValid: false, error: 'Минимальная площадь — 10 м²' };
  }
  
  if (area > 1000) {
    return { isValid: false, error: 'Максимальная площадь — 1000 м²' };
  }
  
  return { isValid: true };
};

/**
 * Валидация даты (не раньше сегодня)
 */
export const validateFutureDate = (date: string): ValidationResult => {
  if (!date) {
    return { isValid: false, error: 'Выберите дату' };
  }
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return { isValid: false, error: 'Дата не может быть в прошлом' };
  }
  
  // Максимум 3 месяца вперёд
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  
  if (selectedDate > maxDate) {
    return { isValid: false, error: 'Выберите дату в пределах 3 месяцев' };
  }
  
  return { isValid: true };
};

/**
 * Валидация текстового поля (комментарий, отзыв)
 */
export const validateText = (text: string, options?: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}): ValidationResult => {
  const {
    required = false,
    minLength = 0,
    maxLength = 1000
  } = options || {};
  
  const trimmed = text.trim();
  
  if (required && !trimmed) {
    return { isValid: false, error: 'Поле обязательно для заполнения' };
  }
  
  if (trimmed.length > 0 && trimmed.length < minLength) {
    return { isValid: false, error: `Минимум ${minLength} символов` };
  }
  
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Максимум ${maxLength} символов` };
  }
  
  return { isValid: true };
};

/**
 * Санитизация текста (удаление опасных символов)
 */
export const sanitizeText = (text: string): string => {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

/**
 * Валидация формы заявки
 */
export const validateRequestForm = (data: {
  name: string;
  phone: string;
  address: string;
  area: number;
}): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const nameResult = validateName(data.name);
  if (!nameResult.isValid) errors.name = nameResult.error!;
  
  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.isValid) errors.phone = phoneResult.error!;
  
  const addressResult = validateAddress(data.address);
  if (!addressResult.isValid) errors.address = addressResult.error!;
  
  const areaResult = validateArea(data.area);
  if (!areaResult.isValid) errors.area = areaResult.error!;
  
  return errors;
};
