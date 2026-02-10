import { useState, useEffect } from 'react';
import { formatPhoneNumber, isValidPhone, sanitizeText } from '../utils/validators';
import { api } from '../store/apiService'; // Упростил импорт

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorData?: {
    propertyType: string;
    cleaningType: string;
    area: number;
    bathrooms: number;
    windows: boolean;
    dirtLevel: string;
    priceMin: number;
    priceMax: number;
  } | null;
}

export function RequestModal({ isOpen, onClose, calculatorData }: RequestModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    messenger: 'whatsapp',
    address: '',
    date: '',
    time: '',
    comment: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        newErrors.name = 'Укажите ваше имя (минимум 2 символа)';
      }
      if (!isValidPhone(formData.phone)) {
        newErrors.phone = 'Введите корректный номер +7 (7xx) ...';
      }
    }
    
    if (currentStep === 2) {
      if (!formData.address.trim() || formData.address.trim().length < 3) {
        newErrors.address = 'Укажите район или адрес';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 18) {
      setFormData({ ...formData, phone: formatted });
    }
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    setIsLoading(true);
    setErrors({}); // Сброс старых ошибок
    
    try {
      const requestData = {
        name: sanitizeText(formData.name),
        phone: formData.phone,
        messenger: formData.messenger,
        address: sanitizeText(formData.address),
        comment: sanitizeText(formData.comment),
        serviceType: getCleaningLabel(),
        area: calculatorData?.area || 0,
        price_min: calculatorData?.priceMin || 0,
        price_max: calculatorData?.priceMax || 0,
        date: formData.date,
        time: formData.time,
      };

      console.log('Sending request to Supabase:', requestData);
      await api.createRequest(requestData);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Submission failed:', error);
      setErrors({ 
        submit: error.message || 'Ошибка соединения с базой. Проверьте ключи API в Vercel.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setStep(1);
    setFormData({
      name: '', phone: '', messenger: 'whatsapp', address: '', date: '', time: '', comment: ''
    });
    setErrors({});
    onClose();
  };

  const getCleaningLabel = () => {
    const labels: Record<string, string> = {
      regular: 'Поддерживающая',
      deep: 'Генеральная',
      'post-renovation': 'После ремонта',
      eco: 'Эко-уборка'
    };
    return calculatorData?.cleaningType ? labels[calculatorData.cleaningType] || 'Уборка' : 'Уборка';
  };

  const messengerOptions = [
    { id: 'whatsapp', label: 'WhatsApp', icon: '📱' },
    { id: 'telegram', label: 'Telegram', icon: '✈️' },
    { id: 'phone', label: 'Звонок', icon: '📞' }
  ];

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {!isSubmitted ? (
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="bg-emerald-600 px-6 py-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Оставить заявку</h3>
                <p className="text-emerald-100 text-sm">Заполните форму, и мы перезвоним</p>
              </div>

              <div className="p-6 space-y-5">
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ваше имя</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-4 border-2 rounded-2xl outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-emerald-500'}`}
                        placeholder="Александр"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-2 font-bold">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Телефон</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`w-full px-4 py-4 border-2 rounded-2xl outline-none transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-emerald-500'}`}
                        placeholder="+7 (777) 000-00-00"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-2 font-bold">{errors.phone}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {messengerOptions.map((opt) => (
                        <button key={opt.id} onClick={() => setFormData({...formData, messenger: opt.id})} className={`py-3 border-2 rounded-2xl text-[10px] font-black uppercase transition-all ${formData.messenger === opt.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-gray-400'}`}>
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Район или адрес</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full px-4 py-4 border-2 rounded-2xl outline-none transition-all ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-emerald-500'}`}
                        placeholder="Бостандыкский, ул. Абая 10"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-2 font-bold">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="px-4 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-emerald-500" />
                      <select value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="px-4 py-4 border-2 border-gray-100 rounded-2xl outline-none bg-white">
                        <option value="">Любое время</option>
                        <option value="morning">Утро</option>
                        <option value="day">День</option>
                        <option value="evening">Вечер</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Блок вывода ошибки отправки */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-shake">
                    ⚠️ {errors.submit}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  {step > 1 && <button onClick={() => setStep(step-1)} className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs">Назад</button>}
                  {step < 2 ? (
                    <button onClick={handleNextStep} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100">Далее</button>
                  ) : (
                    <button onClick={handleSubmit} disabled={isLoading} className="flex-1 py-4 bg-emerald-600 disabled:bg-gray-200 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : 'Отправить заявку'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-7xl mb-6">✅</div>
              <h3 className="text-2xl font-black mb-2 text-gray-900 uppercase">Готово!</h3>
              <p className="text-gray-500 mb-8 font-medium">Мы получили вашу заявку. <br />Ожидайте звонка в течение 15 минут.</p>
              <button onClick={handleClose} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl">Закрыть</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
