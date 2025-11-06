import { LLMProvider, ProviderConfig, OptimizedPrompt } from '@/types/ai';
import { callOpenAIChat, isOpenAIAvailable } from './openai';

/**
 * AI ROUTER - Multi-LLM Orchestrator
 *
 * Ce module orchestre l'utilisation de plusieurs modèles LLM (OpenAI, Gemini, DeepSeek, Grok, etc.)
 * pour améliorer la qualité des réponses.
 *
 * Stratégie "Comité IA" :
 * - Si plusieurs providers sont disponibles → envoyer à 2-3 d'entre eux en parallèle
 * - Récupérer leurs réponses
 * - Utiliser un LLM "synthétiseur" pour fusionner les meilleures parties
 *
 * TODO: Compléter les implémentations des providers non-OpenAI
 * TODO: Ajouter les clés API dans .env.local :
 * - OPENAI_API_KEY=sk-...
 * - GEMINI_API_KEY=...
 * - DEEPSEEK_API_KEY=...
 * - GROK_API_KEY=...
 * - HUGGINGFACE_API_KEY=...
 */

/**
 * Configuration des providers disponibles
 */
const PROVIDERS: Record<LLMProvider, ProviderConfig> = {
  openai: {
    enabled: true,
    apiKeyEnvVar: 'OPENAI_API_KEY',
    name: 'OpenAI GPT-4o-mini',
  },
  gemini: {
    enabled: true,
    apiKeyEnvVar: 'GEMINI_API_KEY',
    name: 'Google Gemini',
  },
  deepseek: {
    enabled: true,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY',
    name: 'DeepSeek',
  },
  grok: {
    enabled: true,
    apiKeyEnvVar: 'GROK_API_KEY',
    name: 'Grok (X.AI)',
  },
  opensource: {
    enabled: true,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY',
    name: 'Hugging Face (Open-Source Models)',
  },
};

/**
 * Fonction principale : Route le prompt optimisé vers les LLM disponibles
 * et retourne la meilleure réponse (simple ou fusionnée)
 */
export async function routeToAI(optimizedPrompt: OptimizedPrompt): Promise<string> {
  // 1. Récupérer les providers disponibles
  const availableProviders = getAvailableProviders();

  if (availableProviders.length === 0) {
    throw new Error('Aucun modèle IA n\'est configuré côté serveur. Veuillez configurer au moins une clé API (OpenAI, Gemini, etc.).');
  }

  console.log(`✅ ${availableProviders.length} provider(s) disponible(s):`, availableProviders);

  // 2. Si un seul provider → l'utiliser directement
  if (availableProviders.length === 1) {
    return await callProvider(availableProviders[0], optimizedPrompt);
  }

  // 3. Si plusieurs providers → stratégie "comité IA"
  return await executeCommitteeStrategy(availableProviders, optimizedPrompt);
}

/**
 * Stratégie "Comité IA" : appeler plusieurs LLM en parallèle et fusionner les réponses
 */
async function executeCommitteeStrategy(
  providers: LLMProvider[],
  optimizedPrompt: OptimizedPrompt
): Promise<string> {
  try {
    // On prend max 3 providers pour ne pas exploser les coûts
    const selectedProviders = providers.slice(0, 3);

    console.log(`🤝 Stratégie Comité IA avec ${selectedProviders.length} modèles`);

    // Appeler tous les providers en parallèle
    const responses = await Promise.allSettled(
      selectedProviders.map((provider) => callProvider(provider, optimizedPrompt))
    );

    // Extraire les réponses réussies
    const successfulResponses = responses
      .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
      .map((r) => r.value);

    if (successfulResponses.length === 0) {
      throw new Error('Tous les modèles IA ont échoué.');
    }

    // Si une seule réponse a réussi, la retourner directement
    if (successfulResponses.length === 1) {
      return successfulResponses[0];
    }

    // Sinon, fusionner les réponses avec un synthétiseur
    return await synthesizeResponses(successfulResponses, optimizedPrompt);
  } catch (error) {
    console.error('❌ Erreur dans la stratégie Comité IA:', error);
    throw error;
  }
}

