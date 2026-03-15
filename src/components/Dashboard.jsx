import { useState } from 'react'
import Kanban from './Kanban'
import Timer from './Timer'
import Notes from './Notes'
import Planning from './Planning'

const NAV = [
  { key: 'overview', label: 'Vue d\'ensemble', shortLabel: 'Accueil', icon: '⊞' },
  { key: 'tasks', label: 'Tâches', shortLabel: 'Tâches', icon: '✓' },
  { key: 'focus', label: 'Focus', shortLabel: 'Focus', icon: '⏱' },
  { key: 'notes', label: 'Notes', shortLabel: 'Notes', icon: '📝' },
  { key: 'planning', label: 'Planning', shortLabel: 'Agenda', icon: '📅' },
]

function OverviewCard({ label, value, sub, color }) {
  const colors = {
    violet: 'from-violet-600 to-violet-800',
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    orange: 'from-orange-600 to-orange-800',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4 md:p-5`}>
      <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
      <p className="text-xs md:text-sm text-white/80 mt-1 font-medium leading-snug">{label}</p>
      {sub && <p className="text-xs text-white/50 mt-1">{sub}</p>}
    </div>
  )
}

function Overview({ onNavigate }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const dayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="space-y-5 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white mb-1">{greeting} 👋</h1>
        <p className="text-gray-400 capitalize text-sm">{dayStr}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <OverviewCard label="Tâches à faire" value="5" sub="2 urgentes" color="violet" />
        <OverviewCard label="Focus aujourd'hui" value="1h 20m" sub="Objectif : 4h" color="blue" />
        <OverviewCard label="Notes" value="12" sub="+2 cette semaine" color="green" />
        <OverviewCard label="Événements" value="3" sub="Cette semaine" color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        {/* Quick tasks */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200 text-sm md:text-base">Tâches prioritaires</h3>
            <button onClick={() => onNavigate('tasks')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Voir tout →
            </button>
          </div>
          <div className="space-y-3">
            {[
              { text: 'Préparer la présentation Q2', priority: 'Urgent', done: false },
              { text: 'Réviser le contrat client', priority: 'Moyen', done: false },
              { text: 'Créer les maquettes UI', priority: 'Faible', done: true },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${t.done ? 'bg-violet-600 border-violet-600' : 'border-gray-600'}`}>
                  {t.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </div>
                <span className={`text-sm flex-1 min-w-0 truncate ${t.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{t.text}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${t.priority === 'Urgent' ? 'bg-red-950/50 text-red-400' : t.priority === 'Moyen' ? 'bg-yellow-950/50 text-yellow-400' : 'bg-green-950/50 text-green-400'}`}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 md:p-5">
          <h3 className="font-semibold text-gray-200 mb-4 text-sm md:text-base">Accès rapide</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Démarrer une session focus', icon: '⏱', key: 'focus', color: 'bg-blue-950/40 active:bg-blue-950/70 hover:bg-blue-950/60 border-blue-800/50' },
              { label: 'Créer une note', icon: '📝', key: 'notes', color: 'bg-green-950/40 active:bg-green-950/70 hover:bg-green-950/60 border-green-800/50' },
              { label: 'Ajouter une tâche', icon: '✓', key: 'tasks', color: 'bg-violet-950/40 active:bg-violet-950/70 hover:bg-violet-950/60 border-violet-800/50' },
              { label: 'Voir mon planning', icon: '📅', key: 'planning', color: 'bg-orange-950/40 active:bg-orange-950/70 hover:bg-orange-950/60 border-orange-800/50' },
            ].map(a => (
              <button
                key={a.key}
                onClick={() => onNavigate(a.key)}
                className={`flex items-center gap-2 md:gap-3 p-3 rounded-xl border text-left transition-all active:scale-95 hover:scale-105 ${a.color}`}
              >
                <span className="text-xl flex-shrink-0">{a.icon}</span>
                <span className="text-xs md:text-sm text-gray-300 font-medium leading-tight">{a.label}</span>
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

  const titles = {
    overview: 'Vue d\'ensemble',
    tasks: 'Tâches',
    focus: 'Focus',
    notes: 'Notes',
    planning: 'Planning',
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 flex-shrink-0 bg-gray-900/80 border-r border-gray-800 flex-col">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-bold text-white">flowly</span>
          </div>
        </div>

        <nav className="flex-1 p-3">
          {NAV.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                activeKey === item.key
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-700/50'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-all"
          >
            ← Accueil
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex-shrink-0 px-4 md:px-8 py-3.5 md:py-5 border-b border-gray-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile: show logo */}
            <div className="flex md:hidden items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
            </div>
            <h1 className="text-base md:text-xl font-bold text-white truncate">{titles[activeKey]}</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Back to home — desktop only */}
            <button
              onClick={onBack}
              className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-800/60 transition-all"
            >
              ← Accueil
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">U</span>
            </div>
          </div>
        </header>

        {/* Scrollable content — extra bottom padding on mobile for the nav bar */}
        <div className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          {activeKey === 'overview' && <Overview onNavigate={setActiveKey} />}
          {activeKey === 'tasks' && <Kanban />}
          {activeKey === 'focus' && (
            <div className="flex flex-col items-center pt-2 md:pt-4">
              <Timer />
            </div>
          )}
          {activeKey === 'notes' && <Notes />}
          {activeKey === 'planning' && <Planning />}
        </div>
      </main>

      {/* Bottom Navigation — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-40">
        <div className="flex items-stretch">
          {NAV.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all active:scale-90 ${
                activeKey === item.key
                  ? 'text-violet-400'
                  : 'text-gray-500'
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium leading-none">{item.shortLabel}</span>
              {activeKey === item.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
        {/* iOS safe area spacer */}
        <div className="h-safe-bottom" style={{ height: 'env(safe-area-inset-bottom)' }} />
      </nav>
    </div>
  )
}
