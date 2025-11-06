import { NextRequest, NextResponse } from 'next/server';
import { AiTextRequest, AiTextResponse, AiError, AiMode } from '@/types/ai';
import { optimizePrompt } from '@/lib/promptOptimizer';
import { routeToAI } from '@/lib/aiRouter';

/**
 * API ENDPOINT : /api/ai-text
 *
 * Orchestrateur principal pour toutes les actions texte IA :
 * - Réécriture (rewrite)
 * - Correction (correct)
 * - Résumé (summarize)
 * - Réponse (reply)
 *
 * Pipeline en 3 étapes :
 * 1. Validation de l'input
 * 2. Prompt Optimizer (améliore la requête utilisateur)
 * 3. AI Router (route vers les LLM disponibles et fusionne les réponses)
 *
 * TODO: Ajouter la vérification d'abonnement (Clerk + Stripe)
 * TODO: Implémenter les limites de requêtes (rate limiting)
 */

const VALID_MODES: AiMode[] = ['rewrite', 'correct', 'summarize', 'reply'];

export async function POST(request: NextRequest) {
  try {
    // ========== ÉTAPE 1 : VALIDATION ==========
    const body: AiTextRequest = await request.json();

    // Valider que le texte existe et n'est pas vide
    if (!body.text || typeof body.text !== 'string' || body.text.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Le texte est requis et ne peut pas être vide.',
        } as AiError,
        { status: 400 }
      );
    }

    // Valider que le mode est valide
    if (!body.mode || !VALID_MODES.includes(body.mode)) {
      return NextResponse.json(
        {
          error: `Le mode doit être l'un des suivants: ${VALID_MODES.join(', ')}`,
          details: `Mode reçu: ${body.mode}`,
        } as AiError,
        { status: 400 }
      );
    }

    // Limiter la longueur du texte (éviter les abus)
    const MAX_TEXT_LENGTH = 10000; // 10k caractères
    if (body.text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Le texte est trop long. Maximum ${MAX_TEXT_LENGTH} caractères.`,
          details: `Longueur actuelle: ${body.text.length}`,
        } as AiError,
        { status: 400 }
      );
    }

    console.log(`📝 Requête AI: mode=${body.mode}, longueur=${body.text.length}`);

    // TODO: Vérifier l'abonnement de l'utilisateur
    // const { userId } = auth(); // Clerk
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: 'Authentification requise.' } as AiError,
    //     { status: 401 }
    //   );
    // }
    //
    // const subscription = await getUserSubscription(userId);
    // if (!subscription?.active) {
    //   return NextResponse.json(
    //     { error: 'Abonnement requis pour utiliser les outils IA.' } as AiError,
    //     { status: 403 }
    //   );
    // }

    // TODO: Implémenter le rate limiting
    // const rateLimitOk = await checkRateLimit(userId, subscription.plan);
    // if (!rateLimitOk) {
    //   return NextResponse.json(
    //     { error: 'Limite de requêtes atteinte pour ce mois.' } as AiError,
    //     { status: 429 }
    //   );
    // }

    // ========== ÉTAPE 2 : PROMPT OPTIMIZER ==========
    console.log('🔧 Étape 2: Optimisation du prompt...');
    const optimizedPrompt = await optimizePrompt({
      text: body.text,
      mode: body.mode,
    });

    console.log('✅ Prompt optimisé:', {
      systemLength: optimizedPrompt.system.length,
      userLength: optimizedPrompt.user.length,
      meta: optimizedPrompt.meta,
    });

    // ========== ÉTAPE 3 : AI ROUTER ==========
    console.log('🤖 Étape 3: Routing vers les LLM...');
    const output = await routeToAI(optimizedPrompt);

    console.log('✅ Réponse générée:', output.substring(0, 100) + '...');

    // TODO: Enregistrer l'utilisation pour les statistiques
    // await logUsage(userId, body.mode, body.text.length, output.length);

    // ========== RÉPONSE ==========
    return NextResponse.json({
      output,
    } as AiTextResponse);
  } catch (error: any) {
    console.error('❌ Erreur API /ai-text:', error);

    // Déterminer le type d'erreur et retourner un message approprié
    let errorMessage = 'Une erreur est survenue lors du traitement de votre requête.';
    let statusCode = 500;

    if (error.message?.includes('configuré') || error.message?.includes('API')) {
      errorMessage = 'Le service IA n\'est pas correctement configuré. Contactez l\'administrateur.';
      statusCode = 503;
    } else if (error.message?.includes('tous les modèles')) {
      errorMessage = 'Tous les modèles IA sont actuellement indisponibles. Réessayez plus tard.';
      statusCode = 503;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      } as AiError,
      { status: statusCode }
    );
  }
}

// Méthode GET pour retourner les infos de l'API
export async function GET() {
  return NextResponse.json({
    name: 'AI Text API',
    version: '1.0.0',
    description: 'API unifiée pour les outils texte IA (rewrite, correct, summarize, reply)',
    modes: VALID_MODES,
    status: 'operational',
  });
}
