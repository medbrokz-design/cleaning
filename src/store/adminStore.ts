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
  price_min: number;
  price_max: number;
  status: 'new' | 'sent' | 'confirmed' | 'completed' | 'cancelled';
  assignedExecutors: string[];
  created_at: string;
}

export interface Executor {
  id: string;
  name: string;
  phone: string;
  rating: number;
  completedOrders: number;
  isActive: boolean;
  isVerified: boolean;
  isPremium: boolean;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  text: string;
  isPublished: boolean;
  createdAt: string;
}

export interface PriceSettings {
  regular: number;
  deep: number;
  postRenovation: number;
  eco: number;
  bathroom: { min: number; max: number };
  windows: { min: number; max: number };
  heavyDirtModifier: number;
}

interface AdminState {
  isAuthenticated: boolean;
  adminUser: { email: string; role: string } | null; // ВЕРНУЛ
  requests: Request[];
  executors: Executor[];
  reviews: Review[]; // ВЕРНУЛ
  prices: PriceSettings;
  stats: any;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchData: () => Promise<void>;
  fetchPublicData: () => Promise<void>;
  addRequest: (data: any) => Promise<void>;
  updateRequest: (id: string, data: any) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  assignExecutor: (requestId: string, executorId: string) => Promise<void>;
  updatePrices: (prices: PriceSettings) => Promise<void>;
  toggleReviewPublished: (id: string, published: boolean) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAuthenticated: false,
  adminUser: null,
  requests: [],
  executors: [],
  reviews: [],
  prices: {
    regular: 230,
    deep: 460,
    postRenovation: 690,
    eco: 300,
    bathroom: { min: 2500, max: 5000 },
    windows: { min: 2000, max: 5000 },
    heavyDirtModifier: 1.4,
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
      const { data: revs } = await supabase.from('reviews').select('*');
      await get().fetchPublicData();

      if (reqs) set({ requests: reqs });
      if (execs) set({ executors: execs });
      if (revs) set({ reviews: revs });

      supabase.channel('schema-db-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => get().fetchData()).subscribe();
    } catch (e) {
      console.error('Supabase fetch error');
    }
  },

  fetchPublicData: async () => {
    try {
      const { data: prc } = await supabase.from('settings').select('value').eq('key', 'prices').single();
      if (prc) set({ prices: prc.value });
    } catch (e) {
      console.warn('Using local prices fallback');
    }
  },

  addRequest: async (data) => {
    const newRequest = { ...data, status: 'new', created_at: new Date().toISOString() };
    await supabase.from('requests').insert([newRequest]);
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
      const newExecutors = [...new Set([...request.assignedExecutors, executorId])];
      await supabase.from('requests').update({ assignedExecutors: newExecutors, status: 'sent' }).eq('id', requestId);
      await get().fetchData();
    }
  },

  updatePrices: async (newPrices) => {
    await supabase.from('settings').upsert({ key: 'prices', value: newPrices });
    set({ prices: newPrices });
  },

  toggleReviewPublished: async (id, published) => {
    await supabase.from('reviews').update({ isPublished: published }).eq('id', id);
    await get().fetchData();
  },

  deleteReview: async (id) => {
    await supabase.from('reviews').delete().eq('id', id);
    await get().fetchData();
  }
}));
