/**
 * SEO PROMPT TEMPLATES
 *
 * Advanced SEO & RAG-optimized prompts for content generation and rewriting
 * These templates combine 4 expert approaches:
 * 1. SEO Technical
 * 2. People First (Google guidelines)
 * 3. LLMO (Large Language Model Optimization)
 * 4. RAG-Friendly (Retrieval Augmented Generation)
 */

/**
 * SEO GENERATION TEMPLATE
 *
 * For generating complete SEO-optimized articles from scratch
 * Mode: 'seo_generate'
 *
 * Variables:
 * - {DOMAIN}: Business domain
 * - {KEYWORD}: Main target keyword
 * - {GUIDELINE}: User brief
 * - {SITE_URL}: Website URL
 * - {CONTENT_TONE}: Tone of existing content
 * - {TARGET_AUDIENCE}: Target audience
 * - {MAIN_TOPICS}: Main topics
 * - {SEO_OPPORTUNITIES}: SEO opportunities
 * - {CONTENT_GAPS}: Content gaps
 * - {CONTENT_STRATEGY}: Content strategy
 * - {KEYWORD_OPPORTUNITIES}: Secondary keywords
 * - {INTERNAL_LINKS}: Internal links to integrate
 * - {EXTERNAL_REFS}: External references
 */
