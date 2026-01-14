#!/usr/bin/env ts-node
/**
 * Script de Migración de Validaciones
 * 
 * Migra automáticamente patrones comunes de validación a usar las funciones
 * centralizadas de validation-utils.ts
 * 
 * Uso:
 *   npm run migrate-validations -- --dry-run  # Ver cambios sin aplicar
 *   npm run migrate-validations               # Aplicar cambios
 *   npm run migrate-validations -- --file src/app/api/analytics/route.ts  # Solo un archivo
 */

import * as fs from 'fs'
import { glob } from 'glob'

interface MigrationPattern {
  name: string
  description: string
  search: RegExp
  replace: string | ((match: string, ...args: string[]) => string)
  requiresImport: boolean
  importItems: string[]
  testBefore?: (content: string) => boolean
  testAfter?: (content: string) => boolean
}

const VALIDATION_UTILS_PATH = '@/app/api/notes/versions/validation-utils'

const patterns: MigrationPattern[] = [
  {
    name: 'Math.round with multiplication and division',
    description: 'Math.round(value * 10) / 10 → safeRound(value, 1)',
    search: /Math\.round\(\s*(\w+)\s*\*\s*10\s*\)\s*\/\s*10/g,
    replace: 'safeRound($1, 1)',
    requiresImport: true,
    importItems: ['safeRound'],
  },
  {
    name: 'Math.round with multiplication and division (2 decimals)',
    description: 'Math.round(value * 100) / 100 → safeRound(value, 2)',
    search: /Math\.round\(\s*(\w+)\s*\*\s*100\s*\)\s*\/\s*100/g,
    replace: 'safeRound($1, 2)',
    requiresImport: true,
    importItems: ['safeRound'],
  },
  {
    name: 'Array reduce divided by length',
    description: 'array.reduce(...) / array.length → safeAverage(array)',
    search: /(\w+)\.reduce\(\s*\([^)]*\)\s*=>\s*[^,]+,\s*0\s*\)\s*\/\s*\1\.length/g,
    replace: 'safeAverage($1)',
    requiresImport: true,
    importItems: ['safeAverage'],
    testBefore: (content) => {
      // Solo aplicar si el reduce suma números
      return /\.reduce\(\s*\([^)]*\)\s*=>\s*[^,]+(?:\+\s*\w+|\w+\s*\+)/.test(content)
    },
  },
  {
    name: 'Math.max with spread operator',
    description: 'Math.max(...array) → safeMathMax(array)',
    search: /Math\.max\(\s*\.\.\.\s*(\w+)\s*\)/g,
    replace: 'safeMathMax($1)',
    requiresImport: true,
    importItems: ['safeMathMax'],
  },
  {
    name: 'Math.min with spread operator',
    description: 'Math.min(...array) → safeMathMin(array)',
    search: /Math\.min\(\s*\.\.\.\s*(\w+)\s*\)/g,
    replace: 'safeMathMin($1)',
    requiresImport: true,
    importItems: ['safeMathMin'],
  },
  {
    name: 'Date toISOString without validation',
    description: 'date.toISOString() → safeToISOString(date)',
    search: /(\w+)\.toISOString\(\)/g,
    replace: 'safeToISOString($1)',
    requiresImport: true,
    importItems: ['safeToISOString'],
    testBefore: (content) => {
      // Solo aplicar si no está ya envuelto en validación
      const match = content.match(/(\w+)\.toISOString\(\)/)
      if (!match) return false
      const before = content.substring(Math.max(0, content.indexOf(match[0]) - 100), content.indexOf(match[0]))
      // No aplicar si ya hay validación o safeToISOString
      return !before.includes('safeToISOString') && !before.includes('instanceof Date')
    },
  },
]

interface MigrationResult {
  file: string
  patternsApplied: string[]
  importAdded: boolean
  changes: number
  success: boolean
  error?: string
}

