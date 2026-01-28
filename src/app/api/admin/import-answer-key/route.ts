import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { isAdmin } from '@/lib/check-admin'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import fs from 'fs/promises'
import path from 'path'
export const runtime = 'nodejs'

// Importación de pdf-parse v2
import { PDFParse } from 'pdf-parse'

// Schema de validación
const answerKeyImportSchema = z.object({
  pdfFile: z.custom<File>(val => val instanceof File), // File object from FormData
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

  // Validar que text sea un string válido
  const safeText = typeof text === 'string' ? text : ''
  if (!safeText) {
    return answerMap
  }

  // Buscar sección de respuestas ANTES de normalizar (para capturar correctamente)
  const answerSectionPatterns = [
    // Formato DEMRE: "CLAVES" seguido de tabla (sin dos puntos) - buscar en texto original
    // Capturar desde "CLAVES" hasta "En el clavijero" (texto exacto que aparece después de la tabla)
    /CLAVES[\s\S]*?(?=En el clavijero)/i,
    // Formato estándar con dos puntos
    /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /CLAVE[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
  ]

  let answerSection = ''
  // Buscar en texto original (sin normalizar)
  if (typeof safeText === 'string' && safeText.length > 0) {
    for (const pattern of answerSectionPatterns) {
      try {
        const match = safeText.match(pattern)
        if (match) {
          // Si el patrón tiene grupo de captura (match[1]), usarlo
          // Si no (como "CLAVES" sin grupo), usar el match completo
          if (Array.isArray(match) && match.length > 1 && match[1] && typeof match[1] === 'string') {
            answerSection = match[1]
          } else if (typeof match[0] === 'string') {
            // Para patrones sin grupo de captura, usar el match completo
            answerSection = match[0]
          }
          if (answerSection) {
            break
          }
        }
      } catch {
        // Continuar con el siguiente patrón
      }
    }
  }

  // Normalizar el texto (después de encontrar la sección)
  let normalizedText = ''
  try {
    normalizedText = answerSection 
      ? answerSection.replace(/\r\n/g, '\n').replace(/\r/g, '\n').toUpperCase()
      : safeText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').toUpperCase()
    if (typeof normalizedText !== 'string') {
      normalizedText = (answerSection || safeText).toUpperCase() // Fallback
    }
  } catch {
    normalizedText = (answerSection || safeText).toUpperCase() // Fallback
  }

  // Si no se encuentra una sección específica, buscar en el último 30% del texto
  // (las respuestas suelen estar al final del documento)
  if (!answerSection && typeof normalizedText === 'string' && normalizedText.length > 0) {
    const textLength = typeof normalizedText === 'string' && Number.isFinite(normalizedText.length) ? normalizedText.length : 0
    if (textLength > 0) {
      const floorResult = Math.floor(textLength * 0.7)
      if (Number.isFinite(floorResult) && floorResult >= 0 && floorResult <= textLength) {
        try {
          const lastSection = normalizedText.substring(floorResult)
          if (typeof lastSection === 'string') {
            answerSection = lastSection
          }
        } catch {
          answerSection = normalizedText // Fallback
        }
      } else {
        answerSection = normalizedText // Fallback
      }
    } else {
      answerSection = normalizedText // Fallback
    }
  }

  // Si aún no hay sección, usar todo el texto (último recurso)
  if (!answerSection || answerSection.length === 0) {
    answerSection = normalizedText
  }

  // Múltiples patrones para detectar respuestas (ordenados por especificidad)
  // IMPORTANTE: Patrones más específicos primero para evitar falsos positivos
  const answerPatterns = [
    // Formato de tabla DEMRE: "Nº	Clave" con tabs/espacios múltiples (ej: "1 	B" o "1\tB")
    // Este formato es muy común en clavijeros oficiales de DEMRE
    /^(\d+)[*\s\t]+\b([A-E])\b/gm, // Línea completa: número, espacios/tabs, letra (puede tener asterisco)
    /(\d+)[*\s\t]{2,}([A-E])\b/g, // Múltiples espacios/tabs entre número y letra
    // Formato invertido: "A1", "B2" (letra-número) - debe ir primero para evitar conflictos
    /^([A-E])(\d+)$/gm, // Solo si está en su propia línea
    /([A-E])(\d+)(?=\s|$|,|\.)/g, // Con delimitadores claros
    // Formato: "1. A", "1) A", "1.A" (muy específico)
    /(\d+)[.)]\s*([A-E])(?=\s|$|,|\.)/g,
    // Formato: "1: A", "2: B" (dos puntos)
    /(\d+):\s*([A-E])(?=\s|$|,|\.)/g,
    // Formato: "P1: A", "Pregunta 1: A"
    /(?:P|PREGUNTA|PREG)\s*(\d+)[:\s]+([A-E])/gi,
    // Formato en lista: "1) A", "2) B" (inicio de línea)
    /^(\d+)\)\s*([A-E])/gm,
    // Formato: "1) A", "2) B" (sin inicio de línea, más flexible)
    /(\d+)\)\s*([A-E])(?=\s|$|,|\.)/g,
    // Formato: "1-A", "1-A,", "1-A ", "1 - A", "1-A."
    /(\d+)[\s-]+([A-E])(?=\s|$|,|\.)/g,
    // Formato: "1 A" (con espacio), "1  A" (múltiples espacios) - menos específico, al final
    /(\d+)\s+([A-E])(?=\s|$|,|\.)/g,
  ]

  // Usar answerSection original (no normalizado) para los patrones
  // Los patrones funcionan mejor con el texto original que tiene tabs/espacios reales
  const sectionToSearch = answerSection || safeText
  
  if (typeof sectionToSearch === 'string' && sectionToSearch.length > 0) {
    for (const pattern of answerPatterns) {
      try {
        const matches = Array.from(sectionToSearch.matchAll(pattern))
        if (!Array.isArray(matches)) {
          continue
        }
        for (const match of matches) {
          if (!match || !Array.isArray(match) || match.length < 3 || !match[1] || !match[2]) {
            continue // Saltar matches inválidos
          }
          
          let questionNum: number
          let answerLetter: string

          // Manejar patrón especial: "A1", "B2" (letra-número) vs "1-A", "2-B" (número-letra)
          const match1 = typeof match[1] === 'string' ? match[1] : String(match[1])
          const match2 = typeof match[2] === 'string' ? match[2] : String(match[2])
          
          // Detectar si es formato invertido (letra-número)
          const isLetterNumberFormat = /^[A-E]$/i.test(match1) && /^\d+$/.test(match2)
          
          if (isLetterNumberFormat) {
            // Formato: "A1", "B2" → letra es match1, número es match2
            answerLetter = match1.toUpperCase()
            const safeMatch2 = typeof match2 === 'string' && match2.length > 0 ? match2 : ''
            if (!safeMatch2) {
              continue
            }
            questionNum = parseInt(safeMatch2, 10)
          } else {
            // Formato normal: "1-A", "2-B" → número es match1, letra es match2
            const safeMatch1 = typeof match1 === 'string' && match1.length > 0 ? match1 : ''
            if (!safeMatch1) {
              continue // Saltar si match1 es inválido o vacío
            }
            questionNum = parseInt(safeMatch1, 10)
            try {
              answerLetter = match2.toUpperCase()
              if (typeof answerLetter !== 'string') {
                answerLetter = match2 // Fallback
              }
            } catch {
              answerLetter = match2 // Fallback
            }
          }

          // Validar número de pregunta
          if (isNaN(questionNum) || questionNum <= 0 || !Number.isFinite(questionNum)) {
            continue // Saltar números inválidos
          }

          // Validar que la letra esté en el rango A-E
          // Aumentar límite a 150 para exámenes más largos
          if (questionNum <= 150 && typeof answerLetter === 'string' && /^[A-E]$/.test(answerLetter)) {
            // Si ya existe una respuesta para esta pregunta, mantener la primera encontrada
            if (!answerMap.has(questionNum)) {
              answerMap.set(questionNum, answerLetter)
            }
          }
        }
      } catch {
        // Continuar con el siguiente patrón
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

    // Validar que exam existe
    if (!exam) {
      throw new Error('No se encontró el examen')
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

    // Log mínimo: solo si hay problemas críticos (evitar saturar logs que causan desconexiones)
    if (correctAnswers.size === 0) {
      logger.warn(
        {
          totalDetected: correctAnswers.size,
          examQuestionsCount: exam.questions.length,
        },
        'No se detectaron respuestas en el clavijero'
      )
    }

    // Log del texto extraído para debugging (solo si no se detectaron respuestas)
    if (correctAnswers.size === 0) {
      const textPreview = typeof text === 'string' && text.length > 0 
        ? text.substring(Math.max(0, text.length - 1000)) // Últimos 1000 caracteres
        : ''
      
      logger.warn(
        {
          textLength: typeof text === 'string' ? text.length : 0,
          textPreview: textPreview.substring(0, 500), // Primeros 500 chars del preview
        },
        'No se detectaron respuestas en el PDF del clavijero'
      )

      throw new Error(
        'No se pudieron detectar respuestas correctas en el PDF del clavijero. ' +
          'Verifica que el formato sea correcto (ej: "1-A", "2-B", "1. A", etc.). ' +
          'El PDF debe contener una sección con las respuestas correctas al final del documento.'
      )
    }

    // Validar que se detectaron suficientes respuestas
    if (!exam || !exam.questions) {
      throw new Error('El examen no tiene preguntas asociadas')
    }
    const totalQuestions = exam.questions.length
    const detectedAnswers = correctAnswers.size
    const coverage = (detectedAnswers / totalQuestions) * 100

    // Log mínimo para evitar desconexiones (solo si hay problemas)
    if (coverage < 50) {
      logger.warn(
        {
          detectedAnswers,
          totalQuestions,
          coverage: coverage.toFixed(1),
        },
        'Cobertura baja en clavijero'
      )
    }

    // Advertir si la cobertura es muy baja (menos del 50%)
    // Log mínimo para evitar desconexiones
    if (coverage < 50) {
      logger.warn(
        {
          detectedAnswers,
          totalQuestions,
          coverage: coverage.toFixed(1),
        },
        'Cobertura baja: posible discrepancia entre examen y clavijero'
      )
    }

    // Actualizar las opciones correctas en las preguntas
    let updatedCount = 0
    let notFoundCount = 0

    if (!exam || !exam.questions) {
      throw new Error('El examen no tiene preguntas asociadas')
    }

    // Timeout aumentado a 60s para exámenes grandes (puede tener 50+ preguntas con múltiples opciones cada una)
    await prisma.$transaction(
      async tx => {
        for (let i = 0; i < exam.questions.length; i++) {
          const examQuestion = exam.questions[i]
          // Usar el campo 'orden' que refleja el número original de la pregunta en el examen
          // Si no está disponible, usar i + 1 como fallback
          const questionNumber = examQuestion.orden || (i + 1)
          const correctAnswerLetter = correctAnswers.get(questionNumber)

          if (!correctAnswerLetter) {
            // Sin logging detallado para evitar desconexiones
            notFoundCount++
            continue
          }

          const question = examQuestion.question

          // Buscar la opción correcta por letra
          const correctOption = question.options.find(
            opt => opt.letra.toUpperCase() === correctAnswerLetter
          )

          if (!correctOption) {
            // Sin logging detallado para evitar desconexiones
            notFoundCount++
            continue
          }

          // Validar que la pregunta tenga opciones
          if (!question.options || question.options.length === 0) {
            // Sin logging detallado para evitar desconexiones
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
      },
      {
        timeout: 60000, // 60 segundos (suficiente para exámenes grandes)
      }
    )

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

        // Verificar que el usuario sea admin
        const userIsAdmin = await isAdmin()
        if (!userIsAdmin) {
          logger.warn(
            { userId: user.id, email: user.email },
            'Intento de importar clavijero sin permisos de admin'
          )
          return NextResponse.json(
            { error: 'No tienes permisos para importar clavijeros. Se requieren permisos de administrador.' },
            { status: 403 }
          )
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

        // Mensaje más detallado cuando hay muchas preguntas sin respuesta
        let detailsMessage = 
          `Examen: ${result.examTitle}\n` +
          `Total de preguntas en el examen: ${result.totalQuestions}\n` +
          `Respuestas detectadas en PDF: ${result.answersDetected}\n` +
          `Respuestas actualizadas: ${result.answersUpdated}\n`
        
        if (result.answersNotFound > 0) {
          detailsMessage += `\n⚠️ No se encontraron respuestas para ${result.answersNotFound} pregunta(s)\n\n`
          
          // Si hay mucha discrepancia, explicar posibles causas
          if (result.answersNotFound > result.totalQuestions * 0.5) {
            detailsMessage += `Posibles causas:\n`
            detailsMessage += `- El examen importado tiene menos preguntas que el clavijero\n`
            detailsMessage += `- El clavijero contiene ítems piloto (marcados con *) que no están en el examen\n`
            detailsMessage += `- El examen solo tiene las preguntas publicadas (no todas las operativas)\n`
            detailsMessage += `- Hay discrepancia en la numeración entre examen y clavijero\n\n`
            detailsMessage += `Sugerencia: Verifica que el examen importado corresponda al mismo instrumento que el clavijero.`
          }
        }

        return NextResponse.json({
          success: true,
          message: `Clavijero importado exitosamente: ${result.answersUpdated} respuestas actualizadas`,
          details: detailsMessage,
          examId: result.examId,
        })
      } catch (error) {
        // Determinar status code apropiado según el tipo de error
        let statusCode = 500
        let errorMessage = 'Error al importar clavijero'

        // Log mínimo del error (sin stack trace completo para evitar desconexiones)
        const errorMessageForLog = error instanceof Error ? error.message : String(error)
        logger.error(
          {
            error: errorMessageForLog,
          },
          'Error al importar clavijero'
        )

        if (error instanceof Error) {
          // Errores de validación o recursos no encontrados → 400/404
          if (
            error.message.includes('no existe') ||
            error.message.includes('no encontrado') ||
            error.message.includes('no se encontró') ||
            error.message.includes('No se encontró')
          ) {
            statusCode = 404
            errorMessage = error.message
          } else if (
            error.message.includes('inválido') ||
            error.message.includes('Debe proporcionar') ||
            error.message.includes('debe ser') ||
            error.message.includes('No se pudieron detectar respuestas') ||
            error.message.includes('formato sea correcto')
          ) {
            statusCode = 400 // Bad Request - error de formato/validación
            errorMessage = error.message
          } else if (error.message.includes('timeout') || error.message.includes('expired')) {
            statusCode = 504 // Gateway Timeout
            errorMessage = 'La operación tardó demasiado. Intenta con un examen más pequeño o contacta al administrador.'
          } else {
            errorMessage = error.message
          }
        }

        return NextResponse.json(
          {
            error: errorMessage,
            details: error instanceof Error ? error.message : 'Error desconocido',
          },
          { status: statusCode }
        )
      }
    },
    'write'
  )
}
