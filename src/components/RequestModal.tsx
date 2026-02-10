import { useState, useEffect } from 'react';
import { formatPhoneNumber, isValidPhone, sanitizeText } from '../utils/validators';

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
    try {
      const { api } = await import('../store/apiService');
      
      const requestData = {
        name: sanitizeText(formData.name),
        phone: formData.phone,
        messenger: formData.messenger,
        address: sanitizeText(formData.address),
        comment: sanitizeText(formData.comment),
        serviceType: getCleaningLabel(),
        area: calculatorData?.area || 0,
        price_min: calculatorData?.min || 0,
        price_max: calculatorData?.max || 0,
        date: formData.date,
        time: formData.time,
      };

      await api.createRequest(requestData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting request:', error);
      setErrors({ submit: 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setStep(1);
    setFormData({
      name: '',
      phone: '',
      messenger: 'whatsapp',
      address: '',
      date: '',
      time: '',
      comment: ''
    });
    setErrors({});
    onClose();
  };

  const getPropertyLabel = () => {
    const labels: Record<string, string> = {
      apartment: 'Квартира',
      house: 'Дом',
      office: 'Офис'
    };
    return calculatorData?.propertyType ? labels[calculatorData.propertyType] || '' : '';
  };

  const getCleaningLabel = () => {
    const labels: Record<string, string> = {
      regular: 'Поддерживающая',
      deep: 'Генеральная',
      'post-renovation': 'После ремонта'
    };
    return calculatorData?.cleaningType ? labels[calculatorData.cleaningType] || '' : '';
  };

  const messengerOptions = [
    { id: 'whatsapp', label: 'WhatsApp', icon: '📱', color: 'hover:border-green-500 hover:bg-green-50' },
    { id: 'telegram', label: 'Telegram', icon: '✈️', color: 'hover:border-blue-500 hover:bg-blue-50' },
    { id: 'phone', label: 'Звонок', icon: '📞', color: 'hover:border-purple-500 hover:bg-purple-50' }
  ];

  const timeOptions = [
    { value: '', label: 'Любое время' },
    { value: 'morning', label: '🌅 Утро (9-12)' },
    { value: 'afternoon', label: '☀️ День (12-17)' },
    { value: 'evening', label: '🌆 Вечер (17-20)' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full z-10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {!isSubmitted ? (
            <div className="overflow-y-auto max-h-[85vh]">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Оставить заявку</h3>
                <p className="text-emerald-100 text-sm">Заполните форму, и мы подберем лучших клинеров</p>
              </div>

              <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Шаг {step} из 2</span>
                  <span className="text-sm text-emerald-600 font-semibold">{step * 50}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${step * 50}%` }} />
                </div>
              </div>

              <div className="p-6 space-y-5">
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ваше имя *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-emerald-500 outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder="Как к вам обращаться?"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-emerald-500 outline-none transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder="+7 (___) ___-__-__"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Мессенджер для связи</label>
                      <div className="grid grid-cols-3 gap-2">
                        {messengerOptions.map((opt) => (
                          <button key={opt.id} onClick={() => setFormData({...formData, messenger: opt.id})} className={`py-2 border-2 rounded-xl text-xs font-bold transition-all ${formData.messenger === opt.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-gray-500'}`}>
                            {opt.icon} {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Район или адрес *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-emerald-500 outline-none transition-all ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder="Например: Бостандыкский район"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="px-4 py-3 border-2 border-gray-200 rounded-xl outline-none" />
                      <select value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="px-4 py-3 border-2 border-gray-200 rounded-xl outline-none bg-white">
                        {timeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-6">
                  {step > 1 && <button onClick={() => setStep(step-1)} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold">Назад</button>}
                  {step < 2 ? (
                    <button onClick={handleNextStep} className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold shadow-lg">Далее</button>
                  ) : (
                    <button onClick={handleSubmit} disabled={isLoading} className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                      {isLoading ? 'Отправка...' : 'Отправить'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="text-6xl mb-4 text-emerald-500">🎉</div>
              <h3 className="text-2xl font-bold mb-2">Заявка принята!</h3>
              <p className="text-gray-600 mb-6">Мы уже ищем исполнителей. Свяжемся с вами в течение часа.</p>
              <button onClick={handleClose} className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold shadow-lg">Отлично!</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}