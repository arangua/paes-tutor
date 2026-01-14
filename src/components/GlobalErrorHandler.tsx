'use client'

import { useEffect } from 'react'

/**
 * Componente que maneja errores globales de extensiones del navegador
 * y scripts externos que pueden interferir con la funcionalidad de la aplicación
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    // Manejar errores no capturados de extensiones del navegador y scripts externos
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason)
      
      // Ignorar errores comunes de extensiones del navegador que no afectan la funcionalidad
      const isExtensionError = 
        errorMessage.includes('message channel closed') ||
        errorMessage.includes('message port closed') ||
        errorMessage.includes('Extension context invalidated') ||
        errorMessage.includes('Receiving end does not exist') ||
        errorMessage.includes('Could not establish connection') ||
        errorMessage.includes('asynchronous response') ||
        errorMessage.includes('listener indicated')
      
      if (isExtensionError) {
        // Prevenir que el error aparezca en la consola y no afecte la funcionalidad
        event.preventDefault()
        return
      }
    }

    // Manejar errores síncronos de extensiones y scripts externos
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || String(event.error)
      const errorSource = event.filename || ''
      
      // Ignorar errores de extensiones del navegador
      const isExtensionError = 
        errorMessage.includes('message channel closed') ||
        errorMessage.includes('message port closed') ||
        errorMessage.includes('Extension context invalidated') ||
        errorMessage.includes('Receiving end does not exist') ||
        errorMessage.includes('Could not establish connection') ||
        errorMessage.includes('asynchronous response') ||
        errorMessage.includes('listener indicated')
      
      // Ignorar errores de keyframes inválidos de scripts externos (bundles de terceros)
      const isExternalKeyframeError = 
        errorMessage.includes('Invalid keyframe value for property transform') &&
        (errorMessage.includes('translate0') || errorMessage.includes('translate0.')) &&
        (errorSource.includes('bundle') || errorSource.includes('chunk') || !errorSource.includes('paes-tutor'))
      
      if (isExtensionError || isExternalKeyframeError) {
        // Prevenir que el error aparezca en la consola
        event.preventDefault()
        return
      }
    }

    // Filtrar warnings y errores de la consola de scripts externos
    const originalWarn = console.warn
    const originalError = console.error
    
    // Interceptar console.warn
    console.warn = (...args: unknown[]) => {
      const message = args.join(' ')
      
      // Filtrar warnings de Amplitude de scripts externos
      const isAmplitudeWarning = 
        message.includes('Amplitude Logger') &&
        message.includes('defaultTracking') &&
        (message.includes('contentScript') || message.includes('bundle'))
      
      // Filtrar warnings de keyframes inválidos de scripts externos
      const isExternalKeyframeWarning = 
        message.includes('Invalid keyframe') &&
        (message.includes('translate0') || message.includes('translate0.'))
      
      // Filtrar warnings de React sobre Select controlled/uncontrolled
      // Estos warnings son comunes cuando un Select cambia de undefined a un valor
      // y no afectan la funcionalidad
      const isSelectControlledWarning = 
        message.includes('Select is changing from uncontrolled to controlled') ||
        message.includes('Components should not switch from controlled to uncontrolled')
      
      // Solo mostrar warnings que no sean de scripts externos o warnings conocidos
      if (!isAmplitudeWarning && !isExternalKeyframeWarning && !isSelectControlledWarning) {
        originalWarn.apply(console, args)
      }
    }
    
    // Interceptar console.error para filtrar errores de keyframes de bundles externos
    console.error = (...args: unknown[]) => {
      const fullMessage = args.map(arg => String(arg)).join(' ')
      
      // Filtrar errores de keyframes inválidos de scripts externos
      // Estos errores tienen el patrón: "Invalid keyframe value for property transform: translate0d(...)"
      const isKeyframeError = 
        fullMessage.includes('Invalid keyframe value for property transform') &&
        (fullMessage.includes('translate0d') || 
         fullMessage.includes('translate0.') ||
         /translate0\.?\d+d/.test(fullMessage))
      
      // Si es un error de keyframes, filtrarlo (viene de bundles externos)
      if (isKeyframeError) {
        return // No mostrar el error
      }
      
      // Mostrar todos los demás errores normalmente
      originalError.apply(console, args)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
      // Restaurar console.warn y console.error originales
      console.warn = originalWarn
      console.error = originalError
    }
  }, [])

  return null
}

