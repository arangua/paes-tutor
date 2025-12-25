import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { validateBody } from '@/lib/api-helpers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import axios from 'axios'
export const runtime = 'nodejs'

// Importación de pdf-parse v2
// La versión 2 usa una clase PDFParse en lugar de una función directa
const { PDFParse } = require('pdf-parse')

// Schema de validación
const examImportSchema = z
  .object({
    pdfUrl: z.string().url().optional(),
    pdfFile: z.custom<File>(val => val instanceof File).optional(), // File object from FormData
    inputType: z.enum(['url', 'file']),
    subjectName: z.string().min(1),
    examTitle: z.string().min(1),
    examType: z.string(),
    year: z.string(),
  })
  .refine(
    data => {
      // Debe tener URL o archivo según el tipo
      if (data.inputType === 'url') {
        return !!data.pdfUrl
      } else {
        return !!data.pdfFile
      }
    },
    {
      message: 'Debe proporcionar URL o archivo según el tipo seleccionado',
    }
  )

const importExamsSchema = z.object({
  exams: z.array(examImportSchema).min(1),
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

/**
 * Descarga un archivo desde una URL usando método tolerante con headers mal formateados
 * El servidor de DEMRE envía headers HTTP mal formateados, así que usamos módulos nativos
 * con manejo de errores que permite continuar incluso con errores de parsing
 */
async function downloadFile(url: string, dest: string): Promise<void> {
  // Usar directamente el método alternativo que es más tolerante
  // ya que sabemos que DEMRE tiene problemas con headers
  return downloadFileAlternative(url, dest)
}

/**
 * Método alternativo usando módulos nativos con manejo de errores mejorado
 * Intenta leer los datos incluso si hay errores de parsing de headers
 * Usa un enfoque más permisivo que ignora errores de parsing si hay datos
 */
function downloadFileAlternative(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const protocol = urlObj.protocol === 'https:' ? https : http
    const file = fsSync.createWriteStream(dest)

    let dataReceived = false
    let hasError = false
    let responseStarted = false

    const options: https.RequestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port ? parseInt(urlObj.port, 10) : urlObj.protocol === 'https:' ? 443 : 80,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 30000,
      rejectUnauthorized: process.env.NODE_ENV === 'production', // Solo deshabilitar en desarrollo
    }

    const req = protocol.request(options)

    // Capturar errores de parsing pero intentar continuar
    req.on('response', (response: http.IncomingMessage) => {
      responseStarted = true

      // Manejar redirecciones
      if (response.statusCode === 301 || response.statusCode === 302) {
        const location = response.headers.location
        if (location) {
          const redirectUrl = location.startsWith('http')
            ? location
            : new URL(location, url).toString()
          file.close()
          try {
            fsSync.unlinkSync(dest)
          } catch {
            // Ignorar errores al eliminar
          }
          return downloadFileAlternative(redirectUrl, dest).then(resolve).catch(reject)
        }
      }

      if (response.statusCode !== 200) {
        file.close()
        try {
          fsSync.unlinkSync(dest)
        } catch {
          // Ignorar errores al eliminar
        }
        reject(new Error(`Error descargando: ${response.statusCode}`))
        return
      }

      // Pipe normal
      response.pipe(file)
      dataReceived = true

      file.on('finish', () => {
        file.close()
        resolve()
      })

      file.on('error', err => {
        hasError = true
        try {
          fsSync.unlinkSync(dest)
        } catch {
          // Ignorar errores al eliminar
        }
        reject(err)
      })

      response.on('end', () => {
        if (!hasError) {
          file.close()
          resolve()
        }
      })

      response.on('data', () => {
        dataReceived = true
      })
    })

    // Manejar errores - si es error de parsing pero hay datos, verificar archivo
    req.on('error', (err: Error) => {
      // Si es error de parsing, esperar un momento y verificar si se recibieron datos
      if (err.message.includes('Parse Error') || err.message.includes('CR after header')) {
        setTimeout(() => {
          try {
            const stats = fsSync.statSync(dest)
            if (stats.size > 1000) {
              // Si tiene más de 1KB, probablemente está bien
              file.close()
              resolve()
            } else if (responseStarted && dataReceived) {
              // Si la respuesta había empezado y recibimos datos, considerar exitoso
              file.close()
              resolve()
            } else {
              file.close()
              try {
                fsSync.unlinkSync(dest)
              } catch {
                // Ignorar errores al eliminar
              }
              // Intentar con curl si está disponible, o rechazar
              reject(
                new Error(
                  `Error al descargar PDF: El servidor de DEMRE tiene headers mal formateados. Intenta descargar el PDF manualmente y subirlo.`
                )
              )
            }
          } catch {
            file.close()
            try {
              fsSync.unlinkSync(dest)
            } catch {
              // Ignorar errores al eliminar
            }
            reject(
              new Error(
                `Error al descargar PDF: ${err.message}. Intenta descargar el PDF manualmente desde ${url}`
              )
            )
          }
        }, 1000) // Esperar 1 segundo para que los datos se escriban
      } else {
        hasError = true
        file.close()
        try {
          fsSync.unlinkSync(dest)
        } catch {
          // Ignorar errores al eliminar
        }
        reject(err)
      }
    })

    req.on('timeout', () => {
      req.destroy()
      hasError = true
      file.close()
      try {
        fsSync.unlinkSync(dest)
      } catch {
        // Ignorar errores al eliminar
      }
      reject(new Error('La descarga tardó demasiado'))
    })

    req.end()
  })
}

