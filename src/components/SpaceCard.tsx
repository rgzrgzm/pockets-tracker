import { useApp } from '../context/AppContext'
import { getPocketBalance } from '../lib/balance'
import type { Pocket } from '../types'
import { TYPE_LABELS } from '../types'

interface SpaceCardProps {
  pocket: Pocket
  onClick: () => void
}

export default function SpaceCard({ pocket, onClick }: SpaceCardProps) {
  const { state } = useApp()
  const balance = getPocketBalance(pocket.id, state.transactions)
  const progress =
    pocket.targetAmount && pocket.targetAmount > 0
      ? Math.min(balance / pocket.targetAmount, 1)
      : null

  return (
    <button
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all text-left w-full overflow-hidden active:scale-[0.98]"
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
        style={{ backgroundColor: pocket.color }}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-3xl block mb-1">{pocket.emoji}</span>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
              {pocket.name}
            </h3>
          </div>
          <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {TYPE_LABELS[pocket.type]}
          </span>
        </div>

        <p className="text-xl font-bold text-gray-800 dark:text-white mt-2">
          ${balance.toLocaleString()}
        </p>

        {progress !== null && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: pocket.color,
                }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Target: ${pocket.targetAmount!.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </button>
  )
}
