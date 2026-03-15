import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Kanban from './Kanban'
import Timer from './Timer'
import Notes from './Notes'
import Planning from './Planning'
import Analytics from './Analytics'
import Goals from './Goals'
import Timesheet from './Timesheet'
import Chat from './Chat'
import Pricing from './Pricing'

const NAV = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: '⊞' },
  { key: 'tasks', label: 'Tâches', icon: '✓' },
  { key: 'focus', label: 'Focus', icon: '⏱' },
  { key: 'notes', label: 'Notes', icon: '📝' },
  { key: 'planning', label: 'Planning', icon: '📅' },
  { key: 'analytics', label: 'Analytics', icon: '📊' },
  { key: 'goals', label: 'Objectifs', icon: '🎯' },
  { key: 'timesheet', label: 'Timesheet', icon: '⌚' },
  { key: 'chat', label: 'Chat', icon: '💬' },
]

const TITLES = {
  overview: 'Vue d\'ensemble', tasks: 'Gestion des tâches', focus: 'Timer Focus',
  notes: 'Mes notes', planning: 'Planning', analytics: 'Analytics',
  goals: 'Objectifs & Habitudes', timesheet: 'Suivi du temps', chat: 'Chat d\'équipe',
}

function OverviewCard({ label, value, sub, color }) {
  const colors = {
    violet: 'from-violet-600 to-violet-800', blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800', orange: 'from-orange-600 to-orange-800',
  }
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4 sm:p-5`}>
      <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/80 mt-1 font-medium">{label}</p>
      {sub && <p className="text-xs text-white/50 mt-1">{sub}</p>}
    </motion.div>
  )
}

function Overview({ onNavigate }) {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const dayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{greeting} {user?.name?.split(' ')[0] || ''} 👋</h1>
        <p className="text-gray-400 capitalize text-sm sm:text-base">{dayStr}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <OverviewCard label="Tâches à faire" value="5" sub="2 urgentes" color="violet" />
        <OverviewCard label="Focus aujourd'hui" value="1h 20m" sub="Objectif : 4h" color="blue" />
        <OverviewCard label="Notes" value="12" sub="+2 cette semaine" color="green" />
        <OverviewCard label="Événements" value="3" sub="Cette semaine" color="orange" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">Tâches prioritaires</h3>
            <button onClick={() => onNavigate('tasks')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Voir tout →</button>
          </div>
          <div className="space-y-3">
            {[
              { text: 'Préparer la présentation Q2', priority: 'Urgent', done: false },
              { text: 'Réviser le contrat client', priority: 'Moyen', done: false },
              { text: 'Créer les maquettes UI', priority: 'Faible', done: true },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${t.done ? 'bg-violet-600 border-violet-600' : 'border-gray-600'}`}>
                  {t.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-sm flex-1 truncate ${t.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{t.text}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${t.priority === 'Urgent' ? 'bg-red-950/50 text-red-400' : t.priority === 'Moyen' ? 'bg-yellow-950/50 text-yellow-400' : 'bg-green-950/50 text-green-400'}`}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5">
          <h3 className="font-semibold text-gray-200 mb-4">Accès rapide</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {[
              { label: 'Session focus', icon: '⏱', key: 'focus', color: 'bg-blue-950/40 hover:bg-blue-950/60 border-blue-800/50' },
              { label: 'Créer une note', icon: '📝', key: 'notes', color: 'bg-green-950/40 hover:bg-green-950/60 border-green-800/50' },
              { label: 'Ajouter une tâche', icon: '✓', key: 'tasks', color: 'bg-violet-950/40 hover:bg-violet-950/60 border-violet-800/50' },
              { label: 'Voir Analytics', icon: '📊', key: 'analytics', color: 'bg-orange-950/40 hover:bg-orange-950/60 border-orange-800/50' },
            ].map(a => (
              <button key={a.key} onClick={() => onNavigate(a.key)}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border text-left transition-all hover:scale-105 ${a.color}`}>
                <span className="text-lg">{a.icon}</span>
                <span className="text-xs sm:text-sm text-gray-300 font-medium leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ onBack }) {
  const [activeKey, setActiveKey] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  if (activeKey === 'pricing') return <Pricing onBack={() => setActiveKey('overview')} />

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-30 lg:z-auto top-0 left-0
        w-56 h-full flex-shrink-0 bg-gray-900/95 border-r border-gray-800 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-bold text-white">flowly</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-300 p-1">✕</button>
        </div>

        <nav className="flex-1 p-2 sm:p-3 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.key} onClick={() => { setActiveKey(item.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all ${
                activeKey === item.key
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-700/50'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-2 sm:p-3 border-t border-gray-800 space-y-1">
          {user?.plan === 'free' && (
            <button onClick={() => { setActiveKey('pricing'); setSidebarOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-950/30 transition-all">
              ⭐ Passer au Pro — 9€/mois
            </button>
          )}
          {user?.plan && user.plan !== 'free' && (
            <div className="px-3 py-1.5 rounded-lg bg-violet-900/20 text-violet-300 text-xs text-center capitalize">
              Plan {user.plan} ✓
            </div>
          )}
          <button onClick={() => { logout(); onBack() }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-all">
            ← Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="flex-shrink-0 px-4 sm:px-8 py-4 sm:py-5 border-b border-gray-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white">{TITLES[activeKey]}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-white font-medium">{user?.name}</span>
              <span className="text-[10px] text-gray-500 capitalize">{user?.plan || 'free'}</span>
            </div>
            <div onClick={() => setActiveKey('pricing')}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-violet-400 transition-all">
              <span className="text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-auto ${activeKey === 'chat' ? 'p-3 sm:p-4' : 'p-4 sm:p-6 lg:p-8'}`}>
          <AnimatePresence mode="wait">
            <motion.div key={activeKey}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full">
              {activeKey === 'overview' && <Overview onNavigate={setActiveKey} />}
              {activeKey === 'tasks' && <Kanban />}
              {activeKey === 'focus' && <div className="flex flex-col items-center pt-4"><Timer /></div>}
              {activeKey === 'notes' && <Notes />}
              {activeKey === 'planning' && <Planning />}
              {activeKey === 'analytics' && <Analytics />}
              {activeKey === 'goals' && <Goals />}
              {activeKey === 'timesheet' && <Timesheet />}
              {activeKey === 'chat' && <div className="h-full" style={{ height: 'calc(100vh - 120px)' }}><Chat /></div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
