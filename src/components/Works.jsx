const works = [
  {
    emoji: '🎮',
    title: 'Admin Panel Roblox',
    category: 'Script Roblox',
    desc: 'Interface d\'administration complète avec ban, kick, logs, et gestion des rôles en temps réel.',
    tags: ['Lua', 'GUI', 'Admin'],
    color: 'from-orange-500/15 to-transparent',
    border: 'border-orange-500/20',
    cat_color: 'text-orange-400',
  },
  {
    emoji: '🌐',
    title: 'Portfolio Dev',
    category: 'Site Web',
    desc: 'Portfolio moderne avec animations Framer Motion, mode sombre, et formulaire de contact intégré.',
    tags: ['React', 'Tailwind', 'Framer'],
    color: 'from-blue-500/15 to-transparent',
    border: 'border-blue-500/20',
    cat_color: 'text-blue-400',
  },
  {
    emoji: '🤖',
    title: 'Bot Economy Discord',
    category: 'Bot Discord',
    desc: 'Système economy complet avec shop, banque, classement, minijeux et dashboard web de gestion.',
    tags: ['Discord.js', 'MongoDB', 'Dashboard'],
    color: 'from-violet-500/15 to-transparent',
    border: 'border-violet-500/20',
    cat_color: 'text-violet-400',
  },
  {
    emoji: '📱',
    title: 'App Fitness',
    category: 'App Mobile',
    desc: 'Application de suivi fitness avec workout tracker, nutrition, et graphiques de progression.',
    tags: ['React Native', 'Expo', 'Charts'],
    color: 'from-green-500/15 to-transparent',
    border: 'border-green-500/20',
    cat_color: 'text-green-400',
  },
  {
    emoji: '🐍',
    title: 'Scraper Automatisé',
    category: 'Script Python',
    desc: 'Bot de scraping automatique avec proxy rotation, export Excel et envoi par email planifié.',
    tags: ['Python', 'BeautifulSoup', 'Selenium'],
    color: 'from-yellow-500/15 to-transparent',
    border: 'border-yellow-500/20',
    cat_color: 'text-yellow-400',
  },
  {
    emoji: '🎨',
    title: 'Branding Gaming',
    category: 'Design & Branding',
    desc: 'Pack branding complet : logo, bannières Discord/Twitch, miniatures YouTube et kit de presse.',
    tags: ['Figma', 'Illustrator', 'Logo'],
    color: 'from-pink-500/15 to-transparent',
    border: 'border-pink-500/20',
    cat_color: 'text-pink-400',
  },
]

export default function Works() {
  return (
    <section id="realisations" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Notre travail
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Réalisations
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Quelques projets que nous avons livrés. Chaque projet est unique et fait avec soin.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {works.map((w) => (
            <div
              key={w.title}
              className={`group relative p-6 rounded-2xl border bg-gradient-to-br ${w.color} ${w.border} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-default overflow-hidden`}
            >
              {/* BG glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{w.emoji}</div>
                  <span className={`text-xs font-semibold ${w.cat_color}`}>{w.category}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{w.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{w.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {w.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 border border-white/8 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/3 border border-white/8 rounded-2xl px-8 py-6">
            <div className="text-center sm:text-left">
              <p className="text-white font-semibold">Tu veux voir plus de réalisations ?</p>
              <p className="text-gray-500 text-sm mt-0.5">Rejoins notre serveur Discord pour voir notre portfolio complet.</p>
            </div>
            <a
              href="https://discord.gg/fstudios"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#5865F2]/30 hover:-translate-y-0.5 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Rejoindre Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
