import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

const COLORS = [
  { key: 'violet', bg: 'bg-violet-950/40', border: 'border-violet-800/40', dot: 'bg-violet-500', ring: 'ring-violet-600' },
  { key: 'blue',   bg: 'bg-blue-950/40',   border: 'border-blue-800/40',   dot: 'bg-blue-500',   ring: 'ring-blue-600' },
  { key: 'green',  bg: 'bg-green-950/40',  border: 'border-green-800/40',  dot: 'bg-green-500',  ring: 'ring-green-600' },
  { key: 'yellow', bg: 'bg-yellow-950/40', border: 'border-yellow-800/40', dot: 'bg-yellow-500', ring: 'ring-yellow-600' },
]
const colorFor = key => COLORS.find(c => c.key === key) || COLORS[0]

function fmtDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

/* ── Note list item ─────────────────────────────────── */
function NoteItem({ note, onSelect, selected }) {
  const col = colorFor(note.color)
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(note)}
      className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] ${col.bg} ${col.border} ${selected?.id === note.id ? `ring-2 ${col.ring}` : ''}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`} />
        <span className="text-sm font-semibold text-white flex-1 truncate">{note.title || 'Sans titre'}</span>
        {note.pinned ? <span className="text-yellow-400 text-xs">📌</span> : null}
      </div>
      <p className="text-xs text-gray-400 truncate pl-4 leading-relaxed">{note.content?.split('\n')[0] || 'Vide'}</p>
      <p className="text-xs text-gray-600 pl-4 mt-1.5">{fmtDate(note.updated_at)}</p>
    </motion.button>
  )
}

/* ── Note editor ────────────────────────────────────── */
function NoteEditor({ note, onSave, onCancel, onDelete }) {
  const [draft, setDraft] = useState({
    title: note?.title || '',
    content: note?.content || '',
    color: note?.color || 'violet',
  })
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!draft.title.trim() && !draft.content.trim()) return
    setSaving(true)
    try { await onSave(draft) }
    finally { setSaving(false) }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors p-1 -ml-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <input
          value={draft.title}
          onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
          placeholder="Titre..."
          className="flex-1 bg-transparent text-base font-semibold text-white placeholder-gray-600 focus:outline-none"
          autoFocus
        />
        {/* Color picker */}
        <div className="flex gap-1.5">
          {COLORS.map(c => (
            <button key={c.key} onClick={() => setDraft(d => ({ ...d, color: c.key }))}
              className={`w-5 h-5 rounded-full ${c.dot} transition-all ${draft.color === c.key ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-950 scale-110' : 'opacity-60 hover:opacity-100'}`} />
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={draft.content}
        onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
        placeholder="Écrivez ici..."
        className="flex-1 bg-transparent text-gray-300 text-sm leading-relaxed resize-none focus:outline-none p-4 placeholder-gray-600"
      />

      {/* Bottom actions */}
      <div className="flex gap-2 p-4 border-t border-gray-800 flex-shrink-0">
        <button onClick={save} disabled={saving}
          className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-colors active:scale-95">
          {saving ? '...' : 'Sauvegarder'}
        </button>
        {note && (
          <button onClick={onDelete}
            className="px-4 py-3 border border-gray-700 hover:border-red-700 text-gray-400 hover:text-red-400 rounded-xl text-sm transition-colors active:scale-95">
            🗑
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Note detail (read mode) ────────────────────────── */
function NoteDetail({ note, onEdit, onDelete, onBack, onPin }) {
  const col = colorFor(note.color)
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors p-1 -ml-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-white truncate">{note.title || 'Sans titre'}</h2>
          <p className="text-xs text-gray-500">{fmtDate(note.updated_at)}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={onPin} className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-base">
            {note.pinned ? '📌' : '📍'}
          </button>
          <button onClick={onEdit} className="p-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300">
            Éditer
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {note.content || <span className="text-gray-600 italic">Note vide</span>}
        </pre>
      </div>
    </div>
  )
}

/* ── Main Notes component ───────────────────────────── */
export default function Notes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)   // note object
  const [editing, setEditing] = useState(false)     // editing or creating
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    api.get('/notes').then(r => setNotes(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = notes
    .filter(n => {
      const q = search.toLowerCase()
      return !q || n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)
    })
    .sort((a, b) => b.pinned - a.pinned)

  async function handleSave(draft) {
    if (isNew) {
      const { data } = await api.post('/notes', draft)
      setNotes(p => [data, ...p])
      setSelected(data)
      setIsNew(false)
      setEditing(false)
      toast.success('Note créée')
    } else {
      const { data } = await api.put(`/notes/${selected.id}`, draft)
      setNotes(p => p.map(n => n.id === selected.id ? data : n))
      setSelected(data)
      setEditing(false)
      toast.success('Note sauvegardée')
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/notes/${selected.id}`)
      setNotes(p => p.filter(n => n.id !== selected.id))
      setSelected(null)
      setEditing(false)
      toast.success('Note supprimée')
    } catch { toast.error('Erreur') }
  }

  async function handlePin() {
    const { data } = await api.put(`/notes/${selected.id}`, { pinned: !selected.pinned })
    setNotes(p => p.map(n => n.id === selected.id ? data : n))
    setSelected(data)
  }

  function startNew() {
    setIsNew(true)
    setSelected(null)
    setEditing(true)
  }

  /* Mobile: show editor/detail as full-screen overlay */
  const showDetail = selected && !editing
  const showEditor = editing

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="flex h-full min-h-0 gap-4 relative">

      {/* ── List panel — always visible on desktop, hidden when detail open on mobile ── */}
      <div className={`
        ${showDetail || showEditor ? 'hidden lg:flex' : 'flex'}
        flex-col w-full lg:w-64 lg:flex-shrink-0 min-h-0
      `}>
        {/* Search + new */}
        <div className="flex gap-2 mb-3 flex-shrink-0">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600" />
          </div>
          <button onClick={startNew}
            className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white w-11 h-11 rounded-xl text-xl font-bold flex items-center justify-center transition-all">
            +
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          <AnimatePresence>
            {filtered.map(note => (
              <NoteItem key={note.id} note={note} selected={selected} onSelect={n => { setSelected(n); setEditing(false) }} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-sm">{search ? 'Aucun résultat' : 'Aucune note'}</p>
              {!search && (
                <button onClick={startNew} className="mt-4 text-violet-400 text-sm hover:text-violet-300">
                  Créer ma première note →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail / Editor — full screen on mobile, right panel on desktop ── */}
      <AnimatePresence>
        {(showDetail || showEditor) && (
          <motion.div
            key={showEditor ? 'editor' : 'detail'}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="
              absolute inset-0 z-10 bg-gray-950
              lg:static lg:z-auto lg:flex-1 lg:bg-gray-900/60
              border border-gray-800 rounded-2xl overflow-hidden flex flex-col
            ">
            {showEditor ? (
              <NoteEditor
                note={isNew ? null : selected}
                onSave={handleSave}
                onCancel={() => { setEditing(false); setIsNew(false) }}
                onDelete={handleDelete}
              />
            ) : (
              <NoteDetail
                note={selected}
                onBack={() => setSelected(null)}
                onEdit={() => setEditing(true)}
                onDelete={handleDelete}
                onPin={handlePin}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop placeholder when nothing selected */}
      {!showDetail && !showEditor && (
        <div className="hidden lg:flex flex-1 items-center justify-center flex-col text-center bg-gray-900/40 border border-gray-800 rounded-2xl">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-gray-400 mb-4">Sélectionnez une note</p>
          <button onClick={startNew} className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            + Nouvelle note
          </button>
        </div>
      )}
    </div>
  )
}
