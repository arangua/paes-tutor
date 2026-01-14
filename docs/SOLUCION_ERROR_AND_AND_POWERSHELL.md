# 🔧 Solución: Error "El token '&&' no es un separador de instrucciones válido"

## 📋 Problema

PowerShell 5.1 (versión predeterminada en Windows 10) no reconoce `&&` como separador de comandos. Cuando Cursor intenta ejecutar comandos que contienen `&&`, falla con el error:

```
El token '&&' no es un separador de instrucciones válido en esta versión.
```

## ✅ Soluciones Implementadas

### 1. ✅ Configuración de Terminal (SOLUCIÓN PRINCIPAL)

Se ha configurado el terminal por defecto para usar **Command Prompt (cmd.exe)** en lugar de PowerShell 5.1. Cmd.exe sí soporta `&&` nativamente.

**Archivo:** `.vscode/settings.json`

```json
"terminal.integrated.defaultProfile.windows": "Command Prompt"
```

**Ventajas:**
- ✅ Funciona inmediatamente sin cambios en los comandos
- ✅ Cursor puede ejecutar comandos con `&&` sin problemas
- ✅ No requiere modificar scripts existentes

### 2. Scripts PowerShell Alternativos

Se han creado scripts PowerShell nativos para los comandos que usan `&&`:

- `scripts/run-test-coverage-sonar.ps1` - Ejecuta tests con cobertura y luego SonarQube
- `scripts/check-critical-issues.ps1` - Verifica código y ejecuta tests
- `scripts/run-command-ps5.ps1` - Wrapper que convierte `&&` a `;` automáticamente

### 3. Scripts NPM Alternativos

Se han agregado scripts alternativos en `package.json`:

```json
"test:coverage:sonar:ps1": "powershell -ExecutionPolicy Bypass -File scripts/run-test-coverage-sonar.ps1"
"check:critical-issues:ps1": "powershell -ExecutionPolicy Bypass -File scripts/check-critical-issues.ps1"
```

## 🚀 Uso

### Opción 1: Usar Command Prompt (RECOMENDADO)

Con la nueva configuración, Cursor usará automáticamente cmd.exe que soporta `&&`:

```bash
cd "C:\Users\...\paes-tutor" && npx vitest run src/app/api/notes/versions/route.test.ts
```

**Funciona sin problemas** ✅

### Opción 2: Usar scripts PowerShell directamente

```powershell
.\scripts\run-test-coverage-sonar.ps1
.\scripts\check-critical-issues.ps1
```

### Opción 3: Usar scripts NPM alternativos

```powershell
npm run test:coverage:sonar:ps1
npm run check:critical-issues:ps1
```

### Opción 4: Usar wrapper para convertir && a ;

```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-command-ps5.ps1 "cd path && npx vitest run test.ts"
```

## ⚠️ Nota

Los scripts originales con `&&` deberían funcionar correctamente cuando se ejecutan a través de `npm run`, ya que npm maneja el `&&` internamente. Si encuentras problemas, usa las versiones `:ps1` de los scripts.

## 🔍 Verificar Versión de PowerShell

Para verificar tu versión de PowerShell:

```powershell
$PSVersionTable.PSVersion
```

- PowerShell 5.1 y anteriores: No soportan `&&` nativamente
- PowerShell 7+: Soportan `&&` nativamente

## 🔄 Reiniciar Cursor (IMPORTANTE)

**Después de cambiar la configuración, DEBES reiniciar Cursor completamente** para que los cambios surtan efecto:

1. **Cierra todas las ventanas de Cursor**
2. **Cierra el proceso de Cursor desde el Administrador de Tareas** (si es necesario)
3. **Abre Cursor nuevamente**

Si no reinicias Cursor, seguirá usando la configuración anterior (PowerShell) y el error persistirá.

## ✅ Verificar que la Configuración Funciona

Después de reiniciar Cursor, verifica que está usando cmd.exe:

1. **Abre un nuevo terminal en Cursor** (`Ctrl + Shift + \`` o `Terminal > New Terminal`)
2. **Verifica el tipo de terminal** - Debería decir "Command Prompt" o "cmd" en la pestaña del terminal
3. **Ejecuta un comando de prueba:**
   ```cmd
   cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor" && echo "Funciona"
   ```
   
   Si funciona sin errores, la configuración está correcta ✅

## 🚨 Si el Problema Persiste

Si después de reiniciar Cursor el problema sigue ocurriendo:

### Opción A: Verificar Configuración Manualmente

1. Abre `.vscode/settings.json`
2. Verifica que contenga:
   ```json
   "terminal.integrated.defaultProfile.windows": "Command Prompt",
   "terminal.integrated.automationProfile.windows": {
     "path": "cmd.exe",
     "args": ["/K", "cd /d \"${workspaceFolder}/paes-tutor\""]
   }
   ```

### Opción B: Usar Script Wrapper

Si Cursor sigue usando PowerShell, puedes usar el script wrapper:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-command-ps5.ps1 "cd `"C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor`" && npm run validate:types"
```

### Opción C: Ejecutar Comandos Directamente en CMD

Abre Command Prompt fuera de Cursor y ejecuta los comandos directamente:

```cmd
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
npm run validate:types
```

## 📝 Fecha

2025-01-28  
**Última actualización:** 2025-01-28 - Configuración de terminal cambiada a cmd.exe  
**Actualización:** 2025-01-28 - Agregadas instrucciones de reinicio y verificación

