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
    const nameMatch = (r.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = (r.phone || '').includes(searchTerm);
    const addressMatch = (r.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && (nameMatch || phoneMatch || addressMatch);
  });

  const exportToCSV = () => {
    const headers = ['ID', 'Клиент', 'Телефон', 'Услуга', 'Адрес', 'Дата', 'Статус'];
    const rows = filteredRequests.map(r => [
      r.id, r.name, r.phone, r.cleaning_type, r.address, r.date, r.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `requests_${new Date().getTime()}.csv`;
    link.click();
    addNotification('Данные экспортированы', 'success');
  };

  const handleStatusChange = async (requestId: string, newStatus: Request['status']) => {
    await updateRequest(requestId, { status: newStatus });
    addNotification('Статус обновлен', 'info');
  };

  const handleAssign = async (executorId: string) => {
    if (selectedRequest) {
      await assignExecutor(selectedRequest.id, executorId);
      addNotification('Исполнитель назначен', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'sent', 'confirmed', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {f === 'all' ? 'Все' : f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 lg:w-64 px-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <button onClick={exportToCSV} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold">📊 Экспорт</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left border-b border-gray-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Клиент</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Услуга</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Адрес</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Статус</th>
                <th className="p-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{req.name}</p>
                    <p className="text-xs text-gray-500">{req.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{req.cleaning_type}</p>
                    <p className="text-xs text-emerald-600 font-bold">{req.price_min} ₸</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{req.address}</td>
                  <td className="p-4">
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value as any)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="new">Новая</option>
                      <option value="sent">Отправлена</option>
                      <option value="confirmed">Принята</option>
                      <option value="completed">Выполнена</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => { setSelectedRequest(req); setShowAssignModal(true); }}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      👤+
                    </button>
                    <button
                      onClick={() => { if(confirm('Удалить?')) deleteRequest(req.id); }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Назначить исполнителя</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
              {executors.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => handleAssign(ex.id)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${selectedRequest.assignedExecutors.includes(ex.id) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}
                >
                  <div className="font-bold">{ex.name}</div>
                  <div className="text-xs text-gray-500">⭐ {ex.rating} • {ex.completedOrders} заказов</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowAssignModal(false)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}