import { useAdminStore } from '../../store/adminStore';

export function AdminAnalytics() {
  const { requests, executors, stats } = useAdminStore();

  const serviceLabels: Record<string, string> = {
    regular: 'Поддерживающая',
    deep: 'Генеральная',
    'post-renovation': 'После ремонта',
    eco: 'Эко-уборка'
  };

  const serviceStats = requests.reduce((acc, r) => {
    acc[r.cleaning_type] = (acc[r.cleaning_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRequests = requests.length || 1;

  // Completed revenue & Profit
  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalRevenue = completedRequests.reduce((sum, r) => sum + r.price_max, 0);
  const commissionRate = 0.15; // Ваша доля — 15%
  const estimatedProfit = totalRevenue * commissionRate;
  const avgCheck = completedRequests.length > 0 ? Math.round(totalRevenue / completedRequests.length) : 0;

  const funnelData = [
    { label: 'Все заявки', count: requests.length, color: 'bg-blue-500' },
    { label: 'Отправлены', count: requests.filter(r => r.status !== 'new').length, color: 'bg-indigo-500' },
    { label: 'Выполнены', count: completedRequests.length, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Оборотка (Завершено)</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalRevenue.toLocaleString()} ₸</p>
          <p className="text-xs text-gray-400 mt-1">Средний чек: {avgCheck.toLocaleString()} ₸</p>
        </div>
        <div className="bg-emerald-600 rounded-2xl p-6 shadow-lg border border-emerald-500 text-white">
          <p className="text-sm opacity-80">Ваша Прибыль (15%)</p>
          <p className="text-3xl font-black mt-2">{Math.round(estimatedProfit).toLocaleString()} ₸</p>
          <p className="text-xs opacity-70 mt-1">Чистый доход с лидов</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Конверсия</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{Math.round((completedRequests.length / totalRequests) * 100)}%</p>
          <p className="text-xs text-emerald-600 mt-1">из заявки в оплату</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Активные клинеры</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{executors.filter(e => e.is_active).length}</p>
          <p className="text-xs text-gray-400 mt-1">из {executors.length} зарегистрированных</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Воронка продаж</h3>
          <div className="space-y-4">
            {funnelData.map((step, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">{step.label}</span>
                  <span className="font-bold text-gray-900">{step.count}</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${step.color} transition-all duration-1000`} style={{ width: `${(step.count / totalRequests) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Самые прибыльные услуги</h3>
          <div className="space-y-4">
            {Object.entries(serviceStats).map(([service, count]) => (
              <div key={service} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">{serviceLabels[service] || service}</div>
                  <div className="h-2 bg-gray-100 rounded-full mt-1">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(count / totalRequests) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-400">{Math.round((count / totalRequests) * 100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
