import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { seoData } from '../utils/seoData';
import { Hero } from './Hero';
import { Calculator } from './Calculator';
import { ServiceInfo } from './ServiceInfo';
import { LocalContent } from './LocalContent'; // NEW
import { PriceFactors } from './PriceFactors';
import { LocalSEO } from './LocalSEO';
import { Testimonials } from './Testimonials';
import { FAQEnhanced } from './FAQEnhanced';
import { CTASection } from './CTASection';
import { RequestModal } from './RequestModal';
import { useState } from 'react';

export function SEOLanding() {
  const { slug } = useParams();
  const content = slug ? seoData[slug] : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calculatorData, setCalculatorData] = useState<any>(null);

  if (!content && slug) {
    return <Navigate to="/" replace />;
  }

  const handleOpenModal = (data?: any) => {
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
        
        {/* Machine-readable JSON-LD for LLMs */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": content?.h1,
            "description": content?.description,
            "provider": {
              "@type": "LocalBusiness",
              "name": "CleanAlmaty",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Алматы",
                "addressRegion": content?.district || "Алматы",
                "addressCountry": "KZ"
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
        <div className="relative">
          <Hero onCTAClick={() => handleOpenModal()} />
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center pt-32">
            <h1 className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-xl md:text-2xl font-bold shadow-2xl animate-fade-in border-4 border-white/20 backdrop-blur-sm">
              {content?.h1}
            </h1>
            <p className="mt-4 text-white font-medium bg-black/30 px-4 py-1 rounded-full backdrop-blur-sm">
              {content?.heroText}
            </p>
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

        <Calculator onSubmit={handleOpenModal} />
        <ServiceInfo />
        
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