async function extractTextFromPDF(pdfPath: string): Promise<string> {
  const dataBuffer = await fs.readFile(pdfPath)

  try {
    // pdf-parse v2: usar la clase PDFParse
    const parser = new PDFParse({ data: dataBuffer })
    await parser.load()
    const result = await parser.getText()
    return result.text
  } catch (error) {
    throw new Error(
      `Error al parsear PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`
    )
  }
}

/**
 * Detecta las respuestas correctas desde el texto del PDF
 * Busca patrones comunes como "1-A", "1. A", "Respuestas: 1-A, 2-B..."
 * @param text Texto completo del PDF
 * @returns Mapa de número de pregunta -> letra de respuesta correcta
 */
function detectCorrectAnswers(text: string): Map<number, string> {
  const answerMap = new Map<number, string>()

  // Normalizar el texto
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').toUpperCase()

  // Buscar sección de respuestas (típicamente al final del documento)
  // Patrones comunes: "RESPUESTAS", "CLAVE DE RESPUESTAS", "RESPUESTAS CORRECTAS"
  const answerSectionPatterns = [
    /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
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
  // (las respuestas suelen estar al final)
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
      if (questionNum > 0 && questionNum <= 100 && /^[A-E]$/.test(answerLetter)) {
        // Si ya existe una respuesta para esta pregunta, mantener la primera encontrada
        if (!answerMap.has(questionNum)) {
          answerMap.set(questionNum, answerLetter)
        }
      }
    }
  }

  return answerMap
}

