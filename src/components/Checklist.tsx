import { useState } from 'react';

export function Checklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const checklistItems = [
    {
      category: 'До заказа',
      icon: '📋',
      color: 'emerald',
      items: [
        { id: '1-1', text: 'Уточните точную стоимость со всеми услугами' },
        { id: '1-2', text: 'Спросите, что именно входит в уборку' },
        { id: '1-3', text: 'Узнайте про возможные доплаты' },
        { id: '1-4', text: 'Поинтересуйтесь опытом и отзывами' }
      ]
    },
    {
      category: 'Организация',
      icon: '📅',
      color: 'blue',
      items: [
        { id: '2-1', text: 'Сколько человек приедет на уборку?' },
        { id: '2-2', text: 'Какое время займёт работа?' },
        { id: '2-3', text: 'Нужен ли доступ к воде и электричеству?' },
        { id: '2-4', text: 'Можно ли заказать на выходные?' }
      ]
    },
    {
      category: 'Инвентарь',
      icon: '🧹',
      color: 'purple',
      items: [
        { id: '3-1', text: 'Клинеры привозят свои средства?' },
        { id: '3-2', text: 'Какую химию используют?' },
        { id: '3-3', text: 'Есть ли гипоаллергенные средства?' },
        { id: '3-4', text: 'Используют ли профессиональное оборудование?' }
      ]
    },
    {
      category: 'Гарантии',
      icon: '🛡️',
      color: 'amber',
      items: [
        { id: '4-1', text: 'Есть ли гарантия на работу?' },
        { id: '4-2', text: 'Что будет, если результат не устроит?' },
        { id: '4-3', text: 'Какие способы оплаты принимают?' },
        { id: '4-4', text: 'Нужна ли предоплата?' }
      ]
    }
  ];

  const totalItems = checklistItems.reduce((acc, section) => acc + section.items.length, 0);
  const checkedCount = checkedItems.size;
  const progress = Math.round((checkedCount / totalItems) * 100);

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const handleDownload = () => {
    const content = checklistItems.map(section => 
      `${section.icon} ${section.category}:\n${section.items.map(item => `☐ ${item.text}`).join('\n')}`
    ).join('\n\n');
    
    const blob = new Blob([`ЧЕК-ЛИСТ: ЧТО УТОЧНИТЬ У КЛИНЕРА\n${'='.repeat(40)}\n\n${content}\n\n${'='.repeat(40)}\nСкачано с CleanAlmaty.kz`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checklist-cleaning.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    const content = checklistItems.map(section => 
      `${section.icon} ${section.category}:\n${section.items.map(item => `☐ ${item.text}`).join('\n')}`
    ).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(content);
      alert('Чек-лист скопирован в буфер обмена!');
    } catch {
      alert('Не удалось скопировать. Попробуйте скачать файл.');
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; light: string }> = {
      emerald: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700', light: 'bg-emerald-50' },
      blue: { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-700', light: 'bg-blue-50' },
      purple: { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-700', light: 'bg-purple-50' },
      amber: { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700', light: 'bg-amber-50' }
    };
    return colors[color] || colors.emerald;
  };

  return (
    <section id="checklist" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Полезный инструмент
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Чек-лист: что уточнить у исполнителя
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Используйте при общении с клинером, чтобы ничего не забыть
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-gray-100 rounded-full p-1">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-sm font-medium text-gray-700">
                Отмечено: {checkedCount} из {totalItems}
              </span>
              <span className="text-sm font-semibold text-emerald-600">{progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {progress === 100 && (
            <div className="text-center mt-4 text-emerald-600 font-medium animate-bounce-soft">
              🎉 Отлично! Вы готовы к общению с клинером!
            </div>
          )}
        </div>

        {/* Checklist grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {checklistItems.map((section, sectionIndex) => {
            const colors = getColorClasses(section.color);
            const sectionChecked = section.items.filter(item => checkedItems.has(item.id)).length;
            
            return (
              <div 
                key={sectionIndex} 
                className={`${colors.light} rounded-2xl p-6 border ${colors.border} transition-all hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center text-xl`}>
                      {section.icon}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{section.category}</h3>
                  </div>
                  <span className={`text-sm font-medium ${colors.text}`}>
                    {sectionChecked}/{section.items.length}
                  </span>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={checkedItems.has(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="sr-only peer"
                          />
                          <div className={`w-6 h-6 border-2 rounded-lg transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-500 ${
                            checkedItems.has(item.id) 
                              ? 'bg-emerald-500 border-emerald-500' 
                              : 'bg-white border-gray-300 group-hover:border-emerald-400'
                          }`}>
                            {checkedItems.has(item.id) && (
                              <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className={`text-gray-700 transition-all ${
                          checkedItems.has(item.id) ? 'line-through text-gray-400' : 'group-hover:text-gray-900'
                        }`}>
                          {item.text}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Скачать чек-лист
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Скопировать
          </button>
          <button
            onClick={() => setCheckedItems(new Set())}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-3 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Сбросить
          </button>
        </div>

        {/* Tip */}
        <p className="text-center text-sm text-gray-500 mt-6">
          💡 Совет: отправьте этот чек-лист исполнителю в мессенджере перед встречей
        </p>
      </div>
    </section>
  );
}
