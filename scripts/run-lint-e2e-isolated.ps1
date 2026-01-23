# Script DEFINITIVO para ejecutar lint:e2e sin errores de conexión de Cursor
# Este script ejecuta ESLint directamente en un proceso completamente aislado
# para evitar que Cursor intente analizar la salida y conectarse a sus servidores

# Cambiar al directorio del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Deshabilitar TODAS las variables de entorno que Cursor podría usar
$env:CURSOR_TELEMETRY = "disabled"
$env:CURSOR_ANALYTICS = "disabled"
$env:VSCODE_TELEMETRY = "disabled"
$env:VSCODE_ANALYTICS = "disabled"
$env:VSCODE_INJECTION = "0"
$env:CURSOR_INJECTION = "0"

# Configurar variables para evitar análisis automático
$env:CI = "true"
$env:NO_COLOR = "1"
$env:FORCE_COLOR = "0"
$env:TERM = "dumb"  # Terminal "tonto" que no envía códigos de escape

# Deshabilitar cualquier proxy o conexión HTTP
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:NO_PROXY = "*"

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Ejecutando lint:e2e en modo completamente aislado" -ForegroundColor Cyan
Write-Host "  (Sin conexiones de Cursor)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Construir el comando ESLint directamente
# Esto evita pasar por npm, que puede causar que Cursor intente analizar la salida
$eslintPath = Join-Path $projectRoot "node_modules\.bin\eslint.cmd"
if (-not (Test-Path $eslintPath)) {
    $eslintPath = Join-Path $projectRoot "node_modules\.bin\eslint"
}

# Verificar que ESLint existe
if (-not (Test-Path $eslintPath)) {
    Write-Host "ERROR: ESLint no encontrado. Ejecuta 'npm install' primero." -ForegroundColor Red
    exit 1
}

# Argumentos para ESLint
# Solo buscar archivos .ts ya que no hay .tsx en e2e
$eslintArgs = @(
    "e2e/**/*.ts",
    "playwright.config.ts",
    "--max-warnings", "0"
)

Write-Host "Comando: $eslintPath $($eslintArgs -join ' ')" -ForegroundColor Gray
Write-Host ""

# Ejecutar ESLint directamente con todas las variables de entorno configuradas
# El operador & ejecuta el comando en el contexto actual con todas las variables
# Las variables de entorno ya están configuradas arriba, así que Cursor no debería intentar conectarse
try {
    # Ejecutar ESLint directamente
    # Con todas las variables de entorno deshabilitadas, Cursor no debería intentar analizar la salida
    & $eslintPath $eslintArgs
    
    # Capturar el código de salida
    $exitCode = $LASTEXITCODE
    if ($exitCode -eq $null -or $exitCode -eq 0) {
        # Si no hay código de salida, asumir éxito si no hubo excepciones
        $exitCode = 0
    }
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    if ($exitCode -eq 0) {
        Write-Host "  ✓ lint:e2e ejecutado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "  ✗ lint:e2e falló (código: $exitCode)" -ForegroundColor Red
    }
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    exit $exitCode
    
} catch {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ✗ Error al ejecutar lint:e2e: $_" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    exit 1
}
