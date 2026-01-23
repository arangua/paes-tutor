# Script Enterprise para Inicio Seguro del Servidor de Desarrollo
# Limpia procesos bloqueados y asegura un inicio limpio

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot + "\.."
Set-Location $projectRoot

Write-Host "🚀 Inicio Seguro del Servidor de Desarrollo" -ForegroundColor Cyan
Write-Host ""

# ⛔ VALIDACIÓN CRÍTICA: Verificar DATABASE_URL antes de iniciar
Write-Host "🔍 Validando configuración de base de datos..." -ForegroundColor Yellow

# Cargar variables de entorno desde .env.local (si existe)
$envLocalPath = Join-Path $projectRoot ".env.local"
if (Test-Path $envLocalPath) {
    # Leer .env.local y cargar variables
    Get-Content $envLocalPath | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remover comillas dobles o simples del inicio y final si existen
            $value = $value -replace '^["'']|["'']$', ''
            if ($key -eq "DATABASE_URL") {
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
            }
        }
    }
}

# Verificar DATABASE_URL
$dbUrl = $env:DATABASE_URL
if (-not $dbUrl) {
    Write-Host "❌ ERROR: DATABASE_URL no está configurada" -ForegroundColor Red
    Write-Host "   Configure DATABASE_URL en .env.local con una URL de PostgreSQL (Neon)" -ForegroundColor Red
    Write-Host "   Ejemplo: DATABASE_URL=postgresql://user:password@host/database?sslmode=require" -ForegroundColor Yellow
    exit 1
}

# Validar que NO sea SQLite
if ($dbUrl -like "file:*") {
    Write-Host "❌ ERROR: SQLite detectado en DATABASE_URL" -ForegroundColor Red
    Write-Host "   Este proyecto solo usa PostgreSQL (Neon)" -ForegroundColor Red
    Write-Host "   DATABASE_URL actual: $($dbUrl.Substring(0, [Math]::Min(50, $dbUrl.Length)))..." -ForegroundColor Yellow
    Write-Host "   Configure DATABASE_URL en .env.local con una URL de PostgreSQL" -ForegroundColor Yellow
    Write-Host "   Ejemplo: DATABASE_URL=postgresql://user:password@host/database?sslmode=require" -ForegroundColor Yellow
    exit 1
}

# Validar que sea PostgreSQL
if ($dbUrl -notlike "postgresql://*" -and $dbUrl -notlike "postgres://*") {
    Write-Host "❌ ERROR: DATABASE_URL no es una URL de PostgreSQL válida" -ForegroundColor Red
    Write-Host "   DATABASE_URL actual: $($dbUrl.Substring(0, [Math]::Min(50, $dbUrl.Length)))..." -ForegroundColor Yellow
    Write-Host "   Debe comenzar con 'postgresql://' o 'postgres://'" -ForegroundColor Yellow
    exit 1
}

# Mostrar URL redactada (ocultar password)
$redactedUrl = $dbUrl -replace ':[^:@]+@', ':****@'
Write-Host "✅ DATABASE_URL válida (PostgreSQL): $($redactedUrl.Substring(0, [Math]::Min(80, $redactedUrl.Length)))..." -ForegroundColor Green
Write-Host ""

# Ejecutar limpieza primero
$cleanScript = Join-Path $PSScriptRoot "clean-start.ps1"
if (Test-Path $cleanScript) {
    Write-Host "🔧 Ejecutando limpieza previa..." -ForegroundColor Yellow
    & $cleanScript
    Write-Host ""
}

# Esperar un momento para que todo se limpie
Start-Sleep -Seconds 1

# Verificar que no hay procesos bloqueando
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "⚠️ Advertencia: Aún hay procesos de Node.js ejecutándose" -ForegroundColor Yellow
    Write-Host "   Terminando procesos restantes..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Iniciar el servidor
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host ""

npm run dev
