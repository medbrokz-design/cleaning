import { useState, useEffect } from 'react';
import { sanitizeText } from '../utils/validators';

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

const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  if (numbers.length <= 1) return `+7 (${numbers}`;
  if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`;
  if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
  if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
  return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
};

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
      const phoneNumbers = formData.phone.replace(/\D/g, '');
      if (phoneNumbers.length < 11) {
        newErrors.phone = 'Введите корректный номер телефона';
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
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
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
        propertyType: getPropertyLabel(),
        area: calculatorData?.area || 0,
        bathrooms: calculatorData?.bathrooms || 0,
        windows: calculatorData?.windows || false,
        estimatedPrice: calculatorData ? `${calculatorData.priceMin} - ${calculatorData.priceMax} ₸` : 'По запросу',
        preferredDate: formData.date,
        preferredTime: formData.time,
      };

      await api.createRequest(requestData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting request:', error);
      setErrors({ submit: 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.' });
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
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {!isSubmitted ? (
            <div className="overflow-y-auto max-h-[85vh]">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8 text-white text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Оставить заявку</h3>
                <p className="text-emerald-100 text-sm">
                  Заполните форму, и мы передадим заявку 2-3 исполнителям
                </p>
              </div>

              {/* Progress */}
              <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Шаг {step} из 2</span>
                  <span className="text-sm text-emerald-600 font-semibold">{step * 50}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                    style={{ width: `${step * 50}%` }}
                  />
                </div>
              </div>

              {/* Calculator summary */}
              {calculatorData && (
                <div className="mx-6 mt-4 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">
                      🧮
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-emerald-700">
                        {getPropertyLabel()}, {calculatorData.area} м² — {getCleaningLabel()}
                      </div>
                      <div className="font-semibold text-emerald-800">
                        {calculatorData.priceMin.toLocaleString()} — {calculatorData.priceMax.toLocaleString()} ₸
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                {step === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    {/* Security badge */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        🔒
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-green-800">Ваши данные защищены</div>
                        <div className="text-xs text-green-600">SSL-шифрование • Не передаём третьим лицам</div>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all text-lg ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Как к вам обращаться?"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <span>⚠️</span> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all text-lg ${
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="+7 (___) ___-__-__"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <span>⚠️</span> {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Messenger */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Как удобнее связаться?
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {messengerOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, messenger: option.id })}
                            className={`py-3 px-4 rounded-xl border-2 transition-all text-center ${
                              formData.messenger === option.id
                                ? 'border-emerald-500 bg-emerald-50'
                                : `border-gray-200 ${option.color}`
                            }`}
                          >
                            <span className="text-xl block mb-1">{option.icon}</span>
                            <span className="text-sm font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    {/* Address with autocomplete */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Район или адрес *
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {['Бостандыкский', 'Алмалинский', 'Медеуский', 'Ауэзовский'].map((district) => (
                          <button
                            key={district}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, address: district + ' район' });
                              if (errors.address) setErrors({ ...errors, address: '' });
                            }}
                            className="text-xs bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors"
                          >
                            {district}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                          if (errors.address) setErrors({ ...errors, address: '' });
                        }}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all text-lg ${
                          errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Например: Бостандыкский район"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <span>⚠️</span> {errors.address}
                        </p>
                      )}
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Желаемая дата <span className="text-gray-400 text-xs">(опционально)</span>
                      </label>
                        <input
                          type="date"
                          value={formData.date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Время
                        </label>
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all bg-white"
                        >
                          {timeOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Комментарий <span className="text-gray-400">(необязательно)</span>
                      </label>
                      <textarea
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all resize-none"
                        placeholder="Дополнительные пожелания..."
                      />
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                    >
                      ← Назад
                    </button>
                  )}
                  {step < 2 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                    >
                      Далее →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-400 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Отправка...
                        </>
                      ) : (
                        <>
                          Отправить заявку
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  🔒 Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </div>
            </div>
          ) : (
            /* Success state */
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-6 shadow-lg animate-bounce-soft">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Заявка отправлена! 🎉</h3>
              <p className="text-gray-600 mb-6">
                Мы передали заявку подходящим исполнителям. В течение 2-3 часов с вами свяжутся.
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm">📋</span>
                  Что будет дальше:
                </h4>
                <ul className="space-y-3">
                  {[
                    { num: '1', text: 'Исполнители получат вашу заявку' },
                    { num: '2', text: `Свяжутся через ${formData.messenger === 'whatsapp' ? 'WhatsApp' : formData.messenger === 'telegram' ? 'Telegram' : 'телефон'}` },
                    { num: '3', text: 'Уточнят детали и назовут точную цену' },
                    { num: '4', text: 'Вы выберете лучшее предложение' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {item.num}
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-lg"
              >
                Отлично, понял! 👍
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
