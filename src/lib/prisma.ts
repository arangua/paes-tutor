import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Verificar que no estemos en Edge Runtime
  const isEdgeRuntime =
    (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge') ||
    (typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis)

  if (isEdgeRuntime) {
    throw new Error(
      'Prisma no puede ser usado en Edge Runtime. Asegúrate de que las rutas API tengan export const runtime = "nodejs"'
    )
  }

  // ⛔ GUARD CRÍTICO: Detectar SQLite y abortar inmediatamente
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error(
      'DATABASE_URL no está configurada. Debe configurar una URL de PostgreSQL (Neon) en .env.local'
    )
  }

  if (dbUrl.startsWith('file:')) {
    throw new Error(
      `❌ SQLite detectado en DATABASE_URL. Este proyecto solo usa PostgreSQL (Neon).\n` +
      `   DATABASE_URL actual: ${dbUrl.substring(0, 50)}...\n` +
      `   Configure DATABASE_URL con una URL de PostgreSQL en .env.local\n` +
      `   Ejemplo: postgresql://user:password@host/database?sslmode=require`
    )
  }

  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    throw new Error(
      `❌ DATABASE_URL no es una URL de PostgreSQL válida.\n` +
      `   DATABASE_URL actual: ${dbUrl.substring(0, 50)}...\n` +
      `   Debe comenzar con 'postgresql://' o 'postgres://'`
    )
  }

  // Log redactado para seguridad (no exponer credenciales)
  if (process.env.NODE_ENV === 'development') {
    const redactedUrl = dbUrl.replace(/:[^:@]+@/, ':****@') // Ocultar password
    // eslint-disable-next-line no-console
    console.log('[Prisma] Base de datos configurada (PostgreSQL):', {
      url: redactedUrl.substring(0, 80) + '...',
      provider: 'postgresql',
    })
  }

  // Crear PrismaClient con adapter para PostgreSQL (requerido en Prisma 7.2.0)
  const pool = new Pool({ connectionString: dbUrl })
  const adapter = new PrismaPg(pool)
  
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
  })

  return client
}

// Lazy initialization - solo se crea cuando se accede
let prismaInstance: PrismaClient | null = null

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!prismaInstance) {
      prismaInstance = globalForPrisma.prisma ?? createPrismaClient()
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance
      }
    }
    // eslint-disable-next-line security/detect-object-injection
    return (prismaInstance as unknown as Record<string | symbol, unknown>)[prop] // prop controlled by PrismaClient API
  },
})
