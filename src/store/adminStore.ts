import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Request {
  id: string;
  name: string;
  phone: string;
  messenger: 'whatsapp' | 'telegram' | 'phone';
  address: string;
  district: string;
  date: string;
  time: string;
  comment: string;
  propertyType: string;
  cleaningType: string;
  area: number;
  bathrooms: number;
  windows: boolean;
  dirtLevel: string;
  priceMin: number;
  priceMax: number;
  status: 'new' | 'sent' | 'confirmed' | 'completed' | 'cancelled';
  assignedExecutors: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Executor {
  id: string;
  name: string;
  phone: string;
  telegram?: string;
  whatsapp?: string;
  email?: string;
  company?: string;
  districts: string[];
  services: string[];
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  priceModifier: number; // 1.0 = standard, 1.2 = +20%
  isActive: boolean;
  isVerified: boolean;
  hasEcoCleanig: boolean;
  hasSubscription: boolean;
  createdAt: string;
  notes: string;
}

export interface PriceSettings {
  regular: number;
  deep: number;
  postRenovation: number;
  eco: number;
  bathroom: { min: number; max: number };
  windows: { min: number; max: number };
  furniture: number;
  urgencyModifier: number;
  heavyDirtModifier: number;
}

export interface District {
  id: string;
  name: string;
  areas: string[];
  isActive: boolean;
  extraCharge: number;
  executorsCount: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
}

export interface Settings {
  siteName: string;
  phone: string;
  email: string;
  telegramBot: string;
  whatsappNumber: string;
  workingHours: { start: number; end: number };
  responseTime: string;
  autoAssignExecutors: boolean;
  maxExecutorsPerRequest: number;
  notifyTelegram: boolean;
  notifyEmail: boolean;
}

interface AdminState {
  // Auth
  isAuthenticated: boolean;
  adminUser: { email: string; role: string } | null;
  
  // Data
  requests: Request[];
  executors: Executor[];
  prices: PriceSettings;
  districts: District[];
  faqItems: FAQItem[];
  settings: Settings;
  
  // Stats
  stats: {
    totalRequests: number;
    newRequests: number;
    completedRequests: number;
    totalExecutors: number;
    activeExecutors: number;
    avgRating: number;
    revenue: number;
  };
  
  // Actions - Auth
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Actions - Requests
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRequest: (id: string, data: Partial<Request>) => void;
  deleteRequest: (id: string) => void;
  assignExecutor: (requestId: string, executorId: string) => void;
  
  // Actions - Executors
  addExecutor: (executor: Omit<Executor, 'id' | 'createdAt'>) => void;
  updateExecutor: (id: string, data: Partial<Executor>) => void;
  deleteExecutor: (id: string) => void;
  toggleExecutorActive: (id: string) => void;
  
  // Actions - Prices
  updatePrices: (prices: Partial<PriceSettings>) => void;
  
  // Actions - Districts
  updateDistrict: (id: string, data: Partial<District>) => void;
  toggleDistrictActive: (id: string) => void;
  
  // Actions - FAQ
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, data: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;
  
  // Actions - Settings
  updateSettings: (settings: Partial<Settings>) => void;
}

// Initial data
const initialPrices: PriceSettings = {
  regular: 230,
  deep: 460,
  postRenovation: 690,
  eco: 300,
  bathroom: { min: 2500, max: 5000 },
  windows: { min: 2000, max: 5000 },
  furniture: 10000,
  urgencyModifier: 1.25,
  heavyDirtModifier: 1.4,
};

const initialDistricts: District[] = [
  { id: '1', name: 'Бостандыкский район', areas: ['Орбита', 'Тастак', 'Аксай', 'Мамыр'], isActive: true, extraCharge: 0, executorsCount: 35 },
  { id: '2', name: 'Алмалинский район', areas: ['Центр', 'Абая', 'Тимирязева'], isActive: true, extraCharge: 0, executorsCount: 28 },
  { id: '3', name: 'Медеуский район', areas: ['Самал', 'Достык', 'Коктобе'], isActive: true, extraCharge: 0, executorsCount: 22 },
  { id: '4', name: 'Ауэзовский район', areas: ['Микрорайоны 1-12', 'Алмагуль'], isActive: true, extraCharge: 0, executorsCount: 20 },
  { id: '5', name: 'Турксибский район', areas: ['Жетысу', 'Тастак'], isActive: true, extraCharge: 0, executorsCount: 12 },
  { id: '6', name: 'Жетысуский район', areas: ['Айнабулак', 'Жетысу-1'], isActive: true, extraCharge: 0, executorsCount: 10 },
  { id: '7', name: 'Наурызбайский район', areas: ['Калкаман', 'Карасу'], isActive: true, extraCharge: 1500, executorsCount: 8 },
  { id: '8', name: 'Алатауский район', areas: ['Шанырак', 'Рахат'], isActive: true, extraCharge: 2000, executorsCount: 5 },
];

const initialExecutors: Executor[] = [
  {
    id: '1',
    name: 'CleanPro Almaty',
    phone: '+7 777 111 22 33',
    telegram: '@cleanpro_almaty',
    whatsapp: '+77771112233',
    email: 'info@cleanpro.kz',
    company: 'ТОО CleanPro',
    districts: ['1', '2', '3', '4'],
    services: ['regular', 'deep', 'postRenovation', 'eco'],
    rating: 4.9,
    reviewsCount: 156,
    completedOrders: 423,
    priceModifier: 1.0,
    isActive: true,
    isVerified: true,
    hasEcoCleanig: true,
    hasSubscription: true,
    createdAt: '2023-06-15',
    notes: 'Премиум-партнёр. Быстрый отклик.'
  },
  {
    id: '2',
    name: 'Айгерим Сейтова',
    phone: '+7 707 222 33 44',
    telegram: '@aigerim_clean',
    whatsapp: '+77072223344',
    districts: ['1', '4', '5'],
    services: ['regular', 'deep'],
    rating: 4.8,
    reviewsCount: 89,
    completedOrders: 234,
    priceModifier: 0.9,
    isActive: true,
    isVerified: true,
    hasEcoCleanig: false,
    hasSubscription: true,
    createdAt: '2024-01-20',
    notes: 'Частный клинер. Хорошие отзывы.'
  },
  {
    id: '3',
    name: 'EcoClean KZ',
    phone: '+7 747 333 44 55',
    telegram: '@ecoclean_kz',
    whatsapp: '+77473334455',
    email: 'hello@ecoclean.kz',
    company: 'ИП EcoClean',
    districts: ['1', '2', '3'],
    services: ['regular', 'deep', 'eco'],
    rating: 4.95,
    reviewsCount: 67,
    completedOrders: 189,
    priceModifier: 1.15,
    isActive: true,
    isVerified: true,
    hasEcoCleanig: true,
    hasSubscription: true,
    createdAt: '2024-08-10',
    notes: 'Специализация на эко-уборке.'
  }
];

const initialRequests: Request[] = [
  {
    id: '1',
    name: 'Мария Иванова',
    phone: '+7 707 123 45 67',
    messenger: 'whatsapp',
    address: 'ул. Абая 150, кв 45',
    district: 'Бостандыкский',
    date: '2026-01-20',
    time: 'morning',
    comment: 'Нужна эко-уборка, есть маленький ребёнок',
    propertyType: 'apartment',
    cleaningType: 'eco',
    area: 65,
    bathrooms: 1,
    windows: true,
    dirtLevel: 'normal',
    priceMin: 21500,
    priceMax: 32000,
    status: 'new',
    assignedExecutors: [],
    createdAt: '2026-01-15T10:30:00',
    updatedAt: '2026-01-15T10:30:00'
  },
  {
    id: '2',
    name: 'Алексей Петров',
    phone: '+7 777 234 56 78',
    messenger: 'telegram',
    address: 'мкр. Самал-2, д. 33',
    district: 'Медеуский',
    date: '2026-01-22',
    time: 'afternoon',
    comment: 'После ремонта, много строительной пыли',
    propertyType: 'apartment',
    cleaningType: 'post-renovation',
    area: 120,
    bathrooms: 2,
    windows: true,
    dirtLevel: 'heavy',
    priceMin: 98000,
    priceMax: 145000,
    status: 'sent',
    assignedExecutors: ['1', '3'],
    createdAt: '2026-01-14T15:20:00',
    updatedAt: '2026-01-15T09:00:00'
  },
  {
    id: '3',
    name: 'Динара Ахметова',
    phone: '+7 747 345 67 89',
    messenger: 'whatsapp',
    address: 'Орбита-3, д. 15',
    district: 'Бостандыкский',
    date: '2026-01-18',
    time: 'evening',
    comment: 'Регулярная уборка, подписка',
    propertyType: 'apartment',
    cleaningType: 'regular',
    area: 55,
    bathrooms: 1,
    windows: false,
    dirtLevel: 'normal',
    priceMin: 12650,
    priceMax: 19000,
    status: 'confirmed',
    assignedExecutors: ['2'],
    createdAt: '2026-01-10T11:45:00',
    updatedAt: '2026-01-12T14:30:00'
  }
];

const initialSettings: Settings = {
  siteName: 'CleanAlmaty',
  phone: '+7 700 123 45 67',
  email: 'info@cleaning-almaty.kz',
  telegramBot: '@cleanalmaty_bot',
  whatsappNumber: '+77001234567',
  workingHours: { start: 8, end: 22 },
  responseTime: '1-2 часа',
  autoAssignExecutors: true,
  maxExecutorsPerRequest: 3,
  notifyTelegram: true,
  notifyEmail: true,
};

// Generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Create store
export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      adminUser: null,
      requests: initialRequests,
      executors: initialExecutors,
      prices: initialPrices,
      districts: initialDistricts,
      faqItems: [],
      settings: initialSettings,
      stats: {
        totalRequests: 4892,
        newRequests: 12,
        completedRequests: 4756,
        totalExecutors: 120,
        activeExecutors: 98,
        avgRating: 4.9,
        revenue: 0,
      },
      
      // Auth
      login: (email, password) => {
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@cleanalmaty.kz';
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026';
        
        if (email === adminEmail && password === adminPassword) {
          set({ 
            isAuthenticated: true, 
            adminUser: { email, role: 'admin' } 
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ isAuthenticated: false, adminUser: null });
      },
      
      // Requests
      addRequest: (request) => {
        const newRequest: Request = {
          ...request,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          requests: [newRequest, ...state.requests],
          stats: { ...state.stats, totalRequests: state.stats.totalRequests + 1, newRequests: state.stats.newRequests + 1 }
        }));
      },
      
      updateRequest: (id, data) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },
      
      deleteRequest: (id) => {
        set((state) => ({
          requests: state.requests.filter((r) => r.id !== id),
        }));
      },
      
      assignExecutor: (requestId, executorId) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  assignedExecutors: [...new Set([...r.assignedExecutors, executorId])],
                  status: 'sent' as const,
                  updatedAt: new Date().toISOString(),
                }
              : r
          ),
        }));
      },
      
      // Executors
      addExecutor: (executor) => {
        const newExecutor: Executor = {
          ...executor,
          id: generateId(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          executors: [...state.executors, newExecutor],
          stats: { ...state.stats, totalExecutors: state.stats.totalExecutors + 1 }
        }));
      },
      
      updateExecutor: (id, data) => {
        set((state) => ({
          executors: state.executors.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        }));
      },
      
      deleteExecutor: (id) => {
        set((state) => ({
          executors: state.executors.filter((e) => e.id !== id),
        }));
      },
      
      toggleExecutorActive: (id) => {
        set((state) => ({
          executors: state.executors.map((e) =>
            e.id === id ? { ...e, isActive: !e.isActive } : e
          ),
        }));
      },
      
      // Prices
      updatePrices: (prices) => {
        set((state) => ({
          prices: { ...state.prices, ...prices },
        }));
      },
      
      // Districts
      updateDistrict: (id, data) => {
        set((state) => ({
          districts: state.districts.map((d) =>
            d.id === id ? { ...d, ...data } : d
          ),
        }));
      },
      
      toggleDistrictActive: (id) => {
        set((state) => ({
          districts: state.districts.map((d) =>
            d.id === id ? { ...d, isActive: !d.isActive } : d
          ),
        }));
      },
      
      // FAQ
      addFAQ: (faq) => {
        const newFAQ: FAQItem = {
          ...faq,
          id: generateId(),
        };
        set((state) => ({
          faqItems: [...state.faqItems, newFAQ],
        }));
      },
      
      updateFAQ: (id, data) => {
        set((state) => ({
          faqItems: state.faqItems.map((f) =>
            f.id === id ? { ...f, ...data } : f
          ),
        }));
      },
      
      deleteFAQ: (id) => {
        set((state) => ({
          faqItems: state.faqItems.filter((f) => f.id !== id),
        }));
      },
      
      // Settings
      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },
    }),
    {
      name: 'cleanalmaty-admin',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        adminUser: state.adminUser,
        requests: state.requests,
        executors: state.executors,
        prices: state.prices,
        districts: state.districts,
        faqItems: state.faqItems,
        settings: state.settings,
      }),
    }
  )
);
