import { useApp } from '../context/AppContext'

export function usePocket(id: string) {
  const { state } = useApp()
  const pocket = state.pockets.find((p) => p.id === id)
  const pocketTransactions = state.transactions
    .filter((t) => t.pocketId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return { pocket, transactions: pocketTransactions }
}
