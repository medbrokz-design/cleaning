import { useState } from 'react';
import { useAdminStore, Request } from '../../store/adminStore';

export function AdminRequests() {
  const { requests, executors, updateRequest, assignExecutor, deleteRequest } = useAdminStore();
  const [filter, setFilter] = useState<'all' | 'new' | 'sent' | 'confirmed' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'sent': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'sent': return 'Отправлена';
      case 'confirmed': return 'Подтверждена';
      case 'completed': return 'Выполнена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  const getCleaningLabel = (type: string) => {
    switch (type) {
      case 'regular': return 'Поддерживающая';
      case 'deep': return 'Генеральная';
      case 'post-renovation': return 'После ремонта';
      case 'eco': return 'Эко-уборка';
      default: return type;
    }
  };

  const handleAssign = (executorId: string) => {
    if (selectedRequest) {
      assignExecutor(selectedRequest.id, executorId);
    }
  };

  const handleStatusChange = (requestId: string, newStatus: Request['status']) => {
    updateRequest(requestId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Все', count: requests.length },
            { id: 'new', label: 'Новые', count: requests.filter(r => r.status === 'new').length },
            { id: 'sent', label: 'Отправлены', count: requests.filter(r => r.status === 'sent').length },
            { id: 'confirmed', label: 'Подтверждены', count: requests.filter(r => r.status === 'confirmed').length },
            { id: 'completed', label: 'Выполнены', count: requests.filter(r => r.status === 'completed').length },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                filter === f.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filter === f.id ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Поиск по имени, тел..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Клиент</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Услуга</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Адрес</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Дата</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Цена</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Статус</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold">
                        {request.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{request.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          {request.messenger === 'whatsapp' && '📱'}
                          {request.messenger === 'telegram' && '✈️'}
                          {request.messenger === 'phone' && '📞'}
                          {request.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{getCleaningLabel(request.cleaningType)}</p>
                    <p className="text-sm text-gray-500">{request.area} м² • {request.bathrooms} сан.</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900 truncate max-w-[200px]">{request.address}</p>
                    <p className="text-sm text-gray-500">{request.district}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900">{request.date}</p>
                    <p className="text-sm text-gray-500">
                      {request.time === 'morning' && '🌅 Утро'}
                      {request.time === 'afternoon' && '☀️ День'}
                      {request.time === 'evening' && '🌆 Вечер'}
                      {!request.time && 'Любое'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-emerald-600">
                      {request.priceMin.toLocaleString()} - {request.priceMax.toLocaleString()} ₸
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusLabel(request.status)}
                    </span>
                    {request.assignedExecutors.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {request.assignedExecutors.length} исполнит.
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowAssignModal(true);
                        }}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Назначить исполнителя"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </button>
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value as Request['status'])}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white"
                      >
                        <option value="new">Новая</option>
                        <option value="sent">Отправлена</option>
                        <option value="confirmed">Подтверждена</option>
                        <option value="completed">Выполнена</option>
                        <option value="cancelled">Отменена</option>
                      </select>
                      <button
                        onClick={() => {
                          if (confirm('Удалить заявку?')) {
                            deleteRequest(request.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет заявок</p>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Назначить исполнителей
                </h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Заявка: {selectedRequest.name} — {selectedRequest.address}
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-96 space-y-3">
              {executors.filter(e => e.isActive).map((executor) => {
                const isAssigned = selectedRequest.assignedExecutors.includes(executor.id);
                return (
                  <div
                    key={executor.id}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isAssigned
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                    onClick={() => handleAssign(executor.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        isAssigned ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}>
                        {isAssigned ? '✓' : executor.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          {executor.name}
                          {executor.isVerified && (
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          ⭐ {executor.rating} • {executor.completedOrders} заказов
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {executor.hasEcoCleanig && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🌿 Эко</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={() => {
                  // Send notifications to assigned executors
                  alert(`Уведомления отправлены ${selectedRequest.assignedExecutors.length} исполнителям`);
                  setShowAssignModal(false);
                }}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
              >
                Отправить заявку ({selectedRequest.assignedExecutors.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
