// Service Worker para PAES Tutor PWA
const CACHE_NAME = 'paes-tutor-v1'
const STATIC_CACHE_NAME = 'paes-tutor-static-v1'
const DYNAMIC_CACHE_NAME = 'paes-tutor-dynamic-v1'

// Assets estáticos a cachear
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/exams',
  '/analytics',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
]

// Estrategia: Cache First para assets estáticos
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(request)
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    // Si falla, intentar devolver una página offline
    if (request.destination === 'document') {
      return caches.match('/')
    }
    throw error
  }
}

// Estrategia: Network First para datos dinámicos
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    throw error
  }
}

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name !== STATIC_CACHE_NAME &&
              name !== DYNAMIC_CACHE_NAME &&
              name !== CACHE_NAME
            )
          })
          .map((name) => caches.delete(name))
      )
    })
  )
  return self.clients.claim()
})

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // No cachear requests a APIs de autenticación
  if (url.pathname.startsWith('/api/auth')) {
    return
  }

  // No cachear requests a APIs dinámicas (pero sí permitir offline)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Cache First para assets estáticos
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Network First para páginas HTML
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request))
    return
  }

  // Default: Network First
  event.respondWith(networkFirst(request))
})

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

