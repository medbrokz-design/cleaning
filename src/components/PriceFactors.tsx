export function PriceFactors() {
  const factors = [
    {
      icon: '📐',
      title: 'Площадь помещения',
      description: 'Основной фактор. Чем больше квадратных метров, тем выше стоимость. Цена рассчитывается за м².',
      impact: 'high',
      example: '50 м² → от 10 000 ₸'
    },
    {
      icon: '✨',
      title: 'Тип уборки',
      description: 'Генеральная стоит в 2-3 раза дороже поддерживающей. Уборка после ремонта — самая дорогая.',
      impact: 'high',
      example: 'Генеральная ×2-3'
    },
    {
      icon: '🚿',
      title: 'Количество санузлов',
      description: 'Каждый санузел добавляет к стоимости 2 000 — 4 000 ₸. Это трудоёмкий участок уборки.',
      impact: 'medium',
      example: '+2-4 тыс. ₸ / санузел'
    },
    {
      icon: '🧹',
      title: 'Степень загрязнения',
      description: 'Сильное загрязнение требует больше времени и средств. Наценка может составить 30-50%.',
      impact: 'medium',
      example: 'Сильная +30-50%'
    },
    {
      icon: '🪟',
      title: 'Дополнительные услуги',
      description: 'Мытьё окон, химчистка мебели, глажка белья — всё это оплачивается отдельно от основной уборки.',
      impact: 'variable',
      example: 'Окна от 1 500 ₸'
    },
    {
      icon: '🚀',
      title: 'Срочность заказа',
      description: 'Срочный выезд в день обращения может стоить дороже на 20-30% от стандартной цены.',
      impact: 'low',
      example: 'Срочно +20-30%'
    }
  ];

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return { label: 'Высокое влияние', class: 'bg-red-100 text-red-700' };
      case 'medium':
        return { label: 'Среднее влияние', class: 'bg-amber-100 text-amber-700' };
      case 'low':
        return { label: 'Низкое влияние', class: 'bg-gray-100 text-gray-600' };
      default:
        return { label: 'Переменное', class: 'bg-blue-100 text-blue-700' };
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Прозрачное ценообразование
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            От чего зависит цена уборки
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Понимание факторов поможет оценить справедливость предложения исполнителя
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factors.map((factor, index) => {
            const badge = getImpactBadge(factor.impact);
            return (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {factor.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{factor.title}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{factor.description}</p>
                <div className="bg-gray-100 rounded-xl px-4 py-2 text-sm font-medium text-gray-700">
                  📊 {factor.example}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary box */}
        <div className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 lg:p-8 border border-emerald-100">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                💡 Как получить честную цену?
              </h3>
              <p className="text-gray-600">
                Используйте наш калькулятор для предварительного расчёта. Сравните предложения от 2-3 исполнителей. 
                Уточните все детали до начала работы, чтобы избежать неожиданных доплат.
              </p>
            </div>
            <a 
              href="#calculator"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-200"
            >
              Рассчитать
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
