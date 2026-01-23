# Script para configurar JAVA_HOME permanentemente
# Ejecutar como Administrador: .\configurar-java.ps1

$javaPath = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"

# Verificar que Java esté instalado
if (-not (Test-Path $javaPath)) {
    Write-Host "❌ Java no encontrado en: $javaPath" -ForegroundColor Red
    Write-Host "Por favor, instala Java primero con: winget install Microsoft.OpenJDK.17" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Java encontrado en: $javaPath" -ForegroundColor Green

# Configurar JAVA_HOME en variables de entorno del sistema
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, [System.EnvironmentVariableTarget]::Machine)

# Agregar Java al PATH del sistema
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
$javaBinPath = "$javaPath\bin"

if ($currentPath -notlike "*$javaBinPath*") {
    [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$javaBinPath", [System.EnvironmentVariableTarget]::Machine)
    Write-Host "✅ Java agregado al PATH del sistema" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Java ya está en el PATH del sistema" -ForegroundColor Yellow
}

Write-Host "`n✅ Configuración completada!" -ForegroundColor Green
Write-Host "`n⚠️  IMPORTANTE: Cierra y vuelve a abrir la terminal para que los cambios surtan efecto." -ForegroundColor Yellow
Write-Host "`nPara verificar, ejecuta:" -ForegroundColor Cyan
Write-Host "  java -version" -ForegroundColor White
Write-Host "  echo `$env:JAVA_HOME" -ForegroundColor White

