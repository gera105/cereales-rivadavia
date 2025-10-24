import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  info: <Info className="text-blue-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
};

const bgColors = {
  success: 'bg-green-50',
  error: 'bg-red-50',
  info: 'bg-blue-50',
  warning: 'bg-yellow-50',
};

const textColors = {
  success: 'text-green-800',
  error: 'text-red-800',
  info: 'text-blue-800',
  warning: 'text-yellow-800',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-24 right-4 z-[100] w-full max-w-sm space-y-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            ${bgColors[toast.type]}
            ${textColors[toast.type]}
            flex items-start p-4 rounded-lg shadow-lg
            animate-fade-in-right
          `}
        >
          <div className="flex-shrink-0">{icons[toast.type]}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 flex-shrink-0 rounded-md p-1 inline-flex text-current opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <span className="sr-only">Close</span>
            <X size={16} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
