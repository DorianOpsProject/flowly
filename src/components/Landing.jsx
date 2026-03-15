export default function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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
          <button
            onClick={onGetStarted}
            className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Commencer gratuitement
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-800/50 rounded-full px-4 py-2 text-sm text-violet-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
            Tout-en-un pour les professionnels
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Travaillez mieux,{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              accomplissez plus
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Flowly regroupe la gestion de tâches, le suivi du temps, les notes et la planification en un seul espace de travail fluide. Fini les onglets éparpillés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-violet-900/40"
            >
              Essayer maintenant — c&apos;est gratuit
            </button>
            <button className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg transition-colors">
              Voir la démo
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">Aucune carte bancaire requise · Accès instantané</p>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-16 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-violet-900/20">
          <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            <div className="flex-1 mx-4 bg-gray-800 rounded text-center text-xs text-gray-500 py-0.5">app.flowly.fr/dashboard</div>
          </div>
          <div className="bg-gray-900 p-6 grid grid-cols-4 gap-4 min-h-[280px]">
            <div className="col-span-1 bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Navigation</p>
              {['Tableau de bord', 'Tâches', 'Focus', 'Notes', 'Planning'].map(item => (
                <div key={item} className={`text-sm py-2 px-3 rounded-lg mb-1 cursor-pointer ${item === 'Tableau de bord' ? 'bg-violet-600/30 text-violet-300' : 'text-gray-400 hover:text-gray-200'}`}>
                  {item}
                </div>
              ))}
            </div>
            <div className="col-span-3 grid grid-rows-2 gap-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Tâches aujourd\'hui', value: '8', color: 'violet' },
                  { label: 'Focus accompli', value: '2h 40m', color: 'indigo' },
                  { label: 'Notes créées', value: '12', color: 'blue' },
                ].map(card => (
                  <div key={card.label} className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                <p className="text-xs text-gray-500 font-medium mb-3">TÂCHES EN COURS</p>
                <div className="space-y-2">
                  {[
                    { text: 'Préparer la présentation client', done: true },
                    { text: 'Réviser le contrat Q2', done: false },
                    { text: 'Appel avec l\'équipe design', done: false },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border ${t.done ? 'bg-violet-600 border-violet-600' : 'border-gray-600'} flex-shrink-0 flex items-center justify-center`}>
                        {t.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                      </div>
                      <span className={`text-sm ${t.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Un seul outil pour remplacer tous vos autres outils de productivité.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '📋',
                title: 'Gestion de tâches',
                desc: 'Kanban visuel, priorités, deadlines. Gardez le cap sur ce qui compte.',
              },
              {
                icon: '⏱️',
                title: 'Timer Focus',
                desc: 'Sessions Pomodoro intégrées. Entrez en mode deep work en un clic.',
              },
              {
                icon: '📝',
                title: 'Notes rapides',
                desc: 'Capturez vos idées instantanément. Organisez, recherchez, retrouvez.',
              },
              {
                icon: '📅',
                title: 'Planning',
                desc: 'Vue hebdomadaire claire de vos projets et rendez-vous.',
              },
            ].map(f => (
              <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-violet-800/50 transition-colors group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-8">Ce que disent nos utilisateurs</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sophie M.', role: 'Designer freelance', text: 'Flowly a complètement changé ma façon de travailler. Je suis 3x plus productive.' },
              { name: 'Thomas B.', role: 'Chef de projet', text: 'Enfin un outil qui fait tout. J\'ai supprimé 4 apps depuis que j\'utilise Flowly.' },
              { name: 'Léa K.', role: 'Développeuse', text: 'Le timer focus est incroyable. Je rentre dans le flow beaucoup plus facilement.' },
            ].map(t => (
              <div key={t.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left">
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Tarifs simples et transparents</h2>
          <p className="text-gray-400 text-lg mb-16">Commencez gratuitement, évoluez à votre rythme.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Gratuit', price: '0€', period: '/mois',
                features: ['Tâches illimitées', 'Timer Focus', '10 notes', '1 espace de travail'],
                cta: 'Commencer', highlight: false,
              },
              {
                name: 'Pro', price: '9€', period: '/mois',
                features: ['Tout du plan Gratuit', 'Notes illimitées', 'Historique 1 an', 'Priorité support'],
                cta: 'Essai 14 jours', highlight: true,
              },
              {
                name: 'Équipe', price: '29€', period: '/mois',
                features: ['Tout du plan Pro', 'Jusqu\'à 10 membres', 'Tableaux partagés', 'Statistiques équipe'],
                cta: 'Contacter', highlight: false,
              },
            ].map(plan => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 text-left border ${plan.highlight
                  ? 'bg-violet-900/30 border-violet-600 shadow-lg shadow-violet-900/30'
                  : 'bg-gray-900 border-gray-800'
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs bg-violet-600 text-white px-3 py-1 rounded-full inline-block mb-4 font-medium">
                    Plus populaire
                  </div>
                )}
                <p className="text-gray-400 text-sm mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                    plan.highlight
                      ? 'bg-violet-600 hover:bg-violet-500 text-white hover:scale-105'
                      : 'border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à être dans le flow ?</h2>
          <p className="text-gray-400 text-lg mb-8">Rejoignez des milliers de professionnels qui utilisent Flowly chaque jour.</p>
          <button
            onClick={onGetStarted}
            className="bg-violet-600 hover:bg-violet-500 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-violet-900/40"
          >
            Commencer maintenant — gratuit
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 px-6 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
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
