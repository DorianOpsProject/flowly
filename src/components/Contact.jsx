const steps = [
  {
    num: '01',
    icon: '💬',
    title: 'Contacte-nous',
    desc: 'Rejoint notre Discord et ouvre un ticket dans le canal #commandes.',
  },
  {
    num: '02',
    icon: '📋',
    title: 'Décris ton projet',
    desc: 'Explique ce que tu veux : fonctionnalités, design, délai et budget.',
  },
  {
    num: '03',
    icon: '💰',
    title: 'Devis gratuit',
    desc: 'On te répond sous 24h avec un devis personnalisé et un délai de livraison.',
  },
  {
    num: '04',
    icon: '🚀',
    title: 'On développe',
    desc: 'Après validation et paiement, on commence et te livre dans les délais.',
  },
]

const faqs = [
  {
    q: 'Comment se passe le paiement ?',
    a: 'On accepte PayPal, Paysafecard, et cryptomonnaies. La moitié à la commande, l\'autre à la livraison.',
  },
  {
    q: 'Quels sont les délais de livraison ?',
    a: 'Ça dépend du projet. Un script simple peut être livré en 24h, un site complet en 5-7 jours. On te donne un délai précis au devis.',
  },
  {
    q: 'Et si le résultat ne me convient pas ?',
    a: 'On inclut des révisions dans tous nos projets. Si le rendu ne correspond pas au brief initial, on corrige gratuitement.',
  },
  {
    q: 'Vous faites du travail pas cher = mauvaise qualité ?',
    a: 'Absolument pas. Nos tarifs sont accessibles parce qu\'on est des passionnés, pas une agence avec des frais de structure. La qualité est notre priorité.',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Passer commande
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Comment commander ?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Simple et rapide. Tout se passe sur Discord.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%_-_20px)] w-10 h-0.5 bg-gradient-to-r from-violet-500/40 to-transparent z-10" />
              )}
              <div className="p-5 rounded-2xl bg-white/3 border border-white/8 hover:border-violet-500/20 transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-violet-500/60 text-xs font-black tracking-widest">{s.num}</span>
                </div>
                <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main CTA card */}
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-600/15 via-purple-900/10 to-transparent p-8 sm:p-12 text-center mb-16">
          {/* BG decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Prêt à lancer ton projet ?
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Rejoins notre serveur Discord et ouvre un ticket. On répond sous 24h avec un devis gratuit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://discord.gg/fstudios"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-[#5865F2]/30 hover:-translate-y-1 text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Rejoindre le Discord
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white text-center mb-8">Questions fréquentes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {faqs.map((f) => (
              <div key={f.q} className="p-5 sm:p-6 rounded-2xl bg-white/3 border border-white/8 hover:border-white/12 transition-all">
                <h4 className="text-white font-semibold text-sm sm:text-base mb-2">{f.q}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
