/**
 * Sentry Client Configuration
 *
 * Configuración de Sentry para el cliente (browser) en Next.js App Router.
 * Solo se inicializa si existe NEXT_PUBLIC_SENTRY_DSN (feature-flag por env).
 */

import * as Sentry from '@sentry/nextjs';

// Obtener environment: VERCEL_ENV tiene prioridad, sino usar NODE_ENV
const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

// Obtener release desde Vercel (si existe)
const release = process.env.VERCEL_GIT_COMMIT_SHA || undefined;

// Solo inicializar Sentry si existe DSN (feature-flag)
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment,
    ...(release && { release }),
    debug: process.env.NODE_ENV === 'development', // Habilitar debug en desarrollo
    tracesSampleRate: 0,
    
    // Configuraciones robustas para asegurar envío de eventos
    maxQueueSize: 100, // Aumentar tamaño de cola
    transportOptions: {
      // Aumentar timeout para conexiones lentas
      timeout: 10000, // 10 segundos
    },
    
    // Filtrar errores de keyframes inválidos de bundles externos
    beforeSend(event, hint) {
      const errorMessage = event.message || hint.originalException?.message || '';
      const errorSource = event.exception?.values?.[0]?.stacktrace?.frames?.[0]?.filename || '';
      
      // Filtrar errores de keyframes inválidos de bundles externos
      const isKeyframeError = 
        errorMessage.includes('Invalid keyframe value for property transform') &&
        errorMessage.includes('translate0') &&
        (errorSource.includes('bundle') || 
         errorSource.includes('chunk') || 
         errorSource.includes('22359-') ||
         errorSource === '' ||
         !errorSource.includes('paes-tutor'));
      
      if (isKeyframeError) {
        return null; // No enviar este error a Sentry
      }
      
      // En desarrollo, loggear eventos antes de enviarlos
      if (process.env.NODE_ENV === 'development') {
        console.log('[Sentry Client] Enviando evento:', {
          message: event.message,
          level: event.level,
          tags: event.tags,
        })
      }
      
      return event;
    },
    // Ignorar errores específicos en la consola
    ignoreErrors: [
      'Invalid keyframe value for property transform',
      /translate0\.?\d+d/,
    ],
  });
  
  // Log de inicialización en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('[Sentry Client] Inicializado correctamente')
    console.log('[Sentry Client] DSN configurado:', process.env.NEXT_PUBLIC_SENTRY_DSN.substring(0, 30) + '...')
  }
}
