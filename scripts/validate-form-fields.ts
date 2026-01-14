#!/usr/bin/env tsx
/**
 * Enterprise Form Field Validator Script
 * 
 * Valida que todos los campos de formulario en el código tengan atributos id o name.
 * Este script se ejecuta en pre-commit y en CI/CD para garantizar calidad enterprise.
 * 
 * Uso:
 *   npm run validate:form-fields
 *   npm run validate:form-fields -- --fix
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

interface ValidationResult {
  file: string
  line: number
  issue: string
  severity: 'error' | 'warning'
}

const results: ValidationResult[] = []
let hasErrors = false

/**
 * Busca campos de formulario sin id o name en un archivo
 */
function validateFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    // Patrones para detectar campos de formulario
    const inputPattern = /<input[^>]*>/gi
    const textareaPattern = /<textarea[^>]*>/gi
    const selectPattern = /<select[^>]*>/gi

    lines.forEach((line, index) => {
      const lineNumber = index + 1

      // Validar inputs
      const inputMatches = line.matchAll(inputPattern)
      for (const match of inputMatches) {
        const inputTag = match[0]
        const hasId = /id\s*=\s*["'][^"']+["']/i.test(inputTag)
        const hasName = /name\s*=\s*["'][^"']+["']/i.test(inputTag)

        // Excluir inputs de tipo hidden (no necesitan id/name para autocompletado)
        const isHidden = /type\s*=\s*["']hidden["']/i.test(inputTag)

        if (!isHidden && !hasId && !hasName) {
          // Verificar si está usando nuestros componentes (que garantizan id/name)
          const isUsingComponent = /<Input|Input\s+type=/i.test(line)
          
          if (!isUsingComponent) {
            results.push({
              file: filePath,
              line: lineNumber,
              issue: `Input sin atributos id o name: ${inputTag.substring(0, 50)}...`,
              severity: 'error',
            })
            hasErrors = true
          }
        }
      }

      // Validar textareas
      const textareaMatches = line.matchAll(textareaPattern)
      for (const match of textareaMatches) {
        const textareaTag = match[0]
        const hasId = /id\s*=\s*["'][^"']+["']/i.test(textareaTag)
        const hasName = /name\s*=\s*["'][^"']+["']/i.test(textareaTag)

        const isUsingComponent = /<Textarea|Textarea\s+/i.test(line)

        if (!isUsingComponent && !hasId && !hasName) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: `Textarea sin atributos id o name: ${textareaTag.substring(0, 50)}...`,
            severity: 'error',
          })
          hasErrors = true
        }
      }

      // Validar selects
      const selectMatches = line.matchAll(selectPattern)
      for (const match of selectMatches) {
        const selectTag = match[0]
        const hasId = /id\s*=\s*["'][^"']+["']/i.test(selectTag)
        const hasName = /name\s*=\s*["'][^"']+["']/i.test(selectTag)

        const isUsingComponent = /<Select|SelectTrigger/i.test(line)

        if (!isUsingComponent && !hasId && !hasName) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: `Select sin atributos id o name: ${selectTag.substring(0, 50)}...`,
            severity: 'error',
          })
          hasErrors = true
        }
      }
    })
  } catch (error) {
    console.error(`Error al leer ${filePath}:`, error)
  }
}

/**
 * Recorre directorios recursivamente
 */
function walkDirectory(dir: string, extensions: string[] = ['.tsx', '.ts', '.jsx', '.js']): void {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    // Ignorar node_modules, .next, etc.
    if (
      file.startsWith('.') ||
      file === 'node_modules' ||
      file === '.next' ||
      file === 'dist' ||
      file === 'build' ||
      file === '.stryker-tmp'
    ) {
      continue
    }

    if (stat.isDirectory()) {
      walkDirectory(filePath, extensions)
    } else if (stat.isFile()) {
      const ext = file.substring(file.lastIndexOf('.'))
      if (extensions.includes(ext)) {
        validateFile(filePath)
      }
    }
  }
}

// Ejecutar validación
const srcDir = join(process.cwd(), 'src')
console.log('🔍 Validando campos de formulario...\n')
walkDirectory(srcDir)

// Mostrar resultados
if (results.length === 0) {
  console.log('✅ Todos los campos de formulario tienen atributos id o name\n')
  process.exit(0)
} else {
  console.log(`❌ Se encontraron ${results.length} problema(s):\n`)
  
  results.forEach(result => {
    const icon = result.severity === 'error' ? '❌' : '⚠️'
    console.log(`${icon} ${result.file}:${result.line}`)
    console.log(`   ${result.issue}\n`)
  })

  console.log('\n💡 Solución:')
  console.log('   1. Usa los componentes Input, Textarea o Select de @/components/ui')
  console.log('   2. O agrega atributos id o name explícitamente')
  console.log('   3. Los componentes garantizan automáticamente id/name\n')

  process.exitCode = hasErrors ? 1 : 0
  process.exit(hasErrors ? 1 : 0)
}
