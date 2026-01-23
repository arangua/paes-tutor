# 🏢 Guía Enterprise: Trabajar sin Desconexiones

## 🎯 Estrategia Principal

**Trabajar en modo "offline-first"** - Minimizar dependencia de conexión constante a Cursor.

## ✅ Soluciones Implementadas

### **1. Script de Trabajo Resiliente**

**Archivo:** `scripts/work-resilient.ps1`

**Uso:**
```powershell
# Tests
.\scripts\work-resilient.ps1 -Command test

# Linter
.\scripts\work-resilient.ps1 -Command lint

# Guardias
.\scripts\work-resilient.ps1 -Command guard

# Validaciones
.\scripts\work-resilient.ps1 -Command validate
```

### **2. Configuración Ultra-Conservadora**

**Archivo:** `.vscode/settings.json`

**Valores optimizados:**
- `requestTimeout`: 180s (3 minutos)
- `connectionRetryDelay`: 120s (2 minutos)
- `maxConnectionRetries`: 3
- `offlineMode`: true
- Todas las características que requieren conexión: **deshabilitadas**

### **3. Estrategia de Micro-Pasos**

**Principio:** Dividir cada tarea en pasos atómicos que se completen en < 2 minutos.

**Ejemplo:**
```
❌ "Implementa sistema completo de formularios"
✅ Paso 1: "Crea FieldInput.tsx"
✅ Paso 2: "Agrega test básico"
✅ Paso 3: "Crea FieldTextarea.tsx"
✅ Paso 4: "Agrega exports en index.ts"
```

## 📋 Procedimiento de Trabajo

### **Paso 1: Planificar**

Antes de pedir ayuda:
1. Divide la tarea en pasos de < 2 minutos
2. Identifica dependencias
3. Prepara mensajes claros para cada paso

### **Paso 2: Ejecutar un Paso**

1. Pide ayuda para **un solo paso**
2. Espera respuesta
3. Si hay desconexión, el paso está documentado

### **Paso 3: Verificar y Commit**

1. Verifica que el paso funciona
2. Commit inmediato
3. Continúa al siguiente paso

### **Paso 4: Si hay Desconexión**

1. **No pierdes trabajo** - Commits guardados
2. **Continúa desde último checkpoint**
3. **Usa terminal externo** si es necesario

## 🚀 Comandos Rápidos

### **Ejecutar Tests (Sin Conexión Constante):**
```powershell
.\scripts\work-resilient.ps1 -Command test
```

### **Ejecutar Linter:**
```powershell
.\scripts\work-resilient.ps1 -Command lint
```

### **Verificar Guardias:**
```powershell
.\scripts\work-resilient.ps1 -Command guard
```

### **Validaciones Completas:**
```powershell
.\scripts\work-resilient.ps1 -Command validate
```

## 💡 Mejores Prácticas

### **1. Mensajes Cortos y Específicos**

**❌ MAL:**
```
"Implementa toda la funcionalidad X con tests, documentación y optimizaciones"
```

**✅ BIEN:**
```
"Paso 1: Crea componente FieldInput con name obligatorio"
```

### **2. Un Paso a la Vez**

**No pidas múltiples cosas en un mensaje:**
- Un paso = Un mensaje
- Verifica antes de continuar
- Commit después de cada paso

### **3. Usar Terminal Externo para Comandos Largos**

**Para operaciones que toman > 30 segundos:**
1. Abre PowerShell fuera de Cursor
2. Ejecuta comandos directamente
3. No depende de conexión de Cursor

### **4. Documentar Progreso**

**Crea archivo temporal:** `ESTADO_ACTUAL.md`
```markdown
## Progreso Actual

✅ Completado:
- FieldInput.tsx creado
- Test básico agregado

⏳ En progreso:
- FieldTextarea.tsx

📋 Pendiente:
- FieldSelect.tsx
- Documentación
```

## 🔧 Configuración Adicional

### **Variables de Entorno (PowerShell):**

```powershell
# Antes de ejecutar comandos largos:
$env:CURSOR_TERMINAL_ANALYSIS = "false"
$env:CURSOR_AUTO_SUGGEST = "false"
$env:VITEST_MAX_WORKERS = "2"
```

### **Git Aliases Útiles:**

```bash
# Commit rápido
git config --global alias.cm "commit -m"

# Status + diff
git config --global alias.sd "!git status && git diff"
```

## ✅ Checklist Antes de Iniciar Tarea

- [ ] ¿Está dividida en pasos < 2 minutos?
- [ ] ¿Tengo scripts resilientes listos?
- [ ] ¿Puedo ejecutar en terminal externo?
- [ ] ¿Está el código en estado commiteable?
- [ ] ¿Tengo documentación actualizada?

## 🎯 Resultado Esperado

- ✅ **Cero pérdida de trabajo** - Commits frecuentes
- ✅ **Continuidad garantizada** - Puedes continuar después de desconexión
- ✅ **Eficiencia máxima** - No esperas reconexión
- ✅ **Productividad sin interrupciones**

---

**Última actualización:** 2026-01-10  
**Estado:** Listo para usar
