# Script para formatear todos los archivos con Prettier
# Ejecutar: .\format-all.ps1

$ErrorActionPreference = "SilentlyContinue"

# Asegurar que estamos en el directorio raíz del proyecto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$helperPath = Join-Path $scriptPath "scripts\Ensure-ProjectRoot.ps1"
if (Test-Path $helperPath) {
    . $helperPath
    $projectRoot = Ensure-ProjectRoot -ScriptPath $scriptPath
} else {
    # Fallback: buscar package.json manualmente
    $currentDir = $scriptPath
    $maxDepth = 10
    $depth = 0
    while ($depth -lt $maxDepth) {
        $packageJsonPath = Join-Path $currentDir "package.json"
        if (Test-Path $packageJsonPath) {
            Set-Location $currentDir
            $projectRoot = $currentDir
            break
        }
        $parentDir = Split-Path $currentDir -Parent
        if ([string]::IsNullOrEmpty($parentDir) -or $parentDir -eq $currentDir) {
            break
        }
        $currentDir = $parentDir
        $depth++
    }
}

# Verificar que package.json existe
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json no encontrado en el directorio actual: $(Get-Location)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Ejecutando desde: $(Get-Location)" -ForegroundColor Green
Write-Host "Formateando archivos con Prettier..." -ForegroundColor Cyan

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

