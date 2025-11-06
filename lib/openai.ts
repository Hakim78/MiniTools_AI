import OpenAI from 'openai';

// TODO: Ajouter votre clé API OpenAI dans .env.local
// OPENAI_API_KEY=sk-...
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY non trouvée dans les variables d\'environnement');
}

export const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

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
      model: options?.model || 'gpt-4o-mini',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens || 2000,
    });

    return completion.choices[0]?.message?.content || "Je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    throw new Error('Impossible de communiquer avec OpenAI.');
  }
}

/**
 * Vérifie si OpenAI est disponible et configuré
 */
export function isOpenAIAvailable(): boolean {
  return openai !== null;
}
