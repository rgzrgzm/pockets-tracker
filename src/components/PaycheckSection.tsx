import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { nextFriday, parseLocalDate } from '../types'

interface PaycheckSectionProps {
  onSelectPeriod: (id: string) => void
}

export default function PaycheckSection({ onSelectPeriod }: PaycheckSectionProps) {
  const { state, actions } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const periodsWithTotals = state.payPeriods.map((p) => {
    const expenses = state.payExpenses.filter((e) => e.payPeriodId === p.id)
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
    const remaining = p.amount - totalSpent
    return { ...p, totalSpent, remaining }
  })

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const numAmount = Number(amount)
    if (!numAmount || numAmount <= 0) return

    await actions.addPayPeriod({
      amount: numAmount,
      date: nextFriday(),
      note: note.trim(),
    })

    setAmount('')
    setNote('')
    setShowAdd(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            💰 Paycheck
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Track your income and weekly expenses
          </p>
        </div>
      </div>


      {periodsWithTotals.length === 0 && !showAdd && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">💼</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">
            No pay periods yet
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600
              hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg"
          >
            💰 Add This Week's Paycheck
          </button>
        </div>
      )}

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4"
        >
          <h2 className="font-bold text-gray-800 dark:text-white">📅 New Pay Period</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            🗓️ Next payday: <strong>{(() => { const [y, m, d] = nextFriday().split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) })()}</strong>
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold text-lg">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Paycheck amount"
              min="0"
              step="0.01"
              className="w-full pl-10 pr-4 py-3 text-xl font-bold rounded-2xl border border-gray-200 dark:border-gray-600
                bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent"
              autoFocus
              required
            />
          </div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800
              text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAmount(''); setNote('') }}
              className="flex-1 py-3 rounded-2xl font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!amount || Number(amount) <= 0}
              className="flex-1 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600
                hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ✅ Add Paycheck
            </button>
          </div>
        </form>
      )}

      {periodsWithTotals.length > 0 && (
        <div className="space-y-3">
          {!showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full py-3 rounded-2xl font-medium text-emerald-600 dark:text-emerald-400
                border-2 border-dashed border-emerald-300 dark:border-emerald-700
                hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
            >
              ➕ Add New Paycheck
            </button>
          )}

          <div className="space-y-3">
            {periodsWithTotals.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPeriod(p.id)}
                className="w-full text-left bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50
                  shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800 dark:text-white">
                    🗓️ {parseLocalDate(p.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">${p.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    💰 ${p.amount.toLocaleString()}
                  </span>
                  <span className="text-red-500 dark:text-red-400 font-medium">
                    💸 -${p.totalSpent.toLocaleString()}
                  </span>
                  <span className={`font-bold ${p.remaining <= 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
                    {p.remaining <= 0 ? `⚠️ $${Math.abs(p.remaining).toLocaleString()}` : `$${p.remaining.toLocaleString()}`}
                  </span>
                </div>
                {p.note && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{p.note}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
