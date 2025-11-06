import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return userId;
}

export async function checkSubscription(): Promise<{
  isSubscribed: boolean;
  plan?: 'STARTER' | 'PRO';
}> {
  const user = await currentUser();
  
  if (!user) {
    return { isSubscribed: false };
  }

  // Je vérifie si l'utilisateur a le tag "active_subscriber" dans Clerk
  const hasActiveSubscription = user.publicMetadata?.subscriptionStatus === 'active';
  const plan = (user.publicMetadata?.plan as 'STARTER' | 'PRO') || 'STARTER';

  return {
    isSubscribed: hasActiveSubscription,
    plan: hasActiveSubscription ? plan : undefined,
  };
}

export async function requireSubscription() {
  const { isSubscribed } = await checkSubscription();
  
  if (!isSubscribed) {
    redirect('/pricing');
  }
}

export async function getUserEmail(): Promise<string | null> {
  const user = await currentUser();
  return user?.emailAddresses[0]?.emailAddress || null;
}

export async function updateUserSubscription(
  userId: string,
  plan: 'STARTER' | 'PRO',
  subscriptionId: string
) {
  // Cette fonction sera appelée par le webhook Stripe
  // Je mets à jour les metadata Clerk via l'API Clerk
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          subscriptionStatus: 'active',
          plan,
          stripeSubscriptionId: subscriptionId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Je n\'ai pas pu mettre à jour les métadonnées utilisateur');
    }

    return true;
  } catch (error) {
    console.error('Erreur mise à jour metadata Clerk:', error);
    return false;
  }
}

export async function removeUserSubscription(userId: string) {
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          subscriptionStatus: 'inactive',
          plan: null,
          stripeSubscriptionId: null,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Je n\'ai pas pu supprimer les métadonnées d\'abonnement');
    }

    return true;
  } catch (error) {
    console.error('Erreur suppression metadata Clerk:', error);
    return false;
  }
}
