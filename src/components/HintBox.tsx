import { useState } from 'react'

interface HintBoxProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function HintBox({ children, defaultOpen = false }: HintBoxProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        open
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50'
          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <span className="text-lg">{open ? '💡' : '💡'}</span>
        <span>{open ? 'Hide hint' : 'Show hint'}</span>
        <span className="ml-auto transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : '' }}>
          ▼
        </span>
      </button>
      {open && (
        <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed animate-slideDown">
          {children}
        </div>
      )}
    </div>
  )
}
