# 📁 Guía de Navegación en Terminal

## 🎯 Estructura del Proyecto

Tu proyecto está organizado de la siguiente manera:

```
C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\
└── paes-tutor\                    ← AQUÍ está el proyecto real
    ├── package.json              ← Archivo de configuración de npm
    ├── src\                      ← Código fuente
    ├── prisma\                   ← Base de datos
    └── ...
```

## 🚀 Comandos para Navegar

### En PowerShell (Windows)

1. **Ir al directorio del proyecto:**

   ```powershell
   cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
   ```

2. **Verificar que estás en el lugar correcto:**

   ```powershell
   # Debe mostrar "True"
   Test-Path package.json

   # O ver el directorio actual
   Get-Location
   ```

3. **Ejecutar comandos npm:**

   ```powershell
   # Iniciar servidor de desarrollo
   npm run dev

   # Ver todos los scripts disponibles
   npm run

   # Instalar dependencias
   npm install
   ```

### Método Rápido: Crear un Alias

Puedes crear un alias en PowerShell para ir directamente al proyecto:

```powershell
# Agregar al perfil de PowerShell (solo una vez)
notepad $PROFILE

# Agregar esta línea al archivo:
function GoToPAESTutor { cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor" }

# Guardar y cerrar
# Luego ejecutar:
. $PROFILE
```

Después de esto, solo necesitas escribir:

```powershell
GoToPAESTutor
```

## 📝 Comandos Útiles

### Verificar ubicación actual

```powershell
Get-Location
# o simplemente
pwd
```

### Listar archivos del directorio actual

```powershell
Get-ChildItem
# o simplemente
ls
# o
dir
```

### Verificar si package.json existe

```powershell
Test-Path package.json
```

### Ver scripts disponibles

```powershell
npm run
```

## ⚠️ Solución de Problemas

### Error: "Missing script: dev"

**Causa:** Estás en el directorio incorrecto.

**Solución:**

```powershell
# Verificar ubicación actual
Get-Location

# Ir al directorio correcto
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"

# Verificar que package.json existe
Test-Path package.json
# Debe mostrar: True
```

### Error: "No se encuentra la ruta"

**Causa:** La ruta tiene espacios o caracteres especiales.

**Solución:** Usa comillas dobles alrededor de la ruta:

```powershell
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
```

## 💡 Consejos

1. **Siempre verifica tu ubicación antes de ejecutar comandos npm:**

   ```powershell
   Test-Path package.json
   ```

2. **Usa la autocompletación de PowerShell:**
   - Presiona `Tab` para autocompletar nombres de archivos y carpetas
   - Presiona `Ctrl + Space` para ver opciones

3. **Guarda la ruta en una variable:**

   ```powershell
   $projectPath = "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
   cd $projectPath
   ```

4. **Crea un script de inicio rápido:**
   Crea un archivo `start.ps1` en el directorio raíz con:

   ```powershell
   cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
   npm run dev
   ```

   Luego ejecuta:

   ```powershell
   .\start.ps1
   ```

## 🎯 Ruta Completa del Proyecto

```
C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor
```

**Esta es la ruta donde debes ejecutar todos los comandos npm.**
