# Script para verificar tipos TypeScript usando el binario local
# No requiere conexión a internet ni npx

param(
    [switch]$NoEmit = $true,
    [string]$Project = "tsconfig.json"
)

$ErrorActionPreference = "Stop"

# Obtener el directorio del script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Cambiar al directorio del proyecto
Push-Location $ProjectRoot

try {
    # Verificar que node_modules existe
    if (-not (Test-Path "node_modules")) {
        Write-Error "node_modules no encontrado. Ejecuta 'npm install' primero."
        exit 1
    }

    # Buscar el binario de TypeScript local
    $TypeScriptPath = Join-Path $ProjectRoot "node_modules\.bin\tsc.cmd"
    
    if (-not (Test-Path $TypeScriptPath)) {
        Write-Error "TypeScript no encontrado en node_modules. Ejecuta 'npm install' primero."
        exit 1
    }

    # Construir argumentos
    $Arguments = @()
    
    if ($NoEmit) {
        $Arguments += "--noEmit"
    }
    
    if ($Project) {
        $Arguments += "--project", $Project
    }

    # Ejecutar TypeScript local
    Write-Host "Ejecutando TypeScript local desde: $TypeScriptPath" -ForegroundColor Cyan
    Write-Host "Argumentos: $($Arguments -join ' ')" -ForegroundColor Cyan
    Write-Host ""

    & $TypeScriptPath $Arguments

    $ExitCode = $LASTEXITCODE
    
    if ($ExitCode -eq 0) {
        Write-Host ""
        Write-Host "✓ Verificación de tipos completada sin errores" -ForegroundColor Green
        exit 0
    } else {
        Write-Host ""
        Write-Host "✗ Se encontraron errores de tipo" -ForegroundColor Red
        exit $ExitCode
    }
} catch {
    Write-Error "Error al ejecutar TypeScript: $_"
    exit 1
} finally {
    Pop-Location
}

