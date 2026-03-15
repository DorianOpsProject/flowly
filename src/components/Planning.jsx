import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)
const COLORS = ['bg-violet-700 border-violet-500', 'bg-blue-700 border-blue-500', 'bg-green-700 border-green-500', 'bg-orange-700 border-orange-500', 'bg-pink-700 border-pink-500']

const today = new Date()
const currentDayOfWeek = (today.getDay() + 6) % 7

function getWeekDates(offset = 0) {
  const start = new Date(today)
  const diff = (today.getDay() + 6) % 7
  start.setDate(today.getDate() - diff + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export default function Planning() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ title: '', day: 0, start: 9, end: 10, color: 0 })

  useEffect(() => {
    api.get('/planning').then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function openAdd(day, hour) {
    setForm({ title: '', day, start: hour, end: hour + 1, color: 0 })
    setModal({ type: 'add' })
  }

  function openEdit(event) {
    setForm({ title: event.title, day: event.day_index, start: event.start_hour, end: event.end_hour, color: event.color })
    setModal({ type: 'edit', id: event.id })
  }

  async function save() {
    if (!form.title.trim()) return
    try {
      if (modal.type === 'add') {
        const { data } = await api.post('/planning', { title: form.title, day_index: form.day, start_hour: form.start, end_hour: form.end, color: form.color, week_offset: weekOffset })
        setEvents(prev => [...prev, data])
      } else {
        const { data } = await api.put(`/planning/${modal.id}`, { title: form.title, day_index: form.day, start_hour: form.start, end_hour: form.end, color: form.color, week_offset: weekOffset })
        setEvents(prev => prev.map(e => e.id === modal.id ? data : e))
      }
      setModal(null)
      toast.success(modal.type === 'add' ? 'Événement ajouté' : 'Événement modifié')
    } catch { toast.error('Erreur') }
  }

  async function deleteEvent(id) {
    try {
      await api.delete(`/planning/${id}`)
      setEvents(prev => prev.filter(e => e.id !== id))
      setModal(null)
      toast.success('Événement supprimé')
    } catch { toast.error('Erreur') }
  }

  const weekDates = getWeekDates(weekOffset)
  const weekEvents = events.filter(e => (e.week_offset ?? 0) === weekOffset)
  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(weekDates[0])

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" /></div>

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-4 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(o => o - 1)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">←</button>
          <button onClick={() => setWeekOffset(0)} className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">Aujourd&apos;hui</button>
          <button onClick={() => setWeekOffset(o => o + 1)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">→</button>
          <span className="text-sm text-gray-300 capitalize">{monthLabel}</span>
        </div>
        <button onClick={() => { setForm({ title: '', day: 0, start: 9, end: 10, color: 0 }); setModal({ type: 'add' }) }}
          className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105">
          + Événement
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="grid min-w-[600px]" style={{ gridTemplateColumns: '48px repeat(7, 1fr)' }}>
          <div />
          {DAYS.map((day, i) => {
            const d = weekDates[i]
            const isToday = weekOffset === 0 && i === currentDayOfWeek
            return (
              <div key={day} className={`text-center py-3 text-sm border-b border-gray-800 ${isToday ? 'text-violet-400' : 'text-gray-400'}`}>
                <div className="font-medium">{day}</div>
                <div className={`text-base sm:text-lg font-bold mt-0.5 ${isToday ? 'text-violet-300' : 'text-gray-300'}`}>{d.getDate()}</div>
              </div>
            )
          })}

          {HOURS.map(hour => (
            <>
              <div key={`h-${hour}`} className="text-xs text-gray-600 pt-2 pr-2 text-right border-t border-gray-800/50">{hour}h</div>
              {DAYS.map((_, dayIdx) => {
                const cellEvents = weekEvents.filter(e => e.day_index === dayIdx && e.start_hour === hour)
                const isToday = weekOffset === 0 && dayIdx === currentDayOfWeek
                return (
                  <div key={`${hour}-${dayIdx}`} onClick={() => openAdd(dayIdx, hour)}
                    className={`relative border-t border-l border-gray-800/50 h-12 sm:h-14 cursor-pointer transition-colors ${isToday ? 'bg-violet-950/10' : 'hover:bg-gray-800/30'}`}>
                    {cellEvents.map(event => (
                      <button key={event.id} onClick={e => { e.stopPropagation(); openEdit(event) }}
                        className={`absolute inset-x-0.5 top-0.5 rounded-md text-[10px] sm:text-xs text-white font-medium px-1.5 py-0.5 border-l-2 text-left overflow-hidden ${COLORS[event.color] || COLORS[0]}`}
                        style={{ height: `${(event.end_hour - event.start_hour) * (window.innerWidth < 640 ? 48 : 56) - 4}px`, zIndex: 1 }}>
                        {event.title}
                      </button>
                    ))}
                  </div>
                )
              })}
            </>
          ))}
        </motion.div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setModal(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-xs sm:max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-white mb-4">{modal.type === 'add' ? 'Nouvel événement' : "Modifier l'événement"}</h3>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Titre..." autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600 mb-3" />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Jour</label>
                <select value={form.day} onChange={e => setForm(f => ({ ...f, day: Number(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Couleur</label>
                <div className="flex gap-1.5 pt-2">
                  {COLORS.map((c, i) => (
                    <button key={i} onClick={() => setForm(f => ({ ...f, color: i }))}
                      className={`w-5 h-5 rounded-full ${c.split(' ')[0]} ${form.color === i ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Début</label>
                <select value={form.start} onChange={e => setForm(f => ({ ...f, start: Number(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                  {HOURS.map(h => <option key={h} value={h}>{h}h00</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Fin</label>
                <select value={form.end} onChange={e => setForm(f => ({ ...f, end: Number(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                  {HOURS.filter(h => h > form.start).map(h => <option key={h} value={h}>{h}h00</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                {modal.type === 'add' ? 'Ajouter' : 'Sauvegarder'}
              </button>
              {modal.type === 'edit' && (
                <button onClick={() => deleteEvent(modal.id)} className="px-4 py-2.5 border border-gray-700 hover:border-red-700 text-gray-400 hover:text-red-400 rounded-xl text-sm transition-colors">
                  Supprimer
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
