import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const NotificationToast: React.FC = () => {
  const { notification, clearNotification } = useBanking();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <aside
      aria-label="Notification alerts"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full no-print animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm ${
          isSuccess
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
            : isError
            ? 'bg-rose-50/95 border-rose-200 text-rose-900'
            : 'bg-slate-900/95 border-slate-700 text-white'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-600" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400" />}
        </div>
        <div className="flex-1 font-medium leading-relaxed">{notification.message}</div>
        <button
          onClick={clearNotification}
          className="shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
