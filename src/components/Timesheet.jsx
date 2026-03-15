import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

function fmt(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function fmtDuration(min) {
  if (!min) return '0m'
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m}m`
}

export default function Timesheet() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [project, setProject] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    api.get('/timesheet').then(r => setEntries(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  async function startTimer() {
    if (!project.trim()) return toast.error('Indiquez un projet')
    const now = new Date().toISOString()
    setStartTime(now)
    setElapsed(0)
    setRunning(true)
    toast.success('Chronomètre démarré')
  }

  async function stopTimer() {
    setRunning(false)
    if (!startTime) return
    const endTime = new Date().toISOString()
    const durationMin = Math.round(elapsed / 60)
    try {
      const { data } = await api.post('/timesheet', {
        project,
        description,
        start_time: startTime,
        end_time: endTime,
        duration: durationMin,
      })
      setEntries(e => [data, ...e])
      toast.success(`Session enregistrée : ${fmtDuration(durationMin)}`)
    } catch { toast.error('Erreur lors de l\'enregistrement') }
    setElapsed(0)
    setStartTime(null)
    setDescription('')
  }

  async function deleteEntry(id) {
    try {
      await api.delete(`/timesheet/${id}`)
      setEntries(e => e.filter(x => x.id !== id))
    } catch { toast.error('Erreur') }
  }

  const totalToday = entries
    .filter(e => e.created_at?.slice(0, 10) === new Date().toISOString().slice(0, 10))
    .reduce((sum, e) => sum + (e.duration || 0), 0)

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Suivi du temps</h2>
          <p className="text-gray-400 text-sm mt-0.5">Aujourd'hui : <span className="text-white font-medium">{fmtDuration(totalToday)}</span></p>
        </div>
      </div>

      {/* Timer */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={project}
            onChange={e => setProject(e.target.value)}
            placeholder="Nom du projet..."
            disabled={running}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 disabled:opacity-60"
          />
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
            disabled={running}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 disabled:opacity-60"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className={`font-mono text-3xl font-bold ${running ? 'text-violet-400' : 'text-gray-500'}`}>
            {fmt(elapsed)}
          </span>
          <button
            onClick={running ? stopTimer : startTimer}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all hover:scale-105 ${running
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-violet-600 hover:bg-violet-500 text-white'}`}
          >
            {running ? '⏹ Arrêter' : '▶ Démarrer'}
          </button>
          {running && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-gray-400">En cours</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Entries */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Historique</h3>
        {entries.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-4xl mb-3">⌚</p>
            <p>Aucune entrée pour l'instant</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {entries.map(entry => (
                <motion.div key={entry.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3 group">
                  <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{entry.project}</p>
                    {entry.description && <p className="text-xs text-gray-500 truncate">{entry.description}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-mono text-violet-400">{fmtDuration(entry.duration)}</p>
                    <p className="text-xs text-gray-600">{entry.created_at?.slice(0, 10)}</p>
                  </div>
                  <button onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 text-xs transition-all ml-2">
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
