import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'
export const runtime = 'nodejs'

// Importación de pdf-parse v2
const { PDFParse } = require('pdf-parse')

// Schema de validación
const answerKeyImportSchema = z.object({
  pdfFile: z.any(), // File object from FormData
  subjectName: z.string().min(1),
  year: z.string().min(1),
  examId: z.string().optional(), // Opcional: si se proporciona, se usa directamente
})

// Mapeo de asignaturas
const SUBJECT_MAPPING: Record<string, string> = {
  'Competencia Lectora': 'LECTORA',
  'Matemática M1': 'M1',
  'Matemática M2': 'M2',
  'Ciencias - Biología': 'BIO',
  'Ciencias - Física': 'FIS',
  'Ciencias - Química': 'QUI',
  'Historia y Ciencias Sociales': 'HIST',
}

// Directorios
const PDFS_DIR = path.join(process.cwd(), 'data', 'pdfs')

async function ensureDirectories() {
  await fs.mkdir(PDFS_DIR, { recursive: true })
}

async function extractTextFromPDF(pdfPath: string): Promise<string> {
  let dataBuffer: Buffer

  try {
    dataBuffer = await fs.readFile(pdfPath)
  } catch (error) {
    throw new Error(
      `Error al leer el archivo PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`
    )
  }

  // Validar que el archivo no esté vacío
  if (dataBuffer.length === 0) {
    throw new Error('El archivo PDF está vacío')
  }

  // Validar que el archivo comience con el header PDF (mínima validación)
  const pdfHeader = dataBuffer.subarray(0, 4).toString()
  if (pdfHeader !== '%PDF') {
    throw new Error('El archivo no parece ser un PDF válido (no contiene el header PDF)')
  }

  try {
    const parser = new PDFParse({ data: dataBuffer })
    await parser.load()
    const result = await parser.getText()

    // Validar que se extrajo texto
    if (!result || !result.text || result.text.trim().length === 0) {
      throw new Error('El PDF no contiene texto extraíble. Puede ser un PDF escaneado o protegido.')
    }

    return result.text
  } catch (error) {
    if (error instanceof Error && error.message.includes('no contiene texto')) {
      throw error
    }
    throw new Error(
      `Error al parsear PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`
    )
  }
}

/**
 * Detecta las respuestas correctas desde el texto del PDF del clavijero
 * Busca patrones comunes como "1-A", "1. A", "Respuestas: 1-A, 2-B..."
 * @param text Texto completo del PDF
 * @returns Mapa de número de pregunta -> letra de respuesta correcta
 */
function detectCorrectAnswers(text: string): Map<number, string> {
  const answerMap = new Map<number, string>()

  // Normalizar el texto
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').toUpperCase()

  // Buscar sección de respuestas (típicamente al final del documento)
  const answerSectionPatterns = [
    /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /CLAVE[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
  ]

  let answerSection = ''
  for (const pattern of answerSectionPatterns) {
    const match = normalizedText.match(pattern)
    if (match && match[1]) {
      answerSection = match[1]
      break
    }
  }

  // Si no se encuentra una sección específica, buscar en el último 30% del texto
  if (!answerSection) {
    const textLength = normalizedText.length
    const lastSection = normalizedText.substring(Math.floor(textLength * 0.7))
    answerSection = lastSection
  }

  // Múltiples patrones para detectar respuestas
  const answerPatterns = [
    // Formato: "1-A", "1-A,", "1-A ", "1 - A"
    /(\d+)[\s\-\.\)]+([A-E])/g,
    // Formato: "1. A", "1) A"
    /(\d+)[\.\)]\s*([A-E])/g,
    // Formato: "1 A" (con espacio)
    /(\d+)\s+([A-E])(?=\s|,|$)/g,
    // Formato en lista: "1) A", "2) B"
    /^(\d+)\)\s*([A-E])/gm,
  ]

  for (const pattern of answerPatterns) {
    const matches = Array.from(answerSection.matchAll(pattern))
    for (const match of matches) {
      const questionNum = parseInt(match[1], 10)
      const answerLetter = match[2].toUpperCase()

      // Validar que la letra esté en el rango A-E
      // Aumentar límite a 150 para exámenes más largos
      if (questionNum > 0 && questionNum <= 150 && /^[A-E]$/.test(answerLetter)) {
        // Si ya existe una respuesta para esta pregunta, mantener la primera encontrada
        if (!answerMap.has(questionNum)) {
          answerMap.set(questionNum, answerLetter)
        }
      }
    }
  }

  return answerMap
}

