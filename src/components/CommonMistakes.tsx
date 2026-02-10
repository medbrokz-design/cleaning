import { useState } from 'react';

export function CommonMistakes() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const mistakes = [
    {
      icon: '📝',
      title: 'Не уточняют объём работ',
      description: 'Часто клиенты не обсуждают, что именно входит в уборку.',
      problem: 'Ожидания не совпадают с результатом. Исполнитель делает меньше, чем вы ожидали.',
      solution: 'Попросите список работ в письменном виде до начала уборки. Уточните каждый пункт.',
      color: 'from-red-400 to-rose-500'
    },
    {
      icon: '💰',
      title: 'Выбирают только по цене',
      description: 'Самая низкая цена часто означает экономию на качестве.',
      problem: 'Экономия на средствах, времени или количестве работников. Результат разочаровывает.',
      solution: 'Сравнивайте не только цену, но и отзывы, гарантии, включённые услуги.',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: '🧾',
      title: 'Не оговаривают доплаты',
      description: 'Дополнительные услуги значительно увеличивают счёт.',
      problem: 'В конце уборки счёт оказывается в 1.5-2 раза выше, чем ожидали.',
      solution: 'Уточните полную стоимость со всеми возможными доплатами до начала работы.',
      color: 'from-purple-400 to-violet-500'
    },
    {
      icon: '⏰',
      title: 'Не планируют время',
      description: 'Генеральная уборка может занять весь день.',
      problem: 'Не готовы к тому, что придётся ждать 6-8 часов. Срываются планы.',
      solution: 'Спросите примерное время выполнения и планируйте свой день заранее.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: '🧹',
      title: 'Не проверяют инвентарь',
      description: 'Некоторые клинеры приезжают без своего оборудования.',
      problem: 'Приходится искать свои средства или тратиться на покупку.',
      solution: 'Уточните, привозит ли исполнитель свои средства и какие именно использует.',
      color: 'from-teal-400 to-emerald-500'
    },
    {
      icon: '✅',
      title: 'Не принимают работу',
      description: 'Оплачивают сразу, не проверив качество.',
      problem: 'После ухода исполнителя обнаруживаются недочёты. Сложно предъявить претензии.',
      solution: 'Осмотрите помещение вместе с исполнителем перед оплатой. Проверьте все углы.',
      color: 'from-green-400 to-emerald-500'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Избегайте ошибок
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Частые ошибки клиентов
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Узнайте, чего избегать, чтобы получить качественную уборку и не переплатить
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mistakes.map((mistake, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${mistake.color} p-4 text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{mistake.icon}</span>
                  <h3 className="text-lg font-semibold">{mistake.title}</h3>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-4">{mistake.description}</p>
                
                {/* Problem */}
                <div className="bg-red-50 rounded-xl p-3 mb-3 border border-red-100">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 flex-shrink-0">❌</span>
                    <p className="text-sm text-red-800">{mistake.problem}</p>
                  </div>
                </div>
                
                {/* Solution - Expandable on mobile */}
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full"
                >
                  <div className={`bg-emerald-50 rounded-xl p-3 border border-emerald-100 transition-all ${
                    expandedIndex === index ? '' : 'sm:block'
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 flex-shrink-0">✅</span>
                      <div className="text-left">
                        <span className="text-xs font-medium text-emerald-600 block mb-1">Решение:</span>
                        <p className="text-sm text-emerald-800">{mistake.solution}</p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary card */}
        <div className="mt-12 bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Как избежать всех этих ошибок?
              </h3>
              <p className="text-gray-600">
                Используйте наш чек-лист вопросов перед заказом. Он содержит все важные моменты, которые нужно обсудить с исполнителем до начала работы.
              </p>
            </div>
            <a 
              href="#checklist"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-200 hover:shadow-xl"
            >
              📋 Открыть чек-лист
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
