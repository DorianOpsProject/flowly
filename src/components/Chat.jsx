import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

const ROOMS = [
  { key: 'general',   label: 'Général',   icon: '💬' },
  { key: 'projets',   label: 'Projets',   icon: '📋' },
  { key: 'annonces',  label: 'Annonces',  icon: '📢' },
]

let socket = null

function getInitials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
function avatarColor(name) {
  const palette = ['bg-violet-600', 'bg-blue-600', 'bg-green-600', 'bg-orange-600', 'bg-pink-600']
  let h = 0; for (const c of name || '') h = (h << 5) - h + c.charCodeAt(0)
  return palette[Math.abs(h) % palette.length]
}

export default function Chat() {
  const { user } = useAuth()
  const [room, setRoom] = useState('general')
  const [showRooms, setShowRooms] = useState(false)  // mobile room picker
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [online, setOnline] = useState([])
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    api.get(`/messages/${room}`).then(r => setMessages(r.data)).catch(() => setMessages([]))
  }, [room])

  useEffect(() => {
    if (!socket) {
      const backendUrl = import.meta.env.VITE_API_URL || window.location.origin
      socket = io(backendUrl, { path: '/socket.io', transports: ['websocket', 'polling'] })
    }
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.emit('join', { userId: user.id, name: user.name, room })
    socket.on('message', msg => { if (msg.room === room) setMessages(p => [...p, msg]) })
    socket.on('online', users => setOnline(users))
    return () => { socket.off('message'); socket.off('online'); socket.off('connect'); socket.off('disconnect') }
  }, [room, user])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function send(e) {
    e.preventDefault()
    if (!input.trim()) return
    const msg = { user_id: user.id, user_name: user.name, room, content: input.trim() }
    socket?.emit('message', msg)
    api.post('/messages', { room, content: input.trim() }).catch(() => {})
    setInput('')
  }

  const currentRoom = ROOMS.find(r => r.key === room)

  return (
    <div className="flex h-full min-h-0 gap-0 rounded-2xl border border-gray-800 overflow-hidden">

      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:flex w-48 flex-shrink-0 flex-col bg-gray-900/80 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Canaux</p>
        </div>
        <div className="flex-1 p-2">
          {ROOMS.map(r => (
            <button key={r.key} onClick={() => setRoom(r.key)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5 ${
                room === r.key ? 'bg-violet-600/20 text-violet-300' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}>
              <span>{r.icon}</span>
              <span className="font-medium"># {r.label}</span>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">En ligne ({online.length})</p>
          <div className="space-y-2">
            {online.slice(0, 6).map((u, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${avatarColor(u.name)} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                  {getInitials(u.name)}
                </div>
                <span className="text-xs text-gray-400 truncate">{u.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main chat ── */}
      <div className="flex-1 flex flex-col min-h-0 bg-gray-950">

        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 flex-shrink-0">
          {/* Mobile: room picker button */}
          <button onClick={() => setShowRooms(true)} className="lg:hidden flex items-center gap-1.5">
            <span className="text-lg">{currentRoom?.icon}</span>
            <span className="font-semibold text-white text-sm">#{currentRoom?.label}</span>
            <svg className="w-3 h-3 text-gray-500 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          {/* Desktop: room label */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-lg">{currentRoom?.icon}</span>
            <h3 className="font-semibold text-white">#{currentRoom?.label}</h3>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-600'}`} />
            <span className="text-xs text-gray-500 hidden sm:block">{connected ? 'Connecté' : 'Déconnecté'}</span>
            {/* Online count on mobile */}
            <span className="lg:hidden text-xs text-gray-500">{online.length} en ligne</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-2 sm:space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isMe = msg.user_id === user.id || msg.user_name === user.name
              const prevMsg = messages[i - 1]
              const sameUser = prevMsg && (prevMsg.user_id === msg.user_id || prevMsg.user_name === msg.user_name)
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 sm:gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!sameUser ? (
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${avatarColor(msg.user_name)} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5`}>
                      {getInitials(msg.user_name)}
                    </div>
                  ) : <div className="w-7 sm:w-8 flex-shrink-0" />}
                  <div className={`max-w-[78%] sm:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!sameUser && (
                      <p className={`text-[11px] text-gray-500 mb-1 ${isMe ? 'text-right' : ''}`}>{msg.user_name}</p>
                    )}
                    <div className={`px-3 py-2 sm:px-3.5 sm:py-2 rounded-2xl text-sm leading-relaxed ${
                      isMe ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.created_at && (
                      <p className="text-[10px] text-gray-600 mt-0.5 px-1">
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {messages.length === 0 && (
            <div className="text-center text-gray-600 py-12 text-sm">
              <p className="text-3xl mb-3">{currentRoom?.icon}</p>
              <p>Soyez le premier à écrire dans #{currentRoom?.label}</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={send} className="px-3 sm:px-4 py-3 border-t border-gray-800 flex gap-2 flex-shrink-0">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder={`Message dans #${currentRoom?.label}...`}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors" />
          <button type="submit" disabled={!input.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
            ↑
          </button>
        </form>
      </div>

      {/* ── Mobile room picker bottom sheet ── */}
      <AnimatePresence>
        {showRooms && (
          <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end lg:hidden"
            onClick={() => setShowRooms(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-gray-900 border-t border-gray-800 rounded-t-3xl p-4 pb-10"
              onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-1">Choisir un canal</p>
              {ROOMS.map(r => (
                <button key={r.key} onClick={() => { setRoom(r.key); setShowRooms(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 text-left transition-all ${
                    room === r.key ? 'bg-violet-600/20 text-violet-300' : 'bg-gray-800/60 text-gray-300'
                  }`}>
                  <span className="text-xl">{r.icon}</span>
                  <div>
                    <p className="font-semibold text-sm"># {r.label}</p>
                  </div>
                  {room === r.key && <svg className="w-4 h-4 text-violet-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </button>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
