# Script para ejecutar test:coverage y luego sonar
# Compatible con PowerShell

$ErrorActionPreference = "Stop"

# Asegurar que estamos en el directorio raíz del proyecto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$helperPath = Join-Path $scriptPath "Ensure-ProjectRoot.ps1"
if (Test-Path $helperPath) {
    . $helperPath
    Ensure-ProjectRoot -ScriptPath $scriptPath | Out-Null
} else {
    Write-Host "⚠️  No se encontró Ensure-ProjectRoot.ps1, buscando package.json manualmente..." -ForegroundColor Yellow
    # Fallback: buscar package.json manualmente
    $currentDir = $scriptPath
    $found = $false
    for ($i = 0; $i -lt 10; $i++) {
        if (Test-Path (Join-Path $currentDir "package.json")) {
            Set-Location $currentDir
            $found = $true
            break
        }
        $parent = Split-Path $currentDir -Parent
        if ([string]::IsNullOrEmpty($parent) -or $parent -eq $currentDir) { break }
        $currentDir = $parent
    }
    if (-not $found) {
        Write-Host "❌ Error: No se pudo encontrar package.json" -ForegroundColor Red
        exit 1
    }
}

# Verificar que package.json existe
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json no encontrado en el directorio actual: $(Get-Location)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Ejecutando desde: $(Get-Location)" -ForegroundColor Green
Write-Host "🧪 Ejecutando tests con cobertura..." -ForegroundColor Cyan
npm run test:coverage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Los tests fallaron. No se ejecutará SonarQube." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n🔍 Ejecutando SonarQube..." -ForegroundColor Cyan
npm run sonar

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ SonarQube falló." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n✅ Proceso completado exitosamente!" -ForegroundColor Green

