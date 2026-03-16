const services = [
  {
    icon: '🎮',
    title: 'Scripts Roblox',
    desc: 'Scripts Lua sur mesure pour tes jeux Roblox : GUI, systèmes de jeu, anti-cheat, datastore, et plus encore.',
    tags: ['Lua', 'Roblox Studio', 'GUI', 'DataStore'],
    color: 'from-orange-500/20 to-red-500/10',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    tag_color: 'bg-orange-500/10 text-orange-300',
  },
  {
    icon: '🌐',
    title: 'Sites Web',
    desc: 'Sites vitrines, portfolios, landing pages et e-commerces modernes, responsive et optimisés SEO.',
    tags: ['React', 'Next.js', 'Tailwind', 'WordPress'],
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    tag_color: 'bg-blue-500/10 text-blue-300',
  },
  {
    icon: '📱',
    title: 'Apps Mobiles',
    desc: 'Applications mobiles cross-platform iOS & Android avec une expérience utilisateur fluide et moderne.',
    tags: ['React Native', 'Expo', 'iOS', 'Android'],
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/20 hover:border-green-500/40',
    tag_color: 'bg-green-500/10 text-green-300',
  },
  {
    icon: '🐍',
    title: 'Scripts Python',
    desc: 'Automatisation, bots, scrapers, outils CLI, traitement de données ou intégrations API.',
    tags: ['Python', 'Automation', 'Scraping', 'API'],
    color: 'from-yellow-500/20 to-amber-500/10',
    border: 'border-yellow-500/20 hover:border-yellow-500/40',
    tag_color: 'bg-yellow-500/10 text-yellow-300',
  },
  {
    icon: '🤖',
    title: 'Bots Discord',
    desc: 'Bots Discord complets : modération, musique, economy, tickets, commandes slash et tableaux de bord web.',
    tags: ['Discord.js', 'Python', 'Dashboard', 'Slash'],
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/20 hover:border-violet-500/40',
    tag_color: 'bg-violet-500/10 text-violet-300',
  },
  {
    icon: '🎨',
    title: 'Design UI/UX',
    desc: 'Maquettes Figma, redesign d\'interfaces, design systems cohérents et prototypes interactifs.',
    tags: ['Figma', 'UI Design', 'Prototype', 'Design System'],
    color: 'from-pink-500/20 to-rose-500/10',
    border: 'border-pink-500/20 hover:border-pink-500/40',
    tag_color: 'bg-pink-500/10 text-pink-300',
  },
  {
    icon: '⚡',
    title: 'Logos & Branding',
    desc: 'Identité visuelle complète : logo, charte graphique, bannières Discord/Twitch, miniatures YouTube.',
    tags: ['Illustrator', 'Photoshop', 'Logo', 'Branding'],
    color: 'from-indigo-500/20 to-blue-500/10',
    border: 'border-indigo-500/20 hover:border-indigo-500/40',
    tag_color: 'bg-indigo-500/10 text-indigo-300',
  },
  {
    icon: '🔧',
    title: 'Automatisation & Outils',
    desc: 'Scripts d\'automatisation, outils custom pour ton serveur Discord, intégrations Zapier/Make, workflows.',
    tags: ['Automation', 'API', 'Webhooks', 'CLI'],
    color: 'from-teal-500/20 to-cyan-500/10',
    border: 'border-teal-500/20 hover:border-teal-500/40',
    tag_color: 'bg-teal-500/10 text-teal-300',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Ce qu'on fait
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Nos Services
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Du script Roblox à l'app mobile, on couvre tous tes besoins digitaux avec qualité et rapidité.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className={`relative group p-5 sm:p-6 rounded-2xl border bg-gradient-to-br ${s.color} ${s.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default`}
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-white text-base sm:text-lg mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className={`text-xs px-2 py-0.5 rounded-md font-medium ${s.tag_color}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Tu as un projet hors liste ?</p>
          <a
            href="https://discord.gg/fstudios"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold transition-colors border-b border-violet-400/30 hover:border-violet-300/50 pb-0.5"
          >
            Parle-nous en sur Discord
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
