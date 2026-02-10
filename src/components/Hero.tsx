import { QuickOrder } from './QuickOrder';
import { TopExecutors } from './TopExecutors'; // NEW
import { useLangStore } from '../store/langStore'; // NEW

interface HeroProps {
  onCTAClick: () => void;
}

export function Hero({ onCTAClick }: HeroProps) {
  const { t, lang, setLang } = useLangStore();

  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900 text-white">
      {/* Language Switcher */}
      <div className="absolute top-24 right-4 z-20 flex gap-2">
        {['ru', 'kk'].map(l => (
          <button 
            key={l} 
            onClick={() => setLang(l as any)}
            className={`w-10 h-10 rounded-full text-xs font-black uppercase transition-all border ${lang === l ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
          >
            {l}
          </button>
        ))}
      </div>

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
          124 клинера онлайн в Алматы
        </div>

        <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
          {t('hero_title').split(' ')[0]} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            {t('hero_title').split(' ').slice(1).join(' ')}
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          {t('hero_subtitle')}
        </p>

        <QuickOrder />

        <div className="mt-12 flex flex-col items-center gap-4">
          <button 
            onClick={onCTAClick}
            className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-2"
          >
            {t('calc_link')} 
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <TopExecutors />

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