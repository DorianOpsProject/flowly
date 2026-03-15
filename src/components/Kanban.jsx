import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

const PRIORITY_COLORS = {
  high:   'text-red-400 bg-red-950/40 border-red-900/50',
  medium: 'text-yellow-400 bg-yellow-950/40 border-yellow-900/50',
  low:    'text-green-400 bg-green-950/40 border-green-900/50',
}
const PRIORITY_LABELS = { high: 'Urgent', medium: 'Moyen', low: 'Faible' }

const COLUMNS = [
  { key: 'todo',       label: 'À faire',   border: 'border-gray-700',   tab: 'text-gray-300' },
  { key: 'inProgress', label: 'En cours',  border: 'border-indigo-700', tab: 'text-indigo-300' },
  { key: 'done',       label: 'Terminé',   border: 'border-green-800',  tab: 'text-green-300' },
]

function TaskCard({ task, col, onMove, onDelete, isDragging, onDragStart }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      draggable
      onDragStart={e => onDragStart(e, task.id, col)}
      className="bg-gray-800 border border-gray-700/50 rounded-xl p-3.5 touch-manipulation group active:scale-95 transition-transform cursor-grab active:cursor-grabbing">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm text-gray-200 leading-snug flex-1">{task.text}</p>
        <button onClick={() => onDelete(task.id, col)}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs flex-shrink-0">✕</button>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        {col !== 'done' && (
          <div className="flex gap-1 ml-auto">
            {COLUMNS.filter(c => c.key !== col).map(c => (
              <button key={c.key} onClick={() => onMove(task.id, col, c.key)}
                className="text-xs text-gray-500 hover:text-violet-400 transition-colors px-2 py-1 rounded-lg hover:bg-gray-700/50"
                title={`→ ${c.label}`}>
                {c.key === 'inProgress' ? '▷' : c.key === 'done' ? '✓' : '←'}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Kanban() {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] })
  const [newText, setNewText] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [dragging, setDragging] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [loading, setLoading] = useState(true)
  /* Mobile: show one column at a time */
  const [mobileCol, setMobileCol] = useState('todo')

  useEffect(() => {
    api.get('/tasks').then(r => {
      const by = { todo: [], inProgress: [], done: [] }
      for (const t of r.data) {
        const k = t.status === 'inProgress' ? 'inProgress' : t.status === 'done' ? 'done' : 'todo'
        by[k].push(t)
      }
      setTasks(by)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function addTask() {
    if (!newText.trim()) return
    try {
      const { data } = await api.post('/tasks', { text: newText.trim(), priority: newPriority })
      setTasks(p => ({ ...p, todo: [data, ...p.todo] }))
      setNewText('')
      setMobileCol('todo')
      toast.success('Tâche ajoutée')
    } catch { toast.error('Erreur') }
  }

  async function moveTask(taskId, fromCol, toCol) {
    const task = tasks[fromCol].find(t => t.id === taskId)
    if (!task || fromCol === toCol) return
    try {
      await api.put(`/tasks/${taskId}`, { status: toCol })
      setTasks(p => ({
        ...p,
        [fromCol]: p[fromCol].filter(t => t.id !== taskId),
        [toCol]: [{ ...task, status: toCol }, ...p[toCol]],
      }))
    } catch { toast.error('Erreur') }
  }

  async function deleteTask(taskId, col) {
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(p => ({ ...p, [col]: p[col].filter(t => t.id !== taskId) }))
    } catch { toast.error('Erreur') }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col h-full gap-4">

      {/* Add task bar */}
      <div className="flex gap-2">
        <input type="text" value={newText} onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Nouvelle tâche..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600" />
        <select value={newPriority} onChange={e => setNewPriority(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 text-sm text-gray-300 focus:outline-none focus:border-violet-600">
          <option value="high">🔴</option>
          <option value="medium">🟡</option>
          <option value="low">🟢</option>
        </select>
        <button onClick={addTask}
          className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all">
          +
        </button>
      </div>

      {/* ── Mobile: column tabs ── */}
      <div className="flex lg:hidden gap-1 bg-gray-900/60 p-1 rounded-2xl border border-gray-800">
        {COLUMNS.map(col => (
          <button key={col.key} onClick={() => setMobileCol(col.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mobileCol === col.key
                ? 'bg-gray-800 text-white shadow-sm'
                : 'text-gray-500'
            }`}>
            {col.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
              mobileCol === col.key ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}>{tasks[col.key].length}</span>
          </button>
        ))}
      </div>

      {/* ── Mobile: single column ── */}
      <div className="lg:hidden flex-1 overflow-y-auto space-y-2 min-h-0">
        <AnimatePresence mode="popLayout">
          {tasks[mobileCol].map(task => (
            <TaskCard key={task.id} task={task} col={mobileCol}
              onMove={moveTask} onDelete={deleteTask}
              onDragStart={() => {}} />
          ))}
        </AnimatePresence>
        {tasks[mobileCol].length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-sm py-16">
            <p className="text-3xl mb-3">
              {mobileCol === 'todo' ? '📋' : mobileCol === 'inProgress' ? '⚡' : '✅'}
            </p>
            <p>{mobileCol === 'done' ? 'Aucune tâche terminée' : 'Aucune tâche ici'}</p>
          </motion.div>
        )}
      </div>

      {/* ── Desktop: 3 columns ── */}
      <div className="hidden lg:grid grid-cols-3 gap-4 flex-1 min-h-0">
        {COLUMNS.map(col => (
          <div key={col.key}
            onDragOver={e => { e.preventDefault(); setDragOver(col.key) }}
            onDrop={e => {
              e.preventDefault()
              if (dragging && dragging.col !== col.key) moveTask(dragging.taskId, dragging.col, col.key)
              setDragging(null); setDragOver(null)
            }}
            onDragLeave={() => setDragOver(null)}
            className={`flex flex-col rounded-2xl border-2 transition-colors ${
              dragOver === col.key ? 'border-violet-600 bg-violet-950/10' : col.border + ' bg-gray-900/40'
            }`}>
            <div className="flex items-center justify-between p-4 pb-3">
              <h3 className={`font-semibold text-sm ${col.tab}`}>{col.label}</h3>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{tasks[col.key].length}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-0">
              <AnimatePresence>
                {tasks[col.key].map(task => (
                  <TaskCard key={task.id} task={task} col={col.key}
                    onMove={moveTask} onDelete={deleteTask}
                    onDragStart={(e, id, c) => { setDragging({ taskId: id, col: c }); e.dataTransfer.effectAllowed = 'move' }} />
                ))}
              </AnimatePresence>
              {tasks[col.key].length === 0 && (
                <div className="text-center text-gray-700 text-sm py-8">Déposez ici</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
