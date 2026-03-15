import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

const ROOMS = [
  { key: 'general', label: 'Général', icon: '💬' },
  { key: 'projets', label: 'Projets', icon: '📋' },
  { key: 'annonces', label: 'Annonces', icon: '📢' },
]

let socket = null

export default function Chat() {
  const { user } = useAuth()
  const [room, setRoom] = useState('general')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [online, setOnline] = useState([])
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef(null)

  // Load history
  useEffect(() => {
    api.get(`/messages/${room}`).then(r => setMessages(r.data)).catch(() => setMessages([]))
  }, [room])

  // Socket
  useEffect(() => {
    if (!socket) {
      socket = io(window.location.origin, { path: '/socket.io', transports: ['websocket', 'polling'] })
    }
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.emit('join', { userId: user.id, name: user.name, room })
    socket.on('message', msg => {
      if (msg.room === room) setMessages(prev => [...prev, msg])
    })
    socket.on('online', users => setOnline(users))
    return () => {
      socket.off('message')
      socket.off('online')
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [room, user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(e) {
    e.preventDefault()
    if (!input.trim()) return
    const msg = {
      user_id: user.id,
      user_name: user.name,
      room,
      content: input.trim(),
    }
    socket?.emit('message', msg)
    // Also persist to DB
    api.post('/messages', { room, content: input.trim() }).catch(() => {})
    setInput('')
  }

  function getInitials(name) {
    return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
  }

  const avatarColor = (name) => {
    const colors = ['bg-violet-600', 'bg-blue-600', 'bg-green-600', 'bg-orange-600', 'bg-pink-600']
    let hash = 0
    for (const c of name || '') hash = (hash << 5) - hash + c.charCodeAt(0)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="h-full flex gap-0 min-h-0 overflow-hidden rounded-2xl border border-gray-800">
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0 bg-gray-900/80 flex flex-col border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Canaux</p>
        </div>
        <div className="flex-1 p-2">
          {ROOMS.map(r => (
            <button key={r.key} onClick={() => setRoom(r.key)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${room === r.key ? 'bg-violet-600/20 text-violet-300' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}>
              <span>{r.icon}</span>
              <span># {r.label}</span>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">En ligne ({online.length})</p>
          <div className="space-y-1.5">
            {online.slice(0, 8).map((u, i) => (
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

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-h-0 bg-gray-950">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{ROOMS.find(r => r.key === room)?.icon}</span>
            <h3 className="font-semibold text-white">#{ROOMS.find(r => r.key === room)?.label}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-600'}`} />
            <span className="text-xs text-gray-500">{connected ? 'Connecté' : 'Déconnecté'}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isMe = msg.user_id === user.id || msg.user_name === user.name
              const prevMsg = messages[i - 1]
              const sameUser = prevMsg && (prevMsg.user_id === msg.user_id || prevMsg.user_name === msg.user_name)
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!sameUser ? (
                    <div className={`w-8 h-8 rounded-full ${avatarColor(msg.user_name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
                      {getInitials(msg.user_name)}
                    </div>
                  ) : <div className="w-8 flex-shrink-0" />}
                  <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!sameUser && <p className={`text-xs text-gray-500 mb-1 ${isMe ? 'text-right' : ''}`}>{msg.user_name}</p>}
                    <div className={`px-3.5 py-2 rounded-2xl text-sm ${isMe
                      ? 'bg-violet-600 text-white rounded-tr-sm'
                      : 'bg-gray-800 text-gray-200 rounded-tl-sm'}`}>
                      {msg.content}
                    </div>
                    {msg.created_at && (
                      <p className="text-[10px] text-gray-600 mt-1 px-1">
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={send} className="px-4 py-3 border-t border-gray-800 flex gap-2 flex-shrink-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Message dans #${ROOMS.find(r => r.key === room)?.label}...`}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <button type="submit" disabled={!input.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 disabled:scale-100">
            →
          </button>
        </form>
      </div>
    </div>
  )
}
