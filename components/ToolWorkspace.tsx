'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AiMode, HistoryEntry, AiTextRequest, AiTextResponse, AiError } from '@/types/ai';
import { Edit, Check, Brain, MessageSquare, Loader2, Copy, CheckCheck } from 'lucide-react';

/**
 * TOOL WORKSPACE - Composant principal du dashboard
 *
 * Gère :
 * - Input texte utilisateur (textarea)
 * - 4 boutons d'action (rewrite, correct, summarize, reply)
 * - Affichage du résultat
 * - Historique local (localStorage)
 * - Animations GSAP
 */

const MAX_HISTORY = 20;
const HISTORY_KEY = 'ai-daily-hub-history';

const MODES_CONFIG: Record<
  AiMode,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
  }
> = {
  rewrite: {
    label: 'Réécrire',
    icon: <Edit className="w-5 h-5" />,
    color: 'from-purple-500 to-blue-500',
    description: 'Réécrit ton texte de manière plus claire et professionnelle',
  },
  correct: {
    label: 'Corriger',
    icon: <Check className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500',
    description: 'Corrige la grammaire, l\'orthographe et le style',
  },
  summarize: {
    label: 'Résumer',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500',
    description: 'Crée un résumé concis de ton texte',
  },
  reply: {
    label: 'Répondre',
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'from-blue-500 to-indigo-500',
    description: 'Génère une réponse appropriée à ce message',
  },
};

export default function ToolWorkspace() {
  const [text, setText] = useState('');
  const [selectedMode, setSelectedMode] = useState<AiMode | null>(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Charger l'historique au montage
  useEffect(() => {
    loadHistory();

    // Animation d'entrée
    if (workspaceRef.current) {
      gsap.fromTo(
        workspaceRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  // Animer l'apparition du résultat
  useEffect(() => {
    if (output && outputRef.current) {
      gsap.fromTo(
        outputRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [output]);

  /**
   * Charger l'historique depuis localStorage
   */
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  /**
   * Sauvegarder dans l'historique
   */
  const saveToHistory = (mode: AiMode, inputText: string, outputText: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      text: inputText,
      mode,
      output: outputText,
      createdAt: new Date().toISOString(),
    };

    const newHistory = [entry, ...history].slice(0, MAX_HISTORY);
    setHistory(newHistory);

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Erreur sauvegarde historique:', error);
    }
  };

  /**
   * Appeler l'API AI
   */
  const handleAIAction = async (mode: AiMode) => {
    if (!text.trim()) {
      setError('Veuillez entrer du texte avant de continuer.');
      return;
    }

    setSelectedMode(mode);
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('/api/ai-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          mode,
        } as AiTextRequest),
      });

      const data = (await response.json()) as AiTextResponse | AiError;

      if (!response.ok) {
        throw new Error((data as AiError).error || 'Erreur inconnue');
      }

      const result = (data as AiTextResponse).output;
      setOutput(result);
      saveToHistory(mode, text.trim(), result);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charger une entrée de l'historique
   */
  const loadFromHistory = (entry: HistoryEntry) => {
    setText(entry.text);
    setOutput(entry.output);
    setSelectedMode(entry.mode);
    setError('');

    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Copier le résultat
   */
  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Nombre d'utilisations aujourd'hui
   */
  const todayUsage = history.filter((entry) => {
    const entryDate = new Date(entry.createdAt).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  }).length;

  return (
    <div ref={workspaceRef} className="w-full">
      {/* Stats du jour */}
      {todayUsage > 0 && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-400">
            Aujourd'hui, tu as déjà utilisé l'IA{' '}
            <span className="font-bold text-purple-400">{todayUsage} fois</span> 🔥
          </p>
        </div>
      )}

      {/* Zone de texte principale */}
      <div className="glass rounded-2xl p-6 mb-6 border border-white/10">
        <label htmlFor="input-text" className="block text-sm font-medium text-gray-300 mb-3">
          Ton texte
        </label>
        <textarea
          id="input-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Colle ton texte ici... (email, devoir, message, note, etc.)"
          className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          disabled={loading}
        />
        <div className="mt-2 text-xs text-gray-500 text-right">{text.length} / 10000 caractères</div>
      </div>

      {/* Boutons d'action */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(Object.keys(MODES_CONFIG) as AiMode[]).map((mode) => {
          const config = MODES_CONFIG[mode];
          const isSelected = selectedMode === mode;

          return (
            <button
              key={mode}
              onClick={() => handleAIAction(mode)}
              disabled={loading}
              className={`group relative rounded-xl p-6 transition-all hover:scale-105 ${
                isSelected
                  ? 'bg-gradient-to-br ' + config.color + ' shadow-lg'
                  : 'bg-white/5 border border-white/10 hover:border-purple-500/50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20' : 'bg-gradient-to-br ' + config.color
                  }`}
                >
                  {config.icon}
                </div>
                <div>
                  <div className="font-bold text-white">{config.label}</div>
                  <div className="text-xs text-gray-400 mt-1 hidden lg:block">{config.description}</div>
                </div>
              </div>

              {loading && isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Affichage de l'erreur */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Affichage du résultat */}
      {output && (
        <div ref={outputRef} className="glass rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Résultat {selectedMode && `(${MODES_CONFIG[selectedMode].label})`}
            </h3>
            <button
              onClick={copyOutput}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 text-sm"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-4 h-4 text-green-400" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier
                </>
              )}
            </button>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">{output}</div>
          </div>
        </div>
      )}

      {/* Loader pendant le traitement */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400 mb-4" />
          <p className="text-gray-400">L'IA analyse ton texte...</p>
          <p className="text-sm text-gray-500 mt-2">Cela peut prendre quelques secondes</p>
        </div>
      )}
    </div>
  );
}
