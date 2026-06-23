import type { Pocket, Transaction } from '../types'

export function getPocketBalance(pocketId: string, transactions: Transaction[]) {
  return transactions
    .filter((t) => t.pocketId === pocketId)
    .reduce((acc, t) => acc + (t.type === 'deposit' ? t.amount : -t.amount), 0)
}

export function getTotalBalance(pockets: Pocket[], transactions: Transaction[]) {
  return pockets.reduce((acc, p) => acc + getPocketBalance(p.id, transactions), 0)
}
