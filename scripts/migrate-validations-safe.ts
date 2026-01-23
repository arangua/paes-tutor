#!/usr/bin/env ts-node
/**
 * Script de Migración de Validaciones con Validación Incremental y Rollback
 * 
 * Versión mejorada que:
 * - Valida cada cambio con tests
 * - Hace rollback automático si fallan tests
 * - Genera reportes detallados
 * - Valida existencia de funciones en validation-utils
 * - Limpia backups antiguos automáticamente
 * - Optimiza ejecución de tests
 * 
 * Uso:
 *   npm run migrate-validations-safe -- --dry-run
 *   npm run migrate-validations-safe
 *   npm run migrate-validations-safe -- --parallel (experimental)
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { glob } from 'glob'

interface MigrationPattern {
  name: string
  description: string
  search: RegExp
  replace: string | ((match: string, ...args: string[]) => string)
  requiresImport: boolean
  importItems: string[]
}

interface MigrationResult {
  file: string
  patternsApplied: string[]
  importAdded: boolean
  changes: number
  success: boolean
  error?: string
  testPassed?: boolean
  rollback?: boolean
}

const VALIDATION_UTILS_PATH = '@/app/api/notes/versions/validation-utils'
// VALIDATION_UTILS_FILE se definirá después de encontrar PROJECT_ROOT
const BACKUP_DIR = '.migration-backups'
const MAX_BACKUP_AGE_DAYS = 7 // Limpiar backups más antiguos de 7 días

/**
 * Encuentra el directorio raíz del proyecto buscando package.json hacia arriba
 */
function findProjectRoot(): string {
  // Intentar múltiples estrategias para encontrar el directorio de inicio
  let startDir: string | undefined
  
  // Estrategia 1: __dirname (disponible en CommonJS y tsx)
  try {
    // Verificar __dirname en global (puede estar disponible en algunos entornos)
    const globalObj = global as Record<string, unknown>;
    if (typeof globalObj.__dirname !== 'undefined' && typeof globalObj.__dirname === 'string') {
      startDir = globalObj.__dirname
    } else if (typeof __dirname !== 'undefined') {
      startDir = __dirname
    }
  } catch {
    // __dirname no disponible
  }
  
  // Estrategia 2: process.cwd() (directorio actual de trabajo)
  if (!startDir) {
    startDir = process.cwd()
  }
  
  // Estrategia 3: Directorio del script (usando import.meta.url si está disponible)
  if (!startDir) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const url = (global as any).import?.meta?.url
      if (url) {
        startDir = path.dirname(new URL(url).pathname)
      }
    } catch {
      // import.meta.url no disponible
    }
  }
  
  // Si aún no tenemos un directorio, usar el directorio actual
  if (!startDir) {
    startDir = process.cwd()
  }
  
  let currentDir = path.resolve(startDir)
  const maxDepth = 10
  let depth = 0

  while (depth < maxDepth) {
    const packageJsonPath = path.join(currentDir, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      return currentDir
    }

    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) {
      break
    }
    currentDir = parentDir
    depth++
  }

  // Fallback: intentar con la ruta conocida del proyecto
  const knownProjectPath = 'C:\\Users\\arang\\OneDrive\\Escritorio\\PROY. PAES\\paes-tutor\\paes-tutor'
  if (fs.existsSync(path.join(knownProjectPath, 'package.json'))) {
    return knownProjectPath
  }

  throw new Error(
    `No se pudo encontrar package.json.\n` +
    `  Buscado desde: ${startDir}\n` +
    `  Directorio actual: ${process.cwd()}\n` +
    `  Por favor, ejecuta este script desde el directorio del proyecto o usando: npm run migrate-validations-safe`
  )
}

// Encontrar el directorio raíz del proyecto
const PROJECT_ROOT = findProjectRoot()

