/**
 * ✅ Enterprise: Script de validación de secrets hardcodeados
 * 
 * Detecta posibles secrets, API keys, passwords, etc. hardcodeados en el código
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const ERRORS: string[] = []
const WARNINGS: string[] = []

// Patrones de secrets comunes
const SECRET_PATTERNS = [
  {
    pattern: /password\s*[:=]\s*['"][^'"]{8,}['"]/i,
    name: 'Password hardcodeado',
    severity: 'error' as const,
  },
  {
    pattern: /api[_-]?key\s*[:=]\s*['"][^'"]{20,}['"]/i,
    name: 'API Key hardcodeada',
    severity: 'error' as const,
  },
  {
    pattern: /secret\s*[:=]\s*['"][^'"]{10,}['"]/i,
    name: 'Secret hardcodeado',
    severity: 'error' as const,
  },
  {
    pattern: /token\s*[:=]\s*['"][^'"]{20,}['"]/i,
    name: 'Token hardcodeado',
    severity: 'error' as const,
  },
  {
    pattern: /(sk-|pk_|AIza|ghp_|xoxb-)[a-zA-Z0-9]{20,}/i,
    name: 'Posible API key de servicio',
    severity: 'error' as const,
  },
]

// Archivos y directorios a excluir
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /dist/,
  /build/,
  /coverage/,
  /\.test\./,
  /\.spec\./,
  /mock/,
  /\.stryker-tmp/,
  /scripts\/validate-secrets\.ts/, // Excluir este mismo archivo
]

/**
 * Verifica si un archivo debe ser excluido
 */
function shouldExclude(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(filePath))
}

/**
 * Escanea un archivo en busca de secrets
 */
function scanFile(filePath: string): void {
  if (shouldExclude(filePath)) {
    return
  }

  try {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      SECRET_PATTERNS.forEach(({ pattern, name, severity }) => {
        if (pattern.test(line)) {
          // Verificar que no sea un comentario o string de ejemplo
          const trimmedLine = line.trim()
          if (
            !trimmedLine.startsWith('//') &&
            !trimmedLine.startsWith('*') &&
            !trimmedLine.includes('example') &&
            !trimmedLine.includes('EXAMPLE') &&
            !trimmedLine.includes('placeholder')
          ) {
            const message = `${name} encontrado en ${filePath}:${index + 1}`
            if (severity === 'error') {
              ERRORS.push(message)
            } else {
              WARNINGS.push(message)
            }
          }
        }
      })
    })
  } catch (error) {
    // Ignorar errores de lectura (archivos binarios, etc.)
  }
}

/**
 * Escanea un directorio recursivamente
 */
function scanDirectory(dirPath: string): void {
  try {
    const entries = readdirSync(dirPath)

    entries.forEach((entry) => {
      const fullPath = join(dirPath, entry)

      if (shouldExclude(fullPath)) {
        return
      }

      try {
        const stat = statSync(fullPath)
        if (stat.isDirectory()) {
          scanDirectory(fullPath)
        } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry)) {
          scanFile(fullPath)
        }
      } catch {
        // Ignorar errores de acceso
      }
    })
  } catch (error) {
    // Ignorar errores de acceso
  }
}

/**
 * Función principal
 */
function main(): void {
  console.log('🔐 Escaneando código en busca de secrets hardcodeados...\n')

  // Escanear directorio src
  const srcPath = join(process.cwd(), 'src')
  if (require('fs').existsSync(srcPath)) {
    scanDirectory(srcPath)
  }

  // Mostrar resultados
  console.log('📊 Resultados del escaneo:\n')

  if (WARNINGS.length > 0) {
    console.log('⚠️  Advertencias:')
    WARNINGS.forEach((warning) => console.log(`  ${warning}`))
    console.log('')
  }

  if (ERRORS.length > 0) {
    console.log('❌ Secrets encontrados:')
    ERRORS.forEach((error) => console.log(`  ${error}`))
    console.log('\n❌ Por favor, remueve los secrets hardcodeados y usa variables de entorno.')
    process.exit(1)
  }

  console.log('✅ No se encontraron secrets hardcodeados.')
}

main()

