#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de trabajo completamente offline - No requiere conexión a Cursor

.DESCRIPTION
    Este script ejecuta operaciones comunes sin ninguna dependencia de conexión a Cursor.
    Configura variables de entorno para deshabilitar completamente todas las conexiones.

.PARAMETER Command
    Comando a ejecutar: test, lint, build, guard, validate, dev, o cualquier comando npm

.PARAMETER Args
    Argumentos adicionales para el comando

.EXAMPLE
    .\scripts\work-offline.ps1 -Command test
    .\scripts\work-offline.ps1 -Command lint --fix
    .\scripts\work-offline.ps1 -Command "npm run dev"
    .\scripts\work-offline.ps1 -Command custom -Args "npm", "run", "build"
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

Write-Host "🔌 Modo OFFLINE: Ejecutando '$Command'" -ForegroundColor Cyan
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
$env:CURSOR_DISABLE_AI_FEATURES = "true"
$env:CURSOR_DISABLE_CODE_ACTIONS = "true"
$env:CURSOR_DISABLE_INLINE_COMPLETION = "true"
$env:CURSOR_DISABLE_AUTO_IMPORT = "true"
$env:CURSOR_DISABLE_SEMANTIC_HIGHLIGHTING = "true"
$env:CURSOR_DISABLE_LSP = "false"  # Mantener LSP básico para edición

# Reducir workers de Vitest para evitar sobrecarga
$env:VITEST_MAX_WORKERS = "2"
$env:NODE_OPTIONS = "--max-old-space-size=4096"

Write-Host "✅ Variables de entorno configuradas para modo offline" -ForegroundColor Green
Write-Host "🚫 Todas las conexiones de Cursor deshabilitadas`n" -ForegroundColor Yellow

try {
    switch ($Command.ToLower()) {
        "test" {
            Write-Host "🧪 Ejecutando tests..." -ForegroundColor Yellow
            npm run test:run @Args
        }
        "test:watch" {
            Write-Host "🧪 Ejecutando tests en modo watch..." -ForegroundColor Yellow
            npm run test:watch @Args
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
        "dev" {
            Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Yellow
            Write-Host "⚠️  Nota: El servidor se ejecutará en modo offline" -ForegroundColor Cyan
            npm run dev @Args
        }
        "guard" {
            Write-Host "🛡️  Ejecutando guardias..." -ForegroundColor Yellow
            npm run guard:no-global-patches @Args
        }
        "validate" {
            Write-Host "✅ Ejecutando validaciones..." -ForegroundColor Yellow
            npm run validate:all @Args
        }
        "custom" {
            Write-Host "⚙️  Ejecutando comando personalizado..." -ForegroundColor Yellow
            & @Args
        }
        default {
            # Intentar ejecutar como comando npm directo
            Write-Host "⚙️  Ejecutando: npm run $Command" -ForegroundColor Yellow
            npm run $Command @Args
        }
    }
    
    Write-Host "`n✅ Comando completado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Error ejecutando comando: $_" -ForegroundColor Red
    Write-Host "💡 Tip: Verifica que el comando existe en package.json" -ForegroundColor Cyan
    exit 1
}
