require('dotenv').config()
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const path = require('path')

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : '*',
  credentials: true,
}))
app.use(express.json())

// API routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/notes', require('./routes/notes'))
app.use('/api/sessions', require('./routes/sessions'))
app.use('/api/goals', require('./routes/goals'))
app.use('/api/timesheet', require('./routes/timesheet'))
app.use('/api/messages', require('./routes/messages'))
app.use('/api/paypal', require('./routes/paypal'))
app.use('/api/planning', require('./routes/planning'))
app.use('/api/analytics', require('./routes/analytics'))

// Socket.io - real-time chat
const onlineUsers = new Map()
io.on('connection', (socket) => {
  socket.on('join', ({ userId, name, room }) => {
    socket.join(room)
    socket.data = { userId, name, room }
    onlineUsers.set(socket.id, { userId, name, room })
    const roomUsers = Array.from(onlineUsers.values()).filter(u => u.room === room)
    io.to(room).emit('online', roomUsers)
  })

  socket.on('message', (msg) => {
    const full = { ...msg, createdAt: new Date().toISOString() }
    io.to(msg.room).emit('message', full)
  })

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id)
    onlineUsers.delete(socket.id)
    if (user) {
      const roomUsers = Array.from(onlineUsers.values()).filter(u => u.room === user.room)
      io.to(user.room).emit('online', roomUsers)
    }
  })
})

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'))
  })
}

const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log(`🚀 Flowly server running on http://localhost:${PORT}`))
