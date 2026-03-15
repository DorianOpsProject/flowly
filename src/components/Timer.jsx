import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

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
    api.get('/sessions').then(r => {
      const today = new Date().toISOString().slice(0, 10)
      const todaySessions = r.data.filter(s => s.completed_at?.slice(0, 10) === today && s.mode === 'focus')
      setSessions(todaySessions.length)
      setLog(r.data.slice(0, 10).map(s => ({
        label: s.mode === 'focus' ? 'Session focus terminée' : `Pause ${s.mode === 'short' ? 'courte' : 'longue'}`,
        time: new Date(s.completed_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      })))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (modeIdx === 0) {
              setSessions(n => n + 1)
              const entry = { label: 'Session focus terminée', time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
              setLog(prev => [entry, ...prev.slice(0, 9)])
              api.post('/sessions', { duration: mode.duration / 60, mode: mode.key }).catch(() => {})
              toast.success('🎉 Session focus terminée !')
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

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  const circumference = 2 * Math.PI * 90
  const strokeDash = circumference * (1 - progress)

  const colorMap = {
    violet: { ring: '#7c3aed', text: 'text-violet-400', btn: 'bg-violet-600 hover:bg-violet-500', tab: 'bg-violet-900/40 text-violet-300 border-violet-700' },
    green: { ring: '#16a34a', text: 'text-green-400', btn: 'bg-green-700 hover:bg-green-600', tab: 'bg-green-900/40 text-green-300 border-green-700' },
    blue: { ring: '#1d4ed8', text: 'text-blue-400', btn: 'bg-blue-700 hover:bg-blue-600', tab: 'bg-blue-900/40 text-blue-300 border-blue-700' },
  }
  const c = colorMap[mode.color]

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="flex gap-2 mb-8 sm:mb-10">
        {MODES.map((m, i) => (
          <button key={m.key} onClick={() => selectMode(i)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${i === modeIdx ? colorMap[m.color].tab : 'text-gray-500 border-gray-700 hover:text-gray-300 hover:border-gray-600'}`}>
            {m.label}
          </button>
        ))}
      </div>

      <motion.div className="relative mb-8 sm:mb-10"
        animate={{ scale: running ? [1, 1.01, 1] : 1 }}
        transition={{ repeat: running ? Infinity : 0, duration: 2 }}>
        <svg width="200" height="200" className="-rotate-90 sm:w-[220px] sm:h-[220px]">
          <circle cx="100" cy="100" r="85" fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle cx="100" cy="100" r="85" fill="none" stroke={c.ring} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 85}
            strokeDashoffset={2 * Math.PI * 85 * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-bold font-mono text-white tracking-tight">{mins}:{secs}</span>
          <span className={`text-sm mt-1 ${c.text}`}>{mode.label}</span>
        </div>
      </motion.div>

      <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button onClick={() => { setRunning(false); setSeconds(mode.duration) }}
          className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-sm transition-colors">
          Réinitialiser
        </button>
        <motion.button onClick={() => setRunning(r => !r)} whileTap={{ scale: 0.95 }}
          className={`px-7 sm:px-8 py-2.5 sm:py-3 rounded-xl text-white font-semibold text-sm transition-all hover:scale-105 ${c.btn}`}>
          {running ? '⏸ Pause' : '▶ Démarrer'}
        </motion.button>
      </div>

      <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="text-center bg-gray-800/60 rounded-xl px-5 sm:px-6 py-3">
          <p className="text-xl sm:text-2xl font-bold text-white">{sessions}</p>
          <p className="text-xs text-gray-400">Sessions aujourd&apos;hui</p>
        </div>
        <div className="text-center bg-gray-800/60 rounded-xl px-5 sm:px-6 py-3">
          <p className="text-xl sm:text-2xl font-bold text-white">{Math.round(sessions * 25)}m</p>
          <p className="text-xs text-gray-400">Temps de focus</p>
        </div>
      </div>

      {log.length > 0 && (
        <div className="w-full">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Historique</p>
          <div className="space-y-1.5">
            {log.slice(0, 5).map((entry, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center bg-gray-800/60 rounded-lg px-3 py-2 text-sm">
                <span className="text-gray-300">{entry.label}</span>
                <span className="text-gray-500 text-xs">{entry.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
