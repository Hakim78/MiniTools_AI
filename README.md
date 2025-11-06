# AI Daily Hub

Plateforme web moderne qui centralise plusieurs micro-outils IA du quotidien dans une interface fluide et intuitive.

## Stack Technique

- **Frontend**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Framer Motion + GSAP
- **Auth**: Clerk
- **Payment**: Stripe
- **Database**: Supabase
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Vercel

## Installation

### 1. Cloner et installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Je copie `.env.example` vers `.env.local` et je remplis toutes les clés :

```bash
cp .env.example .env.local
```

Je dois configurer :

#### OpenAI
- `OPENAI_API_KEY` : Ma clé API OpenAI (depuis https://platform.openai.com)

#### Stripe
- `STRIPE_SECRET_KEY` : Ma clé secrète Stripe (depuis https://dashboard.stripe.com)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : Ma clé publique Stripe
- `STRIPE_WEBHOOK_SECRET` : Secret webhook (voir section Webhooks ci-dessous)
- `STRIPE_STARTER_PRICE_ID` : ID du prix Starter (depuis Stripe Dashboard)
- `STRIPE_PRO_PRICE_ID` : ID du prix Pro (depuis Stripe Dashboard)

#### Clerk
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` : Ma clé publique Clerk (depuis https://clerk.com)
- `CLERK_SECRET_KEY` : Ma clé secrète Clerk

#### App URL
- `NEXT_PUBLIC_APP_URL` : URL de mon app (http://localhost:3000 en local)

### 3. Configuration Stripe

#### Créer les produits

Dans le Stripe Dashboard :

1. Je crée deux produits récurrents :
   - **Starter** : 9.99€/mois
   - **Pro** : 19.99€/mois

2. Je récupère les Price IDs et je les ajoute dans `.env.local`

#### Configurer le webhook

1. En local, j'utilise Stripe CLI :
```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

2. En production sur Vercel :
   - Je crée un endpoint webhook : `https://mon-domaine.com/api/stripe/webhook`
   - Je sélectionne ces événements :
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Je copie le webhook secret dans mes variables environnement Vercel

### 4. Configuration Clerk

1. Je crée une application sur https://clerk.com
2. Je récupère mes clés API
3. Je configure les URLs de redirection :
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`

4. Dans Clerk Dashboard > User & Authentication > Metadata :
   - J'ajoute ces champs dans Public Metadata :
     - `subscriptionStatus` (string)
     - `plan` (string)
     - `stripeSubscriptionId` (string)

### 5. Fonts (Optionnel)

Si je veux utiliser Satoshi :
1. Je télécharge Satoshi depuis https://www.fontshare.com/fonts/satoshi
2. Je place `Satoshi-Regular.woff2` et `Satoshi-Bold.woff2` dans `/public/fonts/`

Sinon, j'utilise uniquement Inter en modifiant `app/layout.tsx` :
- Je supprime l'import de `satoshi`
- Je remplace `font-sans` par `font-sans` dans tous les composants

### 6. Démarrer le projet

```bash
npm run dev
```

Je visite http://localhost:3000

## Architecture

```
ai-daily-hub/
├── app/
│   ├── api/
│   │   ├── rewrite/route.ts          # API IA Rewriter
│   │   └── stripe/
│   │       ├── checkout/route.ts     # Création session Stripe
│   │       └── webhook/route.ts      # Webhook Stripe
│   ├── pricing/page.tsx              # Page tarifs
│   ├── tool/[slug]/page.tsx          # Page dynamique outils
│   ├── access-denied/page.tsx        # Page accès refusé
│   ├── layout.tsx                    # Layout principal
│   ├── page.tsx                      # Homepage
│   └── globals.css                   # Styles globaux
├── components/
│   ├── Hero.tsx                      # Hero animé
│   ├── Navbar.tsx                    # Navigation
│   ├── ToolCard.tsx                  # Card outil avec animation
│   ├── ToolInterface.tsx             # Interface outil IA
│   └── PricingCard.tsx               # Card pricing
├── lib/
│   ├── openai.ts                     # Helper OpenAI
│   ├── stripe.ts                     # Helper Stripe
│   └── clerk.ts                      # Helper Clerk
├── data/
│   └── tools.json                    # Configuration outils
├── utils/
│   └── cn.ts                         # Utility Tailwind
└── middleware.ts                     # Protection routes Clerk
```

## Flow utilisateur

1. L'utilisateur arrive sur la homepage
2. Il voit les outils disponibles
3. Il clique sur "Commencer" → redirigé vers `/pricing`
4. Il choisit un plan → redirigé vers Stripe Checkout
5. Après paiement → Webhook Stripe met à jour Clerk avec `subscriptionStatus: active`
6. L'utilisateur peut maintenant accéder à tous les outils

## Ajouter un nouvel outil

1. J'ajoute l'outil dans `data/tools.json` :
```json
{
  "slug": "mon-outil",
  "title": "Mon Outil",
  "icon": "🎨",
  "description": "Description courte",
  "longDescription": "Description longue",
  "api": "/api/mon-outil",
  "category": "text",
  "featured": false,
  "gradient": "from-blue-500 to-cyan-500"
}
```

2. Je crée la route API dans `app/api/mon-outil/route.ts`
3. Je mets à jour `ToolInterface.tsx` si besoin pour gérer le nouvel input/output

## Déploiement sur Vercel

```bash
# Je connecte mon repo GitHub à Vercel
vercel

# J'ajoute toutes mes variables environnement dans Vercel Dashboard
# Je configure le webhook Stripe avec l'URL de production
# Je déploie
vercel --prod
```

## TODO / Prochaines étapes

- [ ] Ajouter les autres outils (Summarizer, Translator, etc.)
- [ ] Implémenter le système de limite de requêtes (200/mois pour Starter)
- [ ] Ajouter Supabase pour stocker l'historique des requêtes
- [ ] Créer un dashboard utilisateur
- [ ] Ajouter l'export PDF des résultats
- [ ] Mode sombre
- [ ] i18n (multilingue)

## Support

Pour toute question : [ton-email]

## Licence

Propriétaire - Tous droits réservés
