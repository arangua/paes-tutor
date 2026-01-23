/**
 * Sentry Server Configuration
 *
 * Configuración de Sentry para el servidor (Node.js) en Next.js App Router.
 * Solo se inicializa si existe SENTRY_DSN (feature-flag por env).
 */

import * as Sentry from '@sentry/nextjs';

// Obtener environment: VERCEL_ENV tiene prioridad, sino usar NODE_ENV
const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

// Obtener release desde Vercel (si existe)
const release = process.env.VERCEL_GIT_COMMIT_SHA || undefined;

// Solo inicializar Sentry si existe DSN (feature-flag)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment,
    ...(release && { release }),
    debug: process.env.NODE_ENV === 'development', // Habilitar debug en desarrollo
    tracesSampleRate: 0,
    
    // Configuraciones robustas para asegurar envío de eventos
    maxQueueSize: 100, // Aumentar tamaño de cola
    
    // Configuraciones adicionales para mejor debugging
    beforeSend(event, hint) {
      // En desarrollo, loggear eventos antes de enviarlos
      if (process.env.NODE_ENV === 'development') {
        console.log('[Sentry Server] Enviando evento:', {
          message: event.message,
          level: event.level,
          tags: event.tags,
          exception: event.exception,
          error: hint.originalException,
        })
      }
      
      // Asegurar que eventos de smoke test siempre se envíen
      if (event.tags?.smoke_test === 'true' || event.tags?.smoke_test === true) {
        console.log('[Sentry Server] Evento de smoke test detectado, asegurando envío')
        return event
      }
      
      return event
    },
    
    // Callback después de enviar (para debugging)
    afterSend(event, sendResponse) {
      if (process.env.NODE_ENV === 'development') {
        if (sendResponse) {
          console.log('[Sentry Server] Evento enviado exitosamente:', {
            statusCode: sendResponse.statusCode,
            eventId: event.event_id,
          })
        } else {
          console.warn('[Sentry Server] No se recibió respuesta del servidor de Sentry')
        }
      }
      return event
    },
  });
  
  // Log de inicialización en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('[Sentry Server] Inicializado correctamente')
    console.log('[Sentry Server] DSN configurado:', process.env.SENTRY_DSN.substring(0, 30) + '...')
  }
}
