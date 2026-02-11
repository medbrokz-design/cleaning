import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { seoData } from '../utils/seoData';
import { Hero } from './Hero';
import { Calculator } from './Calculator';
import { ServiceInfo } from './ServiceInfo';
import { Checklist } from './Checklist'; // ADDED
import { LocalContent } from './LocalContent'; // NEW
import { PriceFactors } from './PriceFactors';
import { LocalSEO } from './LocalSEO';
import { Testimonials } from './Testimonials';
import { FAQEnhanced } from './FAQEnhanced';
import { CTASection } from './CTASection';
import { RequestModal } from './RequestModal';
import { useState } from 'react';

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

export function SEOLanding() {
  const { slug } = useParams();
  const content = slug ? seoData[slug] : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);

  if (!content && slug) {
    return <Navigate to="/" replace />;
  }

  const handleOpenModal = (data?: CalculatorData) => {
    if (data) setCalculatorData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>{content?.title}</title>
        <meta name="description" content={content?.description} />
        {content?.keywords && <meta name="keywords" content={content.keywords} />}
        <link rel="canonical" href={`https://cleaning-almaty.kz/${slug}`} />
        
        {/* Machine-readable JSON-LD for LLMs and Voice Agents */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": content?.h1,
            "description": content?.description,
            "speakable": {
              "@type": "SpeakableSpecification",
              "xpath": [
                "/html/head/title",
                "/html/head/meta[@name='description']/@content"
              ]
            },
            "provider": {
              "@type": "LocalBusiness",
              "name": "CleanAlmaty",
              "telephone": "+7-700-123-45-67",
              "priceRange": "₸₸",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Алматы",
                "addressRegion": content?.district || "Алматы",
                "addressCountry": "KZ"
              },
              "openingHours": "Mo-Su 08:00-22:00",
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "43.238949",
                "longitude": "76.945465"
              }
            },
            "areaServed": {
              "@type": "AdministrativeArea",
              "name": content?.district || "Алматы"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Cleaning Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": content?.service || "General Cleaning"
                  },
                  "priceCurrency": "KZT",
                  "price": content?.title.match(/\d+/g)?.[0] || "230"
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <main>
        <div className="relative bg-slate-900 pt-32 pb-20 overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold mb-8 backdrop-blur-sm">
              📍 {content?.district ? `Работаем в районе: ${content.district}` : 'Услуга доступна во всех районах'}
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
              {content?.h1}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              {content?.heroText}
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-xl transition-all">
                Заказать сейчас
              </button>
            </div>
          </div>
        </div>
        
        {/* Уникальный контент для SEO */}
        {content && (
          <LocalContent 
            localText={content.localText} 
            landmarks={content.landmarks} 
            district={content.district} 
          />
        )}

        {/* На странице химчистки показываем специальный прайс вместо общего калькулятора */}
        {slug === 'furniture-cleaning' ? (
          <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-tighter">Прайс-лист на химчистку 2026</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Диван 2-местный', price: 'от 10 000 ₸', icon: '🛋️' },
                  { name: 'Диван угловой (стандарт)', price: 'от 15 000 ₸', icon: '🛋️' },
                  { name: 'Матрас 2-сторонний', price: 'от 12 000 ₸', icon: '🛏️' },
                  { name: 'Кресло', price: 'от 4 000 ₸', icon: '🪑' },
                  { name: 'Стул с мягкой спинкой', price: 'от 1 500 ₸', icon: '🪑' },
                  { name: 'Ковер / Ковролин (м²)', price: 'от 1 200 ₸', icon: '🧶' },
                ].map(item => (
                  <div key={item.name} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="font-bold text-slate-800">{item.name}</span>
                    </div>
                    <span className="font-black text-emerald-600">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <Calculator onSubmit={handleOpenModal} />
        )}

        <ServiceInfo />
        
        {/* Уникальные преимущества только для химчистки */}
        {slug === 'furniture-cleaning' && (
          <section className="py-24 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black mb-4">Почему выбирают наш сервис</h2>
                <p className="text-slate-400">Мы используем технологии, которые возвращают мебели заводской вид.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Немецкое оборудование', desc: 'Профессиональные экстракторы Karcher с высокой мощностью всасывания.', icon: '🇩🇪' },
                  { title: 'Безопасно для детей', desc: 'Гипоаллергенная химия Chemspec, которая не оставляет запаха и следов.', icon: '👶' },
                  { title: 'Высыхание за 2 часа', desc: 'Используем мебельные сушки, чтобы вы могли пользоваться диваном сразу.', icon: '⚡' },
                ].map(b => (
                  <div key={b.title} className="p-8 rounded-[40px] bg-white/5 border border-white/10 text-center">
                    <div className="text-5xl mb-6">{b.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{b.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Уникальный чек-лист */}
        <Checklist 
          customTitle={content?.customChecklist?.title} 
          customItems={content?.customChecklist?.items} 
        />

        <PriceFactors />
        <LocalSEO />

        {/* Уникальные отзывы */}
        <Testimonials customTestimonials={content?.testimonials} />

        <CTASection onCTAClick={() => handleOpenModal()} />

        {/* FAQ с локальными вопросами */}
        <FAQEnhanced localFAQ={content?.localFAQ} />
      </main>

      <RequestModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        calculatorData={calculatorData}
      />
    </>
  );
}
