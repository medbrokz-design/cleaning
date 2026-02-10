// API Service - легко заменить на реальный backend
const API_BASE = import.meta.env.VITE_API_URL || '';

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
🆕 <b>Новая заявка #${request.id}</b>

👤 <b>Клиент:</b> ${request.name}
📞 <b>Телефон:</b> ${request.phone}
💬 <b>Связь:</b> ${request.messenger}

🏠 <b>Услуга:</b> ${request.serviceType}
📍 <b>Адрес:</b> ${request.address}
📐 <b>Площадь:</b> ${request.area} м²
🚿 <b>Санузлы:</b> ${request.bathrooms}
🪟 <b>Окна:</b> ${request.windows ? 'Да' : 'Нет'}

💰 <b>Оценка:</b> ${request.estimatedPrice}
📅 <b>Дата:</b> ${request.preferredDate} ${request.preferredTime}

⏰ <b>Создано:</b> ${new Date(request.createdAt).toLocaleString('ru-RU')}
    `.trim();
    
    return this.sendMessage(this.adminChatId, message);
  },
  
  async notifyExecutor(executorChatId: string, request: any) {
    const message = `
📋 <b>Новая заявка для вас!</b>

🏠 <b>Услуга:</b> ${request.serviceType}
📍 <b>Район:</b> ${request.district}
📐 <b>Площадь:</b> ${request.area} м²

💰 <b>Оценка:</b> ${request.estimatedPrice}
📅 <b>Дата:</b> ${request.preferredDate} ${request.preferredTime}

Откликнитесь в течение 30 минут!
    `.trim();
    
    return this.sendMessage(executorChatId, message);
  },
  
  async notifyStatusChange(request: any, executor: any) {
    const statusMessages: Record<string, string> = {
      'sent': `📤 Заявка #${request.id} отправлена исполнителям`,
      'confirmed': `✅ Заявка #${request.id} подтверждена ${executor?.name}`,
      'completed': `🎉 Заявка #${request.id} выполнена!`,
      'cancelled': `❌ Заявка #${request.id} отменена`
    };
    
    return this.sendMessage(this.adminChatId, statusMessages[request.status] || '');
  }
};

// WhatsApp Business Integration
export const WhatsAppService = {
  phoneId: import.meta.env.VITE_WHATSAPP_PHONE_ID || '',
  accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '',
  
  async sendTemplate(to: string, templateName: string, parameters: string[]) {
    if (!this.accessToken) {
      console.log('WhatsApp message (demo):', { to, templateName, parameters });
      return { success: true, demo: true };
    }
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v17.0/${this.phoneId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
              name: templateName,
              language: { code: 'ru' },
              components: [{
                type: 'body',
                parameters: parameters.map(text => ({ type: 'text', text }))
              }]
            }
          })
        }
      );
      return await response.json();
    } catch (error) {
      console.error('WhatsApp error:', error);
      return { success: false, error };
    }
  },
  
  generateDirectLink(phone: string, text: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }
};

// Kaspi Integration (Mock - требует реальной интеграции через API Kaspi)
export const KaspiService = {
  merchantId: import.meta.env.VITE_KASPI_MERCHANT_ID || '',
  
  generatePaymentLink(orderId: string, amount: number, description: string) {
    // В реальности здесь будет API Kaspi
    return {
      qrCode: `kaspi://pay?merchant=${this.merchantId}&order=${orderId}&amount=${amount}`,
      deepLink: `https://kaspi.kz/pay?order=${orderId}`,
      orderId,
      amount,
      description
    };
  },
  
  async checkPaymentStatus(orderId: string) {
    // Mock - в реальности запрос к API Kaspi
    console.log('Checking Kaspi payment:', orderId);
    return {
      status: 'pending', // pending, completed, failed
      orderId,
      paidAt: null
    };
  }
};

