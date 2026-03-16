import { useState } from 'react'

const categories = [
  {
    id: 'roblox',
    label: '🎮 Roblox',
    plans: [
      {
        name: 'Basique',
        price: '5€',
        desc: 'Script simple sans interface',
        features: ['1 script Lua', 'Fonctionnalité unique', 'Livraison 24h', 'Support 3 jours'],
        cta: 'Commander',
        highlight: false,
      },
      {
        name: 'Standard',
        price: '15€',
        desc: 'Script avec GUI personnalisée',
        features: ['Script complet + GUI', 'Jusqu\'à 3 fonctionnalités', 'Livraison 48h', 'Support 7 jours', 'Révisions incluses'],
        cta: 'Commander',
        highlight: true,
      },
      {
        name: 'Avancé',
        price: '35€+',
        desc: 'Système complet de jeu',
        features: ['Système complexe', 'DataStore intégré', 'GUI premium', 'Livraison 3-5 jours', 'Support 14 jours', 'Révisions illimitées'],
        cta: 'Discuter du projet',
        highlight: false,
      },
    ],
  },
  {
    id: 'web',
    label: '🌐 Site Web',
    plans: [
      {
        name: 'Landing Page',
        price: '30€',
        desc: 'Page unique vitrine',
        features: ['1 page responsive', 'Design moderne', 'Formulaire contact', 'Livraison 3 jours'],
        cta: 'Commander',
        highlight: false,
      },
      {
        name: 'Site Complet',
        price: '80€',
        desc: 'Site multi-pages professionnel',
        features: ['Jusqu\'à 5 pages', 'Design sur mesure', 'SEO de base', 'Formulaire + animations', 'Livraison 7 jours', 'Responsive mobile'],
        cta: 'Commander',
        highlight: true,
      },
      {
        name: 'E-commerce',
        price: '150€+',
        desc: 'Boutique en ligne complète',
        features: ['Pages illimitées', 'Paiements intégrés', 'Dashboard admin', 'SEO avancé', 'Livraison 14 jours', 'Maintenance 1 mois'],
        cta: 'Discuter du projet',
        highlight: false,
      },
    ],
  },
  {
    id: 'bot',
    label: '🤖 Bot Discord',
    plans: [
      {
        name: 'Simple',
        price: '10€',
        desc: 'Bot avec commandes basiques',
        features: ['5 commandes slash', 'Modération basique', 'Livraison 24h', 'Support 3 jours'],
        cta: 'Commander',
        highlight: false,
      },
      {
        name: 'Complet',
        price: '25€',
        desc: 'Bot serveur tout-en-un',
        features: ['20+ commandes', 'Système tickets', 'Logs & modération', 'Rôles automatiques', 'Livraison 3 jours', 'Support 14 jours'],
        cta: 'Commander',
        highlight: true,
      },
      {
        name: 'Premium',
        price: '60€+',
        desc: 'Bot + dashboard web',
        features: ['Commandes illimitées', 'Dashboard web', 'Economy système', 'Base de données', 'Hébergement inclus 1 mois', 'Support prioritaire'],
        cta: 'Discuter du projet',
        highlight: false,
      },
    ],
  },
  {
    id: 'python',
    label: '🐍 Python',
    plans: [
      {
        name: 'Script',
        price: '8€',
        desc: 'Script simple et rapide',
        features: ['Script unique', '1 fonctionnalité', 'Code commenté', 'Livraison 24h'],
        cta: 'Commander',
        highlight: false,
      },
      {
        name: 'Outil',
        price: '20€',
        desc: 'Outil CLI ou automation',
        features: ['Outil complet', 'Interface CLI', 'Gestion d\'erreurs', 'Documentation', 'Livraison 3 jours'],
        cta: 'Commander',
        highlight: true,
      },
      {
        name: 'Projet',
        price: '50€+',
        desc: 'Bot, scraper ou API',
        features: ['Projet complexe', 'Multi-modules', 'Tests inclus', 'Documentation complète', 'Livraison 7 jours', 'Support 14 jours'],
        cta: 'Discuter du projet',
        highlight: false,
      },
    ],
  },
]

export default function Pricing() {
  const [active, setActive] = useState('roblox')
  const current = categories.find((c) => c.id === active)

  return (
    <section id="tarifs" className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Tarifs clairs
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Nos Tarifs
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Pas de surprises, tarifs transparents. Paiement sécurisé via PayPal ou crypto.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                active === c.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-700/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {current.plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                plan.highlight
                  ? 'bg-violet-600/10 border-violet-500/40 shadow-xl shadow-violet-950/30 scale-[1.02]'
                  : 'bg-white/3 border-white/8 hover:border-white/15'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                  Populaire
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{plan.desc}</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-black text-white">{plan.price}</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://discord.gg/fstudios"
                target="_blank"
                rel="noreferrer"
                className={`block w-full text-center font-semibold py-3 rounded-xl transition-all text-sm ${
                  plan.highlight
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-700/30 hover:-translate-y-0.5'
                    : 'bg-white/8 hover:bg-white/12 text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-gray-600 text-sm mt-8">
          * Les tarifs sont indicatifs. Le prix final dépend de la complexité de votre projet.
          <br />
          Contactez-nous sur Discord pour un devis personnalisé gratuit.
        </p>
      </div>
    </section>
  )
}
