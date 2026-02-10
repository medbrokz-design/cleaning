import { useState } from 'react';
import { useAdminStore, Executor } from '../../store/adminStore';

export function AdminExecutors() {
  const { executors, districts, addExecutor, updateExecutor, toggleExecutorActive, deleteExecutor } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [editingExecutor, setEditingExecutor] = useState<Executor | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    telegram: '',
    whatsapp: '',
    email: '',
    company: '',
    districts: [] as string[],
    services: [] as string[],
    rating: 5,
    reviewsCount: 0,
    completedOrders: 0,
    priceModifier: 1,
    isActive: true,
    isVerified: false,
    hasEcoCleanig: false,
    hasSubscription: false,
    notes: '',
  });

  const filteredExecutors = executors.filter(e => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && e.isActive) || 
      (filter === 'inactive' && !e.isActive);
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExecutor) {
      updateExecutor(editingExecutor.id, formData);
    } else {
      addExecutor(formData);
    }
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      telegram: '',
      whatsapp: '',
      email: '',
      company: '',
      districts: [],
      services: [],
      rating: 5,
      reviewsCount: 0,
      completedOrders: 0,
      priceModifier: 1,
      isActive: true,
      isVerified: false,
      hasEcoCleanig: false,
      hasSubscription: false,
      notes: '',
    });
    setEditingExecutor(null);
  };

  const handleEdit = (executor: Executor) => {
    setEditingExecutor(executor);
    setFormData({
      name: executor.name,
      phone: executor.phone,
      telegram: executor.telegram || '',
      whatsapp: executor.whatsapp || '',
      email: executor.email || '',
      company: executor.company || '',
      districts: executor.districts,
      services: executor.services,
      rating: executor.rating,
      reviewsCount: executor.reviewsCount,
      completedOrders: executor.completedOrders,
      priceModifier: executor.priceModifier,
      isActive: executor.isActive,
      isVerified: executor.isVerified,
      hasEcoCleanig: executor.hasEcoCleanig,
      hasSubscription: executor.hasSubscription,
      notes: executor.notes,
    });
    setShowModal(true);
  };

  const serviceLabels: Record<string, string> = {
    regular: 'Поддерживающая',
    deep: 'Генеральная',
    postRenovation: 'После ремонта',
    eco: 'Эко-уборка',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Все', count: executors.length },
            { id: 'active', label: 'Активные', count: executors.filter(e => e.isActive).length },
            { id: 'inactive', label: 'Неактивные', count: executors.filter(e => !e.isActive).length },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-1 justify-end">
          <div className="relative w-full sm:w-64">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Поиск исполнителя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить
          </button>
        </div>
      </div>

      {/* Executors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExecutors.map((executor) => (
          <div
            key={executor.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md ${
              executor.isActive ? 'border-gray-100' : 'border-red-200 bg-red-50/30'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                  executor.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                }`}>
                  {executor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {executor.name}
                    {executor.isVerified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{executor.company || 'Частный клинер'}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                executor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {executor.isActive ? 'Активен' : 'Неактивен'}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                  <span className="text-amber-500">⭐</span>
                  {executor.rating}
                </p>
                <p className="text-xs text-gray-500">Рейтинг</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{executor.completedOrders}</p>
                <p className="text-xs text-gray-500">Заказов</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{executor.reviewsCount}</p>
                <p className="text-xs text-gray-500">Отзывов</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-4">
              {executor.hasEcoCleanig && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🌿 Эко</span>
              )}
              {executor.hasSubscription && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🔄 Подписки</span>
              )}
              {executor.services.map(s => (
                <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {serviceLabels[s] || s}
                </span>
              ))}
            </div>

            {/* Contact */}
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p className="flex items-center gap-2">
                <span>📞</span> {executor.phone}
              </p>
              {executor.telegram && (
                <p className="flex items-center gap-2">
                  <span>✈️</span> {executor.telegram}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(executor)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Редактировать
              </button>
              <button
                onClick={() => toggleExecutorActive(executor.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  executor.isActive
                    ? 'bg-red-100 hover:bg-red-200 text-red-700'
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
              >
                {executor.isActive ? 'Откл.' : 'Вкл.'}
              </button>
              <button
                onClick={() => {
                  if (confirm('Удалить исполнителя?')) {
                    deleteExecutor(executor.id);
                  }
                }}
                className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingExecutor ? 'Редактировать исполнителя' : 'Добавить исполнителя'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя / Название *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                    placeholder="ТОО, ИП или пусто"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                    placeholder="+77001234567"
                  />
                </div>
              </div>

              {/* Districts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Районы работы</label>
                <div className="flex flex-wrap gap-2">
                  {districts.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        const newDistricts = formData.districts.includes(d.id)
                          ? formData.districts.filter(id => id !== d.id)
                          : [...formData.districts, d.id];
                        setFormData({ ...formData, districts: newDistricts });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        formData.districts.includes(d.id)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Услуги</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(serviceLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        const newServices = formData.services.includes(key)
                          ? formData.services.filter(s => s !== key)
                          : [...formData.services, key];
                        setFormData({ ...formData, services: newServices });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        formData.services.includes(key)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'isActive', label: 'Активен' },
                  { key: 'isVerified', label: 'Верифицирован ✓' },
                  { key: 'hasEcoCleanig', label: 'Эко-уборка 🌿' },
                  { key: 'hasSubscription', label: 'Подписки 🔄' },
                ].map((toggle) => (
                  <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[toggle.key as keyof typeof formData] as boolean}
                      onChange={(e) => setFormData({ ...formData, [toggle.key]: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{toggle.label}</span>
                  </label>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Рейтинг</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Отзывов</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviewsCount}
                    onChange={(e) => setFormData({ ...formData, reviewsCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Заказов</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.completedOrders}
                    onChange={(e) => setFormData({ ...formData, completedOrders: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
                >
                  {editingExecutor ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
