/**
 * Endpoint canónico de ejemplo: Crear nota
 * 
 * Este endpoint demuestra el patrón de validación de contrato:
 * 1. Parse del input (FormData/JSON)
 * 2. Validación del contrato (Zod)
 * 3. Si falla → Error 400 (sin side effects)
 * 4. Si pasa → Lógica de dominio
 * 
 * ⛔ Invariante 5 cumplida: Validación antes de toda lógica
 */
import { NextRequest, NextResponse } from 'next/server'
import { parseFormData } from '@/lib/contracts/http/parseFormData'
import { parseJsonBody } from '@/lib/contracts/http/parseJsonBody'
import { validateRequest } from '@/lib/contracts/validateRequest'
import { CreateNoteSchema } from '@/lib/contracts/schemas/create-note.schema'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { withErrorHandler, NotFoundError, UnauthorizedError } from '@/lib/errors'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    // 1. Autenticación (antes del contrato, es contexto)
    const dbUser = await getAuthenticatedUserWithStudent()
    if (!dbUser?.email) {
      throw new UnauthorizedError('No autorizado')
    }

    if (!dbUser.student) {
      throw new NotFoundError('Estudiante')
    }

    // 2. Parse del input (según Content-Type)
    const contentType = request.headers.get('content-type') || ''
    let rawInput: unknown

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) { // guard:allow-secret
      const formData = await request.formData()
      rawInput = parseFormData(formData)
    } else {
      rawInput = await parseJsonBody(request)
    }

    // 3. Validación del contrato (⛔ ANTES de cualquier lógica)
    // ⛔ Si falla, ContractError se lanza y NO llega al dominio
    const input = validateRequest({
      schema: CreateNoteSchema,
      input: rawInput,
    })

    // ⛔ Desde aquí, input ES válido por contrato
    // ✅ Lógica segura (después de validación)

    const { questionId, topicId, title, content, tags } = input

    // Verificar que questionId o topicId existe si se proporciona
    if (questionId) {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      })
      if (!question) {
        throw new NotFoundError('Pregunta', questionId)
      }
    }

    if (topicId) {
      const topic = await prisma.topic.findUnique({
        where: { id: topicId },
      })
      if (!topic) {
        throw new NotFoundError('Tema', topicId)
      }
    }

    // Crear la nota
    const note = await prisma.studyNote.create({
      data: {
        studentId: dbUser.student.id,
        questionId: questionId || null,
        topicId: topicId || null,
        title,
        content,
        tags: tags || null,
      },
      include: {
        question: {
          include: {
            subject: {
              select: {
                nombre: true,
              },
            },
          },
        },
        topic: {
          include: {
            subject: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      {
        note,
      },
      { status: 201 }
    )
  }, { endpoint: 'notes/create', method: 'POST' })
}
