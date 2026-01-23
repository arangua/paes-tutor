# 🔍 Problema con Prettier y PowerShell

## 📊 Situación

Al intentar ejecutar `npx prettier . --write`, Prettier intenta escanear directorios del sistema que requieren permisos elevados, causando errores:

```
[error] EPERM: operation not permitted, scandir 'C:\Users\arang\AppData\Local\ElevatedDiagnostics'
```

## 🔴 Causa

1. **Glob patterns en PowerShell**: Los patrones `**/*.ts` no funcionan igual que en bash
2. **Directorio actual**: Prettier intenta escanear desde el directorio raíz del usuario
3. **Permisos**: Algunos directorios del sistema requieren permisos elevados

## ✅ Soluciones

### Opción 1: Usar el script PowerShell (Recomendado)

```powershell
.\format-all.ps1
```

Este script:
- ✅ Solo escanea directorios del proyecto (`src`, `scripts`, `e2e`)
- ✅ Evita directorios del sistema
- ✅ Respeta `.prettierignore`
- ✅ Muestra progreso

### Opción 2: Formatear directorios específicos

```powershell
# Solo src
npx prettier --write "src/**/*.{ts,tsx}" --ignore-path .prettierignore

# Solo scripts
npx prettier --write "scripts/**/*.{ts,tsx}" --ignore-path .prettierignore
```

### Opción 3: Formatear archivos individuales

```powershell
npx prettier --write src/app/dashboard/page.tsx
npx prettier --write src/components/ErrorBoundary.tsx
```

### Opción 4: Usar el script de package.json (con ajuste)

El script `npm run format` necesita ajustarse para Windows. Por ahora, usar el script PowerShell es más confiable.

## 🎯 Recomendación

**Usar `format-all.ps1`** - Es la solución más confiable para Windows/PowerShell.

---

**Fecha:** 2025-01-28  
**Estado:** ✅ **Script PowerShell creado como solución**

