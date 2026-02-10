import { useState, useEffect, useCallback } from 'react';
import { useAdminStore, Review } from '../store/adminStore';

interface TestimonialData {
  name: string;
  avatar: string;
  district: string;
  type: string;
  text: string;
  rating: number;
  date: string;
  verified: boolean;
  subscription: boolean;
}

interface TestimonialsProps {
  customTestimonials?: any[];
}

export function Testimonials({ customTestimonials }: TestimonialsProps) {
  const { reviews } = useAdminStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [requestCount, setRequestCount] = useState(4892);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const publishedReviews = reviews.filter(r => r.isPublished);

  const displayTestimonials: TestimonialData[] = customTestimonials && customTestimonials.length > 0
    ? customTestimonials.map((t: any) => ({
        ...t,
        verified: true,
        subscription: false,
        district: 'Проверенный отзыв',
        type: 'Уборка по адресу'
      }))
    : publishedReviews.length > 0 
      ? publishedReviews.map((r: Review) => ({
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
      : [
          {
            name: 'Айгерим К.',
            avatar: '👩',
            district: 'Бостандыкский район',
            type: 'Эко-уборка',
            text: 'Заказала эко-уборку для квартиры — у нас маленький ребёнок. Всё убрали за 3 часа. Оплатила через Kaspi QR.',
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
            text: 'Ремонт в новостройке 120 м². Бригада из 4 человек работала целый день. ИИ-калькулятор точно рассчитал стоимость.',
            rating: 5,
            date: '5 дней назад',
            verified: true,
            subscription: false
          }
        ];

  const beforeAfterExamples = [
    { type: 'Генеральная', before: '😰 Пыль везде, разводы', after: '✨ Идеальная чистота', improvement: '98%' },
    { type: 'После ремонта', before: '🔨 Строительная пыль', after: '🏠 Как новая квартира', improvement: '100%' },
    { type: 'Эко-уборка', before: '🤧 Аллергия у ребёнка', after: '🌿 Безопасно и чисто', improvement: '95%' },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  useEffect(() => {
    if (!isAutoPlaying || displayTestimonials.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, displayTestimonials.length]);

  const stats = [
    { value: `${requestCount.toLocaleString()}+`, label: 'заявок в 2024-26', icon: '📋' },
    { value: '120+', label: 'исполнителей', icon: '👥' },
    { value: '4.9', label: 'средняя оценка', icon: '⭐' },
    { value: '1-2 ч', label: 'время ответа', icon: '⚡' }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats bar */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 lg:p-8 mb-16 shadow-xl shadow-emerald-200/50">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} className="relative">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Что говорят пользователи</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Реальные истории клиентов</p>
        </div>

        {/* Testimonials slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {displayTestimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">{testimonial.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">{testimonial.district}</div>
                      </div>
                    </div>
                    <blockquote className="relative text-gray-700 leading-relaxed text-lg">
                      <p className="relative z-10 pl-4">"{testimonial.text}"</p>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-all">←</button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-all">→</button>
        </div>

        {/* Before/After */}
        <div className="mt-16 mb-12">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-8">📸 Результаты до/после</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beforeAfterExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-emerald-600 mb-3">{example.type}</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-red-50 rounded-xl p-3 text-center text-xs text-red-700">{example.before}</div>
                  <div className="text-2xl">→</div>
                  <div className="flex-1 bg-green-50 rounded-xl p-3 text-center text-xs text-green-700">{example.after}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}