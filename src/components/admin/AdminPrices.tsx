import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';

export function AdminPrices() {
  const { prices, updatePrices } = useAdminStore();
  const [localPrices, setLocalPrices] = useState(prices);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: string, value: number | { min: number; max: number }) => {
    setLocalPrices({ ...localPrices, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePrices(localPrices);
    setHasChanges(false);
    alert('Цены успешно обновлены!');
  };

  const handleReset = () => {
    setLocalPrices(prices);
    setHasChanges(false);
  };

  // Calculate example prices
  const calculateExample = (pricePerM2: number, area: number) => {
    return (pricePerM2 * area).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Управление ценами</h3>
            <p className="text-sm text-gray-500">Актуальные цены 2026 года. Изменения отразятся на калькуляторе.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Сбросить
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Сохранить
            </button>
          </div>
        </div>
      </div>

      {/* Main Prices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regular */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">✨</div>
            <div>
              <h4 className="font-semibold text-gray-900">Поддерживающая уборка</h4>
              <p className="text-sm text-gray-500">Регулярная уборка</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Цена за м² (₸)</label>
              <input
                type="number"
                value={localPrices.regular}
                onChange={(e) => handleChange('regular', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm text-gray-500">Примеры:</p>
              <div className="flex justify-between mt-1">
                <span className="text-sm">50 м²:</span>
                <span className="font-medium">{calculateExample(localPrices.regular, 50)} ₸</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">80 м²:</span>
                <span className="font-medium">{calculateExample(localPrices.regular, 80)} ₸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deep */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🧹</div>
            <div>
              <h4 className="font-semibold text-gray-900">Генеральная уборка</h4>
              <p className="text-sm text-gray-500">Глубокая уборка</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Цена за м² (₸)</label>
              <input
                type="number"
                value={localPrices.deep}
                onChange={(e) => handleChange('deep', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm text-gray-500">Примеры:</p>
              <div className="flex justify-between mt-1">
                <span className="text-sm">50 м²:</span>
                <span className="font-medium">{calculateExample(localPrices.deep, 50)} ₸</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">80 м²:</span>
                <span className="font-medium">{calculateExample(localPrices.deep, 80)} ₸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Renovation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🔨</div>
            <div>
              <h4 className="font-semibold text-gray-900">После ремонта</h4>
              <p className="text-sm text-gray-500">Послестроительная уборка</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Цена за м² (₸)</label>
              <input
                type="number"
                value={localPrices.postRenovation}
                onChange={(e) => handleChange('postRenovation', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm text-gray-500">Примеры:</p>
              <div className="flex justify-between mt-1">
                <span className="text-sm">50 м²:</span>
                <span className="font-medium">{calculateExample(localPrices.postRenovation, 50)} ₸</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">80 м²:</span>
                <span className="font-medium">{calculateExample(localPrices.postRenovation, 80)} ₸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Eco */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200 bg-green-50/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🌿</div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">Эко-уборка</h4>
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">NEW 2026</span>
              </div>
              <p className="text-sm text-gray-500">Био-средства</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Цена за м² (₸)</label>
              <input
                type="number"
                value={localPrices.eco}
                onChange={(e) => handleChange('eco', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-sm text-gray-500">Примеры:</p>
              <div className="flex justify-between mt-1">
                <span className="text-sm">50 м²:</span>
                <span className="font-medium">{calculateExample(localPrices.eco, 50)} ₸</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">80 м²:</span>
                <span className="font-medium">{calculateExample(localPrices.eco, 80)} ₸</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Дополнительные услуги</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bathroom */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🚿</span>
              <span className="font-medium text-gray-900">Санузел</span>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">Мин (₸)</label>
                <input
                  type="number"
                  value={localPrices.bathroom.min}
                  onChange={(e) => handleChange('bathroom', { ...localPrices.bathroom, min: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Макс (₸)</label>
                <input
                  type="number"
                  value={localPrices.bathroom.max}
                  onChange={(e) => handleChange('bathroom', { ...localPrices.bathroom, max: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Windows */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🪟</span>
              <span className="font-medium text-gray-900">Окна</span>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">Мин (₸)</label>
                <input
                  type="number"
                  value={localPrices.windows.min}
                  onChange={(e) => handleChange('windows', { ...localPrices.windows, min: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Макс (₸)</label>
                <input
                  type="number"
                  value={localPrices.windows.max}
                  onChange={(e) => handleChange('windows', { ...localPrices.windows, max: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Furniture */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🛋️</span>
              <span className="font-medium text-gray-900">Химчистка</span>
            </div>
            <div>
              <label className="text-xs text-gray-500">От (₸)</label>
              <input
                type="number"
                value={localPrices.furniture}
                onChange={(e) => handleChange('furniture', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Modifiers */}
          <div className="p-4 bg-amber-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚡</span>
              <span className="font-medium text-gray-900">Множители</span>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">Срочность (×)</label>
                <input
                  type="number"
                  step="0.05"
                  value={localPrices.urgencyModifier}
                  onChange={(e) => handleChange('urgencyModifier', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Сильн. загрязнение (×)</label>
                <input
                  type="number"
                  step="0.05"
                  value={localPrices.heavyDirtModifier}
                  onChange={(e) => handleChange('heavyDirtModifier', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Как работает ценообразование</h4>
            <p className="text-sm text-blue-700">
              Финальная цена = (Площадь × Цена за м²) + (Санузлы × Цена санузла) + Окна + Модификаторы.
              Диапазон цен на сайте показывает мин-макс для разных исполнителей.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
