import { z } from 'zod'

/**
 * Schema de contrato para crear una nota
 * 
 * Invariantes cumplidas:
 * - ✅ Campos inexistentes no existen (no defaults implícitos)
 * - ✅ Campos extra están prohibidos (.strict())
 * - ✅ Tipos inválidos no entran (tipos explícitos)
 * - ✅ Contrato único por endpoint
 */
export const CreateNoteSchema = z
  .object({
    title: z
      .string()
      .min(1, 'El título es requerido')
      .refine((val) => val.trim().length > 0, {
        message: 'El título no puede ser solo espacios en blanco',
      }),
    content: z
      .string()
      .min(1, 'El contenido es requerido')
      .refine((val) => val.trim().length > 0, {
        message: 'El contenido no puede ser solo espacios en blanco',
      }),
    questionId: z.cuid({ error: 'questionId debe ser un CUID válido' }).optional(),
    topicId: z.cuid({ error: 'topicId debe ser un CUID válido' }).optional(),
    tags: z.string().optional(),
  })
  .strict() // ⛔ Campos extra prohibidos

/**
 * Tipo inferido del schema (no duplicado)
 */
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>
