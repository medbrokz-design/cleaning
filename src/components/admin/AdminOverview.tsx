import { useAdminStore } from '../../store/adminStore';

export function AdminOverview() {
  const { requests, executors, stats } = useAdminStore();

  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalRevenue = completedRequests.reduce((sum, r) => sum + r.priceMax, 0);
  const avgCheck = completedRequests.length > 0 ? Math.round(totalRevenue / completedRequests.length) : 0;

  // Last 7 days
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

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topExecutors = [...executors]
    .filter(e => e.isActive)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-500';
      case 'sent': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-400';
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Всего заявок</p>
              <p className="text-3xl font-bold">{stats.totalRequests.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-100">
            <span className="bg-white/20 px-2 py-0.5 rounded-full">
              +{stats.newRequests} новых
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Выполнено</p>
              <p className="text-3xl font-bold">{stats.completedRequests.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-100">
            Конверсия: {requests.length > 0 ? Math.round(completedRequests.length / requests.length * 100) : 0}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm">Доход</p>
              <p className="text-3xl font-bold">{(totalRevenue / 1000).toFixed(0)}K &#8376;</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-violet-100">
            Средний чек: {avgCheck.toLocaleString()} &#8376;
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Рейтинг</p>
              <p className="text-3xl font-bold">{stats.avgRating}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-amber-100">
            {stats.activeExecutors} активных исполнителей
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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

      {/* Two Columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Новые заявки</h3>
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
              {stats.newRequests} ожидают
            </span>
          </div>
          <div className="space-y-3">
            {recentRequests.map(request => (
              <div key={request.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(request.status)}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{request.name}</p>
                  <p className="text-sm text-gray-500">{getCleaningLabel(request.cleaningType)} &middot; {request.area} m&sup2;</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-gray-900">{request.priceMin.toLocaleString()} &#8376;</p>
                  <p className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            ))}
            {recentRequests.length === 0 && (
              <p className="text-center text-gray-400 py-4">Нет заявок</p>
            )}
          </div>
        </div>

        {/* Top Executors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Топ исполнителей</h3>
            <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
              {executors.filter(e => e.isActive).length} активных
            </span>
          </div>
          <div className="space-y-3">
            {topExecutors.map((executor, index) => (
              <div key={executor.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                  index === 0 ? 'bg-amber-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-amber-700' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{executor.name}</p>
                  <p className="text-sm text-gray-500">{executor.company || 'Частный клинер'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-amber-500">&#9733; {executor.rating}</p>
                  <p className="text-xs text-gray-500">{executor.completedOrders} заказов</p>
                </div>
              </div>
            ))}
            {topExecutors.length === 0 && (
              <p className="text-center text-gray-400 py-4">Нет активных исполнителей</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