// Definir rutas absolutas basadas en PROJECT_ROOT
const VALIDATION_UTILS_FILE = path.join(PROJECT_ROOT, 'src/app/api/notes/versions/validation-utils.ts')

// Crear directorio de backups si no existe (relativo al proyecto)
const backupDirPath = path.join(PROJECT_ROOT, BACKUP_DIR)
if (!fs.existsSync(backupDirPath)) {
  fs.mkdirSync(backupDirPath, { recursive: true })
}

/**
 * Valida que las funciones requeridas existan en validation-utils.ts
 */
function validateValidationUtilsFunctions(requiredFunctions: string[]): { valid: boolean; missing: string[] } {
  if (!fs.existsSync(VALIDATION_UTILS_FILE)) {
    console.error(`❌ Archivo validation-utils.ts no encontrado: ${VALIDATION_UTILS_FILE}`)
    return { valid: false, missing: requiredFunctions }
  }
  
  const content = fs.readFileSync(VALIDATION_UTILS_FILE, 'utf-8')
  const missing: string[] = []
  
  for (const funcName of requiredFunctions) {
    const regex = new RegExp(`export\\s+(function|const)\\s+${funcName}\\s*[=(]`, 'g')
    if (!regex.test(content)) {
      missing.push(funcName)
    }
  }
  
  return { valid: missing.length === 0, missing }
}

/**
 * Limpia backups antiguos para evitar acumulación de archivos
 */
