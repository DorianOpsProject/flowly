import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/client'

function StatCard({ label, value, sub, icon, color, delay = 0 }) {
  const borders = {
    violet: 'border-violet-700/40 bg-violet-950/20',
    blue:   'border-blue-700/40   bg-blue-950/20',
    green:  'border-green-700/40  bg-green-950/20',
    orange: 'border-orange-700/40 bg-orange-950/20',
  }
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`border rounded-2xl p-4 ${borders[color]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
      <p className="text-xs sm:text-sm text-gray-300 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </motion.div>
  )
}

function BarChart({ data, max }) {
  if (!data?.length) return <p className="text-gray-600 text-sm text-center py-8">Pas encore de données</p>
  return (
    <div className="flex items-end gap-1.5 h-20 mt-2">
      {data.map((d, i) => {
        const h = max > 0 ? Math.max(Math.round((d.total / max) * 80), 3) : 3
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-violet-600 rounded-t" style={{ height: `${h}px`, transition: 'height 0.5s ease' }} title={`${d.total}min`} />
            <span className="text-[10px] text-gray-600 truncate w-full text-center">{d.day?.slice(5)}</span>
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

  const taskDone     = data?.taskStats?.find(t => t.status === 'done')?.count || 0
  const taskTodo     = data?.taskStats?.find(t => t.status === 'todo')?.count || 0
  const taskProgress = data?.taskStats?.find(t => t.status === 'inProgress')?.count || 0
  const totalTasks   = taskDone + taskTodo + taskProgress
  const completionRate = totalTasks > 0 ? Math.round((taskDone / totalTasks) * 100) : 0

  const focusMin = data?.focusToday?.total || 0
  const focusStr = focusMin >= 60 ? `${Math.floor(focusMin / 60)}h ${focusMin % 60}m` : `${focusMin}m`
  const weekMax  = Math.max(...(data?.focusWeek?.map(d => d.total) || [1]), 1)
  const timesheetMin = data?.totalTimeWeek?.total || 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-base sm:text-xl font-bold text-white">Analytics</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Productivité de la semaine</p>
      </div>

      {/* Stat cards — 2 cols mobile, 4 desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Focus aujourd'hui" value={focusStr || '0m'} sub={`${data?.focusToday?.count || 0} sessions`} icon="⏱" color="violet" delay={0} />
        <StatCard label="Taux de complétion" value={`${completionRate}%`} sub={`${taskDone}/${totalTasks} tâches`} icon="✅" color="green" delay={0.05} />
        <StatCard label="Notes créées" value={data?.notesCount?.count || 0} icon="📝" color="blue" delay={0.1} />
        <StatCard label="Temps tracké" value={`${Math.floor(timesheetMin / 60)}h`} sub={`${timesheetMin}min cette semaine`} icon="⌚" color="orange" delay={0.15} />
      </div>

      {/* Charts — stacked on mobile */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5">
        <h3 className="font-semibold text-gray-200 text-sm mb-3">Sessions Focus — 7 derniers jours</h3>
        <BarChart data={data?.focusWeek} max={weekMax} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5">
        <h3 className="font-semibold text-gray-200 text-sm mb-4">Temps par projet (semaine)</h3>
        {data?.timesheetWeek?.length ? (
          <div className="space-y-3">
            {data.timesheetWeek.map((p, i) => {
              const maxP = data.timesheetWeek[0]?.total || 1
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-300 truncate flex-1 mr-2">{p.project}</span>
                    <span className="text-gray-500 flex-shrink-0">{Math.floor(p.total / 60)}h {p.total % 60}m</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(p.total / maxP) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full" />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-sm text-center py-6">Commencez le timesheet pour voir vos données</p>
        )}
      </motion.div>

      {/* Task breakdown */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5">
        <h3 className="font-semibold text-gray-200 text-sm mb-4">Répartition des tâches</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'À faire', value: taskTodo,     bar: 'bg-gray-600' },
            { label: 'En cours', value: taskProgress, bar: 'bg-indigo-600' },
            { label: 'Terminées', value: taskDone,    bar: 'bg-green-600' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-gray-400 mb-2">{s.label}</div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }}
                  animate={{ width: totalTasks > 0 ? `${(s.value / totalTasks) * 100}%` : '0%' }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className={`h-full ${s.bar} rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
