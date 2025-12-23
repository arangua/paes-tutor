import { z } from 'zod'

// Esquemas de validación para APIs
export const studentQuerySchema = z.object({
  include: z.enum(['attempts', 'metrics']).array().optional(),
})

export const attemptQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  offset: z.coerce.number().int().min(0).optional().default(0),
})

export const examQuerySchema = z.object({
  subjectId: z.string().optional(),
  tipo: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
})

export const metricsQuerySchema = z.object({
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
})

export const materialsQuerySchema = z.object({
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  tipo: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
})

// Esquemas para creación/actualización
export const createAttemptSchema = z.object({
  examId: z.string().min(1),
  proceso: z.string().optional(),
  tipoAplicacion: z.string().optional(),
  forma: z.string().optional(),
})

export const updateAttemptSchema = z.object({
  estado: z.enum(['en_progreso', 'completado', 'cancelado']).optional(),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        optionSelectedId: z.string().optional(),
        omitida: z.boolean().optional().default(false),
      })
    )
    .optional(),
})

// Esquema para autenticación
export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(1, 'El nombre es requerido'),
  nombre: z.string().min(1, 'El nombre del estudiante es requerido'),
})
