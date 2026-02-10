interface HeroProps {
  onCTAClick: () => void;
}

export function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-fade-in">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          124 клинера сейчас онлайн в Алматы
        </div>

        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight mb-6 leading-[1.1]">
          Идеальная чистота <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            в один клик
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Бесплатный сервис подбора проверенных клинеров. Рассчитайте стоимость за 1 минуту и получите предложения с гарантией лучшей цены.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onCTAClick}
            className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-95"
          >
            Рассчитать стоимость
          </button>
          <a 
            href="#local-seo"
            className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 hover:border-emerald-200 rounded-2xl font-bold text-lg transition-all"
          >
            Цены по районам
          </a>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 lg:gap-16 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          {['Kaspi Pay', 'Эко-средства', 'Гарантия 24ч', 'PRO-оборудование'].map((item) => (
            <div key={item} className="flex items-center gap-2 font-bold text-gray-900">
              <span className="text-emerald-600">✓</span> {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}