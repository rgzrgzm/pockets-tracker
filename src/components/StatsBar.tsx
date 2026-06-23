import { useApp } from '../context/AppContext'
import { getTotalBalance } from '../lib/balance'

export default function StatsBar() {
  const { state } = useApp()
  const totalSaved = getTotalBalance(state.pockets, state.transactions)
  const withTarget = state.pockets.filter((p) => p.targetAmount !== null).length

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm text-center">
      <p className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white">
        ${totalSaved.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Saved</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
        {state.pockets.length} pocket{state.pockets.length !== 1 ? 's' : ''}
        {withTarget > 0 ? ` · ${withTarget} with goal${withTarget !== 1 ? 's' : ''}` : ''}
      </p>
    </div>
  )
}
