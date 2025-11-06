'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useVanta } from '@/utils/useVanta';
import {
  Edit,
  Check,
  Brain,
  MessageSquare,
  FileText,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * ALL TOOLS PAGE
 *
 * Beautiful overview of all 8 AI tools:
 * - 4 Daily text tools (SECONDARY_MODEL)
 * - 2 SEO/Content tools (PRIMARY_MODEL)
 * - 2 Image tools (stub APIs)
 *
 * Features:
 * - Responsive grid (1/2/3 columns)
 * - GSAP stagger animations
 * - Glassmorphism cards
 * - Badge per category
 * - Links to dashboard with mode params or dedicated pages
 */

interface Tool {
  id: string;
  name: string;
  description: string;
  badge: 'text' | 'seo' | 'image';
  icon: React.ReactNode;
  href: string;
  gradient: string;
}

const TOOLS: Tool[] = [
  // Daily text tools
  {
    id: 'rewrite',
    name: 'AI Rewriter',
    description: 'Réécris instantanément n\'importe quel texte avec un style professionnel, amical ou personnalisé.',
    badge: 'text',
    icon: <Edit className="w-6 h-6" />,
    href: '/dashboard?mode=rewrite',
    gradient: 'from-purple-500 to-blue-500',
  },
  {
    id: 'correct',
    name: 'Grammar & Style Corrector',
    description: 'Corrige automatiquement la grammaire, l\'orthographe, la ponctuation et améliore le style de tes textes.',
    badge: 'text',
    icon: <Check className="w-6 h-6" />,
    href: '/dashboard?mode=correct',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'summarize',
    name: 'Smart Summarizer',
    description: 'Résume automatiquement tes articles, documents, notes de réunion en quelques secondes.',
    badge: 'text',
    icon: <Brain className="w-6 h-6" />,
    href: '/dashboard?mode=summarize',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'reply',
    name: 'Reply Assistant',
    description: 'Génère des réponses professionnelles ou amicales à tes emails et messages instantanément.',
    badge: 'text',
    icon: <MessageSquare className="w-6 h-6" />,
    href: '/dashboard?mode=reply',
    gradient: 'from-blue-500 to-indigo-500',
  },

  // SEO / Content tools
  {
    id: 'seo_generate',
    name: 'SEO Article Generator',
    description: 'Génère un article SEO complet optimisé pour Google, les IA génératives et les bases RAG. Expertise maximale.',
    badge: 'seo',
    icon: <FileText className="w-6 h-6" />,
    href: '/dashboard?mode=seo_generate',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'seo_rewrite',
    name: 'SEO Article Rewriter',
    description: 'Réécris et optimise un article existant pour le SEO moderne : technique, People-First, LLMO et RAG-friendly.',
    badge: 'seo',
    icon: <Sparkles className="w-6 h-6" />,
    href: '/dashboard?mode=seo_rewrite',
    gradient: 'from-pink-500 to-rose-500',
  },

  // Image tools
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'Supprime automatiquement l\'arrière-plan de tes images en un clic. Parfait pour produits, portraits et logos.',
    badge: 'image',
    icon: <ImageIcon className="w-6 h-6" />,
    href: '/tool/background-remover',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'watermark-remover',
    name: 'Watermark Remover',
    description: 'Retire les filigranes, logos et textes indésirables de tes images avec l\'intelligence artificielle.',
    badge: 'image',
    icon: <Wand2 className="w-6 h-6" />,
    href: '/tool/remove-watermark',
    gradient: 'from-blue-500 to-cyan-500',
  },
];

const BADGE_STYLES = {
  text: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  seo: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  image: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const BADGE_LABELS = {
  text: 'Text',
  seo: 'SEO',
  image: 'Image',
};

export default function ToolsPage() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const toolsGridRef = useRef<HTMLDivElement>(null);

  // Vanta background
  useVanta(vantaRef, {
    effect: 'waves',
    color: 0x7c3bed,
    backgroundColor: 0x000000,
    waveHeight: 15.0,
    waveSpeed: 0.5,
    shininess: 30.0,
    zoom: 0.8,
  });

  // GSAP animations
  useEffect(() => {
    // Animate tool cards with stagger
    const toolCards = gsap.utils.toArray('.tool-card');
    gsap.fromTo(
      toolCards,
      {
        y: 60,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: toolsGridRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background */}
      <div ref={vantaRef} className="fixed inset-0 -z-10"></div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-black pointer-events-none"></div>

      {/* Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-16 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            ← Retour au dashboard
          </Link>

          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">
              Tous les outils IA
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            8 outils puissants pour transformer ton quotidien. Texte, SEO, image : tout est là, optimisé par l'IA.
          </p>
        </header>

        {/* Tools Grid */}
        <div
          ref={toolsGridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="tool-card group block"
            >
              <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all hover:scale-105">
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      BADGE_STYLES[tool.badge]
                    }`}
                  >
                    {BADGE_LABELS[tool.badge]}
                  </span>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${tool.gradient} group-hover:scale-110 transition-transform`}
                  >
                    {tool.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
                  {tool.name}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {tool.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-purple-400 group-hover:gap-3 transition-all">
                  <span className="text-sm font-medium">Ouvrir l'outil</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-3">
            Prêt à booster ta productivité ?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Accède à tous ces outils dès maintenant avec un abonnement AI Daily Hub.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-bold transition-all hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            Voir les offres
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
