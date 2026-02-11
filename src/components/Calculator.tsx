import { useState, useEffect, useRef } from 'react';
import { useAdminStore } from '../store/adminStore';

interface CalculatorProps {
  onSubmit: (data: any) => void;
}

const propertyTypes = [
  { id: 'apartment', label: 'Квартира', icon: '🏢', desc: 'Для жилых квартир' },
  { id: 'house', label: 'Частный дом', icon: '🏡', desc: 'Коттеджи и таунхаусы' },
  { id: 'office', label: 'Офис', icon: '💼', desc: 'Бизнес-пространства' }
];

const cleaningTypes = (prices: any) => [
  { id: 'regular', label: 'Поддерживающая', icon: '✨', price: prices.regular, desc: 'Легкая уборка для поддержания чистоты' },
  { id: 'deep', label: 'Генеральная', icon: '🧼', price: prices.deep, desc: 'Глубокая очистка всех поверхностей' },
  { id: 'post-renovation', label: 'После ремонта', icon: '🔨', price: prices.postRenovation, desc: 'Удаление строительной пыли и следов краски' },
  { id: 'eco', label: 'Эко-уборка', icon: '🌿', price: prices.eco, desc: 'Био-средства, безопасно для детей' }
];

const upsellServices = [
  { id: 'fridge', label: 'Холодильник', price: 3500, icon: '🧊' },
  { id: 'oven', label: 'Духовка', price: 3000, icon: '🍳' },
  { id: 'sofa', label: 'Диван', price: 12000, icon: '🛋️' },
  { id: 'windows_full', label: 'Все окна', price: 8000, icon: '🪟' },
];

