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

/* ── Navigation config ─────────────────────────────── */
const BOTTOM_NAV = [
  { key: 'overview',   label: 'Accueil',  icon: '⊞' },
  { key: 'tasks',      label: 'Tâches',   icon: '✓' },
  { key: 'focus',      label: 'Focus',    icon: '⏱' },
  { key: 'notes',      label: 'Notes',    icon: '📝' },
  { key: 'more',       label: 'Plus',     icon: '···' },
]

const SIDEBAR_NAV = [
  { key: 'overview',   label: 'Vue d\'ensemble',   icon: '⊞' },
  { key: 'tasks',      label: 'Tâches',             icon: '✓' },
  { key: 'focus',      label: 'Focus',              icon: '⏱' },
  { key: 'notes',      label: 'Notes',              icon: '📝' },
  { key: 'planning',   label: 'Planning',           icon: '📅' },
  { key: 'analytics',  label: 'Analytics',          icon: '📊' },
  { key: 'goals',      label: 'Objectifs',          icon: '🎯' },
  { key: 'timesheet',  label: 'Timesheet',          icon: '⌚' },
  { key: 'chat',       label: 'Chat',               icon: '💬' },
]

const MORE_ITEMS = [
  { key: 'planning',   label: 'Planning',    icon: '📅' },
  { key: 'analytics',  label: 'Analytics',   icon: '📊' },
  { key: 'goals',      label: 'Objectifs',   icon: '🎯' },
  { key: 'timesheet',  label: 'Timesheet',   icon: '⌚' },
  { key: 'chat',       label: 'Chat',        icon: '💬' },
]

const TITLES = {
  overview: 'Accueil', tasks: 'Tâches', focus: 'Focus',
  notes: 'Notes', planning: 'Planning', analytics: 'Analytics',
  goals: 'Objectifs', timesheet: 'Timesheet', chat: 'Chat',
}

