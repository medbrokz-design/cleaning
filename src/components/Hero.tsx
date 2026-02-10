import { QuickOrder } from './QuickOrder'; // NEW

interface HeroProps {
  onCTAClick: () => void;
}

export function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900 text-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-fade-in backdrop-blur-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          124 клинера сейчас онлайн в Алматы
        </div>

        <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
          Чистота <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            без усилий
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          Профессиональный клининг в Алматы. Просто введите номер, и мы подберем лучшего исполнителя за 5 минут.
        </p>

        {/* Форма быстрого заказа */}
        <QuickOrder />

        <div className="mt-12 flex flex-col items-center gap-4">
          <button 
            onClick={onCTAClick}
            className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-2"
          >
            Или рассчитать точную стоимость в калькуляторе 
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-8 lg:gap-16 opacity-30">
          {['Kaspi Pay', 'Эко-средства', 'Гарантия 24ч', 'PRO-оборудование'].map((item) => (
            <div key={item} className="flex items-center gap-2 font-bold text-white text-sm uppercase tracking-widest">
              <span className="text-emerald-500">✓</span> {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}