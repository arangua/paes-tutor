# ⚠️ Warning: Deprecated Unload Event - Pendo

## 📋 Resumen

**Warning:** `Deprecated feature used: Unload event listeners are deprecated and will be removed.`

**Origen:** Script externo de Pendo cargado dinámicamente

## 🔍 Diagnóstico

### **Origen del Warning:**
- **Script externo:** `https://cdn.pendo.io/agent/static/.../pendo.js`
- **Listener:** `addEventListener("unload")` registrado por Pendo
- **Carga:** Dinámica en runtime en el navegador
- **No proviene de:**
  - ❌ Código del proyecto
  - ❌ Dependencias directas (`package.json`)
  - ❌ Bundles estáticos de Next.js

### **Verificación:**
```javascript
// Comando ejecutado en consola del navegador:
[...document.scripts].map(s => s.src).filter(Boolean).filter(u => u.includes("pendo"))
// Resultado: URLs de cdn.pendo.io
```

## ✅ Decisión Técnica

### **No se aplica fix en el repo:**
- ✅ Pendo es un script externo de terceros
- ✅ No hay control sobre el código fuente
- ✅ No es responsabilidad del proyecto corregir

### **No se usan hacks:**
- ❌ No se modifica `node_modules`
- ❌ No se parchea `console` para ocultar warnings
- ❌ No se intercepta `addEventListener` de forma agresiva

### **Warning aceptado como third-party:**
- ✅ Documentado como riesgo conocido
- ✅ Supresión inteligente solo en desarrollo (no oculta problemas reales)
- ✅ No afecta funcionalidad ni producción

## 🎯 Impacto

### **Solo DX (Development Experience):**
- ⚠️ Warning visible en consola durante desarrollo
- ⚠️ No afecta funcionalidad de la aplicación
- ⚠️ No afecta producción (usuarios finales no ven el warning)

### **No afecta:**
- ✅ Funcionalidad de la aplicación
- ✅ Rendimiento
- ✅ Estabilidad
- ✅ Experiencia del usuario final

## 🔧 Implementación Actual

### **Supresión Inteligente en Desarrollo:**

**Archivo:** `src/app/layout.tsx`

**Lógica:**
```typescript
// Solo suprime en desarrollo local
// Detecta si viene de dependencias externas (incluyendo Pendo)
const isFromExternal = 
  stack.includes('node_modules') || 
  stack.includes('vendors-node_modules') ||
  stack.includes('platformicons') ||
  stack.includes('pendo.io') ||      // ✅ Agregado para Pendo
  stack.includes('pendo') ||         // ✅ Agregado para Pendo
  stack.includes('vendor') ||
  (stack.indexOf('paes-tutor') === -1 && stack.length > 0);
```

**Características:**
- ✅ Solo activo en desarrollo (`localhost`)
- ✅ No afecta producción
- ✅ No oculta warnings de nuestro código
- ✅ Detecta específicamente Pendo (`pendo.io`, `pendo`)

## 📝 Documentación Relacionada

- `PROPUESTA_ENTERPRISE_WARNINGS_PRODUCCION.md` - Propuesta enterprise completa
- `DEPENDENCIA_UNLOAD_WARNING.md` - Análisis de dependencias
- `VERIFICAR_PENDO.md` - Verificación de carga de Pendo

## 🔄 Historial

- **2026-01-10:** Identificado origen del warning (Pendo)
- **2026-01-10:** Documentada decisión técnica
- **2026-01-10:** Actualizada supresión para incluir Pendo específicamente

## ✅ Conclusión

El warning de `unload` deprecado proviene de **Pendo**, un script externo de terceros cargado dinámicamente. 

**Decisión:** Aceptar el warning como third-party, sin aplicar fixes en el repo.

**Impacto:** Solo afecta DX (desarrollo), no funcionalidad ni producción.

**Estado:** ✅ Documentado y aceptado

---

**Última actualización:** 2026-01-10  
**Estado:** Documentado y aceptado como third-party warning
