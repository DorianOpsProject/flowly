const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.use(auth)

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, updated_at DESC').all(req.user.id))
})

router.post('/', (req, res) => {
  const { title = '', content = '', color = 'violet', pinned = 0 } = req.body
  const r = db.prepare('INSERT INTO notes (user_id, title, content, color, pinned) VALUES (?, ?, ?, ?, ?)').run(req.user.id, title, content, color, pinned ? 1 : 0)
  res.json(db.prepare('SELECT * FROM notes WHERE id = ?').get(r.lastInsertRowid))
})

router.put('/:id', (req, res) => {
  const { title, content, color, pinned } = req.body
  const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (!note) return res.status(404).json({ error: 'Note introuvable' })
  db.prepare('UPDATE notes SET title=?,content=?,color=?,pinned=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .run(title ?? note.title, content ?? note.content, color ?? note.color, pinned !== undefined ? (pinned ? 1 : 0) : note.pinned, req.params.id)
  res.json(db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
  res.json({ ok: true })
})

module.exports = router
