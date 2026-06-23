import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { parseLocalDate } from '../types'
import ExpenseModal from './ExpenseModal'

interface PaycheckDetailProps {
  periodId: string
  onBack: () => void
}

export default function PaycheckDetail({ periodId, onBack }: PaycheckDetailProps) {
  const { state, actions } = useApp()
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  const period = state.payPeriods.find((p) => p.id === periodId)
  const expenses = state.payExpenses
    .filter((e) => e.payPeriodId === periodId)
    .sort((a, b) => parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime())

  if (!period) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-2">🔍</p>
        <p>Pay period not found</p>
      </div>
    )
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = period.amount - totalSpent
  const overspent = remaining < 0

  function handleDeletePeriod() {
    actions.deletePayPeriod(periodId)
    onBack()
  }

  return (
    <div className="animate-fadeIn space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        ◀ Back to Paycheck
      </button>

      <div className="bg-white dark:bg-gray-800/80 rounded-3xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            🗓️ {parseLocalDate(period.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h1>
          <button
            onClick={handleDeletePeriod}
            className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
        {period.note && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{period.note}</p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Received</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${period.amount.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Spent</p>
            <p className="text-lg font-bold text-red-500 dark:text-red-400">${totalSpent.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{overspent ? 'Overspent' : 'Remaining'}</p>
            <p className={`text-lg font-bold ${overspent ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
              {overspent ? `⚠️ $${Math.abs(remaining).toLocaleString()}` : `$${remaining.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-800 dark:text-white text-lg">
          📋 Expenses ({expenses.length})
        </h2>
        <button
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-medium text-white bg-gradient-to-r from-orange-500 to-red-600
            hover:from-orange-600 hover:to-red-700 transition-all shadow-sm active:scale-95"
        >
          💸 Add Expense
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">No expenses yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {expenses.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
              >
                <span className="text-lg">💸</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {ex.category}
                    {ex.note && (
                      <span className="font-normal text-gray-500 dark:text-gray-400"> — {ex.note}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {parseLocalDate(ex.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  -${ex.amount.toLocaleString()}
                </p>
                <button
                  onClick={() => actions.deletePayExpense(ex.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-sm p-1"
                  title="Delete expense"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showExpenseModal && (
        <ExpenseModal
          sourceType="pay"
          sourceId={periodId}
          emoji="💰"
          name={`Paycheck - ${parseLocalDate(period.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  )
}
