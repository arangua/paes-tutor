# Script para configurar un alias de npm que verifica el directorio automáticamente
# Ejecutar: .\scripts\Setup-NpmAlias.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔧 Configurando alias de npm seguro..." -ForegroundColor Cyan
Write-Host ""

# Obtener la ruta del script wrapper
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$wrapperPath = Join-Path $scriptPath "npm-wrapper.ps1"

if (-not (Test-Path $wrapperPath)) {
    Write-Host "❌ Error: No se encontró npm-wrapper.ps1 en: $wrapperPath" -ForegroundColor Red
    exit 1
}

# Convertir a ruta absoluta
$wrapperPath = (Resolve-Path $wrapperPath).Path

# Crear el código de la función
$functionCode = @"
function npm {
    param(
        [Parameter(ValueFromRemainingArguments=`$true)]
        [string[]]`$NpmArgs
    )
    
    # Ejecutar el wrapper
    & "$wrapperPath" @NpmArgs
}
"@

# Verificar si el perfil existe
$profilePath = $PROFILE
$profileDir = Split-Path -Parent $profilePath

if (-not (Test-Path $profileDir)) {
    Write-Host "📁 Creando directorio del perfil: $profileDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

# Verificar si ya existe la función
$profileContent = ""
if (Test-Path $profilePath) {
    $profileContent = Get-Content $profilePath -Raw
}

if ($profileContent -match "function npm\s*\{" -or $profileContent -match "function npm\s*\(`$") {
    Write-Host "⚠️  Ya existe una función 'npm' en el perfil." -ForegroundColor Yellow
    Write-Host "   ¿Deseas reemplazarla? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "❌ Operación cancelada." -ForegroundColor Red
        exit 0
    }
    
    # Remover la función existente
    $profileContent = $profileContent -replace "(?s)function npm\s*\{[^\}]*\}", ""
    $profileContent = $profileContent -replace "(?s)function npm\s*\([^\)]*\)\s*\{[^\}]*\}", ""
}

# Agregar la función al perfil
$separator = "`n`n# ========================================`n# npm wrapper - Verifica directorio automáticamente`n# Agregado el $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n# ========================================`n"
$newContent = $separator + $functionCode + "`n"

if ($profileContent -and -not $profileContent.EndsWith("`n")) {
    $newContent = "`n" + $newContent
}

Add-Content -Path $profilePath -Value $newContent

Write-Host "✅ Alias configurado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 La función 'npm' ha sido agregada a tu perfil de PowerShell." -ForegroundColor Cyan
Write-Host "   Ubicación: $profilePath" -ForegroundColor Gray
Write-Host ""
Write-Host "🔄 Para aplicar los cambios, ejecuta:" -ForegroundColor Yellow
Write-Host "   . `$PROFILE" -ForegroundColor White
Write-Host ""
Write-Host "💡 O simplemente cierra y vuelve a abrir PowerShell." -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Después de esto, podrás usar 'npm' normalmente desde cualquier directorio:" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npm test" -ForegroundColor White
Write-Host ""

