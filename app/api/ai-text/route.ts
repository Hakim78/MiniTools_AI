import { NextRequest, NextResponse } from 'next/server';
import {
  AiTextRequest,
  AiTextResponse,
  AiError,
  AiMode,
  SeoGeneratePayload,
  SeoRewritePayload,
} from '@/types/ai';
import { optimizePrompt } from '@/lib/promptOptimizer';
import { routeToAI } from '@/lib/aiRouter';
import { buildSeoGeneratePrompt, buildSeoRewritePrompt } from '@/lib/prompts';

/**
 * API ENDPOINT : /api/ai-text
 *
 * Orchestrateur principal pour TOUS les outils texte IA :
 *
 * Daily tools (SECONDARY_MODEL):
 * - Réécriture (rewrite)
 * - Correction (correct)
 * - Résumé (summarize)
 * - Réponse (reply)
 *
 * Premium SEO tools (PRIMARY_MODEL):
 * - Génération SEO (seo_generate)
 * - Réécriture SEO (seo_rewrite)
 *
 * Pipeline pour daily tools :
 * 1. Validation → 2. Prompt Optimizer → 3. AI Router (SECONDARY)
 *
 * Pipeline pour SEO tools :
 * 1. Validation → 2. SEO Prompt Builder → 3. AI Router (PRIMARY)
 *
 * TODO: Ajouter la vérification d'abonnement (Clerk + Stripe)
 * TODO: Implémenter les limites de requêtes (rate limiting)
 */

const VALID_MODES: AiMode[] = [
  'rewrite',
  'correct',
  'summarize',
  'reply',
  'seo_generate',
  'seo_rewrite',
];

export async function POST(request: NextRequest) {
  try {
    // ========== ÉTAPE 1 : VALIDATION ==========
    const body: any = await request.json();

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

    const mode: AiMode = body.mode;

    console.log(`📝 Requête AI: mode=${mode}`);

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

    let output: string;

    // ========== ROUTE 1 : DAILY TOOLS (rewrite, correct, summarize, reply) ==========
    if (['rewrite', 'correct', 'summarize', 'reply'].includes(mode)) {
      // Validate text field for daily tools
      if (!body.text || typeof body.text !== 'string' || body.text.trim().length === 0) {
        return NextResponse.json(
          {
            error: 'Le champ "text" est requis et ne peut pas être vide.',
          } as AiError,
          { status: 400 }
        );
      }

      // Limiter la longueur du texte
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

      console.log(`📏 Longueur texte: ${body.text.length} caractères`);

      // Étape 2 : Prompt Optimizer
      console.log('🔧 Étape 2: Optimisation du prompt...');
      const optimizedPrompt = await optimizePrompt({
        text: body.text,
        mode,
      });

      console.log('✅ Prompt optimisé');

      // Étape 3 : AI Router (SECONDARY_MODEL)
      console.log('🤖 Étape 3: Routing vers LLM (SECONDARY)...');
      output = await routeToAI(optimizedPrompt, { mode });

      console.log('✅ Réponse générée:', output.substring(0, 100) + '...');
    }
    // ========== ROUTE 2 : SEO GENERATE ==========
    else if (mode === 'seo_generate') {
      const seoPayload = body.payload as SeoGeneratePayload;

      // Validate required fields
      if (!seoPayload?.domain || !seoPayload?.keyword || !seoPayload?.guideline || !seoPayload?.siteUrl) {
        return NextResponse.json(
          {
            error: 'Champs requis manquants pour seo_generate: domain, keyword, guideline, siteUrl',
          } as AiError,
          { status: 400 }
        );
      }

      console.log('🎯 SEO Generate:', {
        domain: seoPayload.domain,
        keyword: seoPayload.keyword,
      });

      // Build SEO prompt directly (no optimizer needed)
      const seoPrompt = buildSeoGeneratePrompt(seoPayload);

      console.log('✅ SEO prompt construit');

      // Route to AI with PRIMARY_MODEL
      console.log('🤖 Routing vers LLM (PRIMARY)...');
      output = await routeToAI(
        {
          system:
            'Tu es un assistant de rédaction SEO expert. Respecte strictement le format XML demandé dans les instructions. Produis un contenu complet, expert et optimisé.',
          user: seoPrompt,
        },
        { mode }
      );

      console.log('✅ Article SEO généré:', output.substring(0, 150) + '...');
    }
    // ========== ROUTE 3 : SEO REWRITE ==========
    else if (mode === 'seo_rewrite') {
      const seoPayload = body.payload as SeoRewritePayload;

      // Validate required fields
      if (
        !seoPayload?.originalTitle ||
        !seoPayload?.sourceUrl ||
        !seoPayload?.originalText ||
        !seoPayload?.originalContentHtml ||
        !seoPayload?.keyword ||
        !seoPayload?.internalLinks ||
        !seoPayload?.currentDate
      ) {
        return NextResponse.json(
          {
            error:
              'Champs requis manquants pour seo_rewrite: originalTitle, sourceUrl, originalText, originalContentHtml, keyword, internalLinks, currentDate',
          } as AiError,
          { status: 400 }
        );
      }

      console.log('🔄 SEO Rewrite:', {
        title: seoPayload.originalTitle,
        keyword: seoPayload.keyword,
      });

      // Build SEO rewrite prompt
      const seoPrompt = buildSeoRewritePrompt(seoPayload);

      console.log('✅ SEO rewrite prompt construit');

      // Route to AI with PRIMARY_MODEL
      console.log('🤖 Routing vers LLM (PRIMARY)...');
      output = await routeToAI(
        {
          system:
            'Tu es un expert en réécriture SEO. Respecte strictement le format XML demandé. Produis une version optimisée, complète et actualisée de l\'article.',
          user: seoPrompt,
        },
        { mode }
      );

      console.log('✅ Article réécrit:', output.substring(0, 150) + '...');
    } else {
      return NextResponse.json(
        {
          error: 'Mode non supporté',
        } as AiError,
        { status: 400 }
      );
    }

    // TODO: Enregistrer l'utilisation pour les statistiques
    // await logUsage(userId, mode, inputLength, output.length);

    // ========== RÉPONSE ==========
    return NextResponse.json({
      output,
    } as AiTextResponse);
  } catch (error: any) {
    console.error('❌ Erreur API /ai-text:', error);

    // Handle specific errors with user-friendly messages
    let errorMessage = 'Une erreur est survenue lors du traitement de votre requête.';
    let statusCode = 500;

    if (error.message?.includes('quota')) {
      errorMessage = error.message;
      statusCode = 429;
    } else if (error.message?.includes('configuré') || error.message?.includes('clé API')) {
      errorMessage = 'Le service IA n\'est pas correctement configuré. Contactez l\'administrateur.';
      statusCode = 503;
    } else if (error.message?.includes('tous les modèles') || error.message?.includes('indisponible')) {
      errorMessage = 'Le service IA est temporairement indisponible. Réessayez plus tard.';
      statusCode = 503;
    } else if (error.message?.includes('invalide') || error.message?.includes('trop long')) {
      errorMessage = error.message;
      statusCode = 400;
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
