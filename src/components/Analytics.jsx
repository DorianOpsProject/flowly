import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/client'

function StatCard({ label, value, sub, icon, color }) {
  const colors = {
    violet: 'from-violet-600/20 to-violet-800/10 border-violet-700/40',
    blue: 'from-blue-600/20 to-blue-800/10 border-blue-700/40',
    green: 'from-green-600/20 to-green-800/10 border-green-700/40',
    orange: 'from-orange-600/20 to-orange-800/10 border-orange-700/40',
  }
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-300 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </motion.div>
  )
}

function BarChart({ data, max, color }) {
  if (!data?.length) return <p className="text-gray-600 text-sm text-center py-4">Pas encore de données</p>
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d, i) => {
        const h = max > 0 ? Math.round((d.total / max) * 80) : 4
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full ${color} rounded-t`}
              style={{ height: `${Math.max(h, 4)}px`, transition: 'height 0.5s ease' }}
              title={`${d.total}min`}
            />
            <span className="text-[10px] text-gray-600">{d.day?.slice(5)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
    </div>
  )

  const taskDone = data?.taskStats?.find(t => t.status === 'done')?.count || 0
  const taskTodo = data?.taskStats?.find(t => t.status === 'todo')?.count || 0
  const taskProgress = data?.taskStats?.find(t => t.status === 'inProgress')?.count || 0
  const totalTasks = taskDone + taskTodo + taskProgress
  const completionRate = totalTasks > 0 ? Math.round((taskDone / totalTasks) * 100) : 0

  const focusMin = data?.focusToday?.total || 0
  const focusH = Math.floor(focusMin / 60)
  const focusM = focusMin % 60
  const focusStr = focusH > 0 ? `${focusH}h ${focusM}m` : `${focusM}m`

  const weekMax = Math.max(...(data?.focusWeek?.map(d => d.total) || [1]))
  const timesheetMin = data?.totalTimeWeek?.total || 0
  const timesheetH = Math.floor(timesheetMin / 60)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Tableau de bord analytique</h2>
        <p className="text-gray-400 text-sm">Votre productivité de la semaine</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Focus aujourd'hui" value={focusStr || '0m'} sub={`${data?.focusToday?.count || 0} sessions`} icon="⏱" color="violet" />
        <StatCard label="Tâches terminées" value={`${completionRate}%`} sub={`${taskDone}/${totalTasks} tâches`} icon="✅" color="green" />
        <StatCard label="Notes créées" value={data?.notesCount?.count || 0} icon="📝" color="blue" />
        <StatCard label="Temps tracké (semaine)" value={`${timesheetH}h`} sub={`${timesheetMin}min au total`} icon="⌚" color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-200 mb-4">Sessions Focus — 7 derniers jours</h3>
          <BarChart data={data?.focusWeek} max={weekMax} color="bg-violet-600" />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-200 mb-4">Temps par projet (semaine)</h3>
          {data?.timesheetWeek?.length ? (
            <div className="space-y-3">
              {data.timesheetWeek.map((p, i) => {
                const maxP = data.timesheetWeek[0]?.total || 1
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 truncate">{p.project}</span>
                      <span className="text-gray-500">{Math.floor(p.total / 60)}h {p.total % 60}m</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.total / maxP) * 100}%` }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                        className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-6">Démarrez le timesheet pour voir vos données</p>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-200 mb-4">Répartition des tâches</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'À faire', value: taskTodo, color: 'text-gray-400', bg: 'bg-gray-700' },
            { label: 'En cours', value: taskProgress, color: 'text-indigo-400', bg: 'bg-indigo-600' },
            { label: 'Terminées', value: taskDone, color: 'text-green-400', bg: 'bg-green-600' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className={`text-sm ${s.color}`}>{s.label}</div>
              <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: totalTasks > 0 ? `${(s.value / totalTasks) * 100}%` : '0%' }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className={`h-full ${s.bg} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
