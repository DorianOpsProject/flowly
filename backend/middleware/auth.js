const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Non autorisé' })
  try {
    req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'flowly_secret_2026')
    next()
  } catch {
    res.status(401).json({ error: 'Token invalide' })
  }
}
