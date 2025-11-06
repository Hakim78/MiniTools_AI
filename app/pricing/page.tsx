'use client'

import { useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import PricingCard from '@/components/PricingCard'
import { Loader2 } from 'lucide-react'

const PLANS = {
  STARTER: {
    name: 'Starter',
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
    features: [
      'Accès à tous les outils IA',
      '200 requêtes par mois',
      'Support par email',
      'Historique 30 jours',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 19.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    features: [
      'Accès illimité à tous les outils',
      'Requêtes illimitées',
      'Support prioritaire 24/7',
      'Historique illimité',
      'Export PDF des résultats',
      'API access (bientôt)',
    ],
    recommended: true,
  },
}

export default function PricingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pricing-header',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )

      gsap.fromTo(
        '.pricing-card',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.3,
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleSubscribe = async (priceId: string) => {
    if (!isLoaded) return

    if (!user) {
      router.push('/sign-in')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Je n\'ai pas reçu d\'URL de checkout')
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error)
      alert('Une erreur est survenue. Je réessaye dans un instant.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="pricing-header text-center mb-16">
          <h1 className="text-5xl font-sans font-bold text-gray-900 mb-4">
            Choisis mon plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            J'accède à tous mes outils IA quotidiens avec un seul abonnement simple.
            Aucun engagement, je peux annuler à tout moment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="pricing-card">
            <PricingCard
              name={PLANS.STARTER.name}
              price={PLANS.STARTER.price}
              features={PLANS.STARTER.features}
              priceId={PLANS.STARTER.priceId}
              onSubscribe={handleSubscribe}
            />
          </div>

          <div className="pricing-card">
            <PricingCard
              name={PLANS.PRO.name}
              price={PLANS.PRO.price}
              features={PLANS.PRO.features}
              priceId={PLANS.PRO.priceId}
              recommended={PLANS.PRO.recommended}
              onSubscribe={handleSubscribe}
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Paiement sécurisé par Stripe • Annulation en un clic
          </p>
          <p className="text-sm text-gray-500">
            En m'abonnant, j'accepte les conditions d'utilisation et la politique de confidentialité.
          </p>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-gray-900 font-medium">Je prépare le paiement...</p>
          </div>
        </div>
      )}
    </div>
  )
}
