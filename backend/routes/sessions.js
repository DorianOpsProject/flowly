const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.use(auth)

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY completed_at DESC LIMIT 100').all(req.user.id))
})

router.post('/', (req, res) => {
  const { duration = 25, mode = 'focus' } = req.body
  const r = db.prepare('INSERT INTO focus_sessions (user_id, duration, mode) VALUES (?, ?, ?)').run(req.user.id, duration, mode)
  res.json(db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(r.lastInsertRowid))
})

router.get('/stats', (req, res) => {
  const today = new Date().toISOString().slice(0, 10)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  const todaySessions = db.prepare("SELECT COUNT(*) as count, SUM(duration) as total FROM focus_sessions WHERE user_id = ? AND date(completed_at) = ?").get(req.user.id, today)
  const weekSessions = db.prepare("SELECT COUNT(*) as count, SUM(duration) as total FROM focus_sessions WHERE user_id = ? AND date(completed_at) >= ?").get(req.user.id, weekAgo)
  const byDay = db.prepare("SELECT date(completed_at) as day, COUNT(*) as count, SUM(duration) as total FROM focus_sessions WHERE user_id = ? AND date(completed_at) >= ? GROUP BY day ORDER BY day").all(req.user.id, weekAgo)
  res.json({ today: todaySessions, week: weekSessions, byDay })
})

module.exports = router
