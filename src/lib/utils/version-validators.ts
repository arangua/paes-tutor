import { z } from 'zod'

/**
 * Helper para validar formato CUID
 * Los IDs de Prisma usan formato CUID: 'c' seguido de 24 caracteres alfanuméricos
 */
export const cuidValidator = (message: string) =>
  z.string().regex(/^c[a-z0-9]{24}$/, message)

