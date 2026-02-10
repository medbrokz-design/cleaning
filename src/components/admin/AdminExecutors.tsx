import { useState } from 'react';
import { useAdminStore, Executor } from '../../store/adminStore';
import { useNotificationStore } from '../../store/notificationStore';

export function AdminExecutors() {
  const { executors, addExecutor, updateExecutor, toggleExecutorActive, deleteExecutor } = useAdminStore();
  const { addNotification } = useNotificationStore();
  const [showModal, setShowModal] = useState(false);
  const [editingExecutor, setEditingExecutor] = useState<Executor | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Executor>>({
    name: '',
    phone: '',
    company: '',
    rating: 5,
    completed_orders: 0,
    reviews_count: 0,
    is_active: true,
    is_verified: false,
    is_premium: false,
    has_eco_cleaning: false,
    has_subscription: false,
    services: [],
    districts: []
  });

  const filteredExecutors = executors.filter(e => {
    const matchesFilter = filter === 'all' || (filter === 'active' && e.is_active) || (filter === 'inactive' && !e.is_active);
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || (e.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExecutor) {
      await updateExecutor(editingExecutor.id, formData);
      addNotification('Исполнитель обновлен', 'success');
    } else {
      await addExecutor(formData);
      addNotification('Исполнитель добавлен', 'success');
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === f ? 'bg-emerald-500 text-white' : 'bg-gray-100'}`}>
              {f === 'all' ? 'Все' : f === 'active' ? 'Активные' : 'Неактивные'}
            </button>
          ))}
        </div>
        <button onClick={() => { setEditingExecutor(null); setShowModal(true); }} className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold">+ Добавить</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExecutors.map(ex => (
          <div key={ex.id} className={`bg-white p-6 rounded-2xl border ${ex.is_active ? 'border-gray-100' : 'border-red-100 bg-red-50/10'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{ex.name}</h3>
                <p className="text-xs text-gray-500">{ex.company || 'Частный мастер'}</p>
              </div>
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${ex.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {ex.is_active ? 'Активен' : 'Отключен'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-gray-50 p-2 rounded-lg"><p className="text-sm font-bold">⭐ {ex.rating}</p></div>
              <div className="bg-gray-50 p-2 rounded-lg"><p className="text-sm font-bold">📦 {ex.completed_orders}</p></div>
              <div className="bg-gray-50 p-2 rounded-lg"><p className="text-sm font-bold">💬 {ex.reviews_count}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingExecutor(ex); setFormData(ex); setShowModal(true); }} className="flex-1 py-2 bg-gray-100 rounded-lg text-xs font-bold">Редактировать</button>
              <button onClick={() => toggleExecutorActive(ex.id)} className={`px-4 py-2 rounded-lg text-xs font-bold ${ex.is_active ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {ex.is_active ? 'Выкл' : 'Вкл'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}