function parseQuestionsFromText(text: string): Array<{
  enunciado: string
  options: Array<{ letra: string; texto: string; esCorrecta: boolean }>
  dificultad: number
  explicacion: string
  fuente: string
}> {
  const questions: Array<{
    enunciado: string
    options: Array<{ letra: string; texto: string; esCorrecta: boolean }>
    dificultad: number
    explicacion: string
    fuente: string
  }> = []

  // Normalizar el texto: eliminar espacios múltiples y normalizar saltos de línea
  const normalizedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')

  // Múltiples patrones para encontrar preguntas (diferentes formatos posibles)
  const questionPatterns = [
    // Formato estándar: "1. Pregunta..." (más flexible con espacios)
    /(\d+)\.\s*([\s\S]+?)(?=\d+\.\s|$)/g,
    // Formato con paréntesis: "(1) Pregunta..."
    /\((\d+)\)\s*([\s\S]+?)(?=\(\d+\)\s|$)/g,
    // Formato sin punto: "1 Pregunta..." (con salto de línea opcional)
    /^(\d+)\s+([\s\S]+?)(?=^\d+\s|$)/gm,
    // Formato con guion: "1- Pregunta..."
    /(\d+)-\s+([\s\S]+?)(?=\d+-\s|$)/g,
    // Formato con dos puntos: "1: Pregunta..."
    /(\d+):\s+([\s\S]+?)(?=\d+:\s|$)/g,
  ]

  let allMatches: Array<{ number: string; text: string }> = []

  for (const pattern of questionPatterns) {
    const matches = Array.from(normalizedText.matchAll(pattern))
    for (const match of matches) {
      const questionNumber = match[1]
      const questionText = match[2] || match[3] || ''
      if (questionText.trim().length > 20) {
        // Filtrar textos muy cortos
        allMatches.push({ number: questionNumber, text: questionText.trim() })
      }
    }
  }

  // Eliminar duplicados (mismo número de pregunta)
  const uniqueMatches = Array.from(new Map(allMatches.map(m => [m.number, m])).values())

  // NOTA: Las respuestas correctas NO se detectan automáticamente al importar
  // El examen se importa sin respuestas correctas para que sean marcadas manualmente después
  // const correctAnswers = detectCorrectAnswers(text) // Deshabilitado intencionalmente

  // Múltiples patrones para encontrar opciones (diferentes formatos)
  const optionPatterns = [
    // Formato estándar: "A) Opción..." (más flexible)
    /([A-E])\)\s*([\s\S]+?)(?=[A-E]\)|$)/g,
    // Formato con punto: "A. Opción..."
    /([A-E])\.\s*([\s\S]+?)(?=[A-E]\.|$)/g,
    // Formato con guion: "A- Opción..."
    /([A-E])-\s*([\s\S]+?)(?=[A-E]-|$)/g,
    // Formato con dos puntos: "A: Opción..."
    /([A-E]):\s*([\s\S]+?)(?=[A-E]:|$)/g,
    // Formato con espacio: "A Opción..." (menos común, más estricto)
    /([A-E])\s+([A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?=[A-E]\s|$)/g,
  ]

  for (const match of uniqueMatches) {
    const questionText = match.text

    // Intentar cada patrón de opciones
    let optionMatches: Array<{ letra: string; texto: string }> = []

    for (const optionPattern of optionPatterns) {
      const matches = Array.from(questionText.matchAll(optionPattern))
      if (matches.length >= 4) {
        optionMatches = matches.map(opt => ({
          letra: opt[1],
          texto: opt[2].trim(),
        }))
        break // Usar el primer patrón que funcione
      }
    }

    if (optionMatches.length >= 4) {
      // Extraer enunciado (todo antes de la primera opción)
      const firstOptionIndex = questionText.search(/[A-E][\)\.\-\:\s]/)
      const enunciado =
        firstOptionIndex > 0
          ? questionText.substring(0, firstOptionIndex).trim()
          : questionText.split(/[A-E][\)\.\-\:]/)[0].trim()

      // Limpiar el enunciado de números de pregunta residuales
      const cleanEnunciado = enunciado
        .replace(/^\d+[\.\)]\s*/, '')
        .replace(/^\(?\d+\)?\s*/, '')
        .trim()

      if (cleanEnunciado.length > 10) {
        // Validar que el enunciado tenga sentido
        // IMPORTANTE: Todas las opciones se importan como incorrectas
        // Las respuestas correctas deben marcarse manualmente después de la importación
        const options = optionMatches.map(opt => {
          const esCorrecta = false // Siempre false al importar

          return {
            letra: opt.letra,
            texto: opt.texto.trim().replace(/\s+/g, ' '),
            esCorrecta,
          }
        })

        // Validar que las opciones tengan contenido
        if (options.every(opt => opt.texto.length > 3)) {
          questions.push({
            enunciado: cleanEnunciado,
            options,
            dificultad: 2,
            explicacion: 'Respuesta correcta: Debe marcarse manualmente después de la importación',
            fuente: `DEMRE PAES ${new Date().getFullYear()}`,
          })
        }
      }
    }
  }

  return questions
}

async function mapQuestionToTopic(
  question: { enunciado: string },
  subjectId: string,
  prismaClient: typeof prisma = prisma
): Promise<string | null> {
  const topics = await prismaClient.topic.findMany({
    where: { subjectId },
  })

  const enunciadoLower = question.enunciado.toLowerCase()

  for (const topic of topics) {
    const topicKeywords = [
      topic.nombre.toLowerCase(),
      topic.ejeTematico.toLowerCase(),
      ...(topic.descripcion?.toLowerCase().split(' ') || []),
    ]

    for (const keyword of topicKeywords) {
      if (enunciadoLower.includes(keyword)) {
        return topic.id
      }
    }
  }

  return topics.length > 0 ? topics[0].id : null
}

