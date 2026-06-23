import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ExpenseModal from './ExpenseModal'

interface CardDetailProps {
  cardId: string
  onBack: () => void
}

export default function CardDetail({ cardId, onBack }: CardDetailProps) {
  const { state, actions } = useApp()
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  const card = state.creditCards.find((c) => c.id === cardId)
  const expenses = state.cardExpenses
    .filter((e) => e.cardId === cardId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (!card) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-2">🔍</p>
        <p>Card not found</p>
      </div>
    )
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

  function handleDeleteCard() {
    actions.deleteCreditCard(cardId)
    onBack()
  }

  return (
    <div className="animate-fadeIn space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        ◀ Back to Cards
      </button>

      <div
        className="bg-white dark:bg-gray-800/80 rounded-3xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm"
        style={{ borderLeftColor: card.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{card.emoji}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {card.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Credit Card</p>
          </div>
          <button
            onClick={handleDeleteCard}
            className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>

        <p className="text-3xl font-bold text-red-500 dark:text-red-400 mb-1">
          -${totalSpent.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Total Spent</p>
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
                    {new Date(ex.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  -${ex.amount.toLocaleString()}
                </p>
                <button
                  onClick={() => actions.deleteCardExpense(ex.id)}
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
          sourceType="card"
          sourceId={cardId}
          emoji={card.emoji}
          name={card.name}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  )
}
