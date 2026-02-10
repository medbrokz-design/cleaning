import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Калькулятор', href: '/#calculator' },
    { name: 'Цены', href: '/#local-seo' },
    { name: 'Отзывы', href: '/#faq' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-emerald-200 shadow-lg group-hover:rotate-12 transition-transform">
              🧹
            </div>
            <span className={`font-black text-xl tracking-tighter ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              CleanAlmaty<span className="text-emerald-600">.kz</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Link 
              to="/executor" 
              className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-all"
            >
              Исполнителям
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="tel:+77001234567" 
              className="hidden sm:block text-sm font-black text-gray-900"
            >
              +7 700 123 45 67
            </a>
            <a 
              href="#calculator" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              Заказать
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}