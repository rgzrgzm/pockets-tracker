import { useState } from 'react'
import { useApp } from '../context/AppContext'
import AddCardModal from './AddCardModal'

interface CreditCardsSectionProps {
  onSelectCard: (id: string) => void
}

export default function CreditCardsSection({ onSelectCard }: CreditCardsSectionProps) {
  const { state } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)

  const cardsWithTotals = state.creditCards.map((c) => {
    const expenses = state.cardExpenses.filter((e) => e.cardId === c.id)
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
    return { ...c, totalSpent, expenseCount: expenses.length }
  })

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            💳 Credit Cards
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Track spending across all your cards
          </p>
        </div>
      </div>


      {cardsWithTotals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">💳</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">No cards yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600
              hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
          >
            💳 Add Your First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardsWithTotals.map((card) => (
            <button
              key={card.id}
              onClick={() => onSelectCard(card.id)}
              className="group relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all text-left w-full overflow-hidden active:scale-[0.98]"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
                style={{ backgroundColor: card.color }}
              />
              <div className="p-4 pl-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-3xl block mb-1">{card.emoji}</span>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{card.name}</h3>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {card.expenseCount} expenses
                  </span>
                </div>
                <p className="text-xl font-bold text-red-500 dark:text-red-400 mt-2">
                  -${card.totalSpent.toLocaleString()}
                </p>
              </div>
            </button>
          ))}
          <button
            onClick={() => setShowAddModal(true)}
            className="h-48 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600
              hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20
              transition-all flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500
              hover:text-indigo-500 dark:hover:text-indigo-400 group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">➕</span>
            <span className="font-medium text-sm">Add Card</span>
          </button>
        </div>
      )}

      {showAddModal && <AddCardModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
