import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

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

  // Usar DATABASE_URL del .env o la ruta relativa por defecto
  // La URL de SQLite debe tener formato: file:./paes.db o file:paes.db
  const dbUrl = process.env.DATABASE_URL || 'file:./paes.db'

  // Crear el adapter con la URL de la base de datos
  const adapter = new PrismaBetterSqlite3({
    url: dbUrl,
  })

  // Crear PrismaClient con el adapter y configuración de timeouts
  // Nota: SQLite no tiene timeouts nativos, pero podemos configurar el cliente
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
    // Configuración adicional para prevenir queries colgadas
    // En producción, considerar usar un timeout wrapper si es necesario
  })
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
    return (prismaInstance as unknown as Record<string | symbol, unknown>)[prop]
  },
})
