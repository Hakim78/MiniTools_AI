import { NextRequest, NextResponse } from 'next/server';

/**
 * API ENDPOINT : /api/removeBackground
 *
 * Supprime l'arrière-plan d'une image
 *
 * TODO: Implémenter l'intégration avec une API de background removal
 *
 * OPTIONS D'IMPLÉMENTATION :
 *
 * 1. REMOVE.BG (Commercial - Simple et puissant)
 * ------------------------------------------------
 * - Site: https://www.remove.bg/api
 * - Prix: 5 images gratuites/mois, puis 0.20€/image
 * - Installation: npm install remove.bg
 * - Clé API: REMOVE_BG_API_KEY dans .env.local
 *
 * Exemple de code:
 * ```typescript
 * import { RemoveBgResult, RemoveBgError, removeBackgroundFromImageFile } from 'remove.bg';
 *
 * const result: RemoveBgResult = await removeBackgroundFromImageFile({
 *   path: '/path/to/image.jpg',
 *   apiKey: process.env.REMOVE_BG_API_KEY!,
 *   size: 'regular',
 *   type: 'auto',
 *   format: 'png',
 * });
 *
 * // result.base64img contient l'image sans fond en base64
 * ```
 *
 * 2. HUGGING FACE (Open-Source - Gratuit)
 * ----------------------------------------
 * - Modèle: ECCV2022/dis-background-removal
 * - Site: https://huggingface.co/spaces/ECCV2022/dis-background-removal
 * - Installation: npm install @huggingface/inference
 * - Clé API: HUGGINGFACE_API_KEY dans .env.local
 *
 * Exemple de code:
 * ```typescript
 * import { HfInference } from '@huggingface/inference';
 *
 * const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
 *
 * const result = await hf.imageSegmentation({
 *   model: 'briaai/RMBG-1.4',
 *   data: imageBlob,
 * });
 *
 * // Traiter le résultat pour obtenir l'image sans fond
 * ```
 *
 * 3. REPLICATE (API Simple)
 * --------------------------
 * - Modèle: cjwbw/rembg
 * - Site: https://replicate.com/cjwbw/rembg
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
 *   'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
 *   {
 *     input: {
 *       image: imageUrl, // ou base64
 *     }
 *   }
 * );
 *
 * // output est l'URL de l'image traitée
 * ```
 */

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'image depuis le FormData
    const formData = await request.formData();
    const image = formData.get('image') as File;

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

    console.log('📸 Image reçue:', {
      name: image.name,
      type: image.type,
      size: `${(image.size / 1024).toFixed(2)} KB`,
    });

    // TODO: Implémenter l'appel à l'API de background removal
    // Exemple avec remove.bg :
    /*
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await removeBackgroundFromImageBuffer({
      buffer,
      apiKey: process.env.REMOVE_BG_API_KEY!,
      size: 'regular',
      type: 'auto',
      format: 'png',
    });

    // Convertir le résultat en base64 ou URL
    const resultBase64 = `data:image/png;base64,${result.base64img}`;

    return NextResponse.json({
      resultUrl: resultBase64,
      success: true,
    });
    */

    // STUB: Retourner un message indiquant que l'API n'est pas encore implémentée
    return NextResponse.json({
      message: 'TODO: Implémenter l\'API de background removal. Voir les options dans /app/api/removeBackground/route.ts',
      options: [
        'remove.bg (commercial, simple)',
        'Hugging Face (open-source, gratuit)',
        'Replicate (API simple)',
      ],
      receivedImage: {
        name: image.name,
        type: image.type,
        size: image.size,
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur removeBackground:', error);

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
    name: 'Background Removal API',
    version: '1.0.0',
    description: 'Supprime l\'arrière-plan des images',
    status: 'stub',
    implementation: 'TODO',
    options: [
      {
        name: 'remove.bg',
        type: 'commercial',
        url: 'https://www.remove.bg/api',
        envVar: 'REMOVE_BG_API_KEY',
      },
      {
        name: 'Hugging Face',
        type: 'open-source',
        url: 'https://huggingface.co/briaai/RMBG-1.4',
        envVar: 'HUGGINGFACE_API_KEY',
      },
      {
        name: 'Replicate',
        type: 'api',
        url: 'https://replicate.com/cjwbw/rembg',
        envVar: 'REPLICATE_API_TOKEN',
      },
    ],
  });
}
