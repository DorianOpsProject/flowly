const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.use(auth)

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id))
})

router.post('/', (req, res) => {
  const { title, type = 'daily', target = 1, color = 'violet', icon = '🎯' } = req.body
  if (!title) return res.status(400).json({ error: 'Titre requis' })
  const r = db.prepare('INSERT INTO goals (user_id, title, type, target, current, color, icon) VALUES (?, ?, ?, ?, 0, ?, ?)').run(req.user.id, title, type, target, color, icon)
  res.json(db.prepare('SELECT * FROM goals WHERE id = ?').get(r.lastInsertRowid))
})

router.put('/:id', (req, res) => {
  const { title, type, target, current, color, icon } = req.body
  const g = db.prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (!g) return res.status(404).json({ error: 'Objectif introuvable' })
  db.prepare('UPDATE goals SET title=?,type=?,target=?,current=?,color=?,icon=? WHERE id=?')
    .run(title ?? g.title, type ?? g.type, target ?? g.target, current ?? g.current, color ?? g.color, icon ?? g.icon, req.params.id)
  res.json(db.prepare('SELECT * FROM goals WHERE id = ?').get(req.params.id))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM goals WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
  res.json({ ok: true })
})

module.exports = router
