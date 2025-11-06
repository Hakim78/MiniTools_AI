import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { updateUserSubscription, removeUserSubscription } from '@/lib/clerk'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Je n\'ai pas trouvé la signature Stripe' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (error) {
    console.error('Erreur validation webhook:', error)
    return NextResponse.json(
      { error: 'Je n\'ai pas pu valider le webhook' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const subscriptionId = session.subscription as string

        if (!userId) {
          console.error('Je n\'ai pas trouvé le userId dans les metadata')
          break
        }

        // Je récupère l'abonnement pour déterminer le plan
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0]?.price.id

        // Je détermine le plan basé sur le priceId
        let plan: 'STARTER' | 'PRO' = 'STARTER'
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          plan = 'PRO'
        }

        // Je mets à jour les metadata Clerk
        await updateUserSubscription(userId, plan, subscriptionId)

        console.log(`Abonnement créé pour l'utilisateur ${userId} - Plan: ${plan}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('Je n\'ai pas trouvé le userId dans les metadata')
          break
        }

        if (subscription.status === 'active') {
          const priceId = subscription.items.data[0]?.price.id
          let plan: 'STARTER' | 'PRO' = 'STARTER'
          
          if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
            plan = 'PRO'
          }

          await updateUserSubscription(userId, plan, subscription.id)
          console.log(`Abonnement mis à jour pour l'utilisateur ${userId} - Plan: ${plan}`)
        } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          await removeUserSubscription(userId)
          console.log(`Abonnement annulé pour l'utilisateur ${userId}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('Je n\'ai pas trouvé le userId dans les metadata')
          break
        }

        await removeUserSubscription(userId)
        console.log(`Abonnement supprimé pour l'utilisateur ${userId}`)
        break
      }

      default:
        console.log(`Type d'événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur traitement webhook:', error)
    return NextResponse.json(
      { error: 'Je n\'ai pas pu traiter le webhook' },
      { status: 500 }
    )
  }
}
