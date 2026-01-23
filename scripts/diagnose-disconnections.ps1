#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de diagnóstico para identificar patrones de desconexión de Cursor

.DESCRIPTION
    Este script verifica la configuración actual, conexión de red, y genera
    un reporte de diagnóstico para ayudar a identificar causas de desconexiones.

.EXAMPLE
    .\scripts\diagnose-disconnections.ps1
    .\scripts\diagnose-disconnections.ps1 -Detailed
#>

param(
    [switch]$Detailed
)

$ErrorActionPreference = "Continue"

Write-Host "🔍 Diagnóstico de Desconexiones de Cursor`n" -ForegroundColor Cyan

# 1. Verificar configuración de Cursor
Write-Host "1️⃣ Verificando configuración de Cursor..." -ForegroundColor Yellow
$settingsPath = ".vscode\settings.json"
if (Test-Path $settingsPath) {
    # Leer JSON y remover comentarios (VS Code permite comentarios en JSON)
    $jsonContent = Get-Content $settingsPath -Raw
    $jsonContent = $jsonContent -replace '//.*?$', '' -replace '/\*.*?\*/', '' -replace '(?m)^\s*//.*$', ''
    try {
        $settings = $jsonContent | ConvertFrom-Json
        $cursorSettings = $settings.PSObject.Properties | Where-Object { $_.Name -like "cursor.*" }
    } catch {
        Write-Host "   ⚠️  Error al parsear JSON (puede tener comentarios): $_" -ForegroundColor Yellow
        $cursorSettings = @()
    }
    
    Write-Host "   ✅ Archivo de configuración encontrado" -ForegroundColor Green
    Write-Host "   📊 Configuraciones de Cursor encontradas: $($cursorSettings.Count)" -ForegroundColor Gray
    
    if ($Detailed) {
        Write-Host "`n   Configuraciones relevantes:" -ForegroundColor Cyan
        $cursorSettings | ForEach-Object {
            $value = if ($_.Value -is [bool]) { 
                if ($_.Value) { "✅" } else { "❌" }
            } else { 
                $_.Value 
            }
            Write-Host "   - $($_.Name): $value" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ⚠️  Archivo de configuración no encontrado" -ForegroundColor Yellow
}

# 2. Verificar conexión de red
Write-Host "`n2️⃣ Verificando conexión de red..." -ForegroundColor Yellow

$testHosts = @(
    @{Name="Google"; Host="google.com"; Port=80},
    @{Name="Cursor API"; Host="api.cursor.sh"; Port=443},
    @{Name="Cursor Main"; Host="cursor.sh"; Port=443}
)

foreach ($testHost in $testHosts) {
    try {
        $result = Test-NetConnection -ComputerName $testHost.Host -Port $testHost.Port -WarningAction SilentlyContinue -InformationLevel Quiet
        if ($result) {
            Write-Host "   ✅ $($testHost.Name) ($($testHost.Host)): Conectado" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $($testHost.Name) ($($testHost.Host)): No conectado" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ⚠️  $($testHost.Name) ($($testHost.Host)): Error al verificar - $_" -ForegroundColor Yellow
    }
}

# 3. Verificar DNS
Write-Host "`n3️⃣ Verificando resolución DNS..." -ForegroundColor Yellow
try {
    $dns = Resolve-DnsName -Name "api.cursor.sh" -ErrorAction SilentlyContinue
    if ($dns) {
        Write-Host "   ✅ DNS de Cursor resuelve correctamente" -ForegroundColor Green
        if ($Detailed) {
            Write-Host "   📍 IP: $($dns[0].IPAddress)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ DNS de Cursor no resuelve" -ForegroundColor Red
    }
} catch {
    Write-Host "   ⚠️  Error al resolver DNS: $_" -ForegroundColor Yellow
}

# 4. Verificar procesos de Cursor
Write-Host "`n4️⃣ Verificando procesos de Cursor..." -ForegroundColor Yellow
$cursorProcesses = Get-Process | Where-Object { $_.ProcessName -like "*cursor*" }
if ($cursorProcesses) {
    Write-Host "   ✅ Procesos de Cursor activos: $($cursorProcesses.Count)" -ForegroundColor Green
    if ($Detailed) {
        $cursorProcesses | ForEach-Object {
            Write-Host "   - $($_.ProcessName) (PID: $($_.Id), Memoria: $([math]::Round($_.WorkingSet64/1MB, 2)) MB)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ⚠️  No se encontraron procesos de Cursor" -ForegroundColor Yellow
}

# 5. Verificar scripts resilientes
Write-Host "`n5️⃣ Verificando scripts resilientes..." -ForegroundColor Yellow
$resilientScript = "scripts\work-resilient.ps1"
if (Test-Path $resilientScript) {
    Write-Host "   ✅ Script resiliente encontrado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Script resiliente no encontrado" -ForegroundColor Yellow
}

# 6. Verificar variables de entorno
Write-Host "`n6️⃣ Verificando variables de entorno..." -ForegroundColor Yellow
$envVars = @(
    "CURSOR_TERMINAL_ANALYSIS",
    "CURSOR_AUTO_SUGGEST",
    "CURSOR_DISABLE_NETWORK_REQUESTS",
    "CURSOR_OFFLINE_MODE"
)

$envVars | ForEach-Object {
    $value = [Environment]::GetEnvironmentVariable($_)
    if ($value) {
        Write-Host "   ✅ $_ = $value" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $_ no está configurada" -ForegroundColor Yellow
    }
}

# 7. Generar recomendaciones
Write-Host "`n7️⃣ Recomendaciones:" -ForegroundColor Yellow

$recommendations = @()

# Verificar si hay problemas de red
$cursorApiTest = Test-NetConnection -ComputerName "api.cursor.sh" -Port 443 -WarningAction SilentlyContinue -InformationLevel Quiet
if (-not $cursorApiTest) {
    $recommendations += "❌ No puedes conectarte a api.cursor.sh - Usa terminal externo o VS Code"
}

# Verificar configuración offline
if ($settings.cursor.general.offlineMode -ne $true) {
    $recommendations += "⚠️  Considera habilitar cursor.general.offlineMode en settings.json"
}

# Verificar scripts
if (-not (Test-Path $resilientScript)) {
    $recommendations += "⚠️  Script resiliente no encontrado - Considera crearlo"
}

if ($recommendations.Count -eq 0) {
    Write-Host "   ✅ No se encontraron problemas críticos" -ForegroundColor Green
    Write-Host "   💡 Si las desconexiones persisten, usa terminal externo para comandos largos" -ForegroundColor Cyan
} else {
    $recommendations | ForEach-Object {
        Write-Host "   $_" -ForegroundColor Yellow
    }
}

# 8. Resumen
Write-Host "`n📊 Resumen del Diagnóstico:" -ForegroundColor Cyan
Write-Host "   - Configuración: $(if (Test-Path $settingsPath) { '✅' } else { '❌' })" -ForegroundColor Gray
Write-Host "   - Conexión a Cursor API: $(if ($cursorApiTest) { '✅' } else { '❌' })" -ForegroundColor Gray
Write-Host "   - Scripts resilientes: $(if (Test-Path $resilientScript) { '✅' } else { '❌' })" -ForegroundColor Gray
Write-Host "`n💡 Para más detalles, ejecuta: .\scripts\diagnose-disconnections.ps1 -Detailed" -ForegroundColor Cyan

Write-Host "`n✅ Diagnóstico completado" -ForegroundColor Green
