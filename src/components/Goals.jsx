import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import toast from 'react-hot-toast'

const COLORS = ['violet', 'blue', 'green', 'orange', 'pink']
const ICONS = ['🎯', '💪', '📚', '🏃', '💡', '🧘', '✍️', '🎨', '🚀', '❤️']
const TYPE_LABELS = { daily: 'Quotidien', weekly: 'Hebdomadaire', monthly: 'Mensuel' }

const colorMap = {
  violet: { ring: 'text-violet-400', bar: 'bg-violet-600', bg: 'bg-violet-950/30 border-violet-800/40' },
  blue: { ring: 'text-blue-400', bar: 'bg-blue-600', bg: 'bg-blue-950/30 border-blue-800/40' },
  green: { ring: 'text-green-400', bar: 'bg-green-600', bg: 'bg-green-950/30 border-green-800/40' },
  orange: { ring: 'text-orange-400', bar: 'bg-orange-600', bg: 'bg-orange-950/30 border-orange-800/40' },
  pink: { ring: 'text-pink-400', bar: 'bg-pink-600', bg: 'bg-pink-950/30 border-pink-800/40' },
}

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
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
      setModal(false)
      setForm({ title: '', type: 'daily', target: 1, color: 'violet', icon: '🎯' })
      toast.success('Objectif créé !')
    } catch { toast.error('Erreur') } finally { setSaving(false) }
  }

  async function increment(goal) {
    const next = Math.min(goal.current + 1, goal.target)
    try {
      const { data } = await api.put(`/goals/${goal.id}`, { current: next })
      setGoals(g => g.map(x => x.id === goal.id ? data : x))
      if (next >= goal.target) toast.success(`Objectif "${goal.title}" atteint ! 🎉`)
    } catch { toast.error('Erreur') }
  }

  async function reset(goal) {
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

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Objectifs & Habitudes</h2>
          <p className="text-gray-400 text-sm mt-0.5">Suivez vos progrès quotidiens et hebdomadaires</p>
        </div>
        <button onClick={() => setModal(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105">
          + Nouvel objectif
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-gray-400 mb-6">Aucun objectif pour l'instant</p>
          <button onClick={() => setModal(true)} className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Créer mon premier objectif
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {goals.map(goal => {
              const c = colorMap[goal.color] || colorMap.violet
              const pct = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0
              const done = goal.current >= goal.target
              return (
                <motion.div key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`border rounded-2xl p-5 group relative ${c.bg}`}>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs">
                    ✕
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{goal.title}</p>
                      <p className="text-xs text-gray-500">{TYPE_LABELS[goal.type]}</p>
                    </div>
                    {done && <span className="text-green-400 text-xs">✓ Atteint</span>}
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>{goal.current} / {goal.target}</span>
                      <span className={c.ring}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${c.bar} rounded-full`}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => increment(goal)} disabled={done}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${done ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : `${c.bar} hover:opacity-90 text-white hover:scale-105`}`}>
                      {done ? 'Terminé !' : '+ Progresser'}
                    </button>
                    <button onClick={() => reset(goal)} className="px-3 py-2 border border-gray-700 rounded-lg text-gray-500 hover:text-gray-300 text-xs transition-colors">
                      ↺
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-white mb-5 text-lg">Nouvel objectif</h3>
              <div className="space-y-4">
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Titre de l'objectif..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                      <option value="daily">Quotidien</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Cible</label>
                    <input type="number" min={1} value={form.target}
                      onChange={e => setForm(f => ({ ...f, target: Number(e.target.value) }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Icône</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map(ic => (
                      <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${form.icon === ic ? 'bg-violet-600 ring-2 ring-violet-400' : 'bg-gray-800 hover:bg-gray-700'}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Couleur</label>
                  <div className="flex gap-2">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                        className={`w-7 h-7 rounded-full ${colorMap[c].bar} ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={addGoal} disabled={saving}
                  className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                  {saving ? 'Création...' : 'Créer l\'objectif'}
                </button>
                <button onClick={() => setModal(false)} className="px-4 border border-gray-700 rounded-xl text-gray-400 hover:text-gray-200 text-sm transition-colors">
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