async function importExam(examData: z.infer<typeof examImportSchema>) {
  const { pdfUrl, pdfFile, inputType, subjectName, examTitle, examType, year } = examData
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

    // Obtener PDF según el tipo de entrada
    await ensureDirectories()
    const pdfFileName = `${subjectCode}_${year}_${Date.now()}.pdf`
    pdfPath = path.join(PDFS_DIR, pdfFileName)

    if (inputType === 'file' && pdfFile) {
      // Validar tipo de archivo
      if (pdfFile.type !== 'application/pdf') {
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

      // Guardar archivo subido
      const arrayBuffer = await pdfFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await fs.writeFile(pdfPath, buffer)
    } else if (inputType === 'url' && pdfUrl) {
      // Descargar desde URL
      try {
        await downloadFile(pdfUrl, pdfPath)
      } catch (downloadError) {
        const errorMessage =
          downloadError instanceof Error ? downloadError.message : String(downloadError)

        // Si es error de parsing de headers, proporcionar mensaje más útil
        if (errorMessage.includes('Parse Error') || errorMessage.includes('CR after header')) {
          throw new Error(
            `No se pudo descargar el PDF debido a headers mal formateados del servidor de DEMRE.\n\n` +
              `Solución: Usa la opción "Archivo Local" para subir el PDF descargado manualmente.`
          )
        }
        throw downloadError
      }
    } else {
      throw new Error('Debe proporcionar URL o archivo según el tipo seleccionado')
    }

    // Extraer texto
    const text = await extractTextFromPDF(pdfPath)

    // Log temporal para debugging (primeros 2000 caracteres)
    const { logger } = await import('@/lib/logger')
    logger.debug(
      {
        textPreview: text.substring(0, 2000),
        textLength: text.length,
      },
      'Texto extraído del PDF'
    )

    // Parsear preguntas
    const parsedQuestions = parseQuestionsFromText(text)

    logger.info(
      {
        questionCount: parsedQuestions.length,
        textLength: text.length,
      },
      'Preguntas parseadas del PDF'
    )

    if (parsedQuestions.length === 0 && text.length > 100) {
      // Intentar encontrar patrones alternativos en el texto
      logger.debug({ textLength: text.length }, 'Buscando patrones alternativos en el texto')
      const hasNumbers = /\d+/.test(text)
      const hasLetters = /[A-E]/.test(text)
      const hasParentheses = /[A-E]\)/.test(text)
      const hasDots = /[A-E]\./.test(text)
      logger.debug(
        {
          hasNumbers,
          hasLetters,
          hasParentheses,
          hasDots,
        },
        'Patrones encontrados en el texto'
      )

      // Mostrar una muestra del texto para debugging
      const sampleStart = text.indexOf('1')
      if (sampleStart >= 0) {
        logger.debug(
          {
            sampleText: text.substring(sampleStart, sampleStart + 500),
            sampleStart,
          },
          'Muestra del texto desde primer "1"'
        )
      }
    }

    if (parsedQuestions.length === 0) {
      // Preparar información de debugging
      const debugInfo: {
        textLength: number
        hasNumbers?: boolean
        hasLetters?: boolean
        hasParentheses?: boolean
        hasDots?: boolean
        sampleText?: string
        numberPatternMatches?: number
        letterPatternMatches?: number
        sampleAroundFirstNumber?: string
      } = {
        textLength: text.length,
        hasNumbers: /\d+/.test(text),
        hasLetters: /[A-E]/.test(text),
        hasParentheses: /[A-E]\)/.test(text),
        hasDots: /[A-E]\./.test(text),
        sampleText: text.substring(0, 1000), // Primeros 1000 caracteres
      }

      // Buscar cualquier patrón que pueda indicar preguntas
      const numberPattern = /\d+[\.\)]\s/g
      const letterPattern = /[A-E][\)\.\-\:]/g
      const numberMatches = text.match(numberPattern)?.length || 0
      const letterMatches = text.match(letterPattern)?.length || 0

      debugInfo.numberPatternMatches = numberMatches
      debugInfo.letterPatternMatches = letterMatches

      // Buscar muestra alrededor del primer número
      const firstNumberIndex = text.search(/\d+[\.\)]/)
      if (firstNumberIndex >= 0) {
        debugInfo.sampleAroundFirstNumber = text.substring(
          Math.max(0, firstNumberIndex - 50),
          Math.min(text.length, firstNumberIndex + 500)
        )
      }

      logger.error({ debugInfo }, 'No se encontraron preguntas en el PDF')

      throw new Error(
        `No se encontraron preguntas en el PDF. ` +
          `El formato puede ser diferente o el PDF puede estar protegido. ` +
          `Texto extraído: ${text.length} caracteres. ` +
          `Patrones encontrados: números=${numberMatches}, letras=${letterMatches}. ` +
          `Revisa los logs del servidor para más detalles.`
      )
    }

    // Usar transacción para garantizar consistencia: todas las preguntas se crean o ninguna
    // Si falla la creación del examen, todas las preguntas se revierten
    const { exam, createdQuestions } = await prisma.$transaction(async tx => {
      // Crear preguntas dentro de la transacción
      const questions = []

      for (const parsedQ of parsedQuestions) {
        const topicId = await mapQuestionToTopic(parsedQ, subject.id, tx)

        const question = await tx.question.create({
          data: {
            subjectId: subject.id,
            topicId,
            enunciado: parsedQ.enunciado,
            dificultad: parsedQ.dificultad,
            explicacion: parsedQ.explicacion,
            fuente: parsedQ.fuente,
            tipo: 'multiple_choice',
            options: {
              create: parsedQ.options.map(opt => ({
                letra: opt.letra,
                texto: opt.texto,
                esCorrecta: opt.esCorrecta,
              })),
            },
          },
        })

        questions.push(question)
      }

      // Crear examen con todas las preguntas (dentro de la misma transacción)
      const examResult = await tx.exam.create({
        data: {
          subjectId: subject.id,
          titulo: examTitle,
          descripcion: `Examen oficial PAES ${year} - ${subjectName}`,
          tipo: examType,
          tiempoLimiteMin: subjectCode === 'LECTORA' ? 90 : subjectCode === 'M1' ? 135 : 120,
          totalPreguntas: questions.length,
          fuente: `DEMRE ${year}`,
          questions: {
            create: questions.map((q, index) => ({
              questionId: q.id,
              orden: index + 1,
            })),
          },
        },
      })

      return { exam: examResult, createdQuestions: questions }
    })

    // Limpiar PDF después de importar exitosamente
    if (pdfPath) {
      await fs.unlink(pdfPath).catch(() => {
        // Ignorar errores al eliminar (puede que ya no exista)
      })
    }

    return {
      examId: exam.id,
      examTitle: exam.titulo,
      questionsCount: createdQuestions.length,
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
        // Verificar autenticación (solo usuarios autenticados pueden importar)
        const user = await getCurrentUser()
        if (!user) {
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Detectar si es FormData o JSON
        const contentType = request.headers.get('content-type') || ''
        let exams: z.infer<typeof examImportSchema>[]

        if (contentType.includes('multipart/form-data')) {
          // Manejar FormData
          const formData = await request.formData()
          const examsArray: z.infer<typeof examImportSchema>[] = []

          // Extraer exámenes del FormData
          let index = 0
          while (formData.has(`exams[${index}][inputType]`)) {
            const inputType = formData.get(`exams[${index}][inputType]`) as string
            const pdfFile = formData.get(`exams[${index}][pdfFile]`) as File | null
            const pdfUrl = formData.get(`exams[${index}][pdfUrl]`) as string | null

            examsArray.push({
              inputType: inputType as 'url' | 'file',
              pdfUrl: pdfUrl || undefined,
              pdfFile: pdfFile || undefined,
              subjectName: formData.get(`exams[${index}][subjectName]`) as string,
              examTitle: formData.get(`exams[${index}][examTitle]`) as string,
              examType: formData.get(`exams[${index}][examType]`) as string,
              year: formData.get(`exams[${index}][year]`) as string,
            })
            index++
          }

          // Validar con Zod
          const validation = importExamsSchema.safeParse({ exams: examsArray })
          if (!validation.success) {
            return NextResponse.json(
              {
                error: 'Datos inválidos',
                details: validation.error.issues,
              },
              { status: 400 }
            )
          }

          exams = validation.data.exams
        } else {
          // Manejar JSON
          const validation = await validateBody(request, importExamsSchema)
          if (!validation.success) {
            return validation.error
          }
          exams = validation.data.exams
        }

        // Importar cada examen
        const results = []

        for (const examData of exams) {
          try {
            const result = await importExam(examData)

            results.push({
              success: true,
              examTitle: result.examTitle,
              message: `Examen importado exitosamente: ${result.questionsCount} preguntas creadas`,
              details: `ID: ${result.examId}\n⚠️ IMPORTANTE: Las respuestas correctas deben marcarse manualmente. Por defecto, todas las opciones están marcadas como incorrectas.`,
            })
          } catch (error) {
            results.push({
              success: false,
              examTitle: examData.examTitle || 'Examen desconocido',
              message: error instanceof Error ? error.message : 'Error desconocido',
            })
          }
        }

        return NextResponse.json({
          success: true,
          results,
          total: exams.length,
          successful: results.filter(r => r.success).length,
        })
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Error al importar exámenes',
            details: error instanceof Error ? error.message : 'Error desconocido',
          },
          { status: 500 }
        )
      }
    },
    'write'
  )
}
