import { useState } from 'react'

const INITIAL_TASKS = {
  todo: [
    { id: 1, text: 'Préparer la présentation Q2', priority: 'high' },
    { id: 2, text: 'Réviser le contrat client', priority: 'medium' },
    { id: 3, text: 'Mettre à jour le README', priority: 'low' },
  ],
  inProgress: [
    { id: 4, text: 'Développer la fonctionnalité export', priority: 'high' },
    { id: 5, text: 'Appel avec l\'équipe design', priority: 'medium' },
  ],
  done: [
    { id: 6, text: 'Créer les maquettes UI', priority: 'high' },
    { id: 7, text: 'Configurer le pipeline CI', priority: 'low' },
  ],
}

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

function TaskCard({ task, col, onMove, onDelete, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, task.id, col)}
      className="bg-gray-800 border border-gray-700/50 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-gray-600 transition-all group active:scale-95"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-gray-200 leading-snug flex-1">{task.text}</p>
        <button
          onClick={() => onDelete(task.id, col)}
          className="text-gray-600 hover:text-red-400 transition-all text-xs flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 active:opacity-100 p-1 -m-1 rounded"
          aria-label="Supprimer"
        >
          ✕
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        {col !== 'done' && (
          <div className="flex gap-1 ml-auto">
            {COLUMNS.filter(c => c.key !== col).map(c => (
              <button
                key={c.key}
                onClick={() => onMove(task.id, col, c.key)}
                className="text-xs text-gray-500 hover:text-violet-400 active:text-violet-300 transition-colors p-1 rounded hover:bg-gray-700/50"
                title={`Déplacer vers ${c.label}`}
              >
                {c.key === 'todo' ? '←' : c.key === 'inProgress' ? '→' : '✓'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KanbanColumn({ col, tasks, dragOver, onDragOver, onDrop, onDragLeave, onDragStart, onMove, onDelete }) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      className={`flex flex-col bg-gray-900/60 rounded-2xl border-2 transition-colors min-h-0 ${
        dragOver ? 'border-violet-600 bg-violet-950/20' : col.color
      }`}
    >
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 className="font-semibold text-sm text-gray-300">{col.label}</h3>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scroll-smooth-mobile">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            col={col.key}
            onMove={onMove}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-600 text-sm py-8">
            Déposez ici
          </div>
        )}
      </div>
    </div>
  )
}

export default function Kanban() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [dragging, setDragging] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [activeCol, setActiveCol] = useState('todo') // mobile active column

  function addTask() {
    if (!newTaskText.trim()) return
    const id = Date.now()
    setTasks(prev => ({
      ...prev,
      todo: [{ id, text: newTaskText.trim(), priority: newTaskPriority }, ...prev.todo],
    }))
    setNewTaskText('')
    setActiveCol('todo') // switch to todo on mobile after adding
  }

  function moveTask(taskId, fromCol, toCol) {
    const task = tasks[fromCol].find(t => t.id === taskId)
    if (!task || fromCol === toCol) return
    setTasks(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(t => t.id !== taskId),
      [toCol]: [task, ...prev[toCol]],
    }))
  }

  function deleteTask(taskId, col) {
    setTasks(prev => ({ ...prev, [col]: prev[col].filter(t => t.id !== taskId) }))
  }

  function onDragStart(e, taskId, col) {
    setDragging({ taskId, col })
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDrop(e, toCol) {
    e.preventDefault()
    if (dragging && dragging.col !== toCol) {
      moveTask(dragging.taskId, dragging.col, toCol)
    }
    setDragging(null)
    setDragOver(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Add task bar — stacks vertically on mobile */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5">
        <input
          type="text"
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Nouvelle tâche..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600"
        />
        <div className="flex gap-2">
          <select
            value={newTaskPriority}
            onChange={e => setNewTaskPriority(e.target.value)}
            className="flex-1 sm:flex-none bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-violet-600"
          >
            <option value="high">Urgent</option>
            <option value="medium">Moyen</option>
            <option value="low">Faible</option>
          </select>
          <button
            onClick={addTask}
            className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* Mobile column tabs */}
      <div className="flex md:hidden gap-1 mb-4 bg-gray-900/60 p-1 rounded-xl border border-gray-800">
        {COLUMNS.map(col => (
          <button
            key={col.key}
            onClick={() => setActiveCol(col.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
              activeCol === col.key
                ? 'bg-gray-800 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {col.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCol === col.key ? 'bg-violet-600/30 text-violet-300' : 'bg-gray-700/60 text-gray-500'}`}>
              {tasks[col.key].length}
            </span>
          </button>
        ))}
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden md:grid flex-1 grid-cols-3 gap-4 min-h-0">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.key}
            col={col}
            tasks={tasks[col.key]}
            dragOver={dragOver === col.key}
            onDragOver={e => { e.preventDefault(); setDragOver(col.key) }}
            onDrop={e => onDrop(e, col.key)}
            onDragLeave={() => setDragOver(null)}
            onDragStart={onDragStart}
            onMove={moveTask}
            onDelete={deleteTask}
          />
        ))}
      </div>

      {/* Mobile: single active column */}
      <div className="flex md:hidden flex-1 min-h-0">
        {COLUMNS.filter(col => col.key === activeCol).map(col => (
          <KanbanColumn
            key={col.key}
            col={col}
            tasks={tasks[col.key]}
            dragOver={dragOver === col.key}
            onDragOver={e => { e.preventDefault(); setDragOver(col.key) }}
            onDrop={e => onDrop(e, col.key)}
            onDragLeave={() => setDragOver(null)}
            onDragStart={onDragStart}
            onMove={(taskId, from, to) => {
              moveTask(taskId, from, to)
              setActiveCol(to) // follow the moved task
            }}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  )
}
