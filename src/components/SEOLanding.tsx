import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { seoData } from '../utils/seoData';
import { Hero } from './Hero';
import { Calculator } from './Calculator';
import { ServiceInfo } from './ServiceInfo';
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

  // Default SEO if slug not found
  const pageTitle = content?.title || 'Клининг в Алматы 2026 — Калькулятор стоимости';
  const pageDesc = content?.description || 'Бесплатный расчет стоимости уборки в Алматы за 1 минуту.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        {content?.keywords && <meta name="keywords" content={content.keywords} />}
        <link rel="canonical" href={`https://cleaning-almaty.kz/${slug || ''}`} />
      </Helmet>

      <main>
        {/* Custom Hero for SEO with H1 from data */}
        <div className="relative">
          <Hero onCTAClick={() => handleOpenModal()} />
          {content && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center pt-24">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h1 className="sr-only">{content.h1}</h1>
                <div className="bg-emerald-600/90 text-white px-6 py-2 rounded-full text-sm font-bold backdrop-blur-sm animate-bounce shadow-lg">
                  📍 Работаем в: {content.district || 'Алматы'}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Calculator onSubmit={handleOpenModal} />
        <ServiceInfo />
        <PriceFactors />
        <LocalSEO />
        <Testimonials />
        <CTASection onCTAClick={() => handleOpenModal()} />
        <FAQEnhanced />
      </main>

      <RequestModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        calculatorData={calculatorData}
      />
    </>
  );
}
