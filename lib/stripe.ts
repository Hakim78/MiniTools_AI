import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Je ne trouve pas STRIPE_SECRET_KEY dans les variables environnement');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const PLANS = {
  STARTER: {
    name: 'Starter',
    price: 9.99,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    currency: 'eur',
    interval: 'month',
    features: [
      'Accès à tous les outils IA',
      '200 requêtes par mois',
      'Support par email',
      'Historique 30 jours',
    ],
    requestLimit: 200,
  },
  PRO: {
    name: 'Pro',
    price: 19.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    currency: 'eur',
    interval: 'month',
    features: [
      'Accès illimité à tous les outils',
      'Requêtes illimitées',
      'Support prioritaire 24/7',
      'Historique illimité',
      'Export PDF des résultats',
      'API access (bientôt)',
    ],
    requestLimit: -1, // -1 = illimité
    recommended: true,
  },
} as const;

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  priceId: string
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      client_reference_id: userId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return session;
  } catch (error) {
    console.error('Erreur création session Stripe:', error);
    throw new Error('Je n\'ai pas pu créer la session de paiement.');
  }
}

export async function getSubscriptionStatus(userId: string): Promise<{
  isActive: boolean;
  plan?: 'STARTER' | 'PRO';
  requestsUsed?: number;
  requestsLimit?: number;
}> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      limit: 1,
    });

    // Je cherche l'abonnement actif pour cet utilisateur
    const activeSubscription = subscriptions.data.find(
      (sub) => sub.metadata.userId === userId && sub.status === 'active'
    );

    if (!activeSubscription) {
      return { isActive: false };
    }

    // Je détermine le plan basé sur le price_id
    const priceId = activeSubscription.items.data[0]?.price.id;
    let plan: 'STARTER' | 'PRO' = 'STARTER';
    
    if (priceId === PLANS.PRO.priceId) {
      plan = 'PRO';
    }

    return {
      isActive: true,
      plan,
      requestsLimit: PLANS[plan].requestLimit,
    };
  } catch (error) {
    console.error('Erreur récupération statut abonnement:', error);
    return { isActive: false };
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  try {
    await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    console.error('Erreur annulation abonnement:', error);
    throw new Error('Je n\'ai pas pu annuler l\'abonnement.');
  }
}

export async function createCustomerPortalSession(
  customerId: string
): Promise<string> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,
    });

    return session.url;
  } catch (error) {
    console.error('Erreur création portal client:', error);
    throw new Error('Je n\'ai pas pu créer la session du portail client.');
  }
}
