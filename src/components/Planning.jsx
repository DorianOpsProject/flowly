import { useState } from 'react'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8h → 20h

const COLORS = ['bg-violet-700 border-violet-500', 'bg-blue-700 border-blue-500', 'bg-green-700 border-green-500', 'bg-orange-700 border-orange-500', 'bg-pink-700 border-pink-500']

const INITIAL_EVENTS = [
  { id: 1, title: 'Réunion d\'équipe', day: 0, start: 9, end: 10, color: 0 },
  { id: 2, title: 'Focus block', day: 0, start: 14, end: 16, color: 1 },
  { id: 3, title: 'Call client', day: 1, start: 11, end: 12, color: 2 },
  { id: 4, title: 'Design review', day: 2, start: 10, end: 11, color: 3 },
  { id: 5, title: 'Sprint planning', day: 3, start: 9, end: 10, color: 0 },
  { id: 6, title: 'One-on-one', day: 4, start: 15, end: 16, color: 4 },
]

const today = new Date()
const currentDayOfWeek = (today.getDay() + 6) % 7 // Mon=0

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
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [weekOffset, setWeekOffset] = useState(0)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ title: '', day: 0, start: 9, end: 10, color: 0 })
  const [mobileDay, setMobileDay] = useState(currentDayOfWeek)

  const weekDates = getWeekDates(weekOffset)

  function openAdd(day, hour) {
    setForm({ title: '', day, start: hour, end: hour + 1, color: 0 })
    setModal({ type: 'add' })
  }

  function openEdit(event) {
    setForm({ title: event.title, day: event.day, start: event.start, end: event.end, color: event.color })
    setModal({ type: 'edit', id: event.id })
  }

  function save() {
    if (!form.title.trim()) return
    if (modal.type === 'add') {
      setEvents(prev => [...prev, { id: Date.now(), ...form }])
    } else {
      setEvents(prev => prev.map(e => e.id === modal.id ? { ...e, ...form } : e))
    }
    setModal(null)
  }

  function deleteEvent(id) {
    setEvents(prev => prev.filter(e => e.id !== id))
    setModal(null)
  }

  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(weekDates[0])

  // Mobile day view: events for the selected day, sorted by start time
  const mobileDayEvents = events
    .filter(e => e.day === mobileDay)
    .sort((a, b) => a.start - b.start)

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0 gap-2">
        <div className="flex items-center gap-1 md:gap-3">
          <button onClick={() => setWeekOffset(o => o - 1)} className="p-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 text-gray-400 hover:text-white transition-colors">←</button>
          <button onClick={() => { setWeekOffset(0); setMobileDay(currentDayOfWeek) }} className="text-xs md:text-sm text-gray-400 hover:text-white px-2 md:px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">Aujourd&apos;hui</button>
          <button onClick={() => setWeekOffset(o => o + 1)} className="p-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 text-gray-400 hover:text-white transition-colors">→</button>
          <span className="text-xs md:text-sm text-gray-300 capitalize hidden sm:inline ml-1">{monthLabel}</span>
        </div>
        <button
          onClick={() => { setForm({ title: '', day: mobileDay, start: 9, end: 10, color: 0 }); setModal({ type: 'add' }) }}
          className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors whitespace-nowrap"
        >
          + Événement
        </button>
      </div>

      {/* Mobile: day tabs */}
      <div className="flex md:hidden gap-1 mb-4 flex-shrink-0 overflow-x-auto pb-1 scroll-smooth-mobile">
        {DAYS.map((day, i) => {
          const d = weekDates[i]
          const isToday = weekOffset === 0 && i === currentDayOfWeek
          const hasEvents = events.some(e => e.day === i)
          return (
            <button
              key={day}
              onClick={() => setMobileDay(i)}
              className={`flex flex-col items-center px-3 py-2 rounded-xl flex-shrink-0 transition-all ${
                mobileDay === i
                  ? 'bg-violet-600/30 border border-violet-600/50 text-violet-300'
                  : isToday
                  ? 'bg-gray-800/60 border border-gray-700 text-violet-400'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40 border border-transparent'
              }`}
            >
              <span className="text-[10px] font-medium">{day}</span>
              <span className="text-base font-bold leading-none mt-0.5">{d.getDate()}</span>
              {hasEvents && (
                <span className={`w-1 h-1 rounded-full mt-1 ${mobileDay === i ? 'bg-violet-400' : 'bg-gray-500'}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Desktop: full week grid */}
      <div className="hidden md:block flex-1 overflow-auto min-h-0">
        <div className="grid min-w-[700px]" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
          <div></div>
          {DAYS.map((day, i) => {
            const d = weekDates[i]
            const isToday = weekOffset === 0 && i === currentDayOfWeek
            return (
              <div key={day} className={`text-center py-3 text-sm border-b border-gray-800 ${isToday ? 'text-violet-400' : 'text-gray-400'}`}>
                <div className="font-medium">{day}</div>
                <div className={`text-lg font-bold mt-0.5 ${isToday ? 'text-violet-300' : 'text-gray-300'}`}>
                  {d.getDate()}
                </div>
              </div>
            )
          })}

          {HOURS.map(hour => (
            <>
              <div key={`h-${hour}`} className="text-xs text-gray-600 pt-2 pr-2 text-right border-t border-gray-800/50">{hour}h</div>
              {DAYS.map((_, dayIdx) => {
                const cellEvents = events.filter(e => e.day === dayIdx && e.start === hour)
                const isToday = weekOffset === 0 && dayIdx === currentDayOfWeek
                return (
                  <div
                    key={`${hour}-${dayIdx}`}
                    onClick={() => openAdd(dayIdx, hour)}
                    className={`relative border-t border-l border-gray-800/50 h-14 cursor-pointer transition-colors ${isToday ? 'bg-violet-950/10' : 'hover:bg-gray-800/30'}`}
                  >
                    {cellEvents.map(event => (
                      <button
                        key={event.id}
                        onClick={e => { e.stopPropagation(); openEdit(event) }}
                        className={`absolute inset-x-0.5 top-0.5 rounded-md text-xs text-white font-medium px-2 py-1 border-l-2 text-left overflow-hidden ${COLORS[event.color]}`}
                        style={{ height: `${(event.end - event.start) * 56 - 4}px`, zIndex: 1 }}
                      >
                        {event.title}
                      </button>
                    ))}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>

      {/* Mobile: day event list */}
      <div className="flex md:hidden flex-1 flex-col overflow-y-auto min-h-0 scroll-smooth-mobile">
        {mobileDayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-gray-500 text-sm mb-4">Aucun événement ce jour</p>
            <button
              onClick={() => { setForm({ title: '', day: mobileDay, start: 9, end: 10, color: 0 }); setModal({ type: 'add' }) }}
              className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
            >
              + Ajouter un événement
            </button>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {mobileDayEvents.map(event => (
              <button
                key={event.id}
                onClick={() => openEdit(event)}
                className={`w-full flex items-stretch gap-3 p-4 rounded-2xl border-l-4 bg-gray-900/60 text-left active:scale-98 transition-all border border-gray-800 ${COLORS[event.color].replace('bg-', 'border-l-').split(' ')[0]}`}
                style={{ borderLeftColor: undefined }}
              >
                <div className={`w-1 rounded-full flex-shrink-0 ${COLORS[event.color].split(' ')[0]}`} style={{ minHeight: '100%' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{event.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {event.start}h00 — {event.end}h00 · {event.end - event.start}h
                  </p>
                </div>
                <div className="text-gray-600 text-xs self-center">›</div>
              </button>
            ))}
            {/* Add time slot quick-add for mobile */}
            <div className="border border-dashed border-gray-700 rounded-2xl p-4">
              <p className="text-xs text-gray-600 mb-3 font-medium uppercase tracking-wider">Ajouter un créneau</p>
              <div className="grid grid-cols-4 gap-2">
                {[9, 10, 11, 14, 15, 16, 17, 18].map(h => (
                  <button
                    key={h}
                    onClick={() => openAdd(mobileDay, h)}
                    className="py-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-400 hover:text-white text-xs font-medium transition-colors"
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full sm:w-80 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-semibold text-white mb-4">
              {modal.type === 'add' ? 'Nouvel événement' : 'Modifier l\'événement'}
            </h3>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Titre..."
              autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600 mb-3"
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Jour</label>
                <select value={form.day} onChange={e => setForm(f => ({ ...f, day: Number(e.target.value) }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Couleur</label>
                <div className="flex gap-1.5 pt-2">
                  {COLORS.map((c, i) => (
                    <button key={i} onClick={() => setForm(f => ({ ...f, color: i }))} className={`w-5 h-5 rounded-full ${c.replace('border-', 'bg-').split(' ')[0]} ${form.color === i ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Début</label>
                <select value={form.start} onChange={e => setForm(f => ({ ...f, start: Number(e.target.value) }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                  {HOURS.map(h => <option key={h} value={h}>{h}h00</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Fin</label>
                <select value={form.end} onChange={e => setForm(f => ({ ...f, end: Number(e.target.value) }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                  {HOURS.filter(h => h > form.start).map(h => <option key={h} value={h}>{h}h00</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                {modal.type === 'add' ? 'Ajouter' : 'Sauvegarder'}
              </button>
              {modal.type === 'edit' && (
                <button onClick={() => deleteEvent(modal.id)} className="px-4 py-2.5 border border-gray-700 hover:border-red-700 text-gray-400 hover:text-red-400 active:text-red-300 rounded-xl text-sm transition-colors">
                  🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
