import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
          <Lock className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-3xl font-sans font-bold text-gray-900 mb-4">
          Accès restreint
        </h1>

        <p className="text-gray-600 mb-8">
          Je dois m'abonner pour accéder à cet outil et profiter de tous mes micro-outils IA quotidiens.
        </p>

        <Link
          href="/pricing"
          className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
        >
          Voir les tarifs
        </Link>

        <Link
          href="/"
          className="block mt-4 text-sm text-gray-600 hover:text-primary transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
