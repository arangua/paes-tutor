// @ts-nocheck
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configurar paquetes externos para Server Components
  // Estos paquetes no se empaquetarán para Edge Runtime
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-better-sqlite3',
    'better-sqlite3',
    'bcryptjs',
    'pino',
    'pino-pretty',
    'sonic-boom',
    '@upstash/ratelimit',
    '@upstash/redis',
    'pdf-parse',
  ],
  // Turbopack está habilitado por defecto en Next.js 16+
  // Los paquetes en serverExternalPackages se excluyen automáticamente del bundle del cliente
  // No necesitamos configuración adicional de webpack o turbopack
  // SWC minification está habilitado por defecto en Next.js 16+
  compress: true, // Habilitar compresión gzip
  // Optimizar producción
  productionBrowserSourceMaps: false, // Deshabilitar source maps en producción para reducir tamaño
  // Optimizaciones de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Headers de optimización
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
}

export default nextConfig
