# Script Enterprise para Limpieza y Reinicio Completo
# Soluciona problemas de procesos bloqueados, locks y base de datos

param(
    [switch]$Force,
    [switch]$SkipDatabase
)

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot + "\.."
Set-Location $projectRoot

Write-Host "🔧 Limpieza Enterprise - Iniciando..." -ForegroundColor Cyan
Write-Host "📁 Directorio: $projectRoot" -ForegroundColor Gray

# Paso 1: Terminar TODOS los procesos de Node.js y Next.js
Write-Host "`n[1/6] Terminando procesos de Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "  ⚠ Terminando proceso: $($_.Id) - $($_.ProcessName)" -ForegroundColor Red
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "  ✅ Procesos terminados" -ForegroundColor Green
} else {
    Write-Host "  ℹ No hay procesos de Node.js ejecutándose" -ForegroundColor Gray
}

# Paso 2: Terminar procesos en puertos 3000 y 3001
Write-Host "`n[2/6] Liberando puertos 3000 y 3001..." -ForegroundColor Yellow
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $connections | ForEach-Object {
            $processId = $_.OwningProcess
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "  ⚠ Terminando proceso en puerto $port : $($process.Id) - $($process.ProcessName)" -ForegroundColor Red
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
}
Start-Sleep -Seconds 1
Write-Host "  ✅ Puertos liberados" -ForegroundColor Green

# Paso 3: Limpiar archivos de lock y temporales de Next.js
Write-Host "`n[3/6] Limpiando archivos de lock y temporales..." -ForegroundColor Yellow
$lockFiles = @(
    ".next\dev\lock",
    ".next\cache\**\*.lock",
    ".next\**\*.lock"
)

$cleaned = 0
foreach ($pattern in $lockFiles) {
    $files = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue -Recurse
    foreach ($file in $files) {
        try {
            Remove-Item -Path $file.FullName -Force -ErrorAction Stop
            Write-Host "  🗑️ Eliminado: $($file.Name)" -ForegroundColor Gray
            $cleaned++
        } catch {
            Write-Host "  ⚠ No se pudo eliminar: $($file.FullName)" -ForegroundColor Yellow
        }
    }
}

if ($cleaned -eq 0) {
    Write-Host "  ℹ No se encontraron archivos de lock" -ForegroundColor Gray
} else {
    Write-Host "  ✅ $cleaned archivo(s) eliminado(s)" -ForegroundColor Green
}

# Paso 4: Verificar configuración de base de datos (PostgreSQL)
if (-not $SkipDatabase) {
    Write-Host "`n[4/6] Verificando configuración de base de datos..." -ForegroundColor Yellow
    
    # Leer DATABASE_URL de .env.local primero, luego .env
    $envLocalFile = Join-Path $projectRoot ".env.local"
    $envFile = Join-Path $projectRoot ".env"
    $dbUrl = $null
    
    if (Test-Path $envLocalFile) {
        $envContent = Get-Content $envLocalFile -Raw
        if ($envContent -match "DATABASE_URL=(.+)") {
            $dbUrl = $matches[1].Trim()
        }
    }
    
    if (-not $dbUrl -and (Test-Path $envFile)) {
        $envContent = Get-Content $envFile -Raw
        if ($envContent -match "DATABASE_URL=(.+)") {
            $dbUrl = $matches[1].Trim()
        }
    }
    
    if (-not $dbUrl) {
        Write-Host "  ⚠ Advertencia: DATABASE_URL no encontrada en .env.local o .env" -ForegroundColor Yellow
        Write-Host "  Configure DATABASE_URL con una URL de PostgreSQL (Neon) en .env.local" -ForegroundColor Yellow
    } else {
        # Validar que NO sea SQLite
        if ($dbUrl -like "file:*") {
            Write-Host "  ❌ ERROR: SQLite detectado en DATABASE_URL" -ForegroundColor Red
            Write-Host "  Este proyecto solo usa PostgreSQL (Neon)" -ForegroundColor Red
            Write-Host "  DATABASE_URL actual: $($dbUrl.Substring(0, [Math]::Min(50, $dbUrl.Length)))..." -ForegroundColor Yellow
            Write-Host "  Configure DATABASE_URL con una URL de PostgreSQL en .env.local" -ForegroundColor Yellow
        } elseif ($dbUrl -like "postgresql://*" -or $dbUrl -like "postgres://*") {
            # Mostrar URL redactada (ocultar password)
            $redactedUrl = $dbUrl -replace ':[^:@]+@', ':****@'
            Write-Host "  ✅ DATABASE_URL válida (PostgreSQL): $($redactedUrl.Substring(0, [Math]::Min(80, $redactedUrl.Length)))..." -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Advertencia: DATABASE_URL no parece ser una URL de PostgreSQL válida" -ForegroundColor Yellow
            Write-Host "  DATABASE_URL actual: $($dbUrl.Substring(0, [Math]::Min(50, $dbUrl.Length)))..." -ForegroundColor Yellow
        }
    }
}

# Paso 5: Limpiar caché de Next.js (opcional, solo si --Force)
if ($Force) {
    Write-Host "`n[5/6] Limpiando caché de Next.js..." -ForegroundColor Yellow
    if (Test-Path ".next") {
        Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Caché eliminado" -ForegroundColor Green
    } else {
        Write-Host "  ℹ No hay caché para limpiar" -ForegroundColor Gray
    }
} else {
    Write-Host "`n[5/6] Limpieza de caché omitida (usa --Force para limpiar)" -ForegroundColor Gray
}

# Paso 6: Verificar que todo está listo
Write-Host "`n[6/6] Verificación final..." -ForegroundColor Yellow

# Verificar que no hay procesos bloqueando
$remainingProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($remainingProcesses) {
    Write-Host "  ⚠ Advertencia: Aún hay procesos de Node.js ejecutándose" -ForegroundColor Yellow
    $remainingProcesses | ForEach-Object {
        Write-Host "    - PID: $($_.Id)" -ForegroundColor Gray
    }
} else {
    Write-Host "  ✅ No hay procesos bloqueando" -ForegroundColor Green
}

# Verificar que no hay locks
$remainingLocks = Get-ChildItem -Path ".next" -Filter "*.lock" -Recurse -ErrorAction SilentlyContinue
if ($remainingLocks) {
    Write-Host "  ⚠ Advertencia: Aún hay archivos de lock" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ No hay archivos de lock" -ForegroundColor Green
}

Write-Host "`n✨ Limpieza completada exitosamente!" -ForegroundColor Green
Write-Host "`n🚀 Puedes ejecutar 'npm run dev' ahora" -ForegroundColor Cyan
