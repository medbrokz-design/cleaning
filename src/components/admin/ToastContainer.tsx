import { useNotificationStore } from '../../store/notificationStore';

export function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-6 py-3 rounded-xl shadow-2xl text-white font-medium animate-slide-in flex items-center gap-3 min-w-[300px] ${
            n.type === 'success' ? 'bg-emerald-600' : 
            n.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
          }`}
        >
          <span>{n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : 'ℹ️'}</span>
          <p className="flex-1">{n.message}</p>
          <button onClick={() => removeNotification(n.id)} className="opacity-70 hover:opacity-100">×</button>
        </div>
      ))}
    </div>
  );
}
