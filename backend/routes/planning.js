const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.use(auth)

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM planning_events WHERE user_id = ? ORDER BY week_offset, day_index, start_hour').all(req.user.id))
})

router.post('/', (req, res) => {
  const { title, day_index = 0, start_hour = 9, end_hour = 10, color = 0, week_offset = 0 } = req.body
  if (!title) return res.status(400).json({ error: 'Titre requis' })
  const r = db.prepare('INSERT INTO planning_events (user_id, title, day_index, start_hour, end_hour, color, week_offset) VALUES (?, ?, ?, ?, ?, ?, ?)').run(req.user.id, title, day_index, start_hour, end_hour, color, week_offset)
  res.json(db.prepare('SELECT * FROM planning_events WHERE id = ?').get(r.lastInsertRowid))
})

router.put('/:id', (req, res) => {
  const { title, day_index, start_hour, end_hour, color, week_offset } = req.body
  const e = db.prepare('SELECT * FROM planning_events WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (!e) return res.status(404).json({ error: 'Événement introuvable' })
  db.prepare('UPDATE planning_events SET title=?,day_index=?,start_hour=?,end_hour=?,color=?,week_offset=? WHERE id=?')
    .run(title ?? e.title, day_index ?? e.day_index, start_hour ?? e.start_hour, end_hour ?? e.end_hour, color ?? e.color, week_offset ?? e.week_offset, req.params.id)
  res.json(db.prepare('SELECT * FROM planning_events WHERE id = ?').get(req.params.id))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM planning_events WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
  res.json({ ok: true })
})

module.exports = router
