import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

// Importación de pdf-parse v2
const { PDFParse } = require('pdf-parse')

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

// Mapeo de asignaturas (debe coincidir con el sistema)
const SUBJECT_MAPPING: Record<string, string> = {
  'Competencia Lectora': 'LECTORA',
  'Matemática M1': 'M1',
  'Matemática M2': 'M2',
  'Ciencias - Biología': 'BIO',
  'Ciencias - Física': 'FIS',
  'Ciencias - Química': 'QUI',
  'Historia y Ciencias Sociales': 'HIST',
}

// Schema para validar un tema individual
const topicSchema = z.object({
  asignatura: z.string().min(1, 'La asignatura es requerida'),
  ejeTematico: z.string().min(1, 'El eje temático es requerido'),
  nombre: z.string().min(1, 'El nombre del tema es requerido'),
  descripcion: z.string().optional().nullable(),
})

// Schema para validar el array de temas
const topicsImportSchema = z.object({
  topics: z.array(topicSchema).min(1, 'Debe haber al menos un tema'),
})

// Schema para validar el formato del request
const requestSchema = z.object({
  topics: z.array(topicSchema).min(1),
})

interface TopicImportData {
  asignatura: string
  ejeTematico: string
  nombre: string
  descripcion?: string | null
}

interface ImportResult {
  totalTopics: number
  created: number
  updated: number
  skipped: number
  errors: Array<{ topic: string; error: string }>
  details: {
    bySubject: Record<string, { created: number; updated: number }>
  }
}

/**
 * Importa temarios desde un array de objetos
 * Maneja duplicados basándose en asignatura + eje temático + nombre
 */
async function importTopics(data: TopicImportData[]): Promise<ImportResult> {
  const result: ImportResult = {
    totalTopics: data.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    details: {
      bySubject: {},
    },
  }

  // Validar y normalizar datos
  const validatedTopics: Array<TopicImportData & { subjectCode: string }> = []

  for (const topic of data) {
    try {
      // Validar con Zod
      const validated = topicSchema.parse(topic)

      // Obtener código de asignatura
      const subjectCode = SUBJECT_MAPPING[validated.asignatura]
      if (!subjectCode) {
        result.errors.push({
          topic: `${validated.asignatura} - ${validated.nombre}`,
          error: `Asignatura no encontrada: ${validated.asignatura}`,
        })
        result.skipped++
        continue
      }

      validatedTopics.push({
        ...validated,
        subjectCode,
      })
    } catch (error) {
      result.errors.push({
        topic: `${topic.asignatura || 'Desconocido'} - ${topic.nombre || 'Desconocido'}`,
        error: error instanceof Error ? error.message : 'Error de validación',
      })
      result.skipped++
    }
  }

  // Agrupar por asignatura para optimizar consultas
  const topicsBySubject = new Map<string, typeof validatedTopics>()
  for (const topic of validatedTopics) {
    if (!topicsBySubject.has(topic.subjectCode)) {
      topicsBySubject.set(topic.subjectCode, [])
    }
    topicsBySubject.get(topic.subjectCode)!.push(topic)
  }

  // Procesar en transacción
  await prisma.$transaction(async tx => {
    for (const [subjectCode, topics] of topicsBySubject.entries()) {
      // Obtener o crear asignatura
      let subject = await tx.subject.findUnique({
        where: { codigo: subjectCode },
      })

      if (!subject) {
        // Buscar el nombre de la asignatura desde el mapeo inverso
        const subjectName =
          Object.entries(SUBJECT_MAPPING).find(([_, code]) => code === subjectCode)?.[0] ||
          subjectCode

        subject = await tx.subject.create({
          data: {
            codigo: subjectCode,
            nombre: subjectName,
            tipo: 'PAES',
          },
        })
      }

      // Inicializar contadores para esta asignatura
      if (!result.details.bySubject[subjectCode]) {
        result.details.bySubject[subjectCode] = { created: 0, updated: 0 }
      }

      // Procesar cada tema
      for (const topic of topics) {
        try {
          // Buscar tema existente (mismo nombre, mismo eje temático, misma asignatura)
          const existingTopic = await tx.topic.findFirst({
            where: {
              subjectId: subject.id,
              nombre: topic.nombre.trim(),
              ejeTematico: topic.ejeTematico.trim(),
            },
          })

          if (existingTopic) {
            // Actualizar tema existente
            await tx.topic.update({
              where: { id: existingTopic.id },
              data: {
                descripcion: topic.descripcion?.trim() || null,
              },
            })
            result.updated++
            result.details.bySubject[subjectCode].updated++
          } else {
            // Crear nuevo tema
            await tx.topic.create({
              data: {
                subjectId: subject.id,
                nombre: topic.nombre.trim(),
                ejeTematico: topic.ejeTematico.trim(),
                descripcion: topic.descripcion?.trim() || null,
              },
            })
            result.created++
            result.details.bySubject[subjectCode].created++
          }
        } catch (error) {
          result.errors.push({
            topic: `${topic.asignatura} - ${topic.nombre}`,
            error: error instanceof Error ? error.message : 'Error al procesar tema',
          })
          result.skipped++
        }
      }
    }
  })

  return result
}

