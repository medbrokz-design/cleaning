import { useState, useMemo } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  icon: string;
  category: string;
  keywords: string[];
}

interface FAQEnhancedProps {
  localFAQ?: { q: string; a: string }[];
}

export function FAQEnhanced({ localFAQ }: FAQEnhancedProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqItems: FAQItem[] = [
    {
      question: 'Сколько стоит уборка квартиры в Алматы?',
      answer: 'Стоимость уборки в 2026 году: поддерживающая от 230 ₸/м², генеральная от 460 ₸/м², после ремонта от 690 ₸/м². Оплата через Kaspi QR.',
      icon: '💰',
      category: 'prices',
      keywords: ['цена', 'стоимость', 'тенге']
    },
    {
      question: 'Какие районы Алматы обслуживаете?',
      answer: 'Все 8 районов Алматы: Бостандыкский, Медеуский, Алмалинский, Ауэзовский, Жетысуский, Турксибский, Наурызбайский, Алатауский.',
      icon: '📍',
      category: 'location',
      keywords: ['район', 'выезд']
    },
    {
      question: 'Привозите ли свои средства?',
      answer: 'Да, клинеры привозят всё необходимое: пылесос, стремянки и сертифицированные эко-средства (по запросу).',
      icon: '🧴',
      category: 'executors',
      keywords: ['средства', 'химия']
    }
  ];

  const categories = [
    { id: 'all', label: 'Все', icon: '📋' },
    { id: 'prices', label: 'Цены', icon: '💰' },
    { id: 'location', label: 'Районы', icon: '📍' },
    { id: 'executors', label: 'Исполнители', icon: '👥' }
  ];

  const filteredFAQ = useMemo(() => {
    const baseFiltered = faqItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (localFAQ && searchQuery === '' && activeCategory === 'all') {
      const localItems: FAQItem[] = localFAQ.map(item => ({
        question: item.q,
        answer: item.a,
        icon: '📍',
        category: 'location',
        keywords: ['локальный']
      }));
      return [...localItems, ...baseFiltered];
    }

    return baseFiltered;
  }, [activeCategory, searchQuery, localFAQ]);

  return (
    <section id="faq" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">База знаний и вопросы</h2>
          <p className="text-gray-600">Всё, что нужно знать перед заказом уборки в 2026 году</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <article key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center gap-4"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-gray-900 flex-1">{item.question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${openIndex === index ? 'rotate-180 bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 pl-16 text-gray-600 leading-relaxed whitespace-pre-line animate-fade-in">
                  {item.answer}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}