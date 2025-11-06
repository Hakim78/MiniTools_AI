'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { useVanta } from '@/utils/useVanta';
import ToolWorkspace from '@/components/ToolWorkspace';
import { HistoryEntry, AiMode } from '@/types/ai';
import { Edit, Check, Brain, MessageSquare, Clock, Sparkles, Image, Wand2 } from 'lucide-react';

/**
 * PAGE DASHBOARD - AI WORK DESK
 *
 * Page principale après connexion/abonnement
 * Interface unifiée pour tous les outils texte + accès aux outils image
 *
 * Layout :
 * - Desktop : 2 colonnes (workspace + historique)
 * - Mobile : 1 colonne (workspace puis historique)
 *
 * TODO: Ajouter la logique d'authentification et d'abonnement (Clerk + Stripe)
 */

const HISTORY_KEY = 'ai-daily-hub-history';

const MODE_ICONS: Record<AiMode, React.ReactNode> = {
  rewrite: <Edit className="w-4 h-4" />,
  correct: <Check className="w-4 h-4" />,
  summarize: <Brain className="w-4 h-4" />,
  reply: <MessageSquare className="w-4 h-4" />,
};

const MODE_COLORS: Record<AiMode, string> = {
  rewrite: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  correct: 'bg-green-500/20 text-green-400 border-green-500/30',
  summarize: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  reply: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function DashboardPage() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // TODO: Remplacer par vraie logique Clerk/Stripe
  const isSubscribed = true; // Placeholder
  const userName = 'User'; // TODO: récupérer depuis Clerk

  // Background animé Vanta.js
  useVanta(vantaRef, {
    effect: 'waves',
    color: 0x7c3aed,
    backgroundColor: 0x000000,
    waveHeight: 15.0,
    waveSpeed: 0.5,
    shininess: 30.0,
    zoom: 0.8,
  });

  // Animations d'entrée
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }

    // Charger l'historique
    loadHistory();

    // Écouter les changements de l'historique
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Charger l'historique depuis localStorage
   */
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed.slice(0, 5)); // Afficher seulement les 5 plus récents
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  /**
   * Redirection si pas d'abonnement
   */
  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-6 flex items-center justify-center">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Abonnement requis</h1>
          <p className="text-gray-400 mb-8">
            Pour accéder au dashboard et utiliser les outils IA, tu dois d'abord souscrire à un abonnement.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-bold transition-all hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            Voir les offres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Vanta.js */}
      <div ref={vantaRef} className="fixed inset-0 -z-10"></div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-black pointer-events-none"></div>

      {/* Container principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header ref={headerRef} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500"></div>
              <span className="text-xl font-bold">AI Daily Hub</span>
            </Link>

            <Link
              href="/pricing"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
            >
              Mon abonnement
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Bonjour{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {userName}
              </span>
              ,
            </h1>
            <p className="text-xl text-gray-400">Qu'est-ce qu'on optimise aujourd'hui ?</p>
          </div>
        </header>

        {/* Layout principal : 2 colonnes sur desktop, 1 colonne sur mobile */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Workspace principal (2/3 de la largeur) */}
          <div className="lg:col-span-2">
            <ToolWorkspace />

            {/* Outils image - Liens rapides */}
            <div className="mt-8 glass rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-purple-400" />
                Outils Image
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/tool/background-remover"
                  className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Image className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Efface-Fond IA</h4>
                      <p className="text-xs text-gray-400">Supprime l'arrière-plan</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/tool/remove-watermark"
                  className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Nettoy-Image IA</h4>
                      <p className="text-xs text-gray-400">Retire les filigranes</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Historique (1/3 de la largeur) */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 border border-white/10 sticky top-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Historique récent
              </h3>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-500">Aucune utilisation récente</p>
                  <p className="text-xs text-gray-600 mt-2">Commence par utiliser un outil !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => {
                        // Charger cette entrée dans le workspace
                        window.dispatchEvent(
                          new CustomEvent('load-history', { detail: entry })
                        );
                      }}
                      className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all group"
                    >
                      {/* Badge du mode */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${
                            MODE_COLORS[entry.mode]
                          }`}
                        >
                          {MODE_ICONS[entry.mode]}
                          {entry.mode}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      {/* Extrait du texte */}
                      <p className="text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
                        {entry.text.substring(0, 80)}
                        {entry.text.length > 80 && '...'}
                      </p>
                    </button>
                  ))}

                  <Link
                    href="/history"
                    className="block text-center py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Voir tout l'historique →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
