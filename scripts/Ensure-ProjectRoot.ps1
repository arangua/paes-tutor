# Función helper para asegurar que el script se ejecute desde el directorio raíz del proyecto
# Busca package.json hacia arriba en el árbol de directorios y cambia al directorio correcto

function Ensure-ProjectRoot {
    param(
        [string]$ScriptPath = $null
    )
    
    # Si no se proporciona ScriptPath, intentar obtenerlo del contexto de llamada
    if ([string]::IsNullOrEmpty($ScriptPath)) {
        # Intentar obtener el directorio del script que llama a esta función
        $callerScript = (Get-PSCallStack)[1]
        if ($callerScript -and $callerScript.ScriptName) {
            $ScriptPath = Split-Path -Parent $callerScript.ScriptName
        }
    }
    
    # Si aún no hay ScriptPath, usar el directorio actual
    if ([string]::IsNullOrEmpty($ScriptPath)) {
        $ScriptPath = Get-Location
    }
    
    # Convertir a ruta absoluta
    $ScriptPath = (Resolve-Path $ScriptPath -ErrorAction SilentlyContinue).Path
    if ([string]::IsNullOrEmpty($ScriptPath)) {
        $ScriptPath = Get-Location
    }
    
    # Empezar desde el directorio del script o el actual
    $currentDir = $ScriptPath
    
    # Buscar package.json subiendo en el árbol de directorios
    $maxDepth = 10
    $depth = 0
    
    while ($depth -lt $maxDepth) {
        $packageJsonPath = Join-Path $currentDir "package.json"
        
        if (Test-Path $packageJsonPath) {
            # Encontramos package.json, cambiar a este directorio
            Set-Location $currentDir | Out-Null
            return $currentDir
        }
        
        # Subir un nivel
        $parentDir = Split-Path $currentDir -Parent
        
        # Si no hay directorio padre, salir del bucle
        if ([string]::IsNullOrEmpty($parentDir) -or $parentDir -eq $currentDir) {
            break
        }
        
        $currentDir = $parentDir
        $depth++
    }
    
    # Si no encontramos package.json, intentar con la ruta conocida del proyecto
    $knownProjectPath = "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
    if (Test-Path $knownProjectPath) {
        $packageJsonPath = Join-Path $knownProjectPath "package.json"
        if (Test-Path $packageJsonPath) {
            Set-Location $knownProjectPath | Out-Null
            return $knownProjectPath
        }
    }
    
    # Si llegamos aquí, no encontramos el proyecto
    Write-Host "❌ Error: No se pudo encontrar package.json" -ForegroundColor Red
    Write-Host "   Buscado desde: $ScriptPath" -ForegroundColor Yellow
    Write-Host "   Por favor, ejecuta este script desde el directorio del proyecto o desde un subdirectorio." -ForegroundColor Yellow
    exit 1
}

