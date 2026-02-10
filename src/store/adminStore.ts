import { create } from 'zustand';
import { supabase } from '../utils/supabase';

export interface Request {
  id: string;
  name: string;
  phone: string;
  messenger: string;
  address: string;
  district: string;
  date: string;
  time: string;
  comment: string;
  cleaning_type: string;
  area: number;
  bathrooms: number;
  windows: boolean;
  dirt_level: string;
  price_min: number;
  price_max: number;
  status: 'new' | 'sent' | 'confirmed' | 'completed' | 'cancelled';
  assigned_executors: string[];
  created_at: string;
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
  reviews_count: number;
  completed_orders: number;
  price_modifier: number;
  is_active: boolean;
  is_verified: boolean;
  is_premium: boolean;
  has_eco_cleaning: boolean;
  has_subscription: boolean;
  notes: string;
}

export interface District {
  id: string;
  name: string;
  areas: string[];
  is_active: boolean;
  extra_charge: number;
}

export interface Review {
  id: string;
  request_id: string;
  executor_id: string;
  client_name: string;
  rating: number;
  text: string;
  is_published: boolean;
  created_at: string;
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
  isAuthenticated: boolean;
  adminUser: { email: string; role: string } | null;
  requests: Request[];
  executors: Executor[];
  reviews: Review[];
  districts: District[];
  prices: PriceSettings;
  settings: Settings;
  stats: {
    totalRequests: number;
    completedRequests: number;
    activeExecutors: number;
    avgRating: number;
    newRequests: number;
  };
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchData: () => Promise<void>;
  fetchPublicData: () => Promise<void>;
  addRequest: (data: any) => Promise<void>;
  updateRequest: (id: string, data: any) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  assignExecutor: (requestId: string, executorId: string) => Promise<void>;
  
  addExecutor: (data: any) => Promise<void>;
  updateExecutor: (id: string, data: any) => Promise<void>;
  deleteExecutor: (id: string) => Promise<void>;
  toggleExecutorActive: (id: string) => Promise<void>;
  
  updatePrices: (prices: PriceSettings) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  updateDistrict: (id: string, data: any) => Promise<void>;
  toggleDistrictActive: (id: string) => Promise<void>;
  toggleReviewPublished: (id: string, published: boolean) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAuthenticated: false,
  adminUser: null,
  requests: [],
  executors: [],
  reviews: [],
  districts: [],
  prices: {
    regular: 230,
    deep: 460,
    postRenovation: 690,
    eco: 300,
    bathroom: { min: 2500, max: 5000 },
    windows: { min: 2000, max: 5000 },
    furniture: 10000,
    urgencyModifier: 1.25,
    heavyDirtModifier: 1.4,
  },
  settings: {
    siteName: 'CleanAlmaty',
    phone: '+7 700 123 45 67',
    email: 'info@cleaning-almaty.kz',
    telegramBot: '',
    whatsappNumber: '',
    workingHours: { start: 8, end: 22 },
    responseTime: '1-2 часа',
    autoAssignExecutors: true,
    maxExecutorsPerRequest: 3,
    notifyTelegram: true,
    notifyEmail: true,
  },
  stats: { totalRequests: 0, completedRequests: 0, activeExecutors: 0, avgRating: 4.9, newRequests: 0 },

  login: async (email, password) => {
    if (email === (import.meta.env.VITE_ADMIN_EMAIL || 'admin@cleanalmaty.kz') && 
        password === (import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026')) {
      set({ isAuthenticated: true, adminUser: { email, role: 'admin' } });
      await get().fetchData();
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false, adminUser: null }),

  fetchData: async () => {
    try {
      const { data: reqs } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
      const { data: execs } = await supabase.from('executors').select('*');
      const { data: revs } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      const { data: dists } = await supabase.from('districts').select('*');
      const { data: setts } = await supabase.from('settings').select('*');
      
      await get().fetchPublicData();

      if (reqs) set({ requests: reqs });
      if (execs) set({ executors: execs });
      if (revs) set({ reviews: revs });
      if (dists) set({ districts: dists });
      
      if (setts) {
        const prices = setts.find(s => s.key === 'prices')?.value;
        const general = setts.find(s => s.key === 'general')?.value;
        if (prices) set({ prices });
        if (general) set({ settings: general });
      }

      set((state) => ({
        stats: {
          totalRequests: state.requests.length,
          completedRequests: state.requests.filter(r => r.status === 'completed').length,
          activeExecutors: state.executors.filter(e => e.is_active).length,
          avgRating: 4.9,
          newRequests: state.requests.filter(r => r.status === 'new').length
        }
      }));
    } catch (e) {
      console.error('Supabase fetch error');
    }
  },

  fetchPublicData: async () => {
    try {
      const { data: prc } = await supabase.from('settings').select('value').eq('key', 'prices').single();
      if (prc) set({ prices: prc.value });
    } catch (e) {
      console.warn('Fallback to local prices');
    }
  },

  addRequest: async (data) => {
    await supabase.from('requests').insert([{ ...data, status: 'new' }]);
    await get().fetchData();
  },

  updateRequest: async (id, data) => {
    await supabase.from('requests').update(data).eq('id', id);
    await get().fetchData();
  },

  deleteRequest: async (id) => {
    await supabase.from('requests').delete().eq('id', id);
    await get().fetchData();
  },

  assignExecutor: async (requestId, executorId) => {
    const request = get().requests.find(r => r.id === requestId);
    if (request) {
      const newExecutors = [...new Set([...request.assigned_executors, executorId])];
      await supabase.from('requests').update({ assigned_executors: newExecutors, status: 'sent' }).eq('id', requestId);
      await get().fetchData();
    }
  },

  addExecutor: async (data) => {
    await supabase.from('executors').insert([data]);
    await get().fetchData();
  },

  updateExecutor: async (id, data) => {
    await supabase.from('executors').update(data).eq('id', id);
    await get().fetchData();
  },

  deleteExecutor: async (id) => {
    await supabase.from('executors').delete().eq('id', id);
    await get().fetchData();
  },

  toggleExecutorActive: async (id) => {
    const executor = get().executors.find(e => e.id === id);
    if (executor) {
      await supabase.from('executors').update({ is_active: !executor.is_active }).eq('id', id);
      await get().fetchData();
    }
  },

  updatePrices: async (newPrices) => {
    await supabase.from('settings').upsert({ key: 'prices', value: newPrices });
    set({ prices: newPrices });
  },

  updateSettings: async (newSettings) => {
    await supabase.from('settings').upsert({ key: 'general', value: newSettings });
    set({ settings: newSettings });
  },

  updateDistrict: async (id, data) => {
    await supabase.from('districts').update(data).eq('id', id);
    await get().fetchData();
  },

  toggleDistrictActive: async (id) => {
    const district = get().districts.find(d => d.id === id);
    if (district) {
      await supabase.from('districts').update({ is_active: !district.is_active }).eq('id', id);
      await get().fetchData();
    }
  },

  toggleReviewPublished: async (id, published) => {
    await supabase.from('reviews').update({ is_published: published }).eq('id', id);
    await get().fetchData();
  },

  deleteReview: async (id) => {
    await supabase.from('reviews').delete().eq('id', id);
    await get().fetchData();
  }
}));
