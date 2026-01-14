# 🔧 Solución Enterprise para Limpieza y Reinicio

## 📋 Resumen

Solución robusta y definitiva de nivel enterprise para resolver problemas de:
- Procesos de Node.js bloqueados
- Archivos de lock de Next.js
- Configuración de base de datos
- Puertos ocupados

## 🚀 Uso Rápido

### Inicio Seguro del Servidor
```powershell
npm run dev:safe
```

### Limpieza Manual
```powershell
npm run clean
```

### Limpieza Completa (incluye caché)
```powershell
npm run clean:force
```

### Limpieza + Inicio
```powershell
npm run dev:clean
```

## 📁 Scripts Disponibles

### 1. `scripts/clean-start.ps1`
Script principal de limpieza enterprise que:
- ✅ Termina todos los procesos de Node.js
- ✅ Libera puertos 3000 y 3001
- ✅ Elimina archivos de lock de Next.js
- ✅ Verifica y crea directorio de base de datos
- ✅ Verifica permisos de escritura
- ✅ Opcionalmente limpia caché de Next.js

**Parámetros:**
- `-Force`: Limpia también el caché de Next.js
- `-SkipDatabase`: Omite la verificación de base de datos

**Ejemplo:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/clean-start.ps1
powershell -ExecutionPolicy Bypass -File scripts/clean-start.ps1 -Force
```

### 2. `scripts/start-dev.ps1`
Script de inicio seguro que:
- ✅ Ejecuta limpieza automática antes de iniciar
- ✅ Verifica que no hay procesos bloqueando
- ✅ Inicia el servidor de desarrollo

**Uso:**
```powershell
npm run dev:safe
```

## 🔍 Solución de Problemas

### Problema: "Port 3000 is in use"
**Solución:**
```powershell
npm run clean
npm run dev
```

### Problema: "Unable to acquire lock"
**Solución:**
```powershell
npm run clean:force
npm run dev
```

### Problema: "Cannot open database because the directory does not exist"
**Solución:**
El script `clean-start.ps1` verifica y crea automáticamente el directorio. Si persiste:
```powershell
npm run clean
# Verifica que DATABASE_URL en .env apunta a la ruta correcta
npm run dev
```

### Problema: Múltiples instancias ejecutándose
**Solución:**
```powershell
# El script termina automáticamente todos los procesos
npm run clean
npm run dev
```

## 🛠️ Mejoras Implementadas

### 1. Manejo de Rutas con Espacios
El código de Prisma ahora maneja correctamente rutas con espacios en Windows usando el formato `file:///` cuando es necesario.

### 2. Creación Automática de Directorios
El código verifica y crea automáticamente el directorio de la base de datos antes de intentar conectarse.

### 3. Logging Detallado
Los scripts proporcionan logging detallado para facilitar la depuración.

### 4. Verificación de Permisos
Los scripts verifican permisos de escritura antes de iniciar el servidor.

## 📝 Comandos NPM Agregados

```json
{
  "dev:safe": "Inicio seguro con limpieza automática",
  "dev:clean": "Limpieza + inicio del servidor",
  "clean": "Limpieza básica",
  "clean:force": "Limpieza completa (incluye caché)"
}
```

## ✅ Checklist de Verificación

Antes de reportar problemas, verifica:

- [ ] ¿Ejecutaste `npm run clean`?
- [ ] ¿Verificaste que no hay procesos de Node.js ejecutándose?
- [ ] ¿El directorio de la base de datos existe?
- [ ] ¿Tienes permisos de escritura en el directorio?
- [ ] ¿La variable `DATABASE_URL` en `.env` es correcta?

## 🎯 Mejores Prácticas

1. **Siempre usa `npm run dev:safe`** para iniciar el servidor
2. **Si hay problemas**, ejecuta `npm run clean:force` primero
3. **Revisa los logs** del script para identificar problemas específicos
4. **No ejecutes múltiples instancias** del servidor simultáneamente

## 🔐 Seguridad

Los scripts usan `-ExecutionPolicy Bypass` solo para los scripts específicos del proyecto. Esto es seguro porque:
- Los scripts están en el repositorio
- Solo se ejecutan scripts locales
- No se modifica la política de ejecución del sistema

## 📚 Referencias

- [Next.js - Troubleshooting](https://nextjs.org/docs/app/api-reference/cli#troubleshooting)
- [Prisma - SQLite Setup](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [PowerShell - Execution Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)

---

**Fecha de creación:** 2025-01-28  
**Versión:** 1.0.0  
**Estado:** ✅ Producción
