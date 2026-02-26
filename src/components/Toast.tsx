import React from 'react';
import { Toast } from '../types';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const styles = {
    success: { bg: '#1a3c29', border: '#2d6a4f', icon: <CheckCircle size={15} color="#4ade80" />, color: '#4ade80' },
    error: { bg: '#3c1a1a', border: '#6a2d2d', icon: <XCircle size={15} color="#f87171" />, color: '#f87171' },
    info: { bg: '#1a2a3c', border: '#2d4a6a', icon: <Info size={15} color="#60a5fa" />, color: '#60a5fa' },
  }[toast.type];

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl toast-enter min-w-64 max-w-xs"
      style={{ background: styles.bg, borderColor: styles.border }}
    >
      {styles.icon}
      <span className="flex-1 text-sm" style={{ color: '#cccccc' }}>
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 transition-colors hover:text-white"
        style={{ color: '#858585' }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
