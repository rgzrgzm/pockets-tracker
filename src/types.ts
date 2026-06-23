export type PocketType = 'recurring' | 'debt' | 'goal' | 'flexible'
export type TransactionType = 'deposit' | 'withdrawal'
export type Theme = 'light' | 'dark'

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

export interface AppState {
  pockets: Pocket[]
  transactions: Transaction[]
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
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: { pockets: Pocket[]; transactions: Transaction[] } }

export const POCKET_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
  '#3b82f6', '#2563eb', '#7c3aed', '#db2777',
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

export const CORRECT_PIN = '1997'
