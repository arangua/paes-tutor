# Script optimizado para ejecutar tests sin sobrecargar Cursor
# Este script reduce la carga del sistema y evita errores de conexión

param(
    [string[]]$TestFiles = @(),
    [switch]$Coverage = $false,
    [switch]$Watch = $false,
    [switch]$Verbose = $false,
    [int]$Workers = 0  # 0 = automático
)

# Cambiar al directorio del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Deshabilitar variables de entorno que pueden causar problemas
$env:CI = "false"
$env:NODE_ENV = "test"

# Construir argumentos de vitest optimizados
$vitestArgs = @()

if ($Watch) {
    $vitestArgs += "--watch"
} else {
    $vitestArgs += "run"
}

if ($Coverage) {
    $vitestArgs += "--coverage"
}

# Optimizaciones para reducir carga
if (-not $Verbose) {
    $vitestArgs += "--reporter=default"
} else {
    $vitestArgs += "--reporter=verbose"
}

# Limitar workers si se especifica
if ($Workers -gt 0) {
    $vitestArgs += "--maxWorkers=$Workers"
}

# Agregar archivos de test si se especifican
if ($TestFiles.Count -gt 0) {
    $vitestArgs += $TestFiles
}

# Ejecutar con configuración optimizada
Write-Host "Ejecutando tests (modo optimizado)..." -ForegroundColor Green
Write-Host "Comando: npx vitest $($vitestArgs -join ' ')" -ForegroundColor Gray
Write-Host ""

# Ejecutar npx vitest con redirección de errores para evitar notificaciones
try {
    # Redirigir stderr para evitar que Cursor intente procesar errores
    $output = & npx vitest @vitestArgs 2>&1
    $output | ForEach-Object { Write-Host $_ }
    exit $LASTEXITCODE
} catch {
    Write-Host "Error al ejecutar tests: $_" -ForegroundColor Red
    exit 1
}

