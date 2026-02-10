import { create } from 'zustand';
import { supabase } from '../utils/supabase';

// Types (same as before)
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
  cleaningType: string;
  area: number;
  priceMin: number;
  priceMax: number;
  status: 'new' | 'sent' | 'confirmed' | 'completed' | 'cancelled';
  assignedExecutors: string[];
  createdAt: string;
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
  requests: Request[];
  executors: Executor[];
  prices: PriceSettings;
  stats: any;
  
  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Data Sync
  fetchData: () => Promise<void>;
  fetchPublicData: () => Promise<void>;
  
  // Actions
  addRequest: (data: any) => Promise<void>;
  updateRequest: (id: string, data: any) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  updatePrices: (prices: PriceSettings) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAuthenticated: false,
  requests: [],
  executors: [],
  prices: {
    regular: 230,
    deep: 460,
    postRenovation: 690,
    eco: 300,
    bathroom: { min: 2500, max: 5000 },
    windows: { min: 2000, max: 5000 },
    heavyDirtModifier: 1.4,
  },
  stats: { totalRequests: 0, completedRequests: 0 },

  login: async (email, password) => {
    // Для демо оставляем простую проверку, 
    // но в будущем заменим на supabase.auth.signInWithPassword
    if (email === (import.meta.env.VITE_ADMIN_EMAIL || 'admin@cleanalmaty.kz') && 
        password === (import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026')) {
      set({ isAuthenticated: true });
      await get().fetchData();
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false }),

  fetchData: async () => {
    try {
      const { data: reqs } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
      const { data: execs } = await supabase.from('executors').select('*');
      await get().fetchPublicData();

      if (reqs) set({ requests: reqs });
      if (execs) set({ executors: execs });

      // Subscribe to real-time changes
      supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => {
          get().fetchData();
        })
        .subscribe();
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
    const { error } = await supabase.from('requests').insert([newRequest]);
    if (!error) await get().fetchData();
  },

  updateRequest: async (id, data) => {
    const { error } = await supabase.from('requests').update(data).eq('id', id);
    if (!error) await get().fetchData();
  },

  deleteRequest: async (id) => {
    const { error } = await supabase.from('requests').delete().eq('id', id);
    if (!error) await get().fetchData();
  },

  updatePrices: async (newPrices) => {
    const { error } = await supabase.from('settings').upsert({ key: 'prices', value: newPrices });
    if (!error) set({ prices: newPrices });
  }
}));