# Script para configurar el perfil de PowerShell
# Ejecuta este script UNA VEZ para configurar tu perfil

Write-Host "🔧 Configurando perfil de PowerShell para PAES Tutor..." -ForegroundColor Cyan
Write-Host ""

# Verificar si el perfil existe
if (!(Test-Path $PROFILE)) {
    Write-Host "📝 Creando perfil de PowerShell..." -ForegroundColor Yellow
    $profileDir = Split-Path $PROFILE -Parent
    if (!(Test-Path $profileDir)) {
        New-Item -Path $profileDir -Type Directory -Force | Out-Null
    }
    New-Item -Path $PROFILE -Type File -Force | Out-Null
    Write-Host "✅ Perfil creado: $PROFILE" -ForegroundColor Green
} else {
    Write-Host "✅ Perfil encontrado: $PROFILE" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Agregando configuración..." -ForegroundColor Yellow

# Configuración a agregar
$config = @"

# ============================================
# Configuración para PAES Tutor
# ============================================

# Función para cambiar al directorio del proyecto
function GoToPAESTutor {
    `$projectPath = "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
    if (Test-Path `$projectPath) {
        Set-Location `$projectPath
        Write-Host "✅ Cambiado a: `$projectPath" -ForegroundColor Green
        Write-Host "📦 Proyecto: PAES Tutor" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Directorio no encontrado: `$projectPath" -ForegroundColor Yellow
    }
}

# Alias corto
Set-Alias -Name paes -Value GoToPAESTutor -Force

# Cambiar automáticamente al iniciar PowerShell (descomenta si lo deseas)
# GoToPAESTutor

"@

# Verificar si la configuración ya existe
$profileContent = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue
if ($profileContent -and $profileContent -match "GoToPAESTutor") {
    Write-Host "⚠️  La configuración ya existe en el perfil." -ForegroundColor Yellow
    Write-Host "¿Deseas agregarla de nuevo? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "❌ Configuración cancelada." -ForegroundColor Red
        exit
    }
}

# Agregar la configuración al perfil
Add-Content -Path $PROFILE -Value $config -Force

Write-Host ""
Write-Host "✅ Configuración agregada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Para usar la configuración:" -ForegroundColor Cyan
Write-Host "   1. Recarga el perfil: . `$PROFILE" -ForegroundColor White
Write-Host "   2. O cierra y vuelve a abrir PowerShell" -ForegroundColor White
Write-Host ""
Write-Host "💡 Comandos disponibles:" -ForegroundColor Yellow
Write-Host "   GoToPAESTutor  - Cambiar al directorio del proyecto" -ForegroundColor White
Write-Host "   paes           - Alias corto (mismo comando)" -ForegroundColor White
Write-Host ""
Write-Host "¿Deseas recargar el perfil ahora? (S/N)" -ForegroundColor Yellow
$reload = Read-Host
if ($reload -eq "S" -or $reload -eq "s") {
    . $PROFILE
    Write-Host "✅ Perfil recargado!" -ForegroundColor Green
}

