import { useApp } from '../context/AppContext'

export default function ThemeToggle() {
  const { state, dispatch } = useApp()

  return (
    <button
      onClick={() =>
        dispatch({
          type: 'SET_THEME',
          payload: state.theme === 'light' ? 'dark' : 'light',
        })
      }
      className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
      title={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {state.theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
