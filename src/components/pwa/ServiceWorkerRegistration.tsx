'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Registrar Service Worker
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', {
            scope: '/',
          })
          .then((registration) => {
            logger.info(
              {
                type: 'service_worker_registered',
                scope: registration.scope,
              },
              'Service Worker registrado'
            )

            // Verificar actualizaciones periódicamente
            setInterval(() => {
              registration.update()
            }, 60000) // Cada minuto

            // Escuchar actualizaciones del Service Worker
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (
                    newWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    // Hay una nueva versión disponible
                    logger.info(
                      {
                        type: 'service_worker_update_available',
                      },
                      'Nueva versión disponible'
                    )
                    // Opcional: mostrar notificación al usuario
                  }
                })
              }
            })
          })
          .catch((error) => {
            logger.error(
              {
                type: 'service_worker_registration_error', // guard:allow-secret
                error: error instanceof Error ? error.message : String(error),
              },
              'Error al registrar Service Worker'
            )
          })
      })

      // Manejar cuando el Service Worker toma control
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          // Recargar la página cuando hay una nueva versión
          window.location.reload()
        }
      })
    }
  }, [])

  return null
}

