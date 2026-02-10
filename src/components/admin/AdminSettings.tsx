import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';

export function AdminSettings() {
  const { settings, updateSettings } = useAdminStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'integrations'>('general');

  const handleChange = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setLocalSettings({ ...localSettings, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
    alert('Настройки сохранены!');
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'general', label: 'Основные', icon: '⚙️' },
            { id: 'notifications', label: 'Уведомления', icon: '🔔' },
            { id: 'integrations', label: 'Интеграции', icon: '🔗' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Основные настройки</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Название сайта</label>
              <input
                type="text"
                value={localSettings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
              <input
                type="text"
                value={localSettings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={localSettings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Время ответа (для отображения)</label>
              <input
                type="text"
                value={localSettings.responseTime}
                onChange={(e) => handleChange('responseTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                placeholder="1-2 часа"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Время работы (начало)</label>
              <input
                type="number"
                min="0"
                max="23"
                value={localSettings.workingHours.start}
                onChange={(e) => handleChange('workingHours', { ...localSettings.workingHours, start: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Время работы (конец)</label>
              <input
                type="number"
                min="0"
                max="23"
                value={localSettings.workingHours.end}
                onChange={(e) => handleChange('workingHours', { ...localSettings.workingHours, end: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Макс. исполнителей на заявку</label>
              <input
                type="number"
                min="1"
                max="10"
                value={localSettings.maxExecutorsPerRequest}
                onChange={(e) => handleChange('maxExecutorsPerRequest', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoAssignExecutors}
                  onChange={(e) => handleChange('autoAssignExecutors', e.target.checked)}
                  className="w-5 h-5 text-emerald-500 rounded"
                />
                <span className="text-gray-700">Авто-назначение исполнителей</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Настройки уведомлений</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✈️</span>
                  <div>
                    <p className="font-medium text-gray-900">Telegram уведомления</p>
                    <p className="text-sm text-gray-500">Получать новые заявки в Telegram</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.notifyTelegram}
                  onChange={(e) => handleChange('notifyTelegram', e.target.checked)}
                  className="w-6 h-6 text-emerald-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-medium text-gray-900">Email уведомления</p>
                    <p className="text-sm text-gray-500">Получать дайджест на почту</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.notifyEmail}
                  onChange={(e) => handleChange('notifyEmail', e.target.checked)}
                  className="w-6 h-6 text-emerald-500 rounded"
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Шаблоны сообщений</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Новая заявка (для исполнителя)</label>
                <textarea
                  rows={3}
                  defaultValue="🔔 Новая заявка!\n\nКлиент: {name}\nУслуга: {service}\nАдрес: {address}\nЦена: {price}"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Подтверждение (для клиента)</label>
                <textarea
                  rows={3}
                  defaultValue="✅ Ваша заявка принята!\n\nС вами свяжутся в течение {time}.\n\nНомер заявки: {id}"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Интеграции</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Telegram Bot */}
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">✈️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Telegram Bot</h4>
                    <p className="text-sm text-gray-500">Для уведомлений и управления</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={localSettings.telegramBot}
                  onChange={(e) => handleChange('telegramBot', e.target.value)}
                  placeholder="@your_bot"
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                />
                <button className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Подключить бота
                </button>
              </div>

              {/* WhatsApp */}
              <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WhatsApp Business</h4>
                    <p className="text-sm text-gray-500">Для связи с клиентами</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={localSettings.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="+77001234567"
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:border-green-500 outline-none bg-white"
                />
                <button className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Подключить WhatsApp
                </button>
              </div>

              {/* Google Analytics */}
              <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Google Analytics</h4>
                    <p className="text-sm text-gray-500">Отслеживание конверсий</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:border-orange-500 outline-none bg-white"
                />
                <button className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Подключить
                </button>
              </div>

              {/* Yandex Metrica */}
              <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">📈</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Яндекс.Метрика</h4>
                    <p className="text-sm text-gray-500">Аналитика и вебвизор</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="12345678"
                  className="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:border-yellow-500 outline-none bg-white"
                />
                <button className="mt-3 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Подключить
                </button>
              </div>
            </div>
          </div>

          {/* Webhooks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Webhook (для CRM)</h3>
            <p className="text-sm text-gray-500 mb-4">Отправлять заявки во внешнюю CRM систему</p>
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://your-crm.com/webhook"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                Тест
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setLocalSettings(settings)}
          disabled={!hasChanges}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-xl font-medium transition-colors"
        >
          Отменить изменения
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
