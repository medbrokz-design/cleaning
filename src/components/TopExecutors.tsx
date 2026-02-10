import { useLangStore } from '../store/langStore';

export function TopExecutors() {
  const { t } = useLangStore();
  
  const topList = [
    { name: 'Айгерим', rating: 4.9, orders: 156, img: '👩‍💼' },
    { name: 'Марат', rating: 4.8, orders: 234, img: '👨‍💼' },
    { name: 'Динара', rating: 5.0, orders: 89, img: '👩‍⚕️' },
  ];

  return (
    <div className="mt-12 animate-fade-in">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t('top_executors')}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {topList.map(ex => (
          <div key={ex.name} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm">
            <span className="text-xl">{ex.img}</span>
            <div className="text-left">
              <p className="text-xs font-bold text-white">{ex.name}</p>
              <p className="text-[10px] text-emerald-400">⭐ {ex.rating} • {ex.orders} заказов</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
