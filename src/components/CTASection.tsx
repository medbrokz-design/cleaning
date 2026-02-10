import { useState, useEffect } from 'react';

interface CTASectionProps {
  onCTAClick: () => void;
}

export function CTASection({ onCTAClick }: CTASectionProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47 });

  // Countdown timer (simulated urgency)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59 };
        }
        return { hours: 2, minutes: 47 }; // Reset
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const benefits = [
    { icon: '✓', text: 'Бесплатно для вас' },
    { icon: '✓', text: 'Без обязательств' },
    { icon: '✓', text: '2-3 предложения за день' },
    { icon: '✓', text: 'Выбор за вами' }
  ];

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
      
      {/* Floating elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">✨</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🧹</div>
      <div className="absolute top-1/2 right-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🏠</div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6 border border-white/30">
          <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
          <span>Исполнители ответят в течение {timeLeft.hours}ч {timeLeft.minutes}мин</span>
        </div>

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Готовы найти клинера?
        </h2>
        <p className="text-xl text-emerald-100 mb-6 max-w-2xl mx-auto">
          Передайте заявку подходящим исполнителям прямо сейчас
        </p>

        {/* Time estimate */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90 mb-8">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <span>⏱️</span>
            <span>Заполнение: 2 минуты</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <span>📱</span>
            <span>Ответ: 2-3 часа</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <span>🎯</span>
            <span>Предложений: 2-3</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={onCTAClick}
            className="group inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-emerald-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1"
          >
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Оставить заявку бесплатно
          </button>
          <a
            href="#calculator"
            className="inline-flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 text-white px-8 py-5 rounded-2xl font-semibold text-lg transition-all border border-white/30 backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Сначала рассчитать
          </a>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-white/90">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
                {benefit.icon}
              </span>
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="mt-8 text-sm text-white/70 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Ваши данные защищены и передаются только выбранным исполнителям
        </p>
      </div>
    </section>
  );
}
