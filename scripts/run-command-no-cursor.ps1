# Script DEFINITIVO para ejecutar comandos sin que Cursor intente conectarse
# Este script ejecuta comandos en un proceso completamente aislado
# para evitar que Cursor intente analizar la salida y conectarse a sus servidores

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Command,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments = @()
)

# Cambiar al directorio del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Deshabilitar todas las variables de entorno que Cursor podría usar
$env:CURSOR_TELEMETRY = "disabled"
$env:CURSOR_ANALYTICS = "disabled"
$env:VSCODE_TELEMETRY = "disabled"
$env:VSCODE_ANALYTICS = "disabled"

# Configurar variables para evitar análisis automático
$env:CI = "true"  # Modo CI para deshabilitar características interactivas
$env:NO_COLOR = "1"  # Deshabilitar colores que podrían causar análisis

Write-Host "Ejecutando comando en modo aislado (sin conexiones de Cursor)..." -ForegroundColor Cyan
Write-Host "Comando: $Command $($Arguments -join ' ')" -ForegroundColor Gray
Write-Host ""

# Ejecutar el comando en un proceso completamente nuevo usando Start-Process
# Esto evita que Cursor pueda interceptar la salida
$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = $Command
$processInfo.Arguments = ($Arguments -join ' ')
$processInfo.WorkingDirectory = $projectRoot
$processInfo.UseShellExecute = $false
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.CreateNoWindow = $false

# Configurar variables de entorno para el proceso
$processInfo.EnvironmentVariables["CURSOR_TELEMETRY"] = "disabled"
$processInfo.EnvironmentVariables["CURSOR_ANALYTICS"] = "disabled"
$processInfo.EnvironmentVariables["VSCODE_TELEMETRY"] = "disabled"
$processInfo.EnvironmentVariables["VSCODE_ANALYTICS"] = "disabled"
$processInfo.EnvironmentVariables["CI"] = "true"
$processInfo.EnvironmentVariables["NO_COLOR"] = "1"

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $processInfo

# Configurar eventos para mostrar salida en tiempo real
$outputBuilder = New-Object System.Text.StringBuilder
$errorBuilder = New-Object System.Text.StringBuilder

$script:outputData = ""
$script:errorData = ""

$process.add_OutputDataReceived({
    param($sender, $e)
    if ($e.Data -ne $null) {
        Write-Host $e.Data
        [void]$outputBuilder.AppendLine($e.Data)
        $script:outputData += $e.Data + "`n"
    }
})

$process.add_ErrorDataReceived({
    param($sender, $e)
    if ($e.Data -ne $null) {
        Write-Host $e.Data -ForegroundColor Red
        [void]$errorBuilder.AppendLine($e.Data)
        $script:errorData += $e.Data + "`n"
    }
})

try {
    # Iniciar el proceso
    $process.Start() | Out-Null
    $process.BeginOutputReadLine()
    $process.BeginErrorReadLine()
    
    # Esperar a que termine
    $process.WaitForExit()
    
    # Obtener código de salida
    $exitCode = $process.ExitCode
    
    Write-Host ""
    if ($exitCode -eq 0) {
        Write-Host "Comando ejecutado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "Comando falló con código de salida: $exitCode" -ForegroundColor Red
    }
    
    exit $exitCode
} catch {
    Write-Host "Error al ejecutar comando: $_" -ForegroundColor Red
    exit 1
} finally {
    if (-not $process.HasExited) {
        $process.Kill()
    }
    $process.Dispose()
}

