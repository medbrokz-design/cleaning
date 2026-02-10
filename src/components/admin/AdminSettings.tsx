import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useNotificationStore } from '../../store/notificationStore';

export function AdminSettings() {
  const { settings, updateSettings } = useAdminStore();
  const { addNotification } = useNotificationStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    await updateSettings(localSettings);
    addNotification('Настройки сохранены', 'success');
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-4xl space-y-6">
      <h3 className="text-xl font-bold">Общие настройки</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-sm font-bold text-gray-700">Название сайта</span>
          <input type="text" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-700">Контактный телефон</span>
          <input type="text" value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl" />
        </label>
      </div>

      <button onClick={handleSave} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg">СОХРАНИТЬ ИЗМЕНЕНИЯ</button>
    </div>
  );
}