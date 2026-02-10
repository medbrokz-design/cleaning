import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'executor';
  avatar?: string;
  phone?: string;
  telegramId?: string;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface Request {
  id: string;
  name: string;
  phone: string;
  messenger: 'whatsapp' | 'telegram' | 'call';
  address: string;
  district: string;
  propertyType: string;
  serviceType: string;
  area: number;
  bathrooms: number;
  windows: boolean;
  dirtLevel: string;
  estimatedPrice: number;
  finalPrice?: number;
  preferredDate: string;
  preferredTime: string;
  status: 'new' | 'sent' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  assignedExecutors: string[];
  confirmedExecutor?: string;
  notes?: string;
  rating?: number;
  review?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'kaspi' | 'card';
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface Executor {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  telegram?: string;
  telegramChatId?: string;
  whatsapp?: string;
  districts: string[];
  services: string[];
  isActive: boolean;
  isVerified: boolean;
  supportsEco: boolean;
  supportsSubscription: boolean;
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  responseTime: number; // минуты
  priceModifier: number; // 1.0 = стандартная цена
  avatar?: string;
  documents?: string[];
  notes?: string;
  createdAt: string;
  lastActiveAt?: string;
}

export interface Review {
  id: string;
  requestId: string;
  executorId: string;
  clientName: string;
  rating: number;
  text: string;
  photos?: string[];
  isPublished: boolean;
  moderatedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'new_request' | 'status_change' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRequests: number;
  newRequests: number;
  completedRequests: number;
  totalRevenue: number;
  averageRating: number;
  conversionRate: number;
  activeExecutors: number;
  pendingReviews: number;
}

interface EnhancedStore {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Requests
  requests: Request[];
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'status' | 'assignedExecutors' | 'paymentStatus'>) => Request;
  updateRequest: (id: string, data: Partial<Request>) => void;
  deleteRequest: (id: string) => void;
  assignExecutor: (requestId: string, executorId: string) => void;
  confirmExecutor: (requestId: string, executorId: string) => void;
  
  // Executors
  executors: Executor[];
  addExecutor: (executor: Omit<Executor, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'completedOrders'>) => void;
  updateExecutor: (id: string, data: Partial<Executor>) => void;
  deleteExecutor: (id: string) => void;
  toggleExecutorActive: (id: string) => void;
  
  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'isPublished'>) => void;
  moderateReview: (id: string, publish: boolean) => void;
  deleteReview: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  
  // Dashboard
  getStats: () => DashboardStats;
  
  // Export
  exportToCSV: (type: 'requests' | 'executors' | 'reviews') => string;
  exportToJSON: (type: 'requests' | 'executors' | 'reviews') => string;
}

