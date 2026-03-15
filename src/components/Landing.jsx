import { motion } from 'framer-motion'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

export default function Landing({ onGetStarted, onLogin }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-white">flowly</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={onLogin} className="text-gray-400 hover:text-white text-sm px-3 py-2 transition-colors hidden sm:block">
              Connexion
            </button>
            <button onClick={onGetStarted}
              className="bg-violet-600 hover:bg-violet-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105">
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-800/50 rounded-full px-4 py-2 text-sm text-violet-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Tout-en-un pour les professionnels
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Travaillez mieux,{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              accomplissez plus
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Flowly regroupe la gestion de tâches, le suivi du temps, les notes et la planification en un seul espace de travail fluide. Fini les onglets éparpillés.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onGetStarted}
              className="bg-violet-600 hover:bg-violet-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-violet-900/40">
              Essayer maintenant — c&apos;est gratuit
            </button>
            <button onClick={onLogin}
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg transition-all">
              Se connecter
            </button>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-4 text-sm text-gray-500">Aucune carte bancaire requise · Accès instantané</motion.p>
        </div>

        {/* Dashboard Preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
          className="max-w-5xl mx-auto mt-16 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-violet-900/20">
          <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <div className="flex-1 mx-4 bg-gray-800 rounded text-center text-xs text-gray-500 py-0.5 hidden sm:block">app.flowly.fr/dashboard</div>
          </div>
          <div className="bg-gray-900 p-3 sm:p-6 grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 min-h-[180px] sm:min-h-[280px]">
            <div className="hidden sm:block col-span-1 bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Navigation</p>
              {['Tableau de bord', 'Tâches', 'Focus', 'Notes', 'Planning', 'Analytics', 'Objectifs', 'Chat'].map(item => (
                <div key={item} className={`text-xs py-1.5 px-2 rounded-lg mb-0.5 ${item === 'Tableau de bord' ? 'bg-violet-600/30 text-violet-300' : 'text-gray-400'}`}>
                  {item}
                </div>
              ))}
            </div>
            <div className="col-span-3 grid grid-rows-2 gap-3 sm:gap-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[{ label: 'Tâches', value: '8' }, { label: 'Focus', value: '2h 40m' }, { label: 'Notes', value: '12' }].map(card => (
                  <div key={card.label} className="bg-gray-800/60 rounded-xl p-2 sm:p-4 border border-gray-700/50">
                    <p className="text-base sm:text-2xl font-bold text-white">{card.value}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{card.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800/60 rounded-xl p-3 sm:p-4 border border-gray-700/50">
                <p className="text-[10px] text-gray-500 font-medium mb-2">TÂCHES EN COURS</p>
                <div className="space-y-1.5">
                  {[{ text: 'Préparer la présentation', done: true }, { text: 'Réviser le contrat Q2', done: false }, { text: 'Appel design', done: false }].map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded border flex-shrink-0 ${t.done ? 'bg-violet-600 border-violet-600' : 'border-gray-600'}`} />
                      <span className={`text-[10px] sm:text-sm truncate ${t.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12 sm:mb-16">
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">Tout ce dont vous avez besoin</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">Un seul outil pour remplacer tous vos autres outils de productivité.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: '📋', title: 'Gestion de tâches', desc: 'Kanban visuel, priorités, deadlines. Gardez le cap sur ce qui compte.' },
              { icon: '⏱️', title: 'Timer Focus', desc: 'Sessions Pomodoro intégrées. Deep work en un clic.' },
              { icon: '📝', title: 'Notes rapides', desc: 'Capturez vos idées instantanément. Organisez et retrouvez.' },
              { icon: '📅', title: 'Planning', desc: 'Vue hebdomadaire claire de vos projets et rendez-vous.' },
              { icon: '📊', title: 'Analytics', desc: 'Suivez votre productivité avec des stats visuelles.' },
              { icon: '🎯', title: 'Objectifs', desc: 'Habitudes et objectifs quotidiens, hebdomadaires.' },
              { icon: '⌚', title: 'Timesheet', desc: 'Tracez le temps passé par projet et client.' },
              { icon: '💬', title: 'Chat d\'équipe', desc: 'Communicez en temps réel avec votre équipe.' },
            ].map(f => (
              <motion.div key={f.title} variants={fadeUp}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 hover:border-violet-800/50 transition-all group hover:scale-[1.02]">
                <div className="text-2xl sm:text-3xl mb-3">{f.icon}</div>
                <h3 className="text-sm sm:text-base font-semibold mb-1.5 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-8">Ce que disent nos utilisateurs</p>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: 'Sophie M.', role: 'Designer freelance', text: 'Flowly a complètement changé ma façon de travailler. Je suis 3x plus productive.' },
              { name: 'Thomas B.', role: 'Chef de projet', text: 'Enfin un outil qui fait tout. J\'ai supprimé 4 apps depuis que j\'utilise Flowly.' },
              { name: 'Léa K.', role: 'Développeuse', text: 'Le timer focus est incroyable. Je rentre dans le flow beaucoup plus facilement.' },
            ].map(t => (
              <motion.div key={t.name} variants={fadeUp}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 text-left hover:border-gray-700 transition-colors">
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div><p className="font-semibold text-sm">{t.name}</p><p className="text-gray-500 text-xs">{t.role}</p></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">Tarifs simples et transparents</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-base sm:text-lg mb-12 sm:mb-16">Commencez gratuitement, évoluez à votre rythme.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {[
              { name: 'Gratuit', price: '0€', period: '/mois', features: ['Tâches illimitées', 'Timer Focus', '10 notes', '1 espace de travail'], cta: 'Commencer', highlight: false },
              { name: 'Pro', price: '9€', period: '/mois', features: ['Tout du plan Gratuit', 'Notes illimitées', 'Analytics avancés', 'Objectifs & Timesheet', 'Support prioritaire'], cta: 'Essai 14 jours', highlight: true },
              { name: 'Équipe', price: '29€', period: '/mois', features: ['Tout du plan Pro', 'Chat d\'équipe', 'Jusqu\'à 10 membres', 'Tableaux partagés'], cta: 'Contacter', highlight: false },
            ].map(plan => (
              <motion.div key={plan.name} variants={fadeUp}
                className={`rounded-2xl p-6 sm:p-8 text-left border transition-all hover:scale-[1.02] ${plan.highlight ? 'bg-violet-900/30 border-violet-600 shadow-lg shadow-violet-900/30' : 'bg-gray-900 border-gray-800'}`}>
                {plan.highlight && <div className="text-xs bg-violet-600 text-white px-3 py-1 rounded-full inline-block mb-4 font-medium">Plus populaire</div>}
                <p className="text-gray-400 text-sm mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-5 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-7 sm:mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={onGetStarted}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${plan.highlight ? 'bg-violet-600 hover:bg-violet-500 text-white hover:scale-105' : 'border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white'}`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">Prêt à être dans le flow ?</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-base sm:text-lg mb-8">Rejoignez des milliers de professionnels qui utilisent Flowly chaque jour.</motion.p>
            <motion.button variants={fadeUp} onClick={onGetStarted}
              className="bg-violet-600 hover:bg-violet-500 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-violet-900/40">
              Commencer maintenant — gratuit
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 sm:py-10 px-4 sm:px-6 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          <span className="font-semibold text-gray-400">flowly</span>
        </div>
        <p>© 2026 Flowly. Fait avec ❤️ en France.</p>
      </footer>
    </div>
  )
}
