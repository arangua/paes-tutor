#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de trabajo resiliente que minimiza dependencia de conexión a Cursor

.DESCRIPTION
    Este script ejecuta operaciones comunes sin requerir conexión constante a Cursor.
    Útil cuando hay problemas de conexión recurrentes.

.PARAMETER Command
    Comando a ejecutar: test, lint, build, guard, validate

.PARAMETER Args
    Argumentos adicionales para el comando

.EXAMPLE
    .\scripts\work-resilient.ps1 -Command test
    .\scripts\work-resilient.ps1 -Command lint --fix
    .\scripts\work-resilient.ps1 -Command guard:no-global-patches
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Command,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

$ErrorActionPreference = "Stop"

# Cambiar al directorio del proyecto
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "🔧 Modo Resiliente: Ejecutando '$Command'" -ForegroundColor Cyan
Write-Host "📁 Directorio: $ProjectRoot`n" -ForegroundColor Gray

# Deshabilitar COMPLETAMENTE todas las conexiones de Cursor
$env:CURSOR_TERMINAL_ANALYSIS = "false"
$env:CURSOR_AUTO_SUGGEST = "false"
$env:CURSOR_DISABLE_NETWORK_REQUESTS = "true"
$env:CURSOR_OFFLINE_MODE = "true"
$env:CURSOR_DISABLE_CHAT = "true"
$env:CURSOR_DISABLE_TELEMETRY = "true"
$env:CURSOR_DISABLE_ANALYTICS = "true"
$env:CURSOR_DISABLE_SYNC = "true"
$env:CURSOR_DISABLE_UPDATES = "true"
$env:CURSOR_DISABLE_BACKGROUND_SERVICES = "true"
$env:VITEST_MAX_WORKERS = "2"
$env:NODE_OPTIONS = "--max-old-space-size=4096"

try {
    switch ($Command) {
        "test" {
            Write-Host "🧪 Ejecutando tests..." -ForegroundColor Yellow
            npm run test:run @Args
        }
        "lint" {
            Write-Host "🔍 Ejecutando linter..." -ForegroundColor Yellow
            if ($Args -contains "--fix") {
                npm run lint:fix
            } else {
                npm run lint @Args
            }
        }
        "build" {
            Write-Host "🏗️  Ejecutando build..." -ForegroundColor Yellow
            npm run build @Args
        }
        "guard" {
            Write-Host "🛡️  Ejecutando guardias..." -ForegroundColor Yellow
            npm run guard:no-global-patches @Args
        }
        "validate" {
            Write-Host "✅ Ejecutando validaciones..." -ForegroundColor Yellow
            npm run validate:all @Args
        }
        default {
            Write-Host "⚠️  Comando desconocido: $Command" -ForegroundColor Red
            Write-Host "Comandos disponibles: test, lint, build, guard, validate" -ForegroundColor Yellow
            exit 1
        }
    }
    
    Write-Host "`n✅ Comando completado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Error ejecutando comando: $_" -ForegroundColor Red
    exit 1
}
