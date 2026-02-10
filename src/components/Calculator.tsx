import { useState, useEffect, useRef } from 'react';
import { useAdminStore } from '../store/adminStore';

interface CalculatorProps {
  onSubmit: (data: CalculatorResult) => void;
}

interface CalculatorResult {
  propertyType: string;
  cleaningType: string;
  area: number;
  bathrooms: number;
  windows: boolean;
  dirtLevel: string;
  priceMin: number;
  priceMax: number;
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

const stepIcons = ['🏠', '✨', '📐', '🚿', '🪟', '🧹'];
const stepLabels = ['Тип', 'Уборка', 'Площадь', 'Санузлы', 'Окна', 'Загрязнение'];

export function Calculator({ onSubmit }: CalculatorProps) {
  const { prices } = useAdminStore();
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [cleaningType, setCleaningType] = useState('');
  const [area, setArea] = useState(50);
  const [bathrooms, setBathrooms] = useState(1);
  const [windows, setWindows] = useState(false);
  const [dirtLevel, setDirtLevel] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);

  const cleaningTypes = [
    { id: 'regular', label: 'Поддерживающая', desc: 'Регулярная уборка', icon: '✨', time: '1.5-3 часа', price: `от ${prices.regular} ₸/м²`, tooltip: 'Еженедельная уборка: пыль, полы, кухня, санузлы.' },
    { id: 'deep', label: 'Генеральная', desc: 'Глубокая уборка всего', icon: '🧹', time: '3-5 часов', price: `от ${prices.deep} ₸/м²`, tooltip: 'Полная уборка: внутри шкафов, за мебелью, мытьё светильников.' },
    { id: 'post-renovation', label: 'После ремонта', desc: 'Удаление строительной пыли', icon: '🔨', time: 'от 5 часов', price: `от ${prices.postRenovation} ₸/м²`, tooltip: 'Удаление строительной пыли, цемента, клея.' },
    { id: 'eco', label: 'Эко-уборка', desc: 'Био-средства, гипоаллергенно', icon: '🌿', time: '2-4 часа', price: `от ${prices.eco} ₸/м²`, isNew: true, tooltip: 'Используем только сертифицированные эко-средства.' }
  ];

  const totalSteps = 6;

