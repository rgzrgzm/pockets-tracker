import { useState } from 'react'
import { EXPENSE_CATEGORIES } from '../types'

interface CategoryPickerProps {
  value: string
  onChange: (category: string) => void
}

export default function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const [custom, setCustom] = useState(false)
  const isCustom = !EXPENSE_CATEGORIES.some((c) => c.label === value) && value !== ''

  function handleSelect(label: string) {
    setCustom(false)
    onChange(label)
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {EXPENSE_CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            type="button"
            onClick={() => handleSelect(cat.label)}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-xs font-medium transition-all ${
              value === cat.label && !custom
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400 dark:ring-indigo-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">{cat.emoji}</span>
            <span className="text-[10px] leading-tight text-center">{cat.label}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => { setCustom(true); onChange('') }}
          className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-xs font-medium transition-all ${
            custom || isCustom
              ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 ring-2 ring-amber-400 dark:ring-amber-500'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <span className="text-lg">✏️</span>
          <span className="text-[10px] leading-tight text-center">Custom</span>
        </button>
      </div>
      {(custom || isCustom) && (
        <input
          type="text"
          value={isCustom && !custom ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type category..."
          className="mt-2 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800
            text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent"
          autoFocus
        />
      )}
    </div>
  )
}
