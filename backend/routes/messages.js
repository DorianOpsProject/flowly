const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.use(auth)

router.get('/:room', (req, res) => {
  const messages = db.prepare('SELECT m.*, u.name as user_name FROM messages m JOIN users u ON m.user_id = u.id WHERE m.room = ? ORDER BY m.created_at DESC LIMIT 100').all(req.params.room)
  res.json(messages.reverse())
})

router.post('/', (req, res) => {
  const { room = 'general', content } = req.body
  if (!content) return res.status(400).json({ error: 'Message vide' })
  const r = db.prepare('INSERT INTO messages (user_id, user_name, room, content) VALUES (?, ?, ?, ?)').run(req.user.id, req.user.name, room, content)
  res.json(db.prepare('SELECT * FROM messages WHERE id = ?').get(r.lastInsertRowid))
})

module.exports = router