/**
 * Synthétise plusieurs réponses en une seule réponse optimale
 * Utilise OpenAI comme synthétiseur (si disponible)
 */
async function synthesizeResponses(
  responses: string[],
  originalPrompt: OptimizedPrompt
): Promise<string> {
  if (!isOpenAIAvailable()) {
    // Fallback : retourner la première réponse si pas de synthétiseur
    console.warn('⚠️  Pas de synthétiseur disponible, retour de la première réponse');
    return responses[0];
  }

  try {
    console.log('🔄 Synthèse de', responses.length, 'réponses...');

    const synthesisPrompt = `Tu es un expert en synthèse de réponses IA. On t'a fourni ${responses.length} réponses différentes à la même requête.

Ton rôle : Lire toutes ces réponses et créer LA MEILLEURE VERSION UNIFIÉE possible.
- Garde les meilleures parties de chaque réponse
- Élimine les redondances
- Assure la cohérence et la fluidité
- Produis une réponse finale optimale

Contexte de la requête originale : ${originalPrompt.system}

Réponses à synthétiser :

${responses.map((r, i) => `--- Réponse ${i + 1} ---\n${r}\n`).join('\n')}

Renvoie UNIQUEMENT la version finale synthétisée, sans introduction ni explication.`;

    const synthesized = await callOpenAIChat([
      {
        role: 'system',
        content: 'Tu es un expert en synthèse de réponses IA. Tu produis des réponses unifiées et optimales.',
      },
      {
        role: 'user',
        content: synthesisPrompt,
      },
    ]);

    return synthesized;
  } catch (error) {
    console.error('❌ Erreur lors de la synthèse:', error);
    // Fallback : retourner la première réponse
    return responses[0];
  }
}

/**
 * Appelle un provider spécifique avec le prompt optimisé
 */
async function callProvider(provider: LLMProvider, optimizedPrompt: OptimizedPrompt): Promise<string> {
  console.log(`📡 Appel du provider: ${PROVIDERS[provider].name}`);

  switch (provider) {
    case 'openai':
      return await callOpenAI(optimizedPrompt);

    case 'gemini':
      return await callGemini(optimizedPrompt);

    case 'deepseek':
      return await callDeepSeek(optimizedPrompt);

    case 'grok':
      return await callGrok(optimizedPrompt);

    case 'opensource':
      return await callOpenSource(optimizedPrompt);

    default:
      throw new Error(`Provider non supporté: ${provider}`);
  }
}

/**
 * Retourne la liste des providers disponibles (avec clé API configurée)
 */
function getAvailableProviders(): LLMProvider[] {
  const available: LLMProvider[] = [];

  for (const [provider, config] of Object.entries(PROVIDERS)) {
    if (config.enabled && process.env[config.apiKeyEnvVar]) {
      available.push(provider as LLMProvider);
    }
  }

  return available;
}

// ============================================================================
// IMPLÉMENTATIONS DES PROVIDERS
// ============================================================================

/**
 * OpenAI GPT - IMPLÉMENTATION COMPLÈTE
 */
async function callOpenAI(optimizedPrompt: OptimizedPrompt): Promise<string> {
  return await callOpenAIChat([
    {
      role: 'system',
      content: optimizedPrompt.system,
    },
    {
      role: 'user',
      content: optimizedPrompt.user,
    },
  ]);
}

/**
 * Google Gemini - TODO: IMPLÉMENTATION À COMPLÉTER
 *
 * Documentation : https://ai.google.dev/docs
 * Installation : npm install @google/generative-ai
 *
 * Exemple de code :
 * ```
 * import { GoogleGenerativeAI } from "@google/generative-ai";
 * const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 * const model = genAI.getGenerativeModel({ model: "gemini-pro" });
 * const result = await model.generateContent(prompt);
 * ```
 */
