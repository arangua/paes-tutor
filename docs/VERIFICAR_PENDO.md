# 🔍 Verificación de Pendo en Tiempo de Ejecución

## 📋 Comando para Verificar Pendo

Ejecuta este comando en la **Consola del Navegador** (DevTools → Console):

```javascript
[...document.scripts].map(s => s.src).filter(Boolean).filter(u => u.includes("pendo"))
```

## 🔍 Qué Hace Este Comando

1. **`[...document.scripts]`** - Convierte la colección de scripts en un array
2. **`.map(s => s.src)`** - Extrae la URL (`src`) de cada script
3. **`.filter(Boolean)`** - Elimina valores vacíos/null/undefined
4. **`.filter(u => u.includes("pendo"))`** - Filtra solo URLs que contengan "pendo"

## 📊 Resultados Esperados

### **Si Pendo NO está cargado:**
```javascript
[]  // Array vacío
```

### **Si Pendo SÍ está cargado:**
```javascript
[
  "https://cdn.pendo.io/agent/static/xxxxx/pendo.js",
  // u otras URLs de Pendo
]
```

## 🔎 Verificaciones Adicionales

### **1. Verificar si el objeto `pendo` existe:**
```javascript
typeof window.pendo !== 'undefined'
// o
window.pendo
```

### **2. Verificar todos los scripts cargados:**
```javascript
[...document.scripts].map(s => s.src).filter(Boolean)
```

### **3. Buscar en todos los elementos script:**
```javascript
Array.from(document.querySelectorAll('script')).map(s => s.src || s.textContent).filter(Boolean).filter(u => u.includes("pendo"))
```

### **4. Verificar si Pendo está en el HTML:**
```javascript
document.documentElement.innerHTML.includes('pendo')
```

## 🎯 Posibles Lugares donde Pendo Puede Estar

### **1. Carga Dinámica desde Extensiones del Navegador:**
- Extensiones como "Pendo Agent" pueden inyectar scripts
- Verificar en DevTools → Sources → Content scripts

### **2. Carga desde un CDN o Tercero:**
- Algún servicio externo puede estar cargando Pendo
- Verificar en Network tab si hay requests a `pendo.io`

### **4. Carga Condicional:**
- Puede estar cargado solo en producción
- Verificar variables de entorno o condiciones

### **5. Carga desde un Tag Manager:**
- Google Tag Manager, Segment, etc.
- Verificar si hay algún tag manager configurado

## 📝 Instrucciones para Verificar

### **Paso 1: Abrir DevTools**
1. Presiona `F12` o `Ctrl+Shift+I`
2. Ve a la pestaña **Console**

### **Paso 2: Ejecutar el Comando**
```javascript
[...document.scripts].map(s => s.src).filter(Boolean).filter(u => u.includes("pendo"))
```

### **Paso 3: Verificar Network Tab**
1. Ve a la pestaña **Network**
2. Filtra por "pendo"
3. Recarga la página (`Ctrl+R`)
4. Busca requests a `pendo.io` o dominios relacionados

### **Paso 4: Verificar Sources**
1. Ve a la pestaña **Sources**
2. Busca en "Content scripts" (si hay extensiones)
3. Busca archivos que contengan "pendo"

## ✅ Conclusión

Si el comando retorna un array vacío `[]`, entonces:
- ❌ **Pendo NO está siendo cargado** desde scripts en el DOM
- ✅ **No hay referencias a Pendo** en el código fuente del proyecto

Si el comando retorna URLs con "pendo":
- ✅ **Pendo SÍ está siendo cargado** (probablemente desde una extensión o servicio externo)
- 📝 **Documentar** dónde se está cargando para futuras referencias

---

**Última actualización:** 2026-01-10