export function Calculator({ onSubmit }: CalculatorProps) {
  const { prices } = useAdminStore();
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState('apartment');
  const [cleaningType, setCleaningType] = useState('regular');
  const [area, setArea] = useState(50);
  const [bathrooms, setBathrooms] = useState(1);
  const [windows, setWindows] = useState(false);
  const [dirtLevel, setDirtLevel] = useState('normal');
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);

  const totalSteps = 6;

  const calculatePrice = () => {
    const types = cleaningTypes(prices);
    const selected = types.find(t => t.id === cleaningType) || types[0];
    let base = selected.price;
    
    let multiplier = propertyType === 'house' ? 1.2 : propertyType === 'office' ? 0.9 : 1;
    let total = area * base * multiplier;
    
    total += bathrooms * prices.bathroom.min;
    if (windows) total += prices.windows.min;
    
    selectedUpsells.forEach(id => {
      const s = upsellServices.find(item => item.id === id);
      if (s) total += s.price;
    });

    if (dirtLevel === 'heavy') total *= prices.heavyDirtModifier;
    
    return {
      min: Math.round(total / 500) * 500,
      max: Math.round((total * 1.3) / 500) * 500
    };
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      import('../store/apiService').then(({ AnalyticsService }) => {
        AnalyticsService.trackEvent('calculator', 'step_complete', `step_${step}`);
      });
    } else {
      setShowResult(true);
      import('../store/apiService').then(({ AnalyticsService }) => {
        AnalyticsService.trackEvent('calculator', 'result_shown');
      });
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleUpsell = (id: string) => {
    setSelectedUpsells(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const result = calculatePrice();

  return (
    <section id="calculator" className="py-20 bg-slate-50/50" ref={calculatorRef}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Узнайте стоимость за 10 секунд</h2>
          <p className="text-slate-500 font-medium">Ответьте на несколько вопросов — наш ИИ подберет лучший тариф</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar / Progress */}
          <div className="w-full md:w-1/3 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between">
            <div>
              <div className="text-emerald-400 font-bold mb-8 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center">✨</span>
                Шаг {step} из {totalSteps}
              </div>
              <h3 className="text-3xl font-bold mb-4 leading-tight">
                {step === 1 && "Что будем убирать?"}
                {step === 2 && "Какой тип уборки нужен?"}
                {step === 3 && "Укажите площадь"}
                {step === 4 && "Санузлы и окна"}
                {step === 5 && "Дополнительно"}
                {step === 6 && "Степень загрязнения"}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ваш выбор помогает нам точнее рассчитать время и количество клинеров.
              </p>
            </div>

            <div className="mt-12">
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-700 ease-out" 
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white relative">
            {!showResult ? (
              <div className="animate-fade-in space-y-8">
                
                {/* Step 1: Property */}
                {step === 1 && (
                  <div className="grid grid-cols-1 gap-4">
                    {propertyTypes.map(t => (
                      <button key={t.id} onClick={() => { setPropertyType(t.id); nextStep(); }} className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left group ${propertyType === t.id ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                        <span className="text-4xl group-hover:scale-110 transition-transform">{t.icon}</span>
                        <div>
                          <p className="font-bold text-slate-900">{t.label}</p>
                          <p className="text-xs text-slate-400">{t.desc}</p>
                        </div>
                        <span className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${propertyType === t.id ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
                          {propertyType === t.id && <span className="w-2 h-2 bg-white rounded-full"></span>}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Cleaning Type */}
                {step === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cleaningTypes(prices).map(t => (
                      <button key={t.id} onClick={() => { setCleaningType(t.id); nextStep(); }} className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col group ${cleaningType === t.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                        <span className="text-3xl mb-4 group-hover:rotate-12 transition-transform">{t.icon}</span>
                        <p className="font-bold text-slate-900 mb-1">{t.label}</p>
                        <p className="text-[10px] text-slate-400 mb-4 flex-1">{t.desc}</p>
                        <p className="text-emerald-600 font-black">от {t.price} ₸/м²</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Area */}
                {step === 3 && (
                  <div className="space-y-12 py-10">
                    <div className="text-center">
                      <span className="text-8xl font-black text-slate-900 tracking-tighter">{area}</span>
                      <span className="text-2xl font-bold text-emerald-500 ml-2">м²</span>
                    </div>
                    <input 
                      type="range" min="20" max="250" value={area} 
                      onChange={(e) => setArea(parseInt(e.target.value))} 
                      className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-500" 
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-300 px-2 uppercase tracking-widest">
                      <span>20 м²</span>
                      <span>250 м²</span>
                    </div>
                  </div>
                )}

                {/* Step 4: Bathrooms & Windows */}
                {step === 4 && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">🚿</span>
                        <div>
                          <p className="font-bold text-slate-900">Санузлы</p>
                          <p className="text-xs text-slate-400">Количество комнат</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setBathrooms(Math.max(1, bathrooms-1))} className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center font-bold text-slate-600">-</button>
                        <span className="text-xl font-black w-4 text-center">{bathrooms}</span>
                        <button onClick={() => setBathrooms(Math.min(5, bathrooms+1))} className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center font-bold text-slate-600">+</button>
                      </div>
                    </div>
                    <button onClick={() => setWindows(!windows)} className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${windows ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100'}`}>
                      <span className="text-3xl">🪟</span>
                      <div className="text-left flex-1">
                        <p className="font-bold text-slate-900">Помыть окна?</p>
                        <p className="text-xs text-slate-400">С двух сторон, включая рамы</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-all relative ${windows ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${windows ? 'left-7' : 'left-1'}`} />
                      </div>
                    </button>
                  </div>
                )}

                {/* Step 5: Upsells */}
                {step === 5 && (
                  <div className="grid grid-cols-2 gap-3">
                    {upsellServices.map(s => (
                      <button key={s.id} onClick={() => toggleUpsell(s.id)} className={`p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-3 ${selectedUpsells.includes(s.id) ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100'}`}>
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <p className="font-bold text-[11px] leading-tight mb-1">{s.label}</p>
                          <p className="text-[10px] text-emerald-600 font-bold">+{s.price} ₸</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 6: Dirt */}
                {step === 6 && (
                  <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => { setDirtLevel('normal'); nextStep(); }} className={`p-6 rounded-3xl border-2 flex items-center gap-4 ${dirtLevel === 'normal' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100'}`}>
                      <span className="text-3xl">👌</span>
                      <div className="text-left">
                        <p className="font-bold">Обычная грязь</p>
                        <p className="text-xs text-slate-400">Стандартная запыленность</p>
                      </div>
                    </button>
                    <button onClick={() => { setDirtLevel('heavy'); nextStep(); }} className={`p-6 rounded-3xl border-2 flex items-center gap-4 ${dirtLevel === 'heavy' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100'}`}>
                      <span className="text-3xl">😱</span>
                      <div className="text-left">
                        <p className="font-bold">Сильное загрязнение</p>
                        <p className="text-xs text-slate-400">Жир на кухне, водный камень, пятна</p>
                      </div>
                    </button>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-8">
                  {step > 1 && (
                    <button onClick={prevStep} className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Назад</button>
                  )}
                  {[3, 4, 5].includes(step) && (
                    <button onClick={nextStep} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200">Далее</button>
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-fade-in-up text-center space-y-8">
                <div className="inline-block p-4 bg-emerald-50 rounded-full mb-2">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">✓</div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 mb-2">Ваш расчет готов</h3>
                  <p className="text-slate-400 font-medium">Предложение актуально только в течение 15 минут</p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                  <div className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Приблизительная стоимость</div>
                  <div className="text-5xl font-black text-emerald-600 tracking-tighter">
                    {result.min.toLocaleString()} — {result.max.toLocaleString()} ₸
                  </div>
                </div>

                <button 
                  onClick={() => onSubmit({ ...result, propertyType, cleaningType, area, selectedUpsells })} 
                  className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black text-xl shadow-2xl shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-95"
                >
                  ЗАБРОНИРОВАТЬ СО СКИДКОЙ
                </button>
                
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Бесплатно • Без предоплаты • Kaspi QR</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
