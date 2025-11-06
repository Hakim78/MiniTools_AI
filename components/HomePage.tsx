'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useVanta } from '@/utils/useVanta'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage(): JSX.Element {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null)
  const [activeStep, setActiveStep] = useState(0)

  useVanta(vantaRef, {
    effect: 'waves',
    color: 0x7c3bed,
    backgroundColor: 0x000000,
    waveHeight: 20.0,
    waveSpeed: 0.6,
    shininess: 40.0,
    zoom: 0.75,
  })

  useEffect(() => {
    gsap.fromTo('.hero-title', 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    )

    gsap.fromTo('.hero-subtitle', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.5 }
    )

    gsap.fromTo('.hero-cta', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.8 }
    )

    const cards = gsap.utils.toArray('.tool-card')
    gsap.fromTo(cards,
      { y: 80, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.tools-grid',
          start: 'top 80%',
        },
      }
    )

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 3000)

    return () => clearInterval(stepInterval)
  }, [])

  const tools = [
    {
      icon: 'edit',
      title: 'AI Rewriter',
      desc: 'Réécris instantanément tout texte selon un ton choisi (pro, amical, romantique).',
      bgImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'
    },
    {
      icon: 'psychology',
      title: 'Smart Summarizer',
      desc: 'Résume automatiquement tes textes, articles ou documents en quelques secondes.',
      bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
    },
    {
      icon: 'chat',
      title: 'AI Reply Assistant',
      desc: 'Génère automatiquement des réponses pros ou amicales à tes emails et messages.',
      bgImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400'
    },
    {
      icon: 'spellcheck',
      title: 'AI Text Polisher',
      desc: 'Corrige instantanément la grammaire, la syntaxe et le style de tes textes.',
      bgImage: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400'
    },
    {
      icon: 'image',
      title: 'Background Remover',
      desc: 'Supprime ou remplace automatiquement l\'arrière-plan de tes images.',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
    },
    {
      icon: 'auto_fix_high',
      title: 'Watermark Remover',
      desc: 'Efface automatiquement les filigranes, logos ou textes indésirables.',
      bgImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'
    }
  ]

  const steps = [
    {
      num: '1',
      title: 'Choisis ton outil',
      desc: 'Sélectionne parmi nos 6 outils IA',
      icon: '🎯',
      color: 'from-purple-500 to-blue-500'
    },
    {
      num: '2',
      title: 'Entre ton contenu',
      desc: 'Colle ton texte ou upload ton image',
      icon: '✍️',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      num: '3',
      title: 'Récupère le résultat',
      desc: 'L\'IA traite en quelques secondes',
      icon: '⚡',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const faqs = [
    {
      q: 'Comment fonctionne AI Daily Hub ?',
      a: 'AI Daily Hub centralise 6 outils IA puissants dans une seule interface. Sélectionne ton outil, entre ton contenu, et obtiens un résultat professionnel en quelques secondes. Tous nos outils utilisent les derniers modèles d\'IA (GPT-4, Replicate) pour garantir la meilleure qualité.',
      icon: '🤖'
    },
    {
      q: 'Quels sont les outils disponibles ?',
      a: 'Nous proposons 6 outils essentiels : AI Rewriter (réécriture de texte), Smart Summarizer (résumés automatiques), Reply Assistant (génération de réponses), Text Polisher (correction grammaticale), Background Remover (suppression de fonds) et Watermark Remover (nettoyage d\'images).',
      icon: '🛠️'
    },
    {
      q: 'Mes données sont-elles sécurisées ?',
      a: 'Absolument. Nous utilisons un cryptage TLS 1.3 de niveau entreprise. Tes données sont traitées en temps réel et jamais stockées sur nos serveurs. Nous sommes 100% conformes GDPR et ne partageons aucune donnée avec des tiers.',
      icon: '🔒'
    },
    {
      q: 'Quelle est la différence entre Starter et Pro ?',
      a: 'Le plan Starter (9.99€/mois) offre 200 requêtes mensuelles et un support email. Le plan Pro (19.99€/mois) donne accès à des requêtes illimitées, un traitement prioritaire, des fonctionnalités avancées et un accès API pour intégrer nos outils dans tes propres applications.',
      icon: '💎'
    },
    {
      q: 'Puis-je annuler mon abonnement à tout moment ?',
      a: 'Oui, tu peux annuler ton abonnement à tout moment depuis ton tableau de bord. Aucun engagement, aucuns frais cachés. Si tu annules, ton accès reste actif jusqu\'à la fin de ta période de facturation.',
      icon: '✅'
    }
  ]

  return (
    <div className="relative w-full overflow-x-hidden bg-black text-white">
      <div ref={vantaRef} className="fixed inset-0 -z-10"></div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-orange-600/10 pointer-events-none"></div>

      <div className="relative z-10">
        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="hero-title">
              <p className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-4">
                TOUS TES OUTILS IA EN UN SEUL ENDROIT
              </p>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Transforme ton quotidien<br />
                avec l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400">Intelligence Artificielle</span>
              </h1>
            </div>
            
            <p className="hero-subtitle text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Réécris, résume, corrige, traduis et transforme tes contenus en quelques secondes. Sans inscription, sans limite.
            </p>
            
            <div className="hero-cta flex flex-wrap gap-4 justify-center">
              <Link
                href="#tools"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 font-bold text-lg shadow-lg shadow-purple-500/50 transition-all hover:scale-105"
              >
                Découvrir les outils
              </Link>
              <Link
                href="#pricing"
                className="px-8 py-4 rounded-xl border-2 border-white/20 bg-white/5 hover:bg-white/10 font-bold text-lg backdrop-blur-sm transition-all hover:scale-105"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>

          <div className="mt-20 text-center">
            <p className="text-sm text-gray-500 mb-8">Déjà utilisé par 2,000+ créateurs chaque jour</p>
          </div>
        </section>

        {/* MOCKUP SECTION */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <div className="aspect-video bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl">dashboard</span>
                    </div>
                    <p className="text-gray-400 text-lg font-medium">Interface Dashboard Preview</p>
                    <p className="text-gray-600 text-sm mt-2">Mockup à venir</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* TOOLS SECTION - GLASSMORPHISM */}
        <section id="tools" className="py-24 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-4">
                OUTILS IA QUOTIDIENS
              </p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                6 outils puissants pour<br />décupler ta productivité
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Chaque outil est conçu pour résoudre un problème précis et te faire gagner des heures de travail.
              </p>
            </div>

            <div className="tools-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, i) => (
                <div
                  key={i}
                  className="tool-card group relative rounded-2xl overflow-hidden hover:scale-105 transition-all cursor-pointer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Background Image Floutée */}
                  <div 
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{
                      backgroundImage: `url(${tool.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(8px)',
                    }}
                  ></div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/80 to-blue-500/80 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-purple-500/50">
                      <span className="material-symbols-outlined text-3xl text-white">{tool.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{tool.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{tool.desc}</p>
                  </div>

                  {/* Glass Effect Border */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 group-hover:ring-purple-500/50 transition-all pointer-events-none"></div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 font-semibold transition-all group backdrop-blur-sm"
              >
                Explorer tous les outils
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - 3 STEPS ANIMATED */}
        <section className="py-24 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-4">
                SIMPLE ET RAPIDE
              </p>
              <h2 className="text-4xl md:text-5xl font-black">
                Utilise l'IA en 3 secondes
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl border overflow-hidden transition-all ${
                    activeStep === i
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10 scale-105'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-purple-400">ÉTAPE {step.num}</span>
                          <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                        <p className="text-gray-400">{step.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1 bg-white/5">
                    <div
                      className={`h-full bg-gradient-to-r ${step.color} transition-all duration-[3000ms] ${
                        activeStep === i ? 'w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING - AVEC ANIMATION */}
        <section id="pricing" className="py-24 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-4">
                TARIFS SIMPLES
              </p>
              <h2 className="text-4xl md:text-5xl font-black">
                Un prix qui s'adapte à toi
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 hover:border-white/20 hover:scale-105 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">rocket_launch</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Starter</h3>
                    <p className="text-gray-400 text-sm">Pour les particuliers</p>
                  </div>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-black">9.99€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Accès à tous les outils',
                    '200 requêtes/mois',
                    'Support email',
                    'Export des résultats'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl border-2 border-purple-500 bg-purple-500/10 hover:bg-purple-500/20 font-bold transition-all">
                  Choisir Starter
                </button>
              </div>

              <div className="relative rounded-2xl border-2 border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-lg p-8 shadow-2xl shadow-purple-500/20 hover:scale-105 transition-all">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-sm font-bold shadow-lg">
                  RECOMMANDÉ
                </div>
                
                {/* Animated Stars */}
                <div className="absolute top-4 right-4 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <span
                      key={i}
                      className="text-yellow-400 animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Pro</h3>
                    <p className="text-gray-400 text-sm">Pour les power users</p>
                  </div>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-black">19.99€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Requêtes illimitées',
                    'Traitement IA prioritaire',
                    'Support prioritaire',
                    'Fonctionnalités avancées',
                    'Accès API'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span className="text-white font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-bold transition-all hover:scale-105 shadow-lg shadow-purple-500/50">
                  Choisir Pro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ AMÉLIORÉE */}
        <section className="py-24 px-4 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-4">
                BESOIN D'AIDE ?
              </p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Questions fréquentes
              </h2>
              <p className="text-gray-400 text-lg">
                Tout ce que tu dois savoir sur AI Daily Hub
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl border overflow-hidden transition-all cursor-pointer ${
                    activeFAQ === i
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10 md:col-span-2'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                        {faq.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold pr-4">{faq.q}</h3>
                          <span className={`text-2xl transition-transform ${activeFAQ === i ? 'rotate-45 text-purple-400' : 'text-gray-400'}`}>
                            +
                          </span>
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            activeFAQ === i ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p className="text-gray-400 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <p className="text-lg font-semibold mb-2">Encore des questions ?</p>
              <p className="text-gray-400 mb-6">Notre équipe est là pour t'aider 24/7</p>
              <button className="px-8 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 font-semibold transition-all hover:scale-105">
                Contacte-nous
              </button>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 px-4 border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">rocket_launch</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 border-4 border-black animate-pulse"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Prêt à booster<br />ta productivité ?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Rejoins des milliers d'utilisateurs qui gagnent du temps chaque jour avec l'IA.
            </p>
            <Link
              href="#tools"
              className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 font-bold text-lg shadow-lg shadow-purple-500/50 transition-all hover:scale-105"
            >
              Commencer gratuitement
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black/50 backdrop-blur-lg border-t border-white/10 py-12 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500"></div>
                <span className="text-xl font-bold">AI Daily Hub</span>
              </div>
              <p className="text-sm text-gray-400">
                Tous tes outils IA quotidiens en un seul endroit.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#tools" className="hover:text-white transition-colors">Outils</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            © 2025 AI Daily Hub. Tous droits réservés.
          </div>
        </footer>
      </div>
    </div>
  )
}