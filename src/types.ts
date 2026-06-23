export type PocketType = 'recurring' | 'debt' | 'goal' | 'flexible'
export type TransactionType = 'deposit' | 'withdrawal'
export type Theme = 'light' | 'dark'
export type Tab = 'pockets' | 'paycheck' | 'cards'

export interface Pocket {
  id: string
  name: string
  emoji: string
  color: string
  type: PocketType
  targetAmount: number | null
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  pocketId: string
  type: TransactionType
  amount: number
  date: string
  note: string
  createdAt: string
}

export interface PayPeriod {
  id: string
  amount: number
  date: string
  note: string
  createdAt: string
}

export interface PayExpense {
  id: string
  payPeriodId: string
  category: string
  amount: number
  note: string
  date: string
  createdAt: string
}

export interface CreditCard {
  id: string
  name: string
  emoji: string
  color: string
  createdAt: string
}

export interface CardExpense {
  id: string
  cardId: string
  category: string
  amount: number
  note: string
  date: string
  createdAt: string
}

export interface AppState {
  pockets: Pocket[]
  transactions: Transaction[]
  payPeriods: PayPeriod[]
  payExpenses: PayExpense[]
  creditCards: CreditCard[]
  cardExpenses: CardExpense[]
  theme: Theme
  loading: boolean
  sessionReady: boolean
  isLoggedIn: boolean
}

export type AppAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'ADD_POCKET'; payload: Pocket }
  | { type: 'UPDATE_POCKET'; payload: { id: string; updates: Partial<Pocket> } }
  | { type: 'DELETE_POCKET'; payload: { id: string } }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; updates: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
  | { type: 'ADD_PAY_PERIOD'; payload: PayPeriod }
  | { type: 'DELETE_PAY_PERIOD'; payload: { id: string } }
  | { type: 'ADD_PAY_EXPENSE'; payload: PayExpense }
  | { type: 'DELETE_PAY_EXPENSE'; payload: { id: string } }
  | { type: 'ADD_CREDIT_CARD'; payload: CreditCard }
  | { type: 'DELETE_CREDIT_CARD'; payload: { id: string } }
  | { type: 'ADD_CARD_EXPENSE'; payload: CardExpense }
  | { type: 'DELETE_CARD_EXPENSE'; payload: { id: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: Partial<Pick<AppState, 'pockets' | 'transactions' | 'payPeriods' | 'payExpenses' | 'creditCards' | 'cardExpenses'>> }

export const POCKET_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
  '#3b82f6', '#2563eb', '#7c3aed', '#db2777',
]

export const CARD_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
  '#3b82f6', '#2563eb', '#7c3aed', '#db2777',
]

export const CARD_EMOJIS = [
  '💳', '🏦', '💎', '🌟', '🔥', '💜', '💙', '💚',
  '❤️', '🖤', '🤍', '💛', '🧡', '🩵', '🩷', '💝',
]

export const EMOJIS = [
  '💪', '📱', '🌐', '📺', '💳', '🏦', '🎯', '💰',
  '🏠', '🚗', '✈️', '🎓', '🍽️', '🛒', '🐾', '🎮',
  '📚', '💊', '👕', '💎', '🎵', '☕', '🏋️', '🧘',
]

export const TYPE_LABELS: Record<PocketType, string> = {
  recurring: '🔄 Recurring',
  debt: '💳 Debt',
  goal: '🎯 Goal',
  flexible: '📦 Flexible',
}

export const EXPENSE_CATEGORIES = [
  { emoji: '🍕', label: 'Food' },
  { emoji: '🚇', label: 'Transport' },
  { emoji: '🎮', label: 'Entertainment' },
  { emoji: '🛒', label: 'Shopping' },
  { emoji: '🏠', label: 'Housing' },
  { emoji: '⚡', label: 'Utilities' },
  { emoji: '💊', label: 'Health' },
  { emoji: '📚', label: 'Education' },
  { emoji: '✈️', label: 'Travel' },
  { emoji: '🎁', label: 'Gifts' },
  { emoji: '☕', label: 'Dining Out' },
  { emoji: '📱', label: 'Subscriptions' },
  { emoji: '👕', label: 'Clothing' },
  { emoji: '🐾', label: 'Pets' },
  { emoji: '🏋️', label: 'Fitness' },
  { emoji: '🎵', label: 'Music' },
]

export const CORRECT_PIN = '1997'

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function nextFriday(): string {
  const d = new Date()
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7))
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
