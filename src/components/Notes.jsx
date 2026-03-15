import { useState } from 'react'

const INITIAL_NOTES = [
  { id: 1, title: 'Idées pour le projet client', content: 'Revoir le design system\nAjouter un mode sombre\nOptimiser les performances mobile', pinned: true, color: 'violet', date: '15 mars' },
  { id: 2, title: 'Réunion équipe lundi', content: 'Points à aborder :\n- Roadmap Q2\n- Recrutement\n- Budget marketing', pinned: false, color: 'blue', date: '14 mars' },
  { id: 3, title: 'Ressources à lire', content: 'https://overreacted.io\nArticle UX Design\nDocumentation Tailwind v4', pinned: false, color: 'green', date: '13 mars' },
]

const COLORS = [
  { key: 'violet', bg: 'bg-violet-950/40', border: 'border-violet-800/50', dot: 'bg-violet-500' },
  { key: 'blue', bg: 'bg-blue-950/40', border: 'border-blue-800/50', dot: 'bg-blue-500' },
  { key: 'green', bg: 'bg-green-950/40', border: 'border-green-800/50', dot: 'bg-green-500' },
  { key: 'yellow', bg: 'bg-yellow-950/40', border: 'border-yellow-800/50', dot: 'bg-yellow-500' },
]

function colorFor(key) {
  return COLORS.find(c => c.key === key) || COLORS[0]
}

export default function Notes() {
  const [notes, setNotes] = useState(INITIAL_NOTES)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ title: '', content: '', color: 'violet' })

  const filtered = notes
    .filter(n => {
      const q = search.toLowerCase()
      return !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    })
    .sort((a, b) => b.pinned - a.pinned)

  function openNote(note) {
    setSelected(note)
    setEditing(false)
  }

  function startNew() {
    setDraft({ title: '', content: '', color: 'violet' })
    setSelected(null)
    setEditing(true)
  }

  function saveNote() {
    if (!draft.title.trim() && !draft.content.trim()) return
    const now = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    if (selected) {
      setNotes(prev => prev.map(n => n.id === selected.id ? { ...n, ...draft, date: now } : n))
      setSelected({ ...selected, ...draft, date: now })
    } else {
      const newNote = { id: Date.now(), ...draft, pinned: false, date: now }
      setNotes(prev => [newNote, ...prev])
      setSelected(newNote)
    }
    setEditing(false)
  }

  function deleteNote(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
    setSelected(null)
    setEditing(false)
  }

  function togglePin(id) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
    if (selected?.id === id) setSelected(s => ({ ...s, pinned: !s.pinned }))
  }

  function startEdit() {
    setDraft({ title: selected.title, content: selected.content, color: selected.color })
    setEditing(true)
  }

  return (
    <div className="h-full flex gap-4 min-h-0">
      {/* Sidebar */}
      <div className="w-64 flex flex-col flex-shrink-0">
        <div className="flex gap-2 mb-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600"
          />
          <button
            onClick={startNew}
            className="bg-violet-600 hover:bg-violet-500 text-white px-3 rounded-xl text-sm transition-colors"
          >
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.map(note => {
            const col = colorFor(note.color)
            return (
              <button
                key={note.id}
                onClick={() => openNote(note)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${col.bg} ${col.border} ${
                  selected?.id === note.id ? 'ring-2 ring-violet-600' : 'hover:ring-1 hover:ring-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${col.dot}`}></div>
                  <span className="text-sm font-medium text-white truncate flex-1">{note.title || 'Sans titre'}</span>
                  {note.pinned && <span className="text-yellow-400 text-xs">📌</span>}
                </div>
                <p className="text-xs text-gray-400 truncate pl-4">{note.content.split('\n')[0]}</p>
                <p className="text-xs text-gray-600 pl-4 mt-1">{note.date}</p>
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-center text-gray-600 text-sm py-8">Aucune note</p>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 bg-gray-900/60 rounded-2xl border border-gray-800 flex flex-col min-h-0 overflow-hidden">
        {editing ? (
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                value={draft.title}
                onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="Titre de la note..."
                className="flex-1 bg-transparent text-xl font-semibold text-white placeholder-gray-600 focus:outline-none"
              />
              <div className="flex gap-1.5">
                {COLORS.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setDraft(d => ({ ...d, color: c.key }))}
                    className={`w-4 h-4 rounded-full ${c.dot} ${draft.color === c.key ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : ''}`}
                  />
                ))}
              </div>
            </div>
            <textarea
              value={draft.content}
              onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
              placeholder="Écrivez votre note..."
              className="flex-1 bg-transparent text-gray-300 text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-600"
            />
            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <button onClick={saveNote} className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                Sauvegarder
              </button>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-200 px-4 py-2 text-sm transition-colors">
                Annuler
              </button>
            </div>
          </div>
        ) : selected ? (
          <div className="flex flex-col h-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">{selected.title || 'Sans titre'}</h2>
                <p className="text-xs text-gray-500">{selected.date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => togglePin(selected.id)} className="text-gray-500 hover:text-yellow-400 transition-colors text-sm px-2 py-1 rounded-lg hover:bg-gray-800">
                  {selected.pinned ? '📌 Épinglée' : '📌 Épingler'}
                </button>
                <button onClick={startEdit} className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                  Modifier
                </button>
                <button onClick={() => deleteNote(selected.id)} className="text-gray-500 hover:text-red-400 text-sm px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
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
