const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')

const SECRET = process.env.JWT_SECRET || 'flowly_secret_2026'

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name, plan: user.plan }, SECRET, { expiresIn: '30d' })
}

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Tous les champs sont requis' })
  if (password.length < 6) return res.status(400).json({ error: 'Mot de passe trop court (min 6 caractères)' })
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) return res.status(409).json({ error: 'Email déjà utilisé' })
  const hash = bcrypt.hashSync(password, 10)
  const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, hash)
  const user = db.prepare('SELECT id, name, email, plan FROM users WHERE id = ?').get(result.lastInsertRowid)
  res.json({ token: makeToken(user), user: { id: user.id, name: user.name, email: user.email, plan: user.plan } })
})

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' })
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }
  res.json({ token: makeToken(user), user: { id: user.id, name: user.name, email: user.email, plan: user.plan } })
})

// Me
router.get('/me', require('../middleware/auth'), (req, res) => {
  const user = db.prepare('SELECT id, name, email, plan, created_at FROM users WHERE id = ?').get(req.user.id)
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
  res.json(user)
})

module.exports = router
