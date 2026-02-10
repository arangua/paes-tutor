#!/usr/bin/env node
/**
 * Guard Estructural de UX - Anti-patterns
 * 
 * Regla Enterprise:
 * Detecta violaciones de UX técnica antes de que lleguen a producción.
 * 
 * Características:
 * - Simple
 * - Evolutivo
 * - Sin dependencias
 * - Falla rápido
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')

/**
 * Patrones prohibidos en UX
 */
const FORBIDDEN_PATTERNS = [
  {
    pattern: /data\s*&&\s*</,
    message: 'Render condicional implícito - usar UXBoundary',
    example: '❌ {data && <Component />}',
    fix: '✅ <UXBoundary isEmpty={!data}><Component /></UXBoundary>',
  },
  {
    pattern: /isLoading\s*&&\s*<[^U]/,
    message: 'Loading condicional sin UXBoundary',
    example: '❌ {isLoading && <Spinner />}',
    fix: '✅ <UXBoundary isLoading={isLoading}>...</UXBoundary>',
  },
  {
    pattern: /error\s*&&\s*<[^E]/,
    message: 'Error condicional sin ErrorState',
    example: '❌ {error && <p>Error</p>}',
    fix: '✅ <UXBoundary error={error}>...</UXBoundary>',
  },
  {
    pattern: /if\s*\(\s*!.*\)\s*return\s*null/,
    message: 'Pantalla en blanco - usar EmptyState',
    example: '❌ if (!data) return null',
    fix: '✅ <UXBoundary isEmpty={!data}>...</UXBoundary>',
  },
  {
    pattern: /catch\s*\(\s*\)\s*\{[^}]*\}/,
    message: 'Try/catch silencioso - siempre mostrar error',
    example: '❌ catch () {}',
    fix: '✅ catch (error) { setError(error) }',
  },
]

/**
 * Archivos a ignorar (tests, guards, API routes, utilidades, etc.)
 */
const IGNORE_PATTERNS = [
  /\.test\.(ts|tsx)$/,
  /\.guard\.(ts|tsx)$/,
  /guard-.*\.mjs$/,
  /node_modules/,
  /\.next/,
  /\/api\//, // API routes no son componentes React
  /\/lib\//, // Utilidades no renderizan UI
  /\/hooks\//, // Hooks no renderizan UI directamente
  /skip-links\.tsx$/, // Componente especial que puede retornar null
]

/**
 * Solo verificar archivos que son componentes React o páginas
 */
const COMPONENT_PATTERNS = [
  /^src\/app\/.*\/page\.tsx$/, // Páginas de Next.js
  /^src\/components\/.*\.tsx$/, // Componentes
]

/**
 * Recorre directorio recursivamente
 */
function walk(dir) {
  if (!fs.existsSync(dir)) {
    return []
  }

  const files = []
  const entries = fs.readdirSync(dir)

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...walk(fullPath))
    } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      // Verificar si debe ignorarse
      const shouldIgnore = IGNORE_PATTERNS.some((pattern) => pattern.test(fullPath))
      if (!shouldIgnore) {
        files.push(fullPath)
      }
    }
  }

  return files
}

/**
 * Obtiene línea, columna y texto de línea a partir del índice en el texto
 */
function lineInfoFromIndex(text, idx) {
  const upTo = text.slice(0, idx)
  const lines = upTo.split(/\r?\n/)
  const line = lines.length
  const col = lines[lines.length - 1].length + 1
  const lineText = text.split(/\r?\n/)[line - 1] || ''
  return { line, col, lineText }
}

/**
 * Verifica si un archivo es un componente React o página
 */
function isComponentFile(filePath) {
  const relativePath = path.relative(ROOT, filePath)
  return COMPONENT_PATTERNS.some((pattern) => pattern.test(relativePath))
}

/**
 * Verifica un archivo contra los patrones prohibidos
 */
function checkFile(filePath) {
  // Solo verificar componentes React y páginas
  if (!isComponentFile(filePath)) {
    return []
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const relativePath = path.relative(ROOT, filePath)
  const errors = []

  for (const { pattern, message, example, fix } of FORBIDDEN_PATTERNS) {
    const m = pattern.exec(content)
    if (m) {
      if (message === 'Pantalla en blanco - usar EmptyState') {
        const idx = m.index ?? content.indexOf(m[0])
        const info = lineInfoFromIndex(content, idx)
        console.error('----- UX GUARD DEBUG (REAL MATCH) -----')
        console.error('File:', relativePath)
        console.error('Matched:', JSON.stringify(m[0]))
        console.error(`At: line ${info.line}, col ${info.col}`)
        console.error('Line:', info.lineText)
        console.error('--------------------------------------')
      }
      errors.push({
        file: relativePath,
        message,
        example,
        fix,
      })
    }
  }

  return errors
}

// Ejecutar guard
console.log('🔍 Running UX Patterns Guard...\n')

const files = walk(SRC)
let failed = false
const allErrors = []

for (const file of files) {
  const errors = checkFile(file)
  if (errors.length > 0) {
    allErrors.push(...errors)
    failed = true
  }
}

if (failed) {
  console.error('❌ UX anti-patterns detected:\n')
  for (const { file, message, example, fix } of allErrors) {
    console.error(`  📄 ${file}`)
    console.error(`     ${message}`)
    console.error(`     ${example}`)
    console.error(`     ${fix}\n`)
  }
  console.error('💡 Corrección:')
  console.error('   - Usar UXBoundary para manejar estados')
  console.error('   - Nunca renderizar pantalla en blanco')
  console.error('   - Siempre mostrar error al usuario')
  console.error('   - Usar componentes de UX (LoadingState, EmptyState, ErrorState)')
  process.exit(1)
}

console.log('✅ UX patterns guard passed')
console.log(`   Checked ${files.length} files`)
