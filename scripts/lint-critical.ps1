# Script para ejecutar ESLint en modo crítico
# Uso: .\scripts\lint-critical.ps1

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Ejecutando ESLint en modo CRÍTICO" -ForegroundColor Cyan
Write-Host "  (Solo reglas que bloquean issues realmente críticos)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Configurar variable de entorno para modo crítico
$env:ESLINT_CRITICAL_MODE = "true"

try {
  # Ejecutar ESLint en modo crítico
  npx eslint "src/**/*.ts" "src/**/*.tsx" --max-warnings 0 --ignore-pattern "e2e/**" --ignore-pattern "playwright.config.ts"
  
  $exitCode = $LASTEXITCODE
  if ($exitCode -eq $null) {
    $exitCode = 0
  }
  
  Write-Host ""
  Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
  if ($exitCode -eq 0) {
    Write-Host "  ✓ Lint crítico: OK" -ForegroundColor Green
  } else {
    Write-Host "  ✗ Lint crítico: FALLÓ" -ForegroundColor Red
  }
  Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
  
  exit $exitCode
} catch {
  Write-Host ""
  Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
  Write-Host "  ✗ Error al ejecutar lint crítico: $_" -ForegroundColor Red
  Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
  exit 1
} finally {
  $env:ESLINT_CRITICAL_MODE = $null
}
