import OpenAI from 'openai';

/**
 * MODEL CONFIGURATION
 *
 * PRIMARY_MODEL: Flagship model for premium tasks (SEO generation, long content)
 * - Default: gpt-4o (or gpt-4.1 when available)
 * - Use for: SEO generation, SEO rewrite, complex analysis
 *
 * SECONDARY_MODEL: Cheaper model for daily tasks
 * - Default: gpt-4o-mini
 * - Use for: rewrite, correct, summarize, reply, prompt optimization
 *
 * TODO: Add to .env.local:
 * OPENAI_API_KEY=sk-...
 * PRIMARY_MODEL=gpt-4o (or gpt-4.1 or future gpt-5)
 * SECONDARY_MODEL=gpt-4o-mini
 */

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY non trouvée dans les variables d\'environnement');
}

// Model configuration
export const PRIMARY_MODEL = process.env.PRIMARY_MODEL || 'gpt-4o';
export const SECONDARY_MODEL = process.env.SECONDARY_MODEL || 'gpt-4o-mini';

export const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export type ModelTier = 'primary' | 'secondary';

/**
 * Fonction principale pour appeler OpenAI avec un prompt simple
 */
export async function generateCompletion(
  prompt: string,
  systemPrompt: string = "Tu es un assistant IA expert et précis."
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI n\'est pas configuré. Ajoutez OPENAI_API_KEY dans .env.local');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || "Je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    throw new Error('Je n\'ai pas pu communiquer avec OpenAI. Vérifie ta clé API.');
  }
}

/**
 * Fonction avancée pour appeler OpenAI avec des messages personnalisés
 * Utilisée par le prompt optimizer et l'AI router
 */
export async function callOpenAIChat(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI n\'est pas configuré. Ajoutez OPENAI_API_KEY dans .env.local');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: options?.model || SECONDARY_MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens || 2000,
    });

    return completion.choices[0]?.message?.content || "Je n'ai pas pu générer de réponse.";
  } catch (error: any) {
    console.error('Erreur OpenAI:', error);

    // Handle specific OpenAI errors
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      throw new Error('Nous ne pouvons pas contacter le modèle IA pour le moment (quota atteint). Réessaie plus tard ou contacte le support.');
    }

    if (error?.status === 401) {
      throw new Error('Clé API OpenAI invalide. Vérifie ta configuration.');
    }

    if (error?.status === 503) {
      throw new Error('Le service OpenAI est temporairement indisponible. Réessaie dans quelques instants.');
    }

    throw new Error('Impossible de communiquer avec OpenAI. Réessaie plus tard.');
  }
}

/**
 * NEW: Cost-aware model selection helper
 *
 * Automatically chooses the right model based on task tier:
 * - 'primary': Use PRIMARY_MODEL (flagship, expensive, best quality)
 * - 'secondary': Use SECONDARY_MODEL (cheaper, fast, good quality)
 *
 * Usage:
 * - Daily tools (rewrite, correct, summarize, reply) → 'secondary'
 * - Premium tools (SEO generation, long content) → 'primary'
 */
export async function callOpenAIChatWithRole(params: {
  messages: OpenAI.ChatCompletionMessageParam[];
  modelTier: ModelTier;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI n\'est pas configuré. Ajoutez OPENAI_API_KEY dans .env.local');
  }

  const { messages, modelTier, temperature = 0.7, maxTokens = 4000 } = params;

  // Select model based on tier
  const model = modelTier === 'primary' ? PRIMARY_MODEL : SECONDARY_MODEL;

  console.log(`🤖 Using ${modelTier} model: ${model}`);

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Le modèle n\'a pas retourné de réponse.');
    }

    return content;
  } catch (error: any) {
    console.error(`❌ Erreur ${model}:`, error);

    // Handle specific OpenAI errors with user-friendly messages
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      throw new Error('Nous ne pouvons pas contacter le modèle IA pour le moment (quota atteint). Réessaie plus tard ou contacte le support.');
    }

    if (error?.status === 401) {
      throw new Error('Clé API OpenAI invalide. Vérifie ta configuration.');
    }

    if (error?.status === 503) {
      throw new Error('Le service OpenAI est temporairement indisponible. Réessaie dans quelques instants.');
    }

    if (error?.status === 400) {
      throw new Error('Requête invalide. Le texte est peut-être trop long ou contient des caractères non supportés.');
    }

    // Generic error
    throw new Error(`Impossible de communiquer avec ${model}. Réessaie plus tard.`);
  }
}

/**
 * Vérifie si OpenAI est disponible et configuré
 */
export function isOpenAIAvailable(): boolean {
  return openai !== null;
}
