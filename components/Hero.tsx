'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      tl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.4'
      )

      // Animation du gradient en arrière-plan
      gsap.to('.gradient-orb', {
        scale: 1.2,
        opacity: 0.6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient animé en arrière-plan */}
      <div className="absolute inset-0 -z-10">
        <div className="gradient-orb absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="gradient-orb absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Mes outils IA quotidiens</span>
        </div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-sans font-bold text-gray-900 mb-6 leading-tight"
        >
          Centralise tous mes
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            micro-outils IA
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Une seule plateforme moderne pour accéder à mes outils IA du quotidien :
          réécriture, résumé, traduction, suppression de fond et bien plus.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="group px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 flex items-center gap-2"
          >
            Commencer maintenant
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#tools"
            className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-white hover:shadow-lg transition-all"
          >
            Découvrir les outils
          </Link>
        </div>
      </div>
    </div>
  )
}
