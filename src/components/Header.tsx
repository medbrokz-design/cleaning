import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLangStore } from '../store/langStore';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, lang, setLang } = useLangStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Калькулятор', href: '/#calculator' },
    { name: 'Цены', href: '/#local-seo' },
    { name: 'Безопасность', href: '/#trust' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform duration-300">
                🧹
              </div>
              <span className="font-black text-xl tracking-tighter text-slate-900">
                CleanAlmaty<span className="text-emerald-600">.kz</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-4 w-[1px] bg-slate-200"></div>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {['ru', 'kk'].map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l as any)}
                    className={`px-2 py-1 rounded-md text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <a 
                href="tel:+77001234567" 
                className="hidden lg:block text-sm font-black text-slate-900 hover:text-emerald-600 transition-colors"
              >
                +7 700 123 45 67
              </a>
              <a 
                href="#calculator" 
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                Заказать
              </a>
              
              {/* Burger Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-12">
            <span className="font-black text-white text-2xl">Меню</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-3xl font-black text-white hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Link to="/executor" className="text-3xl font-black text-emerald-400">Исполнителям</Link>
          </nav>

          <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-6">
            <div className="flex gap-4">
              {['ru', 'kk'].map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l as any)}
                  className={`flex-1 py-4 rounded-2xl text-lg font-black uppercase transition-all ${lang === l ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40'}`}
                >
                  {l === 'ru' ? 'Русский' : 'Қазақша'}
                </button>
              ))}
            </div>
            <a href="tel:+77001234567" className="text-center text-xl font-black text-white">+7 700 123 45 67</a>
          </div>
        </div>
      </div>
    </>
  );
}