/**
 * Parsea un valor CSV, manejando comillas y espacios
 */
function parseCSVValue(value: string): string {
  // Remover comillas dobles al inicio y final si existen
  let cleaned = value.trim()
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1)
  }
  // Reemplazar comillas dobles escapadas
  cleaned = cleaned.replace(/""/g, '"')
  return cleaned.trim()
}

/**
 * Parsea una línea CSV considerando comillas
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Comilla escapada
        current += '"'
        i++ // Saltar la siguiente comilla
      } else {
        // Toggle de comillas
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // Separador de columna
      values.push(parseCSVValue(current))
      current = ''
    } else {
      current += char
    }
  }

  // Agregar último valor
  values.push(parseCSVValue(current))

  return values
}

/**
 * Parsea un archivo CSV a array de temas
 */
function parseCSV(csvText: string): TopicImportData[] {
  // Normalizar saltos de línea
  const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalizedText.split('\n').filter(line => line.trim())

  if (lines.length < 2) {
    throw new Error('El CSV debe tener al menos una fila de encabezados y una fila de datos')
  }

  // Parsear encabezados
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase())

  // Encontrar índices de columnas (búsqueda flexible)
  const asignaturaIdx = headers.findIndex(h => h === 'asignatura' || h.includes('asignatura'))
  const ejeTematicoIdx = headers.findIndex(
    h =>
      h === 'eje tematico' ||
      h === 'eje_tematico' ||
      h === 'ejetematico' ||
      (h.includes('eje') && h.includes('tematico')) ||
      h.includes('eje')
  )
  const nombreIdx = headers.findIndex(
    h => h === 'nombre' || h === 'tema' || h.includes('nombre') || h.includes('tema')
  )
  const descripcionIdx = headers.findIndex(
    h => h === 'descripcion' || h === 'descripción' || h.includes('descripcion')
  )

  if (asignaturaIdx === -1 || ejeTematicoIdx === -1 || nombreIdx === -1) {
    throw new Error(
      `El CSV debe contener columnas: asignatura, eje temático, nombre. ` +
        `Columnas encontradas: ${headers.join(', ')}`
    )
  }

  // Parsear datos
  const topics: TopicImportData[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])

    if (values.length <= Math.max(asignaturaIdx, ejeTematicoIdx, nombreIdx)) {
      // Fila incompleta, saltar
      continue
    }

    const asignatura = values[asignaturaIdx]?.trim()
    const ejeTematico = values[ejeTematicoIdx]?.trim()
    const nombre = values[nombreIdx]?.trim()

    if (asignatura && ejeTematico && nombre) {
      topics.push({
        asignatura,
        ejeTematico,
        nombre,
        descripcion:
          descripcionIdx !== -1 && values[descripcionIdx]
            ? values[descripcionIdx].trim() || null
            : null,
      })
    }
  }

  if (topics.length === 0) {
    throw new Error('No se encontraron temas válidos en el CSV')
  }

  return topics
}

/**
 * Detecta y extrae temarios desde el texto de un PDF
 * Busca patrones comunes de estructura de temarios PAES
 */