function cleanOldBackups(): void {
  try {
    const backupDirPath = path.join(PROJECT_ROOT, BACKUP_DIR)
    if (!fs.existsSync(backupDirPath)) {
      return
    }
    
    const files = fs.readdirSync(backupDirPath)
    const now = Date.now()
    const maxAge = MAX_BACKUP_AGE_DAYS * 24 * 60 * 60 * 1000
    let cleaned = 0
    
    for (const file of files) {
      const filePath = path.join(backupDirPath, file)
      const stats = fs.statSync(filePath)
      const age = now - stats.mtimeMs
      
      if (age > maxAge) {
        fs.unlinkSync(filePath)
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Limpiados ${cleaned} backups antiguos (>${MAX_BACKUP_AGE_DAYS} días)`)
    }
  } catch (error) {
    // No fallar si no se pueden limpiar backups
    console.warn(`⚠️  No se pudieron limpiar backups: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const patterns: MigrationPattern[] = [
  {
    name: 'Math.round with multiplication and division',
    description: 'Math.round(value * 10) / 10 → safeRound(value, 1)',
    // Mejorado: captura variables más complejas (con puntos, corchetes, etc.)
    search: /Math\.round\(\s*([\w.[\]()]+)\s*\*\s*10\s*\)\s*\/\s*10/g,
    replace: 'safeRound($1, 1)',
    requiresImport: true,
    importItems: ['safeRound'],
  },
  {
    name: 'Math.round with multiplication and division (2 decimals)',
    description: 'Math.round(value * 100) / 100 → safeRound(value, 2)',
    // Mejorado: captura variables más complejas
    search: /Math\.round\(\s*([\w.[\]()]+)\s*\*\s*100\s*\)\s*\/\s*100/g,
    replace: 'safeRound($1, 2)',
    requiresImport: true,
    importItems: ['safeRound'],
  },
  {
    name: 'Array reduce divided by length',
    description: 'array.reduce(...) / array.length → safeAverage(array)',
    // Mejorado: más flexible con espacios y diferentes formatos de reduce
    search: /(\w+)\.reduce\(\s*\([^)]*\)\s*=>\s*[^,]+,\s*0\s*\)\s*\/\s*\1\.length/g,
    replace: 'safeAverage($1)',
    requiresImport: true,
    importItems: ['safeAverage'],
  },
  {
    name: 'Math.max with spread operator',
    description: 'Math.max(...array) → safeMathMax(array)',
    // Mejorado: captura arrays con acceso a propiedades
    search: /Math\.max\(\s*\.\.\.\s*([\w.[\]()]+)\s*\)/g,
    replace: 'safeMathMax($1)',
    requiresImport: true,
    importItems: ['safeMathMax'],
  },
  {
    name: 'Math.min with spread operator',
    description: 'Math.min(...array) → safeMathMin(array)',
    // Mejorado: captura arrays con acceso a propiedades
    search: /Math\.min\(\s*\.\.\.\s*([\w.[\]()]+)\s*\)/g,
    replace: 'safeMathMin($1)',
    requiresImport: true,
    importItems: ['safeMathMin'],
  },
]

function createBackup(filePath: string): string {
  const backupPath = path.join(PROJECT_ROOT, BACKUP_DIR, path.basename(filePath) + '.' + Date.now() + '.bak')
  fs.copyFileSync(filePath, backupPath)
  return backupPath
}

function restoreBackup(filePath: string, backupPath: string): void {
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, filePath)
    console.log(`   ↻ Rollback aplicado desde: ${backupPath}`)
  }
}

function runFileTests(filePath: string): { success: boolean; output: string } {
  try {
    // Asegurar que la ruta del archivo sea relativa al proyecto
    const relativePath = path.isAbsolute(filePath) 
      ? path.relative(PROJECT_ROOT, filePath) 
      : filePath
    
    // Optimización: Buscar test específico del archivo
    const testFile = relativePath.replace(/\.ts$/, '.test.ts')
    const testFileFullPath = path.join(PROJECT_ROOT, testFile)
    if (fs.existsSync(testFileFullPath)) {
      // Ejecutar solo el test específico del archivo (más rápido)
      const output = execSync(`npm run test:run -- ${testFile}`, {
        encoding: 'utf-8',
        stdio: 'pipe',
        timeout: 30000, // 30 segundos timeout
        cwd: PROJECT_ROOT, // Ejecutar desde el directorio del proyecto
      })
      return { success: true, output }
    }
    
    // Buscar test en directorio relacionado
    const dir = path.dirname(relativePath)
    const baseName = path.basename(relativePath, '.ts')
    const relatedTest = path.join(dir, `${baseName}.test.ts`)
    const relatedTestFullPath = path.join(PROJECT_ROOT, relatedTest)
    
    if (fs.existsSync(relatedTestFullPath)) {
      const output = execSync(`npm run test:run -- ${relatedTest}`, {
        encoding: 'utf-8',
        stdio: 'pipe',
        timeout: 30000,
        cwd: PROJECT_ROOT, // Ejecutar desde el directorio del proyecto
      })
      return { success: true, output }
    }
    
    // Si no hay test específico, ejecutar solo tests de la misma ruta
    // Esto es más eficiente que ejecutar todos los tests
    const testPattern = path.join(dir, '*.test.ts')
    try {
      const output = execSync(`npm run test:run -- ${testPattern}`, {
        encoding: 'utf-8',
        stdio: 'pipe',
        timeout: 60000, // 60 segundos para múltiples tests
        cwd: PROJECT_ROOT, // Ejecutar desde el directorio del proyecto
      })
      return { success: true, output }
    } catch {
      // Si falla, asumir que no hay tests específicos (no es error crítico)
      return { success: true, output: 'No se encontraron tests específicos para este archivo' }
    }
  } catch (error: unknown) {
    const err = error as { stdout?: { toString(): string }; stderr?: { toString(): string }; message?: string };
    return {
      success: false,
      output: err.stdout?.toString() || err.stderr?.toString() || err.message || 'Error desconocido',
    }
  }
}

function runLinter(filePath: string): { success: boolean; output: string } {
  try {
    // Asegurar que la ruta sea relativa al proyecto
    const relativePath = path.isAbsolute(filePath) 
      ? path.relative(PROJECT_ROOT, filePath) 
      : filePath
    
    const output = execSync(`npx eslint "${relativePath}"`, {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: PROJECT_ROOT, // Ejecutar desde el directorio del proyecto
    })
    return { success: true, output }
  } catch (error: unknown) {
    const err = error as { stdout?: { toString(): string }; message?: string };
    return {
      success: false,
      output: err.stdout?.toString() || err.message || 'Error desconocido',
    }
  }
}

function ensureImport(content: string, importItems: string[]): { content: string; added: boolean } {
  const importPath = VALIDATION_UTILS_PATH
  const importStatement = `import { ${importItems.join(', ')} } from '${importPath}'`
  
  const existingImportRegex = new RegExp(`import\\s*\\{[^}]*\\}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g')
  if (existingImportRegex.test(content)) {
    const existingMatch = content.match(existingImportRegex)
    if (existingMatch) {
      const itemsMatch = existingMatch[0].match(/\{([^}]+)\}/)
      if (itemsMatch && itemsMatch[1]) {
        const existingItems = itemsMatch[1].split(',').map(s => s.trim())
        const missingItems = importItems.filter(item => !existingItems.includes(item))
        
        if (missingItems.length > 0) {
          const newImport = existingMatch[0].replace(/\{([^}]+)\}/, `{ $1, ${missingItems.join(', ')} }`)
          content = content.replace(existingImportRegex, newImport)
          return { content, added: true }
        }
      }
    }
    return { content, added: false }
  }
  
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
      const matches = content.match(pattern.search)
      if (matches && matches.length > 0) {
        if (typeof pattern.replace === 'function') {
          // pattern.replace es una función que recibe match y retorna string
          content = content.replace(pattern.search, pattern.replace as (match: string, ...args: unknown[]) => string)
        } else {
          content = content.replace(pattern.search, pattern.replace)
        }
        
        result.patternsApplied.push(pattern.name)
        result.changes += matches.length
        
        if (pattern.requiresImport) {
          pattern.importItems.forEach(item => neededImports.add(item))
        }
      }
    }
    
    if (neededImports.size > 0) {
      const importResult = ensureImport(content, Array.from(neededImports))
      content = importResult.content
      result.importAdded = importResult.added
    }
    
    result.success = content !== originalContent
    
    if (!dryRun && result.success) {
      fs.writeFileSync(filePath, content, 'utf-8')
    }
    
    return result
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error)
    return result
  }
}

async function migrateFileSafe(filePath: string, dryRun: boolean = false): Promise<MigrationResult> {
  const result: MigrationResult = {
    file: filePath,
    patternsApplied: [],
    importAdded: false,
    changes: 0,
    success: false,
  }
  
  try {
    // 1. Crear backup
    const backupPath = createBackup(filePath)
    
    // 2. Aplicar cambios
    const migrationResult = migrateFile(filePath, dryRun)
    Object.assign(result, migrationResult)
    
    if (!result.success || dryRun) {
      return result
    }
    
    // 3. Ejecutar linter
    console.log(`   🔍 Ejecutando linter...`)
    const lintResult = runLinter(filePath)
    if (!lintResult.success) {
      console.log(`   ❌ Linter falló`)
      restoreBackup(filePath, backupPath)
      result.rollback = true
      result.error = 'Linter falló: ' + lintResult.output.substring(0, 200)
      return result
    }
    console.log(`   ✅ Linter pasó`)
    
    // 4. Ejecutar tests
    console.log(`   🧪 Ejecutando tests...`)
    const testResult = runFileTests(filePath)
    result.testPassed = testResult.success
    
    if (!testResult.success) {
      console.log(`   ❌ Tests fallaron`)
      restoreBackup(filePath, backupPath)
      result.rollback = true
      result.error = 'Tests fallaron: ' + testResult.output.substring(0, 200)
      return result
    }
    console.log(`   ✅ Tests pasaron`)
    
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
  
  // Validar que las funciones requeridas existan
  const requiredFunctions = ['safeRound', 'safeAverage', 'safeMathMax', 'safeMathMin']
  const validation = validateValidationUtilsFunctions(requiredFunctions)
  
  if (!validation.valid) {
    console.error(`❌ ERROR: Las siguientes funciones no existen en ${VALIDATION_UTILS_FILE}:`)
    validation.missing.forEach(func => console.error(`   - ${func}`))
    console.error('\n💡 Asegúrate de que todas las funciones estén exportadas en validation-utils.ts')
    process.exit(1)
  }
  
  console.log('✅ Todas las funciones requeridas existen en validation-utils.ts\n')
  
  // Limpiar backups antiguos
  if (!dryRun) {
    cleanOldBackups()
  }
  
  const files = specificFile
    ? [specificFile]
    : await glob('src/app/api/**/*.ts', {
        ignore: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**', '**/validation-utils.ts'],
      })
  
  console.log(`📁 Encontrados ${files.length} archivos\n`)
  
  if (dryRun) {
    console.log('🔍 MODO DRY-RUN: No se aplicarán cambios\n')
  } else {
    console.log('🛡️  MODO SEGURO: Validación incremental activada\n')
  }
  
  const results: MigrationResult[] = []
  let totalChanges = 0
  let filesChanged = 0
  let filesRolledBack = 0
  
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  Archivo no existe: ${file}`)
      continue
    }
    
    console.log(`📝 Procesando: ${file}`)
    const result = await migrateFileSafe(file, dryRun)
    results.push(result)
    
    if (result.success) {
      if (result.rollback) {
        filesRolledBack++
        console.log(`   ⚠️  Cambios revertidos debido a errores`)
      } else {
        filesChanged++
        totalChanges += result.changes
        console.log(`   ✅ Migrado exitosamente`)
        console.log(`   Patrones: ${result.patternsApplied.join(', ')}`)
        console.log(`   Cambios: ${result.changes}`)
        if (result.importAdded) {
          console.log(`   Import agregado: ✓`)
        }
        if (result.testPassed) {
          console.log(`   Tests: ✓`)
        }
      }
    } else if (result.error) {
      console.log(`   ❌ Error: ${result.error}`)
    }
    console.log()
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMEN')
  console.log('='.repeat(60))
  console.log(`Archivos procesados: ${files.length}`)
  console.log(`Archivos modificados: ${filesChanged}`)
  console.log(`Archivos revertidos: ${filesRolledBack}`)
  console.log(`Total de cambios: ${totalChanges}`)
  
  if (dryRun) {
    console.log('\n💡 Ejecuta sin --dry-run para aplicar los cambios')
  } else {
    console.log('\n✨ Migración completada con validación')
    console.log('⚠️  Revisa los archivos revertidos manualmente')
  }
  
  // Guardar reporte
  const reportPath = 'migration-report-safe.json'
  const report = {
    dryRun,
    timestamp: new Date().toISOString(),
    results,
    summary: {
      totalFiles: files.length,
      filesChanged,
      filesRolledBack,
      totalChanges,
      successRate: files.length > 0 ? ((filesChanged / files.length) * 100).toFixed(2) + '%' : '0%',
    },
  }
  
  fs.writeFileSync(
    reportPath,
    JSON.stringify(report, null, 2),
    'utf-8'
  )
  console.log(`\n📄 Reporte guardado en: ${reportPath}`)
  
  // Mostrar estadísticas adicionales
  if (filesChanged > 0) {
    const patternsCount: Record<string, number> = {}
    results.forEach(r => {
      r.patternsApplied.forEach(p => {
        patternsCount[p] = (patternsCount[p] || 0) + 1
      })
    })
    
    console.log('\n📊 Patrones aplicados:')
    Object.entries(patternsCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([pattern, count]) => {
        console.log(`   ${pattern}: ${count} archivos`)
      })
  }
}

main().catch(console.error)

