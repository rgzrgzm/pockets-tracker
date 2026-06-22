import { useState } from 'react'
import { useApp } from './context/AppContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import SpaceDetail from './components/SpaceDetail'
import ThemeToggle from './components/ThemeToggle'
import ToastContainer from './components/Toast'
import { useToast } from './hooks/useToast'

type View =
  | { screen: 'dashboard' }
  | { screen: 'detail'; pocketId: string }

export default function App() {
  const { state, dispatch } = useApp()
  const [view, setView] = useState<View>({ screen: 'dashboard' })
  const { toasts, removeToast } = useToast()

  if (!state.isAuth) {
    return <Login />
  }

  function handleLogout() {
    dispatch({ type: 'LOGOUT' })
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
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
            >
              🔒 Logout
            </button>
          </div>
        </div>
      </header>

      <main>
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
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
