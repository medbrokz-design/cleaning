import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';

export function AdminDistricts() {
  const { districts, updateDistrict, toggleDistrictActive } = useAdminStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSaveExtraCharge = (id: string, value: number) => {
    updateDistrict(id, { extraCharge: value });
    setEditingId(null);
  };

  const totalExecutors = districts.reduce((sum, d) => sum + d.executorsCount, 0);
  const activeDistricts = districts.filter(d => d.isActive).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">📍</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{districts.length}</p>
              <p className="text-sm text-gray-500">Всего районов</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeDistricts}</p>
              <p className="text-sm text-gray-500">Активных районов</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalExecutors}</p>
              <p className="text-sm text-gray-500">Исполнителей всего</p>
            </div>
          </div>
        </div>
      </div>

      {/* Districts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Районы Алматы</h3>
          <p className="text-sm text-gray-500">Управление зонами обслуживания и доплатами за выезд</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Район</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Микрорайоны</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Исполнителей</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Доплата за выезд</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Статус</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((district) => (
                <tr key={district.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  !district.isActive ? 'bg-red-50/30' : ''
                }`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        district.isActive ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        📍
                      </div>
                      <span className="font-medium text-gray-900">{district.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {district.areas.slice(0, 3).map((area, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {area}
                        </span>
                      ))}
                      {district.areas.length > 3 && (
                        <span className="text-xs text-gray-400">+{district.areas.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      district.executorsCount > 20 
                        ? 'bg-green-100 text-green-700'
                        : district.executorsCount > 10
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {district.executorsCount}
                      <span className="text-xs opacity-70">чел.</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {editingId === district.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          defaultValue={district.extraCharge}
                          onBlur={(e) => handleSaveExtraCharge(district.id, parseInt(e.target.value) || 0)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveExtraCharge(district.id, parseInt((e.target as HTMLInputElement).value) || 0);
                            }
                          }}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm focus:border-emerald-500 outline-none"
                          autoFocus
                        />
                        <span className="text-sm text-gray-500">₸</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingId(district.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          district.extraCharge > 0
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {district.extraCharge > 0 ? `+${district.extraCharge.toLocaleString()} ₸` : 'Бесплатно'}
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      district.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {district.isActive ? 'Активен' : 'Отключён'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => toggleDistrictActive(district.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        district.isActive
                          ? 'bg-red-100 hover:bg-red-200 text-red-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {district.isActive ? 'Отключить' : 'Включить'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Карта покрытия</h3>
        <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <span className="text-4xl block mb-2">🗺️</span>
            <p>Интерактивная карта районов</p>
            <p className="text-sm">(интеграция с 2GIS/Google Maps)</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Доплата за выезд</h4>
            <p className="text-sm text-amber-700">
              Для отдалённых районов (Алатауский, Наурызбайский) можно установить доплату за выезд. 
              Она будет добавлена к расчёту калькулятора и показана клиенту.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
