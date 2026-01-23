# Script wrapper para ejecutar comandos que contienen && en PowerShell 5.1
# Convierte automáticamente && a ; para compatibilidad con PowerShell 5.1

param(
    [Parameter(Mandatory=$true, ValueFromRemainingArguments=$true)]
    [string[]]$CommandParts
)

# Unir todas las partes del comando
$fullCommand = $CommandParts -join ' '

# Convertir && a ; para PowerShell 5.1
$convertedCommand = $fullCommand -replace ' && ', '; '

Write-Host "Comando original: $fullCommand" -ForegroundColor Gray
Write-Host "Comando convertido: $convertedCommand" -ForegroundColor Yellow
Write-Host ""

# Ejecutar el comando convertido
Invoke-Expression $convertedCommand

# Retornar código de salida
exit $LASTEXITCODE

