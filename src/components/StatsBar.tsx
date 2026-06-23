import { useApp } from '../context/AppContext'
import { getTotalBalance } from '../lib/balance'

export default function StatsBar() {
  const { state } = useApp()
  const totalSaved = getTotalBalance(state.pockets, state.transactions)
  const withTarget = state.pockets.filter((p) => p.targetAmount !== null).length

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        emoji="💰"
        label="Total Saved"
        value={`$${totalSaved.toLocaleString()}`}
      />
      <StatCard
        emoji="📦"
        label="Pockets"
        value={`${state.pockets.length}`}
      />
      <StatCard
        emoji="🎯"
        label="With Goals"
        value={`${withTarget}`}
      />
      <StatCard
        emoji="📊"
        label="Transactions"
        value={`${state.transactions.length}`}
      />
    </div>
  )
}

function StatCard({
  emoji,
  label,
  value,
}: {
  emoji: string
  label: string
  value: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{emoji}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  )
}
