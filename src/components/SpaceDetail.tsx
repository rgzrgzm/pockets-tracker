import { useState } from 'react'
import { useApp, usePocket, getPocketBalance } from '../context/AppContext'
import { TYPE_LABELS } from '../types'
import type { TransactionType } from '../types'
import TransactionModal from './TransactionModal'
import AddEditModal from './AddEditModal'
import HintBox from './HintBox'

interface SpaceDetailProps {
  pocketId: string
  onBack: () => void
}

export default function SpaceDetail({ pocketId, onBack }: SpaceDetailProps) {
  const { state, dispatch } = useApp()
  const { pocket, transactions } = usePocket(pocketId)
  const [showTxModal, setShowTxModal] = useState<TransactionType | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [dateFilter, setDateFilter] = useState('')

  if (!pocket) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-2">🔍</p>
        <p>Pocket not found</p>
      </div>
    )
  }

  const balance = getPocketBalance(pocket.id, state.transactions)
  const progress =
    pocket.targetAmount && pocket.targetAmount > 0
      ? Math.min(balance / pocket.targetAmount, 1)
      : null

  const filteredTxs = dateFilter
    ? transactions.filter((t) => t.date === dateFilter)
    : transactions

  function handleDelete() {
    dispatch({ type: 'DELETE_POCKET', payload: { id: pocket.id } })
    onBack()
  }

  return (
    <div className="animate-fadeIn space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        ◀ Back to Dashboard
      </button>

      <div
        className="bg-white dark:bg-gray-800/80 rounded-3xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm"
        style={{ borderLeftColor: pocket.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{pocket.emoji}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {pocket.name}
            </h1>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {TYPE_LABELS[pocket.type]}
            </span>
          </div>
        </div>

        <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
          ${balance.toLocaleString()}
        </p>

        {progress !== null && (
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>🎯 Goal: ${pocket.targetAmount!.toLocaleString()}</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: pocket.color,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={() => setShowTxModal('deposit')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600
              hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm active:scale-95"
          >
            💰 Add Money
          </button>
          <button
            onClick={() => setShowTxModal('withdrawal')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-medium text-white bg-gradient-to-r from-orange-500 to-red-600
              hover:from-orange-600 hover:to-red-700 transition-all shadow-sm active:scale-95"
          >
            💸 Withdraw
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700
              hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
          >
            ✏️ Rename
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30
              hover:bg-red-100 dark:hover:bg-red-900/50 transition-all active:scale-95"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <HintBox>
        <p>
          Track every movement in this pocket. Use the <strong>date filter</strong> below to see transactions
          from a specific day. Add notes to remember what each transaction was for — it helps when you reconcile
          with your bank statements.
        </p>
      </HintBox>

      <div className="bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-bold text-gray-800 dark:text-white">
              📋 Transaction History
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">Filter by date:</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800
                  text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredTxs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">
            <p className="text-3xl mb-2">
              {dateFilter ? '🔍' : '📭'}
            </p>
            <p className="text-sm">
              {dateFilter
                ? 'No transactions on this date'
                : 'No transactions yet — add your first one!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {filteredTxs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <span className="text-xl">
                  {tx.type === 'deposit' ? '💰' : '💸'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    {tx.note && (
                      <span className="font-normal text-gray-500 dark:text-gray-400">
                        {' '}— {tx.note}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <p
                  className={`text-sm font-bold ${
                    tx.type === 'deposit'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                </p>
                <button
                  onClick={() =>
                    dispatch({
                      type: 'DELETE_TRANSACTION',
                      payload: { id: tx.id },
                    })
                  }
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-sm"
                  title="Delete transaction"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTxModal && (
        <TransactionModal
          pocket={pocket}
          type={showTxModal}
          onClose={() => setShowTxModal(null)}
        />
      )}

      {showEditModal && (
        <AddEditModal
          pocket={pocket}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm shadow-2xl animate-slideUp p-6">
            <div className="text-center mb-5">
              <p className="text-4xl mb-3">⚠️</p>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Delete Pocket?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This will delete "{pocket.name}" and all its transactions permanently.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-3 rounded-2xl font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-2xl font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
