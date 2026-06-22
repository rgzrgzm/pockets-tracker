import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppState, AppAction, Pocket, Transaction } from '../types'

const STORAGE_KEY = 'pockets-tracker-state'

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return {
    pockets: [],
    transactions: [],
    theme: 'light',
    isAuth: false,
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuth: true }
    case 'LOGOUT':
      return { ...state, isAuth: false }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'ADD_POCKET':
      return { ...state, pockets: [...state.pockets, action.payload] }
    case 'UPDATE_POCKET': {
      const { id, updates } = action.payload
      return {
        ...state,
        pockets: state.pockets.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        ),
      }
    }
    case 'DELETE_POCKET':
      return {
        ...state,
        pockets: state.pockets.filter((p) => p.id !== action.payload.id),
        transactions: state.transactions.filter(
          (t) => t.pocketId !== action.payload.id
        ),
      }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload.id),
      }
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark')
  }, [state.theme])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function usePocket(id: string) {
  const { state } = useApp()
  const pocket = state.pockets.find((p) => p.id === id)
  const pocketTransactions = state.transactions
    .filter((t) => t.pocketId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return { pocket, transactions: pocketTransactions }
}

export function getPocketBalance(pocketId: string, transactions: Transaction[]) {
  return transactions
    .filter((t) => t.pocketId === pocketId)
    .reduce((acc, t) => acc + (t.type === 'deposit' ? t.amount : -t.amount), 0)
}

export function getTotalBalance(pockets: Pocket[], transactions: Transaction[]) {
  return pockets.reduce(
    (acc, p) => acc + getPocketBalance(p.id, transactions),
    0
  )
}
