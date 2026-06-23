import { useState } from 'react'
import { useApp } from './context/AppContext'
import { useToast } from './context/ToastContext'
import type { Tab } from './types'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import SpaceDetail from './components/SpaceDetail'
import ThemeToggle from './components/ThemeToggle'
import PaycheckSection from './components/PaycheckSection'
import PaycheckDetail from './components/PaycheckDetail'
import CreditCardsSection from './components/CreditCardsSection'
import CardDetail from './components/CardDetail'
import ToastContainer from './components/Toast'

type View =
  | { screen: 'dashboard' }
  | { screen: 'detail'; pocketId: string }
  | { screen: 'paycheckDetail'; periodId: string }
  | { screen: 'cardDetail'; cardId: string }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'pockets', label: 'Pockets', icon: '🏦' },
  { key: 'paycheck', label: 'Paycheck', icon: '💰' },
  { key: 'cards', label: 'Cards', icon: '💳' },
]

export default function App() {
  const { state, actions } = useApp()
  const { toasts, removeToast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('pockets')
  const [view, setView] = useState<View>({ screen: 'dashboard' })

  if (!state.sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center animate-pulse">
          <p className="text-4xl mb-2">🏦</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!state.isLoggedIn) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏦</span>
            <span className="font-bold text-gray-800 dark:text-white">Pockets</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={actions.logout}
              className="px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
            >
              🔒 Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="sticky top-14 z-20 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key)
                if (tab.key === 'pockets') setView({ screen: 'dashboard' })
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${activeTab === tab.key
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main>
        {state.loading && state.pockets.length === 0 && activeTab === 'pockets' && view.screen === 'dashboard' ? (
          <div className="max-w-6xl mx-auto p-4 sm:p-6 animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-2xl w-48" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : activeTab === 'pockets' ? (
          <>
            {view.screen === 'dashboard' && (
              <Dashboard onSelectPocket={(id) => setView({ screen: 'detail', pocketId: id })} />
            )}
            {view.screen === 'detail' && (
              <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-20">
                <SpaceDetail
                  pocketId={view.pocketId}
                  onBack={() => setView({ screen: 'dashboard' })}
                />
              </div>
            )}
          </>
        ) : activeTab === 'paycheck' ? (
          <>
            {view.screen === 'dashboard' && (
              <PaycheckSection onSelectPeriod={(id) => setView({ screen: 'paycheckDetail', periodId: id })} />
            )}
            {view.screen === 'paycheckDetail' && (
              <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-20">
                <PaycheckDetail
                  periodId={view.periodId}
                  onBack={() => setView({ screen: 'dashboard' })}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {view.screen === 'dashboard' && (
              <CreditCardsSection onSelectCard={(id) => setView({ screen: 'cardDetail', cardId: id })} />
            )}
            {view.screen === 'cardDetail' && (
              <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-20">
                <CardDetail
                  cardId={view.cardId}
                  onBack={() => setView({ screen: 'dashboard' })}
                />
              </div>
            )}
          </>
        )}
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
