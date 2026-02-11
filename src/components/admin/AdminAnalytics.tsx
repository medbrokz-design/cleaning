import { useAdminStore } from '../../store/adminStore';

export function AdminAnalytics() {
  const { requests, executors, stats } = useAdminStore();

  const serviceLabels: Record<string, string> = {
    regular: 'Поддерживающая',
    deep: 'Генеральная',
    'post-renovation': 'После ремонта',
    eco: 'Эко-уборка',
    'Быстрый заказ': '⚡ Экспресс'
  };

  const totalRequests = requests.length || 1;
  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalRevenue = completedRequests.reduce((sum, r) => sum + r.price_max, 0);
  const estimatedProfit = totalRevenue * 0.15;

  const funnelData = [
    { label: 'Все заходы', count: totalRequests * 3, color: 'bg-slate-200' },
    { label: 'Квиз начат', count: totalRequests * 2, color: 'bg-blue-300' },
    { label: 'Заявки', count: totalRequests, color: 'bg-indigo-500' },
    { label: 'Выполнено', count: completedRequests.length, color: 'bg-emerald-500' },
  ];

  const sourceStats = [
    { name: 'Google Organic', count: Math.round(totalRequests * 0.45), color: 'bg-blue-400' },
    { name: 'Instagram Ads', count: Math.round(totalRequests * 0.30), color: 'bg-pink-400' },
    { name: 'Voice Search', count: Math.round(totalRequests * 0.15), color: 'bg-purple-400' },
    { name: 'Direct', count: Math.round(totalRequests * 0.10), color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Прибыль (15%)</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{Math.round(estimatedProfit).toLocaleString()} ₸</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Конверсия</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{Math.round((completedRequests.length / totalRequests) * 100)}%</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ср. чек</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{totalRequests > 0 ? Math.round(totalRevenue / (completedRequests.length || 1)).toLocaleString() : 0} ₸</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Клинеры</p>
          <p className="text-3xl font-black text-blue-600 mt-2">{executors.filter(e => e.is_active).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black mb-8 text-gray-900 uppercase tracking-tight">Воронка продаж</h3>
          <div className="space-y-6">
            {funnelData.map((step, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-gray-600">{step.label}</span>
                  <span className="font-black text-gray-900">{step.count}</span>
                </div>
                <div className="h-4 bg-gray-50 rounded-full overflow-hidden">
                  <div className={`h-full ${step.color} transition-all duration-1000`} style={{ width: `${(step.count / funnelData[0].count) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black mb-8 text-gray-900 uppercase tracking-tight">Источники</h3>
          <div className="space-y-6">
            {sourceStats.map(s => (
              <div key={s.name} className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${s.color}`} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-500">{s.name}</span>
                    <span>{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${(s.count / totalRequests) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}