// Demo users
const demoUsers: User[] = [
  {
    id: '1',
    email: 'admin@cleanalmaty.kz',
    name: 'Администратор',
    role: 'admin',
    permissions: ['all'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'manager@cleanalmaty.kz',
    name: 'Менеджер Айгуль',
    role: 'manager',
    phone: '+7 (777) 123-45-67',
    permissions: ['requests', 'executors', 'reviews'],
    createdAt: '2024-06-01T00:00:00Z'
  }
];

// Demo requests
const demoRequests: Request[] = [
  {
    id: '1001',
    name: 'Асель Каримова',
    phone: '+7 (777) 111-22-33',
    messenger: 'whatsapp',
    address: 'ул. Абая 150, кв. 45',
    district: 'Алмалинский',
    propertyType: 'apartment',
    serviceType: 'general',
    area: 85,
    bathrooms: 2,
    windows: true,
    dirtLevel: 'normal',
    estimatedPrice: 45000,
    preferredDate: '2026-01-20',
    preferredTime: '10:00',
    status: 'new',
    assignedExecutors: [],
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '1002',
    name: 'Тимур Ахметов',
    phone: '+7 (707) 444-55-66',
    messenger: 'telegram',
    address: 'мкр. Самал-2, д. 33, кв. 12',
    district: 'Медеуский',
    propertyType: 'apartment',
    serviceType: 'maintenance',
    area: 65,
    bathrooms: 1,
    windows: false,
    dirtLevel: 'normal',
    estimatedPrice: 18000,
    preferredDate: '2026-01-18',
    preferredTime: '14:00',
    status: 'confirmed',
    assignedExecutors: ['e1'],
    confirmedExecutor: 'e1',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '1003',
    name: 'Марат Сериков',
    phone: '+7 (701) 777-88-99',
    messenger: 'call',
    address: 'ул. Жандосова 58',
    district: 'Бостандыкский',
    propertyType: 'house',
    serviceType: 'renovation',
    area: 150,
    bathrooms: 3,
    windows: true,
    dirtLevel: 'heavy',
    estimatedPrice: 145000,
    finalPrice: 140000,
    preferredDate: '2026-01-15',
    preferredTime: '09:00',
    status: 'completed',
    assignedExecutors: ['e2'],
    confirmedExecutor: 'e2',
    paymentStatus: 'paid',
    paymentMethod: 'kaspi',
    rating: 5,
    review: 'Отличная работа! Дом после ремонта сияет чистотой.',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Demo executors
const demoExecutors: Executor[] = [
  {
    id: 'e1',
    name: 'Айнура Сагындыкова',
    company: 'CleanPro KZ',
    phone: '+7 (777) 999-88-77',
    email: 'ainura@cleanpro.kz',
    telegram: '@ainura_clean',
    telegramChatId: '123456789',
    whatsapp: '+77779998877',
    districts: ['Алмалинский', 'Медеуский', 'Бостандыкский'],
    services: ['maintenance', 'general', 'eco'],
    isActive: true,
    isVerified: true,
    supportsEco: true,
    supportsSubscription: true,
    rating: 4.9,
    reviewsCount: 127,
    completedOrders: 342,
    responseTime: 15,
    priceModifier: 1.0,
    createdAt: '2024-03-15T00:00:00Z',
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'e2',
    name: 'Бекзат Омаров',
    company: 'После ремонта',
    phone: '+7 (707) 555-44-33',
    telegram: '@bekzat_clean',
    whatsapp: '+77075554433',
    districts: ['Бостандыкский', 'Ауэзовский', 'Наурызбайский'],
    services: ['renovation', 'general'],
    isActive: true,
    isVerified: true,
    supportsEco: false,
    supportsSubscription: false,
    rating: 4.8,
    reviewsCount: 89,
    completedOrders: 256,
    responseTime: 25,
    priceModifier: 1.1,
    createdAt: '2024-05-20T00:00:00Z',
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'e3',
    name: 'Динара Касымова',
    company: 'ЭкоЧистота',
    phone: '+7 (747) 222-11-00',
    telegram: '@dinara_eco',
    districts: ['Медеуский', 'Алмалинский'],
    services: ['eco', 'maintenance'],
    isActive: true,
    isVerified: true,
    supportsEco: true,
    supportsSubscription: true,
    rating: 5.0,
    reviewsCount: 45,
    completedOrders: 98,
    responseTime: 10,
    priceModifier: 1.15,
    createdAt: '2025-01-10T00:00:00Z',
    lastActiveAt: new Date().toISOString()
  }
];

// Demo reviews
const demoReviews: Review[] = [
  {
    id: 'r1',
    requestId: '1003',
    executorId: 'e2',
    clientName: 'Марат С.',
    rating: 5,
    text: 'Отличная работа! Дом после ремонта сияет чистотой. Рекомендую!',
    isPublished: true,
    moderatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'r2',
    requestId: '999',
    executorId: 'e1',
    clientName: 'Гульнара М.',
    rating: 5,
    text: 'Заказывала эко-уборку. Очень довольна - безопасно для ребенка-аллергика.',
    isPublished: true,
    moderatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'r3',
    requestId: '998',
    executorId: 'e3',
    clientName: 'Арман К.',
    rating: 4,
    text: 'Хорошая уборка, но немного задержались. В целом рекомендую.',
    isPublished: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const useEnhancedStore = create<EnhancedStore>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Demo auth
        const users = get().users;
        const user = users.find(u => u.email === email);
        
        if (user && password === 'admin2026') {
          set({ 
            currentUser: { ...user, lastLogin: new Date().toISOString() },
            isAuthenticated: true 
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      // Users
      users: demoUsers,
      
      addUser: (userData) => {
        const user: User = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        set(state => ({ users: [...state.users, user] }));
      },
      
      updateUser: (id, data) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...data } : u)
        }));
      },
      
      deleteUser: (id) => {
        set(state => ({ users: state.users.filter(u => u.id !== id) }));
      },
      
      // Requests
      requests: demoRequests,
      
      addRequest: (requestData) => {
        const request: Request = {
          ...requestData,
          id: Date.now().toString(),
          status: 'new',
          assignedExecutors: [],
          paymentStatus: 'pending',
          createdAt: new Date().toISOString()
        };
        
        set(state => ({ 
          requests: [request, ...state.requests],
          notifications: [{
            id: Date.now().toString(),
            type: 'new_request',
            title: 'Новая заявка',
            message: `${request.name} - ${request.serviceType} (${request.area} м²)`,
            isRead: false,
            link: `/admin/requests/${request.id}`,
            createdAt: new Date().toISOString()
          }, ...state.notifications]
        }));
        
        return request;
      },
      
      updateRequest: (id, data) => {
        set(state => ({
          requests: state.requests.map(r => 
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          )
        }));
      },
      
      deleteRequest: (id) => {
        set(state => ({ requests: state.requests.filter(r => r.id !== id) }));
      },
      
      assignExecutor: (requestId, executorId) => {
        set(state => ({
          requests: state.requests.map(r => 
            r.id === requestId 
              ? { 
                  ...r, 
                  assignedExecutors: [...new Set([...r.assignedExecutors, executorId])],
                  status: 'sent',
                  updatedAt: new Date().toISOString()
                } 
              : r
          )
        }));
      },
      
      confirmExecutor: (requestId, executorId) => {
        set(state => ({
          requests: state.requests.map(r => 
            r.id === requestId 
              ? { 
                  ...r, 
                  confirmedExecutor: executorId,
                  status: 'confirmed',
                  updatedAt: new Date().toISOString()
                } 
              : r
          )
        }));
      },
      
      // Executors
      executors: demoExecutors,
      
      addExecutor: (executorData) => {
        const executor: Executor = {
          ...executorData,
          id: Date.now().toString(),
          rating: 0,
          reviewsCount: 0,
          completedOrders: 0,
          createdAt: new Date().toISOString()
        };
        set(state => ({ executors: [...state.executors, executor] }));
      },
      
      updateExecutor: (id, data) => {
        set(state => ({
          executors: state.executors.map(e => e.id === id ? { ...e, ...data } : e)
        }));
      },
      
      deleteExecutor: (id) => {
        set(state => ({ executors: state.executors.filter(e => e.id !== id) }));
      },
      
      toggleExecutorActive: (id) => {
        set(state => ({
          executors: state.executors.map(e => 
            e.id === id ? { ...e, isActive: !e.isActive } : e
          )
        }));
      },
      
      // Reviews
      reviews: demoReviews,
      
      addReview: (reviewData) => {
        const review: Review = {
          ...reviewData,
          id: Date.now().toString(),
          isPublished: false,
          createdAt: new Date().toISOString()
        };
        
        set(state => ({
          reviews: [review, ...state.reviews],
          notifications: [{
            id: Date.now().toString(),
            type: 'review',
            title: 'Новый отзыв',
            message: `${review.clientName}: ${review.rating}★`,
            isRead: false,
            createdAt: new Date().toISOString()
          }, ...state.notifications]
        }));
      },
      
      moderateReview: (id, publish) => {
        set(state => ({
          reviews: state.reviews.map(r => 
            r.id === id 
              ? { ...r, isPublished: publish, moderatedAt: new Date().toISOString() } 
              : r
          )
        }));
        
        // Update executor rating
        const review = get().reviews.find(r => r.id === id);
        if (review && publish) {
          const executorReviews = get().reviews.filter(
            r => r.executorId === review.executorId && r.isPublished
          );
          const avgRating = executorReviews.reduce((sum, r) => sum + r.rating, 0) / executorReviews.length;
          
          set(state => ({
            executors: state.executors.map(e => 
              e.id === review.executorId 
                ? { ...e, rating: Math.round(avgRating * 10) / 10, reviewsCount: executorReviews.length }
                : e
            )
          }));
        }
      },
      
      deleteReview: (id) => {
        set(state => ({ reviews: state.reviews.filter(r => r.id !== id) }));
      },
      
      // Notifications
      notifications: [],
      
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          isRead: false,
          createdAt: new Date().toISOString()
        };
        set(state => ({ notifications: [notification, ...state.notifications] }));
      },
      
      markAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, isRead: true } : n
          )
        }));
      },
      
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true }))
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
      
      // Dashboard Stats
      getStats: () => {
        const { requests, executors, reviews } = get();
        const completedRequests = requests.filter(r => r.status === 'completed');
        
        return {
          totalRequests: requests.length,
          newRequests: requests.filter(r => r.status === 'new').length,
          completedRequests: completedRequests.length,
          totalRevenue: completedRequests.reduce((sum, r) => sum + (r.finalPrice || r.estimatedPrice), 0),
          averageRating: executors.length > 0 
            ? Math.round(executors.reduce((sum, e) => sum + e.rating, 0) / executors.length * 10) / 10
            : 0,
          conversionRate: requests.length > 0 
            ? Math.round(completedRequests.length / requests.length * 100)
            : 0,
          activeExecutors: executors.filter(e => e.isActive).length,
          pendingReviews: reviews.filter(r => !r.isPublished).length
        };
      },
      
      // Export functions
      exportToCSV: (type) => {
        const data = get()[type] as unknown[];
        if (!data || data.length === 0) return '';
        
        const firstItem = data[0] as Record<string, unknown>;
        const headers = Object.keys(firstItem).join(',');
        const rows = data.map((item) => {
          const record = item as Record<string, unknown>;
          return Object.values(record).map(v => 
            typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
          ).join(',');
        });
        
        return [headers, ...rows].join('\n');
      },
      
      exportToJSON: (type) => {
        return JSON.stringify(get()[type], null, 2);
      }
    }),
    {
      name: 'cleanalmaty-enhanced-store',
      partialize: (state) => ({
        users: state.users,
        requests: state.requests,
        executors: state.executors,
        reviews: state.reviews,
        notifications: state.notifications
      })
    }
  )
);
