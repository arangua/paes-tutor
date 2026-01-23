/**
 * Script para analizar la congruencia entre el clavijero DEMRE y la prueba oficial
 * Objetivo: Verificar que el clavijero contiene todas las preguntas operativas
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { PDFParse } from 'pdf-parse'

interface ClaveItem {
  numero: number
  letra: string
  esPiloto: boolean // Marcado con asterisco
}

interface AnalisisResult {
  totalItems: number
  itemsOperativos: number
  itemsPiloto: number
  itemsConAsterisco: number[]
  rangoOperativo: { min: number; max: number }
  rangoPiloto: { min: number; max: number } | null
  textoCompleto: string
}

async function analizarClavijero(pdfPath: string): Promise<AnalisisResult & { textoCompletoPDF: string }> {
  console.log(`📄 Analizando clavijero: ${pdfPath}\n`)

  if (!existsSync(pdfPath)) {
    throw new Error(`El archivo no existe: ${pdfPath}`)
  }

  const dataBuffer = readFileSync(pdfPath)
  const parser = new PDFParse({ data: dataBuffer })
  await parser.load()
  const result = await parser.getText()
  const text = result.text

  // Buscar sección CLAVES usando el mismo patrón que funciona en test-pdf-answer-key.ts
  const claveSection = text.match(/CLAVES[\s\S]*?(?=En el clavijero)/i)
  
  if (!claveSection) {
    // Intentar con patrón alternativo
    const claveSectionAlt = text.match(/CLAVES[\s\S]+?(?=En el clavijero|$)/i)
    if (!claveSectionAlt) {
      throw new Error('No se encontró la sección CLAVES en el PDF')
    }
    var claveText = claveSectionAlt[0]
  } else {
    var claveText = claveSection[0]
  }
  
  // Extraer todas las claves usando los mismos patrones que funcionan en el endpoint
  const items: ClaveItem[] = []
  
  // Múltiples patrones para detectar respuestas (mismos que en route.ts)
  const answerPatterns = [
    // Formato de tabla DEMRE: "Nº	Clave" con tabs/espacios múltiples
    /^(\d+)[\*\s\t]+\b([A-E])\b/gm, // Línea completa: número, espacios/tabs/asterisco, letra
    /(\d+)[\*\s\t]{2,}([A-E])\b/g, // Múltiples espacios/tabs entre número y letra
  ]
  
  for (const pattern of answerPatterns) {
    try {
      const matches = Array.from(claveText.matchAll(pattern))
      for (const match of matches) {
        if (!match || !Array.isArray(match) || match.length < 3 || !match[1] || !match[2]) {
          continue
        }
        
        const numero = parseInt(match[1], 10)
        const letra = match[2].toUpperCase()
        const tieneAsterisco = match[0].includes('*')
        
        // Evitar duplicados
        if (!items.find(item => item.numero === numero)) {
          items.push({
            numero,
            letra,
            esPiloto: tieneAsterisco,
          })
        }
      }
    } catch {
      // Continuar con el siguiente patrón
    }
  }

  // Ordenar por número
  items.sort((a, b) => a.numero - b.numero)

  const itemsOperativos = items.filter(item => !item.esPiloto)
  const itemsPiloto = items.filter(item => item.esPiloto)
  const itemsConAsterisco = itemsPiloto.map(item => item.numero)

  const numerosOperativos = itemsOperativos.map(item => item.numero)
  const numerosPiloto = itemsPiloto.map(item => item.numero)

  return {
    totalItems: items.length,
    itemsOperativos: itemsOperativos.length,
    itemsPiloto: itemsPiloto.length,
    itemsConAsterisco,
    rangoOperativo: {
      min: Math.min(...numerosOperativos),
      max: Math.max(...numerosOperativos),
    },
    rangoPiloto: numerosPiloto.length > 0
      ? {
          min: Math.min(...numerosPiloto),
          max: Math.max(...numerosPiloto),
        }
      : null,
    textoCompleto: claveText,
    textoCompletoPDF: text,
  }
}

function generarReporte(analisis: AnalisisResult & { textoCompletoPDF: string }) {
  console.log('═'.repeat(80))
  console.log('📊 ANÁLISIS DE CONGRUENCIA: CLAVIJERO DEMRE M1 2026')
  console.log('═'.repeat(80))
  console.log()

  console.log('1️⃣ NÚMERO TOTAL DE ÍTEMS DEL INSTRUMENTO')
  console.log(`   Total de ítems en el clavijero: ${analisis.totalItems}`)
  console.log()

  console.log('2️⃣ CLASIFICACIÓN DE ÍTEMS')
  console.log(`   ✅ Ítems operativos (puntuables): ${analisis.itemsOperativos}`)
  console.log(`   🧪 Ítems piloto (no puntuables): ${analisis.itemsPiloto}`)
  console.log()

  if (analisis.itemsPiloto > 0) {
    console.log('3️⃣ ÍTEMS PILOTO IDENTIFICADOS')
    console.log(`   Números marcados con asterisco (*): ${analisis.itemsConAsterisco.join(', ')}`)
    console.log(`   Rango operativo: ${analisis.rangoOperativo.min} - ${analisis.rangoOperativo.max}`)
    if (analisis.rangoPiloto) {
      console.log(`   Rango piloto: ${analisis.rangoPiloto.min} - ${analisis.rangoPiloto.max}`)
    }
    console.log()
  }

  console.log('4️⃣ VERIFICACIÓN DE CONSISTENCIA')
  const totalEsperado = analisis.itemsOperativos + analisis.itemsPiloto
  if (totalEsperado === analisis.totalItems) {
    console.log(`   ✅ La suma de operativos + piloto = total (${analisis.itemsOperativos} + ${analisis.itemsPiloto} = ${analisis.totalItems})`)
  } else {
    console.log(`   ⚠️ Discrepancia: ${analisis.itemsOperativos} + ${analisis.itemsPiloto} ≠ ${analisis.totalItems}`)
  }
  console.log()

  // Buscar información sobre el número de preguntas publicadas en el texto completo
  const textoCompletoPDF = analisis.textoCompletoPDF
  const mencionesPreguntas = [
    ...textoCompletoPDF.matchAll(/(\d+)\s+preguntas?/gi),
    ...textoCompletoPDF.matchAll(/preguntas?\s+(\d+)/gi),
    ...textoCompletoPDF.matchAll(/tiene\s+(\d+)\s+preguntas?/gi),
    ...textoCompletoPDF.matchAll(/(\d+)\s+de\s+ellas/gi),
    ...textoCompletoPDF.matchAll(/solo\s+(\d+)/gi),
  ]
  
  if (mencionesPreguntas.length > 0) {
    console.log('5️⃣ INFORMACIÓN ADICIONAL EN EL DOCUMENTO')
    const numerosMencionados = [...new Set(mencionesPreguntas.map(m => parseInt(m[1], 10)))]
    console.log(`   Números de preguntas mencionados: ${numerosMencionados.join(', ')}`)
    
    // Buscar contexto específico sobre preguntas publicadas vs totales
    const contextoPublicadas = textoCompletoPDF.match(/(\d+)\s+preguntas?[^.]*publicadas?/i)
    const contextoTotales = textoCompletoPDF.match(/tiene\s+(\d+)\s+preguntas?/i)
    const contextoUsadas = textoCompletoPDF.match(/solo\s+(\d+)[^.]*utilizan?/i)
    
    if (contextoPublicadas) {
      console.log(`   Preguntas publicadas mencionadas: ${contextoPublicadas[1]}`)
    }
    if (contextoTotales) {
      console.log(`   Total de preguntas mencionado: ${contextoTotales[1]}`)
    }
    if (contextoUsadas) {
      console.log(`   Preguntas utilizadas mencionadas: ${contextoUsadas[1]}`)
    }
    console.log()
  }

  // Buscar información sobre puntaje
  const mencionesPuntaje = analisis.textoCompleto.match(/Puntaje\s+P[:\s]+(\d+)/i)
  if (mencionesPuntaje) {
    console.log('6️⃣ INFORMACIÓN SOBRE PUNTAJE')
    console.log(`   Puntaje P mencionado: ${mencionesPuntaje[1]}`)
    console.log()
  }

  console.log('═'.repeat(80))
  console.log('📋 PREVIEW DEL TEXTO DEL CLAVIJERO (primeros 500 caracteres)')
  console.log('─'.repeat(80))
  console.log(analisis.textoCompleto.substring(0, 500))
  console.log('─'.repeat(80))
  console.log()
}

async function main() {
  const pdfPath = join(
    process.cwd(),
    'data',
    'test-pdfs',
    '2026-26-01-05-clavijero-paes-regular-m1.pdf'
  )

  try {
    const analisis = await analizarClavijero(pdfPath)
    generarReporte(analisis)

    // Análisis específico para M1
    console.log('═'.repeat(80))
    console.log('🎯 ANÁLISIS ESPECÍFICO: M1 ADMISIÓN 2026')
    console.log('═'.repeat(80))
    console.log()

    console.log('PREGUNTA CLAVE: ¿El clavijero contiene 45 preguntas operativas?')
    console.log()

    if (analisis.itemsOperativos === 45) {
      console.log('✅ SÍ: El clavijero contiene exactamente 45 ítems operativos')
      console.log('   Esto coincide con el número de preguntas publicadas en la prueba oficial.')
    } else {
      console.log(`⚠️ NO: El clavijero contiene ${analisis.itemsOperativos} ítems operativos`)
      console.log(`   Diferencia: ${Math.abs(analisis.itemsOperativos - 45)} ítems`)
    }
    console.log()

    console.log('VERIFICACIÓN DE ÍTEMS PILOTO:')
    if (analisis.itemsPiloto > 0) {
      console.log(`   ✅ Se identificaron ${analisis.itemsPiloto} ítems piloto (marcados con *)`)
      console.log(`   ✅ Estos ítems NO inciden en el puntaje (práctica psicométrica estándar)`)
    } else {
      console.log('   ⚠️ No se identificaron ítems piloto en el clavijero')
    }
    console.log()

    console.log('CONCLUSIÓN TÉCNICA:')
    console.log('─'.repeat(80))
    
    const esCongruente = analisis.itemsOperativos === 45
    const tienePiloto = analisis.itemsPiloto > 0
    
    if (esCongruente && tienePiloto) {
      console.log('✅ CONGRUENCIA CONFIRMADA')
      console.log('   - El clavijero contiene exactamente 45 ítems operativos')
      console.log('   - Los ítems piloto están claramente identificados (asterisco)')
      console.log('   - Un postulante puede revisar todas sus respuestas puntuables')
      console.log('   - El diseño es consistente con prácticas psicométricas estándar')
    } else if (esCongruente && !tienePiloto) {
      console.log('⚠️ CONGRUENCIA PARCIAL')
      console.log('   - El clavijero contiene 45 ítems operativos')
      console.log('   - No se identificaron ítems piloto (puede que no haya o no estén marcados)')
      console.log('   - Un postulante puede revisar todas sus respuestas puntuables')
    } else {
      console.log('❌ DISCREPANCIA DETECTADA')
      console.log(`   - El clavijero contiene ${analisis.itemsOperativos} ítems operativos`)
      console.log(`   - Se esperaban 45 ítems operativos`)
      console.log(`   - Diferencia: ${Math.abs(analisis.itemsOperativos - 45)} ítems`)
      console.log('   - Se requiere revisión adicional de los documentos oficiales')
    }
    
    console.log('─'.repeat(80))
    console.log()

  } catch (error) {
    console.error('❌ Error al analizar el clavijero:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

main()
