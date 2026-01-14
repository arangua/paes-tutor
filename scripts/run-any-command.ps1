# Script universal para ejecutar CUALQUIER comando sin errores de conexión de Cursor
# Uso: .\scripts\run-any-command.ps1 "npm" "run" "test"
# O: .\scripts\run-any-command.ps1 "npx" "vitest" "run"

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Command,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments = @()
)

# Cambiar al directorio del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Configurar entorno para evitar conexiones de Cursor
$env:CURSOR_TELEMETRY = "disabled"
$env:CURSOR_ANALYTICS = "disabled"
$env:VSCODE_TELEMETRY = "disabled"
$env:VSCODE_ANALYTICS = "disabled"
$env:CI = "true"
$env:NO_COLOR = "1"

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Ejecutando comando en modo aislado" -ForegroundColor Cyan
Write-Host "  (Sin conexiones de Cursor)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comando: $Command $($Arguments -join ' ')" -ForegroundColor Yellow
Write-Host ""

# Ejecutar directamente - la salida se mostrará en tiempo real
# Esto evita que Cursor intente analizar la salida
try {
    & $Command $Arguments
    
    if ($LASTEXITCODE -ne $null) {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Comando ejecutado exitosamente" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Comando falló (código: $LASTEXITCODE)" -ForegroundColor Red
        }
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        exit $LASTEXITCODE
    } else {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "  ✓ Comando completado" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        exit 0
    }
} catch {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ✗ Error: $_" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    exit 1
}

