import { NextRequest, NextResponse } from 'next/server';

/**
 * API ENDPOINT : /api/removeWatermark
 *
 * Supprime les filigranes/watermarks des images
 *
 * TODO: Implémenter l'intégration avec une API d'inpainting/watermark removal
 *
 * OPTIONS D'IMPLÉMENTATION :
 *
 * 1. HUGGING FACE - Remove Anything (Open-Source - Gratuit)
 * ----------------------------------------------------------
 * - Modèle: laion-ai/Remove-Anything
 * - Site: https://huggingface.co/spaces/laion-ai/Remove-Anything
 * - Installation: npm install @huggingface/inference
 * - Clé API: HUGGINGFACE_API_KEY dans .env.local
 * - Note: Nécessite de détecter automatiquement la zone du watermark ou de laisser l'user dessiner un masque
 *
 * Exemple de code:
 * ```typescript
 * import { HfInference } from '@huggingface/inference';
 *
 * const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
 *
 * // Pour l'inpainting, on doit fournir :
 * // 1. L'image originale
 * // 2. Un masque (zone à remplacer/supprimer)
 *
 * const result = await hf.imageToImage({
 *   model: 'runwayml/stable-diffusion-inpainting',
 *   inputs: {
 *     image: imageBlob,
 *     mask: maskBlob, // Zone blanche = à remplacer
 *     prompt: 'clean background, no text, no watermark',
 *   }
 * });
 * ```
 *
 * 2. REPLICATE - Stable Diffusion Inpainting (API Simple)
 * --------------------------------------------------------
 * - Modèle: stability-ai/stable-diffusion-inpainting
 * - Site: https://replicate.com/stability-ai/stable-diffusion-inpainting
 * - Installation: npm install replicate
 * - Clé API: REPLICATE_API_TOKEN dans .env.local
 *
 * Exemple de code:
 * ```typescript
 * import Replicate from 'replicate';
 *
 * const replicate = new Replicate({
 *   auth: process.env.REPLICATE_API_TOKEN,
 * });
 *
 * const output = await replicate.run(
 *   'stability-ai/stable-diffusion-inpainting',
 *   {
 *     input: {
 *       image: imageUrl, // URL ou base64
 *       mask: maskUrl,   // Masque de la zone à remplacer
 *       prompt: 'clean background without watermark',
 *     }
 *   }
 * );
 *
 * // output est l'URL de l'image traitée
 * ```
 *
 * 3. LAMA (Large Mask Inpainting - Open-Source Puissant)
 * -------------------------------------------------------
 * - Repo: https://github.com/advimman/lama
 * - Option 1: Déployer le modèle sur Hugging Face Spaces
 * - Option 2: Utiliser un service comme IOPaint (https://github.com/Sanster/IOPaint)
 * - Avantages: Meilleurs résultats que Stable Diffusion pour l'inpainting
 *
 * 4. DÉTECTION AUTOMATIQUE DE WATERMARK (Recommandé)
 * ---------------------------------------------------
 * Pour une meilleure UX, on peut automatiser la détection du watermark :
 *
 * - Option A: Utiliser un modèle de détection d'objets (YOLO, Detectron2)
 * - Option B: Traitement d'image classique (OpenCV) pour détecter les zones de texte/logo
 * - Option C: Demander à l'utilisateur de dessiner le masque manuellement (canvas)
 *
 * Exemple avec détection de texte:
 * ```typescript
 * import Tesseract from 'tesseract.js';
 *
 * // Détecter le texte/watermark dans l'image
 * const { data } = await Tesseract.recognize(image, 'eng');
 *
 * // data.words contient les coordonnées de chaque mot détecté
 * // On peut créer un masque automatiquement à partir de ces coordonnées
 * ```
 */

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'image depuis le FormData
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const mask = formData.get('mask') as File | null; // Optionnel: masque fourni par l'user

    if (!image) {
      return NextResponse.json(
        { error: 'Aucune image fournie' },
        { status: 400 }
      );
    }

    // Valider le type de fichier
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Valider la taille (max 10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (image.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'L\'image est trop volumineuse (max 10 MB)' },
        { status: 400 }
      );
    }

    console.log('🖼️  Image reçue:', {
      name: image.name,
      type: image.type,
      size: `${(image.size / 1024).toFixed(2)} KB`,
      hasMask: !!mask,
    });

    // TODO: Implémenter l'appel à l'API d'inpainting/watermark removal
    // Exemple avec Replicate :
    /*
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const imageDataUrl = `data:${image.type};base64,${base64Image}`;

    // Si pas de masque fourni, on peut essayer de le générer automatiquement
    // ou demander à l'user de le dessiner
    let maskDataUrl = null;
    if (mask) {
      const maskBuffer = await mask.arrayBuffer();
      const base64Mask = Buffer.from(maskBuffer).toString('base64');
      maskDataUrl = `data:${mask.type};base64,${base64Mask}`;
    } else {
      // TODO: Générer un masque automatique en détectant le watermark
      // Exemple: utiliser Tesseract.js pour détecter le texte
      // ou un modèle ML pour détecter les logos
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });

    const output = await replicate.run(
      'stability-ai/stable-diffusion-inpainting',
      {
        input: {
          image: imageDataUrl,
          mask: maskDataUrl,
          prompt: 'clean image without watermark or text overlay',
          num_inference_steps: 50,
        }
      }
    );

    return NextResponse.json({
      resultUrl: output,
      success: true,
    });
    */

    // STUB: Retourner un message indiquant que l'API n'est pas encore implémentée
    return NextResponse.json({
      message: 'TODO: Implémenter l\'API de watermark removal. Voir les options dans /app/api/removeWatermark/route.ts',
      options: [
        'Hugging Face - Remove Anything (open-source)',
        'Replicate - Stable Diffusion Inpainting (API simple)',
        'LaMa - Large Mask Inpainting (puissant)',
      ],
      recommendations: [
        'Ajouter une fonctionnalité de détection automatique du watermark',
        'Permettre à l\'utilisateur de dessiner un masque manuellement (canvas)',
        'Utiliser LaMa pour les meilleurs résultats d\'inpainting',
      ],
      receivedImage: {
        name: image.name,
        type: image.type,
        size: image.size,
        hasMask: !!mask,
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur removeWatermark:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors du traitement de l\'image',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET: Retourner les infos de l'API
export async function GET() {
  return NextResponse.json({
    name: 'Watermark Removal API',
    version: '1.0.0',
    description: 'Supprime les filigranes et textes indésirables des images',
    status: 'stub',
    implementation: 'TODO',
    options: [
      {
        name: 'Hugging Face - Remove Anything',
        type: 'open-source',
        url: 'https://huggingface.co/spaces/laion-ai/Remove-Anything',
        envVar: 'HUGGINGFACE_API_KEY',
      },
      {
        name: 'Replicate - Stable Diffusion Inpainting',
        type: 'api',
        url: 'https://replicate.com/stability-ai/stable-diffusion-inpainting',
        envVar: 'REPLICATE_API_TOKEN',
      },
      {
        name: 'LaMa (via IOPaint)',
        type: 'self-hosted',
        url: 'https://github.com/Sanster/IOPaint',
        envVar: 'IOPAINT_API_URL',
      },
    ],
    features: [
      'Manual mask drawing (user selects watermark area)',
      'Automatic watermark detection (text + logo)',
      'Multiple inpainting models support',
    ],
  });
}
