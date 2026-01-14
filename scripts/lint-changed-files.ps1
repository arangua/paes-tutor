# Script para ejecutar ESLint solo en archivos cambiados vs origin/main
# Uso: .\scripts\lint-changed-files.ps1

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Linting archivos cambiados vs origin/main" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Obtener archivos cambiados vs origin/main
$changedFiles = git diff --name-only --diff-filter=ACMR origin/main...HEAD 2>$null

if ($LASTEXITCODE -ne 0 -or -not $changedFiles) {
  # Si no hay origin/main o no hay cambios, usar HEAD vs working directory
  Write-Host "No se encontró origin/main, usando cambios vs HEAD..." -ForegroundColor Yellow
  $changedFiles = git diff --name-only --diff-filter=ACMR HEAD
}

# Filtrar solo archivos TypeScript/JavaScript en src/
$tsFiles = $changedFiles | Where-Object {
  $_ -match '^src/.*\.(ts|tsx|js|jsx)$'
}

if (-not $tsFiles -or $tsFiles.Count -eq 0) {
  Write-Host "No hay archivos TypeScript/JavaScript cambiados" -ForegroundColor Green
  Write-Host "✓ Lint de archivos cambiados: OK" -ForegroundColor Green
  exit 0
}

Write-Host "Archivos a verificar:" -ForegroundColor Gray
$tsFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
Write-Host ""

# Ejecutar ESLint en modo crítico sobre archivos cambiados
$env:ESLINT_CRITICAL_MODE = "true"

try {
  # Ejecutar ESLint pasando cada archivo como argumento separado
  $eslintArgs = @()
  foreach ($file in $tsFiles) {
    $eslintArgs += $file
  }
  $eslintArgs += "--max-warnings"
  $eslintArgs += "0"
  
  & npx eslint $eslintArgs
  
  if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✓ Lint de archivos cambiados: OK" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    exit 0
  } else {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ✗ Lint de archivos cambiados: FALLÓ" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    exit $LASTEXITCODE
  }
} catch {
  Write-Host ""
  Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
  Write-Host "  ✗ Error al ejecutar lint: $_" -ForegroundColor Red
  Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
  exit 1
} finally {
  $env:ESLINT_CRITICAL_MODE = $null
}
