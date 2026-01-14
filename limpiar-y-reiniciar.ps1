# Script PowerShell para limpiar y reiniciar el servidor Next.js
# Uso: .\limpiar-y-reiniciar.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Limpiando procesos Node.js y reiniciando" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Detener procesos Node.js
$processes = Get-Process -Name node -ErrorAction SilentlyContinue
if ($processes) {
    $count = $processes.Count
    $processes | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] $count proceso(s) Node.js detenido(s)" -ForegroundColor Green
} else {
    Write-Host "[INFO] No se encontraron procesos Node.js" -ForegroundColor Yellow
}

# Verificar y detener procesos en puertos 3000 y 3001
Write-Host ""
Write-Host "Verificando puertos..." -ForegroundColor Cyan
$port3000 = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
$port3001 = Test-NetConnection -ComputerName localhost -Port 3001 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($port3000) {
    Write-Host "[WARN] Puerto 3000 en uso, intentando liberar..." -ForegroundColor Yellow
    # Intentar encontrar el proceso que usa el puerto 3000
    $netstat = netstat -ano | Select-String ":3000" | Select-Object -First 1
    if ($netstat) {
        $pid = ($netstat -split '\s+')[-1]
        if ($pid -match '^\d+$') {
            Get-Process -Id $pid -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "[OK] Proceso $pid detenido" -ForegroundColor Green
        }
    }
}

if ($port3001) {
    Write-Host "[WARN] Puerto 3001 en uso, intentando liberar..." -ForegroundColor Yellow
    $netstat = netstat -ano | Select-String ":3001" | Select-Object -First 1
    if ($netstat) {
        $pid = ($netstat -split '\s+')[-1]
        if ($pid -match '^\d+$') {
            Get-Process -Id $pid -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "[OK] Proceso $pid detenido" -ForegroundColor Green
        }
    }
}

Start-Sleep -Seconds 1

# Eliminar archivo de lock
$lockPath = ".next\dev\lock"
if (Test-Path $lockPath) {
    Remove-Item $lockPath -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Archivo de lock eliminado" -ForegroundColor Green
} else {
    Write-Host "[INFO] No se encontró archivo de lock en la ruta esperada" -ForegroundColor Yellow
}

# Limpiar otros archivos lock recursivamente
$lockDir = ".next\dev"
if (Test-Path $lockDir) {
    $lockFiles = Get-ChildItem $lockDir -Filter "lock*" -Recurse -ErrorAction SilentlyContinue
    if ($lockFiles) {
        $lockFiles | Remove-Item -Force -ErrorAction SilentlyContinue
        Write-Host "[OK] $($lockFiles.Count) archivo(s) lock adicional(es) eliminado(s)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Esperando 2 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Verificar puertos nuevamente
$port3000 = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
$port3001 = Test-NetConnection -ComputerName localhost -Port 3001 -InformationLevel Quiet -WarningAction SilentlyContinue

Write-Host ""
Write-Host "Estado de puertos:" -ForegroundColor Cyan
if ($port3000) {
    Write-Host "  Puerto 3000: EN USO" -ForegroundColor Yellow
} else {
    Write-Host "  Puerto 3000: DISPONIBLE" -ForegroundColor Green
}
if ($port3001) {
    Write-Host "  Puerto 3001: EN USO" -ForegroundColor Yellow
} else {
    Write-Host "  Puerto 3001: DISPONIBLE" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Iniciando servidor..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm run dev
