import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarDotsProps {
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

export default function CalendarDots({ selectedDate, onSelectDate }: CalendarDotsProps) {
  const { state } = useApp()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const daysWithTransactions = useMemo(() => {
    const dates = new Set<string>()
    state.transactions.forEach((t) => {
      if (t.date) dates.add(t.date)
    })
    return dates
  }, [state.transactions])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [viewYear, viewMonth])

  function formatDate(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
        >
          ◀
        </button>
        <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const dateStr = formatDate(day)
          const hasActivity = daysWithTransactions.has(dateStr)
          const isSelected = selectedDate === dateStr
          const isToday = dateStr === today.toISOString().slice(0, 10)

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
              className={`relative flex flex-col items-center py-1 rounded-xl text-xs font-medium transition-all
                ${isSelected
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : isToday
                    ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
            >
              <span>{day}</span>
              {hasActivity && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSelected
                      ? 'bg-indigo-500 dark:bg-indigo-400'
                      : 'bg-emerald-400 dark:bg-emerald-500'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
