import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';

interface Review {
  id: string;
  requestId: string;
  executorId: string;
  clientName: string;
  rating: number;
  text: string;
  isPublished: boolean;
  moderatedAt?: string;
  createdAt: string;
}

export function AdminReviews() {
  const { executors } = useAdminStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all');
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      requestId: '1003',
      executorId: '1',
      clientName: 'Марат С.',
      rating: 5,
      text: 'Отличная работа! Дом после ремонта сияет чистотой. Рекомендую!',
      isPublished: true,
      moderatedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'r2',
      requestId: '999',
      executorId: '2',
      clientName: 'Гульнара М.',
      rating: 5,
      text: 'Заказывала эко-уборку. Очень довольна - безопасно для ребенка-аллергика.',
      isPublished: true,
      moderatedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'r3',
      requestId: '998',
      executorId: '3',
      clientName: 'Арман К.',
      rating: 4,
      text: 'Хорошая уборка, но немного задержались. В целом рекомендую.',
      isPublished: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'r4',
      requestId: '997',
      executorId: '1',
      clientName: 'Айжан Б.',
      rating: 5,
      text: 'Пользуемся подпиской уже 3 месяца. Всегда приходят вовремя, убирают тщательно.',
      isPublished: false,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ]);

  const filteredReviews = filter === 'all'
    ? reviews
    : filter === 'pending'
      ? reviews.filter(r => !r.isPublished)
      : reviews.filter(r => r.isPublished);

  const pendingCount = reviews.filter(r => !r.isPublished).length;
  const publishedCount = reviews.filter(r => r.isPublished).length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const handleModerate = (id: string, publish: boolean) => {
    setReviews(prev => prev.map(r =>
      r.id === id ? { ...r, isPublished: publish, moderatedAt: new Date().toISOString() } : r
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить отзыв?')) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Всего отзывов</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-200 bg-amber-50/30">
          <p className="text-sm text-amber-700">На модерации</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-200 bg-green-50/30">
          <p className="text-sm text-green-700">Опубликовано</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Средний рейтинг</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">
            <span className="text-amber-400">&#9733;</span> {avgRating}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Все', count: reviews.length },
            { id: 'pending', label: 'На модерации', count: pendingCount },
            { id: 'published', label: 'Опубликованы', count: publishedCount },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                filter === f.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filter === f.id ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(review => {
          const executor = executors.find(e => e.id === review.executorId);
          return (
            <div
              key={review.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                !review.isPublished ? 'border-amber-200 bg-amber-50/20' : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold">
                    {review.clientName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{review.clientName}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-amber-400' : 'text-gray-200'}>
                            &#9733;
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Исполнитель: {executor?.name || 'Неизвестен'}
                      {' '}&middot;{' '}
                      {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium self-start ${
                  review.isPublished
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {review.isPublished ? 'Опубликован' : 'На модерации'}
                </span>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{review.text}</p>

              <div className="flex flex-wrap gap-2">
                {!review.isPublished && (
                  <>
                    <button
                      onClick={() => handleModerate(review.id, true)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Опубликовать
                    </button>
                    <button
                      onClick={() => handleModerate(review.id, false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                    >
                      Отклонить
                    </button>
                  </>
                )}
                {review.isPublished && (
                  <button
                    onClick={() => handleModerate(review.id, false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    Снять с публикации
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          );
        })}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-lg mb-2">Нет отзывов</p>
            <p className="text-sm text-gray-400">Отзывы появятся после выполнения заказов</p>
          </div>
        )}
      </div>
    </div>
  );
}
