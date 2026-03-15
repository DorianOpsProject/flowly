import { useState, useEffect, useRef } from 'react'

const MODES = [
  { key: 'focus', label: 'Focus', duration: 25 * 60, color: 'violet' },
  { key: 'short', label: 'Pause courte', duration: 5 * 60, color: 'green' },
  { key: 'long', label: 'Pause longue', duration: 15 * 60, color: 'blue' },
]

export default function Timer() {
  const [modeIdx, setModeIdx] = useState(0)
  const [seconds, setSeconds] = useState(MODES[0].duration)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [log, setLog] = useState([])
  const intervalRef = useRef(null)

  const mode = MODES[modeIdx]
  const total = mode.duration
  const progress = (total - seconds) / total

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (modeIdx === 0) {
              setSessions(n => n + 1)
              setLog(prev => [
                { label: 'Session focus terminée', time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
                ...prev.slice(0, 9),
              ])
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, modeIdx])

  function selectMode(idx) {
    setRunning(false)
    setModeIdx(idx)
    setSeconds(MODES[idx].duration)
  }

  function toggle() { setRunning(r => !r) }

  function reset() {
    setRunning(false)
    setSeconds(mode.duration)
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  // Responsive ring size: smaller on mobile
  const RING_SIZE = 200
  const RING_R = 82
  const circumference = 2 * Math.PI * RING_R
  const strokeDash = circumference * (1 - progress)

  const colorMap = {
    violet: { ring: '#7c3aed', text: 'text-violet-400', btn: 'bg-violet-600 hover:bg-violet-500 active:bg-violet-700', tab: 'bg-violet-900/40 text-violet-300 border-violet-700' },
    green: { ring: '#16a34a', text: 'text-green-400', btn: 'bg-green-700 hover:bg-green-600 active:bg-green-800', tab: 'bg-green-900/40 text-green-300 border-green-700' },
    blue: { ring: '#1d4ed8', text: 'text-blue-400', btn: 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800', tab: 'bg-blue-900/40 text-blue-300 border-blue-700' },
  }
  const c = colorMap[mode.color]

  return (
    <div className="w-full flex flex-col items-center max-w-sm mx-auto">
      {/* Mode selector */}
      <div className="flex gap-1.5 md:gap-2 mb-8 md:mb-10 w-full">
        {MODES.map((m, i) => (
          <button
            key={m.key}
            onClick={() => selectMode(i)}
            className={`flex-1 px-2 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium border transition-all ${
              i === modeIdx
                ? colorMap[m.color].tab
                : 'text-gray-500 border-gray-700 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="relative mb-8 md:mb-10">
        <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
          <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle
            cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
            fill="none"
            stroke={c.ring}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-bold font-mono text-white tracking-tight">{mins}:{secs}</span>
          <span className={`text-xs md:text-sm mt-1 ${c.text}`}>{mode.label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 md:gap-4 mb-7 md:mb-8 w-full justify-center">
        <button
          onClick={reset}
          className="px-4 md:px-5 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 active:bg-gray-800 text-sm transition-colors"
        >
          Réinitialiser
        </button>
        <button
          onClick={toggle}
          className={`px-8 md:px-10 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 ${c.btn}`}
        >
          {running ? '⏸ Pause' : '▶ Démarrer'}
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 md:gap-6 mb-7 md:mb-8 w-full justify-center">
        <div className="text-center bg-gray-800/60 rounded-xl px-5 md:px-6 py-3 flex-1 max-w-[140px]">
          <p className="text-xl md:text-2xl font-bold text-white">{sessions}</p>
          <p className="text-xs text-gray-400">Sessions</p>
        </div>
        <div className="text-center bg-gray-800/60 rounded-xl px-5 md:px-6 py-3 flex-1 max-w-[140px]">
          <p className="text-xl md:text-2xl font-bold text-white">{Math.round(sessions * 25)}m</p>
          <p className="text-xs text-gray-400">Temps focus</p>
        </div>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="w-full">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Historique</p>
          <div className="space-y-1.5">
            {log.map((entry, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-800/60 rounded-lg px-3 py-2 text-sm">
                <span className="text-gray-300">{entry.label}</span>
                <span className="text-gray-500 text-xs">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
