import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

const PRIORITY_COLORS = {
  high: 'text-red-400 bg-red-950/40 border-red-900/50',
  medium: 'text-yellow-400 bg-yellow-950/40 border-yellow-900/50',
  low: 'text-green-400 bg-green-950/40 border-green-900/50',
}
const PRIORITY_LABELS = { high: 'Urgent', medium: 'Moyen', low: 'Faible' }
const COLUMNS = [
  { key: 'todo', label: 'À faire', color: 'border-gray-700' },
  { key: 'inProgress', label: 'En cours', color: 'border-indigo-700' },
  { key: 'done', label: 'Terminé', color: 'border-green-800' },
]

export default function Kanban() {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] })
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [dragging, setDragging] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tasks').then(r => {
      const byStatus = { todo: [], inProgress: [], done: [] }
      for (const t of r.data) {
        const col = t.status === 'inProgress' ? 'inProgress' : t.status === 'done' ? 'done' : 'todo'
        byStatus[col].push(t)
      }
      setTasks(byStatus)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function addTask() {
    if (!newTaskText.trim()) return
    try {
      const { data } = await api.post('/tasks', { text: newTaskText.trim(), priority: newTaskPriority })
      setTasks(prev => ({ ...prev, todo: [data, ...prev.todo] }))
      setNewTaskText('')
      toast.success('Tâche ajoutée')
    } catch { toast.error('Erreur lors de l\'ajout') }
  }

  async function moveTask(taskId, fromCol, toCol) {
    const task = tasks[fromCol].find(t => t.id === taskId)
    if (!task || fromCol === toCol) return
    try {
      await api.put(`/tasks/${taskId}`, { status: toCol })
      setTasks(prev => ({
        ...prev,
        [fromCol]: prev[fromCol].filter(t => t.id !== taskId),
        [toCol]: [{ ...task, status: toCol }, ...prev[toCol]],
      }))
    } catch { toast.error('Erreur') }
  }

  async function deleteTask(taskId, col) {
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(prev => ({ ...prev, [col]: prev[col].filter(t => t.id !== taskId) }))
    } catch { toast.error('Erreur') }
  }

  function onDragStart(e, taskId, col) {
    setDragging({ taskId, col })
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDrop(e, toCol) {
    e.preventDefault()
    if (dragging && dragging.col !== toCol) moveTask(dragging.taskId, dragging.col, toCol)
    setDragging(null)
    setDragOver(null)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5">
        <input type="text" value={newTaskText} onChange={e => setNewTaskText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Nouvelle tâche..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600" />
        <div className="flex gap-2">
          <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-violet-600">
            <option value="high">Urgent</option>
            <option value="medium">Moyen</option>
            <option value="low">Faible</option>
          </select>
          <button onClick={addTask}
            className="bg-violet-600 hover:bg-violet-500 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105">
            + Ajouter
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-h-0">
        {COLUMNS.map(col => (
          <div key={col.key}
            onDragOver={e => { e.preventDefault(); setDragOver(col.key) }}
            onDrop={e => onDrop(e, col.key)}
            onDragLeave={() => setDragOver(null)}
            className={`flex flex-col bg-gray-900/60 rounded-2xl border-2 transition-colors ${dragOver === col.key ? 'border-violet-600 bg-violet-950/20' : col.color}`}>
            <div className="flex items-center justify-between p-3 sm:p-4 pb-2 sm:pb-3">
              <h3 className="font-semibold text-sm text-gray-300">{col.label}</h3>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{tasks[col.key].length}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-2 sm:px-3 pb-3 space-y-2 min-h-[100px] sm:min-h-0">
              <AnimatePresence>
                {tasks[col.key].map(task => (
                  <motion.div key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    draggable onDragStart={e => onDragStart(e, task.id, col.key)}
                    className="bg-gray-800 border border-gray-700/50 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-gray-600 transition-all group">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-200 leading-snug flex-1">{task.text}</p>
                      <button onClick={() => deleteTask(task.id, col.key)}
                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs flex-shrink-0 mt-0.5">✕</button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      {col.key !== 'done' && (
                        <div className="flex gap-1 ml-auto">
                          {COLUMNS.filter(c => c.key !== col.key).map(c => (
                            <button key={c.key} onClick={() => moveTask(task.id, col.key, c.key)}
                              className="text-xs text-gray-500 hover:text-violet-400 transition-colors px-1"
                              title={`Déplacer vers ${c.label}`}>
                              {c.key === 'todo' ? '←' : c.key === 'inProgress' ? '→' : '✓'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tasks[col.key].length === 0 && (
                <div className="text-center text-gray-600 text-sm py-6">Déposez ici</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
