const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.use(auth)

router.get('/', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id)
  res.json(tasks)
})

router.post('/', (req, res) => {
  const { text, priority = 'medium', status = 'todo' } = req.body
  if (!text) return res.status(400).json({ error: 'Texte requis' })
  const r = db.prepare('INSERT INTO tasks (user_id, text, priority, status) VALUES (?, ?, ?, ?)').run(req.user.id, text, priority, status)
  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(r.lastInsertRowid))
})

router.put('/:id', (req, res) => {
  const { text, priority, status } = req.body
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (!task) return res.status(404).json({ error: 'Tâche introuvable' })
  db.prepare('UPDATE tasks SET text = ?, priority = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(text ?? task.text, priority ?? task.priority, status ?? task.status, req.params.id)
  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
  res.json({ ok: true })
})

module.exports = router
