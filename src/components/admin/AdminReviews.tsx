import { useAdminStore } from '../../store/adminStore';

export function AdminReviews() {
  const { reviews, toggleReviewPublished, deleteReview } = useAdminStore();

  return (
    <div className="space-y-4">
      {reviews.map(rev => (
        <div key={rev.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold">{rev.client_name}</h4>
            <span className={`px-2 py-1 rounded text-[10px] font-bold ${rev.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {rev.is_published ? 'Опубликован' : 'Черновик'}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{rev.text}</p>
          <div className="flex gap-2">
            <button onClick={() => toggleReviewPublished(rev.id, !rev.is_published)} className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold">
              {rev.is_published ? 'Снять' : 'Опубликовать'}
            </button>
            <button onClick={() => { if(confirm('Удалить?')) deleteReview(rev.id); }} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold">Удалить</button>
          </div>
        </div>
      ))}
    </div>
  );
}