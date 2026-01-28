import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { isAdmin } from '@/lib/check-admin'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { PrismaClient, Prisma } from '@prisma/client'

export const runtime = 'nodejs'

// Schema de validación
const cleanupSchema = z.object({
  deleteExams: z.boolean().default(false),
  deleteTopics: z.boolean().default(false),
  deleteQuestions: z.boolean().default(false),
  deleteAttempts: z.boolean().default(false),
  deleteTestUsers: z.boolean().default(false),
  // Opciones adicionales
  onlyTestData: z.boolean().default(true), // Solo eliminar datos marcados como test
  yearFilter: z.string().optional(), // Filtrar por año específico
  subjectFilter: z.string().optional(), // Filtrar por asignatura específica
})

interface CleanupResult {
  exams: { deleted: number; total: number }
  topics: { deleted: number; total: number }
  questions: { deleted: number; total: number }
  attempts: { deleted: number; total: number }
  users: { deleted: number; total: number }
  errors: Array<{ type: string; error: string }>
}

// Nota: Las funciones isTestExam e isTestUser fueron removidas porque
// la detección se hace directamente en las consultas de Prisma usando
// filtros con palabras clave, lo cual es más eficiente.

/**
 * Limpia datos de prueba de la base de datos
 */
async function cleanupTestData(data: z.infer<typeof cleanupSchema>): Promise<CleanupResult> {
  const result: CleanupResult = {
    exams: { deleted: 0, total: 0 },
    topics: { deleted: 0, total: 0 },
    questions: { deleted: 0, total: 0 },
    attempts: { deleted: 0, total: 0 },
    users: { deleted: 0, total: 0 },
    errors: [],
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Eliminar intentos (attempts) primero (dependencias)
      if (data.deleteAttempts) {
        try {
          const whereClause: Prisma.AttemptWhereInput = {}

          if (data.onlyTestData) {
            // Buscar intentos de exámenes de prueba
            const testExams = await tx.exam.findMany({
              where: {
                OR: [
                  { tipo: 'simulacro' },
                  { titulo: { contains: 'test' } },
                  { titulo: { contains: 'prueba' } },
                  { titulo: { contains: 'demo' } },
                  { descripcion: { contains: 'test' } },
                  { descripcion: { contains: 'prueba' } },
                ],
              },
              select: { id: true },
            })

            if (testExams.length > 0) {
              whereClause.examId = { in: testExams.map(e => e.id) }
            } else {
              // Si no hay exámenes de prueba, no hay intentos que eliminar
              // Usar un ID que no existe para que la consulta no devuelva resultados
              whereClause.id = '00000000000000000000000'
            }
          }

          if (data.yearFilter) {
            // Buscar exámenes del año especificado
            const examsByYear = await tx.exam.findMany({
              where: {
                fuente: { contains: data.yearFilter },
              },
              select: { id: true },
            })

            if (examsByYear.length > 0) {
              // Combinar con el filtro existente de examId (intersección)
              if (whereClause.examId && typeof whereClause.examId === 'object' && 'in' in whereClause.examId && Array.isArray(whereClause.examId.in)) {
                // Intersectar: solo intentos de exámenes de prueba Y del año especificado
                const examIdsSet = new Set(examsByYear.map(e => e.id))
                const filteredIds = whereClause.examId.in.filter((id: string) => examIdsSet.has(id))

                if (filteredIds.length > 0) {
                  whereClause.examId = { in: filteredIds }
                } else {
                  // No hay intersección, no hay intentos que eliminar
                  whereClause.id = '00000000000000000000000'
                }
              } else {
                // Si no había filtro previo, usar solo el filtro de año
                whereClause.examId = { in: examsByYear.map(e => e.id) }
              }
            } else {
              // No hay exámenes del año especificado
              whereClause.id = '00000000000000000000000'
            }
          }

          const count = await tx.attempt.count({ where: whereClause })
          result.attempts.total = count

          if (count > 0) {
            await tx.attempt.deleteMany({ where: whereClause })
            result.attempts.deleted = count
          }
        } catch (e: unknown) {
          result.errors.push({
            type: 'attempts',
            error: e instanceof Error ? e.message : 'Error desconocido',
          })
        }
      }

      // 2. Eliminar exámenes
      if (data.deleteExams) {
        try {
          const whereClause: Prisma.ExamWhereInput = {}

          if (data.onlyTestData) {
            whereClause.OR = [
              { tipo: 'simulacro' },
              { titulo: { contains: 'test',  } },
              { titulo: { contains: 'prueba',  } },
              { titulo: { contains: 'demo',  } },
              { titulo: { contains: 'ejemplo',  } },
              { descripcion: { contains: 'test',  } },
              { descripcion: { contains: 'prueba',  } },
            ]
          }

          if (data.yearFilter) {
            whereClause.fuente = { contains: data.yearFilter }
          }

          if (data.subjectFilter) {
            const subject = await tx.subject.findUnique({
              where: { codigo: data.subjectFilter },
              select: { id: true },
            })
            if (subject) {
              whereClause.subjectId = subject.id
            } else {
              // Si la asignatura no existe, no hay exámenes que eliminar
              whereClause.id = '00000000000000000000000'
            }
          }

          const count = await tx.exam.count({ where: whereClause })
          result.exams.total = count

          if (count > 0) {
            await tx.exam.deleteMany({ where: whereClause })
            result.exams.deleted = count
          }
        } catch (e: unknown) {
          result.errors.push({
            type: 'exams',
            error: e instanceof Error ? e.message : 'Error desconocido',
          })
        }
      }

      // 3. Eliminar preguntas
      if (data.deleteQuestions) {
        try {
          const whereClause: Prisma.QuestionWhereInput = {}

          if (data.onlyTestData) {
            whereClause.OR = [
              { fuente: { contains: 'test',  } },
              { fuente: { contains: 'prueba',  } },
              { fuente: { contains: 'demo',  } },
              { fuente: { contains: 'ejemplo',  } },
              { enunciado: { contains: 'test',  } },
              { enunciado: { contains: 'prueba',  } },
            ]
          }

          if (data.subjectFilter) {
            const subject = await tx.subject.findUnique({
              where: { codigo: data.subjectFilter },
              select: { id: true },
            })
            if (subject) {
              whereClause.subjectId = subject.id
            } else {
              // Si la asignatura no existe, no hay preguntas que eliminar
              whereClause.id = '00000000000000000000000'
            }
          }

          const count = await tx.question.count({ where: whereClause })
          result.questions.total = count

          if (count > 0) {
            await tx.question.deleteMany({ where: whereClause })
            result.questions.deleted = count
          }
        } catch (e: unknown) {
          result.errors.push({
            type: 'questions',
            error: e instanceof Error ? e.message : 'Error desconocido',
          })
        }
      }

      // 4. Eliminar temas (topics)
      if (data.deleteTopics) {
        try {
          const whereClause: Prisma.TopicWhereInput = {}

          if (data.onlyTestData) {
            whereClause.OR = [
              { nombre: { contains: 'test',  } },
              { nombre: { contains: 'prueba',  } },
              { nombre: { contains: 'demo',  } },
              { ejeTematico: { contains: 'test',  } },
              { ejeTematico: { contains: 'prueba',  } },
            ]
          }

          if (data.subjectFilter) {
            const subject = await tx.subject.findUnique({
              where: { codigo: data.subjectFilter },
              select: { id: true },
            })
            if (subject) {
              whereClause.subjectId = subject.id
            } else {
              // Si la asignatura no existe, no hay preguntas que eliminar
              whereClause.id = '00000000000000000000000'
            }
          }

          const count = await tx.topic.count({ where: whereClause })
          result.topics.total = count

          if (count > 0) {
            await tx.topic.deleteMany({ where: whereClause })
            result.topics.deleted = count
          }
        } catch (e: unknown) {
          result.errors.push({
            type: 'topics',
            error: e instanceof Error ? e.message : 'Error desconocido',
          })
        }
      }

      // 5. Eliminar usuarios de prueba (último, por dependencias)
      if (data.deleteTestUsers) {
        try {
          const whereClause: Prisma.UserWhereInput = {}

          if (data.onlyTestData) {
            whereClause.OR = [
              { email: { contains: 'test',  } },
              { email: { contains: 'demo',  } },
              { email: { contains: 'prueba',  } },
              { email: { contains: 'example',  } },
              { email: { contains: 'ficticio',  } },
            ]
          }

          const count = await tx.user.count({ where: whereClause })
          result.users.total = count

          if (count > 0) {
            // Eliminar en cascada (las relaciones están configuradas)
            await tx.user.deleteMany({ where: whereClause })
            result.users.deleted = count
          }
        } catch (e: unknown) {
          result.errors.push({
            type: 'users',
            error: e instanceof Error ? e.message : 'Error desconocido',
          })
        }
      }
    })
  } catch (e: unknown) {
    result.errors.push({
      type: 'transaction',
      error: e instanceof Error ? e.message : 'Error en la transacción',
    })
  }

  return result
}

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        // Verificar autenticación
        const user = await getCurrentUser()
        if (!user) {
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Verificar que el usuario sea admin
        const userIsAdmin = await isAdmin()
        if (!userIsAdmin) {
          logger.warn(
            { userId: user.id, email: user.email },
            'Intento de limpiar datos de prueba sin permisos de admin'
          )
          return NextResponse.json(
            { error: 'No tienes permisos para esta operación. Se requieren permisos de administrador.' },
            { status: 403 }
          )
        }

        // Parsear y validar datos
        const body = await request.json()
        const validation = cleanupSchema.safeParse(body)

        if (!validation.success) {
          return NextResponse.json(
            {
              error: 'Datos inválidos',
              details: validation.error.issues,
            },
            { status: 400 }
          )
        }

        // Verificar que al menos una opción esté seleccionada
        if (
          !validation.data.deleteExams &&
          !validation.data.deleteTopics &&
          !validation.data.deleteQuestions &&
          !validation.data.deleteAttempts &&
          !validation.data.deleteTestUsers
        ) {
          return NextResponse.json(
            { error: 'Debe seleccionar al menos un tipo de dato para eliminar' },
            { status: 400 }
          )
        }

        // Ejecutar limpieza
        const result = await cleanupTestData(validation.data)

        // Construir mensaje de respuesta
        const totalDeleted =
          result.exams.deleted +
          result.topics.deleted +
          result.questions.deleted +
          result.attempts.deleted +
          result.users.deleted

        const message =
          totalDeleted > 0
            ? `Limpieza completada: ${totalDeleted} registro(s) eliminado(s)`
            : 'No se encontraron datos para eliminar con los criterios especificados'

        const details = [
          `Exámenes: ${result.exams.deleted} de ${result.exams.total} eliminados`,
          `Temas: ${result.topics.deleted} de ${result.topics.total} eliminados`,
          `Preguntas: ${result.questions.deleted} de ${result.questions.total} eliminadas`,
          `Intentos: ${result.attempts.deleted} de ${result.attempts.total} eliminados`,
          `Usuarios: ${result.users.deleted} de ${result.users.total} eliminados`,
        ].join('\n')

        return NextResponse.json({
          success: true,
          message,
          details:
            details +
            (result.errors.length > 0
              ? `\n\nErrores (${result.errors.length}):\n${result.errors.map(e => `- ${e.type}: ${e.error}`).join('\n')}`
              : ''),
          result,
        })
      } catch (e: unknown) {
        return NextResponse.json(
          {
            error: 'Error al limpiar datos',
            details: e instanceof Error ? e.message : 'Error desconocido',
          },
          { status: 500 }
        )
      }
    },
    'write'
  )
}
