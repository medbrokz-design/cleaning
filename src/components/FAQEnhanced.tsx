import { useState, useMemo } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  icon: string;
  category: string;
}

interface FAQEnhancedProps {
  localFAQ?: { q: string; a: string }[];
}

export function FAQEnhanced({ localFAQ }: FAQEnhancedProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqItems: FAQItem[] = [
    // Разговорные вопросы для голосовых ассистентов
    {
      question: 'Алекса, сколько стоит помыть квартиру в Алматы?',
      answer: 'В 2026 году средняя цена за поддерживающую уборку в Алматы составляет 230 тенге за квадратный метр. Генеральная уборка стоит от 460 тенге. Точный расчет вы можете сделать в нашем калькуляторе на сайте.',
      icon: '🎙️',
      category: 'voice'
    },
    {
      question: 'Окей Гугл, как долго длится генеральная уборка?',
      answer: 'Генеральная уборка квартиры площадью 50 квадратных метров обычно занимает от 4 до 6 часов. Если работают два клинера, время сокращается вдвое.',
      icon: '⏱️',
      category: 'time'
    },
    {
      question: 'Сири, можно ли оплатить уборку через Каспи QR?',
      answer: 'Да, все наши исполнители принимают оплату через Kaspi QR или Kaspi перевод сразу после того, как вы примите работу.',
      icon: '💳',
      category: 'payment'
    },
    {
      question: 'Какие средства вы используете для эко-уборки?',
      answer: 'Мы используем сертифицированные биоразлагаемые средства, такие как Chemspec и Green Lab. Они полностью безопасны для детей, аллергиков и домашних животных.',
      icon: '🌿',
      category: 'executors'
    }
  ];

  const filteredFAQ = useMemo(() => {
    const baseFiltered = faqItems.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (localFAQ && searchQuery === '') {
      const localItems: FAQItem[] = localFAQ.map(item => ({
        question: item.q,
        answer: item.a,
        icon: '📍',
        category: 'location'
      }));
      return [...localItems, ...baseFiltered];
    }
    return baseFiltered;
  }, [searchQuery, localFAQ]);

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Помощник CleanAlmaty</h2>
          <p className="text-lg text-slate-500">Отвечаем на популярные вопросы жителей города</p>
        </div>

        <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
          {filteredFAQ.map((item, index) => (
            <article 
              key={index} 
              className={`bg-white rounded-[32px] border transition-all duration-300 ${openIndex === index ? 'border-emerald-500 shadow-xl shadow-emerald-100/50' : 'border-slate-100 hover:border-slate-200'}`}
              itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center gap-4"
                aria-expanded={openIndex === index}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="font-bold text-slate-900 flex-1 leading-tight" itemProp="name">{item.question}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-8 pb-8 pl-20 animate-fade-in" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <div className="text-slate-600 leading-relaxed text-lg" itemProp="text">
                    {item.answer}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
