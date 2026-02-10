import { useAdminStore } from '../../store/adminStore';

export function AdminAnalytics() {
  const { requests, executors, stats } = useAdminStore();

  // Service distribution
  const serviceLabels: Record<string, string> = {
    regular: 'Поддерживающая',
    deep: 'Генеральная',
    'post-renovation': 'После ремонта',
    eco: 'Эко-уборка'
  };

  const serviceColors: Record<string, string> = {
    regular: 'bg-emerald-500',
    deep: 'bg-blue-500',
    'post-renovation': 'bg-orange-500',
    eco: 'bg-green-500'
  };

  const serviceStats = requests.reduce((acc, r) => {
    acc[r.cleaningType] = (acc[r.cleaningType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const districtStats = requests.reduce((acc, r) => {
    acc[r.district] = (acc[r.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRequests = requests.length || 1;

  // Completed revenue
  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalRevenue = completedRequests.reduce((sum, r) => sum + r.priceMax, 0);
  const avgCheck = completedRequests.length > 0 ? Math.round(totalRevenue / completedRequests.length) : 0;

  // Conversion funnel
  const funnelData = [
    { label: 'Все заявки', count: requests.length, color: 'bg-blue-500' },
    { label: 'Отправлены', count: requests.filter(r => r.status !== 'new').length, color: 'bg-indigo-500' },
    { label: 'Подтверждены', count: requests.filter(r => ['confirmed', 'completed'].includes(r.status)).length, color: 'bg-violet-500' },
    { label: 'Выполнены', count: completedRequests.length, color: 'bg-emerald-500' },
  ];

  const maxFunnel = funnelData[0].count || 1;

  // Chart: last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      label: date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' }),
      dateStr: date.toDateString(),
    };
  });

  const requestsByDay = last7Days.map(d =>
    requests.filter(r => new Date(r.createdAt).toDateString() === d.dateStr).length
  );
  const maxDaily = Math.max(...requestsByDay, 1);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Всего заявок</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRequests.toLocaleString()}</p>
          <p className="text-sm text-emerald-600 mt-1">+{stats.newRequests} новых</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Выполнено</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedRequests.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1">
            Конверсия: {requests.length > 0 ? Math.round(completedRequests.length / requests.length * 100) : 0}%
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Доход</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-400 mt-1">Средний чек: {avgCheck.toLocaleString()} &#8376;</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Средний рейтинг</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">
            <span className="text-amber-400">&#9733;</span> {stats.avgRating}
          </p>
          <p className="text-sm text-gray-400 mt-1">{stats.activeExecutors} активных</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-6">Заявки за неделю</h3>
        <div className="flex items-end justify-between h-40 gap-2">
          {requestsByDay.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1 font-medium">{count}</span>
              <div
                className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500"
                style={{
                  height: `${(count / maxDaily) * 120}px`,
                  minHeight: count > 0 ? '20px' : '4px'
                }}
              />
              <span className="text-xs text-gray-500 mt-2">{last7Days[i].label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Воронка конверсии</h3>
          <div className="space-y-4">
            {funnelData.map((step, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{step.label}</span>
                  <span className="font-medium text-gray-900">
                    {step.count}
                    {i > 0 && (
                      <span className="text-gray-400 ml-1">
                        ({Math.round(step.count / maxFunnel * 100)}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${step.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(step.count / maxFunnel) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">По типу услуги</h3>
          <div className="space-y-4">
            {Object.entries(serviceStats).map(([service, count]) => (
              <div key={service}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{serviceLabels[service] || service}</span>
                  <span className="font-medium text-gray-900">
                    {count} ({Math.round(count / totalRequests * 100)}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${serviceColors[service] || 'bg-gray-400'} rounded-full transition-all duration-500`}
                    style={{ width: `${(count / totalRequests) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(serviceStats).length === 0 && (
              <p className="text-gray-400 text-center py-4">Нет данных</p>
            )}
          </div>
        </div>

        {/* Districts Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">По районам</h3>
          <div className="space-y-4">
            {Object.entries(districtStats)
              .sort(([, a], [, b]) => b - a)
              .map(([district, count]) => (
                <div key={district}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{district}</span>
                    <span className="font-medium text-gray-900">{count} заявок</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(count / totalRequests) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            {Object.keys(districtStats).length === 0 && (
              <p className="text-gray-400 text-center py-4">Нет данных</p>
            )}
          </div>
        </div>

        {/* Executor Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Исполнители</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Всего</span>
              <span className="font-bold text-gray-900">{executors.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-gray-600">Активных</span>
              <span className="font-bold text-green-700">{executors.filter(e => e.isActive).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <span className="text-gray-600">Верифицированных</span>
              <span className="font-bold text-blue-700">{executors.filter(e => e.isVerified).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
              <span className="text-gray-600">Эко-уборка</span>
              <span className="font-bold text-emerald-700">{executors.filter(e => e.hasEcoCleanig).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <span className="text-gray-600">Средний рейтинг</span>
              <span className="font-bold text-amber-600">
                {executors.length > 0
                  ? (executors.reduce((s, e) => s + e.rating, 0) / executors.length).toFixed(1)
                  : 0
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
