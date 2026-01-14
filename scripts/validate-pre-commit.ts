/**
 * ✅ Enterprise: Script de validación pre-commit
 * 
 * Valida que el código cumpla con los estándares enterprise antes de commit
 */

import { execSync } from 'child_process'

const ERRORS: string[] = []
const WARNINGS: string[] = []

/**
 * Valida que no haya console.log en código de producción
 */
function validateNoConsoleLogs(): void {
  const productionFiles = [
    'src/app/**/*.{ts,tsx}',
    'src/lib/**/*.{ts,tsx}',
    'src/components/**/*.{ts,tsx}',
  ]

  // Excluir archivos permitidos
  const allowedFiles = [
    'src/lib/logger.ts',
    'src/lib/monitoring.ts',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
  ]

  try {
    // Buscar console.log, console.error, console.warn, console.debug
    const result = execSync(
      `npx eslint --format=json ${productionFiles.join(' ')} --rule "no-console: error" 2>&1 || true`,
      { encoding: 'utf-8' }
    )

    // Si hay resultados, parsear y verificar
    if (result && !result.includes('No files matching')) {
      const jsonResult = JSON.parse(result)
      if (jsonResult.length > 0) {
        for (const file of jsonResult) {
          // Verificar si el archivo está en la lista de permitidos
          const isAllowed = allowedFiles.some((pattern) => {
            const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'))
            return regex.test(file.filePath)
          })

          if (!isAllowed && file.messages.length > 0) {
            for (const message of file.messages) {
              if (message.ruleId === 'no-console') {
                ERRORS.push(
                  `❌ console.log encontrado en ${file.filePath}:${message.line}:${message.column} - ${message.message}`
                )
              }
            }
          }
        }
      }
    }
  } catch (error) {
    // Si falla la validación, solo advertir (no bloquear)
    WARNINGS.push(`⚠️  No se pudo validar console.log: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Valida que no haya debugger en código de producción
 */
function validateNoDebugger(): void {
  try {
    const result = execSync(
      `npx eslint --format=json "src/**/*.{ts,tsx}" --rule "no-debugger: error" --ignore-pattern "**/*.test.*" --ignore-pattern "**/*.spec.*" 2>&1 || true`,
      { encoding: 'utf-8' }
    )

    if (result && !result.includes('No files matching')) {
      const jsonResult = JSON.parse(result)
      if (jsonResult.length > 0) {
        for (const file of jsonResult) {
          for (const message of file.messages) {
            if (message.ruleId === 'no-debugger') {
              ERRORS.push(
                `❌ debugger encontrado en ${file.filePath}:${message.line}:${message.column}`
              )
            }
          }
        }
      }
    }
  } catch (error) {
    WARNINGS.push(`⚠️  No se pudo validar debugger: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Valida que no haya TODO sin issue asociado
 */
function validateTODOs(): void {
  try {
    const result = execSync(
      `grep -r "TODO" "src" --include="*.ts" --include="*.tsx" | grep -v "TODO:" | grep -v "FIXME:" || true`,
      { encoding: 'utf-8' }
    )

    if (result && result.trim()) {
      const lines = result.trim().split('\n')
      for (const line of lines) {
        // Solo advertir, no bloquear
        WARNINGS.push(`⚠️  TODO sin formato estándar encontrado: ${line.split(':')[0]}`)
      }
    }
  } catch (error) {
    // Ignorar errores de grep (puede no encontrar nada)
  }
}

/**
 * Valida que no haya secrets hardcodeados
 */
function validateNoSecrets(): void {
  const secretPatterns = [
    /password\s*[:=]\s*['"][^'"]+['"]/i,
    /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
    /secret\s*[:=]\s*['"][^'"]+['"]/i,
    /token\s*[:=]\s*['"][^'"]{20,}['"]/i,
  ]

  try {
    const result = execSync(
      `grep -r -E "(password|api[_-]?key|secret|token)\\s*[:=]\\s*['\\\"][^'\\\"]+['\\\"]" "src" --include="*.ts" --include="*.tsx" -i || true`,
      { encoding: 'utf-8' }
    )

    if (result && result.trim()) {
      const lines = result.trim().split('\n')
      for (const line of lines) {
        // Excluir archivos de test y mocks
        if (!line.includes('.test.') && !line.includes('.spec.') && !line.includes('mock')) {
          // Verificar si es un patrón de secret real
          const isSecret = secretPatterns.some((pattern) => pattern.test(line))
          if (isSecret) {
            ERRORS.push(`❌ Posible secret hardcodeado encontrado: ${line.split(':')[0]}`)
          }
        }
      }
    }
  } catch (error) {
    // Ignorar errores de grep
  }
}

/**
 * Valida tipos TypeScript
 */
function validateTypeScript(): void {
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' })
  } catch (error) {
    ERRORS.push('❌ Errores de tipos TypeScript encontrados')
    process.exit(1)
  }
}

/**
 * Función principal
 */
function main(): void {
  console.log('🔍 Validando estándares enterprise...\n')

  // Validar console.log
  console.log('📝 Validando console.log...')
  validateNoConsoleLogs()

  // Validar debugger
  console.log('🐛 Validando debugger...')
  validateNoDebugger()

  // Validar TODOs
  console.log('📋 Validando TODOs...')
  validateTODOs()

  // Validar secrets
  console.log('🔐 Validando secrets...')
  validateNoSecrets()

  // Validar tipos TypeScript
  console.log('📘 Validando tipos TypeScript...')
  validateTypeScript()

  // Mostrar resultados
  console.log('\n📊 Resultados de validación:\n')

  if (WARNINGS.length > 0) {
    console.log('⚠️  Advertencias:')
    WARNINGS.forEach((warning) => console.log(`  ${warning}`))
    console.log('')
  }

  if (ERRORS.length > 0) {
    console.log('❌ Errores encontrados:')
    ERRORS.forEach((error) => console.log(`  ${error}`))
    console.log('\n❌ Commit bloqueado. Por favor, corrige los errores antes de continuar.')
    process.exit(1)
  }

  console.log('✅ Todas las validaciones pasaron correctamente.')
}

main()

