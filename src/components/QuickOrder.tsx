import { useState } from 'react';
import { formatPhoneNumber, isValidPhone } from '../utils/validators';
import { api } from '../store/apiService';
import { useNotificationStore } from '../store/notificationStore';

export function QuickOrder() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      addNotification('Введите корректный номер телефона', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await api.createRequest({
        name: 'Быстрый заказ',
        phone: phone,
        messenger: 'phone',
        address: 'Уточнить по телефону',
        serviceType: 'Быстрый заказ',
        area: 0,
        price_min: 0,
        price_max: 0,
        comment: '⚡ Заявка в 1 клик. Клиент ждет звонка.'
      });
      addNotification('Заявка принята! Перезвоним через 5 минут.', 'success');
      setPhone('');
    } catch (error) {
      addNotification('Ошибка отправки. Попробуйте еще раз.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl animate-fade-in-up">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
          placeholder="+7 (7xx) xxx-xx-xx"
          className="flex-1 px-6 py-4 bg-white rounded-xl text-gray-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-400 text-white rounded-xl font-black uppercase tracking-tighter transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          {isLoading ? '...' : 'Жду звонка'}
        </button>
      </form>
      <p className="text-[10px] text-white/60 mt-2 text-center uppercase font-bold tracking-widest">
        ⚡ Перезвоним в течение 5 минут
      </p>
    </div>
  );
}
