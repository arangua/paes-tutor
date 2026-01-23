# 🔍 Búsqueda de "unload" en Chunks de Next.js

## 📋 Comando Ejecutado

```powershell
Get-ChildItem -Recurse .next\static\chunks\*.js |
  Select-String -Pattern "platformicons|addEventListener\(\"unload\"|\bunload\b" |
  Select-Object -First 20
```

## 🔎 Resultados de la Búsqueda

### **1. Búsqueda de "platformicons" en chunks:**
- ❌ **No se encontraron archivos** con "platformicons" en el contenido
- ❌ **No se encontraron archivos** con "platformicons" en el nombre
- ❌ **No se encontraron archivos** con "d826f" (hash del bundle) en el nombre

### **2. Búsqueda de "unload" en chunks:**
- ✅ **Se encontró 1 resultado** con "unload" en el contenido
- 📄 **Archivo:** `.next\static\chunks\018f6eae4d3b513b.js`
- 📝 **Contexto:** Código minificado relacionado con compresión (gzip/zlib)
- ⚠️ **Nota:** El código encontrado parece ser de una librería de compresión, no de `platformicons`

### **3. Búsqueda de chunks "vendor":**
- ❌ **No se encontraron chunks** con "vendor" o "vendors" en el nombre
- 📊 **Total de chunks:** 82 archivos `.js`
- 📦 **Chunks vendor:** 0 archivos

## 🎯 Análisis

### **¿Por qué no se encuentra "platformicons" en los chunks?**

**Posibles razones:**

1. **Bundle dinámico:**
   - El bundle `vendors-node_modules_pnpm_platformicons_8_0_9_react_19_2_3_node_modules_platformicons_svg_HTM-d826f…` puede ser generado dinámicamente
   - El nombre del bundle puede cambiar en cada build
   - El hash `d826f…` es único por build

2. **Carga diferida (lazy loading):**
   - `platformicons` puede ser cargado dinámicamente cuando se necesita
   - No aparece en los chunks estáticos iniciales
   - Se carga en runtime cuando se requiere

3. **Bundle en otro directorio:**
   - Puede estar en `.next/server/` en lugar de `.next/static/chunks/`
   - Puede estar en `.next/static/chunks/app/` o subdirectorios específicos

4. **Código minificado:**
   - El código puede estar tan minificado que "platformicons" no es legible
   - Los nombres pueden estar ofuscados o hasheados

### **¿Dónde buscar el código de "unload"?**

**Opciones:**

1. **En el navegador (DevTools):**
   - El warning aparece en tiempo de ejecución
   - El stack trace muestra el bundle exacto
   - Inspeccionar el bundle en DevTools → Sources

2. **En `node_modules`:**
   ```bash
   Get-ChildItem -Recurse node_modules\platformicons\*.js | Select-String -Pattern "unload"
   ```

3. **En el bundle del servidor:**
   ```bash
   Get-ChildItem -Recurse .next\server\*.js | Select-String -Pattern "unload"
   ```

4. **En el código fuente de la dependencia:**
   - Buscar en `node_modules/platformicons/` directamente
   - Revisar el código fuente del paquete

## 📝 Conclusión

### **Resultado de la búsqueda:**
- ❌ No se encontró "platformicons" en los chunks estáticos
- ✅ Se encontró "unload" en 1 archivo (código de compresión, no relacionado)
- ❌ No se encontraron chunks vendor con el nombre esperado

### **Recomendación:**
1. **Buscar en `node_modules` directamente:**
   ```powershell
   Get-ChildItem -Recurse node_modules\platformicons\*.js | Select-String -Pattern "unload"
   ```

2. **Inspeccionar en DevTools:**
   - Abrir DevTools → Sources
   - Buscar el bundle mencionado en el warning
   - Inspeccionar el código fuente del bundle

3. **Verificar dependencias transitivas:**
   ```bash
   npm ls --all | grep platformicons
   ```

---

**Última actualización:** 2026-01-10  
**Estado:** Búsqueda completada, resultados documentados