/* ── Overview ──────────────────────────────────────── */
function Overview({ onNavigate }) {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const dayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  const cards = [
    { label: 'Tâches à faire', value: '5', sub: '2 urgentes', color: 'from-violet-600 to-violet-800', key: 'tasks' },
    { label: 'Focus today',    value: '1h 20m', sub: 'Objectif : 4h',  color: 'from-blue-600 to-blue-800', key: 'focus' },
    { label: 'Notes',          value: '12', sub: '+2 cette semaine',   color: 'from-green-600 to-green-800', key: 'notes' },
    { label: 'Événements',     value: '3',  sub: 'Cette semaine',      color: 'from-orange-600 to-orange-800', key: 'planning' },
  ]

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-white">{greeting} {user?.name?.split(' ')[0] || ''} 👋</h1>
        <p className="text-gray-400 capitalize text-sm mt-0.5">{dayStr}</p>
      </div>

      {/* Stat cards — 2 cols on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(c => (
          <motion.button key={c.key} onClick={() => onNavigate(c.key)}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-left active:scale-95 transition-transform`}>
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-white/80 mt-1 font-medium leading-tight">{c.label}</p>
            {c.sub && <p className="text-xs text-white/50 mt-1">{c.sub}</p>}
          </motion.button>
        ))}
      </div>

      {/* Tasks preview */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-200 text-sm">Tâches prioritaires</h3>
          <button onClick={() => onNavigate('tasks')} className="text-xs text-violet-400">Voir tout →</button>
        </div>
        <div className="space-y-3">
          {[
            { text: 'Préparer la présentation Q2', badge: 'Urgent', done: false, badgeColor: 'text-red-400 bg-red-950/50' },
            { text: 'Réviser le contrat client',   badge: 'Moyen',  done: false, badgeColor: 'text-yellow-400 bg-yellow-950/50' },
            { text: 'Créer les maquettes UI',       badge: 'Faible', done: true,  badgeColor: 'text-green-400 bg-green-950/50' },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center ${t.done ? 'bg-violet-600 border-violet-600' : 'border-gray-600'}`}>
                {t.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
              </div>
              <span className={`text-sm flex-1 truncate ${t.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{t.text}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${t.badgeColor}`}>{t.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions — 2×2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Session focus', icon: '⏱', key: 'focus', color: 'bg-blue-950/40 border-blue-800/50' },
          { label: 'Nouvelle note',  icon: '📝', key: 'notes', color: 'bg-green-950/40 border-green-800/50' },
          { label: 'Ajouter tâche', icon: '✓', key: 'tasks', color: 'bg-violet-950/40 border-violet-800/50' },
          { label: 'Analytics',     icon: '📊', key: 'analytics', color: 'bg-orange-950/40 border-orange-800/50' },
        ].map(a => (
          <button key={a.key} onClick={() => onNavigate(a.key)}
            className={`flex items-center gap-3 p-4 rounded-2xl border text-left active:scale-95 transition-transform ${a.color}`}>
            <span className="text-2xl">{a.icon}</span>
            <span className="text-sm text-gray-300 font-medium leading-tight">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── More bottom sheet (mobile) ────────────────────── */
function MoreSheet({ onNavigate, onClose, onLogout, user }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-gray-900 border-t border-gray-800 rounded-t-3xl p-4 pb-10"
        onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />

        <div className="grid grid-cols-3 gap-3 mb-4">
          {MORE_ITEMS.map(item => (
            <button key={item.key} onClick={() => { onNavigate(item.key); onClose() }}
              className="flex flex-col items-center gap-2 p-4 bg-gray-800/60 rounded-2xl active:scale-95 transition-transform">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs text-gray-300 font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-4 space-y-1">
          {user?.plan === 'free' && (
            <button onClick={() => { onNavigate('pricing'); onClose() }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-950/30 text-violet-300 text-sm font-medium">
              ⭐ Passer au Pro — 9€/mois
            </button>
          )}
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 text-sm">
            🚪 Déconnexion
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Dashboard shell ───────────────────────────────── */
export default function Dashboard({ onBack }) {
  const [activeKey, setActiveKey] = useState('overview')
  const [showMore, setShowMore] = useState(false)
  const { user, logout } = useAuth()

  function navigate(key) {
    setActiveKey(key)
    setShowMore(false)
  }

  function handleLogout() {
    logout()
    onBack()
  }

  if (activeKey === 'pricing') return <Pricing onBack={() => setActiveKey('overview')} />

  const isChat = activeKey === 'chat'
  /* On mobile chat takes all available height */
  const contentClass = isChat
    ? 'flex-1 overflow-hidden'
    : 'flex-1 overflow-y-auto pb-24 lg:pb-6'

  return (
    <div className="flex h-[100dvh] bg-gray-950 overflow-hidden">

      {/* ── Desktop sidebar (lg+) ── */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col bg-gray-900/80 border-r border-gray-800">
        <div className="p-5 border-b border-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-lg font-bold text-white">flowly</span>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {SIDEBAR_NAV.map(item => (
            <button key={item.key} onClick={() => navigate(item.key)}
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

        <div className="p-3 border-t border-gray-800 space-y-1">
          {user?.plan === 'free' && (
            <button onClick={() => navigate('pricing')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-violet-400 hover:bg-violet-950/30 transition-all">
              ⭐ Passer au Pro — 9€/mois
            </button>
          )}
          {user?.plan && user.plan !== 'free' && (
            <div className="px-3 py-1.5 rounded-lg bg-violet-900/20 text-violet-300 text-xs text-center capitalize">
              Plan {user.plan} ✓
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-all">
            ← Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top header */}
        <header className="flex-shrink-0 px-4 lg:px-8 py-3 lg:py-4 border-b border-gray-800 flex items-center justify-between gap-3 bg-gray-950/95 backdrop-blur-sm">
          <h1 className="text-base lg:text-xl font-bold text-white">{TITLES[activeKey]}</h1>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs text-white font-medium">{user?.name}</span>
              <span className="text-[10px] text-gray-500 capitalize">{user?.plan || 'free'}</span>
            </div>
            <button onClick={() => navigate('pricing')}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center hover:ring-2 hover:ring-violet-400 transition-all flex-shrink-0">
              <span className="text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className={isChat ? 'flex-1 overflow-hidden p-3 lg:p-6' : 'flex-1 overflow-y-auto'}>
          <AnimatePresence mode="wait">
            <motion.div key={activeKey}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className={isChat ? 'h-full' : 'p-4 lg:p-8 pb-28 lg:pb-8'}>
              {activeKey === 'overview'  && <Overview onNavigate={navigate} />}
              {activeKey === 'tasks'     && <Kanban />}
              {activeKey === 'focus'     && <div className="flex flex-col items-center"><Timer /></div>}
              {activeKey === 'notes'     && <Notes />}
              {activeKey === 'planning'  && <Planning />}
              {activeKey === 'analytics' && <Analytics />}
              {activeKey === 'goals'     && <Goals />}
              {activeKey === 'timesheet' && <Timesheet />}
              {activeKey === 'chat'      && <div className="h-full"><Chat /></div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile bottom nav (< lg) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {BOTTOM_NAV.map(item => {
          const isActive = item.key === 'more' ? showMore : activeKey === item.key
          return (
            <button key={item.key}
              onClick={() => {
                if (item.key === 'more') { setShowMore(s => !s) }
                else { navigate(item.key); setShowMore(false) }
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                isActive ? 'text-violet-400' : 'text-gray-500'
              }`}>
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* More sheet */}
      <AnimatePresence>
        {showMore && (
          <MoreSheet
            onNavigate={navigate}
            onClose={() => setShowMore(false)}
            onLogout={handleLogout}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
