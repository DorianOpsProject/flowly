const router = require('express').Router()
const axios = require('axios')
const auth = require('../middleware/auth')
const db = require('../db')

const BASE = process.env.PAYPAL_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) throw new Error('PayPal credentials manquants')
  const res = await axios.post(`${BASE}/v1/oauth2/token`, 'grant_type=client_credentials', {
    auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_CLIENT_SECRET },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data.access_token
}

const PLANS = {
  pro: { amount: '9.00', currency: 'EUR', label: 'Flowly Pro - Abonnement mensuel' },
  team: { amount: '29.00', currency: 'EUR', label: 'Flowly Équipe - Abonnement mensuel' },
}

// Create PayPal order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { plan } = req.body
    if (!PLANS[plan]) return res.status(400).json({ error: 'Plan invalide' })
    const p = PLANS[plan]
    const token = await getAccessToken()
    const order = await axios.post(`${BASE}/v2/checkout/orders`, {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: p.currency, value: p.amount },
        description: p.label,
      }],
    }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })
    res.json({ orderId: order.data.id })
  } catch (err) {
    console.error('PayPal create-order error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Erreur PayPal : ' + (err.response?.data?.message || err.message) })
  }
})

// Capture PayPal order
router.post('/capture-order/:orderId', auth, async (req, res) => {
  try {
    const { plan } = req.body
    const token = await getAccessToken()
    const capture = await axios.post(`${BASE}/v2/checkout/orders/${req.params.orderId}/capture`, {}, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    if (capture.data.status === 'COMPLETED') {
      db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(plan, req.user.id)
      db.prepare('INSERT INTO subscriptions (user_id, paypal_order_id, plan, status, amount) VALUES (?, ?, ?, ?, ?)').run(
        req.user.id, req.params.orderId, plan, 'active', PLANS[plan]?.amount || 0
      )
      res.json({ success: true, plan })
    } else {
      res.status(400).json({ error: 'Paiement non complété' })
    }
  } catch (err) {
    console.error('PayPal capture error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Erreur capture PayPal' })
  }
})

module.exports = router
