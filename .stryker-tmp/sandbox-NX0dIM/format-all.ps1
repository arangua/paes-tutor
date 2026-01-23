# Script para formatear todos los archivos con Prettier
# Ejecutar: .\format-all.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host "Formateando archivos con Prettier..." -ForegroundColor Cyan

# Cambiar al directorio del proyecto
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Directorios a formatear
$directories = @("src", "scripts", "e2e")

# Tipos de archivos a formatear
$extensions = @("*.ts", "*.tsx", "*.js", "*.jsx", "*.json", "*.md", "*.css")

$fileCount = 0
$formattedCount = 0

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "`nFormateando archivos en: $dir" -ForegroundColor Yellow
        foreach ($ext in $extensions) {
            $files = Get-ChildItem -Path $dir -Recurse -Include $ext -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch "node_modules|\.next|dist|coverage" }
            foreach ($file in $files) {
                $fileCount++
                $relativePath = $file.FullName.Replace($projectRoot + "\", "").Replace("\", "/")
                $result = & npx prettier --write $file.FullName 2>&1
                if ($LASTEXITCODE -eq 0) {
                    $formattedCount++
                    if ($result -match "unchanged") {
                        Write-Host "  ○ $relativePath (sin cambios)" -ForegroundColor Gray
                    } else {
                        Write-Host "  ✓ $relativePath" -ForegroundColor Green
                    }
                }
            }
        }
    }
}

# Formatear archivos en la raíz (solo algunos)
Write-Host "`nFormateando archivos en la raíz..." -ForegroundColor Yellow
$rootFiles = @("package.json", "tsconfig.json", "vitest.config.ts", "next.config.ts")
foreach ($fileName in $rootFiles) {
    if (Test-Path $fileName) {
        $fileCount++
        $result = & npx prettier --write $fileName 2>&1
        if ($LASTEXITCODE -eq 0) {
            $formattedCount++
            if ($result -match "unchanged") {
                Write-Host "  ○ $fileName (sin cambios)" -ForegroundColor Gray
            } else {
                Write-Host "  ✓ $fileName" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`n✅ Procesados $fileCount archivos, $formattedCount formateados" -ForegroundColor Green

