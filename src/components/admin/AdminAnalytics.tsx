import { useAdminStore } from '../../store/adminStore';

export function AdminAnalytics() {
  const { requests, executors } = useAdminStore();

  const totalRequests = requests.length || 1;
  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalRevenue = completedRequests.reduce((sum, r) => sum + r.price_max, 0);
  const estimatedProfit = totalRevenue * 0.15;

  // 1. GEO Performance (Ranking districts by revenue)
  const districtRevenue = requests.reduce((acc, r) => {
    if (r.status === 'completed') {
      acc[r.district] = (acc[r.district] || 0) + r.price_max;
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedDistricts = Object.entries(districtRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // 2. Time Trends (Last 14 days)
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const trendData = last14Days.map(date => ({
    date: date.split('-').slice(1).join('.'),
    count: requests.filter(r => r.created_at.startsWith(date)).length
  }));

  const maxTrend = Math.max(...trendData.map(d => d.count), 1);

  // 3. Operational KPIs
  const avgResponseTime = '32 мин'; // Mock - в будущем вычислять разницу timestamps
  const retentionRate = '18%'; // Процент повторных заказов

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Layer: Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-4xl">💰</div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Чистая прибыль</p>
          <p className="text-4xl font-black">{Math.round(estimatedProfit).toLocaleString()} ₸</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500/60">
            <span>↑ 12% к прошлому месяцу</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Конверсия</p>
          <p className="text-4xl font-black text-slate-900">{Math.round((completedRequests.length / totalRequests) * 100)}%</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Цель: 25%</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Ср. чек</p>
          <p className="text-4xl font-black text-slate-900">{completedRequests.length > 0 ? Math.round(totalRevenue / completedRequests.length).toLocaleString() : 0} ₸</p>
          <p className="mt-4 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Высокий</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Отклик</p>
          <p className="text-4xl font-black text-slate-900">{avgResponseTime}</p>
          <p className="mt-4 text-[10px] font-bold text-blue-500 uppercase tracking-widest">Безупречно</p>
        </div>
      </div>

      {/* Middle Layer: Trends & GEO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Тренд заказов</h3>
            <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">Последние 14 дней</span>
          </div>
          <div className="flex items-end justify-between h-48 gap-2">
            {trendData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-slate-100 rounded-t-xl group-hover:bg-emerald-500 transition-all duration-500 relative"
                  style={{ height: `${(d.count / maxTrend) * 100}%`, minHeight: '4px' }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </div>
                </div>
                <span className="text-[8px] font-bold text-slate-300 mt-3 rotate-45">{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* District Leaderboard */}
        <div className="bg-slate-900 p-10 rounded-[48px] text-white">
          <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Топ районов (₸)</h3>
          <div className="space-y-6">
            {sortedDistricts.length > 0 ? sortedDistricts.map(([name, rev], i) => (
              <div key={name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-black text-xs text-emerald-400 border border-white/10">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{name}</p>
                  <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${(rev / (sortedDistricts[0][1] || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-black">{(rev / 1000).toFixed(0)}K</p>
              </div>
            )) : <p className="text-slate-500 text-sm">Нет завершенных заказов</p>}
          </div>
          <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Retention Rate</p>
            <p className="text-2xl font-black text-emerald-400">{retentionRate}</p>
          </div>
        </div>
      </div>

      {/* Bottom Layer: Service Popularity */}
      <div className="bg-white p-10 rounded-[48px] border border-slate-100">
        <h3 className="text-xl font-black mb-8 text-slate-900 uppercase tracking-tighter">Эффективность услуг</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Поддерживающая', color: 'bg-emerald-500', type: 'regular' },
            { label: 'Генеральная', color: 'bg-blue-500', type: 'deep' },
            { label: 'После ремонта', color: 'bg-orange-500', type: 'post-renovation' },
            { label: 'Эко-уборка', color: 'bg-teal-500', type: 'eco' },
          ].map(s => {
            const count = requests.filter(r => r.cleaning_type === s.label || r.cleaning_type === s.type).length;
            const percentage = Math.round((count / totalRequests) * 100);
            return (
              <div key={s.label} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span className="text-xs font-black text-slate-400">{percentage}%</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{s.label}</p>
                <p className="text-2xl font-black mt-1">{count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
