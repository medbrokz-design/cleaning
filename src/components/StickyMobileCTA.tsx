import { useState, useEffect } from 'react';

interface StickyMobileCTAProps {
  onCTAClick: () => void;
}

export function StickyMobileCTA({ onCTAClick }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setIsOnline(hour >= 9 && hour < 21);
  }, []);

  // Pulse animation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="glass border-t border-gray-200 px-4 py-3 shadow-2xl shadow-black/10">
        <div className="flex items-center gap-3">
          {/* Status */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
              <span className="text-xs font-medium text-gray-700">
                {isOnline ? 'Исполнители онлайн' : 'Ответим утром'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Бесплатно • 2 мин на заявку
            </div>
          </div>
          
          {/* CTA Button */}
          <button
            onClick={onCTAClick}
            className={`relative flex-shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center gap-2 ${
              showPulse ? 'animate-pulse-soft' : ''
            }`}
          >
            {/* Pulse ring */}
            <span className={`absolute inset-0 rounded-xl bg-emerald-400 ${showPulse ? 'animate-ping opacity-30' : 'opacity-0'}`}></span>
            
            <svg className="w-4 h-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="relative">Заявка</span>
          </button>
        </div>
      </div>
    </div>
  );
}
