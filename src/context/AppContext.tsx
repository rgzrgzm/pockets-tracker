import { createContext, useContext, useReducer, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type {
  AppState, AppAction, Pocket, Transaction, Theme, PocketType, TransactionType,
  PayPeriod, PayExpense, CreditCard, CardExpense,
} from '../types'
import { CORRECT_PIN } from '../types'
import { supabase } from '../lib/supabase'
import { useToast } from './ToastContext'

const THEME_KEY = 'pockets-tracker-theme'

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved as Theme
  } catch { /* ignore */ }
  return 'light'
}

const initialState: AppState = {
  pockets: [],
  transactions: [],
  payPeriods: [],
  payExpenses: [],
  creditCards: [],
  cardExpenses: [],
  theme: loadTheme(),
  loading: false,
  sessionReady: false,
  isLoggedIn: false,
}

interface PocketRow { id: string; name: string; emoji: string; color: string; type: PocketType; target_amount: number | null; created_at: string; updated_at: string }
interface TransactionRow { id: string; pocket_id: string; type: TransactionType; amount: number; date: string; note: string | null; created_at: string }
interface PayPeriodRow { id: string; amount: number; date: string; note: string | null; created_at: string }
interface PayExpenseRow { id: string; pay_period_id: string; category: string; amount: number; note: string | null; date: string; created_at: string }
interface CreditCardRow { id: string; name: string; emoji: string; color: string; created_at: string }
interface CardExpenseRow { id: string; card_id: string; category: string; amount: number; note: string | null; date: string; created_at: string }

function mapPocket(r: PocketRow): Pocket {
  return { id: r.id, name: r.name, emoji: r.emoji, color: r.color, type: r.type, targetAmount: r.target_amount, createdAt: r.created_at, updatedAt: r.updated_at }
}
function mapTransaction(r: TransactionRow): Transaction {
  return { id: r.id, pocketId: r.pocket_id, type: r.type, amount: Number(r.amount), date: r.date, note: r.note ?? '', createdAt: r.created_at }
}
function mapPayPeriod(r: PayPeriodRow): PayPeriod {
  return { id: r.id, amount: Number(r.amount), date: r.date, note: r.note ?? '', createdAt: r.created_at }
}
function mapPayExpense(r: PayExpenseRow): PayExpense {
  return { id: r.id, payPeriodId: r.pay_period_id, category: r.category, amount: Number(r.amount), note: r.note ?? '', date: r.date, createdAt: r.created_at }
}
function mapCreditCard(r: CreditCardRow): CreditCard {
  return { id: r.id, name: r.name, emoji: r.emoji, color: r.color, createdAt: r.created_at }
}
function mapCardExpense(r: CardExpenseRow): CardExpense {
  return { id: r.id, cardId: r.card_id, category: r.category, amount: Number(r.amount), note: r.note ?? '', date: r.date, createdAt: r.created_at }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN': return { ...state, isLoggedIn: true }
    case 'LOGOUT': return { ...state, isLoggedIn: false }
    case 'SET_THEME':
      localStorage.setItem(THEME_KEY, action.payload)
      return { ...state, theme: action.payload }
    case 'ADD_POCKET':
      return { ...state, pockets: [...state.pockets, action.payload] }
    case 'UPDATE_POCKET': {
      const { id, updates } = action.payload
      return { ...state, pockets: state.pockets.map((p) => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p) }
    }
    case 'DELETE_POCKET':
      return { ...state, pockets: state.pockets.filter((p) => p.id !== action.payload.id), transactions: state.transactions.filter((t) => t.pocketId !== action.payload.id) }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] }
    case 'UPDATE_TRANSACTION':
      return { ...state, transactions: state.transactions.map((t) => t.id === action.payload.id ? { ...t, ...action.payload.updates } : t) }
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload.id) }
    case 'ADD_PAY_PERIOD':
      return { ...state, payPeriods: [...state.payPeriods, action.payload] }
    case 'DELETE_PAY_PERIOD':
      return { ...state, payPeriods: state.payPeriods.filter((p) => p.id !== action.payload.id), payExpenses: state.payExpenses.filter((e) => e.payPeriodId !== action.payload.id) }
    case 'ADD_PAY_EXPENSE':
      return { ...state, payExpenses: [...state.payExpenses, action.payload] }
    case 'DELETE_PAY_EXPENSE':
      return { ...state, payExpenses: state.payExpenses.filter((e) => e.id !== action.payload.id) }
    case 'ADD_CREDIT_CARD':
      return { ...state, creditCards: [...state.creditCards, action.payload] }
    case 'DELETE_CREDIT_CARD':
      return { ...state, creditCards: state.creditCards.filter((c) => c.id !== action.payload.id), cardExpenses: state.cardExpenses.filter((e) => e.cardId !== action.payload.id) }
    case 'ADD_CARD_EXPENSE':
      return { ...state, cardExpenses: [...state.cardExpenses, action.payload] }
    case 'DELETE_CARD_EXPENSE':
      return { ...state, cardExpenses: state.cardExpenses.filter((e) => e.id !== action.payload.id) }
    case 'SET_LOADING': return { ...state, loading: action.payload }
    case 'SET_SESSION': return { ...state, sessionReady: action.payload }
    case 'LOAD_DATA': return { ...state, ...action.payload }
    default: return state
  }
}

