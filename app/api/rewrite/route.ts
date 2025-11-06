import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { checkSubscription } from '@/lib/clerk'
import { generateCompletion } from '@/lib/openai'

const TONE_PROMPTS = {
  professional: 'Réécris ce texte de manière professionnelle et formelle, adapté pour un contexte business.',
  friendly: 'Réécris ce texte de manière amicale et chaleureuse, comme si je parlais à un ami proche.',
  romantic: 'Réécris ce texte de manière romantique et poétique, avec des émotions intenses.',
  funny: 'Réécris ce texte de manière humoristique et légère, en ajoutant des touches d\'humour.',
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Je dois être connecté pour utiliser cet outil' },
        { status: 401 }
      )
    }

    // Je vérifie l'abonnement
    const { isSubscribed } = await checkSubscription()

    if (!isSubscribed) {
      return NextResponse.json(
        { error: 'Je dois être abonné pour utiliser cet outil' },
        { status: 403 }
      )
    }

    const { text, tone } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Je dois fournir un texte à réécrire' },
        { status: 400 }
      )
    }

    if (!tone || !Object.keys(TONE_PROMPTS).includes(tone)) {
      return NextResponse.json(
        { error: 'Je dois choisir un ton valide: professional, friendly, romantic, ou funny' },
        { status: 400 }
      )
    }

    const systemPrompt = TONE_PROMPTS[tone as keyof typeof TONE_PROMPTS]
    const userPrompt = `Texte à réécrire:\n\n${text}`

    const output = await generateCompletion(userPrompt, systemPrompt)

    return NextResponse.json({ output })
  } catch (error) {
    console.error('Erreur API rewrite:', error)
    return NextResponse.json(
      { error: 'Je n\'ai pas pu réécrire le texte' },
      { status: 500 }
    )
  }
}
