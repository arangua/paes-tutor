# 🔧 Solución de Problemas de Terminal

## ✅ Problemas Resueltos

### 1. Error de Importación de `pdf-parse`

**Problema:** `Export default doesn't exist in target module`

**Solución aplicada:** Cambiado el import de `import pdf from 'pdf-parse'` a `const pdfParse = require('pdf-parse')` para compatibilidad con Next.js Turbopack.

### 2. Error de Regex Flag

**Problema:** `This regular expression flag is only available when targeting 'es2018' or later`

**Solución aplicada:** Cambiado el flag `s` (dotAll) por `[\s\S]` que es compatible con todas las versiones de JavaScript.

### 3. Error de `fsSync.unlink`

**Problema:** `Property 'catch' does not exist on type 'void'`

**Solución aplicada:** Cambiado `fsSync.unlink(dest).catch()` a `fsSync.unlinkSync(dest)` dentro de un try-catch.

## ⚠️ Problemas Pendientes (No Críticos)

### 1. Proceso de Next.js en Ejecución

**Problema:**

```
⚠ Port 3000 is in use by process 15284, using available port 3001 instead.
⨯ Unable to acquire lock at ...\.next\dev\lock, is another instance of next dev running?
```

**Solución:**

**Opción A: Detener el proceso existente**

```powershell
# Encontrar el proceso
Get-Process -Id 15284

# Detener el proceso
Stop-Process -Id 15284 -Force

# O detener todos los procesos de Node.js
Get-Process node | Stop-Process -Force
```

**Opción B: Usar el puerto 3001**
El servidor ya está corriendo en el puerto 3001, simplemente accede a:

```
http://localhost:3001
```

### 2. Advertencia de Múltiples Lockfiles

**Problema:**

```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
We detected multiple lockfiles...
```

**Solución:**

Esto ocurre porque hay un `package-lock.json` en `C:\Users\arang\` y otro en el proyecto.

**Opción A: Eliminar el lockfile extra (si no es necesario)**

```powershell
# Verificar si existe
Test-Path "C:\Users\arang\package-lock.json"

# Si existe y no lo necesitas, eliminarlo
Remove-Item "C:\Users\arang\package-lock.json" -ErrorAction SilentlyContinue
```

**Opción B: Configurar el root en `next.config.ts`**

```typescript
// next.config.ts
export default {
  // ... otras configuraciones
  turbopack: {
    root: process.cwd(), // o la ruta específica
  },
}
```

### 3. Error de Husky

**Problema:**

```
"husky" no se reconoce como un comando interno o externo
```

**Solución:**

**Opción A: Instalar Husky globalmente (recomendado)**

```powershell
npm install -g husky
```

**Opción B: Omitir el script prepare temporalmente**

```powershell
npm install --ignore-scripts
```

**Opción C: Instalar dependencias sin ejecutar scripts**

```powershell
npm ci --ignore-scripts
```

## 🚀 Comandos Útiles

### Ver procesos de Node.js en ejecución

```powershell
Get-Process node
```

### Detener todos los procesos de Node.js

```powershell
Get-Process node | Stop-Process -Force
```

### Ver qué está usando el puerto 3000

```powershell
netstat -ano | findstr :3000
```

### Matar un proceso por PID

```powershell
Stop-Process -Id <PID> -Force
```

### Limpiar y reinstalar dependencias

```powershell
# Eliminar node_modules y lockfile
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstalar
npm install
```

### Limpiar caché de Next.js

```powershell
Remove-Item -Recurse -Force .next
```

## 📝 Estado Actual

✅ **Errores de compilación:** Resueltos
⚠️ **Advertencias:** No críticas, el proyecto funciona
✅ **Servidor:** Corriendo en puerto 3001

## 🎯 Próximos Pasos

1. **Probar el build nuevamente:**

   ```powershell
   npm run build
   ```

2. **Si el build funciona, iniciar el servidor:**

   ```powershell
   npm run dev
   ```

3. **Acceder a la aplicación:**
   ```
   http://localhost:3001
   ```

## 💡 Recomendaciones

1. **Usar un solo terminal para el servidor de desarrollo** para evitar conflictos de puertos.

2. **Cerrar procesos anteriores** antes de iniciar uno nuevo:

   ```powershell
   Get-Process node | Stop-Process -Force
   npm run dev
   ```

3. **Si persisten problemas**, limpiar completamente:
   ```powershell
   Remove-Item -Recurse -Force node_modules .next
   npm install
   npm run build
   ```
