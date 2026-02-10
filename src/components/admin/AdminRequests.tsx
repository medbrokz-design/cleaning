import { useState } from 'react';
import { useAdminStore, Request } from '../../store/adminStore';
import { useNotificationStore } from '../../store/notificationStore';

export function AdminRequests() {
  const { requests, executors, updateRequest, assignExecutor, deleteRequest } = useAdminStore();
  const { addNotification } = useNotificationStore();
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

  const exportToCSV = () => {
    const headers = ['ID', 'Клиент', 'Телефон', 'Услуга', 'Адрес', 'Район', 'Дата', 'Цена', 'Статус'];
    const rows = filteredRequests.map(r => [
      r.id, r.name, r.phone, r.cleaningType, r.address, r.district, r.date, `${r.priceMin}-${r.priceMax}`, r.status
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `requests_export_${new Date().toLocaleDateString()}.csv`;
    link.click();
    addNotification('Экспорт в CSV успешно выполнен', 'success');
  };

  const sendWhatsApp = (request: Request) => {
    const text = `Здравствуйте, ${request.name}! Вы оставляли заявку на клининг (${request.cleaningType}) по адресу: ${request.address}. Мы подобрали для вас исполнителей.`;
    window.open(`https://wa.me/${request.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleStatusChange = (requestId: string, newStatus: Request['status']) => {
    updateRequest(requestId, { status: newStatus });
    addNotification(`Статус заявки #${requestId} изменен на ${newStatus}`, 'info');
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить заявку?')) {
      deleteRequest(id);
      addNotification('Заявка удалена', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {/* ... существующие фильтры ... */}
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Все ({requests.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Новые ({requests.filter(r => r.status === 'new').length})
          </button>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <input
              type="text"
              placeholder="Поиск по имени..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            📊 Экспорт
          </button>
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
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Статус</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{request.name}</p>
                    <p className="text-xs text-gray-500">{request.phone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm">{request.cleaningType}</p>
                    <p className="text-xs text-emerald-600 font-bold">{request.priceMin} ₸</p>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value as Request['status'])}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="new">Новая</option>
                      <option value="sent">Отправлена</option>
                      <option value="confirmed">Подтверждена</option>
                      <option value="completed">Выполнена</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => sendWhatsApp(request)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Написать в WhatsApp"
                      >
                        📱
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


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
