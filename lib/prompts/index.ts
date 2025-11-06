/**
 * PROMPT TEMPLATES LIBRARY
 *
 * Centralized location for all AI prompt templates
 * Supports variable substitution using {VARIABLE_NAME} syntax
 */

import { SeoGeneratePayload, SeoRewritePayload } from '@/types/ai';
import { SEO_GENERATE_TEMPLATE, SEO_REWRITE_TEMPLATE } from './seo';

/**
 * Fill a template string with variables
 *
 * @param template - Template string with {VARIABLE} placeholders
 * @param vars - Object with variable values
 * @returns Filled template string
 *
 * Example:
 * fillTemplate("Hello {NAME}", { NAME: "World" }) → "Hello World"
 */
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((acc, [key, value]) => {
    const token = `{${key}}`;
    return acc.split(token).join(value ?? '');
  }, template);
}

/**
 * Build SEO Generation prompt from payload
 *
 * Uses the SEO_GENERATE_TEMPLATE with all user-provided data
 */
export function buildSeoGeneratePrompt(payload: SeoGeneratePayload): string {
  const vars: Record<string, string> = {
    DOMAIN: payload.domain,
    KEYWORD: payload.keyword,
    GUIDELINE: payload.guideline,
    SITE_URL: payload.siteUrl,
    CONTENT_TONE: payload.contentTone || 'Non spécifié',
    TARGET_AUDIENCE: payload.targetAudience || 'Non spécifié',
    MAIN_TOPICS: payload.mainTopics || 'Non spécifié',
    SEO_OPPORTUNITIES: payload.seoOpportunities || 'Aucune opportunité spécifiée',
    CONTENT_GAPS: payload.contentGaps || 'Aucune lacune identifiée',
    CONTENT_STRATEGY: payload.contentStrategy || 'Aucune stratégie spécifiée',
    KEYWORD_OPPORTUNITIES: payload.keywordOpportunities || 'Aucun mot-clé secondaire suggéré',
    INTERNAL_LINKS: payload.internalLinks || 'Aucun lien interne fourni',
    EXTERNAL_REFS: payload.externalRefs || 'Aucune référence externe fournie',
  };

  return fillTemplate(SEO_GENERATE_TEMPLATE, vars);
}

/**
 * Build SEO Rewrite prompt from payload
 *
 * Uses the SEO_REWRITE_TEMPLATE with all article data
 */
export function buildSeoRewritePrompt(payload: SeoRewritePayload): string {
  const vars: Record<string, string> = {
    ORIGINAL_TITLE: payload.originalTitle,
    SOURCE_URL: payload.sourceUrl,
    WORD_COUNT: payload.wordCount?.toString() || 'Non spécifié',
    ORIGINAL_META_DESC: payload.originalMetaDesc || 'Non spécifiée',
    ORIGINAL_TEXT: payload.originalText,
    ORIGINAL_CONTENT: payload.originalContentHtml,
    KEYWORD: payload.keyword,
    INTERNAL_LINKS: payload.internalLinks,
    CURRENT_DATE: payload.currentDate,
  };

  return fillTemplate(SEO_REWRITE_TEMPLATE, vars);
}
