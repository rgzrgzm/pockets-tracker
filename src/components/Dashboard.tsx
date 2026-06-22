import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import StatsBar from './StatsBar'
import CalendarDots from './CalendarDots'
import SpaceCard from './SpaceCard'
import AddEditModal from './AddEditModal'
import HintBox from './HintBox'

interface DashboardProps {
  onSelectPocket: (id: string) => void
}

export default function Dashboard({ onSelectPocket }: DashboardProps) {
  const { state } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const pocketBalances = useMemo(() => {
    return state.pockets.map((p) => {
      const balance = state.transactions
        .filter((t) => t.pocketId === p.id)
        .reduce((acc, t) => acc + (t.type === 'deposit' ? t.amount : -t.amount), 0)
      return { ...p, balance }
    })
  }, [state.pockets, state.transactions])

  const filteredPockets = useMemo(() => {
    let list = pocketBalances

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.emoji.includes(q)
      )
    }

    if (selectedDate) {
      const pocketsWithTxOnDate = new Set(
        state.transactions
          .filter((t) => t.date === selectedDate)
          .map((t) => t.pocketId)
      )
      list = list.filter((p) => pocketsWithTxOnDate.has(p.id))
    }

    return list.sort((a, b) => b.balance - a.balance)
  }, [pocketBalances, search, selectedDate, state.transactions])

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            🏦 Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Your financial pockets at a glance
          </p>
        </div>
      </div>

      <StatsBar />

      <HintBox>
        <p>
          💡 Each <strong>pocket</strong> is like an "apartado" — a space where you separate money for a
          specific purpose. Set a <strong>target amount</strong> to track your savings progress with the
          visual bar. Use the <strong>calendar</strong> below to filter by days you made movements.
        </p>
      </HintBox>

      <CalendarDots
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pockets..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800
              text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent
              transition-all text-sm"
          />
        </div>
        {(selectedDate || search) && (
          <button
            onClick={() => {
              setSelectedDate(null)
              setSearch('')
            }}
            className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline px-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredPockets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">
            {state.pockets.length === 0 ? '🚀' : '🔍'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {state.pockets.length === 0
              ? 'No pockets yet — create your first one!'
              : 'No pockets match your filters'}
          </p>
          {state.pockets.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-6 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600
                hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
            >
              ✨ Create Your First Pocket
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPockets.map((pocket) => (
            <SpaceCard
              key={pocket.id}
              pocket={pocket}
              onClick={() => onSelectPocket(pocket.id)}
            />
          ))}
          <button
            onClick={() => setShowAddModal(true)}
            className="h-48 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600
              hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20
              transition-all flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500
              hover:text-indigo-500 dark:hover:text-indigo-400 group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">➕</span>
            <span className="font-medium text-sm">Add Pocket</span>
          </button>
        </div>
      )}

      {showAddModal && <AddEditModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