// Analytics Service
export const AnalyticsService = {
  gaId: import.meta.env.VITE_GA_ID || '',
  ymId: import.meta.env.VITE_YM_ID || '',
  
  trackEvent(category: string, action: string, label?: string, value?: number) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value
      });
    }
    
    // Яндекс.Метрика
    if (typeof window !== 'undefined' && (window as any).ym && this.ymId) {
      (window as any).ym(this.ymId, 'reachGoal', action, { category, label, value });
    }
    
    console.log('Analytics event:', { category, action, label, value });
  },
  
  trackPageView(path: string, title: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', this.gaId, {
        page_path: path,
        page_title: title
      });
    }
    
    if (typeof window !== 'undefined' && (window as any).ym && this.ymId) {
      (window as any).ym(this.ymId, 'hit', path, { title });
    }
  },
  
  trackConversion(type: 'request_submit' | 'calculator_complete' | 'phone_click') {
    const conversionValues: Record<string, number> = {
      'request_submit': 100,
      'calculator_complete': 50,
      'phone_click': 30
    };
    
    this.trackEvent('conversion', type, undefined, conversionValues[type]);
  }
};

// Push Notifications Service
export const PushService = {
  vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || '',
  
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('Push notifications not supported');
      return false;
    }
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },
  
  async subscribe() {
    if (!('serviceWorker' in navigator)) return null;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.vapidPublicKey
      });
      
      return subscription;
    } catch (error) {
      console.error('Push subscription error:', error);
      return null;
    }
  },
  
  showLocalNotification(title: string, body: string, icon?: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/icon.png',
        badge: '/badge.png'
      });
    }
  }
};

// Export API functions
export const api = {
  // Requests
  async getRequests() {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/requests`);
      return res.json();
    }
    return JSON.parse(localStorage.getItem('requests') || '[]');
  },
  
  async createRequest(data: any) {
    const request = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      return res.json();
    }
    
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    requests.unshift(request);
    localStorage.setItem('requests', JSON.stringify(requests));
    
    // Отправить уведомление
    await TelegramService.notifyNewRequest(request);
    AnalyticsService.trackConversion('request_submit');
    
    return request;
  },
  
  async updateRequest(id: string, data: any) {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
    
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const index = requests.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...data };
      localStorage.setItem('requests', JSON.stringify(requests));
    }
    return requests[index];
  },
  
  // Executors
  async getExecutors() {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/executors`);
      return res.json();
    }
    return JSON.parse(localStorage.getItem('executors') || '[]');
  },
  
  async createExecutor(data: any) {
    const executor = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/executors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(executor)
      });
      return res.json();
    }
    
    const executors = JSON.parse(localStorage.getItem('executors') || '[]');
    executors.push(executor);
    localStorage.setItem('executors', JSON.stringify(executors));
    return executor;
  },
  
  // Analytics
  async getAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'week') {
    const requests = await this.getRequests();
    const now = new Date();
    const periodMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    }[period];
    
    const filtered = requests.filter((r: any) => 
      new Date(r.createdAt).getTime() > now.getTime() - periodMs
    );
    
    return {
      totalRequests: filtered.length,
      completedRequests: filtered.filter((r: any) => r.status === 'completed').length,
      conversionRate: filtered.length > 0 
        ? (filtered.filter((r: any) => r.status === 'completed').length / filtered.length * 100).toFixed(1)
        : 0,
      averagePrice: filtered.length > 0
        ? Math.round(filtered.reduce((sum: number, r: any) => sum + (r.estimatedPrice || 0), 0) / filtered.length)
        : 0,
      byDistrict: filtered.reduce((acc: any, r: any) => {
        acc[r.district] = (acc[r.district] || 0) + 1;
        return acc;
      }, {}),
      byService: filtered.reduce((acc: any, r: any) => {
        acc[r.serviceType] = (acc[r.serviceType] || 0) + 1;
        return acc;
      }, {}),
      byDay: this.groupByDay(filtered)
    };
  },
  
  groupByDay(requests: any[]) {
    const days: Record<string, number> = {};
    requests.forEach(r => {
      const day = new Date(r.createdAt).toLocaleDateString('ru-RU');
      days[day] = (days[day] || 0) + 1;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }
};
