# 🔧 Configurar Terminal para Iniciar en el Directorio Correcto

Esta guía te ayudará a configurar tu terminal para que siempre inicie en el directorio correcto del proyecto.

## 🎯 Opción 1: Configuración de VS Code / Cursor (Recomendado)

Si usas VS Code o Cursor, la configuración ya está lista. Solo necesitas:

1. **Abrir el workspace correcto:**
   - Abre la carpeta `paes-tutor` (la carpeta interna) como workspace
   - O abre la carpeta raíz y VS Code usará la configuración automáticamente

2. **Verificar la configuración:**
   - El archivo `.vscode/settings.json` ya está configurado
   - El terminal debería abrirse automáticamente en el directorio correcto

## 🎯 Opción 2: Perfil de PowerShell (Para cualquier terminal)

Configura PowerShell para que siempre vaya al directorio del proyecto al iniciar.

### Paso 1: Crear el perfil de PowerShell

```powershell
# Verificar si el perfil existe
Test-Path $PROFILE

# Si no existe, crear el directorio y el archivo
if (!(Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -Type File -Force
}
```

### Paso 2: Agregar la configuración

Abre el perfil en un editor:

```powershell
notepad $PROFILE
```

Agrega estas líneas al final del archivo:

```powershell
# Cambiar automáticamente al directorio del proyecto PAES Tutor
function GoToPAESTutor {
    $projectPath = "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
    if (Test-Path $projectPath) {
        Set-Location $projectPath
        Write-Host "✅ Cambiado a: $projectPath" -ForegroundColor Green
        Write-Host "📦 Proyecto: PAES Tutor" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Directorio no encontrado: $projectPath" -ForegroundColor Yellow
    }
}

# Cambiar automáticamente al iniciar PowerShell (opcional)
# Descomenta la siguiente línea si quieres que cambie automáticamente:
# GoToPAESTutor
```

### Paso 3: Guardar y recargar

1. Guarda el archivo (Ctrl+S)
2. Cierra y vuelve a abrir PowerShell, o ejecuta:

```powershell
. $PROFILE
```

### Paso 4: Usar la función

Ahora puedes usar el comando en cualquier momento:

```powershell
GoToPAESTutor
```

## 🎯 Opción 3: Script de Inicio Rápido

Crea un script que puedas ejecutar para ir directamente al proyecto.

### Crear el script

Crea un archivo `iniciar-proyecto.ps1` en tu escritorio o en cualquier lugar accesible:

```powershell
# iniciar-proyecto.ps1
$projectPath = "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"

if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "✅ Cambiado a: $projectPath" -ForegroundColor Green
    Write-Host "📦 Proyecto: PAES Tutor" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Comandos útiles:" -ForegroundColor Yellow
    Write-Host "  npm run dev     - Iniciar servidor de desarrollo"
    Write-Host "  npm run build   - Compilar el proyecto"
    Write-Host "  npm run test    - Ejecutar tests"
    Write-Host ""
} else {
    Write-Host "❌ Directorio no encontrado: $projectPath" -ForegroundColor Red
    Write-Host "Por favor, verifica la ruta del proyecto." -ForegroundColor Yellow
}
```

### Usar el script

1. **Desde PowerShell:**

   ```powershell
   .\iniciar-proyecto.ps1
   ```

2. **Desde el Explorador de Windows:**
   - Clic derecho en el archivo → "Ejecutar con PowerShell"

3. **Crear un acceso directo:**
   - Clic derecho en el script → "Crear acceso directo"
   - Puedes ponerlo en el escritorio o en la barra de tareas

## 🎯 Opción 4: Alias en PowerShell

Crea un alias corto para cambiar rápidamente al directorio.

Agrega esto a tu perfil de PowerShell (`notepad $PROFILE`):

```powershell
# Alias para ir al proyecto PAES Tutor
Set-Alias -Name paes -Value GoToPAESTutor

function GoToPAESTutor {
    Set-Location "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
}
```

Ahora puedes usar simplemente:

```powershell
paes
```

## 🎯 Opción 5: Configurar el Workspace en VS Code/Cursor

Si abres VS Code/Cursor desde el directorio correcto, el terminal heredará esa ubicación.

### Método A: Abrir desde el Explorador

1. Navega a: `C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor`
2. Clic derecho → "Abrir con Code" o "Abrir con Cursor"

### Método B: Abrir desde la terminal

```powershell
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
code .
# o
cursor .
```

## 📝 Verificar la Configuración

Para verificar que estás en el directorio correcto:

```powershell
# Ver el directorio actual
Get-Location

# Verificar que package.json existe
Test-Path package.json
# Debe mostrar: True

# Ver la ruta completa
(Get-Location).Path
```

## 🔄 Solución Rápida (Temporal)

Si necesitas cambiar rápidamente sin configurar nada:

```powershell
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
```

O crea un archivo `cd-proyecto.txt` con este comando y cópialo cuando lo necesites.

## 💡 Recomendación

**Para uso diario, recomiendo:**

1. **Opción 1** (Configuración de VS Code/Cursor) - Si usas estos editores
2. **Opción 2** (Perfil de PowerShell) - Si quieres que funcione en cualquier terminal
3. **Opción 3** (Script de inicio) - Si prefieres un acceso rápido desde el escritorio

## 🆘 Solución de Problemas

### El terminal no cambia al directorio correcto

1. **Verifica la ruta:**

   ```powershell
   Test-Path "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
   ```

2. **Verifica los permisos:**

   ```powershell
   Get-ExecutionPolicy
   ```

   Si es `Restricted`, cambia a `RemoteSigned`:

   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Recarga el perfil:**
   ```powershell
   . $PROFILE
   ```

### La configuración de VS Code no funciona

1. Verifica que el archivo `.vscode/settings.json` existe
2. Reinicia VS Code/Cursor
3. Abre el workspace desde el directorio correcto

## 📚 Referencias

- [Documentación de PowerShell Profiles](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles)
- [VS Code Terminal Settings](https://code.visualstudio.com/docs/editor/integrated-terminal)
