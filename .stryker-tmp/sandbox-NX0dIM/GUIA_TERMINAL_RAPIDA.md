# 🚀 Guía Rápida: Terminal y Comandos

## ✅ Solución Permanente

### Opción 1: Desde VS Code (Recomendado)

1. Abre VS Code en la carpeta `paes-tutor` (la raíz del workspace)
2. Presiona `` Ctrl + ` `` para abrir la terminal integrada
3. La terminal automáticamente estará en `paes-tutor/paes-tutor/`
4. Ejecuta: `npm run dev`

### Opción 2: Script Rápido

```powershell
# Desde cualquier lugar, ejecuta:
.\paes-tutor\paes-tutor\iniciar-proyecto.ps1

# O si estás en la raíz del proyecto:
cd paes-tutor
.\iniciar-proyecto.ps1
```

### Opción 3: Comando Directo

```powershell
# Desde PowerShell, ejecuta:
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
npm run dev
```

### Opción 4: Función en PowerShell (Si configuraste el perfil)

```powershell
# Ejecuta en PowerShell:
paes
# O:
GoToPAESTutor

# Luego:
npm run dev
```

## 📋 Comandos Útiles

```powershell
# Cambiar al directorio del proyecto
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"

# Iniciar servidor de desarrollo
npm run dev

# Compilar el proyecto
npm run build

# Ejecutar tests
npm run test

# Verificar código
npm run lint
```

## ⚠️ Si la Terminal No Funciona

1. **Verifica que estés en el directorio correcto:**

   ```powershell
   pwd
   # Debe mostrar: C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor
   ```

2. **Verifica que package.json existe:**

   ```powershell
   Test-Path package.json
   # Debe mostrar: True
   ```

3. **Si no estás en el directorio correcto:**
   ```powershell
   cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
   ```

## 💡 Recomendación

**Usa VS Code y abre la terminal integrada** (`` Ctrl + ` ``). La configuración automática te llevará al directorio correcto.
