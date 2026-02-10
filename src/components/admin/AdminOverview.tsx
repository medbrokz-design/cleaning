import { useAdminStore } from '../../store/adminStore';

export function AdminOverview() {
  const { requests, executors, stats } = useAdminStore();

  const recentRequests = requests.slice(0, 5);
  const totalRevenue = requests.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.price_max, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Всего заявок</p>
          <p className="text-2xl font-bold mt-1">{stats.totalRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Новых</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{stats.newRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Оборот</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{totalRevenue.toLocaleString()} ₸</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Исполнителей</p>
          <p className="text-2xl font-bold mt-1">{executors.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Последние заявки</h3>
          <div className="space-y-4">
            {recentRequests.map(req => (
              <div key={req.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-sm">{req.name}</p>
                  <p className="text-xs text-gray-500">{req.cleaning_type} • {req.area} м²</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-emerald-600">{req.price_min} ₸</p>
                  <p className="text-[10px] text-gray-400">{new Date(req.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Топ исполнителей</h3>
          <div className="space-y-4">
            {executors.sort((a, b) => b.rating - a.rating).slice(0, 5).map(ex => (
              <div key={ex.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-sm">{ex.name}</p>
                  <p className="text-xs text-gray-500">{ex.company || 'Частный'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">⭐ {ex.rating}</p>
                  <p className="text-[10px] text-gray-400">{ex.completed_orders} заказов</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}