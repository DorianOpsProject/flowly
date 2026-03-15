import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

const COLORS = ['violet', 'blue', 'green', 'orange', 'pink']
const ICONS = ['🎯', '💪', '📚', '🏃', '💡', '🧘', '✍️', '🎨', '🚀', '❤️']
const TYPE_LABELS = { daily: 'Quotidien', weekly: 'Hebdomadaire', monthly: 'Mensuel' }

const colorMap = {
  violet: { bar: 'bg-violet-600', text: 'text-violet-400', dot: 'bg-violet-500', border: 'border-violet-800/40 bg-violet-950/20' },
  blue:   { bar: 'bg-blue-600',   text: 'text-blue-400',   dot: 'bg-blue-500',   border: 'border-blue-800/40   bg-blue-950/20' },
  green:  { bar: 'bg-green-600',  text: 'text-green-400',  dot: 'bg-green-500',  border: 'border-green-800/40  bg-green-950/20' },
  orange: { bar: 'bg-orange-600', text: 'text-orange-400', dot: 'bg-orange-500', border: 'border-orange-800/40 bg-orange-950/20' },
  pink:   { bar: 'bg-pink-600',   text: 'text-pink-400',   dot: 'bg-pink-500',   border: 'border-pink-800/40   bg-pink-950/20' },
}

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'daily', target: 1, color: 'violet', icon: '🎯' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/goals').then(r => setGoals(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function addGoal() {
    if (!form.title.trim()) return toast.error('Titre requis')
    setSaving(true)
    try {
      const { data } = await api.post('/goals', form)
      setGoals(g => [data, ...g])
      setShowModal(false)
      setForm({ title: '', type: 'daily', target: 1, color: 'violet', icon: '🎯' })
      toast.success('Objectif créé !')
    } catch { toast.error('Erreur') } finally { setSaving(false) }
  }

  async function increment(goal) {
    const next = Math.min(goal.current + 1, goal.target)
    try {
      const { data } = await api.put(`/goals/${goal.id}`, { current: next })
      setGoals(g => g.map(x => x.id === goal.id ? data : x))
      if (next >= goal.target) toast.success(`"${goal.title}" atteint ! 🎉`)
    } catch { toast.error('Erreur') }
  }

  async function resetGoal(goal) {
    try {
      const { data } = await api.put(`/goals/${goal.id}`, { current: 0 })
      setGoals(g => g.map(x => x.id === goal.id ? data : x))
    } catch { toast.error('Erreur') }
  }

  async function deleteGoal(id) {
    try {
      await api.delete(`/goals/${id}`)
      setGoals(g => g.filter(x => x.id !== id))
    } catch { toast.error('Erreur') }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-white">Objectifs & Habitudes</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Suivez vos progrès</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          + Objectif
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-gray-400 mb-5 text-sm">Aucun objectif pour l'instant</p>
          <button onClick={() => setShowModal(true)}
            className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white px-5 py-3 rounded-xl text-sm font-medium transition-all">
            Créer mon premier objectif
          </button>
        </div>
      ) : (
        /* 1 col on mobile, 2 on sm, 3 on lg */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {goals.map(goal => {
              const c = colorMap[goal.color] || colorMap.violet
              const pct = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0
              const done = goal.current >= goal.target
              return (
                <motion.div key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className={`border rounded-2xl p-4 sm:p-5 group relative ${c.border}`}>
                  <button onClick={() => deleteGoal(goal.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs p-1">✕</button>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{goal.title}</p>
                      <p className="text-xs text-gray-500">{TYPE_LABELS[goal.type]}</p>
                    </div>
                    {done && <span className="text-green-400 text-xs font-medium">✓</span>}
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">{goal.current} / {goal.target}</span>
                      <span className={c.text}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
                        className={`h-full ${c.bar} rounded-full`} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => increment(goal)} disabled={done}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                        done ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : `${c.bar} text-white hover:opacity-90`
                      }`}>
                      {done ? 'Atteint !' : '+ Progresser'}
                    </button>
                    <button onClick={() => resetGoal(goal)}
                      className="px-3 py-2.5 border border-gray-700 rounded-xl text-gray-500 hover:text-gray-300 text-sm transition-colors active:scale-95">
                      ↺
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add modal — slides up from bottom on mobile */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:items-center sm:justify-center z-50"
            onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-gray-900 border-t sm:border border-gray-700 rounded-t-3xl sm:rounded-2xl p-5 pb-8 sm:pb-5 w-full sm:max-w-md shadow-xl"
              onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5 sm:hidden" />
              <h3 className="font-bold text-white mb-5">Nouvel objectif</h3>

              <div className="space-y-4">
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Titre de l'objectif..." autoFocus
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-600" />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none">
                      <option value="daily">Quotidien</option>
                      <option value="weekly">Hebdo</option>
                      <option value="monthly">Mensuel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Cible</label>
                    <input type="number" min={1} value={form.target}
                      onChange={e => setForm(f => ({ ...f, target: Number(e.target.value) }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Icône</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map(ic => (
                      <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                        className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all active:scale-90 ${form.icon === ic ? 'bg-violet-600 ring-2 ring-violet-400' : 'bg-gray-800'}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Couleur</label>
                  <div className="flex gap-3">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                        className={`w-8 h-8 rounded-full ${colorMap[c].dot} transition-all active:scale-90 ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={addGoal} disabled={saving}
                  className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 active:scale-95 text-white py-3 rounded-xl text-sm font-semibold transition-all">
                  {saving ? '...' : 'Créer l\'objectif'}
                </button>
                <button onClick={() => setShowModal(false)}
                  className="px-4 border border-gray-700 rounded-xl text-gray-400 text-sm transition-colors">
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
