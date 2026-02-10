import { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useNotificationStore } from '../store/notificationStore';

export function ExecutorPortal() {
  const { requests, executors, updateRequest } = useAdminStore();
  const { addNotification } = useNotificationStore();
  const [executorPhone, setExecutorPhone] = useState('');
  const [currentExecutor, setCurrentExecutor] = useState<any>(null);

  const handleLogin = () => {
    const found = executors.find(e => e.phone.replace(/\D/g, '') === executorPhone.replace(/\D/g, ''));
    if (found) {
      setCurrentExecutor(found);
      addNotification(`Добро пожаловать, ${found.name}!`, 'success');
    } else {
      addNotification('Исполнитель не найден', 'error');
    }
  };

  const executorRequests = requests.filter(r => r.assigned_executors.includes(currentExecutor?.id));

  if (!currentExecutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
          <div className="text-5xl mb-4">🧹</div>
          <h1 className="text-2xl font-bold mb-6">Вход для исполнителей</h1>
          <input
            type="tel"
            placeholder="+7 (7xx) xxx-xx-xx"
            value={executorPhone}
            onChange={(e) => setExecutorPhone(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl mb-4 outline-none focus:border-emerald-500"
          />
          <button onClick={handleLogin} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold">Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Мои заказы</h1>
          <button onClick={() => setCurrentExecutor(null)} className="text-gray-400 text-sm">Выйти</button>
        </div>

        <div className="space-y-4">
          {executorRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-12">У вас пока нет назначенных заказов</p>
          ) : (
            executorRequests.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {req.status === 'confirmed' ? 'В работе' : 'Назначен'}
                  </span>
                  <span className="text-emerald-600 font-bold">{req.price_min} ₸</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{req.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{req.address}</p>
                
                {req.status === 'sent' && (
                  <button onClick={() => updateRequest(req.id, { status: 'confirmed' })} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold mb-2">Принять заказ</button>
                )}
                {req.status === 'confirmed' && (
                  <button onClick={() => updateRequest(req.id, { status: 'completed' })} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold">Завершить</button>
                )}
                <a href={`tel:${req.phone}`} className="block w-full py-3 text-center border-2 border-gray-100 rounded-xl font-bold text-gray-600">Позвонить клиенту</a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}