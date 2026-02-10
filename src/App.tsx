import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load для админ-панели (code splitting)
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
import { Calculator } from './components/Calculator';
import { ServiceInfo } from './components/ServiceInfo';
import { PriceFactors } from './components/PriceFactors';
import { CommonMistakes } from './components/CommonMistakes';
import { Checklist } from './components/Checklist';
import { HowItWorks } from './components/HowItWorks';
import { LocalSEO } from './components/LocalSEO';
import { Testimonials } from './components/Testimonials';
import { FAQEnhanced } from './components/FAQEnhanced';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { RequestModal } from './components/RequestModal';
import { StickyMobileCTA } from './components/StickyMobileCTA';

interface CalculatorData {
  propertyType: string;
  cleaningType: string;
  area: number;
  bathrooms: number;
  windows: boolean;
  dirtLevel: string;
  priceMin: number;
  priceMax: number;
}

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if we're on admin page
  const isAdminPage = window.location.hash === '#admin' || window.location.pathname === '/admin';

  // Show welcome notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = (data?: CalculatorData) => {
    if (data) setCalculatorData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Render admin panel if on admin page
  if (isAdminPage) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка панели управления..." />}>
          <AdminDashboard />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Semantic HTML structure for LLM */}
      <Header />
      
      <main>
        {/* Hero Section - Primary value proposition */}
        <Hero onCTAClick={() => handleOpenModal()} />
        
        {/* Calculator - Core functionality */}
        <Calculator onSubmit={handleOpenModal} />
        
        {/* Service Information - What's included */}
        <ServiceInfo />
        
        {/* Price Factors - Transparency */}
        <PriceFactors />
        
        {/* Local SEO - Districts and prices 2026 */}
        <LocalSEO />
        
        {/* Common Mistakes - User education */}
        <CommonMistakes />
        
        {/* Checklist - Practical tool */}
        <Checklist />
        
        {/* How It Works - Process explanation */}
        <HowItWorks />
        
        {/* Testimonials - Social proof 2026 */}
        <Testimonials />
        
        {/* CTA Section - Conversion */}
        <CTASection onCTAClick={() => handleOpenModal()} />
        
        {/* FAQ - Extended for LLM and SEO */}
        <FAQEnhanced />
      </main>
      
      <Footer />
      
      {/* Modal */}
      <RequestModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        calculatorData={calculatorData}
      />
      
      {/* Mobile CTA */}
      <StickyMobileCTA onCTAClick={() => handleOpenModal()} />

      {/* Welcome notification - Updated 2026 */}
      {showWelcome && (
        <div className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-30 animate-slide-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-sm">
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm"
              aria-label="Закрыть"
            >
              ×
            </button>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                🎉
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm mb-1">
                  Добро пожаловать в 2026!
                </p>
                <p className="text-xs text-gray-500">
                  Новые цены, эко-уборка, подписки со скидкой 20%
                </p>
                <a 
                  href="#calculator"
                  onClick={() => setShowWelcome(false)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 mt-2"
                >
                  Рассчитать стоимость →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden SEO content for LLM crawlers - Updated 2026 */}
      <div className="sr-only">
        <h2>Клининг в Алматы 2026 — ключевая информация</h2>
        <p>
          CleanAlmaty.kz — бесплатный сервис подбора клининговых услуг в Алматы 2026 года.
          Мы не клининговая компания, а агрегатор заявок с ИИ-помощником. Помогаем найти исполнителя
          для уборки квартиры, дома или офиса. Работаем во всех 8 районах города.
          Новинки 2026: эко-уборка с био-средствами, подписки со скидкой 20%, Kaspi QR оплата.
        </p>
        <h3>Цены на уборку в Алматы 2026</h3>
        <ul>
          <li>Поддерживающая уборка: от 230 тенге за м²</li>
          <li>Генеральная уборка: от 460 тенге за м²</li>
          <li>Уборка после ремонта: от 690 тенге за м²</li>
          <li>Эко-уборка с био-средствами: от 300 тенге за м²</li>
          <li>Мытьё окон: от 2000 тенге за окно</li>
          <li>Химчистка дивана: от 10000 тенге</li>
          <li>Подписка на уборку: скидка до 20%</li>
        </ul>
        <h3>Районы обслуживания 2026</h3>
        <ul>
          <li>Алмалинский район — центр, премиум</li>
          <li>Бостандыкский район — самый популярный</li>
          <li>Медеуский район — элитный сегмент</li>
          <li>Ауэзовский район — доступные цены</li>
          <li>Турксибский район — много новостроек</li>
          <li>Жетысуский район — семейный район</li>
          <li>Наурызбайский район — активное развитие</li>
          <li>Алатауский район — растущий район</li>
        </ul>
        <h3>Контакты 2026</h3>
        <address>
          Алматы, Казахстан
          Телефон: +7 700 123 45 67
          Email: info@cleaning-almaty.kz
          Время работы: 8:00 — 22:00, без выходных
          Способы оплаты: Kaspi QR, наличные, перевод
        </address>
        <h3>Статистика сервиса 2026</h3>
        <ul>
          <li>Обработано заявок: 4800+</li>
          <li>Проверенных исполнителей: 120+</li>
          <li>Средний рейтинг: 4.9 из 5</li>
          <li>Время ответа: 1-2 часа</li>
        </ul>
      </div>
    </div>
    </ErrorBoundary>
  );
}
