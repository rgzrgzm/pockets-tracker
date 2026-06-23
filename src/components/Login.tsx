import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { actions, state } = useApp()
  const [pin, setPin] = useState<string[]>(Array(4).fill(''))
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  async function attemptLogin(entered: string) {
    setLoading(true)
    const ok = await actions.login(entered)
    setLoading(false)
    if (!ok) {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 400)
      setTimeout(() => {
        setPin(Array(4).fill(''))
        inputRefs.current[0]?.focus()
      }, 500)
    }
  }

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const digit = value.slice(-1)
    const newPin = [...pin]
    newPin[index] = digit
    setPin(newPin)
    setError(false)

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    if (index === 3 && digit) {
      attemptLogin(newPin.join(''))
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!loading) attemptLogin(pin.join(''))
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    const newPin = [...pin]
    for (let i = 0; i < text.length; i++) {
      newPin[i] = text[i]
    }
    setPin(newPin)
    if (text.length === 4) {
      attemptLogin(text)
    } else {
      inputRefs.current[Math.min(text.length, 3)]?.focus()
    }
  }

  function toggleTheme() {
    actions.setTheme(state.theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br animate-gradient bg-400%
          from-blue-100 via-pink-100 to-green-100
          dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e]"
      />

      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-10 p-3 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:scale-105 transition-all"
      >
        {state.theme === 'light' ? '🌙' : '☀️'}
      </button>

      <form
        onSubmit={handleSubmit}
        className={`relative z-10 w-full max-w-sm ${shake ? 'animate-shake' : 'animate-slideUp'}`}
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="text-5xl mb-3">🏦</div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Pockets
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Your money, organized
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 text-center">
              Enter your PIN to unlock
            </label>
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-14 h-14 text-center text-2xl font-bold rounded-2xl border-2 transition-all
                    bg-white dark:bg-gray-800
                    ${error
                      ? 'border-red-400 dark:border-red-500 animate-shake'
                      : digit
                        ? 'border-indigo-400 dark:border-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                        : 'border-gray-200 dark:border-gray-600'
                    }
                    focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/30
                    text-gray-800 dark:text-white`}
                  disabled={loading}
                />
              ))}
            </div>
            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm text-center animate-slideDown">
                ❌ Incorrect PIN. Try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={pin.some((d) => !d) || loading}
            className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600
              hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed
              transition-all shadow-lg shadow-indigo-300 dark:shadow-indigo-900/40
              active:scale-[0.98]"
          >
            {loading ? '⏳ Unlocking...' : '🔓 Unlock'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          a project of <strong>rgzrgzm_code</strong> from <strong>kaizencode</strong>
        </p>
      </form>
    </div>
  )
}
