import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { isAdmin } from '@/lib/check-admin'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { validateBody } from '@/lib/api-helpers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
export const runtime = 'nodejs'

// Importación de pdf-parse v2
// La versión 2 usa una clase PDFParse en lugar de una función directa
import { PDFParse } from 'pdf-parse'

// Schema de validación
const examImportSchema = z
  .object({
    pdfUrl: z.url({ error: 'Invalid URL' }).optional(),
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

    const portNum = urlObj.port ? parseInt(urlObj.port, 10) : null
    const safePort = portNum && !isNaN(portNum) && portNum > 0 && portNum <= 65535
      ? portNum
      : urlObj.protocol === 'https:' ? 443 : 80

    const options: https.RequestOptions = {
      hostname: urlObj.hostname,
      port: safePort,
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
function _detectCorrectAnswers(text: string): Map<number, string> {
  const answerMap = new Map<number, string>()

  // Validar que text sea un string válido
  const safeText = typeof text === 'string' ? text : ''
  if (!safeText) {
    return answerMap
  }

  // Normalizar el texto
  let normalizedText = ''
  try {
    normalizedText = safeText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').toUpperCase()
    if (typeof normalizedText !== 'string') {
      normalizedText = safeText.toUpperCase() // Fallback
    }
  } catch {
    normalizedText = safeText.toUpperCase() // Fallback
  }

  // Buscar sección de respuestas (típicamente al final del documento)
  // Patrones comunes: "RESPUESTAS", "CLAVE DE RESPUESTAS", "RESPUESTAS CORRECTAS"
  const answerSectionPatterns = [
    /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
    /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i,
  ]

  let answerSection = ''
  if (typeof normalizedText === 'string' && normalizedText.length > 0) {
    for (const pattern of answerSectionPatterns) {
      try {
        const match = normalizedText.match(pattern)
        if (match && Array.isArray(match) && match.length > 1 && match[1] && typeof match[1] === 'string') {
          answerSection = match[1]
          break
        }
      } catch {
        // Continuar con el siguiente patrón
      }
    }
  }

  // Si no se encuentra una sección específica, buscar en el último 30% del texto
  // (las respuestas suelen estar al final)
  if (!answerSection) {
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
          // Usar todo el texto como fallback
          answerSection = normalizedText
        }
      } else {
        answerSection = normalizedText
      }
    } else {
      answerSection = normalizedText
    }
  }

  // Múltiples patrones para detectar respuestas
  const answerPatterns = [
    // Formato: "1-A", "1-A,", "1-A ", "1 - A"
    /(\d+)[\s\-.)]+([A-E])/g,
    // Formato: "1. A", "1) A"
    /(\d+)[.)]\s*([A-E])/g,
    // Formato: "1 A" (con espacio)
    /(\d+)\s+([A-E])(?=\s|,|$)/g,
    // Formato en lista: "1) A", "2) B"
    /^(\d+)\)\s*([A-E])/gm,
  ]

  if (typeof answerSection === 'string' && answerSection.length > 0) {
    for (const pattern of answerPatterns) {
      try {
        const matches = Array.from(answerSection.matchAll(pattern))
        if (!Array.isArray(matches)) {
          continue
        }
        for (const match of matches) {
          if (!match || !Array.isArray(match) || match.length < 3 || !match[1] || !match[2]) {
            continue // Saltar matches inválidos
          }
          const match1 = typeof match[1] === 'string' ? match[1] : String(match[1])
          const match2 = typeof match[2] === 'string' ? match[2] : String(match[2])
          const questionNum = parseInt(match1, 10)
          if (isNaN(questionNum) || questionNum <= 0 || !Number.isFinite(questionNum)) {
            continue // Saltar números inválidos
          }
          let answerLetter = ''
          try {
            answerLetter = match2.toUpperCase()
            if (typeof answerLetter !== 'string') {
              answerLetter = match2 // Fallback
            }
          } catch {
            answerLetter = match2 // Fallback
          }

          // Validar que la letra esté en el rango A-E
          if (questionNum <= 100 && typeof answerLetter === 'string' && /^[A-E]$/.test(answerLetter)) {
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

  // Validar que text sea un string válido
  const safeText = typeof text === 'string' ? text : ''
  if (!safeText) {
    return questions
  }

  // Normalizar el texto: eliminar espacios múltiples y normalizar saltos de línea
  let normalizedText = ''
  try {
    normalizedText = safeText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
    if (typeof normalizedText !== 'string') {
      normalizedText = safeText // Fallback
    }
  } catch {
    normalizedText = safeText // Fallback
  }

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

  const allMatches: Array<{ number: string; text: string }> = []

  if (typeof normalizedText === 'string' && normalizedText.length > 0) {
    for (const pattern of questionPatterns) {
      try {
        const matches = Array.from(normalizedText.matchAll(pattern))
        if (!Array.isArray(matches)) {
          continue
        }
        for (const match of matches) {
          if (!match || !Array.isArray(match) || match.length < 2) {
            continue
          }
          const questionNumber = typeof match[1] === 'string' ? match[1] : String(match[1] || '')
          const questionText = (typeof match[2] === 'string' ? match[2] : '') || (typeof match[3] === 'string' ? match[3] : '') || ''
          if (typeof questionText === 'string' && questionText.trim().length > 20) {
            // Filtrar textos muy cortos
            allMatches.push({ number: questionNumber, text: questionText.trim() })
          }
        }
      } catch {
        // Continuar con el siguiente patrón
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

    if (typeof questionText === 'string' && questionText.length > 0) {
      for (const optionPattern of optionPatterns) {
        try {
          const matches = Array.from(questionText.matchAll(optionPattern))
          if (Array.isArray(matches) && matches.length >= 4) {
            optionMatches = matches
              .filter(opt => opt && Array.isArray(opt) && opt.length >= 3 && opt[1] && opt[2])
              .map(opt => ({
                letra: typeof opt[1] === 'string' ? opt[1] : String(opt[1] || ''),
                texto: typeof opt[2] === 'string' ? opt[2].trim() : String(opt[2] || '').trim(),
              }))
            if (optionMatches.length >= 4) {
              break // Usar el primer patrón que funcione
            }
          }
        } catch {
          // Continuar con el siguiente patrón
        }
      }
    }

    if (optionMatches.length >= 4) {
      // Extraer enunciado (todo antes de la primera opción)
      const safeQuestionText = typeof questionText === 'string' ? questionText : ''
      if (!safeQuestionText) {
        continue // Saltar si questionText no es válido
      }
      const firstOptionIndex = safeQuestionText.search(/[A-E][).\-:\s]/)
      let enunciado = ''
      if (firstOptionIndex > 0 && Number.isFinite(firstOptionIndex)) {
        try {
          const substring = safeQuestionText.substring(0, firstOptionIndex)
          enunciado = typeof substring === 'string' ? substring.trim() : ''
        } catch {
          // Fallback a split si substring falla
          try {
            const splitResult = safeQuestionText.split(/[A-E][).\-:]/)
            enunciado = Array.isArray(splitResult) && splitResult.length > 0 && typeof splitResult[0] === 'string'
              ? splitResult[0].trim()
              : ''
          } catch {
            continue // Saltar si ambos métodos fallan
          }
        }
      } else {
        try {
          const splitResult = safeQuestionText.split(/[A-E][).\-:]/)
          enunciado = Array.isArray(splitResult) && splitResult.length > 0 && typeof splitResult[0] === 'string'
            ? splitResult[0].trim()
            : ''
        } catch {
          continue // Saltar si split falla
        }
      }

      // Limpiar el enunciado de números de pregunta residuales
      let cleanEnunciado = ''
      if (typeof enunciado === 'string' && enunciado.length > 0) {
        try {
          cleanEnunciado = enunciado
            .replace(/^\d+[.)]\s*/, '')
            .replace(/^\(?\d+\)?\s*/, '')
            .trim()
          if (typeof cleanEnunciado !== 'string') {
            cleanEnunciado = enunciado.trim() // Fallback
          }
        } catch {
          cleanEnunciado = enunciado.trim() // Fallback
        }
      }

      if (typeof cleanEnunciado === 'string' && cleanEnunciado.length > 10) {
        // Validar que el enunciado tenga sentido
        // IMPORTANTE: Todas las opciones se importan como incorrectas
        // Las respuestas correctas deben marcarse manualmente después de la importación
        const options = optionMatches
          .filter(opt => opt && typeof opt === 'object' && opt.letra && opt.texto)
          .map(opt => {
            const esCorrecta = false // Siempre false al importar

            let texto = ''
            try {
              const trimmed = typeof opt.texto === 'string' ? opt.texto.trim() : String(opt.texto || '').trim()
              texto = trimmed.replace(/\s+/g, ' ')
              if (typeof texto !== 'string') {
                texto = trimmed // Fallback
              }
            } catch {
              texto = typeof opt.texto === 'string' ? opt.texto.trim() : String(opt.texto || '').trim()
            }

            return {
              letra: typeof opt.letra === 'string' ? opt.letra : String(opt.letra || ''),
              texto,
              esCorrecta,
            }
          })

        // Validar que las opciones tengan contenido
        const validOptions = Array.isArray(options)
          ? options.filter(opt => opt && typeof opt === 'object' && typeof opt.texto === 'string' && opt.texto.length > 3)
          : []
        if (validOptions.length >= 4) {
          questions.push({
            enunciado: typeof cleanEnunciado === 'string' ? cleanEnunciado : '',
            options: validOptions,
            dificultad: 2,
            explicacion: 'Respuesta correcta: Debe marcarse manualmente después de la importación',
            fuente: `DEMRE PAES ${(() => {
              const year = new Date().getFullYear()
              return Number.isFinite(year) ? year : new Date().getFullYear()
            })()}`,
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
  prismaClient: PrismaClient = prisma
): Promise<string | null> {
  const topics = await prismaClient.topic.findMany({
    where: { subjectId },
  })

  const safeEnunciado = typeof question?.enunciado === 'string' ? question.enunciado : ''
  if (!safeEnunciado) {
    return Array.isArray(topics) && topics.length > 0 && topics[0]?.id ? topics[0].id : null
  }

  let enunciadoLower = ''
  try {
    enunciadoLower = safeEnunciado.toLowerCase()
    if (typeof enunciadoLower !== 'string') {
      enunciadoLower = safeEnunciado // Fallback
    }
  } catch {
    enunciadoLower = safeEnunciado // Fallback
  }

  if (Array.isArray(topics)) {
    for (const topic of topics) {
      if (!topic || typeof topic !== 'object') {
        continue
      }

      const topicKeywords: string[] = []
      
      // Agregar nombre del tema
      if (typeof topic.nombre === 'string' && topic.nombre.length > 0) {
        try {
          const nombreLower = topic.nombre.toLowerCase()
          if (typeof nombreLower === 'string') {
            topicKeywords.push(nombreLower)
          }
        } catch {
          // Ignorar errores en toLowerCase
        }
      }

      // Agregar eje temático
      if (typeof topic.ejeTematico === 'string' && topic.ejeTematico.length > 0) {
        try {
          const ejeLower = topic.ejeTematico.toLowerCase()
          if (typeof ejeLower === 'string') {
            topicKeywords.push(ejeLower)
          }
        } catch {
          // Ignorar errores en toLowerCase
        }
      }

      // Agregar palabras de la descripción
      if (topic.descripcion && typeof topic.descripcion === 'string' && topic.descripcion.length > 0) {
        try {
          const descLower = topic.descripcion.toLowerCase()
          if (typeof descLower === 'string') {
            const splitResult = descLower.split(' ')
            if (Array.isArray(splitResult)) {
              const validWords = splitResult.filter(word => typeof word === 'string' && word.length > 0)
              topicKeywords.push(...validWords)
            }
          }
        } catch {
          // Ignorar errores en toLowerCase o split
        }
      }

      // Buscar coincidencias
      if (typeof enunciadoLower === 'string' && enunciadoLower.length > 0) {
        for (const keyword of topicKeywords) {
          if (typeof keyword === 'string' && keyword.length > 0) {
            try {
              if (enunciadoLower.includes(keyword)) {
                return topic.id || null
              }
            } catch {
              // Continuar con el siguiente keyword
            }
          }
        }
      }
    }
  }

  return Array.isArray(topics) && topics.length > 0 && topics[0]?.id ? topics[0].id : null
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
    const safeText = typeof text === 'string' ? text : ''
    const textPreview = safeText.length > 0
      ? (() => {
          try {
            const preview = safeText.substring(0, 2000)
            return typeof preview === 'string' ? preview : ''
          } catch {
            return ''
          }
        })()
      : ''
    logger.debug(
      {
        textPreview,
        textLength: typeof safeText === 'string' && Number.isFinite(safeText.length) ? safeText.length : 0,
      },
      'Texto extraído del PDF'
    )

    // Parsear preguntas
    const parsedQuestions = parseQuestionsFromText(text)

    const safeTextForInfo = typeof text === 'string' ? text : ''
    logger.info(
      {
        questionCount: Array.isArray(parsedQuestions) && Number.isFinite(parsedQuestions.length) ? parsedQuestions.length : 0,
        textLength: typeof safeTextForInfo === 'string' && Number.isFinite(safeTextForInfo.length) ? safeTextForInfo.length : 0,
      },
      'Preguntas parseadas del PDF'
    )

    const safeTextForDebug = typeof text === 'string' ? text : ''
    if (parsedQuestions.length === 0 && safeTextForDebug.length > 100) {
      // Intentar encontrar patrones alternativos en el texto
      logger.debug({ textLength: safeTextForDebug.length }, 'Buscando patrones alternativos en el texto')
      let hasNumbers = false
      let hasLetters = false
      let hasParentheses = false
      let hasDots = false
      try {
        hasNumbers = /\d+/.test(safeTextForDebug)
        hasLetters = /[A-E]/.test(safeTextForDebug)
        hasParentheses = /[A-E]\)/.test(safeTextForDebug)
        hasDots = /[A-E]\./.test(safeTextForDebug)
      } catch {
        // Ignorar errores en tests de regex
      }
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
      try {
        const sampleStart = safeTextForDebug.indexOf('1')
        if (sampleStart >= 0 && Number.isFinite(sampleStart)) {
          const safeStart = Number.isFinite(sampleStart) && sampleStart >= 0 ? sampleStart : 0
          const safeEnd = Number.isFinite(safeStart + 500) ? Math.min(safeStart + 500, safeTextForDebug.length) : safeTextForDebug.length
          const sampleText = safeTextForDebug.substring(safeStart, safeEnd)
          logger.debug(
            {
              sampleText: typeof sampleText === 'string' ? sampleText : '',
              sampleStart: safeStart,
            },
            'Muestra del texto desde primer "1"'
          )
        }
      } catch {
        // Ignorar errores en indexOf o substring
      }
    }

    if (parsedQuestions.length === 0) {
      // Preparar información de debugging
      const safeTextForDebugInfo = typeof text === 'string' ? text : ''
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
        textLength: typeof safeTextForDebugInfo === 'string' && Number.isFinite(safeTextForDebugInfo.length) ? safeTextForDebugInfo.length : 0,
      }

      try {
        debugInfo.hasNumbers = /\d+/.test(safeTextForDebugInfo)
        debugInfo.hasLetters = /[A-E]/.test(safeTextForDebugInfo)
        debugInfo.hasParentheses = /[A-E]\)/.test(safeTextForDebugInfo)
        debugInfo.hasDots = /[A-E]\./.test(safeTextForDebugInfo)
      } catch {
        // Ignorar errores en tests de regex
      }

      try {
        const sampleText = safeTextForDebugInfo.substring(0, 1000) // Primeros 1000 caracteres
        debugInfo.sampleText = typeof sampleText === 'string' ? sampleText : ''
      } catch {
        debugInfo.sampleText = ''
      }

      // Buscar cualquier patrón que pueda indicar preguntas
      let numberMatches = 0
      let letterMatches = 0
      try {
        const numberPattern = /\d+[.)]\s/g
        const letterPattern = /[A-E][).\-:]/g
        const numberMatchResult = safeTextForDebugInfo.match(numberPattern)
        const letterMatchResult = safeTextForDebugInfo.match(letterPattern)
        numberMatches = Array.isArray(numberMatchResult) && Number.isFinite(numberMatchResult.length) ? numberMatchResult.length : 0
        letterMatches = Array.isArray(letterMatchResult) && Number.isFinite(letterMatchResult.length) ? letterMatchResult.length : 0
      } catch {
        // Ignorar errores en match
      }

      debugInfo.numberPatternMatches = numberMatches
      debugInfo.letterPatternMatches = letterMatches

      // Buscar muestra alrededor del primer número
      try {
        const firstNumberIndex = safeTextForDebugInfo.search(/\d+[.)]/)
        if (firstNumberIndex >= 0 && Number.isFinite(firstNumberIndex)) {
          const safeStart = Math.max(0, firstNumberIndex - 50)
          const safeEnd = Math.min(safeTextForDebugInfo.length, firstNumberIndex + 500)
          const sampleAroundFirstNumber = safeTextForDebugInfo.substring(safeStart, safeEnd)
          debugInfo.sampleAroundFirstNumber = typeof sampleAroundFirstNumber === 'string' ? sampleAroundFirstNumber : ''
        }
      } catch {
        // Ignorar errores en search o substring
      }

      logger.error({ debugInfo }, 'No se encontraron preguntas en el PDF')

      const safeTextLength = typeof safeTextForDebugInfo === 'string' && Number.isFinite(safeTextForDebugInfo.length)
        ? safeTextForDebugInfo.length
        : 0
      throw new Error(
        `No se encontraron preguntas en el PDF. ` +
          `El formato puede ser diferente o el PDF puede estar protegido. ` +
          `Texto extraído: ${safeTextLength} caracteres. ` +
          `Patrones encontrados: números=${numberMatches}, letras=${letterMatches}. ` +
          `Revisa los logs del servidor para más detalles.`
      )
    }

    // Usar transacción para garantizar consistencia: todas las preguntas se crean o ninguna
    // Si falla la creación del examen, todas las preguntas se revierten
    // Timeout aumentado a 60s para exámenes grandes (M2 puede tener 50+ preguntas)
    const { exam, createdQuestions } = await prisma.$transaction(
      async tx => {
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
      },
      {
        timeout: 60000, // 60 segundos (suficiente para exámenes grandes)
      }
    )

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

        // Verificar que el usuario sea admin
        const userIsAdmin = await isAdmin()
        if (!userIsAdmin) {
          logger.warn(
            { userId: user.id, email: user.email },
            'Intento de importar exámenes sin permisos de admin'
          )
          return NextResponse.json(
            { error: 'No tienes permisos para importar exámenes. Se requieren permisos de administrador.' },
            { status: 403 }
          )
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