function parseTopicsFromPDF(text: string): TopicImportData[] {
  const topics: TopicImportData[] = []

  // Buscar asignaturas conocidas en el texto
  const subjectPatterns = Object.keys(SUBJECT_MAPPING).map(subject => ({
    name: subject,
    code: SUBJECT_MAPPING[subject],
    pattern: new RegExp(subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
  }))

  // Normalizar saltos de línea pero preservar estructura
  // NO reemplazar todos los espacios por uno solo, ya que perdemos la estructura del documento
  const normalizedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Normalizar múltiples espacios en la misma línea, pero mantener saltos de línea
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')

  // Dividir el texto en secciones por asignatura
  const sections: Array<{ subject: string; text: string }> = []
  let currentSubject = ''
  let currentText = ''

  const lines = normalizedText.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Buscar si esta línea contiene una asignatura
    const foundSubject = subjectPatterns.find(sp => sp.pattern.test(line))

    if (foundSubject) {
      // Guardar sección anterior si existe
      if (currentSubject && currentText.trim()) {
        sections.push({ subject: currentSubject, text: currentText.trim() })
      }
      // Iniciar nueva sección
      currentSubject = foundSubject.name
      currentText = ''
    } else if (currentSubject) {
      currentText += line + '\n'
    }
  }

  // Agregar última sección
  if (currentSubject && currentText.trim()) {
    sections.push({ subject: currentSubject, text: currentText.trim() })
  }

  // Si no se encontraron secciones por asignatura, intentar parsear todo el texto
  if (sections.length === 0) {
    // Buscar patrones de estructura de temario sin asignatura explícita
    // Asumir que el usuario especificará la asignatura o se detectará después
    sections.push({ subject: '', text: normalizedText })
  }

  // Parsear cada sección para extraer ejes temáticos y temas
  for (const section of sections) {
    const sectionText = section.text

    // Patrones para detectar ejes temáticos (títulos en mayúsculas, numerados, etc.)
    const ejePatterns = [
      // Patrón 1: "EJE TEMÁTICO", "ÁREA TEMÁTICA", etc.
      /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s]*)/i,
      // Patrón 2: Numeración seguida de título en mayúsculas (ej: "1. ÁLGEBRA Y FUNCIONES")
      /(?:^|\n)\s*(\d+[\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/,
      // Patrón 3: Títulos en mayúsculas al inicio de línea (mínimo 15 caracteres)
      /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{15,80})(?=\n|$)/,
      // Patrón 4: Títulos con formato especial (ej: "--- ÁLGEBRA ---")
      /(?:^|\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i,
    ]

    let currentEje = ''
    const ejeMatches: Array<{ eje: string; startIndex: number }> = []

    for (const pattern of ejePatterns) {
      try {
        const matches = Array.from(sectionText.matchAll(new RegExp(pattern.source, 'gm')))
        for (const match of matches) {
          if (match[1]) {
            let eje = match[1]
              .trim()
              .replace(/^\d+[\.\)]\s+/, '')
              .replace(/^[-=]+\s+/, '')
              .replace(/\s+[-=]+$/, '')
              // Normalizar espacios múltiples pero mantener estructura
              .replace(/[ \t]+/g, ' ')
              .trim()

            // Validar que el eje no sea solo números o caracteres especiales
            if (eje.length > 5 && eje.length < 100 && !eje.match(/^[\d\s\-=\.]+$/)) {
              // Evitar duplicados (comparar sin considerar mayúsculas/minúsculas)
              const ejeLower = eje.toLowerCase()
              if (!ejeMatches.some(e => e.eje.toLowerCase() === ejeLower)) {
                ejeMatches.push({ eje, startIndex: match.index || 0 })
              }
            }
          }
        }
      } catch (error) {
        // Si hay un error con el regex, continuar con el siguiente patrón
        logger.warn(
          {
            type: 'import_topics_error',
            error: error instanceof Error ? error.message : String(error),
            path: '/api/admin/import-topics',
            action: 'process_eje_tematico_pattern',
          },
          'Error al procesar patrón de eje temático'
        )
        continue
      }
    }

    // Ordenar por posición en el texto
    ejeMatches.sort((a, b) => a.startIndex - b.startIndex)

    // Si no se encontraron ejes temáticos, usar el texto completo como un eje
    if (ejeMatches.length === 0) {
      currentEje = 'General'
      ejeMatches.push({ eje: 'General', startIndex: 0 })
    }

    // Para cada eje temático, buscar temas
    for (let i = 0; i < ejeMatches.length; i++) {
      const ejeMatch = ejeMatches[i]
      const nextEjeIndex =
        i < ejeMatches.length - 1 ? ejeMatches[i + 1].startIndex : sectionText.length

      const ejeText = sectionText.substring(ejeMatch.startIndex, nextEjeIndex)
      currentEje = ejeMatch.eje

      // Patrones para detectar temas (viñetas, números, guiones, etc.)
      const temaPatterns = [
        // Patrón 1: Viñetas (-, •, ▪, ▫, o, etc.)
        /(?:^|\n)\s*[-•▪▫o]\s+([^\n]{5,150})/g,
        // Patrón 2: Numeración (1., 2), a), etc.)
        /(?:^|\n)\s*\d+[\.\)]\s+([^\n]{5,150})/g,
        // Patrón 3: Letras seguidas de punto o paréntesis (a., b), etc.)
        /(?:^|\n)\s*[a-z][\.\)]\s+([^\n]{5,150})/g,
        // Patrón 4: Líneas que empiezan con mayúscula (títulos de temas)
        /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ][^\n]{5,150})(?=\n|$)/g,
      ]

      const temas: string[] = []
      for (const pattern of temaPatterns) {
        try {
          const matches = Array.from(ejeText.matchAll(pattern))
          for (const match of matches) {
            if (match[1]) {
              let tema = match[1]
                .trim()
                .replace(/^[-•▪▫o]\s+/, '')
                .replace(/^\d+[\.\)]\s+/, '')
                .replace(/^[a-z][\.\)]\s+/, '')
                // Normalizar espacios múltiples pero mantener estructura
                .replace(/[ \t]+/g, ' ')
                .trim()

              // Validar que sea un tema válido
              // - No muy corto (mínimo 5 caracteres)
              // - No muy largo (máximo 150 caracteres)
              // - No solo mayúsculas (probablemente un título de sección)
              // - No solo números o caracteres especiales
              if (
                tema.length >= 5 &&
                tema.length <= 150 &&
                !tema.match(/^[A-Z\s]{20,}$/) && // No títulos largos solo en mayúsculas
                !tema.match(/^[\d\s\-=\.]+$/)
              ) {
                // No solo números o separadores
                // Evitar duplicados (comparar sin considerar mayúsculas/minúsculas)
                const temaLower = tema.toLowerCase()
                if (!temas.some(t => t.toLowerCase() === temaLower)) {
                  temas.push(tema)
                }
              }
            }
          }
        } catch (error) {
          // Si hay un error con el regex, continuar con el siguiente patrón
          logger.warn(
            {
              type: 'import_topics_error',
              error: error instanceof Error ? error.message : String(error),
              path: '/api/admin/import-topics',
              action: 'process_topic_pattern',
            },
            'Error al procesar patrón de tema'
          )
          continue
        }
      }

      // Si no se encontraron temas con patrones, dividir por líneas
      if (temas.length === 0) {
        const lines = ejeText.split('\n').filter(l => {
          const trimmed = l.trim()
          // Filtrar líneas vacías, muy cortas, o que parezcan títulos de sección
          return (
            trimmed.length >= 5 &&
            trimmed.length <= 150 &&
            !trimmed.match(/^[A-Z\s]{20,}$/) && // No líneas solo en mayúsculas muy largas
            !trimmed.match(/^[-=]+\s*$/)
          ) // No líneas de separadores
        })

        // Saltar primera línea si parece ser el título del eje temático
        const startIndex = lines[0] && lines[0].trim().length > 20 ? 1 : 0
        for (let i = startIndex; i < lines.length; i++) {
          const tema = lines[i]
            .trim()
            .replace(/^[-•▪▫o\d\)\.]+\s*/, '')
            .trim()
          if (tema.length >= 5 && tema.length <= 150) {
            // Evitar duplicados
            if (!temas.some(t => t.toLowerCase() === tema.toLowerCase())) {
              temas.push(tema)
            }
          }
        }
      }

      // Crear temas para esta asignatura y eje
      for (const temaNombre of temas) {
        if (section.subject) {
          topics.push({
            asignatura: section.subject,
            ejeTematico: currentEje,
            nombre: temaNombre,
            descripcion: null,
          })
        }
      }
    }
  }

  // Si no se encontró ninguna asignatura pero hay temas, intentar detectar asignatura del contexto
  if (topics.length > 0 && topics.some(t => !t.asignatura)) {
    // Buscar asignatura en el texto completo
    for (const subjectPattern of subjectPatterns) {
      if (subjectPattern.pattern.test(text)) {
        topics.forEach(topic => {
          if (!topic.asignatura) {
            topic.asignatura = subjectPattern.name
          }
        })
        break
      }
    }
  }

  // Filtrar temas sin asignatura
  return topics.filter(t => t.asignatura && t.nombre && t.ejeTematico)
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

        // Obtener datos del request
        const contentType = request.headers.get('content-type') || ''
        let topicsData: TopicImportData[] = []

        if (contentType.includes('application/json')) {
          // Formato JSON
          const body = await request.json()
          const validation = requestSchema.safeParse(body)

          if (!validation.success) {
            return NextResponse.json(
              {
                error: 'Datos inválidos',
                details: validation.error.issues,
              },
              { status: 400 }
            )
          }

          topicsData = validation.data.topics
        } else if (
          contentType.includes('multipart/form-data') ||
          contentType.includes('text/csv')
        ) {
          // Formato CSV o PDF desde FormData
          const formData = await request.formData()
          const csvFile = formData.get('csvFile') as File | null
          const pdfFile = formData.get('pdfFile') as File | null
          const csvText = formData.get('csvText') as string | null
          const subjectName = formData.get('subjectName') as string | null // Para PDFs sin asignatura detectada

          if (pdfFile) {
            // Procesar PDF
            let pdfPath: string | null = null

            try {
              // Validar tipo de archivo
              if (pdfFile.type && pdfFile.type !== 'application/pdf') {
                throw new Error('El archivo debe ser un PDF válido')
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
                  `El archivo es demasiado grande. Tamaño máximo: ${MAX_FILE_SIZE / 1024 / 1024} MB`
                )
              }

              // Guardar PDF temporalmente
              await ensureDirectories()
              const pdfFileName = `topics_${Date.now()}.pdf`
              pdfPath = path.join(PDFS_DIR, pdfFileName)

              const arrayBuffer = await pdfFile.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)
              await fs.writeFile(pdfPath, buffer)

              // Extraer texto del PDF
              const text = await extractTextFromPDF(pdfPath)

              // Parsear temarios desde el texto
              topicsData = parseTopicsFromPDF(text)

              // Si se proporcionó una asignatura y hay temas sin asignatura, asignarla
              if (subjectName && topicsData.length > 0) {
                const subjectCode = SUBJECT_MAPPING[subjectName]
                if (subjectCode) {
                  topicsData.forEach(topic => {
                    if (!topic.asignatura) {
                      topic.asignatura = subjectName
                    }
                  })
                }
              }

              // Limpiar PDF después de procesar
              if (pdfPath) {
                await fs.unlink(pdfPath).catch(() => {
                  // Ignorar errores al eliminar
                })
              }

              if (topicsData.length === 0) {
                throw new Error(
                  'No se pudieron detectar temarios en el PDF. ' +
                    'Verifica que el formato sea correcto y que contenga asignaturas, ejes temáticos y temas.'
                )
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
          } else if (csvFile) {
            const text = await csvFile.text()
            topicsData = parseCSV(text)
          } else if (csvText) {
            topicsData = parseCSV(csvText)
          } else {
            return NextResponse.json(
              { error: 'Debe proporcionar un archivo PDF, CSV o texto CSV' },
              { status: 400 }
            )
          }
        } else {
          // Intentar parsear como JSON por defecto
          try {
            const body = await request.json()
            const validation = requestSchema.safeParse(body)

            if (!validation.success) {
              return NextResponse.json(
                {
                  error: 'Formato no soportado. Use JSON o CSV',
                  details: validation.error.issues,
                },
                { status: 400 }
              )
            }

            topicsData = validation.data.topics
          } catch {
            return NextResponse.json(
              { error: 'Formato no soportado. Use JSON o CSV' },
              { status: 400 }
            )
          }
        }

        if (topicsData.length === 0) {
          return NextResponse.json(
            { error: 'No se encontraron temas para importar' },
            { status: 400 }
          )
        }

        // Importar temas
        const result = await importTopics(topicsData)

        // Construir mensaje de respuesta
        const successMessage = `Importación completada: ${result.created} creados, ${result.updated} actualizados, ${result.skipped} omitidos`

        const detailsBySubject = Object.entries(result.details.bySubject)
          .map(([code, stats]) => {
            const subjectName =
              Object.entries(SUBJECT_MAPPING).find(([_, c]) => c === code)?.[0] || code
            return `${subjectName}: ${stats.created} creados, ${stats.updated} actualizados`
          })
          .join('\n')

        return NextResponse.json({
          success: true,
          message: successMessage,
          details:
            `Total procesados: ${result.totalTopics}\n` +
            `Creados: ${result.created}\n` +
            `Actualizados: ${result.updated}\n` +
            `Omitidos: ${result.skipped}\n\n` +
            (detailsBySubject ? `Por asignatura:\n${detailsBySubject}` : '') +
            (result.errors.length > 0
              ? `\n\nErrores (${result.errors.length}):\n${result.errors.map(e => `- ${e.topic}: ${e.error}`).join('\n')}`
              : ''),
          result: {
            total: result.totalTopics,
            created: result.created,
            updated: result.updated,
            skipped: result.skipped,
            errors: result.errors,
          },
        })
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Error al importar temarios',
            details: error instanceof Error ? error.message : 'Error desconocido',
          },
          { status: 500 }
        )
      }
    },
    'write'
  )
}
