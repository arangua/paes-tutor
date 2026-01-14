/**
 * Script de prueba para PDF real de clavijero
 * 
 * Coloca el PDF en: data/test-pdfs/clavijero-m1.pdf
 * Luego ejecuta: npx tsx scripts/test-pdf-answer-key.ts
 */

import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { PDFParse } from 'pdf-parse'

// Copiar la función detectCorrectAnswers del endpoint
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
  // Nota: normalizedText se eliminó porque no se usaba; el código usa answerSection directamente

  // Si no se encuentra una sección específica, buscar en el último 30% del texto
  // (las respuestas suelen estar al final del documento)
  if (!answerSection && typeof safeText === 'string' && safeText.length > 0) {
    const textLength = typeof safeText === 'string' && Number.isFinite(safeText.length) ? safeText.length : 0
    if (textLength > 0) {
      const floorResult = Math.floor(textLength * 0.7)
      if (Number.isFinite(floorResult) && floorResult >= 0 && floorResult <= textLength) {
        try {
          const lastSection = safeText.substring(floorResult)
          if (typeof lastSection === 'string') {
            answerSection = lastSection
          }
        } catch {
          answerSection = safeText // Fallback
        }
      } else {
        answerSection = safeText // Fallback
      }
    } else {
      answerSection = safeText // Fallback
    }
  }

  // Si aún no hay sección, usar todo el texto (último recurso)
  if (!answerSection || answerSection.length === 0) {
    answerSection = safeText
  }

  // Múltiples patrones para detectar respuestas (ordenados por especificidad)
  // IMPORTANTE: Patrones más específicos primero para evitar falsos positivos
  const answerPatterns = [
    // Formato de tabla DEMRE: "Nº	Clave" con tabs/espacios múltiples (ej: "1 	B" o "1\tB")
    // Este formato es muy común en clavijeros oficiales de DEMRE
    // Patrón específico para tabla: número, espacios/tabs múltiples, letra (puede tener asterisco)
    /^(\d+)[\*\s\t]+\b([A-E])\b/gm, // Línea completa: número, espacios/tabs/asterisco, letra
    /(\d+)[\*\s\t]{2,}([A-E])\b/g, // Múltiples espacios/tabs entre número y letra (más de 2)
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
    /(\d+)[\s\-]+([A-E])(?=\s|$|,|\.)/g,
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

async function testPDF(pdfPath: string) {
  console.log(`📄 Leyendo PDF: ${pdfPath}\n`)

  if (!existsSync(pdfPath)) {
    console.error(`❌ El archivo no existe: ${pdfPath}`)
    console.log(`\n💡 Coloca tu PDF en: ${pdfPath}`)
    process.exit(1)
  }

  try {
    // Leer PDF
    const dataBuffer = readFileSync(pdfPath)
    
    // Validar header PDF
    const pdfHeader = dataBuffer.subarray(0, 4).toString()
    if (pdfHeader !== '%PDF') {
      console.error('❌ El archivo no parece ser un PDF válido')
      process.exit(1)
    }

    console.log(`✅ PDF válido (${dataBuffer.length} bytes)\n`)

    // Extraer texto
    console.log('📖 Extrayendo texto del PDF...')
    const parser = new PDFParse({ data: dataBuffer })
    await parser.load()
    const result = await parser.getText()
    const text = result.text

    if (!text || text.trim().length === 0) {
      console.error('❌ El PDF no contiene texto extraíble')
      process.exit(1)
    }

    console.log(`✅ Texto extraído: ${text.length} caracteres\n`)

    // Mostrar preview del texto (últimos 2000 caracteres)
    const preview = text.substring(Math.max(0, text.length - 2000))
    console.log('📋 Preview del texto (últimos 2000 caracteres):')
    console.log('─'.repeat(80))
    console.log(preview)
    console.log('─'.repeat(80))
    console.log()

    // Detectar respuestas
    console.log('🔍 Detectando respuestas...')
    
    // Debug: verificar si se encuentra la sección CLAVES
    // El patrón debe capturar desde "CLAVES" hasta "En el clavijero"
    const claveMatch = text.match(/CLAVES[\s\S]*?(?=En el clavijero|Ejemplo de cálculo|TABLA DE TRANSFORMACIÓN|-- \d+ of \d+ --|$)/i)
    if (claveMatch) {
      console.log(`✅ Sección CLAVES encontrada (${claveMatch[0].length} caracteres)`)
      // Mostrar más contexto para debug
      const preview = claveMatch[0].substring(0, 400)
      console.log(`   Preview (primeros 400 chars):`)
      console.log(`   ${preview.replace(/\n/g, '\\n').substring(0, 200)}...`)
    } else {
      console.log(`⚠️ Sección CLAVES no encontrada con el patrón`)
      // Intentar encontrar manualmente
      const claveIndex = text.indexOf('CLAVES')
      if (claveIndex >= 0) {
        const nextSection = text.indexOf('En el clavijero', claveIndex)
        if (nextSection > claveIndex) {
          console.log(`   Pero "CLAVES" existe en posición ${claveIndex}, y "En el clavijero" en ${nextSection}`)
          console.log(`   Distancia: ${nextSection - claveIndex} caracteres`)
        }
      }
    }
    
    const answers = detectCorrectAnswers(text)

    console.log(`\n📊 Resultados:`)
    console.log(`   Respuestas detectadas: ${answers.size}`)

    if (answers.size === 0) {
      console.log(`\n❌ No se detectaron respuestas`)
      console.log(`\n💡 Posibles causas:`)
      console.log(`   - El formato del PDF es diferente a los esperados`)
      console.log(`   - Las respuestas están en una sección no reconocida`)
      console.log(`   - El PDF está escaneado (imagen) en lugar de texto`)
      console.log(`\n📋 Revisa el preview del texto arriba para identificar el formato`)
    } else {
      console.log(`\n✅ Respuestas detectadas:`)
      const sortedAnswers = Array.from(answers.entries()).sort((a, b) => a[0] - b[0])
      for (const [num, letter] of sortedAnswers) {
        console.log(`   ${num}: ${letter}`)
      }
      
      // Mostrar rango
      const nums = sortedAnswers.map(([n]) => n)
      if (nums.length > 0) {
        console.log(`\n📈 Rango: ${Math.min(...nums)} - ${Math.max(...nums)}`)
      }
    }

  } catch (error) {
    console.error('❌ Error al procesar PDF:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Ejecutar
const testPdfDir = join(process.cwd(), 'data', 'test-pdfs')

// Buscar PDF de M1 (puede tener diferentes nombres)
const pdfFiles = existsSync(testPdfDir)
  ? require('fs').readdirSync(testPdfDir).filter((f: string) => 
      f.toLowerCase().includes('m1') && f.toLowerCase().endsWith('.pdf')
    )
  : []

let pdfPath: string

if (pdfFiles.length > 0) {
  // Usar el primer PDF de M1 encontrado
  pdfPath = join(testPdfDir, pdfFiles[0])
  console.log(`📄 PDF encontrado: ${pdfFiles[0]}\n`)
} else {
  // Fallback al nombre esperado
  pdfPath = join(testPdfDir, 'clavijero-m1.pdf')
  console.log(`📄 Buscando PDF: clavijero-m1.pdf\n`)
  
  // Crear directorio si no existe
  if (!existsSync(testPdfDir)) {
    mkdirSync(testPdfDir, { recursive: true })
    console.log(`📁 Directorio creado: ${testPdfDir}\n`)
  }
}

testPDF(pdfPath)
  .then(() => {
    console.log('\n✅ Prueba completada')
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
