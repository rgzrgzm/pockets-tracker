import { useApp } from '../context/AppContext'
import { parseLocalDate } from '../types'

export function usePocket(id: string) {
  const { state } = useApp()
  const pocket = state.pockets.find((p) => p.id === id)
  const pocketTransactions = state.transactions
    .filter((t) => t.pocketId === id)
    .sort((a, b) => parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime())
  return { pocket, transactions: pocketTransactions }
}
