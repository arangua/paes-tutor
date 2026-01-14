# Script wrapper para npm que verifica el directorio del proyecto antes de ejecutar
# Uso: .\scripts\npm-wrapper.ps1 run dev
#      .\scripts\npm-wrapper.ps1 install
#      .\scripts\npm-wrapper.ps1 test

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$NpmArgs
)

$ErrorActionPreference = "Stop"

# Cargar el helper para encontrar el directorio del proyecto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$helperPath = Join-Path $scriptPath "Ensure-ProjectRoot.ps1"

if (Test-Path $helperPath) {
    . $helperPath
    $projectRoot = Ensure-ProjectRoot -ScriptPath $scriptPath
} else {
    Write-Host "⚠️  No se encontró Ensure-ProjectRoot.ps1, buscando package.json manualmente..." -ForegroundColor Yellow
    # Fallback: buscar package.json manualmente
    $currentDir = $scriptPath
    $found = $false
    for ($i = 0; $i -lt 10; $i++) {
        if (Test-Path (Join-Path $currentDir "package.json")) {
            $projectRoot = $currentDir
            $found = $true
            break
        }
        $parent = Split-Path $currentDir -Parent
        if ([string]::IsNullOrEmpty($parent) -or $parent -eq $currentDir) { break }
        $currentDir = $parent
    }
    if (-not $found) {
        Write-Host "❌ Error: No se pudo encontrar package.json" -ForegroundColor Red
        Write-Host "   Por favor, ejecuta este script desde el directorio del proyecto o desde un subdirectorio." -ForegroundColor Yellow
        exit 1
    }
}

# Cambiar al directorio del proyecto
Set-Location $projectRoot

# Verificar que package.json existe
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json no encontrado en: $projectRoot" -ForegroundColor Red
    exit 1
}

# Obtener el ejecutable real de npm (no la función del perfil)
# Buscar todos los comandos npm y filtrar solo aplicaciones
$npmExe = Get-Command npm -All -ErrorAction SilentlyContinue | Where-Object { $_.CommandType -eq 'Application' } | Select-Object -First 1
if (-not $npmExe) {
    # Fallback: buscar npm.cmd directamente
    $npmExe = Get-Command npm.cmd -ErrorAction SilentlyContinue
}
if (-not $npmExe) {
    Write-Host "❌ Error: No se pudo encontrar el ejecutable de npm" -ForegroundColor Red
    exit 1
}
$npmCommand = $npmExe.Source

# Si no hay argumentos, mostrar ayuda
if ($NpmArgs.Count -eq 0) {
    Write-Host "✅ Ejecutando desde: $projectRoot" -ForegroundColor Green
    Write-Host "📦 Ejecutando: npm" -ForegroundColor Cyan
    & $npmCommand
    exit $LASTEXITCODE
}

# Ejecutar npm con los argumentos proporcionados
Write-Host "✅ Ejecutando desde: $projectRoot" -ForegroundColor Green
Write-Host "📦 Ejecutando: npm $($NpmArgs -join ' ')" -ForegroundColor Cyan
Write-Host ""

& $npmCommand $NpmArgs
exit $LASTEXITCODE

