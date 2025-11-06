// Types partagés pour le système AI

export type AiMode = "rewrite" | "correct" | "summarize" | "reply";

export interface OptimizedPrompt {
  system: string;
  user: string;
  meta?: {
    tone?: string;
    language?: string;
    context?: string;
  };
}

export interface HistoryEntry {
  id: string;
  text: string;
  mode: AiMode;
  output: string;
  createdAt: string; // ISO format
}

export type LLMProvider = "openai" | "gemini" | "deepseek" | "grok" | "opensource";

export interface ProviderConfig {
  enabled: boolean;
  apiKeyEnvVar: string;
  name: string;
}

export interface AiTextRequest {
  text: string;
  mode: AiMode;
}

export interface AiTextResponse {
  output: string;
}

export interface AiError {
  error: string;
  details?: string;
}
