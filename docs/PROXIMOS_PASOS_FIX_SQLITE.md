# Próximos Pasos - Verificación y Limpieza

## ✅ Estado Actual

- ✅ SQLite eliminado del código
- ✅ Guards implementados en 4 capas
- ✅ Todos los archivos modificados
- ✅ Documentación creada

## 🔍 Paso 1: Verificación Inmediata (CRÍTICO)

### 1.1 Verificar `.env.local`

```powershell
# Verificar que existe y tiene PostgreSQL
if (Test-Path .env.local) {
    Get-Content .env.local | Select-String "DATABASE_URL"
} else {
    Write-Host "❌ .env.local no existe. Debe crearlo con DATABASE_URL de PostgreSQL" -ForegroundColor Red
}
```

**Debe mostrar:**
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### 1.2 Verificar que `.env` NO tiene SQLite

```powershell
# Si existe .env, verificar que no tiene SQLite
if (Test-Path .env) {
    $envContent = Get-Content .env -Raw
    if ($envContent -match "DATABASE_URL\s*=\s*file:") {
        Write-Host "⚠️ ADVERTENCIA: .env contiene SQLite" -ForegroundColor Yellow
        Write-Host "   Opciones:" -ForegroundColor Yellow
        Write-Host "   1. Renombrar: Rename-Item .env .env.sqlite.backup" -ForegroundColor Cyan
        Write-Host "   2. Editar: Remover línea DATABASE_URL=file:..." -ForegroundColor Cyan
    }
}
```

### 1.3 Probar que los guards funcionan

```powershell
# Probar con SQLite (debe fallar)
$env:DATABASE_URL = "file:./paes.db"
npm run dev:safe
# Debe mostrar error y abortar con exit 1
```

Luego restaurar:
```powershell
# Restaurar desde .env.local
Remove-Item Env:\DATABASE_URL
npm run dev:safe
# Debe funcionar con PostgreSQL
```

## 🧪 Paso 2: Testing Funcional

### 2.1 Iniciar servidor

```powershell
npm run dev:safe
```

**Verificar en logs:**
- ✅ `DATABASE_URL válida (PostgreSQL): postgresql://...`
- ✅ `[Prisma] Base de datos configurada (PostgreSQL): ...`
- ✅ `✓ Database check passed`
- ❌ NO debe aparecer: `file:./paes.db`, `better-sqlite3`, `adapter-better-sqlite3`

### 2.2 Probar endpoints

En otra terminal:
```powershell
# Endpoint 1: Flashcards
curl http://localhost:3000/api/flashcards
# Esperado: 401 (no auth) o 200, NO 500

# Endpoint 2: Challenges
curl http://localhost:3000/api/challenges
# Esperado: 401 o 200, NO 500

# Endpoint 3: Review
curl http://localhost:3000/api/review/quick
# Esperado: 401 o 200, NO 500
```

### 2.3 Verificar stack traces

Si hay algún error, verificar que el stack trace **NO incluye:**
- `@prisma/adapter-better-sqlite3`
- `better-sqlite3`
- Rutas a archivos `.db`

## 🧹 Paso 3: Limpieza Opcional (No Crítico)

### 3.1 Remover dependencias SQLite de package.json

```powershell
npm uninstall @prisma/adapter-better-sqlite3 better-sqlite3 @types/better-sqlite3
```

**Nota:** Esto es opcional. El código ya no las usa, pero removerlas hace el proyecto más limpio.

### 3.2 Verificar que no hay archivos `.db` en el proyecto

```powershell
# Buscar archivos .db
Get-ChildItem -Recurse -Filter "*.db" | Where-Object { $_.FullName -notlike "*\.stryker-tmp\*" -and $_.FullName -notlike "*node_modules\*" }
```

Si encuentra archivos `.db`:
- Si son de SQLite antiguos, pueden eliminarse
- Si son necesarios, documentar por qué

## 📋 Paso 4: Checklist Final

Antes de considerar completado, verificar:

- [ ] `.env.local` existe y tiene `DATABASE_URL` de PostgreSQL
- [ ] `.env` NO tiene `DATABASE_URL` de SQLite (o está renombrado)
- [ ] `npm run dev:safe` inicia correctamente
- [ ] Logs muestran PostgreSQL, NO SQLite
- [ ] Startup checks pasan sin errores
- [ ] Endpoints API responden (200/401, no 500)
- [ ] Stack traces NO incluyen SQLite
- [ ] (Opcional) Dependencias SQLite removidas de package.json

## 🚀 Paso 5: Si Todo Funciona

### 5.1 Commit de cambios

```powershell
git add .
git commit -m "fix: Eliminar SQLite completamente, solo PostgreSQL (Neon)

- Eliminado PrismaBetterSqlite3 de todos los archivos
- Agregados guards en 4 capas (pre-startup, startup, runtime, scripts)
- Validación estricta de DATABASE_URL
- Fail-fast si detecta SQLite
- Actualizados: prisma.ts, start-dev.ps1, startup checks, seed, scripts de importación"
```

### 5.2 Verificar en CI/CD (si aplica)

Si tienes GitHub Actions o CI/CD:
- Verificar que las pruebas pasan
- Verificar que el build funciona
- Verificar que las variables de entorno están configuradas correctamente

## ⚠️ Problemas Comunes y Soluciones

### Problema 1: "DATABASE_URL no está configurada"

**Solución:**
```powershell
# Crear .env.local con:
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Problema 2: "SQLite detectado" pero no configuré SQLite

**Solución:**
- Verificar `.env` (puede tener SQLite)
- Verificar `.env.local` (debe tener PostgreSQL)
- En Windows, Next.js carga `.env` y `.env.local` - `.env.local` tiene prioridad, pero si `.env` tiene SQLite, puede causar confusión

**Fix:**
```powershell
# Renombrar .env si tiene SQLite
if (Test-Path .env) {
    $content = Get-Content .env -Raw
    if ($content -match "DATABASE_URL\s*=\s*file:") {
        Rename-Item .env .env.sqlite.backup
        Write-Host "✅ .env renombrado a .env.sqlite.backup" -ForegroundColor Green
    }
}
```

### Problema 3: Endpoints devuelven 500

**Solución:**
- Verificar que PostgreSQL está accesible
- Verificar que las migraciones están aplicadas: `npx prisma migrate deploy`
- Verificar logs del servidor para ver el error específico

## 📝 Notas Finales

- Los guards están en múltiples capas para máxima seguridad
- El proyecto ahora es **100% PostgreSQL**
- SQLite no puede usarse accidentalmente
- Todos los errores son claros y tempranos
