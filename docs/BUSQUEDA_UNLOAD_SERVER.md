# 🔍 Búsqueda de "unload" y "platformicons" en .next\server

## 📋 Comando Ejecutado

```powershell
Get-ChildItem -Recurse .next\server\*.js |
  Select-String -Pattern "platformicons|addEventListener\(\"unload\"|\bunload\b" |
  Select-Object -First 30
```

## 🔎 Resultados de la Búsqueda

### **1. Estado del Directorio:**
- ✅ **Directorio existe:** `.next\server`
- 📦 **Total de archivos .js:** 734 archivos

### **2. Búsqueda de "platformicons":**
- ❌ **No se encontró** "platformicons" en ningún archivo del servidor
- 🔍 **Búsqueda realizada:** En todos los 734 archivos `.js`

### **3. Búsqueda de "unload":**
- ❌ **No se encontró** "unload" en ningún archivo del servidor
- ✅ **Se encontró** "beforeunload" (que es correcto, no deprecado)
- 📄 **Archivo encontrado:** `.next\server\chunks\ssr\src_app_exams_[id]_take_page_tsx_c3c63474._.js`
- 📝 **Contexto:** Código del componente de examen que usa `beforeunload` correctamente

### **4. Análisis del Resultado con "beforeunload":**

**Archivo:** `.next\server\chunks\ssr\src_app_exams_[id]_take_page_tsx_c3c63474._.js`

**Código encontrado:**
```javascript
window.addEventListener("beforeunload",a)
```

**Contexto:**
- Este es código del componente de examen (`/exams/[id]/take`)
- Usa `beforeunload` (correcto, no deprecado)
- NO es el código que genera el warning de `unload`

## 🎯 Conclusión

### **Resultados:**
1. ❌ **"platformicons"** - No encontrado en `.next\server`
2. ❌ **"unload"** - No encontrado en `.next\server`
3. ✅ **"beforeunload"** - Encontrado (código correcto, no genera warning)

### **Análisis:**

El warning de `unload` que menciona `platformicons` **NO aparece en:**
- ❌ `.next\static\chunks\` (chunks estáticos del cliente)
- ❌ `.next\server\` (código del servidor)

### **Posibles Razones:**

1. **Bundle dinámico del cliente:**
   - El bundle `vendors-node_modules_pnpm_platformicons_8_0_9_react_19_2_3_node_modules_platformicons_svg_HTM-d826f…` se genera dinámicamente
   - Solo aparece en tiempo de ejecución en el navegador
   - No está en los archivos estáticos compilados

2. **Carga diferida (lazy loading):**
   - `platformicons` puede ser cargado dinámicamente cuando se necesita
   - Se inyecta en el DOM en tiempo de ejecución
   - No aparece en los bundles estáticos

3. **Código de terceros en runtime:**
   - El código de `platformicons` puede estar en `node_modules` pero no se incluye en los bundles
   - Se carga directamente desde `node_modules` en desarrollo
   - Solo aparece cuando se ejecuta en el navegador

## 📝 Recomendación

### **Para encontrar el código exacto:**

1. **Buscar en `node_modules` directamente:**
   ```powershell
   Get-ChildItem -Recurse node_modules\platformicons\*.js | Select-String -Pattern "unload"
   ```

2. **Inspeccionar en DevTools (tiempo de ejecución):**
   - Abrir DevTools → Sources
   - Buscar el bundle mencionado en el warning
   - El bundle aparece solo cuando se ejecuta la aplicación

3. **Verificar dependencias transitivas:**
   ```bash
   npm ls --all | grep platformicons
   ```

## ✅ Confirmación

- ✅ **Nuestro código:** Usa `beforeunload` (correcto, no deprecado)
- ❌ **Código de `platformicons`:** No aparece en los bundles estáticos
- ⚠️ **Warning:** Aparece solo en tiempo de ejecución en el navegador

---

**Última actualización:** 2026-01-10  
**Estado:** Búsqueda completada, `platformicons` no encontrado en bundles estáticos
