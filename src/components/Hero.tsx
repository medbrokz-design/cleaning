import { useState, useEffect } from 'react';

interface HeroProps {
  onCTAClick: () => void;
}

export function Hero({ onCTAClick }: HeroProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [typedText, setTypedText] = useState('');
  const fullText = 'квартиры • дома • офисы • эко-уборка';

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setIsOnline(hour >= 8 && hour < 22); // Extended hours for 2026
  }, []);

  // Typing effect with pause at full text
  useEffect(() => {
    let index = 0;
    let deleting = false;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;

    const timer = setInterval(() => {
      if (pauseTimer) return;

      if (!deleting) {
        setTypedText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) {
          pauseTimer = setTimeout(() => {
            deleting = true;
            pauseTimer = null;
          }, 2000);
        }
      } else {
        index--;
        setTypedText(fullText.slice(0, index));
        if (index === 0) {
          deleting = false;
          pauseTimer = setTimeout(() => {
            pauseTimer = null;
          }, 500);
        }
      }
    }, 80);

    return () => {
      clearInterval(timer);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, []);

  const trustItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      title: 'Не клининговая компания',
      desc: 'Агрегатор — подбираем лучших исполнителей',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Выбираете сами',
      desc: 'Сравните 2-4 предложения с рейтингами',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Kaspi QR оплата',
      desc: 'Платите после приёмки работы',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Бесплатно для вас',
      desc: 'ИИ-калькулятор, чек-листы, заявка — 0 ₸',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  // Updated stats for 2026
  const stats = [
    { value: '4800+', label: 'заявок' },
    { value: '120+', label: 'исполнителей' },
    { value: '4.9', label: 'рейтинг' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full opacity-40 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full opacity-40 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-30 blur-3xl"></div>
        
        {/* Decorative icons floating */}
        <div className="absolute top-20 left-10 text-4xl opacity-20 animate-float">🧹</div>
        <div className="absolute top-40 right-20 text-4xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute bottom-40 left-20 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🏠</div>
        <div className="absolute bottom-20 right-40 text-4xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>🌿</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Online badge - Updated for 2026 */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-gray-200/50 shadow-lg mb-6 animate-fade-in">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="text-sm font-medium text-gray-700">
              {isOnline ? (
                <>Исполнители онлайн — ответят за <span className="text-emerald-600 font-semibold">1-2 часа</span></>
              ) : (
                <>Оставьте заявку — ответим в <span className="text-emerald-600 font-semibold">8:00</span></>
              )}
            </span>
          </div>

          {/* 2026 Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <span>🚀</span>
            <span>Цены и сервис 2026</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">NEW</span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 lg:mb-6">
            Клининг в{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Алматы</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C47.5 2.5 154 1.5 199 5.5" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#10b981"/>
                    <stop offset="1" stopColor="#14b8a6"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br className="hidden sm:block" />
            <span className="text-gray-600 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-2 block">
              ИИ-подбор исполнителей под ваши нужды
            </span>
          </h1>

          {/* Typed text */}
          <div className="h-8 mb-4">
            <span className="text-lg text-emerald-600 font-mono">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Рассчитайте стоимость с ИИ-калькулятором, получите рекомендации и предложения от проверенных клинеров.{' '}
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Бесплатно
            </span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a 
              href="#calculator"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-xl shadow-emerald-200/50 hover:shadow-2xl hover:shadow-emerald-300/50 hover:-translate-y-1"
            >
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Рассчитать стоимость
              <span className="text-emerald-200 text-sm">→</span>
            </a>
            <button 
              onClick={onCTAClick}
              className="group inline-flex items-center justify-center gap-3 glass hover:bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all border-2 border-gray-200 hover:border-emerald-300 hover:shadow-lg"
            >
              <svg className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Оставить заявку
            </button>
          </div>

          {/* Mini stats - Updated 2026 */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* New features 2026 */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <span>🌿</span> Эко-уборка
            </span>
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              <span>🔄</span> Подписки -20%
            </span>
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <span>💳</span> Kaspi QR
            </span>
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
              <span>⚡</span> Ответ 1-2 часа
            </span>
          </div>
        </div>

        {/* Trust Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {trustItems.map((item, index) => (
            <div 
              key={index}
              className="group glass rounded-2xl p-5 border border-gray-100/50 hover-scale cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
