'use client'

import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Navbar() {
  const { isSignedIn } = useUser()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
    }
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Daily Hub
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Tarifs
            </Link>
            
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all',
                  },
                }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-accent rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  Commencer
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
