import { useState, type FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import type { Pocket, PocketType } from '../types'
import { POCKET_COLORS, EMOJIS, TYPE_LABELS } from '../types'

interface AddEditModalProps {
  pocket?: Pocket
  onClose: () => void
}

export default function AddEditModal({ pocket, onClose }: AddEditModalProps) {
  const { dispatch } = useApp()
  const editing = !!pocket

  const [name, setName] = useState(pocket?.name ?? '')
  const [emoji, setEmoji] = useState(pocket?.emoji ?? '💰')
  const [color, setColor] = useState(pocket?.color ?? POCKET_COLORS[0])
  const [type, setType] = useState<PocketType>(pocket?.type ?? 'flexible')
  const [targetAmount, setTargetAmount] = useState(
    pocket?.targetAmount?.toString() ?? ''
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    if (editing && pocket) {
      dispatch({
        type: 'UPDATE_POCKET',
        payload: {
          id: pocket.id,
          updates: {
            name: name.trim(),
            emoji,
            color,
            type,
            targetAmount: targetAmount ? Number(targetAmount) : null,
          },
        },
      })
    } else {
      const newPocket: Pocket = {
        id: crypto.randomUUID(),
        name: name.trim(),
        emoji,
        color,
        type,
        targetAmount: targetAmount ? Number(targetAmount) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      dispatch({ type: 'ADD_POCKET', payload: newPocket })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {editing ? '✏️ Edit Pocket' : '➕ New Pocket'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Phone Service"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800
                  text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent
                  transition-all"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                Emoji
              </label>
              <div className="grid grid-cols-8 gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`text-xl p-2 rounded-xl transition-all ${
                      emoji === e
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 scale-110 shadow-md ring-2 ring-indigo-400 dark:ring-indigo-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {POCKET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-xl transition-all ${
                      color === c ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900 scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(TYPE_LABELS) as [PocketType, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key)}
                      className={`px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                        type === key
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400 dark:ring-indigo-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                Target Amount <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-medium">
                  $
                </span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800
                    text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent
                    transition-all"
                />
              </div>
              <HintInline />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600
                  hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {editing ? '💾 Save' : '✨ Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function HintInline() {
  return (
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
      💡 Set a savings goal to track your progress with a visual bar.
    </p>
  )
}
