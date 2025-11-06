'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface ToolCardProps {
  slug: string
  title: string
  icon: string
  description: string
  gradient: string
  featured?: boolean
}

export default function ToolCard({ slug, title, icon, description, gradient, featured }: ToolCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)

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
      gsap.to(card.querySelector('.icon-wrapper'), {
        rotate: 5,
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
      gsap.to(card.querySelector('.icon-wrapper'), {
        rotate: 0,
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
    <Link
      ref={cardRef}
      href={`/tool/${slug}`}
      className={`
        group relative block rounded-2xl p-6 
        bg-white/80 backdrop-blur-xl border border-gray-200/50
        hover:border-transparent hover:shadow-2xl
        transition-all duration-300
        ${featured ? 'md:col-span-2' : ''}
      `}
      style={{
        background: featured
          ? `linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(99, 102, 241, 0.05))`
          : undefined,
      }}
    >
      {featured && (
        <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold rounded-full shadow-lg">
          Populaire
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className={`icon-wrapper w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
          {icon}
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>

      <h3 className="text-xl font-sans font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>

      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
    </Link>
  )
}
