import type { Toast as ToastType } from '../hooks/useToast'

interface ToastContainerProps {
  toasts: ToastType[]
  onRemove: (id: string) => void
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slideUp flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md border
            ${toast.type === 'success'
              ? 'bg-green-100/90 dark:bg-green-900/80 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
              : toast.type === 'error'
                ? 'bg-red-100/90 dark:bg-red-900/80 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
                : 'bg-blue-100/90 dark:bg-blue-900/80 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
            }`}
        >
          <span className="text-lg">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '💡'}
          </span>
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
