import { useState, useEffect, useRef } from 'react';
import { useAdminStore } from '../store/adminStore';

interface CalculatorProps {
  onSubmit: (data: any) => void;
}

const propertyTypes = [
  { id: 'apartment', label: 'Квартира', icon: '🏠', desc: 'Жилая квартира' },
  { id: 'house', label: 'Дом', icon: '🏡', desc: 'Частный дом' },
  { id: 'office', label: 'Офис', icon: '🏢', desc: 'Офисное помещение' }
];

const dirtLevels = [
  { id: 'normal', label: 'Обычная', desc: 'Стандартный уровень', emoji: '👍' },
  { id: 'heavy', label: 'Сильная', desc: 'Много грязи и пятен', emoji: '😰' }
];

const upsellServices = [
  { id: 'fridge', label: 'Холодильник', price: 3500, icon: '🧊' },
  { id: 'oven', label: 'Духовка', price: 3000, icon: '🔥' },
  { id: 'sofa', label: 'Химчистка дивана', price: 12000, icon: '🛋️' },
  { id: 'balcony', label: 'Балкон', price: 5000, icon: '🏙️' },
];

const stepIcons = ['🏠', '✨', '📐', '🚿', '🪟', '🧹', '➕'];
const stepLabels = ['Тип', 'Уборка', 'Площадь', 'Санузлы', 'Окна', 'Грязь', 'Допы'];

export function Calculator({ onSubmit }: CalculatorProps) {
  const { prices } = useAdminStore();
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [cleaningType, setCleaningType] = useState('');
  const [area, setArea] = useState(50);
  const [bathrooms, setBathrooms] = useState(1);
  const [windows, setWindows] = useState(false);
  const [dirtLevel, setDirtLevel] = useState('');
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(4);
  const calculatorRef = useRef<HTMLDivElement>(null);

  const cleaningTypes = [
    { id: 'regular', label: 'Поддерживающая', desc: 'Регулярная уборка', icon: '✨', price: `от ${prices.regular} ₸/м²` },
    { id: 'deep', label: 'Генеральная', desc: 'Глубокая уборка всего', icon: '🧹', price: `от ${prices.deep} ₸/м²` },
    { id: 'post-renovation', label: 'После ремонта', desc: 'Удаление стройпыли', icon: '🔨', price: `от ${prices.postRenovation} ₸/м²` },
    { id: 'eco', label: 'Эко-уборка', desc: 'Био-средства', icon: '🌿', price: `от ${prices.eco} ₸/м²` }
  ];

  const totalSteps = 7;

  const calculatePrice = () => {
    let base = prices[cleaningType as keyof typeof prices] as number || 230;
    if (typeof base === 'object') base = prices.regular;
    
    let multiplier = propertyType === 'house' ? 1.2 : propertyType === 'office' ? 0.85 : 1;
    let minPrice = area * base * multiplier;
    minPrice += bathrooms * prices.bathroom.min;
    if (windows) minPrice += prices.windows.min;
    
    selectedUpsells.forEach(id => {
      const service = upsellServices.find(s => s.id === id);
      if (service) minPrice += service.price;
    });
    
    if (dirtLevel === 'heavy') minPrice *= prices.heavyDirtModifier;
    
    return { min: Math.round(minPrice / 500) * 500, max: Math.round(minPrice * 1.4 / 500) * 500 };
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (step < totalSteps) setStep(step + 1);
      else setShowResult(true);
      setIsAnimating(false);
    }, 150);
  };

  const toggleUpsell = (id: string) => {
    setSelectedUpsells(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const price = calculatePrice();

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-white" ref={calculatorRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FOMO Ticker */}
        <div className="mb-8 bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-center justify-center gap-3 animate-pulse">
          <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
          <p className="text-amber-800 text-sm font-medium">
            Осталось всего <span className="font-bold">{availableSlots} свободных слота</span> на сегодня в Алматы!
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-2xl">
          {!showResult && (
            <div className="mb-10">
              <div className="flex justify-between mb-4">
                {stepLabels.map((label, i) => (
                  <div key={i} className={`flex flex-col items-center flex-1 ${i < step ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${i + 1 === step ? 'bg-emerald-500 text-white shadow-lg' : i + 1 < step ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100'}`}>
                      {i + 1 < step ? '✓' : stepIcons[i]}
                    </div>
                    <span className="text-[10px] font-medium hidden sm:block">{label}</span>
                  </div>
                ))}
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
              </div>
            </div>
          )}

          <div className={`min-h-[300px] transition-all ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {!showResult ? (
              <div className="space-y-6">
                {step === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {propertyTypes.map(t => (
                      <button key={t.id} onClick={() => { setPropertyType(t.id); handleNext(); }} className={`p-6 rounded-2xl border-2 transition-all ${propertyType === t.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
                        <div className="text-4xl mb-2">{t.icon}</div>
                        <div className="font-bold">{t.label}</div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    {cleaningTypes.map(t => (
                      <button key={t.id} onClick={() => { setCleaningType(t.id); handleNext(); }} className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 ${cleaningType === t.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
                        <div className="text-3xl">{t.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold">{t.label}</div>
                          <div className="text-xs text-gray-500">{t.desc}</div>
                        </div>
                        <div className="text-emerald-600 font-bold">{t.price}</div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="text-center space-y-8">
                    <div className="text-6xl font-bold text-emerald-600">{area} м²</div>
                    <input type="range" min="20" max="250" value={area} onChange={(e) => setArea(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                    <button onClick={handleNext} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold">Далее</button>
                  </div>
                )}

                {step === 7 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl mb-4">Добавить услуги для идеальной чистоты:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {upsellServices.map(s => (
                        <button key={s.id} onClick={() => toggleUpsell(s.id)} className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${selectedUpsells.includes(s.id) ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-100'}`}>
                          <span className="text-2xl">{s.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-bold">{s.label}</div>
                            <div className="text-xs text-emerald-600">+{s.price} ₸</div>
                          </div>
                          {selectedUpsells.includes(s.id) && <span className="text-emerald-500">✓</span>}
                        </button>
                      ))}
                    </div>
                    <button onClick={handleNext} className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg">Показать результат</button>
                  </div>
                )}
                
                {/* Fallback for other steps */}
                {[4,5,6].includes(step) && (
                  <div className="text-center space-y-6">
                    <h3 className="text-xl font-bold">{stepLabels[step-1]}?</h3>
                    <div className="flex justify-center gap-4">
                      <button onClick={() => { if(step===4) setBathrooms(1); if(step===5) setWindows(true); if(step===6) setDirtLevel('heavy'); handleNext(); }} className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold">Да</button>
                      <button onClick={() => { if(step===4) setBathrooms(0); if(step===5) setWindows(false); if(step===6) setDirtLevel('normal'); handleNext(); }} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold">Нет</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-6 animate-fade-in">
                <div className="text-sm text-emerald-600 font-bold tracking-widest uppercase">Ваш расчет готов</div>
                <div className="text-5xl font-black text-gray-900">{price.min.toLocaleString()} — {price.max.toLocaleString()} ₸</div>
                <p className="text-gray-500">Включая {selectedUpsells.length} доп. услуги</p>
                <button onClick={() => onSubmit({ ...price, propertyType, cleaningType, area, selectedUpsells })} className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition-transform">
                  ЗАБРОНИРОВАТЬ СО СКИДКОЙ 10%
                </button>
                <p className="text-xs text-gray-400">🔥 Скидка действует только при бронировании в течение 15 минут</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}