  useEffect(() => {
    if (step > 1 && calculatorRef.current) {
      const yOffset = -100;
      const y = calculatorRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [step]);

  const calculatePrice = () => {
    let basePricePerM2 = prices[cleaningType as keyof typeof prices] as number || 0;
    if (typeof basePricePerM2 === 'object') basePricePerM2 = prices.regular; // Fallback
    
    let multiplier = 1;
    if (propertyType === 'house') multiplier = 1.2;
    else if (propertyType === 'office') multiplier = 0.85;
    
    let minPrice = area * basePricePerM2 * multiplier;
    
    // Add additions from store
    minPrice += bathrooms * prices.bathroom.min;
    if (windows) minPrice += prices.windows.min;
    
    if (dirtLevel === 'heavy') {
      minPrice *= prices.heavyDirtModifier;
    }
    
    let maxPrice = minPrice * 1.4;
    
    return {
      min: Math.round(minPrice / 500) * 500,
      max: Math.round(maxPrice / 500) * 500
    };
  };

  const calculateTime = () => {
    let baseTime = 1.5;
    if (cleaningType === 'deep') baseTime = 3;
    else if (cleaningType === 'post-renovation') baseTime = 5;
    else if (cleaningType === 'eco') baseTime = 2;
    
    const areaTime = Math.floor(area / 35); // slightly faster with modern equipment
    const bathroomTime = bathrooms * 0.4;
    const windowTime = windows ? 0.8 : 0;
    const dirtTime = dirtLevel === 'heavy' ? 1 : 0;
    
    const totalMin = baseTime + areaTime + bathroomTime + windowTime + dirtTime;
    const totalMax = totalMin + 1.5;
    
    return { min: Math.round(totalMin * 10) / 10, max: Math.round(totalMax * 10) / 10 };
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        setShowResult(true);
      }
      setIsAnimating(false);
    }, 150);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (showResult) {
        setShowResult(false);
      } else if (step > 1) {
        setStep(step - 1);
      }
      setIsAnimating(false);
    }, 150);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return propertyType !== '';
      case 2: return cleaningType !== '';
      case 3: return area > 0;
      case 4: return bathrooms >= 0;
      case 5: return true;
      case 6: return dirtLevel !== '';
      default: return false;
    }
  };

  const price = calculatePrice();
  const time = calculateTime();

  const handleSubmitRequest = () => {
    onSubmit({
      propertyType,
      cleaningType,
      area,
      bathrooms,
      windows,
      dirtLevel,
      priceMin: price.min,
      priceMax: price.max
    });
  };

  const getPropertyLabel = () => propertyTypes.find(p => p.id === propertyType)?.label || '';
  const getCleaningLabel = () => cleaningTypes.find(c => c.id === cleaningType)?.label || '';

  const progressPercent = showResult ? 100 : Math.round((step / totalSteps) * 100);

  // Subscription savings calculation (new for 2026)
  const monthlyPrice = price.min;
  const subscriptionSavings = Math.round(monthlyPrice * 0.15);

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-white" ref={calculatorRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            ИИ-калькулятор • Актуальные цены 2026
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Калькулятор стоимости уборки
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Ответьте на 6 вопросов и получите точный расчёт с рекомендациями ИИ
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-2xl shadow-gray-200/50">
          {/* Progress bar */}
          {!showResult && (
            <div className="mb-8">
              {/* Step indicators */}
              <div className="hidden sm:flex justify-between mb-4">
                {stepLabels.map((label, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col items-center flex-1 ${i < step ? 'opacity-100' : 'opacity-40'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1 transition-all ${
                      i + 1 === step 
                        ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-200' 
                        : i + 1 < step 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {i + 1 < step ? '✓' : stepIcons[i]}
                    </div>
                    <span className={`text-xs font-medium ${i + 1 === step ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Mobile progress */}
              <div className="sm:hidden flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stepIcons[step - 1]}</span>
                  <span className="font-medium text-gray-900">{stepLabels[step - 1]}</span>
                </div>
                <span className="text-sm font-semibold text-emerald-600">
                  {step} / {totalSteps}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className={`min-h-[320px] transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            {!showResult ? (
              <>
                {/* Step 1: Property Type */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Какой тип помещения нужно убрать?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {propertyTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setPropertyType(type.id)}
                          className={`group p-6 rounded-2xl border-2 transition-all hover-scale ${
                            propertyType === type.id
                              ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                              : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                          }`}
                        >
                          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{type.icon}</div>
                          <div className="font-semibold text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Cleaning Type - Updated for 2026 with tooltips */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Какой тип уборки нужен?</h3>
                    <p className="text-sm text-gray-500">💡 Нажмите на "?" чтобы узнать подробнее</p>
                    <div className="space-y-3">
                      {cleaningTypes.map((type) => (
                        <div key={type.id} className="relative">
                          <button
                            onClick={() => setCleaningType(type.id)}
                            className={`group w-full p-5 rounded-2xl border-2 transition-all text-left flex items-start gap-4 hover-scale ${
                              cleaningType === type.id
                                ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                                : 'border-gray-200 bg-white hover:border-emerald-300'
                            }`}
                          >
                            <div className="text-4xl group-hover:scale-110 transition-transform">{type.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{type.label}</span>
                                {type.isNew && (
                                  <span className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                                    NEW 2026
                                  </span>
                                )}
                                {type.tooltip && (
                                  <span 
                                    className="w-5 h-5 bg-gray-200 hover:bg-emerald-200 rounded-full flex items-center justify-center text-xs text-gray-500 hover:text-emerald-700 cursor-help transition-colors"
                                    title={type.tooltip}
                                  >
                                    ?
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{type.desc}</div>
                              <div className="flex gap-4 mt-2">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">⏱ {type.time}</span>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{type.price}</span>
                              </div>
                              {/* Expanded tooltip on selection */}
                              {cleaningType === type.id && type.tooltip && (
                                <div className="mt-3 p-3 bg-white border border-emerald-200 rounded-lg text-xs text-gray-600">
                                  💡 {type.tooltip}
                                </div>
                              )}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Area */}
                {step === 3 && (
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-gray-900">Какая площадь помещения?</h3>
                    <div className="text-center py-6">
                      <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
                        <span className="text-7xl font-bold">{area}</span>
                        <span className="text-3xl font-medium text-gray-400">м²</span>
                      </div>
                    </div>
                    <div className="px-4">
                      <input
                        type="range"
                        min="20"
                        max="300"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                        style={{ '--value': `${((area - 20) / (300 - 20)) * 100}%` } as React.CSSProperties}
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>20 м²</span>
                        <span>300 м²</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-3">
                      {[30, 50, 80, 120, 200].map((size) => (
                        <button
                          key={size}
                          onClick={() => setArea(size)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            area === size 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-emerald-100'
                          }`}
                        >
                          {size} м²
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Bathrooms - Updated prices 2026 */}
                {step === 4 && (
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-gray-900">Сколько санузлов?</h3>
                    <p className="text-gray-500">Каждый санузел добавляет к стоимости 2 500 — 5 000 ₸</p>
                    <div className="flex items-center justify-center gap-8">
                      <button
                        onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}
                        className="w-16 h-16 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600 transition-all hover:scale-105 active:scale-95"
                      >
                        −
                      </button>
                      <div className="text-center">
                        <span className="text-7xl font-bold gradient-text">{bathrooms}</span>
                        <span className="block text-gray-500 mt-1">санузл{bathrooms === 1 ? '' : bathrooms >= 2 && bathrooms <= 4 ? 'а' : 'ов'}</span>
                      </div>
                      <button
                        onClick={() => setBathrooms(Math.min(6, bathrooms + 1))}
                        className="w-16 h-16 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600 transition-all hover:scale-105 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 5: Windows - Updated prices 2026 */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Нужно мытьё окон?</h3>
                    <p className="text-gray-500">Добавляет к стоимости 2 000 — 5 000 ₸</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setWindows(true)}
                        className={`group p-8 rounded-2xl border-2 transition-all hover-scale ${
                          windows
                            ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-emerald-300'
                        }`}
                      >
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🪟</div>
                        <div className="font-semibold text-gray-900">Да, нужно</div>
                        <div className="text-sm text-gray-500">Помоют окна</div>
                      </button>
                      <button
                        onClick={() => setWindows(false)}
                        className={`group p-8 rounded-2xl border-2 transition-all hover-scale ${
                          !windows
                            ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-emerald-300'
                        }`}
                      >
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">❌</div>
                        <div className="font-semibold text-gray-900">Нет, не нужно</div>
                        <div className="text-sm text-gray-500">Без окон</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 6: Dirt Level */}
                {step === 6 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Степень загрязнения?</h3>
                    <p className="text-gray-500">Сильное загрязнение увеличивает стоимость на 30-50%</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dirtLevels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setDirtLevel(level.id)}
                          className={`group p-6 rounded-2xl border-2 transition-all text-left hover-scale ${
                            dirtLevel === level.id
                              ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{level.emoji}</div>
                          <div className="font-semibold text-gray-900">{level.label}</div>
                          <div className="text-sm text-gray-500">{level.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      step === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                      canProceed()
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-200 hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {step === totalSteps ? (
                      <>
                        Рассчитать
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Далее
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Result - Updated for 2026 */
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-4 shadow-lg shadow-emerald-200 animate-bounce-soft">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Расчёт готов! 🎉</h3>
                  <p className="text-gray-600">
                    {getCleaningLabel()} уборка {getPropertyLabel().toLowerCase()}а {area} м²
                  </p>
                </div>

                {/* Price card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="text-center mb-4">
                    <div className="text-sm opacity-80 mb-2">Примерная стоимость 2026</div>
                    <div className="text-4xl sm:text-5xl font-bold">
                      {price.min.toLocaleString()} — {price.max.toLocaleString()} ₸
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 text-sm opacity-90">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {time.min}-{time.max} часов
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      1-2 человека
                    </div>
                  </div>
                </div>

                {/* Subscription offer - NEW 2026 */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                      🔄
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        Подписка на уборку
                        <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">NEW 2026</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Экономия до <span className="font-bold text-purple-600">{subscriptionSavings.toLocaleString()} ₸</span> в месяц при регулярных заказах
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">-20%</div>
                      <div className="text-xs text-gray-500">скидка</div>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <strong className="text-gray-800">Почему диапазон цен?</strong>
                  <p className="mt-1">Конечная стоимость зависит от исполнителя, используемых средств (эко/обычные) и фактического состояния помещения.</p>
                </div>

                {/* Checklist */}
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    Что уточнить у исполнителя
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-900">
                    {[
                      'Сколько человек приедет?',
                      'Какое время займёт?',
                      'Свои эко-средства или обычные?',
                      'Есть ли онлайн-оплата Kaspi?',
                      'Гарантия и возможность переделки?'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-amber-200 rounded flex items-center justify-center text-amber-700 text-xs">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    ИИ рекомендует добавить
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {!windows && <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">🪟 Мытьё окон</span>}
                    {cleaningType !== 'eco' && <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">🌿 Эко-средства</span>}
                    <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">🛋️ Химчистка мебели</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">🔄 Подписка -20%</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSubmitRequest}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-200 hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Получить предложения
                  </button>
                  <button
                    onClick={handleBack}
                    className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Пересчитать
                  </button>
                </div>

                {/* Download/Share buttons - Added based on focus group feedback */}
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => {
                      const text = `Расчёт уборки CleanAlmaty 2026\n\n${getCleaningLabel()} уборка ${getPropertyLabel()}а\nПлощадь: ${area} м²\nСанузлов: ${bathrooms}\nОкна: ${windows ? 'Да' : 'Нет'}\n\nСтоимость: ${price.min.toLocaleString()} — ${price.max.toLocaleString()} ₸\nВремя: ${time.min}-${time.max} часов\n\nПодробнее: cleanalmaty.kz`;
                      navigator.clipboard.writeText(text);
                      alert('Расчёт скопирован! Можете отправить в WhatsApp или Telegram');
                    }}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Скопировать расчёт
                  </button>
                  <button
                    onClick={() => {
                      const text = `Расчёт уборки: ${getCleaningLabel()} ${area}м² = ${price.min.toLocaleString()}-${price.max.toLocaleString()}₸`;
                      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                    }}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <span>📱</span>
                    Отправить в WhatsApp
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500">
                  🔒 Бесплатно, без обязательств • Ответ за 1-2 часа • Kaspi QR оплата
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
