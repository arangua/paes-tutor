/**
 * Script de depuración para ver exactamente qué está pasando con los patrones
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PDFParse } from 'pdf-parse'

const pdfPath = join(process.cwd(), 'data', 'test-pdfs', '2026-26-01-05-clavijero-paes-regular-m1.pdf')

async function debug() {
  const dataBuffer = readFileSync(pdfPath)
  const parser = new PDFParse({ data: dataBuffer })
  await parser.load()
  const result = await parser.getText()
  const text = result.text

  // Buscar la sección de CLAVES
  const claveSection = text.match(/CLAVES[\s\S]+?(?=En el clavijero|$)/i)
  
  if (claveSection) {
    console.log('📋 Sección CLAVES encontrada:')
    console.log('─'.repeat(80))
    console.log(claveSection[0])
    console.log('─'.repeat(80))
    console.log()
    
    // Mostrar caracteres especiales
    console.log('🔍 Analizando caracteres especiales:')
    const sample = claveSection[0].substring(0, 200)
    console.log('Primeros 200 caracteres (con códigos):')
    for (let i = 0; i < sample.length; i++) {
      const char = sample[i]
      const code = char.charCodeAt(0)
      if (code === 9) {
        console.log(`  [${i}]: TAB (\\t)`)
      } else if (code === 32) {
        console.log(`  [${i}]: SPACE`)
      } else if (code > 127) {
        console.log(`  [${i}]: '${char}' (code: ${code})`)
      }
    }
    console.log()
    
    // Probar patrones específicos
    console.log('🧪 Probando patrones:')
    
    const patterns = [
      { name: 'Tabla DEMRE (tabs)', pattern: /^(\d+)[\*\s\t]+\b([A-E])\b/gm },
      { name: 'Tabla DEMRE (múltiples espacios)', pattern: /(\d+)[\*\s\t]{2,}([A-E])\b/g },
      { name: 'Número-espacio-letra', pattern: /(\d+)\s+([A-E])\b/g },
    ]
    
    for (const { name, pattern } of patterns) {
      const matches = Array.from(claveSection[0].matchAll(pattern))
      console.log(`  ${name}: ${matches.length} matches`)
      if (matches.length > 0) {
        console.log(`    Primeros 5:`, matches.slice(0, 5).map(m => `${m[1]}-${m[2]}`))
      }
    }
  } else {
    console.log('❌ No se encontró sección CLAVES')
  }
}

debug().catch(console.error)
