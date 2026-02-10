export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Рассчитайте стоимость',
      description: 'Укажите тип помещения, площадь, вид уборки в калькуляторе. Получите примерную цену и рекомендации за 1 минуту.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-emerald-400 to-emerald-600',
      tip: '⏱️ 1 минута'
    },
    {
      number: '02',
      title: 'Оставьте заявку',
      description: 'Заполните короткую форму с контактами. Мы передадим вашу заявку 2-3 подходящим исполнителям в вашем районе.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      color: 'from-blue-400 to-blue-600',
      tip: '📝 2 минуты'
    },
    {
      number: '03',
      title: 'Получите предложения',
      description: 'В течение 2-3 часов с вами свяжутся исполнители, уточнят детали и предложат точную стоимость и время.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'from-purple-400 to-purple-600',
      tip: '📱 2-3 часа'
    },
    {
      number: '04',
      title: 'Выберите лучшего',
      description: 'Сравните предложения по цене, срокам, отзывам. Договоритесь напрямую с исполнителем и оплатите ему.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-teal-400 to-teal-600',
      tip: '✅ Ваш выбор'
    }
  ];

  const benefits = [
    { icon: '🆓', text: 'Бесплатно для вас' },
    { icon: '⚡', text: 'Быстрый ответ' },
    { icon: '🔒', text: 'Безопасно' },
    { icon: '🤝', text: 'Без обязательств' }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Простой процесс
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Как работает сервис
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            4 простых шага от расчёта до чистоты в вашем доме
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <div className="max-w-4xl mx-auto h-full bg-gradient-to-r from-emerald-200 via-blue-200 via-purple-200 to-teal-200 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Mobile/Tablet connector */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-gray-200 to-transparent"></div>
                )}
                
                <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  
                  {/* Number */}
                  <span className="absolute top-4 right-4 text-4xl font-bold text-gray-100 group-hover:text-emerald-100 transition-colors">
                    {step.number}
                  </span>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                  
                  {/* Tip badge */}
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    {step.tip}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits bar */}
        <div className="mt-16 bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <span className="text-2xl">{benefit.icon}</span>
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Весь процесс от заявки до чистоты занимает 1 день. Выбор всегда за вами.
          </p>
          <a 
            href="#calculator"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-xl shadow-emerald-200/50 hover:shadow-2xl hover:-translate-y-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Начать расчёт
          </a>
        </div>
      </div>
    </section>
  );
}
