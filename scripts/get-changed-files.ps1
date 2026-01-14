# Script para obtener archivos cambiados vs origin/main
# Uso: .\scripts\get-changed-files.ps1

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Obtener archivos cambiados vs origin/main
# Incluye archivos modificados, agregados y renombrados
$changedFiles = git diff --name-only --diff-filter=ACMR origin/main...HEAD 2>$null

if ($LASTEXITCODE -ne 0 -or -not $changedFiles) {
  # Si no hay origin/main o no hay cambios, usar HEAD vs working directory
  $changedFiles = git diff --name-only --diff-filter=ACMR HEAD
}

# Filtrar solo archivos TypeScript/JavaScript en src/
$tsFiles = $changedFiles | Where-Object {
  $_ -match '^src/.*\.(ts|tsx|js|jsx)$'
}

if ($tsFiles) {
  # Retornar lista de archivos separados por espacios
  $tsFiles -join ' '
} else {
  # Si no hay archivos, retornar patrón que no coincida con nada
  # Esto hace que ESLint no encuentre archivos y salga con código 0
  Write-Host "No hay archivos TypeScript/JavaScript cambiados" -ForegroundColor Yellow
  exit 0
}
