// Types partagés pour le système AI

/**
 * AI Modes disponibles
 *
 * Daily text tools (use SECONDARY_MODEL):
 * - rewrite: Réécrire un texte
 * - correct: Corriger grammaire/orthographe
 * - summarize: Résumer un texte
 * - reply: Générer une réponse
 *
 * Premium SEO tools (use PRIMARY_MODEL):
 * - seo_generate: Générer un article SEO complet from scratch
 * - seo_rewrite: Réécrire/optimiser un article existant pour le SEO
 */
export type AiMode =
  | "rewrite"
  | "correct"
  | "summarize"
  | "reply"
  | "seo_generate"
  | "seo_rewrite";

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

/**
 * SEO GENERATION PAYLOAD
 *
 * Used for mode: 'seo_generate'
 * Generates a complete SEO-optimized article from scratch
 */
export interface SeoGeneratePayload {
  domain: string; // Business domain (e.g., "SaaS B2B marketing")
  keyword: string; // Main target keyword
  guideline: string; // User brief/instructions
  siteUrl: string; // Website URL for context
  contentTone?: string; // Tone of existing content
  targetAudience?: string; // Target audience description
  mainTopics?: string; // Main topics covered on site
  seoOpportunities?: string; // SEO opportunities identified
  contentGaps?: string; // Content gaps to fill
  contentStrategy?: string; // Recommended content strategy
  keywordOpportunities?: string; // Secondary keywords to target
  internalLinks?: string; // Internal links to integrate (formatted list)
  externalRefs?: string; // External references for context
}

/**
 * SEO REWRITE PAYLOAD
 *
 * Used for mode: 'seo_rewrite'
 * Optimizes an existing article for SEO
 */
export interface SeoRewritePayload {
  originalTitle: string; // Current article title
  sourceUrl: string; // URL of the article
  wordCount?: number; // Current word count
  originalMetaDesc?: string; // Current meta description
  originalText: string; // Original text (plain text extract)
  originalContentHtml: string; // Original content in HTML
  keyword: string; // Main keyword to optimize for
  internalLinks: string; // Internal links to integrate (formatted list)
  currentDate: string; // Date of rewrite (ISO format)
}

/**
 * Prompt Template structure
 */
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string; // Template with {VARIABLE} placeholders
  variables: string[]; // List of required variables
}
