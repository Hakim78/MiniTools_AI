'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { Upload, Image as ImageIcon, Loader2, Download, ArrowLeft } from 'lucide-react';
import { useVanta } from '@/utils/useVanta';

/**
 * PAGE BACKGROUND REMOVER
 *
 * Outil IA pour supprimer l'arrière-plan des images
 *
 * TODO: Implémenter l'appel API (remove.bg, Hugging Face, etc.)
 * - Option 1: remove.bg API (https://www.remove.bg/api)
 * - Option 2: Hugging Face (https://huggingface.co/spaces/ECCV2022/dis-background-removal)
 * - Option 3: Replicate (https://replicate.com/cjwbw/rembg)
 */

export default function BackgroundRemoverPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const vantaRef = useRef<HTMLDivElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Background animé
  useVanta(vantaRef, {
    effect: 'waves',
    color: 0x7c3aed,
    backgroundColor: 0x000000,
    waveHeight: 15.0,
    waveSpeed: 0.5,
    shininess: 30.0,
    zoom: 0.8,
  });

  // Animation d'entrée
  useEffect(() => {
    if (uploadZoneRef.current) {
      gsap.fromTo(
        uploadZoneRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  /**
   * Gérer la sélection de fichier
   */
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide (PNG, JPG, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10 MB max
      setError('L\'image est trop volumineuse. Maximum 10 MB.');
      return;
    }

    setSelectedFile(file);
    setError('');
    setResultUrl('');

    // Créer l'aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Drag & Drop
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Lancer le traitement IA
   */
  const handleProcess = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/removeBackground', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du traitement');
      }

      // TODO: Une fois l'API implémentée, récupérer l'URL du résultat
      // setResultUrl(data.resultUrl);

      // Pour l'instant, afficher un message de stub
      setError(data.message || 'API à implémenter');
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background */}
      <div ref={vantaRef} className="fixed inset-0 -z-10"></div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-black pointer-events-none"></div>

      {/* Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-6 flex items-center justify-center">
              <ImageIcon className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Efface-Fond IA
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Supprime automatiquement l'arrière-plan de tes images en un clic
            </p>
          </div>
        </header>

        {/* Zone d'upload */}
        <div ref={uploadZoneRef} className="glass rounded-2xl p-8 border border-white/10 mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />

          {!previewUrl ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/20 hover:border-purple-500/50 hover:bg-white/5'
              }`}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Glisse une image ici</h3>
              <p className="text-gray-400 mb-4">ou clique pour importer</p>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP (max 10 MB)</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Aperçu avant */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="text-purple-400">Avant</span>
                </h3>
                <div className="relative rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full h-auto"
                  />
                </div>
                <button
                  onClick={() => {
                    setPreviewUrl('');
                    setSelectedFile(null);
                    setResultUrl('');
                    setError('');
                  }}
                  className="mt-4 w-full py-2 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
                >
                  Changer d'image
                </button>
              </div>

              {/* Aperçu après */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="text-green-400">Après</span>
                </h3>
                <div className="relative rounded-xl overflow-hidden bg-white/5 border border-white/10 min-h-[300px] flex items-center justify-center">
                  {loading ? (
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-purple-400 mx-auto mb-4" />
                      <p className="text-gray-400">Traitement en cours...</p>
                    </div>
                  ) : resultUrl ? (
                    <img src={resultUrl} alt="Résultat" className="w-full h-auto" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Le résultat apparaîtra ici</p>
                    </div>
                  )}
                </div>
                {resultUrl && (
                  <button
                    onClick={() => {
                      // TODO: Implémenter le téléchargement
                      const a = document.createElement('a');
                      a.href = resultUrl;
                      a.download = 'background-removed.png';
                      a.click();
                    }}
                    className="mt-4 w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        {previewUrl && !resultUrl && (
          <div className="text-center">
            <button
              onClick={handleProcess}
              disabled={loading}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-lg shadow-lg shadow-purple-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Traitement...' : 'Lancer l\'IA'}
            </button>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Info API */}
        <div className="mt-12 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <h3 className="font-bold text-blue-400 mb-2">💡 API à implémenter</h3>
          <p className="text-sm text-gray-400 mb-2">Options recommandées :</p>
          <ul className="text-sm text-gray-400 space-y-1 ml-4">
            <li>
              • <strong>remove.bg</strong> - API commerciale puissante (5 images gratuites/mois)
            </li>
            <li>
              • <strong>Hugging Face</strong> - Modèles open-source gratuits (ECCV2022/dis-background-removal)
            </li>
            <li>
              • <strong>Replicate</strong> - API simple avec rembg (cjwbw/rembg)
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            Voir le code dans <code>/app/api/removeBackground/route.ts</code>
          </p>
        </div>
      </div>
    </div>
  );
}