interface DbUpdates { name?: string; emoji?: string; color?: string; type?: PocketType; target_amount?: number | null; updated_at?: string }

export interface AppActions {
  login: (pin: string) => Promise<boolean>
  logout: () => Promise<void>
  setTheme: (theme: Theme) => void
  createPocket: (data: { name: string; emoji: string; color: string; type: PocketType; targetAmount: number | null }) => Promise<void>
  updatePocket: (id: string, updates: Partial<Pocket>) => Promise<void>
  deletePocket: (id: string) => Promise<void>
  addTransaction: (data: { pocketId: string; type: TransactionType; amount: number; date: string; note: string }) => Promise<void>
  updateTransaction: (id: string, data: { type: TransactionType; amount: number; date: string; note: string }) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  addPayPeriod: (data: { amount: number; date: string; note: string }) => Promise<void>
  deletePayPeriod: (id: string) => Promise<void>
  addPayExpense: (data: { payPeriodId: string; category: string; amount: number; note: string; date: string }) => Promise<void>
  deletePayExpense: (id: string) => Promise<void>
  addCreditCard: (data: { name: string; emoji: string; color: string }) => Promise<void>
  deleteCreditCard: (id: string) => Promise<void>
  addCardExpense: (data: { cardId: string; category: string; amount: number; note: string; date: string }) => Promise<void>
  deleteCardExpense: (id: string) => Promise<void>
}

