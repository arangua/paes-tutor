/**
 * Script para importar exámenes reales desde DEMRE
 *
 * Este script descarga PDFs desde el sitio de DEMRE, extrae las preguntas
 * y las carga en la base de datos.
 *
 * Uso:
 *   npx tsx scripts/import-demre-exams.ts
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
// Importación de pdf-parse v2
// La versión 2 usa una clase PDFParse en lugar de una función directa
const { PDFParse } = require('pdf-parse')

// Configurar Prisma
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./paes.db',
})

const prisma = new PrismaClient({ adapter }) as any

// Directorio para guardar PDFs descargados
const PDFS_DIR = path.join(process.cwd(), 'data', 'pdfs')
const TEMP_DIR = path.join(process.cwd(), 'data', 'temp')

// Mapeo de códigos de asignatura DEMRE a códigos internos
const SUBJECT_MAPPING: Record<string, string> = {
  'Competencia Lectora': 'LECTORA',
  'Matemática M1': 'M1',
  'Matemática M2': 'M2',
  'Ciencias - Biología': 'BIO',
  'Ciencias - Física': 'FIS',
  'Ciencias - Química': 'QUI',
  'Historia y Ciencias Sociales': 'HIST',
}

/**
 * Crear directorios necesarios
 */
async function ensureDirectories() {
  await fs.mkdir(PDFS_DIR, { recursive: true })
  await fs.mkdir(TEMP_DIR, { recursive: true })
}

/**
 * Descargar archivo desde URL
 */
