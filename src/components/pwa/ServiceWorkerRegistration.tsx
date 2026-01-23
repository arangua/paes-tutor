'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

const SERVICE_WORKER_PATH = '/sw.js'
const SERVICE_WORKER_SCOPE = '/'
const SERVICE_WORKER_UPDATE_INTERVAL_MS = 60000

function updateServiceWorkerRegistration(registration: globalThis.ServiceWorkerRegistration): void {
  void registration.update()
}

function startServiceWorkerUpdateInterval(registration: globalThis.ServiceWorkerRegistration): void {
  // setInterval soporta pasar argumentos al callback (evita closures/funciones anidadas)
  window.setInterval(updateServiceWorkerRegistration, SERVICE_WORKER_UPDATE_INTERVAL_MS, registration)
}

function onWorkerStateChange(this: globalThis.ServiceWorker): void {
  if (this.state !== 'installed') return
  if (!navigator.serviceWorker.controller) return

  logger.info(
    {
      type: 'service_worker_update_available',
    },
    'Nueva versión disponible'
  )
}

function onRegistrationUpdateFound(this: globalThis.ServiceWorkerRegistration): void {
  const newWorker = this.installing
  if (!newWorker) return

  newWorker.addEventListener('statechange', onWorkerStateChange)
}

async function registerServiceWorker(): Promise<globalThis.ServiceWorkerRegistration> {
  return await navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: SERVICE_WORKER_SCOPE })
}

async function handleServiceWorkerRegistration(): Promise<void> {
  try {
    const registration = await registerServiceWorker()

    logger.info(
      {
        type: 'service_worker_registered',
        scope: registration.scope,
      },
      'Service Worker registrado'
    )

    // Verificar actualizaciones periódicamente
    startServiceWorkerUpdateInterval(registration)

    // Escuchar actualizaciones del Service Worker
    registration.addEventListener('updatefound', onRegistrationUpdateFound)
  } catch (error) {
    logger.error(
      {
        type: 'service_worker_registration_error', // guard:allow-secret
        error: error instanceof Error ? error.message : String(error),
      },
      'Error al registrar Service Worker'
    )
  }
}

function onWindowLoad(): void {
  void handleServiceWorkerRegistration()
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // Registrar Service Worker
    window.addEventListener('load', onWindowLoad)

    // Manejar cuando el Service Worker toma control
    let refreshing = false
    const handleControllerChange = () => {
      if (refreshing) return
      refreshing = true
      // Recargar la página cuando hay una nueva versión
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      window.removeEventListener('load', onWindowLoad)
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  return null
}

