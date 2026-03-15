import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)
const COLORS_CSS = [
  'bg-violet-700 border-violet-500',
  'bg-blue-700 border-blue-500',
  'bg-green-700 border-green-500',
  'bg-orange-700 border-orange-500',
  'bg-pink-700 border-pink-500',
]
const COLORS_DOT = ['bg-violet-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500']

const todayDate = new Date()
const todayDOW = (todayDate.getDay() + 6) % 7  // 0=Mon

function getWeekDates(offset = 0) {
  const start = new Date(todayDate)
  const diff = (todayDate.getDay() + 6) % 7
  start.setDate(todayDate.getDate() - diff + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

/* ── Event modal ─────────────────────────────────────── */
function EventModal({ mode, form, setForm, onSave, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
      onClick={onClose}>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        className="bg-gray-900 border border-gray-700 rounded-t-3xl sm:rounded-2xl p-5 w-full max-w-sm shadow-xl"
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5 sm:hidden" />
        <h3 className="font-semibold text-white mb-4">{mode === 'add' ? 'Nouvel événement' : 'Modifier'}</h3>

        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Titre de l'événement..." autoFocus
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600 mb-3" />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Jour</label>
            <select value={form.day} onChange={e => setForm(f => ({ ...f, day: Number(e.target.value) }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none">
              {DAYS_FR.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Couleur</label>
            <div className="flex gap-2 pt-2.5">
              {COLORS_DOT.map((c, i) => (
                <button key={i} onClick={() => setForm(f => ({ ...f, color: i }))}
                  className={`w-6 h-6 rounded-full ${c} transition-all ${form.color === i ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-110' : 'opacity-60'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Début</label>
            <select value={form.start} onChange={e => setForm(f => ({ ...f, start: Number(e.target.value) }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none">
              {HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fin</label>
            <select value={form.end} onChange={e => setForm(f => ({ ...f, end: Number(e.target.value) }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none">
              {HOURS.filter(h => h > form.start).map(h => <option key={h} value={h}>{h}:00</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onSave}
            className="flex-1 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white py-3 rounded-xl text-sm font-semibold transition-all">
            {mode === 'add' ? 'Ajouter' : 'Sauvegarder'}
          </button>
          {mode === 'edit' && (
            <button onClick={onDelete}
              className="px-4 py-3 border border-gray-700 hover:border-red-700 text-gray-400 hover:text-red-400 rounded-xl text-sm transition-colors active:scale-95">
              🗑
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main Planning ───────────────────────────────────── */
export default function Planning() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  const [modal, setModal] = useState(null)  // null | { type, id? }
  const [form, setForm] = useState({ title: '', day: 0, start: 9, end: 10, color: 0 })
  /* Mobile: show one day at a time */
  const [mobileDay, setMobileDay] = useState(todayDOW)

  useEffect(() => {
    api.get('/planning').then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const weekDates = getWeekDates(weekOffset)
  const weekEvents = events.filter(e => (e.week_offset ?? 0) === weekOffset)

  async function save() {
    if (!form.title.trim()) return
    try {
      if (modal.type === 'add') {
        const { data } = await api.post('/planning', { title: form.title, day_index: form.day, start_hour: form.start, end_hour: form.end, color: form.color, week_offset: weekOffset })
        setEvents(p => [...p, data])
        toast.success('Événement ajouté')
      } else {
        const { data } = await api.put(`/planning/${modal.id}`, { title: form.title, day_index: form.day, start_hour: form.start, end_hour: form.end, color: form.color, week_offset: weekOffset })
        setEvents(p => p.map(e => e.id === modal.id ? data : e))
        toast.success('Modifié')
      }
      setModal(null)
    } catch { toast.error('Erreur') }
  }

  async function deleteEvent(id) {
    try {
      await api.delete(`/planning/${id}`)
      setEvents(p => p.filter(e => e.id !== id))
      setModal(null)
      toast.success('Supprimé')
    } catch { toast.error('Erreur') }
  }

  function openAdd(day, hour) {
    setForm({ title: '', day, start: hour, end: hour + 1, color: 0 })
    setModal({ type: 'add' })
  }

  function openEdit(event) {
    setForm({ title: event.title, day: event.day_index, start: event.start_hour, end: event.end_hour, color: event.color })
    setModal({ type: 'edit', id: event.id })
  }

  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(weekDates[0])

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col h-full min-h-0 gap-3">

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <button onClick={() => setWeekOffset(o => o - 1)}
            className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors text-sm">‹</button>
          <button onClick={() => setWeekOffset(0)}
            className="px-3 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            Aujourd'hui
          </button>
          <button onClick={() => setWeekOffset(o => o + 1)}
            className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors text-sm">›</button>
          <span className="text-sm text-gray-300 capitalize ml-1">{monthLabel}</span>
        </div>
        <button onClick={() => { setForm({ title: '', day: mobileDay, start: 9, end: 10, color: 0 }); setModal({ type: 'add' }) }}
          className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
          + Événement
        </button>
      </div>

      {/* ── Mobile: day tabs + single day view ── */}
      <div className="lg:hidden flex flex-col gap-3 flex-1 min-h-0">
        {/* Day tabs — horizontal scroll */}
        <div className="flex gap-1 overflow-x-auto pb-1 flex-shrink-0 scrollbar-hide">
          {DAYS_SHORT.map((d, i) => {
            const date = weekDates[i]
            const isToday = weekOffset === 0 && i === todayDOW
            const dayEventsCount = weekEvents.filter(e => e.day_index === i).length
            return (
              <button key={d} onClick={() => setMobileDay(i)}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[52px] ${
                  mobileDay === i
                    ? 'bg-violet-600 text-white'
                    : isToday
                    ? 'bg-violet-950/40 text-violet-300 border border-violet-800/50'
                    : 'bg-gray-900/60 text-gray-400 border border-gray-800'
                }`}>
                <span className="text-[11px] font-medium">{d}</span>
                <span className="text-base font-bold leading-tight">{date.getDate()}</span>
                {dayEventsCount > 0 && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${mobileDay === i ? 'bg-white/60' : 'bg-violet-500'}`} />
                )}
              </button>
            )
          })}
        </div>

        {/* Day events list */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {HOURS.map(hour => {
            const ev = weekEvents.filter(e => e.day_index === mobileDay && e.start_hour === hour)
            return (
              <div key={hour} className="flex gap-3 items-start">
                <span className="text-xs text-gray-600 w-10 flex-shrink-0 pt-2.5">{hour}h</span>
                <div className="flex-1">
                  {ev.length > 0 ? ev.map(event => (
                    <button key={event.id} onClick={() => openEdit(event)}
                      className={`w-full text-left rounded-xl border-l-2 px-3 py-2 mb-1 text-xs font-medium text-white active:scale-95 transition-transform ${COLORS_CSS[event.color] || COLORS_CSS[0]}`}>
                      <p className="font-semibold">{event.title}</p>
                      <p className="opacity-70 mt-0.5">{event.start_hour}h — {event.end_hour}h</p>
                    </button>
                  )) : (
                    <button onClick={() => openAdd(mobileDay, hour)}
                      className="w-full h-9 border border-dashed border-gray-800 rounded-xl text-gray-700 text-xs hover:border-gray-700 hover:text-gray-600 transition-colors">
                      +
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Desktop: full week grid ── */}
      <div className="hidden lg:flex flex-col flex-1 min-h-0 overflow-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="grid min-w-[640px]" style={{ gridTemplateColumns: '48px repeat(7, 1fr)' }}>
          <div />
          {DAYS_SHORT.map((d, i) => {
            const date = weekDates[i]
            const isToday = weekOffset === 0 && i === todayDOW
            return (
              <div key={d} className={`text-center py-3 text-sm border-b border-gray-800 ${isToday ? 'text-violet-400' : 'text-gray-400'}`}>
                <div className="font-medium text-xs">{d}</div>
                <div className={`text-xl font-bold mt-0.5 ${isToday ? 'text-violet-300' : 'text-gray-300'}`}>{date.getDate()}</div>
              </div>
            )
          })}
          {HOURS.map(hour => (
            <>
              <div key={`h-${hour}`} className="text-xs text-gray-600 pt-2 pr-2 text-right border-t border-gray-800/50">{hour}h</div>
              {DAYS_SHORT.map((_, dayIdx) => {
                const cellEvents = weekEvents.filter(e => e.day_index === dayIdx && e.start_hour === hour)
                const isToday = weekOffset === 0 && dayIdx === todayDOW
                return (
                  <div key={`${hour}-${dayIdx}`}
                    onClick={() => openAdd(dayIdx, hour)}
                    className={`relative border-t border-l border-gray-800/50 h-14 cursor-pointer transition-colors ${isToday ? 'bg-violet-950/10' : 'hover:bg-gray-800/30'}`}>
                    {cellEvents.map(event => (
                      <button key={event.id} onClick={e => { e.stopPropagation(); openEdit(event) }}
                        className={`absolute inset-x-0.5 top-0.5 rounded-md text-[10px] text-white font-medium px-1.5 py-0.5 border-l-2 text-left overflow-hidden ${COLORS_CSS[event.color] || COLORS_CSS[0]}`}
                        style={{ height: `${(event.end_hour - event.start_hour) * 56 - 4}px`, zIndex: 1 }}>
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

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <EventModal
            mode={modal.type}
            form={form}
            setForm={setForm}
            onSave={save}
            onDelete={() => deleteEvent(modal.id)}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
