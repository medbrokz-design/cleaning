import { useState } from 'react';

export function ServiceInfo() {
  const [activeTab, setActiveTab] = useState('regular');

  const tabs = [
    { id: 'regular', label: 'Поддерживающая', icon: '✨', color: 'emerald' },
    { id: 'deep', label: 'Генеральная', icon: '🧹', color: 'blue' },
    { id: 'postRenovation', label: 'После ремонта', icon: '🔨', color: 'orange' }
  ];

  const includedServices: Record<string, { items: string[]; notIncluded: string[] }> = {
    regular: {
      items: [
        'Влажная уборка полов во всех комнатах',
        'Протирка пыли с открытых поверхностей',
        'Уборка санузлов (унитаз, раковина, ванна)',
        'Мытьё зеркал и стеклянных поверхностей',
        'Вынос мусора',
        'Протирка бытовой техники снаружи',
        'Застилание кроватей',
        'Мытьё раковины на кухне'
      ],
      notIncluded: [
        'Мытьё окон',
        'Уборка внутри шкафов',
        'Химчистка мебели',
        'Глажка белья'
      ]
    },
    deep: {
      items: [
        'Всё из поддерживающей уборки',
        'Мытьё люстр и светильников',
        'Уборка внутри шкафов и полок',
        'Мытьё плинтусов и дверей',
        'Чистка кухонной вытяжки',
        'Мытьё выключателей и розеток',
        'Глубокая чистка санузлов',
        'Мытьё батарей отопления',
        'Удаление пятен со стен',
        'Чистка межплиточных швов'
      ],
      notIncluded: [
        'Мытьё окон (можно добавить)',
        'Химчистка мягкой мебели',
        'Стирка штор'
      ]
    },
    postRenovation: {
      items: [
        'Удаление строительной пыли',
        'Мытьё окон и оконных рам',
        'Очистка стен от следов шпаклёвки',
        'Удаление защитной плёнки',
        'Мытьё всех поверхностей от пыли',
        'Чистка вентиляционных решёток',
        'Мытьё батарей',
        'Сбор и вынос строительного мусора',
        'Мытьё дверей и дверных коробок',
        'Удаление следов краски и клея'
      ],
      notIncluded: [
        'Вывоз крупного строительного мусора',
        'Химчистка мебели'
      ]
    }
  };

  const additionalServices = [
    { name: 'Мытьё окон', price: 'от 1 500 ₸', icon: '🪟', desc: 'за окно' },
    { name: 'Химчистка дивана', price: 'от 8 000 ₸', icon: '🛋️', desc: '2-местный' },
    { name: 'Химчистка ковра', price: 'от 500 ₸', icon: '🧶', desc: 'за м²' },
    { name: 'Глажка белья', price: 'от 2 000 ₸', icon: '👕', desc: 'корзина' },
    { name: 'Уборка балкона', price: 'от 3 000 ₸', icon: '🌿', desc: 'стандарт' },
    { name: 'Холодильник внутри', price: 'от 2 500 ₸', icon: '❄️', desc: 'с разморозкой' }
  ];

  const currentService = includedServices[activeTab];
  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Подробности услуг
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Что входит в разные типы уборки
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Понимание объёма работ поможет выбрать подходящий тип и обсудить детали с исполнителем
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                  : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Included */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Входит в стоимость</h3>
                <p className="text-sm text-gray-500">{currentTab?.label} уборка</p>
              </div>
            </div>
            <ul className="space-y-3">
              {currentService.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Not Included */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Не входит</h3>
                <p className="text-sm text-gray-500">Можно добавить за доплату</p>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {currentService.notIncluded.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>💡 Совет:</strong> Уточните у исполнителя возможность добавления дополнительных услуг и их стоимость до начала работы.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            Дополнительные услуги
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalServices.map((service, index) => (
              <div 
                key={index} 
                className="group flex items-center gap-4 p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-colors cursor-default"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{service.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{service.name}</div>
                  <div className="text-xs text-gray-500">{service.desc}</div>
                </div>
                <div className="text-sm font-semibold text-emerald-600 whitespace-nowrap">{service.price}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            * Цены ориентировочные и могут отличаться у разных исполнителей
          </p>
        </div>
      </div>
    </section>
  );
}
