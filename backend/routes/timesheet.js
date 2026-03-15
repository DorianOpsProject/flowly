const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.use(auth)

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM time_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT 200').all(req.user.id))
})

router.post('/', (req, res) => {
  const { project, description = '', start_time, end_time, duration = 0 } = req.body
  if (!project || !start_time) return res.status(400).json({ error: 'Projet et heure de début requis' })
  const r = db.prepare('INSERT INTO time_entries (user_id, project, description, start_time, end_time, duration) VALUES (?, ?, ?, ?, ?, ?)').run(req.user.id, project, description, start_time, end_time || null, duration)
  res.json(db.prepare('SELECT * FROM time_entries WHERE id = ?').get(r.lastInsertRowid))
})

router.put('/:id', (req, res) => {
  const { project, description, end_time, duration } = req.body
  const e = db.prepare('SELECT * FROM time_entries WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (!e) return res.status(404).json({ error: 'Entrée introuvable' })
  db.prepare('UPDATE time_entries SET project=?,description=?,end_time=?,duration=? WHERE id=?')
    .run(project ?? e.project, description ?? e.description, end_time ?? e.end_time, duration ?? e.duration, req.params.id)
  res.json(db.prepare('SELECT * FROM time_entries WHERE id = ?').get(req.params.id))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM time_entries WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
  res.json({ ok: true })
})

router.get('/stats', (req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  const byProject = db.prepare("SELECT project, SUM(duration) as total, COUNT(*) as count FROM time_entries WHERE user_id = ? AND date(created_at) >= ? GROUP BY project ORDER BY total DESC").all(req.user.id, weekAgo)
  const totalWeek = db.prepare("SELECT SUM(duration) as total FROM time_entries WHERE user_id = ? AND date(created_at) >= ?").get(req.user.id, weekAgo)
  res.json({ byProject, totalWeek })
})

module.exports = router
