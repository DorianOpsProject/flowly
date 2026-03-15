const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.use(auth)

router.get('/', (req, res) => {
  const uid = req.user.id
  const today = new Date().toISOString().slice(0, 10)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)

  const taskStats = db.prepare("SELECT status, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY status").all(uid)
  const focusToday = db.prepare("SELECT COUNT(*) as count, COALESCE(SUM(duration),0) as total FROM focus_sessions WHERE user_id = ? AND date(completed_at) = ?").get(uid, today)
  const focusWeek = db.prepare("SELECT date(completed_at) as day, COUNT(*) as count, COALESCE(SUM(duration),0) as total FROM focus_sessions WHERE user_id = ? AND date(completed_at) >= ? GROUP BY day ORDER BY day").all(uid, weekAgo)
  const notesCount = db.prepare("SELECT COUNT(*) as count FROM notes WHERE user_id = ?").get(uid)
  const goalsProgress = db.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN current >= target THEN 1 ELSE 0 END) as done FROM goals WHERE user_id = ?").get(uid)
  const timesheetWeek = db.prepare("SELECT project, COALESCE(SUM(duration),0) as total FROM time_entries WHERE user_id = ? AND date(created_at) >= ? GROUP BY project ORDER BY total DESC LIMIT 5").all(uid, weekAgo)
  const totalTimeWeek = db.prepare("SELECT COALESCE(SUM(duration),0) as total FROM time_entries WHERE user_id = ? AND date(created_at) >= ?").get(uid, weekAgo)

  res.json({ taskStats, focusToday, focusWeek, notesCount, goalsProgress, timesheetWeek, totalTimeWeek })
})

module.exports = router
