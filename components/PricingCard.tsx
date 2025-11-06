'use client'

import { Check, Sparkles } from 'lucide-react'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface PricingCardProps {
  name: string
  price: number
  features: string[]
  priceId: string
  recommended?: boolean
  onSubscribe: (priceId: string) => void
}

export default function PricingCard({ name, price, features, priceId, recommended, onSubscribe }: PricingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        y: -8,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`
        relative rounded-2xl p-8
        ${recommended 
          ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary shadow-2xl' 
          : 'bg-white/80 backdrop-blur-xl border border-gray-200'
        }
        transition-all duration-300
      `}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          Recommandé
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-sans font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold text-gray-900">{price}€</span>
          <span className="text-gray-600">/mois</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={`
              flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
              ${recommended ? 'bg-primary' : 'bg-gray-200'}
            `}>
              <Check className={`w-3 h-3 ${recommended ? 'text-white' : 'text-gray-600'}`} />
            </div>
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(priceId)}
        className={`
          w-full py-3 px-6 rounded-xl font-medium transition-all
          ${recommended
            ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-2xl hover:shadow-primary/50 hover:scale-105'
            : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl'
          }
        `}
      >
        Choisir {name}
      </button>
    </div>
  )
}
