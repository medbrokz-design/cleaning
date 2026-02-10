import { useScrollReveal } from '../hooks/useScrollReveal';

export function TrustSection() {
  const { ref, isVisible } = useScrollReveal();

  const safetyPoints = [
    {
      title: 'Личная проверка',
      desc: 'Каждый клинер проходит собеседование и проверку службы безопасности.',
      icon: '🆔'
    },
    {
      title: 'Обучение',
      desc: 'Тестируем знание типов поверхностей и химии перед первым заказом.',
      icon: '🎓'
    },
    {
      title: 'Страховка',
      desc: 'Несем материальную ответственность за ваше имущество во время уборки.',
      icon: '🛡️'
    },
    {
      title: 'Контроль качества',
      desc: 'Система рейтингов: клинеры с оценкой ниже 4.7 отключаются от сервиса.',
      icon: '⭐'
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Безопасность — наш приоритет</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Мы понимаем, как важно доверять тем, кто убирает ваш дом. Поэтому мы создали строгую систему отбора.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyPoints.map((point, i) => (
              <div 
                key={i} 
                className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{point.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{point.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
