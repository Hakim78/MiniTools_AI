'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2, Sparkles, Copy, Check } from 'lucide-react'
import gsap from 'gsap'

interface ToolInterfaceProps {
  tool: {
    slug: string
    title: string
    api: string
  }
}

const TONES = [
  { value: 'professional', label: 'Professionnel' },
  { value: 'friendly', label: 'Amical' },
  { value: 'romantic', label: 'Romantique' },
  { value: 'funny', label: 'Humoristique' },
]

export default function ToolInterface({ tool }: ToolInterfaceProps) {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputText && outputRef.current) {
      gsap.fromTo(
        outputRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      )
    }
  }, [outputText])

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      alert('Je dois entrer un texte à réécrire')
      return
    }

    setLoading(true)
    setOutputText('')

    try {
      const response = await fetch(tool.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, tone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setOutputText(data.output)
    } catch (error) {
      console.error('Erreur:', error)
      alert(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!outputText) return

    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erreur copie:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-xl">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Mon texte à réécrire
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Je colle mon texte ici..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Ton souhaité
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${tone === t.value
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !inputText.trim()}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-2xl hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Je réécris...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Réécrire le texte
            </>
          )}
        </button>
      </div>

      {outputText && (
        <div
          ref={outputRef}
          className="bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-xl rounded-2xl p-6 border border-primary/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-900">
              Résultat
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
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
          <div className="px-4 py-3 bg-white/50 rounded-xl border border-gray-200">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {outputText}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
