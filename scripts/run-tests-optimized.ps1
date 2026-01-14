# Script ultra-optimizado para ejecutar tests sin errores de conexión de Cursor
# Este script minimiza la interacción con Cursor durante la ejecución

param(
    [string[]]$TestFiles = @(),
    [switch]$Coverage = $false,
    [switch]$Watch = $false,
    [switch]$Single = $false  # Ejecutar tests en un solo proceso
)

# Cambiar al directorio del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Configurar variables de entorno para optimización
$env:CI = "false"
$env:NODE_ENV = "test"
$env:VITEST_MAX_WORKERS = if ($Single) { "1" } else { "2" }
$env:VITEST_POOL = "forks"
$env:VITEST_POOL_OPTIONS_FORKS_SINGLE_FORK = "false"

# Construir argumentos de vitest
$vitestArgs = @()

if ($Watch) {
    $vitestArgs += "--watch"
} else {
    $vitestArgs += "run"
}

if ($Coverage) {
    $vitestArgs += "--coverage"
}

# Usar reporter minimalista para reducir salida
$vitestArgs += "--reporter=default"

# Limitar workers para reducir carga
if ($Single) {
    $vitestArgs += "--maxWorkers=1"
    $vitestArgs += "--minWorkers=1"
}

# Agregar archivos de test si se especifican
if ($TestFiles.Count -gt 0) {
    $vitestArgs += $TestFiles
}

# Ejecutar con configuración ultra-optimizada
Write-Host "Ejecutando tests (modo ultra-optimizado)..." -ForegroundColor Cyan
Write-Host "Configuración: Workers=$env:VITEST_MAX_WORKERS, Pool=$env:VITEST_POOL" -ForegroundColor Gray
Write-Host ""

# Determinar el comando a usar
if (Get-Command npx -ErrorAction SilentlyContinue) {
    $command = "npx"
    $commandArgs = @("vitest") + $vitestArgs
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
    $command = "npm"
    $commandArgs = @("exec", "--", "vitest") + $vitestArgs
} else {
    Write-Host "Error: No se encontró npx ni npm en el PATH" -ForegroundColor Red
    exit 1
}

# Ejecutar vitest mostrando toda la salida completa
# Ejecutar directamente sin captura para que la salida se muestre en tiempo real
try {
    # Asegurar que la salida no se suprima
    $PSDefaultParameterValues['*:ErrorAction'] = 'Continue'
    
    # Ejecutar el comando - la salida se mostrará automáticamente
    & $command $commandArgs
    
    # Capturar el código de salida
    if ($LASTEXITCODE -ne $null) {
        exit $LASTEXITCODE
    } else {
        exit 0
    }
} catch {
    Write-Host "Error al ejecutar tests: $_" -ForegroundColor Red
    exit 1
}

