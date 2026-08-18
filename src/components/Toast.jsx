import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up select-none">
      <div className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-md text-xs font-medium ${
        isError 
          ? 'bg-rose-950/90 text-rose-200 border-rose-800/80 shadow-rose-950/40' 
          : isInfo
          ? 'bg-surface-900/95 text-slate-200 border-surface-700/80'
          : 'bg-emerald-950/90 text-emerald-100 border-emerald-700/80 shadow-emerald-950/40'
      }`}>
        {isError ? (
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
        ) : isInfo ? (
          <Info className="w-4 h-4 text-brand-400 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        )}

        <div className="flex-1">
          <span>{toast.message}</span>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:opacity-75 transition-opacity text-slate-400"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