async function callGemini(optimizedPrompt: OptimizedPrompt): Promise<string> {
  // TODO: Implémenter l'appel à Gemini
  console.warn('⚠️  Gemini non implémenté, utilisation d\'un fallback');

  throw new Error('Gemini non implémenté');

  // Structure attendue une fois implémenté :
  /*
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const fullPrompt = `${optimizedPrompt.system}\n\n${optimizedPrompt.user}`;
  const result = await model.generateContent(fullPrompt);
  return result.response.text();
  */
}

/**
 * DeepSeek - TODO: IMPLÉMENTATION À COMPLÉTER
 *
 * Documentation : https://platform.deepseek.com/docs
 * API compatible OpenAI, peut utiliser le client OpenAI avec une base URL différente
 *
 * Exemple :
 * ```
 * const deepseek = new OpenAI({
 *   apiKey: process.env.DEEPSEEK_API_KEY,
 *   baseURL: 'https://api.deepseek.com/v1'
 * });
 * ```
 */
async function callDeepSeek(optimizedPrompt: OptimizedPrompt): Promise<string> {
  // TODO: Implémenter l'appel à DeepSeek
  console.warn('⚠️  DeepSeek non implémenté, utilisation d\'un fallback');

  throw new Error('DeepSeek non implémenté');

  // Structure attendue une fois implémenté :
  /*
  const OpenAI = require('openai');
  const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });

  const completion = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: optimizedPrompt.system },
      { role: 'user', content: optimizedPrompt.user },
    ],
  });

  return completion.choices[0].message.content || '';
  */
}

/**
 * Grok (X.AI) - TODO: IMPLÉMENTATION À COMPLÉTER
 *
 * Documentation : https://docs.x.ai/
 * API compatible OpenAI
 *
 * Exemple :
 * ```
 * const grok = new OpenAI({
 *   apiKey: process.env.GROK_API_KEY,
 *   baseURL: 'https://api.x.ai/v1'
 * });
 * ```
 */
async function callGrok(optimizedPrompt: OptimizedPrompt): Promise<string> {
  // TODO: Implémenter l'appel à Grok
  console.warn('⚠️  Grok non implémenté, utilisation d\'un fallback');

  throw new Error('Grok non implémenté');

  // Structure attendue une fois implémenté :
  /*
  const OpenAI = require('openai');
  const grok = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  });

  const completion = await grok.chat.completions.create({
    model: 'grok-beta',
    messages: [
      { role: 'system', content: optimizedPrompt.system },
      { role: 'user', content: optimizedPrompt.user },
    ],
  });

  return completion.choices[0].message.content || '';
  */
}

/**
 * Open-Source Models via Hugging Face Inference API - TODO: IMPLÉMENTATION À COMPLÉTER
 *
 * Documentation : https://huggingface.co/docs/api-inference/
 * Installation : npm install @huggingface/inference
 *
 * Exemples de modèles :
 * - meta-llama/Llama-2-70b-chat-hf
 * - mistralai/Mixtral-8x7B-Instruct-v0.1
 * - HuggingFaceH4/zephyr-7b-beta
 *
 * Exemple de code :
 * ```
 * import { HfInference } from '@huggingface/inference';
 * const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
 * const result = await hf.textGeneration({
 *   model: 'meta-llama/Llama-2-70b-chat-hf',
 *   inputs: prompt,
 * });
 * ```
 */
async function callOpenSource(optimizedPrompt: OptimizedPrompt): Promise<string> {
  // TODO: Implémenter l'appel à Hugging Face
  console.warn('⚠️  Open-Source models non implémentés, utilisation d\'un fallback');

  throw new Error('Open-Source models non implémentés');

  // Structure attendue une fois implémenté :
  /*
  const { HfInference } = require('@huggingface/inference');
  const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

  const fullPrompt = `${optimizedPrompt.system}\n\nUser: ${optimizedPrompt.user}\n\nAssistant:`;

  const result = await hf.textGeneration({
    model: 'meta-llama/Llama-2-70b-chat-hf',
    inputs: fullPrompt,
    parameters: {
      max_new_tokens: 1000,
      temperature: 0.7,
    },
  });

  return result.generated_text;
  */
}
