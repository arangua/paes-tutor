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

/**
 * Validador para formato CUID (Collision-resistant Unique Identifier)
 * Formato: c + 24 caracteres alfanuméricos en minúsculas
 */
const cuidValidator = z
  .string()
  .regex(/^c[a-z0-9]{24}$/, 'ID debe tener formato CUID válido (c + 24 caracteres)')

/**
 * Schema para crear un nuevo intento de examen
 * 
 * @example
 * ```typescript
 * const data = createAttemptSchema.parse({
 *   examId: 'c123456789012345678901234',
 *   proceso: '2024',
 *   tipoAplicacion: 'regular',
 *   forma: 'A'
 * })
 * ```
 */
export const createAttemptSchema = z.object({
  examId: cuidValidator,
  proceso: z.string().min(1, 'Proceso no puede estar vacío').optional(),
  tipoAplicacion: z.string().min(1, 'Tipo de aplicación no puede estar vacío').optional(),
  forma: z.string().min(1, 'Forma no puede estar vacía').optional(),
})

/**
 * Schema para actualizar un intento de examen
 * 
 * Permite actualizar el estado del intento y/o las respuestas.
 * 
 * @example
 * ```typescript
 * const data = updateAttemptSchema.parse({
 *   estado: 'completado',
 *   answers: [
 *     {
 *       questionId: 'c123456789012345678901234',
 *       optionSelectedId: 'c987654321098765432109876',
 *       omitida: false
 *     }
 *   ]
 * })
 * ```
 */
export const updateAttemptSchema = z.object({
  estado: z.enum(['en_progreso', 'completado', 'cancelado'], {
    message: 'Estado debe ser: en_progreso, completado o cancelado',
  }).optional(),
  answers: z
    .array(
      z.object({
        questionId: cuidValidator,
        optionSelectedId: cuidValidator.optional().nullable(),
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

// ============================================
// SCHEMAS DE RESPUESTA PARA VALIDACIÓN RUNTIME EN CLIENTE
// ============================================

// Schema para respuesta de exámenes
export const examResponseSchema = z.object({
  exams: z.array(
    z.object({
      id: z.string(),
      titulo: z.string(),
      descripcion: z.string().nullable(),
      tipo: z.string(),
      tiempoLimiteMin: z.number().nullable(),
      totalPreguntas: z.number(),
      fuente: z.string().nullable(),
      createdAt: z.string(),
      subject: z.object({
        id: z.string(),
        nombre: z.string(),
        codigo: z.string(),
      }),
      questions: z.array(
        z.object({
          id: z.string(),
        })
      ),
    })
  ),
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean(),
  }),
})

// Schema para respuesta de estudiante
export const studentResponseSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  createdAt: z.string(),
  attempts: z
    .array(
      z.object({
        id: z.string(),
        estado: z.string(),
        porcentaje: z.number().nullable(),
        correctas: z.number(),
        totalPreguntas: z.number(),
        puntajePaes: z.number().nullable(),
        createdAt: z.string(),
        exam: z.object({
          id: z.string(),
          titulo: z.string(),
          subject: z.object({
            id: z.string(),
            nombre: z.string(),
            codigo: z.string(),
          }),
        }),
      })
    )
    .optional(),
})

// Schema para respuesta de métricas
export const metricsResponseSchema = z.array(
  z.object({
    totalAttempts: z.number(),
    avgScore: z.number(),
    completedAttempts: z.number(),
    subjectPerformance: z.array(
      z.object({
        subjectId: z.string(),
        subjectName: z.string(),
        avgScore: z.number(),
        attempts: z.number(),
      })
    ),
  })
)

// Schema para respuesta de búsqueda
export const searchResponseSchema = z.object({
  results: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      title: z.string(),
      description: z.string().nullable().optional(), // Acepta null, undefined o string
      url: z.string(),
      relevance: z.number(),
    })
  ),
  suggestions: z.array(z.string()).optional(),
})

// Schema para respuesta de progreso conjunto
export const jointProgressResponseSchema = z.union([
  z.object({
    message: z.string(),
  }),
  z.object({
    students: z.array(
      z.object({
        studentId: z.string(),
        studentName: z.string(),
        avgScore: z.number(),
        totalAttempts: z.number(),
      })
    ),
    comparison: z.object({
      scoreDifference: z.number(),
      trend: z.enum(['improving', 'declining', 'stable']),
    }),
  }),
])
