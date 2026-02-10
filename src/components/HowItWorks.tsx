import { useScrollReveal } from '../hooks/useScrollReveal';

export function HowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  const steps = [
    {
      num: '01',
      title: 'Расчет',
      desc: 'За 1 минуту рассчитайте цену в калькуляторе или оставьте номер телефона.',
      icon: '🧮'
    },
    {
      num: '02',
      title: 'Подбор',
      desc: 'Мы передаем заявку 2-3 лучшим клинерам в вашем районе.',
      icon: '👥'
    },
    {
      num: '03',
      title: 'Уборка',
      desc: 'Исполнитель приезжает в назначенное время со своим инвентарем.',
      icon: '🧹'
    },
    {
      num: '04',
      title: 'Оплата',
      desc: 'Вы принимаете работу и оплачиваете её через Kaspi QR напрямую клинеру.',
      icon: '✅'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-900 text-white overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">4 шага к чистоте</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Простой и прозрачный процесс заказа клининга в Алматы.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                {/* Number Background */}
                <div className="absolute -top-10 -left-4 text-9xl font-black text-white/[0.03] pointer-events-none group-hover:text-emerald-500/[0.05] transition-colors duration-500">
                  {step.num}
                </div>
                
                <div className="relative p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-500 h-full">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
                </div>

                {/* Connector Arrow (Desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 translate-y-[-50%] z-10 opacity-20">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}