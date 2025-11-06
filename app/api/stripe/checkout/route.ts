import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createCheckoutSession } from '@/lib/stripe'
import { getUserEmail } from '@/lib/clerk'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Je dois être connecté pour m\'abonner' },
        { status: 401 }
      )
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Je dois fournir un priceId' },
        { status: 400 }
      )
    }

    const userEmail = await getUserEmail()

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Je n\'ai pas trouvé d\'email pour cet utilisateur' },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession(userId, userEmail, priceId)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erreur création session checkout:', error)
    return NextResponse.json(
      { error: 'Je n\'ai pas pu créer la session de paiement' },
      { status: 500 }
    )
  }
}
