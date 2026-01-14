# 🔌 Guía de Trabajo OFFLINE (Sin Conexión a Cursor)

## 🎯 Objetivo

Trabajar **completamente independiente** de la conexión a Cursor, usando terminal externo y scripts locales.

## ✅ Solución Inmediata

### **1. Usar Terminal Externo (PowerShell)**

**Abre PowerShell fuera de Cursor:**
1. Presiona `Win + X`
2. Selecciona "Windows PowerShell" o "Terminal"
3. Navega al proyecto:
   ```powershell
   cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
   ```

### **2. Scripts Disponibles (Sin Conexión)**

**Todos estos scripts funcionan sin Cursor:**

```powershell
# Tests
npm run test:run

# Linter
npm run lint

# Guardias
npm run guard:no-global-patches

# Validaciones
npm run validate:all

# Build
npm run build
```

### **3. Script Resiliente Mejorado**

**Usa el script creado:**
```powershell
.\scripts\work-resilient.ps1 -Command test
.\scripts\work-resilient.ps1 -Command lint
.\scripts\work-resilient.ps1 -Command guard
```

## 📋 Flujo de Trabajo OFFLINE

### **Paso 1: Preparar Entorno**

1. Abre PowerShell externo
2. Navega al proyecto
3. Verifica que estás en el directorio correcto:
   ```powershell
   pwd
   # Debe mostrar: ...\paes-tutor\paes-tutor
   ```

### **Paso 2: Ejecutar Comandos**

**Todos los comandos funcionan sin Cursor:**
```powershell
# Verificar estado
git status

# Ejecutar tests
npm run test:run

# Ejecutar linter
npm run lint

# Verificar guardias
npm run guard:no-global-patches
```

### **Paso 3: Trabajar en Código**

1. **Edita archivos en Cursor** (aunque se desconecte, los cambios se guardan)
2. **Verifica cambios en terminal externo:**
   ```powershell
   git diff
   ```

3. **Ejecuta validaciones:**
   ```powershell
   npm run validate:all
   ```

### **Paso 4: Commits Frecuentes**

**Después de cada cambio:**
```powershell
git add .
git commit -m "feat: descripción del cambio"
```

**Ventaja:** Si Cursor se desconecta, no pierdes trabajo.

## 🚀 Comandos Rápidos (Copia y Pega)

### **Verificar Estado del Proyecto:**
```powershell
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
git status
npm run validate:all
```

### **Ejecutar Tests:**
```powershell
npm run test:run
```

### **Ejecutar Linter:**
```powershell
npm run lint
```

### **Verificar Guardias:**
```powershell
npm run guard:no-global-patches
```

### **Build Completo:**
```powershell
npm run build
```

## 💡 Estrategia de Trabajo

### **1. Dividir en Micro-Pasos**

**Cada paso debe ser:**
- ✅ Completable en < 5 minutos
- ✅ Verificable con un comando
- ✅ Commiteable independientemente

### **2. Verificar Después de Cada Paso**

**Antes de continuar:**
```powershell
# Verificar que no hay errores
npm run validate:all

# Si todo está bien, commit
git add .
git commit -m "feat: paso X completado"
```

### **3. Documentar Progreso**

**Crea archivo:** `ESTADO_ACTUAL.md`
```markdown
## Progreso Actual

✅ Completado:
- Paso 1: ...
- Paso 2: ...

⏳ En progreso:
- Paso 3: ...

📋 Pendiente:
- Paso 4: ...
```

## 🔧 Configuración Adicional

### **Variables de Entorno (PowerShell):**

```powershell
# Configurar para reducir carga
$env:NODE_ENV = "test"
$env:VITEST_MAX_WORKERS = "2"
```

### **Alias Útiles (PowerShell):**

```powershell
# Agregar a tu perfil de PowerShell
function Test-Project {
    npm run validate:all
}

function Commit-Work {
    param([string]$Message)
    git add .
    git commit -m $Message
}
```

## ✅ Checklist de Trabajo OFFLINE

Antes de empezar:

- [ ] ¿Tengo PowerShell externo abierto?
- [ ] ¿Estoy en el directorio correcto?
- [ ] ¿Tengo los scripts listos?
- [ ] ¿Puedo ejecutar comandos sin Cursor?
- [ ] ¿Tengo git configurado para commits?

## 🎯 Resultado Esperado

- ✅ **Trabajo independiente** - No necesitas Cursor conectado
- ✅ **Cero pérdida de trabajo** - Commits frecuentes
- ✅ **Verificación continua** - Scripts funcionan sin conexión
- ✅ **Productividad sin interrupciones**

## 📝 Notas Importantes

1. **Cursor puede desconectarse** - No importa, trabajas en terminal externo
2. **Los cambios se guardan** - Aunque Cursor se desconecte, los archivos están guardados
3. **Git es tu amigo** - Commits frecuentes = cero pérdida de trabajo
4. **Scripts funcionan siempre** - No dependen de conexión a Cursor

---

**Última actualización:** 2026-01-10  
**Estado:** Listo para trabajo completamente offline
