import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useNotificationStore } from '../../store/notificationStore';

export function AdminPrices() {
  const { prices, updatePrices } = useAdminStore();
  const { addNotification } = useNotificationStore();
  const [localPrices, setLocalPrices] = useState(prices);

  const handleSave = async () => {
    await updatePrices(localPrices);
    addNotification('Цены обновлены', 'success');
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-4xl">
      <h3 className="text-xl font-bold mb-8">Настройка цен 2026</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-gray-700">Поддерживающая (от ₸/м²)</span>
            <input type="number" value={localPrices.regular} onChange={e => setLocalPrices({...localPrices, regular: parseInt(e.target.value)})} className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-gray-700">Генеральная (от ₸/м²)</span>
            <input type="number" value={localPrices.deep} onChange={e => setLocalPrices({...localPrices, deep: parseInt(e.target.value)})} className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-gray-700">Химчистка мебели (от ₸)</span>
            <input type="number" value={localPrices.furniture} onChange={e => setLocalPrices({...localPrices, furniture: parseInt(e.target.value)})} className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl" />
          </label>
        </div>
        
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-gray-700">Наценка за срочность (x1.xx)</span>
            <input type="number" step="0.05" value={localPrices.urgencyModifier} onChange={e => setLocalPrices({...localPrices, urgencyModifier: parseFloat(e.target.value)})} className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-gray-700">Наценка за грязь (x1.xx)</span>
            <input type="number" step="0.05" value={localPrices.heavyDirtModifier} onChange={e => setLocalPrices({...localPrices, heavyDirtModifier: parseFloat(e.target.value)})} className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl" />
          </label>
        </div>
      </div>

      <button onClick={handleSave} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg">СОХРАНИТЬ ВСЕ ЦЕНЫ</button>
    </div>
  );
}