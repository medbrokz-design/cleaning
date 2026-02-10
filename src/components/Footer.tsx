export function Footer() {
  // Updated prices for 2026 (+15%)
  const services = [
    { name: 'Поддерживающая уборка', href: '#calculator', price: 'от 230 ₸/м²' },
    { name: 'Генеральная уборка', href: '#calculator', price: 'от 460 ₸/м²' },
    { name: 'Уборка после ремонта', href: '#calculator', price: 'от 690 ₸/м²' },
    { name: 'Эко-уборка 🌿', href: '#calculator', price: 'от 300 ₸/м²' },
    { name: 'Мытьё окон', href: '#calculator', price: 'от 2 000 ₸' },
    { name: 'Химчистка мебели', href: '#calculator', price: 'от 10 000 ₸' },
    { name: 'Уборка офисов', href: '#calculator', price: 'от 180 ₸/м²' },
    { name: 'Подписка на уборку', href: '#calculator', price: 'скидка 20%' }
  ];

  const districts = [
    { name: 'Алмалинский район', areas: 'центр, Абая' },
    { name: 'Бостандыкский район', areas: 'Орбита, Аксай' },
    { name: 'Медеуский район', areas: 'Самал, Достык' },
    { name: 'Ауэзовский район', areas: 'микрорайоны' },
    { name: 'Турксибский район', areas: 'Жетысу' },
    { name: 'Наурызбайский район', areas: 'Калкаман, новые ЖК' },
    { name: 'Жетысуский район', areas: 'Айнабулак' },
    { name: 'Алатауский район', areas: 'Шанырак' }
  ];

  const links = [
    { name: 'Калькулятор', href: '#calculator' },
    { name: 'Как работает', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Чек-лист', href: '#checklist' },
    { name: 'Цены 2026', href: '#local-seo' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300" itemScope itemType="https://schema.org/WPFooter">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" onClick={scrollToTop} className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-xl text-white block">CleanAlmaty</span>
                <span className="text-xs text-gray-400">Подбор клининга • 2026</span>
              </div>
            </a>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Бесплатный сервис подбора клининговых услуг в Алматы. 
              ИИ-калькулятор, чек-листы, быстрая передача заявок проверенным исполнителям. Актуальные цены 2026.
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 mb-6" itemScope itemType="https://schema.org/Organization">
              <meta itemProp="name" content="CleanAlmaty" />
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="addressLocality">Алматы</span>, <span itemProp="addressCountry">Казахстан</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@cleaning-almaty.kz" itemProp="email" className="hover:text-emerald-400">
                  info@cleaning-almaty.kz
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <time>Пн-Вс: 8:00 — 22:00</time>
              </div>
            </div>
            
            {/* Social links */}
            <div className="flex gap-3">
              <a 
                href="https://wa.me/77001234567" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/cleanalmaty" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/cleanalmaty" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services - Updated for 2026 */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Услуги клининга 2026
            </h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href={service.href} 
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-emerald-400 transition-colors"></span>
                      {service.name}
                    </span>
                    <span className="text-xs text-gray-500">{service.price}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Districts */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Районы Алматы
            </h4>
            <ul className="space-y-2">
              {districts.map((district, index) => (
                <li key={index} className="text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>{district.name}</span>
                  </span>
                  <span className="text-xs text-gray-500 ml-3">({district.areas})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links & Info */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Навигация
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {links.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  className="text-xs bg-gray-800 hover:bg-emerald-600 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Key stats for SEO - Updated 2026 */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h5 className="text-sm font-medium text-white mb-3">О сервисе 2026</h5>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Бесплатно для клиентов
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  4800+ заявок обработано
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  120+ проверенных исполнителей
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Эко-уборка и подписки
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Kaspi QR оплата
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Text Block - Updated 2026 */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2">
              <span>📋 Клининг в Алматы 2026 — полная информация</span>
              <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-4 prose prose-sm prose-invert max-w-none">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Клининг в Алматы 2026</strong> — динамично развивающийся рынок с оборотом более 5 млрд тенге в год. 
                Средние цены выросли на 15% по сравнению с 2024 годом: поддерживающая уборка от 230 ₸/м², генеральная от 460 ₸/м², после ремонта от 690 ₸/м². 
                Популярность набирает эко-уборка с био-средствами (от 300 ₸/м²) — безопасно для семей с детьми и аллергиков.
              </p>
              <p className="text-xs text-gray-500 leading-relaxed mt-2">
                <strong>Тренды 2026:</strong> подписки на регулярную уборку со скидкой до 20%, экспресс-приезд за 30 минут, 
                ИИ-подбор исполнителей, онлайн-отслеживание уборки, фото-отчёты до/после, оплата Kaspi QR после приёмки.
              </p>
              <p className="text-xs text-gray-500 leading-relaxed mt-2">
                <strong>Все 8 районов Алматы:</strong> Бостандыкский, Алмалинский, Медеуский, Ауэзовский, 
                Турксибский, Жетысуский, Наурызбайский, Алатауский. Среднее время прибытия — 1-2 часа.
              </p>
            </div>
          </details>
        </div>
      </div>

      {/* Legal disclaimer - Updated 2026 */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-300">⚖️ Правовая информация:</strong> Сайт CleanAlmaty.kz является информационным сервисом и агрегатором заявок на клининговые услуги в Алматы. 
              Мы не являемся клининговой компанией и не оказываем услуги уборки напрямую. 
              Услуги оказываются независимыми исполнителями — клининговыми компаниями и частными специалистами. 
              Администрация сайта не несёт ответственности за качество услуг, оказываемых третьими лицами. 
              Все цены актуальны на 2026 год и могут отличаться у разных исполнителей.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2023-{currentYear} CleanAlmaty. Все права защищены.
              <a href="#admin" className="ml-2 text-gray-400 hover:text-emerald-400 transition-colors">
                🔐
              </a>
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
        aria-label="Вернуться наверх"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}