function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http

    const file = fsSync.createWriteStream(dest)

    protocol
      .get(url, response => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Seguir redirecciones
          return downloadFile(response.headers.location!, dest).then(resolve).catch(reject)
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Error descargando: ${response.statusCode}`))
          return
        }

        response.pipe(file)

        file.on('finish', () => {
          file.close()
          resolve()
        })
      })
      .on('error', err => {
        fs.unlink(dest).catch(() => {})
        reject(err)
      })
  })
}

/**
 * Extraer texto de PDF
 */
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  const dataBuffer = await fs.readFile(pdfPath)

  // pdf-parse v2: usar la clase PDFParse
  const parser = new PDFParse({ data: dataBuffer })
  await parser.load()
  const result = await parser.getText()
  return result.text
}

/**
 * Parsear preguntas desde texto extraído del PDF
 *
 * Esta función intenta identificar preguntas, opciones y respuestas correctas
 * del texto extraído. El formato puede variar según el PDF.
 */
function parseQuestionsFromText(
  text: string,
  subjectCode: string
): Array<{
  enunciado: string
  options: Array<{ letra: string; texto: string; esCorrecta: boolean }>
  dificultad: number
  explicacion: string
  fuente: string
  topicId?: string
}> {
  const questions: Array<{
    enunciado: string
    options: Array<{ letra: string; texto: string; esCorrecta: boolean }>
    dificultad: number
    explicacion: string
    fuente: string
    topicId?: string
  }> = []

  // Patrones comunes en PDFs de DEMRE
  // Nota: Estos patrones pueden necesitar ajuste según el formato real del PDF

  // Intentar encontrar preguntas numeradas (1., 2., etc.)
  const questionPattern = /(\d+)\.\s+([\s\S]+?)(?=\d+\.|$)/g
  const matches = Array.from(text.matchAll(questionPattern))

  for (const match of matches) {
    const questionNumber = match[1]
    const questionText = match[2].trim()

    // Intentar encontrar opciones (A), B), C), D), E))
    const optionPattern = /([A-E])\)\s+(.+?)(?=[A-E]\)|$)/g
    const optionMatches = Array.from(questionText.matchAll(optionPattern))

    if (optionMatches.length >= 4) {
      // Extraer enunciado (todo antes de las opciones)
      const enunciado = questionText.split(/[A-E]\)/)[0].trim()

      // Extraer opciones
      const options = optionMatches.map((opt, index) => {
        const letra = opt[1]
        const texto = opt[2].trim()
        // Por defecto, la primera opción es correcta (esto debe ajustarse manualmente o con IA)
        const esCorrecta = index === 0 // TEMPORAL: debe detectarse correctamente

        return { letra, texto, esCorrecta }
      })

      // Solo agregar si tiene al menos 4 opciones
      if (options.length >= 4) {
        questions.push({
          enunciado,
          options,
          dificultad: 2, // Por defecto, puede ajustarse
          explicacion: `Respuesta correcta: ${options.find(o => o.esCorrecta)?.letra || 'A'}`,
          fuente: `DEMRE PAES ${new Date().getFullYear()}`,
        })
      }
    }
  }

  return questions
}

/**
 * Mapear pregunta a tema basado en palabras clave
 */
async function mapQuestionToTopic(
  question: { enunciado: string },
  subjectId: string
): Promise<string | null> {
  const topics = await prisma.topic.findMany({
    where: { subjectId },
  })

  // Buscar tema por palabras clave en el enunciado
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

  // Si no se encuentra, usar el primer tema de la asignatura
  return topics.length > 0 ? topics[0].id : null
}

/**
 * Importar examen desde URL de PDF
 */
async function importExamFromPDF(
  pdfUrl: string,
  subjectName: string,
  examTitle: string,
  examType: string = 'oficial',
  year: string = new Date().getFullYear().toString()
) {
  console.log(`\n📥 Descargando PDF: ${examTitle}`)
  console.log(`   URL: ${pdfUrl}`)

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

  // Descargar PDF
  const pdfFileName = `${subjectCode}_${year}_${Date.now()}.pdf`
  const pdfPath = path.join(PDFS_DIR, pdfFileName)

  try {
    await downloadFile(pdfUrl, pdfPath)
    console.log(`✅ PDF descargado: ${pdfFileName}`)
  } catch (error) {
    console.error(`❌ Error descargando PDF:`, error)
    throw error
  }

  // Extraer texto del PDF
  console.log(`📄 Extrayendo texto del PDF...`)
  const text = await extractTextFromPDF(pdfPath)
  console.log(`✅ Texto extraído (${text.length} caracteres)`)

  // Parsear preguntas
  console.log(`🔍 Parseando preguntas...`)
  const parsedQuestions = parseQuestionsFromText(text, subjectCode)
  console.log(`✅ ${parsedQuestions.length} preguntas encontradas`)

  if (parsedQuestions.length === 0) {
    console.warn(`⚠️  No se encontraron preguntas. El formato del PDF puede ser diferente.`)
    console.warn(`   Puede ser necesario ajustar los patrones de parsing.`)
    return
  }

  // Crear preguntas en la BD
  console.log(`💾 Guardando preguntas en la base de datos...`)
  const createdQuestions = []

  for (const parsedQ of parsedQuestions) {
    // Mapear a tema
    const topicId = await mapQuestionToTopic(parsedQ, subject.id)

    // Crear pregunta
    const question = await prisma.question.create({
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

    createdQuestions.push(question)
  }

  console.log(`✅ ${createdQuestions.length} preguntas creadas`)

  // Crear examen
  console.log(`📝 Creando examen...`)
  const exam = await prisma.exam.create({
    data: {
      subjectId: subject.id,
      titulo: examTitle,
      descripcion: `Examen oficial PAES ${year} - ${subjectName}`,
      tipo: examType,
      tiempoLimiteMin: subjectCode === 'LECTORA' ? 90 : subjectCode === 'M1' ? 135 : 120,
      totalPreguntas: createdQuestions.length,
      fuente: `DEMRE ${year}`,
      questions: {
        create: createdQuestions.map((q, index) => ({
          questionId: q.id,
          orden: index + 1,
        })),
      },
    },
  })

  console.log(`✅ Examen creado: ${exam.titulo} (ID: ${exam.id})`)
  console.log(`   Total de preguntas: ${exam.totalPreguntas}`)

  return exam
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando importación de exámenes desde DEMRE\n')

  // Crear directorios
  await ensureDirectories()

  // Ejemplo de uso:
  // Puedes proporcionar URLs directas a PDFs de DEMRE

  const examsToImport: Array<{
    pdfUrl: string
    subjectName: string
    examTitle: string
    examType: string
    year: string
  }> = [
    // Ejemplo: Agregar aquí las URLs de los PDFs que quieres importar
    // {
    //   pdfUrl: 'https://demre.cl/publicaciones/2026/pruebas-oficiales-y-seleccion-preguntas-paes/...',
    //   subjectName: 'Competencia Lectora',
    //   examTitle: 'PAES 2026 - Competencia Lectora (Oficial)',
    //   examType: 'oficial',
    //   year: '2026'
    // },
  ]

  if (examsToImport.length === 0) {
    console.log('📋 No hay exámenes configurados para importar.')
    console.log('\n💡 Para usar este script:')
    console.log(
      '   1. Visita https://demre.cl/publicaciones/2026/pruebas-oficiales-y-seleccion-preguntas-paes'
    )
    console.log('   2. Encuentra los enlaces a los PDFs de los exámenes')
    console.log('   3. Agrega las URLs en el array `examsToImport` en este script')
    console.log('   4. Ejecuta: npx tsx scripts/import-demre-exams.ts')
    console.log(
      '\n⚠️  Nota: El parsing automático puede necesitar ajustes según el formato del PDF.'
    )
    return
  }

  for (const examConfig of examsToImport) {
    try {
      await importExamFromPDF(
        examConfig.pdfUrl,
        examConfig.subjectName,
        examConfig.examTitle,
        examConfig.examType,
        examConfig.year
      )
    } catch (error) {
      console.error(`❌ Error importando ${examConfig.examTitle}:`, error)
      console.error('   Continuando con el siguiente...\n')
    }
  }

  console.log('\n✅ Importación completada!')
}

// Ejecutar
main()
  .catch(error => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
