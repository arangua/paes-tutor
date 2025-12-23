import { handlers } from '@/lib/auth'

// Especificar Node.js runtime (necesario para NextAuth y Prisma)
export const runtime = 'nodejs'

export const { GET, POST } = handlers
