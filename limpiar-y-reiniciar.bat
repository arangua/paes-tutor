@echo off
echo ========================================
echo Limpiando procesos Node.js y reiniciando
echo ========================================
echo.

REM Detener procesos Node.js usando PowerShell
powershell -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
if %errorlevel% equ 0 (
    echo [OK] Procesos Node.js detenidos
) else (
    echo [INFO] No se encontraron procesos Node.js
)

REM Eliminar archivo de lock usando PowerShell
powershell -Command "if (Test-Path '.next\dev\lock') { Remove-Item '.next\dev\lock' -Force -ErrorAction SilentlyContinue; Write-Host '[OK] Archivo de lock eliminado' } else { Write-Host '[INFO] No se encontró archivo de lock' }"

echo.
echo Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Iniciando servidor...
echo ========================================
echo.

npm run dev