function ensureImport(content: string, importItems: string[]): { content: string; added: boolean } {
  const importPath = VALIDATION_UTILS_PATH
  const importStatement = `import { ${importItems.join(', ')} } from '${importPath}'`
  
  // Verificar si ya existe el import
  const existingImportRegex = new RegExp(`import\\s*\\{[^}]*\\}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g')
  if (existingImportRegex.test(content)) {
    // Verificar si faltan items
    const existingMatch = content.match(existingImportRegex)
    if (existingMatch) {
      const itemsMatch = existingMatch[0].match(/\{([^}]+)\}/)
      if (itemsMatch && itemsMatch[1]) {
        const existingItems = itemsMatch[1].split(',').map(s => s.trim())
        const missingItems = importItems.filter(item => !existingItems.includes(item))
        
        if (missingItems.length > 0) {
          // Agregar items faltantes
          const newImport = existingMatch[0].replace(/\{([^}]+)\}/, `{ $1, ${missingItems.join(', ')} }`)
          content = content.replace(existingImportRegex, newImport)
          return { content, added: true }
        }
      }
    }
    return { content, added: false }
  }
  
  // Buscar el último import para insertar después
  const importLines = content.split('\n')
  let lastImportIndex = -1
  
  for (let i = importLines.length - 1; i >= 0; i--) {
    const line = importLines[i]
    if (line && line.trim().startsWith('import ')) {
      lastImportIndex = i
      break
    }
  }
  
  if (lastImportIndex >= 0) {
    importLines.splice(lastImportIndex + 1, 0, importStatement)
    return { content: importLines.join('\n'), added: true }
  } else {
    // No hay imports, agregar al inicio
    return { content: importStatement + '\n' + content, added: true }
  }
}

function migrateFile(filePath: string, dryRun: boolean = false): MigrationResult {
  const result: MigrationResult = {
    file: filePath,
    patternsApplied: [],
    importAdded: false,
    changes: 0,
    success: false,
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    const originalContent = content
    const neededImports = new Set<string>()
    
    for (const pattern of patterns) {
      // Verificar testBefore si existe
      if (pattern.testBefore && !pattern.testBefore(content)) {
        continue
      }
      
      const matches = content.match(pattern.search)
      if (matches && matches.length > 0) {
        // Aplicar reemplazo
        if (typeof pattern.replace === 'function') {
          // pattern.replace es una función que recibe match y retorna string
          content = content.replace(pattern.search, pattern.replace as (match: string, ...args: unknown[]) => string)
        } else {
          content = content.replace(pattern.search, pattern.replace)
        }
        
        // Verificar testAfter si existe
        if (pattern.testAfter && !pattern.testAfter(content)) {
          // Revertir cambio si testAfter falla
          content = originalContent
          continue
        }
        
        result.patternsApplied.push(pattern.name)
        result.changes += matches.length
        
        if (pattern.requiresImport) {
          pattern.importItems.forEach(item => neededImports.add(item))
        }
      }
    }
    
    // Agregar imports si es necesario
    if (neededImports.size > 0) {
      const importResult = ensureImport(content, Array.from(neededImports))
      content = importResult.content
      result.importAdded = importResult.added
    }
    
    // Aplicar cambios si no es dry-run
    if (!dryRun && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8')
    }
    
    result.success = content !== originalContent
    
    return result
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error)
    return result
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const fileArg = args.find(arg => arg.startsWith('--file='))
  const specificFile = fileArg ? fileArg.split('=')[1] : null
  
  console.log('🔍 Buscando archivos para migrar...\n')
  
  const files = specificFile
    ? [specificFile]
    : await glob('src/app/api/**/*.ts', {
        ignore: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**'],
      })
  
  console.log(`📁 Encontrados ${files.length} archivos\n`)
  
  if (dryRun) {
    console.log('🔍 MODO DRY-RUN: No se aplicarán cambios\n')
  }
  
  const results: MigrationResult[] = []
  let totalChanges = 0
  let filesChanged = 0
  
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  Archivo no existe: ${file}`)
      continue
    }
    
    const result = migrateFile(file, dryRun)
    results.push(result)
    
    if (result.success) {
      filesChanged++
      totalChanges += result.changes
      console.log(`✅ ${file}`)
      console.log(`   Patrones aplicados: ${result.patternsApplied.join(', ')}`)
      console.log(`   Cambios: ${result.changes}`)
      if (result.importAdded) {
        console.log(`   Import agregado: ✓`)
      }
      console.log()
    } else if (result.error) {
      console.log(`❌ ${file}`)
      console.log(`   Error: ${result.error}\n`)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMEN')
  console.log('='.repeat(60))
  console.log(`Archivos procesados: ${files.length}`)
  console.log(`Archivos modificados: ${filesChanged}`)
  console.log(`Total de cambios: ${totalChanges}`)
  
  if (dryRun) {
    console.log('\n💡 Ejecuta sin --dry-run para aplicar los cambios')
  } else {
    console.log('\n✨ Migración completada')
    console.log('⚠️  Recuerda ejecutar tests y revisar los cambios')
  }
  
  // Guardar reporte
  const reportPath = 'migration-report.json'
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ dryRun, results, summary: { totalFiles: files.length, filesChanged, totalChanges } }, null, 2),
    'utf-8'
  )
  console.log(`\n📄 Reporte guardado en: ${reportPath}`)
}

main().catch(console.error)

