/**
 * Schemas de validación para respuestas
 * Asegura consistencia en las respuestas de la API
 */

import { z } from 'zod'

/**
 * Schema para respuesta de versión individual
 */
export const versionResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.string().nullable(),
  name: z.string().nullable(),
  color: z.string().nullable(),
  isImportant: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

/**
 * Schema para respuesta de versiones (GET)
 */
export const versionsResponseSchema = z.object({
  versions: z.array(versionResponseSchema),
  currentVersionId: z.string(),
  total: z.number(),
  statistics: z.object({
    totalVersions: z.number(),
    averageDaysBetweenVersions: z.number().nullable(),
    daysSinceLastUpdate: z.number(),
    lastUpdated: z.string(),
    importantCount: z.number(),
    namedCount: z.number(),
    totalRestores: z.number(),
  }),
  pagination: z.object({
    hasMore: z.boolean(),
    nextCursor: z.string().optional(),
    limit: z.number(),
    offset: z.number(),
    total: z.number(),
  }),
})

/**
 * Schema para respuesta de restauración (POST)
 */
export const restoreVersionResponseSchema = z.object({
  message: z.string(),
  note: z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    tags: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
})

/**
 * Schema para respuesta de actualización (PATCH)
 */
export const updateVersionResponseSchema = z.object({
  message: z.string(),
  version: versionResponseSchema,
})

/**
 * Schema para respuesta de eliminación (DELETE)
 */
export const deleteVersionResponseSchema = z.object({
  message: z.string(),
  deletedCount: z.number().optional(),
})

/**
 * Valida una respuesta contra su schema
 * Útil para debugging y asegurar consistencia
 */
export function validateResponse<T extends z.ZodType>(
  schema: T,
  data: unknown
): { valid: true; data: z.infer<T> } | { valid: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { valid: true, data: result.data }
  }
  
  return { valid: false, errors: result.error }
}

