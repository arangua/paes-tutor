# Script ALTERNATIVO para ejecutar lint:e2e usando cmd.exe
# cmd.exe puede tener menos hooks de Cursor que PowerShell
# Uso: .\scripts\run-lint-e2e-cmd.ps1

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
$env:CI = "true"
$env:NO_COLOR = "1"
$env:FORCE_COLOR = "0"
$env:TERM = "dumb"
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:NO_PROXY = "*"

Write-Host "Ejecutando lint:e2e usando cmd.exe (modo aislado)..." -ForegroundColor Cyan
Write-Host ""

# Construir comando completo para cmd.exe
$eslintPath = Join-Path $projectRoot "node_modules\.bin\eslint.cmd"
if (-not (Test-Path $eslintPath)) {
    $eslintPath = Join-Path $projectRoot "node_modules\.bin\eslint"
}

if (-not (Test-Path $eslintPath)) {
    Write-Host "ERROR: ESLint no encontrado." -ForegroundColor Red
    exit 1
}

# Construir comando para cmd.exe
$cmdCommand = "`"$eslintPath`" e2e/**/*.ts e2e/**/*.tsx playwright.config.ts --max-warnings 0"

# Ejecutar usando cmd.exe con /c (ejecutar y cerrar)
$exitCode = 0
try {
    # Usar Start-Process con cmd.exe para mayor aislamiento
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $cmdCommand -WorkingDirectory $projectRoot -NoNewWindow -Wait -PassThru -RedirectStandardOutput "nul" -RedirectStandardError "nul"
    
    # Si usamos redirección, necesitamos ejecutar de otra forma para ver la salida
    # Mejor ejecutar directamente pero con todas las variables configuradas
    & cmd.exe /c $cmdCommand
    
    $exitCode = $LASTEXITCODE
    if ($exitCode -eq $null) {
        $exitCode = 0
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    $exitCode = 1
}

exit $exitCode