interface AppContextValue { state: AppState; actions: AppActions }

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => initialState)
  const { addToast } = useToast()
  const fetchingRef = useRef(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark')
    const meta = document.querySelector('meta[name="theme-color"]:not([media])')
    if (meta) meta.setAttribute('content', state.theme === 'dark' ? '#030712' : '#f9fafb')
  }, [state.theme])

  const fetchData = useCallback(async () => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const [pR, tR, ppR, peR, ccR, ceR] = await Promise.all([
        supabase.from('pockets').select('*').order('created_at', { ascending: false }),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('pay_periods').select('*').order('date', { ascending: false }),
        supabase.from('pay_expenses').select('*').order('created_at', { ascending: false }),
        supabase.from('credit_cards').select('*').order('created_at', { ascending: false }),
        supabase.from('card_expenses').select('*').order('created_at', { ascending: false }),
      ])

      if (pR.error) throw pR.error; if (tR.error) throw tR.error
      if (ppR.error) throw ppR.error; if (peR.error) throw peR.error
      if (ccR.error) throw ccR.error; if (ceR.error) throw ceR.error

      dispatch({
        type: 'LOAD_DATA',
        payload: {
          pockets: (pR.data ?? []).map((r) => mapPocket(r as PocketRow)),
          transactions: (tR.data ?? []).map((r) => mapTransaction(r as TransactionRow)),
          payPeriods: (ppR.data ?? []).map((r) => mapPayPeriod(r as PayPeriodRow)),
          payExpenses: (peR.data ?? []).map((r) => mapPayExpense(r as PayExpenseRow)),
          creditCards: (ccR.data ?? []).map((r) => mapCreditCard(r as CreditCardRow)),
          cardExpenses: (ceR.data ?? []).map((r) => mapCardExpense(r as CardExpenseRow)),
        },
      })
    } catch (err) {
      const e = err as { message?: string; code?: string }
      if (e?.message?.includes('relation') || e?.code === '42P01') {
        dispatch({ type: 'LOAD_DATA', payload: { pockets: [], transactions: [], payPeriods: [], payExpenses: [], creditCards: [], cardExpenses: [] } })
      } else {
        addToast(e?.message ?? 'Failed to load data', 'error')
        dispatch({ type: 'LOAD_DATA', payload: { pockets: [], transactions: [], payPeriods: [], payExpenses: [], creditCards: [], cardExpenses: [] } })
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({ type: 'SET_SESSION', payload: true })
      fetchingRef.current = false
    }
  }, [addToast])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { dispatch({ type: 'LOGIN' }); fetchData() }
      else { dispatch({ type: 'SET_SESSION', payload: true }) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') { dispatch({ type: 'LOGIN' }); fetchData() }
      else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' })
        dispatch({ type: 'LOAD_DATA', payload: { pockets: [], transactions: [], payPeriods: [], payExpenses: [], creditCards: [], cardExpenses: [] } })
        dispatch({ type: 'SET_SESSION', payload: true })
      }
    })
    return () => subscription.unsubscribe()
  }, [fetchData])

  const login = useCallback(async (pin: string): Promise<boolean> => {
    if (pin !== CORRECT_PIN) return false
    const email = import.meta.env.VITE_AUTH_EMAIL as string | undefined
    const password = import.meta.env.VITE_AUTH_PASSWORD as string | undefined
    if (!email || !password) { addToast('Auth credentials not configured', 'error'); return false }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { addToast(error.message, 'error'); return false }
    return true
  }, [addToast])

  const logout = useCallback(async () => { await supabase.auth.signOut() }, [])

  const setTheme = useCallback((theme: Theme) => { dispatch({ type: 'SET_THEME', payload: theme }) }, [])

  const createPocket = useCallback(async (data: { name: string; emoji: string; color: string; type: PocketType; targetAmount: number | null }) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { addToast('Not authenticated', 'error'); return }
    const { data: pocket, error } = await supabase.from('pockets').insert({ user_id: session.user.id, name: data.name, emoji: data.emoji, color: data.color, type: data.type, target_amount: data.targetAmount }).select().single()
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'ADD_POCKET', payload: mapPocket(pocket as PocketRow) })
  }, [addToast])

  const updatePocket = useCallback(async (id: string, updates: Partial<Pocket>) => {
    const dbUpdates: DbUpdates = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.emoji !== undefined) dbUpdates.emoji = updates.emoji
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.type !== undefined) dbUpdates.type = updates.type
    if (updates.targetAmount !== undefined) dbUpdates.target_amount = updates.targetAmount
    dbUpdates.updated_at = new Date().toISOString()
    const { error } = await supabase.from('pockets').update(dbUpdates).eq('id', id)
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'UPDATE_POCKET', payload: { id, updates } })
  }, [addToast])

  const deletePocket = useCallback(async (id: string) => {
    const { error } = await supabase.from('pockets').delete().eq('id', id)
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'DELETE_POCKET', payload: { id } })
  }, [addToast])

  const addTransaction = useCallback(async (data: { pocketId: string; type: TransactionType; amount: number; date: string; note: string }) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { addToast('Not authenticated', 'error'); return }
    const { data: transaction, error } = await supabase.from('transactions').insert({ user_id: session.user.id, pocket_id: data.pocketId, type: data.type, amount: data.amount, date: data.date, note: data.note }).select().single()
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'ADD_TRANSACTION', payload: mapTransaction(transaction as TransactionRow) })
  }, [addToast])

  const updateTransaction = useCallback(async (id: string, data: { type: TransactionType; amount: number; date: string; note: string }) => {
    const { error } = await supabase.from('transactions').update({ type: data.type, amount: data.amount, date: data.date, note: data.note }).eq('id', id)
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, updates: { type: data.type, amount: data.amount, date: data.date, note: data.note.trim() } } })
  }, [addToast])

  const deleteTransaction = useCallback(async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'DELETE_TRANSACTION', payload: { id } })
  }, [addToast])

  const addPayPeriod = useCallback(async (data: { amount: number; date: string; note: string }) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { addToast('Not authenticated', 'error'); return }
    const { data: period, error } = await supabase.from('pay_periods').insert({ user_id: session.user.id, amount: data.amount, date: data.date, note: data.note }).select().single()
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'ADD_PAY_PERIOD', payload: mapPayPeriod(period as PayPeriodRow) })
  }, [addToast])

  const deletePayPeriod = useCallback(async (id: string) => {
    const { error } = await supabase.from('pay_periods').delete().eq('id', id)
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'DELETE_PAY_PERIOD', payload: { id } })
  }, [addToast])

  const addPayExpense = useCallback(async (data: { payPeriodId: string; category: string; amount: number; note: string; date: string }) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { addToast('Not authenticated', 'error'); return }
    const { data: expense, error } = await supabase.from('pay_expenses').insert({ user_id: session.user.id, pay_period_id: data.payPeriodId, category: data.category, amount: data.amount, note: data.note, date: data.date }).select().single()
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'ADD_PAY_EXPENSE', payload: mapPayExpense(expense as PayExpenseRow) })
  }, [addToast])

  const deletePayExpense = useCallback(async (id: string) => {
    const { error } = await supabase.from('pay_expenses').delete().eq('id', id)
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'DELETE_PAY_EXPENSE', payload: { id } })
  }, [addToast])

  const addCreditCard = useCallback(async (data: { name: string; emoji: string; color: string }) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { addToast('Not authenticated', 'error'); return }
    const { data: card, error } = await supabase.from('credit_cards').insert({ user_id: session.user.id, name: data.name, emoji: data.emoji, color: data.color }).select().single()
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'ADD_CREDIT_CARD', payload: mapCreditCard(card as CreditCardRow) })
  }, [addToast])

  const deleteCreditCard = useCallback(async (id: string) => {
    const { error } = await supabase.from('credit_cards').delete().eq('id', id)
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'DELETE_CREDIT_CARD', payload: { id } })
  }, [addToast])

  const addCardExpense = useCallback(async (data: { cardId: string; category: string; amount: number; note: string; date: string }) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { addToast('Not authenticated', 'error'); return }
    const { data: expense, error } = await supabase.from('card_expenses').insert({ user_id: session.user.id, card_id: data.cardId, category: data.category, amount: data.amount, note: data.note, date: data.date }).select().single()
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'ADD_CARD_EXPENSE', payload: mapCardExpense(expense as CardExpenseRow) })
  }, [addToast])

  const deleteCardExpense = useCallback(async (id: string) => {
    const { error } = await supabase.from('card_expenses').delete().eq('id', id)
    if (error) { addToast(error.message, 'error'); return }
    dispatch({ type: 'DELETE_CARD_EXPENSE', payload: { id } })
  }, [addToast])

  const actions: AppActions = {
    login, logout, setTheme,
    createPocket, updatePocket, deletePocket,
    addTransaction, updateTransaction, deleteTransaction,
    addPayPeriod, deletePayPeriod,
    addPayExpense, deletePayExpense,
    addCreditCard, deleteCreditCard,
    addCardExpense, deleteCardExpense,
  }

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
