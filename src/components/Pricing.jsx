import { useState } from 'react'
import { motion } from 'framer-motion'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import toast from 'react-hot-toast'

const PLANS = [
  {
    key: 'free', name: 'Gratuit', price: '0€', period: '/mois',
    features: ['Tâches illimitées', 'Timer Focus', '10 notes', '1 espace de travail'],
    cta: 'Votre plan actuel', highlight: false,
  },
  {
    key: 'pro', name: 'Pro', price: '9€', period: '/mois',
    features: ['Tout du plan Gratuit', 'Notes illimitées', 'Analytics avancés', 'Objectifs & habitudes', 'Timesheet', 'Support prioritaire'],
    cta: 'Passer au Pro', highlight: true,
  },
  {
    key: 'team', name: 'Équipe', price: '29€', period: '/mois',
    features: ['Tout du plan Pro', 'Chat d\'équipe', 'Jusqu\'à 10 membres', 'Tableaux partagés', 'Statistiques équipe'],
    cta: 'Passer en Équipe', highlight: false,
  },
]

function PlanCard({ plan, currentPlan, onUpgrade }) {
  const isCurrent = plan.key === currentPlan
  const isUpgrade = plan.key !== 'free' && !isCurrent

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-8 border flex flex-col ${plan.highlight
        ? 'bg-violet-900/30 border-violet-600 shadow-lg shadow-violet-900/30'
        : 'bg-gray-900 border-gray-800'}`}
    >
      {plan.highlight && (
        <span className="text-xs bg-violet-600 text-white px-3 py-1 rounded-full inline-block mb-4 font-medium w-fit">
          Plus populaire
        </span>
      )}
      <p className="text-gray-400 text-sm mb-1">{plan.name}</p>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-bold text-white">{plan.price}</span>
        <span className="text-gray-400 text-sm">{plan.period}</span>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
            <svg className="w-4 h-4 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      {isCurrent ? (
        <div className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 text-sm text-center">
          ✓ Plan actuel
        </div>
      ) : isUpgrade ? (
        <button
          onClick={() => onUpgrade(plan.key)}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${plan.highlight
            ? 'bg-violet-600 hover:bg-violet-500 text-white hover:scale-105'
            : 'border border-gray-700 hover:border-violet-600 text-gray-300 hover:text-white'}`}
        >
          {plan.cta}
        </button>
      ) : (
        <button disabled className="w-full py-3 rounded-xl border border-gray-700 text-gray-500 text-sm">
          {plan.cta}
        </button>
      )}
    </motion.div>
  )
}

function PayPalModal({ plan, onClose, onSuccess }) {
  const { user } = useAuth()
  const { updateUser } = useAuth()

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-2">
          Passer au plan {plan === 'pro' ? 'Pro' : 'Équipe'}
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          {plan === 'pro' ? '9€/mois' : '29€/mois'} — Paiement sécurisé via PayPal
        </p>

        {import.meta.env.VITE_PAYPAL_CLIENT_ID && import.meta.env.VITE_PAYPAL_CLIENT_ID !== 'your_paypal_client_id' ? (
          <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: 'EUR' }}>
            <PayPalButtons
              style={{ layout: 'vertical', shape: 'rect', color: 'blue' }}
              createOrder={async () => {
                const { data } = await api.post('/paypal/create-order', { plan })
                return data.orderId
              }}
              onApprove={async (data) => {
                try {
                  await api.post(`/paypal/capture-order/${data.orderID}`, { plan })
                  updateUser({ plan })
                  toast.success(`Plan ${plan === 'pro' ? 'Pro' : 'Équipe'} activé ! 🎉`)
                  onSuccess()
                } catch {
                  toast.error('Erreur lors de la confirmation du paiement')
                }
              }}
              onError={() => toast.error('Erreur PayPal')}
            />
          </PayPalScriptProvider>
        ) : (
          <div className="bg-yellow-950/40 border border-yellow-800/50 rounded-xl p-4 text-yellow-300 text-sm">
            <p className="font-semibold mb-1">⚙️ Configuration PayPal requise</p>
            <p className="text-yellow-400/80">
              Ajoutez votre <code className="bg-yellow-900/40 px-1 rounded">VITE_PAYPAL_CLIENT_ID</code> dans le fichier <code className="bg-yellow-900/40 px-1 rounded">.env</code> pour activer les paiements.
            </p>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-4 py-2.5 text-gray-400 hover:text-gray-200 text-sm transition-colors">
          Annuler
        </button>
      </motion.div>
    </div>
  )
}

export default function Pricing({ onBack }) {
  const { user } = useAuth()
  const [upgrading, setUpgrading] = useState(null)

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            ← Retour au tableau de bord
          </button>
          <h1 className="text-4xl font-bold text-white mb-4">Choisissez votre plan</h1>
          <p className="text-gray-400 text-lg">Évoluez à votre rythme, annulez quand vous voulez.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <PlanCard plan={plan} currentPlan={user?.plan || 'free'} onUpgrade={setUpgrading} />
            </motion.div>
          ))}
        </div>
      </div>

      {upgrading && (
        <PayPalModal
          plan={upgrading}
          onClose={() => setUpgrading(null)}
          onSuccess={() => setUpgrading(null)}
        />
      )}
    </div>
  )
}
