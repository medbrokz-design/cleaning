import React, { useState } from 'react';
import { useEnhancedStore } from '../../store/enhancedStore';

// Dashboard Tab
const DashboardTab: React.FC = () => {
  const { requests, executors, getStats } = useEnhancedStore();
  const stats = getStats();
  
  const recentRequests = requests.slice(0, 5);
  const topExecutors = [...executors]
    .filter(e => e.isActive)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
  });

  const requestsByDay = last7Days.map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStr = date.toDateString();
    return requests.filter(r => new Date(r.createdAt).toDateString() === dayStr).length;
  });

  const maxRequests = Math.max(...requestsByDay, 1);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Всего заявок</p>
              <p className="text-3xl font-bold">{stats.totalRequests}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              📋
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-100">
            <span className="bg-white/20 px-2 py-0.5 rounded-full">
              +{stats.newRequests} новых
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Выполнено</p>
              <p className="text-3xl font-bold">{stats.completedRequests}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
          <div className="mt-4 text-sm text-green-100">
            Конверсия: {stats.conversionRate}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Доход</p>
              <p className="text-3xl font-bold">{(stats.totalRevenue / 1000).toFixed(0)}K ₸</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-100">
            Средний чек: {stats.completedRequests > 0 ? Math.round(stats.totalRevenue / stats.completedRequests).toLocaleString() : 0} ₸
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Рейтинг</p>
              <p className="text-3xl font-bold">{stats.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              ⭐
            </div>
          </div>
          <div className="mt-4 text-sm text-amber-100">
            {stats.activeExecutors} активных исполнителей
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Заявки за неделю</h3>
        <div className="flex items-end justify-between h-40 gap-2">
          {requestsByDay.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">{count}</span>
                <div 
                  className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(count / maxRequests) * 100}px`, minHeight: count > 0 ? '20px' : '4px' }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">{last7Days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">🆕 Новые заявки</h3>
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
              {stats.newRequests} ожидают
            </span>
          </div>
          <div className="space-y-3">
            {recentRequests.map(request => (
              <div key={request.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  request.status === 'new' ? 'bg-red-500' :
                  request.status === 'sent' ? 'bg-yellow-500' :
                  request.status === 'confirmed' ? 'bg-blue-500' :
                  request.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{request.name}</p>
                  <p className="text-sm text-gray-500">{request.serviceType} • {request.area} м²</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{request.estimatedPrice.toLocaleString()} ₸</p>
                  <p className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Executors */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">🏆 Топ исполнителей</h3>
            <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
              {stats.activeExecutors} онлайн
            </span>
          </div>
          <div className="space-y-3">
            {topExecutors.map((executor, index) => (
              <div key={executor.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{executor.name}</p>
                  <p className="text-sm text-gray-500">{executor.company || 'Частный мастер'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-500">★ {executor.rating}</p>
                  <p className="text-xs text-gray-500">{executor.completedOrders} заказов</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      {stats.pendingReviews > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Отзывы ждут модерации</h3>
              <p className="text-amber-600">{stats.pendingReviews} отзывов требуют проверки</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Requests Tab
const RequestsTab: React.FC = () => {
  const { requests, executors, updateRequest, assignExecutor, confirmExecutor, deleteRequest } = useEnhancedStore();
  const [filter, setFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const statusColors: Record<string, string> = {
    new: 'bg-red-100 text-red-700',
    sent: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-700'
  };

  const statusLabels: Record<string, string> = {
    new: 'Новая',
    sent: 'Отправлена',
    confirmed: 'Подтверждена',
    in_progress: 'В работе',
    completed: 'Выполнена',
    cancelled: 'Отменена'
  };

  const serviceLabels: Record<string, string> = {
    maintenance: 'Поддерживающая',
    general: 'Генеральная',
    renovation: 'После ремонта',
    eco: 'Эко-уборка'
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'new', 'sent', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Все' : statusLabels[status]}
            <span className="ml-2 text-xs opacity-75">
              ({status === 'all' ? requests.length : requests.filter(r => r.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map(request => (
          <div key={request.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">
                    🏠
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{request.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[request.status]}`}>
                        {statusLabels[request.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {serviceLabels[request.serviceType]} • {request.area} м² • {request.district}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{request.estimatedPrice.toLocaleString()} ₸</p>
                  <p className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedRequest === request.id && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">📞 Контакты</h4>
                    <p className="text-gray-600">{request.phone}</p>
                    <p className="text-gray-600 capitalize">{request.messenger}</p>
                    <p className="text-gray-600">{request.address}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">📋 Детали</h4>
                    <p className="text-gray-600">Санузлы: {request.bathrooms}</p>
                    <p className="text-gray-600">Окна: {request.windows ? 'Да' : 'Нет'}</p>
                    <p className="text-gray-600">Загрязнение: {request.dirtLevel === 'heavy' ? 'Сильное' : 'Обычное'}</p>
                    <p className="text-gray-600">Дата: {request.preferredDate} {request.preferredTime}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {request.status === 'new' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Назначить исполнителей:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {executors.filter(e => e.isActive && e.districts.includes(request.district)).map(executor => (
                          <button
                            key={executor.id}
                            onClick={() => assignExecutor(request.id, executor.id)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              request.assignedExecutors.includes(executor.id)
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {executor.name} (★{executor.rating})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.status === 'sent' && request.assignedExecutors.length > 0 && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Подтвердить исполнителя:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {request.assignedExecutors.map(exId => {
                          const executor = executors.find(e => e.id === exId);
                          return executor ? (
                            <button
                              key={exId}
                              onClick={() => confirmExecutor(request.id, exId)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              ✓ {executor.name}
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {request.status === 'confirmed' && (
                      <button
                        onClick={() => updateRequest(request.id, { status: 'in_progress' })}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        🚀 Начать работу
                      </button>
                    )}
                    {request.status === 'in_progress' && (
                      <button
                        onClick={() => updateRequest(request.id, { status: 'completed', completedAt: new Date().toISOString() })}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✅ Завершить
                      </button>
                    )}
                    {request.status !== 'completed' && request.status !== 'cancelled' && (
                      <button
                        onClick={() => updateRequest(request.id, { status: 'cancelled' })}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        ✕ Отменить
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Удалить заявку?')) deleteRequest(request.id);
                      }}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">📭</p>
            <p>Нет заявок с выбранным статусом</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Executors Tab
const ExecutorsTab: React.FC = () => {
  const { executors, addExecutor, updateExecutor, deleteExecutor, toggleExecutorActive } = useEnhancedStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    telegram: '',
    telegramChatId: '',
    whatsapp: '',
    districts: [] as string[],
    services: [] as string[],
    isActive: true,
    isVerified: false,
    supportsEco: false,
    supportsSubscription: false,
    responseTime: 30,
    priceModifier: 1.0,
    notes: ''
  });

  const allDistricts = [
    'Алмалинский', 'Ауэзовский', 'Бостандыкский', 'Жетысуский',
    'Медеуский', 'Наурызбайский', 'Турксибский', 'Алатауский'
  ];

  const allServices = [
    { id: 'maintenance', label: 'Поддерживающая' },
    { id: 'general', label: 'Генеральная' },
    { id: 'renovation', label: 'После ремонта' },
    { id: 'eco', label: 'Эко-уборка' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateExecutor(editingId, formData);
    } else {
      addExecutor(formData);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '', company: '', phone: '', email: '', telegram: '', telegramChatId: '',
      whatsapp: '', districts: [], services: [], isActive: true, isVerified: false,
      supportsEco: false, supportsSubscription: false, responseTime: 30, priceModifier: 1.0, notes: ''
    });
  };

  const startEdit = (executor: typeof executors[0]) => {
    setFormData({
      name: executor.name,
      company: executor.company || '',
      phone: executor.phone,
      email: executor.email || '',
      telegram: executor.telegram || '',
      telegramChatId: executor.telegramChatId || '',
      whatsapp: executor.whatsapp || '',
      districts: executor.districts,
      services: executor.services,
      isActive: executor.isActive,
      isVerified: executor.isVerified,
      supportsEco: executor.supportsEco,
      supportsSubscription: executor.supportsSubscription,
      responseTime: executor.responseTime,
      priceModifier: executor.priceModifier,
      notes: executor.notes || ''
    });
    setEditingId(executor.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          👥 Исполнители ({executors.length})
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> Добавить
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'Редактировать исполнителя' : 'Новый исполнитель'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Районы *</label>
                <div className="flex flex-wrap gap-2">
                  {allDistricts.map(district => (
                    <button
                      key={district}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        districts: formData.districts.includes(district)
                          ? formData.districts.filter(d => d !== district)
                          : [...formData.districts, district]
                      })}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        formData.districts.includes(district)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Услуги *</label>
                <div className="flex flex-wrap gap-2">
                  {allServices.map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        services: formData.services.includes(service.id)
                          ? formData.services.filter(s => s !== service.id)
                          : [...formData.services, service.id]
                      })}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        formData.services.includes(service.id)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {service.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Активен</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={e => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Проверен</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.supportsEco}
                    onChange={e => setFormData({ ...formData, supportsEco: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Эко</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.supportsSubscription}
                    onChange={e => setFormData({ ...formData, supportsSubscription: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Подписки</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  {editingId ? 'Сохранить' : 'Добавить'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Executors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {executors.map(executor => (
          <div key={executor.id} className={`bg-white rounded-2xl shadow-lg p-6 ${!executor.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{executor.name}</h3>
                  <p className="text-sm text-gray-500">{executor.company || 'Частный мастер'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {executor.isVerified && <span className="text-blue-500" title="Проверен">✓</span>}
                {executor.supportsEco && <span title="Эко-уборка">🌿</span>}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-amber-500 font-semibold">★ {executor.rating}</span>
                <span className="text-gray-500 text-sm">{executor.reviewsCount} отзывов</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Выполнено:</span>
                <span className="font-medium text-gray-700">{executor.completedOrders} заказов</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Ответ:</span>
                <span className="font-medium text-gray-700">{executor.responseTime} мин</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {executor.districts.slice(0, 3).map(d => (
                <span key={d} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{d}</span>
              ))}
              {executor.districts.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">+{executor.districts.length - 3}</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleExecutorActive(executor.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  executor.isActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {executor.isActive ? '✓ Активен' : '○ Неактивен'}
              </button>
              <button
                onClick={() => startEdit(executor)}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ✎
              </button>
              <button
                onClick={() => { if (confirm('Удалить исполнителя?')) deleteExecutor(executor.id); }}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reviews Tab
const ReviewsTab: React.FC = () => {
  const { reviews, executors, moderateReview, deleteReview } = useEnhancedStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all');

  const filteredReviews = filter === 'all' 
    ? reviews 
    : filter === 'pending' 
      ? reviews.filter(r => !r.isPublished)
      : reviews.filter(r => r.isPublished);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'Все' },
          { value: 'pending', label: 'Ожидают модерации' },
          { value: 'published', label: 'Опубликованы' }
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as typeof filter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f.value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(review => {
          const executor = executors.find(e => e.id === review.executorId);
          return (
            <div key={review.id} className={`bg-white rounded-2xl shadow-lg p-6 ${!review.isPublished ? 'border-2 border-amber-200' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{review.clientName}</span>
                    <span className="text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Исполнитель: {executor?.name || 'Неизвестен'} • {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  review.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {review.isPublished ? '✓ Опубликован' : '⏳ На модерации'}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{review.text}</p>

              <div className="flex gap-2">
                {!review.isPublished && (
                  <>
                    <button
                      onClick={() => moderateReview(review.id, true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✓ Опубликовать
                    </button>
                    <button
                      onClick={() => moderateReview(review.id, false)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Отклонить
                    </button>
                  </>
                )}
                {review.isPublished && (
                  <button
                    onClick={() => moderateReview(review.id, false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Снять с публикации
                  </button>
                )}
                <button
                  onClick={() => { if (confirm('Удалить отзыв?')) deleteReview(review.id); }}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          );
        })}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">💬</p>
            <p>Нет отзывов</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Analytics Tab
const AnalyticsTab: React.FC = () => {
  const { requests, executors } = useEnhancedStore();

  // Service distribution
  const serviceStats = requests.reduce((acc, r) => {
    acc[r.serviceType] = (acc[r.serviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const serviceLabels: Record<string, string> = {
    maintenance: 'Поддерживающая',
    general: 'Генеральная',
    renovation: 'После ремонта',
    eco: 'Эко-уборка'
  };

  const serviceColors: Record<string, string> = {
    maintenance: 'bg-blue-500',
    general: 'bg-green-500',
    renovation: 'bg-orange-500',
    eco: 'bg-emerald-500'
  };

  // District distribution
  const districtStats = requests.reduce((acc, r) => {
    acc[r.district] = (acc[r.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Revenue by month
  const monthlyRevenue = requests
    .filter(r => r.status === 'completed')
    .reduce((acc, r) => {
      const month = new Date(r.completedAt || r.createdAt).toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + (r.finalPrice || r.estimatedPrice);
      return acc;
    }, {} as Record<string, number>);

  const totalRequests = requests.length || 1;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">📊 Аналитика</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Services Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">По типу услуги</h3>
          <div className="space-y-3">
            {Object.entries(serviceStats).map(([service, count]) => (
              <div key={service}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{serviceLabels[service] || service}</span>
                  <span className="font-medium">{count} ({Math.round(count / totalRequests * 100)}%)</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${serviceColors[service] || 'bg-gray-500'} rounded-full transition-all duration-500`}
                    style={{ width: `${count / totalRequests * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Districts Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">По районам</h3>
          <div className="space-y-3">
            {Object.entries(districtStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([district, count]) => (
                <div key={district}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{district}</span>
                    <span className="font-medium">{count} заявок</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${count / totalRequests * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Доход по месяцам</h3>
          {Object.keys(monthlyRevenue).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(monthlyRevenue).map(([month, revenue]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-gray-600">{month}</span>
                  <span className="font-semibold text-gray-800">{revenue.toLocaleString()} ₸</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Нет данных о доходе</p>
          )}
        </div>

        {/* Executors Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Статистика исполнителей</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Всего исполнителей:</span>
              <span className="font-semibold">{executors.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Активных:</span>
              <span className="font-semibold text-green-600">{executors.filter(e => e.isActive).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Верифицированных:</span>
              <span className="font-semibold text-blue-600">{executors.filter(e => e.isVerified).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Поддерживают эко:</span>
              <span className="font-semibold text-emerald-600">{executors.filter(e => e.supportsEco).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Средний рейтинг:</span>
              <span className="font-semibold text-amber-500">
                ★ {executors.length > 0 ? (executors.reduce((s, e) => s + e.rating, 0) / executors.length).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab
const SettingsTab: React.FC = () => {
  const { exportToCSV, exportToJSON } = useEnhancedStore();
  const [settings, setSettings] = useState({
    siteName: 'CleanAlmaty',
    phone: '+7 (727) 123-45-67',
    email: 'info@cleanalmaty.kz',
    workingHours: '8:00 — 22:00',
    telegramBot: '',
    telegramAdminChat: '',
    whatsappPhone: '',
    autoAssign: true,
    maxExecutorsPerRequest: 3,
    notifyTelegram: true,
    notifyEmail: false
  });

  const handleExport = (type: 'requests' | 'executors' | 'reviews', format: 'csv' | 'json') => {
    const data = format === 'csv' ? exportToCSV(type) : exportToJSON(type);
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">⚙️ Настройки</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Основные</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название сайта</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input
                type="text"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время работы</label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={e => setSettings({ ...settings, workingHours: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Интеграции</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telegram Bot Token</label>
              <input
                type="password"
                value={settings.telegramBot}
                onChange={e => setSettings({ ...settings, telegramBot: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="123456789:ABC..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Chat ID</label>
              <input
                type="text"
                value={settings.telegramAdminChat}
                onChange={e => setSettings({ ...settings, telegramAdminChat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="-1001234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business</label>
              <input
                type="text"
                value={settings.whatsappPhone}
                onChange={e => setSettings({ ...settings, whatsappPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="+77771234567"
              />
            </div>
          </div>
        </div>

        {/* Automation */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Автоматизация</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Авто-назначение исполнителей</span>
              <input
                type="checkbox"
                checked={settings.autoAssign}
                onChange={e => setSettings({ ...settings, autoAssign: e.target.checked })}
                className="w-5 h-5 text-emerald-600 rounded"
              />
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Макс. исполнителей на заявку
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxExecutorsPerRequest}
                onChange={e => setSettings({ ...settings, maxExecutorsPerRequest: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Telegram уведомления</span>
              <input
                type="checkbox"
                checked={settings.notifyTelegram}
                onChange={e => setSettings({ ...settings, notifyTelegram: e.target.checked })}
                className="w-5 h-5 text-emerald-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Email уведомления</span>
              <input
                type="checkbox"
                checked={settings.notifyEmail}
                onChange={e => setSettings({ ...settings, notifyEmail: e.target.checked })}
                className="w-5 h-5 text-emerald-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Export */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Экспорт данных</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Заявки</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('requests', 'csv')}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📊 CSV
                </button>
                <button
                  onClick={() => handleExport('requests', 'json')}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📋 JSON
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Исполнители</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('executors', 'csv')}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📊 CSV
                </button>
                <button
                  onClick={() => handleExport('executors', 'json')}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📋 JSON
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Отзывы</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('reviews', 'csv')}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📊 CSV
                </button>
                <button
                  onClick={() => handleExport('reviews', 'json')}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📋 JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
        💾 Сохранить настройки
      </button>
    </div>
  );
};

// Main Admin Dashboard Component
export const AdminDashboard: React.FC = () => {
  const { currentUser, isAuthenticated, login, logout, notifications, markAllAsRead } = useEnhancedStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginForm.email, loginForm.password);
    if (!success) {
      setLoginError('Неверный email или пароль');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🔐
            </div>
            <h1 className="text-2xl font-bold text-gray-800">CleanAlmaty Admin</h1>
            <p className="text-gray-500">Войдите для управления сайтом</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="admin@cleanalmaty.kz"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Войти
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Demo: admin@cleanalmaty.kz / admin2026
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: '📊' },
    { id: 'requests', label: 'Заявки', icon: '📋' },
    { id: 'executors', label: 'Исполнители', icon: '👥' },
    { id: 'reviews', label: 'Отзывы', icon: '⭐' },
    { id: 'analytics', label: 'Аналитика', icon: '📈' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#" className="text-xl font-bold text-emerald-600">
              🧹 CleanAlmaty
            </a>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Админ-панель</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Уведомления</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Прочитать все
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.slice(0, 5).map(n => (
                      <div
                        key={n.id}
                        className={`p-4 border-b border-gray-50 ${!n.isRead ? 'bg-emerald-50' : ''}`}
                      >
                        <p className="font-medium text-gray-800">{n.title}</p>
                        <p className="text-sm text-gray-500">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="p-4 text-center text-gray-500">Нет уведомлений</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.role}</p>
              </div>
              <button
                onClick={logout}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'requests' && <RequestsTab />}
        {activeTab === 'executors' && <ExecutorsTab />}
        {activeTab === 'reviews' && <ReviewsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;