async function importAnswerKey(data: z.infer<typeof answerKeyImportSchema>) {
  const { pdfFile, subjectName, year, examId } = data
  let pdfPath: string | null = null

  try {
    // Obtener código de asignatura
    const subjectCode = SUBJECT_MAPPING[subjectName]
    if (!subjectCode) {
      throw new Error(`Asignatura no encontrada: ${subjectName}`)
    }

    // Obtener asignatura de la BD
    const subject = await prisma.subject.findUnique({
      where: { codigo: subjectCode },
    })

    if (!subject) {
      throw new Error(`Asignatura ${subjectCode} no existe en la base de datos`)
    }

    // Buscar el examen correspondiente
    let exam
    if (examId) {
      // Si se proporciona examId, usarlo directamente
      exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
          questions: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
            orderBy: {
              orden: 'asc',
            },
          },
        },
      })

      if (!exam) {
        throw new Error(`Examen con ID ${examId} no encontrado`)
      }

      if (exam.subjectId !== subject.id) {
        throw new Error(`El examen no corresponde a la asignatura ${subjectName}`)
      }
    } else {
      // Buscar automáticamente por año y asignatura
      // Buscar en fuente (formato: "DEMRE 2026") y también en título/descripción
      const exams = await prisma.exam.findMany({
        where: {
          subjectId: subject.id,
          OR: [
            { fuente: { contains: year } },
            { titulo: { contains: year } },
            { descripcion: { contains: year } },
          ],
        },
        include: {
          questions: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
            orderBy: {
              orden: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (exams.length === 0) {
        throw new Error(
          `No se encontró ningún examen de ${subjectName} del año ${year}. ` +
            `Por favor, importa el examen primero o selecciona el examen manualmente.`
        )
      }

      if (exams.length > 1) {
        throw new Error(
          `Se encontraron múltiples exámenes de ${subjectName} del año ${year}. ` +
            `Por favor, especifica el ID del examen o importa el clavijero desde la página de importación.`
        )
      }

      exam = exams[0]
    }

    // Validar que el examen tenga preguntas
    if (!exam.questions || exam.questions.length === 0) {
      throw new Error('El examen no tiene preguntas asociadas')
    }

    // Guardar PDF del clavijero
    await ensureDirectories()
    const pdfFileName = `answer_key_${subjectCode}_${year}_${Date.now()}.pdf`
    pdfPath = path.join(PDFS_DIR, pdfFileName)

    // Validar tipo de archivo (MIME type puede ser falsificado, pero es primera línea de defensa)
    if (pdfFile.type && pdfFile.type !== 'application/pdf') {
      throw new Error('El archivo debe ser un PDF válido (tipo MIME: application/pdf)')
    }

    // Validar extensión
    const fileName = pdfFile.name.toLowerCase()
    if (!fileName.endsWith('.pdf')) {
      throw new Error('El archivo debe tener extensión .pdf')
    }

    // Validar tamaño (máximo 50 MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
    if (pdfFile.size > MAX_FILE_SIZE) {
      throw new Error(
        `El archivo es demasiado grande. Tamaño máximo: ${MAX_FILE_SIZE / 1024 / 1024} MB. Tamaño actual: ${(pdfFile.size / 1024 / 1024).toFixed(2)} MB`
      )
    }

    // Validar tamaño mínimo (un PDF válido debe tener al menos algunos bytes)
    const MIN_FILE_SIZE = 100 // 100 bytes mínimo
    if (pdfFile.size < MIN_FILE_SIZE) {
      throw new Error('El archivo es demasiado pequeño para ser un PDF válido')
    }

    // Guardar archivo
    const arrayBuffer = await pdfFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.writeFile(pdfPath, buffer)

    // Extraer texto del PDF
    const text = await extractTextFromPDF(pdfPath)

    // Detectar respuestas correctas
    const correctAnswers = detectCorrectAnswers(text)

    if (correctAnswers.size === 0) {
      throw new Error(
        'No se pudieron detectar respuestas correctas en el PDF del clavijero. ' +
          'Verifica que el formato sea correcto (ej: "1-A", "2-B", etc.)'
      )
    }

    // Validar que se detectaron suficientes respuestas
    const totalQuestions = exam.questions.length
    const detectedAnswers = correctAnswers.size
    const coverage = (detectedAnswers / totalQuestions) * 100

    const { logger } = await import('@/lib/logger')
    logger.info(
      {
        detectedAnswers,
        totalQuestions,
        coverage: coverage.toFixed(1),
      },
      'Respuestas detectadas en clavijero'
    )

    // Advertir si la cobertura es muy baja (menos del 50%)
    if (coverage < 50) {
      logger.warn(
        {
          detectedAnswers,
          totalQuestions,
        },
        'Clavijero podría estar incompleto'
      )
      // No lanzar error, pero advertir - puede que el clavijero tenga menos preguntas
    }

    // Actualizar las opciones correctas en las preguntas
    let updatedCount = 0
    let notFoundCount = 0

    await prisma.$transaction(async tx => {
      for (let i = 0; i < exam.questions.length; i++) {
        const examQuestion = exam.questions[i]
        const questionNumber = i + 1 // Número de pregunta (1-indexed)
        const correctAnswerLetter = correctAnswers.get(questionNumber)

        if (!correctAnswerLetter) {
          notFoundCount++
          continue
        }

        const question = examQuestion.question

        // Buscar la opción correcta por letra
        const correctOption = question.options.find(
          opt => opt.letra.toUpperCase() === correctAnswerLetter
        )

        if (!correctOption) {
          logger.warn(
            {
              correctAnswerLetter,
              questionNumber,
            },
            'No se encontró opción con letra en pregunta'
          )
          notFoundCount++
          continue
        }

        // Validar que la pregunta tenga opciones
        if (!question.options || question.options.length === 0) {
          logger.warn({ questionNumber }, 'Pregunta no tiene opciones')
          notFoundCount++
          continue
        }

        // Actualizar todas las opciones: marcar la correcta y desmarcar las demás
        // Solo actualizar si hay cambios para optimizar
        const needsUpdate = question.options.some(
          opt =>
            (opt.id === correctOption.id && !opt.esCorrecta) ||
            (opt.id !== correctOption.id && opt.esCorrecta)
        )

        if (needsUpdate) {
          // Actualizar todas las opciones en paralelo
          await Promise.all(
            question.options.map(async option => {
              await tx.questionOption.update({
                where: { id: option.id },
                data: {
                  esCorrecta: option.id === correctOption.id,
                },
              })
            })
          )
          updatedCount++
        } else {
          // Si no necesita actualización pero la respuesta es correcta, contar como actualizada
          // (ya estaba marcada correctamente)
          updatedCount++
        }
      }
    })

    // Limpiar PDF después de procesar
    if (pdfPath) {
      await fs.unlink(pdfPath).catch(() => {
        // Ignorar errores al eliminar
      })
    }

    return {
      examId: exam.id,
      examTitle: exam.titulo,
      totalQuestions: exam.questions.length,
      answersDetected: correctAnswers.size,
      answersUpdated: updatedCount,
      answersNotFound: notFoundCount,
    }
  } catch (error) {
    // Limpiar PDF en caso de error
    if (pdfPath) {
      await fs.unlink(pdfPath).catch(() => {
        // Ignorar errores al eliminar
      })
    }
    throw error
  }
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

        // Manejar FormData
        const formData = await request.formData()

        const pdfFile = formData.get('pdfFile') as File | null
        const subjectName = formData.get('subjectName') as string | null
        const year = formData.get('year') as string | null
        const examId = formData.get('examId') as string | null

        if (!pdfFile) {
          return NextResponse.json({ error: 'Debe proporcionar un archivo PDF' }, { status: 400 })
        }

        if (!subjectName) {
          return NextResponse.json({ error: 'Debe proporcionar la asignatura' }, { status: 400 })
        }

        if (!year) {
          return NextResponse.json({ error: 'Debe proporcionar el año' }, { status: 400 })
        }

        // Validar con Zod
        const validation = answerKeyImportSchema.safeParse({
          pdfFile,
          subjectName,
          year,
          examId: examId || undefined,
        })

        if (!validation.success) {
          return NextResponse.json(
            {
              error: 'Datos inválidos',
              details: validation.error.issues,
            },
            { status: 400 }
          )
        }

        // Importar clavijero
        const result = await importAnswerKey(validation.data)

        return NextResponse.json({
          success: true,
          message: `Clavijero importado exitosamente: ${result.answersUpdated} respuestas actualizadas`,
          details:
            `Examen: ${result.examTitle}\n` +
            `Total de preguntas: ${result.totalQuestions}\n` +
            `Respuestas detectadas en PDF: ${result.answersDetected}\n` +
            `Respuestas actualizadas: ${result.answersUpdated}\n` +
            (result.answersNotFound > 0
              ? `⚠️ No se encontraron respuestas para ${result.answersNotFound} pregunta(s)`
              : ''),
          examId: result.examId,
        })
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Error al importar clavijero',
            details: error instanceof Error ? error.message : 'Error desconocido',
          },
          { status: 500 }
        )
      }
    },
    'write'
  )
}