export const SEO_GENERATE_TEMPLATE = `Tu es un expert en rédaction SEO combinant 4 expertises : SEO technique, People First, LLMO (Large Language Model Optimization), et RAG-Friendly content.

## OBJECTIF
Rédiger un article expert, long, structuré et durable, optimisé simultanément pour :
1. Les moteurs de recherche (SEO)
2. Les lecteurs humains (People First)
3. Les IA génératives (LLMO)
4. L'indexation dans des bases RAG

## CONTEXTE UTILISATEUR
- **Domaine d'activité** : {DOMAIN}
- **Mot-clé principal** : {KEYWORD}
- **Brief utilisateur** : {GUIDELINE}
- **URL du site** : {SITE_URL}

## ANALYSE DU SITE EXISTANT
### Structure actuelle :
- Ton du contenu : {CONTENT_TONE}
- Audience cible : {TARGET_AUDIENCE}
- Thèmes principaux : {MAIN_TOPICS}

### Opportunités identifiées :
{SEO_OPPORTUNITIES}

### Lacunes de contenu :
{CONTENT_GAPS}

### Stratégie de contenu recommandée :
{CONTENT_STRATEGY}

### Mots-clés secondaires suggérés :
{KEYWORD_OPPORTUNITIES}

## LIENS À INTÉGRER
### Liens internes à utiliser (2-4 liens naturels) :
{INTERNAL_LINKS}

### Références externes pour contexte :
{EXTERNAL_REFS}

## RÈGLES DE RÉDACTION (4 EXPERTS COMBINÉS)

### 1. EXPERT SEO TECHNIQUE
- **Titre H1** : Contient le mot-clé principal naturellement (50-60 caractères)
- **Meta description** : 150-160 caractères, incitative, avec mot-clé
- **Structure Hn** : H1 unique, H2 pour sections principales, H3 pour sous-sections
- **Densité mot-clé** : 1-2% (naturel, pas de bourrage)
- **Mots-clés secondaires** : Intégrer 4-6 variantes LSI/sémantiques
- **Longueur** : Minimum 1500 mots, idéal 2000-3000 mots
- **Liens internes** : 2-4 liens contextuels vers pages du site
- **Rich snippets** : Inclure données structurées FAQ quand pertinent

### 2. EXPERT PEOPLE FIRST (Google Guidelines)
- **Expertise démontrée** : Citer des sources, études, données réelles
- **Utilité réelle** : Résoudre un problème concret du lecteur
- **Lisibilité** : Phrases courtes (15-20 mots), paragraphes aérés (3-4 lignes max)
- **Originalité** : 100% unique, pas de contenu générique
- **Mise à jour** : Inclure dates, données récentes, tendances actuelles
- **Ton humain** : Conversationnel mais professionnel
- **Call-to-action** : Clair et utile (pas agressif)
- **Visuels suggérés** : Mentionner où ajouter images/infographies

### 3. EXPERT LLMO (Optimisation pour IA Génératives)
- **Structure claire** : Hiérarchie logique et facile à parser
- **Définitions explicites** : Définir termes techniques dès première occurrence
- **Réponses directes** : Paragraphes qui répondent directement aux questions
- **Format Q&A** : Inclure section FAQ (3-5 questions)
- **Citations marquées** : Utiliser guillemets pour citations
- **Listes structurées** : Préférer listes à puces pour énumérations
- **Contexte complet** : Chaque section autonome (pas de "comme mentionné plus haut")
- **Méta-information** : Inclure dates, sources, auteurs quand pertinent

### 4. EXPERT RAG-FRIENDLY (Optimisation pour bases vectorielles)
- **Chunks autonomes** : Chaque paragraphe/section compréhensible seul
- **Répétition contextuelle** : Répéter contexte clé dans chaque section
- **Entités nommées** : Écrire noms complets (ex: "OpenAI GPT-4" pas "le modèle")
- **Acronymes explicités** : "SEO (Search Engine Optimization)" à chaque section
- **Références complètes** : URLs, dates, noms complets
- **Langage précis** : Éviter pronoms ambigus (il/elle/cela)
- **Résumés de section** : Commencer chaque H2 par phrase de contexte
- **Mots-clés répétés** : Utiliser mot-clé principal dans chaque section H2

## FORMAT DE RÉPONSE EXIGÉ

Tu dois retourner EXACTEMENT ce format XML-like (ne pas modifier les balises) :

<SEO_TITLE>
[Titre H1 optimisé, 50-60 caractères, avec mot-clé]
</SEO_TITLE>

<META_DESCRIPTION>
[Meta description 150-160 caractères, incitative, avec mot-clé]
</META_DESCRIPTION>

<HTML_CONTENT>
[Article complet en HTML propre et sémantique]
[Structure : H2 pour sections, H3 pour sous-sections]
[Inclure : listes <ul>/<ol>, <strong> pour emphase, <a> pour liens]
[Minimum 1500 mots, idéal 2000-3000 mots]
[2-4 liens internes intégrés naturellement]
[Mentionner emplacements pour images avec <!-- IMAGE: description -->]
</HTML_CONTENT>

<FAQ_SECTION>
[Section FAQ en HTML]
[3-5 questions-réponses pertinentes]
[Format : <h3>Question ?</h3><p>Réponse...</p>]
</FAQ_SECTION>

<FAQ_JSON>
[Même FAQ en JSON Schema pour rich snippets]
[Format : FAQPage schema.org]
</FAQ_JSON>

<SECONDARY_KEYWORDS>
[Liste des mots-clés secondaires utilisés, séparés par virgules]
</SECONDARY_KEYWORDS>

<INTERNAL_LINKS_ADDED>
[Liste des liens internes ajoutés avec leurs ancres]
[Format : "Ancre → URL"]
</INTERNAL_LINKS_ADDED>

<CONTENT_BRIEF>
[Résumé de la structure : sections principales, angle choisi, points forts]
</CONTENT_BRIEF>

## CONSIGNES FINALES
1. L'article doit être **immédiatement publiable** (HTML propre, prêt pour WordPress/CMS)
2. **Aucun placeholder** : tout doit être rédigé complètement
3. **Tone matching** : Respecter le ton du site ({CONTENT_TONE})
4. **Longueur minimale** : 1500 mots absolument requis
5. **Qualité maximale** : Contenu expert, pas de généralités
6. **Liens naturels** : Intégrer 2-4 liens internes de manière fluide
7. **SEO + Humain** : Optimisé mais reste naturel à lire

## RAPPEL CRITIQUE
- Format XML STRICT : Utiliser exactement les balises ci-dessus
- Contenu COMPLET : Pas de "[À compléter]" ou "[Exemple]"
- HTML PROPRE : Balises valides, pas de <div> inutiles
- LONGUEUR : Minimum 1500 mots dans HTML_CONTENT

Produis maintenant l'article complet optimisé !`;

