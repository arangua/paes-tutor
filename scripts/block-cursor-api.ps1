#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Bloquea conexiones a api.cursor.sh para evitar desconexiones repetidas

.DESCRIPTION
    Este script configura reglas de firewall para bloquear conexiones a api.cursor.sh,
    evitando que Cursor intente conectarse y cause desconexiones.

.PARAMETER Action
    Acción a realizar: Block (bloquear) o Unblock (desbloquear)

.EXAMPLE
    .\scripts\block-cursor-api.ps1 -Action Block
    .\scripts\block-cursor-api.ps1 -Action Unblock
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Block", "Unblock")]
    [string]$Action
)

# Requiere permisos de administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ Este script requiere permisos de administrador" -ForegroundColor Red
    Write-Host "💡 Ejecuta PowerShell como administrador y vuelve a intentar" -ForegroundColor Yellow
    exit 1
}

$ruleName = "BlockCursorAPI"
$hosts = @("api.cursor.sh", "cursor.sh")

if ($Action -eq "Block") {
    Write-Host "🛡️  Bloqueando conexiones a api.cursor.sh..." -ForegroundColor Yellow
    
    foreach ($host in $hosts) {
        try {
            # Verificar si la regla ya existe
            $existingRule = Get-NetFirewallRule -DisplayName "$ruleName-$host" -ErrorAction SilentlyContinue
            
            if ($existingRule) {
                Write-Host "   ⚠️  Regla para $host ya existe, eliminando..." -ForegroundColor Gray
                Remove-NetFirewallRule -DisplayName "$ruleName-$host" -ErrorAction SilentlyContinue
            }
            
            # Crear regla de firewall para bloquear salida
            New-NetFirewallRule -DisplayName "$ruleName-$host" `
                -Direction Outbound `
                -RemoteAddress $host `
                -Action Block `
                -Enabled True `
                -Description "Bloquea conexiones a $host para evitar desconexiones de Cursor" `
                -ErrorAction Stop
            
            Write-Host "   ✅ Bloqueada conexión a $host" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  Error bloqueando $host : $_" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n✅ Conexiones bloqueadas exitosamente" -ForegroundColor Green
    Write-Host "💡 Cursor ya no podrá conectarse a api.cursor.sh" -ForegroundColor Cyan
    Write-Host "⚠️  Nota: Esto puede deshabilitar algunas funcionalidades de IA de Cursor" -ForegroundColor Yellow
    
} elseif ($Action -eq "Unblock") {
    Write-Host "🔓 Desbloqueando conexiones a api.cursor.sh..." -ForegroundColor Yellow
    
    foreach ($host in $hosts) {
        try {
            $existingRule = Get-NetFirewallRule -DisplayName "$ruleName-$host" -ErrorAction SilentlyContinue
            
            if ($existingRule) {
                Remove-NetFirewallRule -DisplayName "$ruleName-$host" -ErrorAction Stop
                Write-Host "   ✅ Desbloqueada conexión a $host" -ForegroundColor Green
            } else {
                Write-Host "   ℹ️  No hay regla para $host" -ForegroundColor Gray
            }
        } catch {
            Write-Host "   ⚠️  Error desbloqueando $host : $_" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n✅ Conexiones desbloqueadas exitosamente" -ForegroundColor Green
}

Write-Host "`n💡 Para verificar reglas de firewall:" -ForegroundColor Cyan
Write-Host "   Get-NetFirewallRule -DisplayName '$ruleName-*'" -ForegroundColor Gray
