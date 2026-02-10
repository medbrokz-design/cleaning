/**
 * Константы приложения
 */

// Районы Алматы
export const DISTRICTS = [
  'Алмалинский',
  'Ауэзовский',
  'Бостандыкский',
  'Жетысуский',
  'Медеуский',
  'Наурызбайский',
  'Турксибский',
  'Алатауский'
] as const;

export type District = typeof DISTRICTS[number];

// Типы помещений
export const PROPERTY_TYPES = {
  apartment: { label: 'Квартира', icon: '🏠', description: 'Жилая квартира' },
  house: { label: 'Дом', icon: '🏡', description: 'Частный дом' },
  office: { label: 'Офис', icon: '🏢', description: 'Офисное помещение' }
} as const;

export type PropertyType = keyof typeof PROPERTY_TYPES;

// Типы уборки
export const SERVICE_TYPES = {
  maintenance: { 
    label: 'Поддерживающая', 
    icon: '✨', 
    description: 'Регулярная уборка',
    time: '1.5-3 часа'
  },
  general: { 
    label: 'Генеральная', 
    icon: '🧹', 
    description: 'Глубокая уборка всего',
    time: '3-5 часов'
  },
  renovation: { 
    label: 'После ремонта', 
    icon: '🔨', 
    description: 'Удаление строительной пыли',
    time: 'от 5 часов'
  },
  eco: { 
    label: 'Эко-уборка', 
    icon: '🌿', 
    description: 'Био-средства, гипоаллергенно',
    time: '2-4 часа',
    isNew: true
  }
} as const;

export type ServiceType = keyof typeof SERVICE_TYPES;

// Цены 2026 (базовые за м²)
export const PRICES_2026 = {
  maintenance: 230,
  general: 460,
  renovation: 690,
  eco: 300
} as const;

// Дополнительные услуги
export const ADDITIONAL_SERVICES = {
  bathroom: { min: 2500, max: 5000, label: 'Санузел', icon: '🚿' },
  windows: { min: 2000, max: 5000, label: 'Мытьё окон', icon: '🪟' },
  furniture: { price: 10000, label: 'Химчистка мебели', icon: '🛋️' },
  balcony: { price: 3000, label: 'Уборка балкона', icon: '🌿' },
  refrigerator: { price: 2500, label: 'Холодильник внутри', icon: '❄️' }
} as const;

// Модификаторы цен
export const PRICE_MODIFIERS = {
  urgency: 1.25,        // Срочный заказ +25%
  heavyDirt: 1.4,       // Сильное загрязнение +40%
  house: 1.2,           // Дом (больше площадь) +20%
  office: 0.85,         // Офис -15%
  subscription: 0.8     // Подписка -20%
} as const;

// Уровни загрязнения
export const DIRT_LEVELS = {
  normal: { label: 'Обычная', emoji: '👍', modifier: 1 },
  heavy: { label: 'Сильная', emoji: '😰', modifier: 1.4 }
} as const;

export type DirtLevel = keyof typeof DIRT_LEVELS;

// Статусы заявок
export const REQUEST_STATUSES = {
  new: { label: 'Новая', color: 'red', icon: '🔴' },
  sent: { label: 'Отправлена', color: 'yellow', icon: '🟡' },
  confirmed: { label: 'Подтверждена', color: 'blue', icon: '🔵' },
  in_progress: { label: 'В работе', color: 'purple', icon: '🟣' },
  completed: { label: 'Выполнена', color: 'green', icon: '🟢' },
  cancelled: { label: 'Отменена', color: 'gray', icon: '⚫' }
} as const;

export type RequestStatus = keyof typeof REQUEST_STATUSES;

// Способы связи
export const MESSENGERS = {
  whatsapp: { label: 'WhatsApp', icon: '📱', color: 'green' },
  telegram: { label: 'Telegram', icon: '✈️', color: 'blue' },
  call: { label: 'Звонок', icon: '📞', color: 'purple' }
} as const;

export type Messenger = keyof typeof MESSENGERS;

// Способы оплаты
export const PAYMENT_METHODS = {
  cash: { label: 'Наличные', icon: '💵' },
  kaspi: { label: 'Kaspi QR', icon: '💳' },
  card: { label: 'Карта', icon: '💳' },
  transfer: { label: 'Перевод', icon: '📲' }
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

// Время работы
export const WORKING_HOURS = {
  start: 8,
  end: 22
} as const;

// SEO
export const SEO = {
  siteName: 'CleanAlmaty',
  siteUrl: 'https://cleaning-almaty.kz',
  phone: '+7 700 123 45 67',
  email: 'info@cleaning-almaty.kz',
  year: 2026,
  city: 'Алматы',
  country: 'Казахстан',
  coordinates: {
    lat: 43.238949,
    lng: 76.945465
  }
} as const;

// Лимиты
export const LIMITS = {
  minArea: 20,
  maxArea: 500,
  minBathrooms: 0,
  maxBathrooms: 6,
  maxExecutorsPerRequest: 4,
  responseTimeHours: 2,
  subscriptionDiscount: 0.2  // 20%
} as const;

// API endpoints (для будущего использования)
export const API_ENDPOINTS = {
  requests: '/api/requests',
  executors: '/api/executors',
  reviews: '/api/reviews',
  analytics: '/api/analytics',
  auth: '/api/auth'
} as const;
