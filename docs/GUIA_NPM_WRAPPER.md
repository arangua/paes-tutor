# 🛡️ Guía: Scripts Wrapper para npm

## 🎯 Problema Resuelto

Los scripts wrapper resuelven el error **"npm no encuentra package.json"** incluso cuando ejecutas comandos npm desde cualquier directorio.

## 🚀 Configuración Rápida (Recomendado)

### Paso 1: Configurar Alias Automático

```powershell
# Ejecutar una sola vez
.\scripts\Setup-NpmAlias.ps1
```

### Paso 2: Recargar el Perfil

```powershell
. $PROFILE
```

O simplemente cierra y vuelve a abrir PowerShell.

### Paso 3: ¡Listo!

Ahora puedes usar `npm` normalmente desde cualquier directorio:

```powershell
# Desde cualquier lugar
cd C:\Users\arang\
npm run dev          # ✅ Funciona automáticamente
npm install          # ✅ Funciona automáticamente
npm test             # ✅ Funciona automáticamente
```

## 📋 Opciones de Uso

### Opción 1: Alias Automático (Recomendado)

**Ventajas:**
- ✅ Usas `npm` normalmente, sin cambios
- ✅ Funciona desde cualquier directorio
- ✅ Transparente - no necesitas recordar nada especial

**Configuración:**
```powershell
.\scripts\Setup-NpmAlias.ps1
. $PROFILE
```

**Uso:**
```powershell
npm run dev
npm install
npm test
```

### Opción 2: Wrapper de PowerShell

**Ventajas:**
- ✅ No modifica tu perfil de PowerShell
- ✅ Puedes usarlo cuando quieras
- ✅ Funciona desde cualquier directorio

**Uso:**
```powershell
.\scripts\npm-wrapper.ps1 run dev
.\scripts\npm-wrapper.ps1 install
.\scripts\npm-wrapper.ps1 test
```

### Opción 3: Wrapper de Node.js

**Ventajas:**
- ✅ Funciona en cualquier sistema operativo
- ✅ No requiere PowerShell
- ✅ Puedes usarlo desde scripts

**Uso:**
```bash
node scripts/npm-wrapper.js run dev
node scripts/npm-wrapper.js install
node scripts/npm-wrapper.js test
```

## 🔧 Cómo Funciona

Los wrappers:

1. **Buscan automáticamente** el directorio del proyecto (donde está `package.json`)
2. **Cambian al directorio correcto** antes de ejecutar npm
3. **Ejecutan el comando npm** con los argumentos proporcionados
4. **Funcionan desde cualquier ubicación** - no importa desde dónde los ejecutes

## 📝 Ejemplos de Uso

### Desarrollo

```powershell
# Desde cualquier directorio
npm run dev
```

### Instalación de Dependencias

```powershell
# Desde cualquier directorio
npm install
npm install express
```

### Tests

```powershell
# Desde cualquier directorio
npm test
npm run test:coverage
npm run test:e2e
```

### Build

```powershell
# Desde cualquier directorio
npm run build
npm run start
```

## ⚙️ Desinstalar el Alias

Si quieres remover el alias del perfil:

```powershell
# Abrir el perfil
notepad $PROFILE

# Buscar y eliminar la sección que dice:
# "npm wrapper - Verifica directorio automáticamente"

# Guardar y recargar
. $PROFILE
```

## 🐛 Solución de Problemas

### El alias no funciona

1. **Verifica que el perfil se cargó:**
   ```powershell
   . $PROFILE
   ```

2. **Verifica que la función existe:**
   ```powershell
   Get-Command npm
   ```

3. **Verifica que el wrapper existe:**
   ```powershell
   Test-Path scripts\npm-wrapper.ps1
   ```

### El wrapper no encuentra package.json

1. **Verifica que estás en el proyecto correcto:**
   ```powershell
   Get-Location
   ```

2. **Verifica que package.json existe:**
   ```powershell
   Test-Path package.json
   ```

3. **Usa el wrapper directamente:**
   ```powershell
   .\scripts\npm-wrapper.ps1 run dev
   ```

## ✅ Beneficios

- ✅ **Nunca más errores de directorio**: Los wrappers siempre encuentran el proyecto
- ✅ **Flexibilidad**: Puedes ejecutar npm desde cualquier lugar
- ✅ **Transparente**: Con el alias, usas npm normalmente
- ✅ **Robusto**: Múltiples niveles de fallback

## 💡 Recomendación

**Usa el alias automático** (`Setup-NpmAlias.ps1`) para la mejor experiencia. Una vez configurado, no necesitas pensar en el directorio nunca más.