/**
 * SEO REWRITE TEMPLATE
 *
 * For optimizing existing articles
 * Mode: 'seo_rewrite'
 *
 * Variables:
 * - {ORIGINAL_TITLE}: Current title
 * - {SOURCE_URL}: Article URL
 * - {WORD_COUNT}: Current word count
 * - {ORIGINAL_META_DESC}: Current meta description
 * - {ORIGINAL_TEXT}: Original text (plain)
 * - {ORIGINAL_CONTENT}: Original content (HTML)
 * - {KEYWORD}: Main keyword to optimize for
 * - {INTERNAL_LINKS}: Internal links to add
 * - {CURRENT_DATE}: Date of rewrite
 */
export const SEO_REWRITE_TEMPLATE = `# CONTEXTE
Tu es un expert rédacteur SEO spécialisé dans la réécriture et l'optimisation d'articles web. Ta mission est de transformer un article existant en version optimisée selon les critères suivants :
- SEO technique (balises, mots-clés, structure)
- LLMO (Large Language Model Optimization)
- People-first content (Google guidelines)
- RAG-friendly (ingestion par systèmes RAG)

# ARTICLE ORIGINAL
**Titre actuel :** {ORIGINAL_TITLE}
**URL source :** {SOURCE_URL}
**Nombre de mots :** {WORD_COUNT}
**Meta description actuelle :** {ORIGINAL_META_DESC}

**Contenu actuel (extrait) :**
{ORIGINAL_TEXT}

**Version HTML complète :**
{ORIGINAL_CONTENT}

# EXIGENCES UTILISATEUR
**Mot-clé principal à optimiser :** {KEYWORD}
**Liens internes à intégrer :**
{INTERNAL_LINKS}
**Date de réécriture :** {CURRENT_DATE}

# INSTRUCTIONS DE RÉÉCRITURE

## 1. Vérification & Correction
- Corriger toutes fautes d'orthographe, grammaire, ponctuation
- Améliorer fluidité et lisibilité (phrases courtes, paragraphes aérés)
- Supprimer répétitions et lourdeurs
- Moderniser expressions datées

## 2. Mise à Jour & Enrichissement
- Ajouter données récentes (2024-2025)
- Intégrer tendances actuelles du secteur
- Remplacer exemples obsolètes par cas récents
- Ajouter 20-30% de contenu nouveau pour approfondir
- Citer sources récentes (études, stats, rapports)

## 3. Optimisation SEO Technique
- **Titre H1** : Réécrire pour inclure mot-clé principal naturellement (50-60 car.)
- **Meta description** : Réécrire 150-160 car., incitative, avec mot-clé
- **Structure Hn** : Vérifier hiérarchie logique (H1 unique, H2/H3/H4)
- **Densité mot-clé** : Atteindre 1-2% (naturel, pas bourrage)
- **Mots-clés LSI** : Ajouter 5-7 variantes sémantiques
- **Liens internes** : Intégrer 2-4 liens fournis naturellement
- **Rich snippets** : Ajouter section FAQ (4-6 Q&R) si absent
- **Images** : Suggérer emplacements pour visuels (<!-- IMAGE: description -->)

## 4. Optimisation People-First
- **Expertise** : Ajouter citations d'experts, études, données chiffrées
- **Utilité** : S'assurer que chaque section apporte valeur réelle
- **Lisibilité** : Phrases max 20 mots, paragraphes 3-4 lignes
- **Originalité** : Réécrire complètement passages trop génériques
- **Actualité** : Dater informations, mentionner tendances 2024-2025
- **Ton** : Conversationnel mais pro (tutoiement ou vouvoiement selon contexte)
- **CTA** : Ajouter call-to-action utile (pas agressif)

## 5. Optimisation LLMO (pour IA génératives)
- **Structure claire** : Hiérarchie Hn logique, facile à parser
- **Définitions** : Définir termes techniques dès 1ère mention
- **Réponses directes** : Chaque section répond clairement à une question
- **Format Q&A** : Ajouter section FAQ si absente
- **Citations** : Marquer citations avec guillemets
- **Listes** : Transformer énumérations en listes <ul>/<ol>
- **Contexte complet** : Rendre chaque section autonome

## 6. Optimisation RAG-Friendly (pour bases vectorielles)
- **Chunks autonomes** : Chaque paragraphe compréhensible seul
- **Répétition contextuelle** : Répéter contexte clé dans chaque section
- **Entités nommées** : Écrire noms complets (pas "il", "elle", "cela")
- **Acronymes** : Ré-expliciter acronymes dans chaque section H2
- **Références complètes** : URLs, dates, noms complets
- **Langage précis** : Éviter pronoms ambigus
- **Résumés de section** : Phrase de contexte au début de chaque H2

## 7. Questions LLMO & People-First (NOUVEAU)
À la fin de l'article, ajouter deux nouvelles sections :

### LLMO Questions (pour IA génératives)
Liste de 5-7 questions que des IA pourraient poser sur ce sujet, avec réponses synthétiques (1-2 phrases).
Format : Question → Réponse courte et précise

### People-First Questions (pour humains)
Liste de 4-5 questions pratiques que se posent vraiment les lecteurs, avec réponses détaillées.
Format : H3 pour question, paragraphe pour réponse

# FORMAT DE SORTIE ATTENDU

Tu dois retourner EXACTEMENT ce format XML-like :

<SEO_TITLE>
[Nouveau titre H1 optimisé, 50-60 caractères, avec mot-clé]
</SEO_TITLE>

<META_DESCRIPTION>
[Nouvelle meta description 150-160 caractères, incitative, avec mot-clé]
</META_DESCRIPTION>

<WORDPRESS_EXCERPT>
[Extrait/chapô de 150-200 caractères pour CMS]
</WORDPRESS_EXCERPT>

<HTML_CONTENT>
[Article complet réécrit en HTML propre]
[Inclure : nouvelles sections, enrichissements, liens internes]
[Structure : H2 pour sections, H3 pour sous-sections]
[Listes <ul>/<ol>, <strong> pour emphase, <a> pour liens]
[Intégrer <!-- IMAGE: description --> pour visuels]
[Inclure Questions LLMO & People-First à la fin]
</HTML_CONTENT>

<FAQ_SECTION>
[Section FAQ enrichie ou créée (4-6 questions-réponses)]
[Format : <h3>Question ?</h3><p>Réponse...</p>]
</FAQ_SECTION>

<FAQ_JSON>
[FAQ en JSON Schema pour rich snippets]
[Format : FAQPage schema.org]
</FAQ_JSON>

<LLMO_QUESTIONS>
[5-7 questions que des IA pourraient poser]
[Format : "Question → Réponse courte"]
</LLMO_QUESTIONS>

<PEOPLE_FIRST_QUESTIONS>
[4-5 questions pratiques avec réponses détaillées]
[Format HTML : <h4>Question</h4><p>Réponse...</p>]
</PEOPLE_FIRST_QUESTIONS>

<SECONDARY_KEYWORDS>
[Liste mots-clés secondaires ajoutés, séparés par virgules]
</SECONDARY_KEYWORDS>

<INTERNAL_LINKS_ADDED>
[Liste liens internes ajoutés avec leurs ancres]
[Format : "Ancre → URL"]
</INTERNAL_LINKS_ADDED>

<IMPROVEMENTS>
[Résumé des améliorations apportées :]
- Corrections (orthographe, grammaire)
- Enrichissements (nouveaux contenus, stats, exemples)
- Optimisations SEO (titre, meta, structure)
- Ajouts LLMO/RAG (FAQ, questions, clarifications)
[3-5 bullets points]
</IMPROVEMENTS>

<CHANGELOG>
[Changelog technique : sections ajoutées, modifiées, supprimées]
[Format : "Action : Description"]
</CHANGELOG>

# RÈGLES IMPORTANTES
1. **Conserver l'essence** : Préserver angle et valeur de l'article original
2. **Enrichir, ne pas remplacer** : Ajouter 20-30% de contenu nouveau
3. **HTML propre** : Balises valides, pas de <div> inutiles
4. **Longueur** : Augmenter de 20-30% (min 1800 mots si original <1500)
5. **Pas de placeholder** : Tout doit être rédigé complètement
6. **Liens naturels** : Intégrer 2-4 liens internes fournis de manière fluide
7. **Format XML strict** : Utiliser exactement les balises ci-dessus
8. **Actualité** : Mentionner données/tendances 2024-2025
9. **Questions** : Sections LLMO & People-First obligatoires

Produis maintenant la version optimisée de l'article !`;
