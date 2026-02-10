import { useState } from 'react';
import { useAdminStore, District } from '../../store/adminStore';
import { useNotificationStore } from '../../store/notificationStore';

export function AdminDistricts() {
  const { districts, updateDistrict, toggleDistrictActive } = useAdminStore();
  const { addNotification } = useNotificationStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<District>>({});

  const totalExtra = districts.reduce((sum: number, d: District) => sum + (d.extra_charge || 0), 0);
  const activeCount = districts.filter((d: District) => d.is_active).length;

  const handleSave = async (id: string) => {
    await updateDistrict(id, editForm);
    setEditingId(null);
    addNotification('Район обновлен', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Районов</p>
          <p className="text-2xl font-bold">{districts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Активных зон</p>
          <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Ср. доплата</p>
          <p className="text-2xl font-bold text-blue-600">{Math.round(totalExtra / (districts.length || 1))} ₸</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {districts.map((d: District) => (
          <div key={d.id} className={`bg-white p-6 rounded-2xl border transition-all ${d.is_active ? 'border-gray-100' : 'border-red-100 bg-red-50/10'}`}>
            {editingId === d.id ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={editForm.name || ''} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-2 border rounded-lg font-bold"
                />
                <input 
                  type="number" 
                  value={editForm.extra_charge || 0} 
                  onChange={e => setEditForm({...editForm, extra_charge: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Доплата за выезд"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(d.id)} className="flex-1 py-2 bg-emerald-500 text-white rounded-lg font-bold">Сохранить</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-gray-100 rounded-lg">Отмена</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{d.name}</h3>
                    <p className="text-xs text-gray-500">{d.areas.slice(0, 3).join(', ')}...</p>
                  </div>
                  <button onClick={() => toggleDistrictActive(d.id)} className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${d.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {d.is_active ? 'Активен' : 'Откл'}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="text-sm text-emerald-600 font-bold">Выезд: +{d.extra_charge} ₸</span>
                  <button onClick={() => { setEditingId(d.id); setEditForm(d); }} className="text-xs text-gray-400 hover:text-emerald-600 font-bold">⚙️ Настроить</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}