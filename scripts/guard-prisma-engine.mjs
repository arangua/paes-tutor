#!/usr/bin/env node
/**
 * Guardrail Enterprise: Verificar configuración correcta de Prisma 7.2.0
 * 
 * Este script verifica que:
 * - Se usa @prisma/adapter-pg para PostgreSQL (REQUERIDO en Prisma 7.2.0)
 * - NO se usan adapters de SQLite (@prisma/adapter-better-sqlite3)
 * - NO se usa Prisma Accelerate
 * - PrismaClient se crea con adapter de PostgreSQL cuando es necesario
 * 
 * NOTA: En Prisma 7.2.0, el engine "client" es el predeterminado y REQUIERE un adapter.
 * Para PostgreSQL, se debe usar @prisma/adapter-pg.
 * 
 * Uso:
 *   node scripts/guard-prisma-engine.mjs
 * 
 * Exit code:
 *   0 = Todo correcto
 *   1 = Se detectaron problemas
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const errors = []
const warnings = []

/**
 * Buscar archivos TypeScript/JavaScript en src y scripts
 */
async function findSourceFiles() {
  const patterns = [
    'src/**/*.{ts,tsx}',
    'scripts/**/*.{ts,js,mjs}',
    'prisma/**/*.{ts,js}',
  ]
  
  const files = []
  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      cwd: projectRoot,
      ignore: [
        '**/node_modules/**',
        '**/.next/**',
        '**/.stryker-tmp/**',
        'scripts/guard-prisma-engine.mjs', // Excluir este script de sí mismo
        '**/__tests__/**', // Excluir archivos de test
        '**/*.test.{ts,tsx,js}', // Excluir archivos de test
        '**/*.spec.{ts,tsx,js}', // Excluir archivos de test
      ],
      absolute: true,
    })
    files.push(...matches)
  }
  
  return files
}

/**
 * Verificar que un archivo no contiene patrones problemáticos
 */
function checkFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const relativePath = filePath.replace(projectRoot + '/', '')
    
    // Verificar que si se importa adapter-pg, se use correctamente
    const hasAdapterPgImport = /@prisma\/adapter-pg/.test(content)
    const hasPrismaClientWithAdapter = /new\s+PrismaClient\s*\(\s*\{[^}]*adapter/.test(content)
    
    // Si se importa adapter-pg pero no se usa, es un warning
    if (hasAdapterPgImport && !hasPrismaClientWithAdapter) {
      warnings.push({
        file: relativePath,
        message: '@prisma/adapter-pg importado pero no usado en PrismaClient. Asegúrate de usarlo.',
        lines: [],
        severity: 'warning',
      })
    }
    
    // Patrones prohibidos
    const forbiddenPatterns = [
      {
        // Permitir @prisma/adapter-pg, rechazar otros adapters
        pattern: /@prisma\/adapter-(?!pg)/,
        message: 'Adapter de Prisma no permitido detectado. Solo se permite @prisma/adapter-pg para PostgreSQL.',
        severity: 'error',
      },
      {
        // Verificar que si se usa adapter, sea el correcto
        pattern: /new\s+PrismaClient\s*\(\s*\{[^}]*adapter\s*[:=]\s*[^,}]*adapter-(?!pg)/,
        message: 'PrismaClient con adapter incorrecto. Solo se permite @prisma/adapter-pg para PostgreSQL.',
        severity: 'error',
      },
      {
        pattern: /new\s+PrismaClient\s*\(\s*\{[^}]*accelerateUrl\s*[:=]/,
        message: 'PrismaClient con accelerateUrl detectado. No se permite Prisma Accelerate.',
        severity: 'error',
      },
      {
        pattern: /withAccelerate\s*\(/,
        message: 'Prisma Accelerate (withAccelerate) detectado. No se permite Prisma Accelerate.',
        severity: 'error',
      },
      {
        // Verificar que se usa adapter-pg cuando es necesario (en archivos principales)
        pattern: /new\s+PrismaClient\s*\(\s*\)(?!\s*;|\s*$)/,
        message: 'PrismaClient creado sin adapter. En Prisma 7.2.0, se requiere @prisma/adapter-pg para PostgreSQL.',
        severity: 'warning',
        // Solo aplicar a archivos principales, no a tests ni scripts temporales
        excludeFrom: ['test', 'spec', 'stryker'],
      },
      {
        pattern: /@prisma\/extension-accelerate/,
        message: 'Import de Prisma Accelerate extension detectado',
        severity: 'error',
      },
      {
        pattern: /from\s+["']@prisma\/client\/edge["']/,
        message: 'Import desde @prisma/client/edge detectado (requiere adapter/accelerateUrl). Usar @prisma/client en su lugar.',
        severity: 'error',
      },
      {
        pattern: /require\s*\(\s*["']@prisma\/client\/edge["']/,
        message: 'Require de @prisma/client/edge detectado (requiere adapter/accelerateUrl). Usar @prisma/client en su lugar.',
        severity: 'error',
      },
      {
        pattern: /^(?!\s*\/\/|\s*\/\*|\s*\*).*engineType\s*=\s*["']client["']/m,
        message: 'engineType = "client" detectado en código (debe estar solo en schema.prisma si es necesario)',
        severity: 'warning',
      },
    ]
    
    for (const { pattern, message, severity } of forbiddenPatterns) {
      if (pattern.test(content)) {
        const lines = content.split('\n')
        const lineNumbers = []
        lines.forEach((line, index) => {
          // Ignorar líneas que son comentarios
          const trimmedLine = line.trim()
          if (
            !trimmedLine.startsWith('//') &&
            !trimmedLine.startsWith('*') &&
            !trimmedLine.startsWith('/*') &&
            pattern.test(line)
          ) {
            lineNumbers.push(index + 1)
          }
        })
        
        // Si no hay líneas reales (solo comentarios), saltar
        if (lineNumbers.length === 0) {
          continue
        }
        
        const issue = {
          file: relativePath,
          message,
          lines: lineNumbers,
          severity,
        }
        
        if (severity === 'error') {
          errors.push(issue)
        } else {
          warnings.push(issue)
        }
      }
    }
  } catch (error) {
    console.error(`Error leyendo ${filePath}:`, error.message)
  }
}

/**
 * Verificar schema.prisma
 */
function checkSchema() {
  const schemaPath = join(projectRoot, 'prisma', 'schema.prisma')
  try {
    const content = readFileSync(schemaPath, 'utf-8')
    
    // En Prisma 7.2.0, engineType fue removido. El engine "client" es el predeterminado y requiere adapter.
    // Verificar que NO se especifica engineType (fue removido en 7.2.0)
    if (content.match(/^\s*engineType\s*=/m)) {
      warnings.push({
        file: 'prisma/schema.prisma',
        message: 'engineType detectado en schema.prisma. En Prisma 7.2.0, engineType fue removido. El engine "client" es el predeterminado y requiere adapter.',
        lines: [],
        severity: 'warning',
      })
    }
    
    // Verificar previewFeatures = ["driverAdapters"] (Causa A)
    if (content.match(/previewFeatures\s*=\s*\[[^\]]*["']driverAdapters["']/)) {
      errors.push({
        file: 'prisma/schema.prisma',
        message: 'previewFeatures = ["driverAdapters"] detectado. Esto fuerza engine "client" y requiere adapter/accelerateUrl. Remover si no se usan adapters.',
        lines: [],
        severity: 'error',
      })
    }
    
    // Verificar que el generator es correcto
    if (!content.match(/generator\s+client\s*\{[^}]*provider\s*=\s*["']prisma-client-js["']/s)) {
      warnings.push({
        file: 'prisma/schema.prisma',
        message: 'Generator client no encontrado o no usa prisma-client-js',
        lines: [],
        severity: 'warning',
      })
    }
  } catch (error) {
    console.error(`Error leyendo schema.prisma:`, error.message)
  }
}

/**
 * Main
 */
async function main() {
  console.log('🔍 Verificando configuración de Prisma engine...\n')
  
  // Verificar schema
  checkSchema()
  
  // Verificar archivos fuente
  const files = await findSourceFiles()
  console.log(`📁 Verificando ${files.length} archivos...\n`)
  
  for (const file of files) {
    checkFile(file)
  }
  
  // Reportar resultados
  if (errors.length > 0) {
    console.error('❌ ERRORES ENCONTRADOS:\n')
    errors.forEach(({ file, message, lines }) => {
      console.error(`  ${file}:${lines.length > 0 ? lines.join(',') : ''}`)
      console.error(`    ${message}\n`)
    })
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  ADVERTENCIAS:\n')
    warnings.forEach(({ file, message, lines }) => {
      console.warn(`  ${file}:${lines.length > 0 ? lines.join(',') : ''}`)
      console.warn(`    ${message}\n`)
    })
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Todo correcto: Prisma configurado correctamente con @prisma/adapter-pg\n')
    process.exit(0)
  }
  
  if (errors.length > 0) {
    console.error(`\n❌ Se encontraron ${errors.length} error(es). Corrija antes de continuar.\n`)
    process.exit(1)
  }
  
  if (warnings.length > 0) {
    console.warn(`\n⚠️  Se encontraron ${warnings.length} advertencia(s). Revise si es necesario.\n`)
    process.exit(0) // Warnings no bloquean
  }
}

main().catch((error) => {
  console.error('Error ejecutando guard:', error)
  process.exit(1)
})
