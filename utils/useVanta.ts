// utils/useVanta.ts
'use client'

import { useEffect, useState } from 'react'

/**
 * Hook React universel pour initialiser et détruire proprement un effet Vanta.js.
 * Compatible avec TypeScript et Next.js App Router.
 * 
 * Supporte plusieurs effets : "WAVES", "NET", "CELLS", "BIRDS", etc.
 */

type VantaEffectType = 'waves' | 'net' | 'cells' | 'birds'

interface UseVantaOptions {
  effect?: VantaEffectType
  color?: number
  backgroundColor?: number
  waveHeight?: number
  waveSpeed?: number
  scale?: number
  scaleMobile?: number
  shininess?: number
  zoom?: number
  minHeight?: number
  minWidth?: number
}

/**
 * @param ref - référence de ton élément HTML (div)
 * @param options - paramètres de configuration du rendu Vanta
 * @returns l’instance de l’effet créé (utile si tu veux le manipuler ensuite)
 */
export const useVanta = (
  ref: React.RefObject<HTMLDivElement>,
  options?: UseVantaOptions
): any => {
  const [vantaEffect, setVantaEffect] = useState<any>(null)

  useEffect(() => {
    if (!ref.current) return

    let isMounted = true

    const loadEffect = async () => {
      try {
        const effectType = options?.effect ?? 'waves'
        const three = await import('three')

        let VANTA
        switch (effectType) {
          case 'net':
            VANTA = (await import('vanta/dist/vanta.net.min')).default
            break
          case 'cells':
            VANTA = (await import('vanta/dist/vanta.cells.min')).default
            break
          case 'birds':
            VANTA = (await import('vanta/dist/vanta.birds.min')).default
            break
          case 'waves':
          default:
            VANTA = (await import('vanta/dist/vanta.waves.min')).default
            break
        }

        if (isMounted && !vantaEffect) {
          const effect = VANTA({
            el: ref.current,
            THREE: three,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: options?.minHeight ?? 200.0,
            minWidth: options?.minWidth ?? 200.0,
            scale: options?.scale ?? 1.0,
            scaleMobile: options?.scaleMobile ?? 1.0,
            color: options?.color ?? 0x7c3bed,
            backgroundColor: options?.backgroundColor ?? 0x000000,
            waveHeight: options?.waveHeight ?? 15.0,
            waveSpeed: options?.waveSpeed ?? 0.5,
            shininess: options?.shininess ?? 30.0,
            zoom: options?.zoom ?? 0.75,
          })
          setVantaEffect(effect)
        }
      } catch (error) {
        console.error('Erreur lors du chargement de Vanta.js:', error)
      }
    }

    loadEffect()

    return () => {
      isMounted = false
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect, ref, options])

  return vantaEffect
}
