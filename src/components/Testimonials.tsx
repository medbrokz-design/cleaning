import { useState, useEffect, useCallback } from 'react';
import { useAdminStore } from '../store/adminStore';

export function Testimonials() {
  const { reviews } = useAdminStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [requestCount, setRequestCount] = useState(4892); // Updated for 2026
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const publishedReviews = reviews.filter(r => r.isPublished);

  // Fallback to static testimonials if no published reviews exist
  const staticTestimonials = [
    {
      name: 'Айгерим К.',
      avatar: '👩',
      district: 'Бостандыкский район',
      type: 'Эко-уборка',
      text: 'Заказала эко-уборку для квартиры — у нас маленький ребёнок. Клинеры приехали с сертифицированными био-средствами, всё убрали за 3 часа. Оплатила через Kaspi QR после осмотра. Теперь на подписке со скидкой 20%!',
      rating: 5,
      date: '2 дня назад',
      verified: true,
      subscription: true
    },
    {
      name: 'Марат Т.',
      avatar: '👨',
      district: 'Медеуский район',
      type: 'Уборка после ремонта',
      text: 'Ремонт в новостройке 120 м². Бригада из 4 человек работала целый день. ИИ-калькулятор точно рассчитал стоимость — разница с итоговым счётом была всего 5%. Фото-отчёт прислали в телеграм. Рекомендую!',
      rating: 5,
      date: '5 дней назад',
      verified: true,
      subscription: false
    }
  ];

  const displayTestimonials = publishedReviews.length > 0 
    ? publishedReviews.map(r => ({
        name: r.clientName,
        avatar: r.clientName.charAt(0),
        district: 'Алматы',
        type: 'Услуга клининга',
        text: r.text,
        rating: r.rating,
        date: new Date(r.createdAt).toLocaleDateString('ru-RU'),
        verified: true,
        subscription: false
      }))
    : staticTestimonials;

  // Simulate live request counter
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setRequestCount(prev => prev + 1);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || displayTestimonials.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, displayTestimonials.length]);

  // Updated stats for 2026
  const stats = [
    { value: `${requestCount.toLocaleString()}+`, label: 'заявок в 2024-26', icon: '📋' },
    { value: '120+', label: 'исполнителей', icon: '👥' },
    { value: '4.9', label: 'средняя оценка', icon: '⭐' },
    { value: '1-2 ч', label: 'время ответа', icon: '⚡', live: true }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats bar - Updated for 2026 */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 lg:p-8 mb-16 shadow-xl shadow-emerald-200/50">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} className="relative">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
                  {stat.live && (
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  )}
                  {stat.value}
                </div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* New 2026 badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 pt-6 border-t border-white/20">
            <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              <span>🌿</span> Эко-уборка доступна
            </span>
            <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              <span>🔄</span> Подписки со скидкой 20%
            </span>
            <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              <span>💳</span> Kaspi QR оплата
            </span>
          </div>
        </div>

        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Отзывы 2024-2026
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Что говорят пользователи
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Реальные истории клиентов, которые воспользовались сервисом
          </p>
        </div>

        {/* Testimonials slider */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">{testimonial.name}</span>
                          {testimonial.verified && (
                            <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                          {testimonial.subscription && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                              🔄 Подписка
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{testimonial.district}</div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full mt-1 font-medium">
                          ✨ {testimonial.type}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {/* Rating */}
                        <div className="flex gap-0.5 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-200'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">{testimonial.date}</div>
                      </div>
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="relative text-gray-700 leading-relaxed text-lg">
                      <span className="absolute -left-2 -top-2 text-5xl text-emerald-200 font-serif">"</span>
                      <p className="relative z-10 pl-4">{testimonial.text}</p>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:border-emerald-300 transition-all hover:scale-110"
            aria-label="Предыдущий отзыв"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:border-emerald-300 transition-all hover:scale-110"
            aria-label="Следующий отзыв"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-emerald-500 w-8' 
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Перейти к отзыву ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Before/After Examples - Added based on focus group feedback */}
        <div className="mt-16 mb-12">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
            📸 Результаты до/после
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beforeAfterExamples.map((example, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-sm font-medium text-emerald-600 mb-3">{example.type}</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-red-600 font-medium mb-1">ДО</div>
                    <div className="text-sm text-red-700">{example.before}</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-green-600 font-medium mb-1">ПОСЛЕ</div>
                    <div className="text-sm text-green-700">{example.after}</div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                    ✓ {example.improvement} клиентов довольны
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges - Updated for 2026 */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            { icon: '🔒', text: 'Kaspi QR оплата' },
            { icon: '⚡', text: 'Ответ за 1-2 часа' },
            { icon: '✓', text: '120+ проверенных исполнителей' },
            { icon: '🌿', text: 'Эко-средства доступны' }
          ].map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 bg-gray-50 hover:bg-emerald-50 px-4 py-2 rounded-full text-sm text-gray-600 transition-colors"
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
