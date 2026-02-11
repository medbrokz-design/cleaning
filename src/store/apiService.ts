import { supabase } from '../utils/supabase';

// Telegram Bot Integration
export const TelegramService = {
  botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
  adminChatId: import.meta.env.VITE_TELEGRAM_ADMIN_CHAT || '',
  
  async sendMessage(chatId: string, text: string, parseMode: 'HTML' | 'Markdown' = 'HTML') {
    if (!this.botToken) {
      console.log('Telegram message (demo):', text);
      return { ok: true, demo: true };
    }
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: parseMode
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Telegram error:', error);
      return { ok: false, error };
    }
  },
  
  async notifyNewRequest(request: any) {
    const message = `
🆕 <b>Новая заявка #${request.id.slice(0,8)}</b>

👤 <b>Клиент:</b> ${request.name}
📞 <b>Телефон:</b> ${request.phone}
💬 <b>Связь:</b> ${request.messenger}

🏠 <b>Услуга:</b> ${request.cleaning_type}
📍 <b>Адрес:</b> ${request.address}
📐 <b>Площадь:</b> ${request.area} м²

💰 <b>Оценка:</b> ${request.price_min} - ${request.price_max} ₸
📅 <b>Дата:</b> ${request.date} ${request.time}

⏰ <b>Создано:</b> ${new Date(request.created_at).toLocaleString('ru-RU')}
    `.trim();
    
    return this.sendMessage(this.adminChatId, message);
  }
};

// Analytics Service
export const AnalyticsService = {
  getUTM() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || 'organic',
      medium: params.get('utm_medium') || 'direct',
      campaign: params.get('utm_campaign') || 'none',
    };
  },

  trackEvent(category: string, action: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, { 
        event_category: category, 
        event_label: label, 
        value,
        ...this.getUTM()
      });
    }
    console.log(`[Analytics] ${category} -> ${action}`, { label, value, utm: this.getUTM() });
  },

  trackStep(stepName: string, stepNumber: number) {
    this.trackEvent('calculator_funnel', 'step_complete', stepName, stepNumber);
  }
};

// Export API functions using Supabase
export const api = {
  async getRequests() {
    const { data, error } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  async createRequest(data: any) {
    // ВАЖНО: Мапим данные из калькулятора в поля базы данных
    const requestData = {
      name: data.name,
      phone: data.phone,
      messenger: data.messenger,
      address: data.address,
      district: data.district || 'Алматы',
      date: data.date || '',
      time: data.time || '',
      comment: data.comment || '',
      cleaning_type: data.serviceType || 'Обычная',
      area: data.area || 0,
      price_min: data.price_min || 0,
      price_max: data.price_max || 0,
      status: 'new'
    };

    const { data: result, error } = await supabase
      .from('requests')
      .insert([requestData])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    await TelegramService.notifyNewRequest(result);
    AnalyticsService.trackEvent('conversion', 'request_submit', result.cleaning_type, result.price_min);
    
    return result;
  },
  
  async updateRequest(id: string, updateData: any) {
    const { data, error } = await supabase.from('requests').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  async getExecutors() {
    const { data, error } = await supabase.from('executors').select('*');
    if (error) throw error;
    return data;
  }
};
