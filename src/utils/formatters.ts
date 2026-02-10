/**
 * Утилиты форматирования данных
 */

/**
 * Форматирование телефона в формат +7 (XXX) XXX-XX-XX
 */
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  if (numbers.length <= 1) return `+7 (${numbers}`;
  if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`;
  if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
  if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
  return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
};

/**
 * Валидация телефона
 */
export const isValidPhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length === 11;
};

/**
 * Форматирование цены в тенге
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('ru-RU') + ' ₸';
};

/**
 * Форматирование диапазона цен
 */
export const formatPriceRange = (min: number, max: number): string => {
  return `${min.toLocaleString('ru-RU')} — ${max.toLocaleString('ru-RU')} ₸`;
};

/**
 * Форматирование даты
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Форматирование даты и времени
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Относительное время (2 часа назад, вчера и т.д.)
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
  
  return formatDate(date);
};

/**
 * Форматирование площади
 */
export const formatArea = (area: number): string => {
  return `${area} м²`;
};

/**
 * Склонение слов (1 санузел, 2 санузла, 5 санузлов)
 */
export const pluralize = (count: number, words: [string, string, string]): string => {
  const cases = [2, 0, 1, 1, 1, 2];
  const index = count % 100 > 4 && count % 100 < 20 
    ? 2 
    : cases[Math.min(count % 10, 5)];
  return `${count} ${words[index]}`;
};

// Готовые склонения
export const pluralizeRooms = (count: number) => pluralize(count, ['комната', 'комнаты', 'комнат']);
export const pluralizeBathrooms = (count: number) => pluralize(count, ['санузел', 'санузла', 'санузлов']);
export const pluralizeHours = (count: number) => pluralize(count, ['час', 'часа', 'часов']);
export const pluralizeMinutes = (count: number) => pluralize(count, ['минута', 'минуты', 'минут']);
export const pluralizeOrders = (count: number) => pluralize(count, ['заказ', 'заказа', 'заказов']);
export const pluralizeReviews = (count: number) => pluralize(count, ['отзыв', 'отзыва', 'отзывов']);
