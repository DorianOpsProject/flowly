import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

const COLORS = [
  { key: 'violet', bg: 'bg-violet-950/40', border: 'border-violet-800/50', dot: 'bg-violet-500' },
  { key: 'blue', bg: 'bg-blue-950/40', border: 'border-blue-800/50', dot: 'bg-blue-500' },
  { key: 'green', bg: 'bg-green-950/40', border: 'border-green-800/50', dot: 'bg-green-500' },
  { key: 'yellow', bg: 'bg-yellow-950/40', border: 'border-yellow-800/50', dot: 'bg-yellow-500' },
]

function colorFor(key) { return COLORS.find(c => c.key === key) || COLORS[0] }

function fmtDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ title: '', content: '', color: 'violet' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/notes').then(r => setNotes(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = notes.filter(n => {
    const q = search.toLowerCase()
    return !q || n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)
  }).sort((a, b) => b.pinned - a.pinned)

  function startNew() {
    setDraft({ title: '', content: '', color: 'violet' })
    setSelected(null)
    setEditing(true)
  }

  async function saveNote() {
    if (!draft.title.trim() && !draft.content.trim()) return
    setSaving(true)
    try {
      if (selected) {
        const { data } = await api.put(`/notes/${selected.id}`, draft)
        setNotes(prev => prev.map(n => n.id === selected.id ? data : n))
        setSelected(data)
      } else {
        const { data } = await api.post('/notes', draft)
        setNotes(prev => [data, ...prev])
        setSelected(data)
      }
      setEditing(false)
      toast.success('Note sauvegardée')
    } catch { toast.error('Erreur') } finally { setSaving(false) }
  }

  async function deleteNote(id) {
    try {
      await api.delete(`/notes/${id}`)
      setNotes(prev => prev.filter(n => n.id !== id))
      setSelected(null)
      setEditing(false)
      toast.success('Note supprimée')
    } catch { toast.error('Erreur') }
  }

  async function togglePin(id) {
    const note = notes.find(n => n.id === id)
    if (!note) return
    try {
      const { data } = await api.put(`/notes/${id}`, { pinned: !note.pinned })
      setNotes(prev => prev.map(n => n.id === id ? data : n))
      if (selected?.id === id) setSelected(data)
    } catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" /></div>

  return (
    <div className="h-full flex flex-col sm:flex-row gap-4 min-h-0">
      {/* Sidebar */}
      <div className={`${selected || editing ? 'hidden sm:flex' : 'flex'} w-full sm:w-64 flex-col flex-shrink-0`}>
        <div className="flex gap-2 mb-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600" />
          <button onClick={startNew} className="bg-violet-600 hover:bg-violet-500 text-white px-3 rounded-xl text-sm transition-colors">+</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          <AnimatePresence>
            {filtered.map(note => {
              const col = colorFor(note.color)
              return (
                <motion.button key={note.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  onClick={() => { setSelected(note); setEditing(false) }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${col.bg} ${col.border} ${selected?.id === note.id ? 'ring-2 ring-violet-600' : 'hover:ring-1 hover:ring-gray-600'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`} />
                    <span className="text-sm font-medium text-white truncate flex-1">{note.title || 'Sans titre'}</span>
                    {note.pinned ? <span className="text-yellow-400 text-xs">📌</span> : null}
                  </div>
                  <p className="text-xs text-gray-400 truncate pl-4">{note.content?.split('\n')[0]}</p>
                  <p className="text-xs text-gray-600 pl-4 mt-1">{fmtDate(note.updated_at)}</p>
                </motion.button>
              )
            })}
          </AnimatePresence>
          {filtered.length === 0 && <p className="text-center text-gray-600 text-sm py-8">Aucune note</p>}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 bg-gray-900/60 rounded-2xl border border-gray-800 flex flex-col min-h-0 overflow-hidden">
        {editing ? (
          <div className="flex flex-col h-full p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => { setEditing(false); if (!selected) setSelected(null) }} className="sm:hidden text-gray-400 hover:text-white mr-1">←</button>
              <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="Titre de la note..."
                className="flex-1 bg-transparent text-xl font-semibold text-white placeholder-gray-600 focus:outline-none" />
              <div className="flex gap-1.5">
                {COLORS.map(c => (
                  <button key={c.key} onClick={() => setDraft(d => ({ ...d, color: c.key }))}
                    className={`w-4 h-4 rounded-full ${c.dot} ${draft.color === c.key ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : ''}`} />
                ))}
              </div>
            </div>
            <textarea value={draft.content} onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
              placeholder="Écrivez votre note..."
              className="flex-1 bg-transparent text-gray-300 text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-600" />
            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <button onClick={saveNote} disabled={saving}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button onClick={() => { setEditing(false); }} className="text-gray-400 hover:text-gray-200 px-4 py-2 text-sm transition-colors">Annuler</button>
            </div>
          </div>
        ) : selected ? (
          <div className="flex flex-col h-full p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button onClick={() => setSelected(null)} className="sm:hidden text-gray-400 hover:text-white flex-shrink-0">←</button>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-1 truncate">{selected.title || 'Sans titre'}</h2>
                  <p className="text-xs text-gray-500">{fmtDate(selected.updated_at)}</p>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <button onClick={() => togglePin(selected.id)}
                  className="text-gray-500 hover:text-yellow-400 transition-colors text-xs sm:text-sm px-2 py-1 rounded-lg hover:bg-gray-800">
                  {selected.pinned ? '📌' : '📌'}
                </button>
                <button onClick={() => { setDraft({ title: selected.title, content: selected.content, color: selected.color }); setEditing(true) }}
                  className="text-gray-400 hover:text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                  Modifier
                </button>
                <button onClick={() => deleteNote(selected.id)}
                  className="text-gray-500 hover:text-red-400 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{selected.content}</pre>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-400 mb-4">Sélectionnez une note ou créez-en une nouvelle</p>
            <button onClick={startNew} className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
              + Nouvelle note
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
