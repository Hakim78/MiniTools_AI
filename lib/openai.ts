import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Je ne trouve pas OPENAI_API_KEY dans les variables environnement');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCompletion(
  prompt: string,
  systemPrompt: string = "Tu es un assistant IA expert et précis."
): Promise<string> {
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
