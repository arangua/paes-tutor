#!/usr/bin/env node
/**
 * Lint crítico - cross-platform (Node)
 * Equivalente a scripts/lint-critical.ps1 para CI (Linux/macOS) y local.
 */
import { spawnSync } from 'node:child_process'

function run() {
  process.env.ESLINT_CRITICAL_MODE = 'true'
  console.log('═══════════════════════════════════════════════════════════')
  console.log('  Ejecutando ESLint en modo CRÍTICO')
  console.log('  (Solo reglas que bloquean issues realmente críticos)')
  console.log('═══════════════════════════════════════════════════════════\n')

  const r = spawnSync(
    'npx',
    [
      'eslint',
      'src/**/*.ts',
      'src/**/*.tsx',
      '--max-warnings', '0',
      '--ignore-pattern', 'e2e/**',
      '--ignore-pattern', 'playwright.config.ts',
    ],
    { stdio: 'inherit', shell: true }
  )

  const exitCode = r.status != null ? r.status : 1
  console.log('')
  console.log('═══════════════════════════════════════════════════════════')
  if (exitCode === 0) {
    console.log('  ✓ Lint crítico: OK')
  } else {
    console.log('  ✗ Lint crítico: FALLÓ')
  }
  console.log('═══════════════════════════════════════════════════════════')

  if (process.env.ESLINT_CRITICAL_MODE !== undefined) {
    delete process.env.ESLINT_CRITICAL_MODE
  }
  process.exit(exitCode)
}

try {
  run()
} catch (err) {
  console.error('✗ Error al ejecutar lint crítico:', err)
  if (process.env.ESLINT_CRITICAL_MODE !== undefined) {
    delete process.env.ESLINT_CRITICAL_MODE
  }
  process.exit(1)
}
