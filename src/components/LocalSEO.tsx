export function LocalSEO() {
  // Updated for 2026 with new districts and prices (+15%)
  const districts = [
    {
      name: 'Бостандыкский район',
      areas: ['Орбита', 'Тастак', 'Аксай', 'Мамыр', 'Коктем', 'Самал-3'],
      landmarks: ['ТРЦ Mega Alma-Ata', 'Алматы Арена', 'КазНУ', 'IT Park'],
      priceRange: '14 000 - 52 000 ₸',
      avgTime: '1.5-5 часов',
      popularity: 98,
      description: 'Самый популярный район 2026. Много новых ЖК и IT-офисов. Высокий спрос на эко-уборку и подписки.'
    },
    {
      name: 'Алмалинский район',
      areas: ['Центр', 'Абая', 'Тимирязева', 'Жангильдина', 'Арбат'],
      landmarks: ['ТРЦ Dostyk Plaza', 'Парк 28 Панфиловцев', 'Зелёный базар', 'KBTU'],
      priceRange: '17 000 - 58 000 ₸',
      avgTime: '2-6 часов',
      popularity: 92,
      description: 'Деловой центр с премиум-ценами. Много офисов и апартаментов. Экспресс-уборка за 30 мин.'
    },
    {
      name: 'Медеуский район',
      areas: ['Самал', 'Достык', 'Каменское плато', 'Баганашыл', 'Коктобе'],
      landmarks: ['Медео', 'Шымбулак', 'Кок-Тобе', 'Esentai Mall'],
      priceRange: '21 000 - 80 000 ₸',
      avgTime: '3-8 часов',
      popularity: 78,
      description: 'Элитный район с большими домами. Премиум-сервис и эко-средства включены в стоимость.'
    },
    {
      name: 'Ауэзовский район',
      areas: ['Микрорайоны 1-12', 'Алмагуль', 'Жулдыз', 'Аксай-4'],
      landmarks: ['ТРЦ ADK', 'Центральный парк', 'Новые ЖК'],
      priceRange: '12 000 - 40 000 ₸',
      avgTime: '1.5-4 часа',
      popularity: 85,
      description: 'Доступные цены, много молодых семей. Популярны подписки на еженедельную уборку.'
    },
    {
      name: 'Турксибский район',
      areas: ['Жетысу', 'Тастак', 'Кулагер', 'Алтын Орда'],
      landmarks: ['Новый вокзал', 'Саяхат', 'ТРЦ Forum'],
      priceRange: '11 500 - 35 000 ₸',
      avgTime: '1.5-4 часа',
      popularity: 68,
      description: 'Активное строительство. Много заказов на уборку после ремонта в новых ЖК.'
    },
    {
      name: 'Жетысуский район',
      areas: ['Айнабулак', 'Жетысу-1', 'Жетысу-2', 'Кольсай'],
      landmarks: ['Ботанический сад', 'Новые школы'],
      priceRange: '11 500 - 37 000 ₸',
      avgTime: '1.5-4 часа',
      popularity: 62,
      description: 'Семейный район. Высокий спрос на гипоаллергенную эко-уборку для семей с детьми.'
    },
    {
      name: 'Наурызбайский район',
      areas: ['Калкаман', 'Карасу', 'Думан', 'Новые ЖК 2025-26'],
      landmarks: ['ТРЦ Март', 'Парк Президента', 'Central Park'],
      priceRange: '14 000 - 46 000 ₸',
      avgTime: '2-5 часов',
      popularity: 72,
      description: 'Активно развивается с 2024. Много новостроек, высокий спрос на уборку после ремонта.'
    },
    {
      name: 'Алатауский район',
      areas: ['Шанырак', 'Рахат', 'Таугуль', 'Новые массивы'],
      landmarks: ['Промзона', 'Новые микрорайоны'],
      priceRange: '11 500 - 40 000 ₸',
      avgTime: '2-5 часов',
      popularity: 52,
      description: 'Растущий район. Возможна доплата за выезд 1500-2000 ₸. Меньше исполнителей.'
    }
  ];

  // Updated prices for 2026 (+15% inflation)
  const cleaningPrices = [
    {
      type: 'Поддерживающая уборка',
      description: 'Регулярная уборка для поддержания чистоты',
      pricePerM2: 'от 230 ₸/м²',
      examples: [
        { area: '40 м²', price: '9 200 - 14 000 ₸' },
        { area: '60 м²', price: '13 800 - 21 000 ₸' },
        { area: '80 м²', price: '18 400 - 28 000 ₸' },
        { area: '100 м²', price: '23 000 - 35 000 ₸' }
      ],
      time: '1.5-4 часа',
      includes: ['Влажная уборка полов', 'Протирка пыли', 'Уборка санузлов', 'Мытьё зеркал', 'Вынос мусора']
    },
    {
      type: 'Генеральная уборка',
      description: 'Глубокая уборка всех поверхностей',
      pricePerM2: 'от 460 ₸/м²',
      examples: [
        { area: '40 м²', price: '18 400 - 29 000 ₸' },
        { area: '60 м²', price: '27 600 - 46 000 ₸' },
        { area: '80 м²', price: '36 800 - 58 000 ₸' },
        { area: '100 м²', price: '46 000 - 75 000 ₸' }
      ],
      time: '3-8 часов',
      includes: ['Всё из поддерживающей', 'Мытьё люстр', 'Уборка внутри шкафов', 'Чистка вытяжки', 'Мытьё батарей']
    },
    {
      type: 'Уборка после ремонта',
      description: 'Удаление строительной пыли и загрязнений',
      pricePerM2: 'от 690 ₸/м²',
      examples: [
        { area: '40 м²', price: '27 600 - 46 000 ₸' },
        { area: '60 м²', price: '41 400 - 69 000 ₸' },
        { area: '80 м²', price: '55 200 - 92 000 ₸' },
        { area: '100 м²', price: '69 000 - 115 000 ₸' }
      ],
      time: '5-12 часов',
      includes: ['Удаление стройпыли', 'Мытьё окон', 'Очистка стен', 'Удаление плёнки', 'Вывоз мусора']
    },
    {
      type: 'Эко-уборка 🌿',
      description: 'Био-средства, безопасно для детей и аллергиков',
      pricePerM2: 'от 300 ₸/м²',
      examples: [
        { area: '40 м²', price: '12 000 - 18 000 ₸' },
        { area: '60 м²', price: '18 000 - 27 000 ₸' },
        { area: '80 м²', price: '24 000 - 36 000 ₸' },
        { area: '100 м²', price: '30 000 - 45 000 ₸' }
      ],
      time: '2-5 часов',
      includes: ['Био-средства', 'Гипоаллергенно', 'Без хлора', 'Сертификаты', 'Для семей с детьми'],
      isNew: true
    }
  ];

  return (
    <section id="local-seo" className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Цены по районам 2026
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Клининг во всех районах Алматы
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Актуальные цены 2026 года. Подберём исполнителей рядом с вами — приезд за 1-2 часа
          </p>
        </div>

        {/* Price Table */}
        <div className="mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            📊 Актуальные цены на уборку в Алматы (2026)
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {cleaningPrices.map((price, index) => (
              <article 
                key={index}
                className={`bg-white rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-shadow relative ${
                  price.isNew ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-100'
                }`}
                itemScope
                itemType="https://schema.org/Offer"
              >
                {price.isNew && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      NEW 2026
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    index === 0 ? 'bg-emerald-100' : 
                    index === 1 ? 'bg-blue-100' : 
                    index === 2 ? 'bg-orange-100' : 
                    'bg-green-100'
                  }`}>
                    {index === 0 ? '✨' : index === 1 ? '🧹' : index === 2 ? '🔨' : '🌿'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900" itemProp="name">{price.type}</h4>
                    <p className="text-sm text-emerald-600 font-medium">{price.pricePerM2}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4" itemProp="description">{price.description}</p>
                
                {/* Price examples */}
                <div className="space-y-2 mb-4">
                  {price.examples.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{ex.area}</span>
                      <span className="font-medium text-gray-900" itemProp="price">{ex.price}</span>
                    </div>
                  ))}
                </div>
                
                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Время: {price.time}
                </div>
                
                {/* Includes */}
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    <span>Что входит</span>
                    <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {price.includes.map((item, i) => (
                      <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              </article>
            ))}
          </div>
          
          {/* Subscription banner */}
          <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="text-4xl">🔄</div>
              <div>
                <h4 className="text-xl font-bold mb-1">Подписка на уборку — скидка до 20%</h4>
                <p className="text-purple-100">Еженедельная уборка по фиксированной цене. Один клинер, автооплата, бесплатная отмена.</p>
              </div>
              <a 
                href="#calculator"
                className="flex-shrink-0 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
              >
                Рассчитать →
              </a>
            </div>
          </div>
        </div>

        {/* Districts Grid */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            📍 Районы обслуживания — 2026
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {districts.map((district, index) => (
              <article 
                key={index}
                className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all cursor-default"
                itemScope
                itemType="https://schema.org/Service"
              >
                <meta itemProp="serviceType" content="Cleaning Service" />
                <div itemProp="areaServed" itemScope itemType="https://schema.org/AdministrativeArea">
                  <meta itemProp="name" content={district.name} />
                </div>
                
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm" itemProp="name">
                    {district.name}
                  </h4>
                  {/* Popularity indicator */}
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                        style={{ width: `${district.popularity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Areas */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {district.areas.slice(0, 3).map((area, i) => (
                    <span 
                      key={i}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {area}
                    </span>
                  ))}
                  {district.areas.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{district.areas.length - 3}
                    </span>
                  )}
                </div>
                
                {/* Price range */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Цены:</span>
                  <span className="font-medium text-emerald-600" itemProp="offers" itemScope itemType="https://schema.org/AggregateOffer">
                    <meta itemProp="priceCurrency" content="KZT" />
                    <meta itemProp="lowPrice" content={district.priceRange.split(' - ')[0].replace(/\D/g, '')} />
                    <meta itemProp="highPrice" content={district.priceRange.split(' - ')[1].replace(/\D/g, '')} />
                    {district.priceRange}
                  </span>
                </div>
                
                {/* Expanded info on hover */}
                <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-gray-500 leading-relaxed" itemProp="description">
                    {district.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* SEO Text Block - Updated for 2026 */}
        <div className="mt-16 bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Клининговые услуги в Алматы 2026 — тренды и цены
          </h3>
          <div className="prose prose-sm prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Рынок клининга в Алматы 2026</strong> продолжает активно развиваться. Средние цены выросли на 15% по сравнению с 2024 годом из-за инфляции и повышения качества сервиса. 
              Поддерживающая уборка теперь стоит от 230 тенге за м², генеральная — от 460 тенге за м². 
              Популярность набирает эко-уборка с био-средствами (от 300 тенге за м²) — особенно среди семей с детьми и аллергиков.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Новинки 2026:</strong> подписка на регулярную уборку со скидкой до 20%, экспресс-приезд за 30 минут в центральных районах, 
              ИИ-подбор исполнителей по рейтингу и отзывам, онлайн-отслеживание уборки, фото-отчёты до/после. 
              Большинство исполнителей принимают Kaspi QR — оплата только после приёмки работы.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Самые популярные районы:</strong> Бостандыкский (98% спроса), Алмалинский (92%), Ауэзовский (85%). 
              Среднее время прибытия клинера — 1-2 часа. В Наурызбайском и Алатауском районах возможна доплата за выезд 1500-2000 тенге.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a 
            href="#calculator"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-200/50 hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Рассчитать стоимость для вашего района
          </a>
        </div>
      </div>
    </section>
  );
}
