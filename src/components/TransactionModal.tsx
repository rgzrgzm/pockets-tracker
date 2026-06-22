import { useState, type FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import type { Pocket, Transaction, TransactionType } from '../types'

interface TransactionModalProps {
  pocket: Pocket
  type: TransactionType
  onClose: () => void
}

export default function TransactionModal({
  pocket,
  type,
  onClose,
}: TransactionModalProps) {
  const { dispatch } = useApp()
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const numAmount = Number(amount)
    if (!numAmount || numAmount <= 0) return

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      pocketId: pocket.id,
      type,
      amount: numAmount,
      date,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    }

    dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl animate-slideUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {type === 'deposit' ? '💰 Add Money' : '💸 Withdraw Money'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl mb-5">
            <span className="text-3xl">{pocket.emoji}</span>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">{pocket.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {type === 'deposit' ? 'Adding to' : 'Withdrawing from'} this pocket
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold text-lg">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-2xl border border-gray-200 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent
                    transition-all"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800
                  text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent
                  transition-all"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                💡 You can back-date transactions to match your bank records.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                Note <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Monthly payment, refund..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800
                  text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent
                  transition-all"
              />
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
                disabled={!amount || Number(amount) <= 0}
                className={`flex-1 py-3 rounded-2xl font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed
                  ${type === 'deposit'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                  }`}
              >
                {type === 'deposit' ? '💰 Confirm Deposit' : '💸 Confirm Withdrawal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
