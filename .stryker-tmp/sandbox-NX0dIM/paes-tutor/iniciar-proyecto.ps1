# Script de inicio rápido para PAES Tutor
# Ejecuta este script para cambiar automáticamente al directorio del proyecto

$projectPath = "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"

Write-Host ""
Write-Host "🚀 Iniciando PAES Tutor..." -ForegroundColor Cyan
Write-Host ""

if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "✅ Cambiado a: $projectPath" -ForegroundColor Green
    Write-Host "📦 Proyecto: PAES Tutor" -ForegroundColor Cyan
    Write-Host ""
    
    # Verificar que package.json existe
    if (Test-Path "package.json") {
        Write-Host "✅ Proyecto encontrado correctamente" -ForegroundColor Green
        Write-Host ""
        
        # Terminar procesos de Node.js que puedan estar bloqueando puertos o locks
        $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            $processCount = $nodeProcesses.Count
            $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "🛑 Terminados $processCount proceso(s) de Node.js" -ForegroundColor Yellow
            Start-Sleep -Seconds 1
        }
        
        # Limpiar archivo de lock de Next.js si existe
        $lockPath = ".next\dev\lock"
        if (Test-Path $lockPath) {
            Remove-Item $lockPath -Force -ErrorAction SilentlyContinue
            Write-Host "🧹 Archivo de lock eliminado" -ForegroundColor Yellow
        }
        
        Write-Host "📋 Comandos útiles:" -ForegroundColor Yellow
        Write-Host "   npm run dev     - Iniciar servidor de desarrollo" -ForegroundColor White
        Write-Host "   npm run build   - Compilar el proyecto" -ForegroundColor White
        Write-Host "   npm run test    - Ejecutar tests" -ForegroundColor White
        Write-Host "   npm run lint    - Verificar código" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "⚠️  package.json no encontrado. Verifica que estés en el directorio correcto." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Directorio no encontrado: $projectPath" -ForegroundColor Red
    Write-Host "Por favor, verifica la ruta del proyecto." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Sugerencia: Actualiza la variable `projectPath` en este script con la ruta correcta." -ForegroundColor Cyan
}

Write-Host ""

