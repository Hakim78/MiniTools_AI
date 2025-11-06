import { AiMode, OptimizedPrompt } from '@/types/ai';
import { callOpenAIChat, isOpenAIAvailable } from './openai';

/**
 * PROMPT OPTIMIZER
 *
 * Ce module améliore automatiquement les requêtes utilisateur avant de les envoyer
 * aux modèles LLM principaux. Les utilisateurs ne savent pas toujours formuler
 * des prompts parfaits, donc on optimise leur demande pour obtenir de meilleurs résultats.
 *
 * Étape 1 du pipeline AI : Text → Prompt Optimizer → AI Router → Output
 */

/**
 * Optimise un prompt utilisateur en fonction du mode choisi
 * Retourne un prompt enrichi avec contexte, instructions et métadonnées
 */
export async function optimizePrompt({
  text,
  mode,
}: {
  text: string;
  mode: AiMode;
}): Promise<OptimizedPrompt> {
  // Si OpenAI n'est pas disponible, on utilise un fallback basique
  if (!isOpenAIAvailable()) {
    console.warn('⚠️  Prompt Optimizer désactivé : OpenAI non configuré');
    return getFallbackPrompt(text, mode);
  }

  try {
    // On utilise un petit modèle économique pour l'optimisation
    const optimizationPrompt = buildOptimizationPrompt(text, mode);

    const result = await callOpenAIChat(
      [
        {
          role: 'system',
          content: `Tu es un expert en optimisation de prompts pour l'IA. Ton rôle est d'analyser une requête utilisateur et de générer un prompt optimisé pour obtenir les meilleurs résultats possibles.

Analyse le texte fourni et renvoie UN OBJET JSON VALIDE (sans markdown, sans balises) avec cette structure exacte :
{
  "system": "Le rôle et les instructions pour l'IA principale",
  "user": "La version optimisée/clarifiée du texte utilisateur",
  "meta": {
    "tone": "pro|casual|academic",
    "language": "fr|en|etc",
    "context": "email|essay|message|note|etc"
  }
}

IMPORTANT : Renvoie UNIQUEMENT le JSON, sans aucun texte avant ou après, sans \`\`\`json.`,
        },
        {
          role: 'user',
          content: optimizationPrompt,
        },
      ],
      {
        model: 'gpt-4o-mini', // Modèle économique pour l'optimisation
        temperature: 0.3, // Basse température pour des résultats cohérents
        maxTokens: 800,
      }
    );

    // Parser le JSON retourné par l'IA
    const optimized = parseOptimizedPrompt(result);
    return optimized;
  } catch (error) {
    console.error('❌ Erreur dans le Prompt Optimizer:', error);
    // En cas d'erreur, on retourne un prompt fallback
    return getFallbackPrompt(text, mode);
  }
}

/**
 * Construit le prompt d'optimisation en fonction du mode
 */
function buildOptimizationPrompt(text: string, mode: AiMode): string {
  const modeInstructions = {
    rewrite: `Mode: RÉÉCRITURE
L'utilisateur veut réécrire ce texte de manière plus claire, fluide ou avec un ton différent.
Analyse le texte et génère un prompt optimisé pour guider l'IA à produire une excellente réécriture.`,

    correct: `Mode: CORRECTION
L'utilisateur veut corriger la grammaire, l'orthographe, la ponctuation et le style de ce texte.
Analyse le texte et génère un prompt optimisé pour guider l'IA à corriger tous les problèmes.`,

    summarize: `Mode: RÉSUMÉ
L'utilisateur veut un résumé concis et clair de ce texte.
Analyse le texte et génère un prompt optimisé pour guider l'IA à créer un excellent résumé.`,

    reply: `Mode: RÉPONSE
L'utilisateur veut générer une réponse appropriée à ce message/email.
Analyse le texte et génère un prompt optimisé pour guider l'IA à créer une réponse pertinente.`,
  };

  return `${modeInstructions[mode]}

Texte utilisateur :
"""
${text.trim()}
"""

Renvoie le JSON optimisé maintenant.`;
}

/**
 * Parse la réponse JSON de l'optimiseur
 */
function parseOptimizedPrompt(response: string): OptimizedPrompt {
  try {
    // Nettoyer la réponse (enlever les balises markdown si présentes)
    let cleaned = response.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    const parsed = JSON.parse(cleaned);

    // Validation basique
    if (!parsed.system || !parsed.user) {
      throw new Error('Format JSON invalide');
    }

    return {
      system: parsed.system,
      user: parsed.user,
      meta: parsed.meta || {},
    };
  } catch (error) {
    console.error('❌ Erreur parsing JSON:', error);
    throw error;
  }
}

/**
 * Prompt fallback si l'optimisation échoue ou si OpenAI n'est pas disponible
 */
function getFallbackPrompt(text: string, mode: AiMode): OptimizedPrompt {
  const fallbacks: Record<AiMode, { system: string; instructions: string }> = {
    rewrite: {
      system: `Tu es un expert en réécriture de textes. Ton rôle est de réécrire le texte fourni de manière claire, fluide et naturelle, tout en conservant le sens original.`,
      instructions: 'Réécris ce texte de manière plus claire et professionnelle :',
    },
    correct: {
      system: `Tu es un correcteur expert en français. Ton rôle est de corriger toutes les erreurs de grammaire, d'orthographe, de ponctuation et de style, tout en améliorant la clarté du texte.`,
      instructions: 'Corrige toutes les erreurs dans ce texte :',
    },
    summarize: {
      system: `Tu es un expert en résumés. Ton rôle est de créer un résumé concis et clair qui capture les points essentiels du texte original.`,
      instructions: 'Résume ce texte de manière concise :',
    },
    reply: {
      system: `Tu es un assistant expert en rédaction de réponses. Ton rôle est de générer une réponse appropriée, claire et professionnelle au message fourni.`,
      instructions: 'Génère une réponse appropriée à ce message :',
    },
  };

  const { system, instructions } = fallbacks[mode];

  return {
    system,
    user: `${instructions}\n\n${text}`,
    meta: {
      language: 'fr',
      tone: 'professional',
    },
  };
}
