import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      { name: 'Генеральная уборка', href: '/posle-remonta' },
      { name: 'Эко-уборка 🌿', href: '/eco-cleaning' },
      { name: 'Уборка офисов', href: '/' },
      { name: 'Химчистка мебели', href: '/' },
    ],
    districts: [
      { name: 'Бостандыкский', href: '/bostandykskiy' },
      { name: 'Медеуский', href: '/medeuskiy' },
      { name: 'Алмалинский', href: '/almalinskiy' },
      { name: 'Ауэзовский', href: '/auezovskiy' },
    ]
  };

  return (
    <footer className="bg-gray-900 text-gray-400 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-lg">🧹</div>
              <span className="font-black text-xl text-white tracking-tighter">CleanAlmaty<span className="text-emerald-500">.kz</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Сервис подбора клининговых услуг №1 в Алматы. Мы помогаем найти лучших исполнителей для вашего дома или офиса. Бесплатно и с гарантией.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/77001234567" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">📱</a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">✈️</a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">📸</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Услуги 2026</h4>
            <ul className="space-y-4 text-sm">
              {links.services.map(l => (
                <li key={l.name}><Link to={l.href} className="hover:text-emerald-500 transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Районы Алматы</h4>
            <ul className="space-y-4 text-sm">
              {links.districts.map(l => (
                <li key={l.name}><Link to={l.href} className="hover:text-emerald-500 transition-colors">{l.name} район</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Контакты</h4>
            <p className="text-sm mb-2">Алматы, Казахстан</p>
            <p className="text-sm mb-4">Работаем ежедневно: 8:00 — 22:00</p>
            <a href="tel:+77001234567" className="text-xl font-black text-white hover:text-emerald-500 transition-colors">+7 700 123 45 67</a>
            <div className="mt-6 p-4 bg-gray-800/50 rounded-2xl border border-gray-800">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">Для исполнителей</p>
              <Link to="/executor" className="text-emerald-500 text-sm font-bold hover:underline">Личный кабинет →</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">© {currentYear} CleanAlmaty.kz. Все права защищены. Информационный сервис.</p>
          <div className="flex gap-6 text-xs font-medium">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Условия оферты</a>
          </div>
        </div>
      </div>
    </footer>
  );
}