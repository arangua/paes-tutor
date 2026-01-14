# FIX CRÍTICO: Eliminación Completa de SQLite - Solo PostgreSQL

## 📋 Resumen

Se ha eliminado completamente el soporte de SQLite del proyecto. Ahora **SOLO se usa PostgreSQL (Neon)**.

## ✅ Archivos Modificados

### 1. `src/lib/prisma.ts`
- ❌ **Eliminado:** Import de `PrismaBetterSqlite3`
- ❌ **Eliminado:** Toda la lógica de manejo de SQLite (rutas, directorios, adapters)
- ✅ **Agregado:** Guard crítico que detecta SQLite y aborta con error claro
- ✅ **Agregado:** Validación de formato PostgreSQL
- ✅ **Agregado:** Logging redactado (oculta credenciales)

**Cambios clave:**
```typescript
// ANTES: Usaba PrismaBetterSqlite3 adapter
const adapter = new PrismaBetterSqlite3({ url: dbUrl })
const client = new PrismaClient({ adapter })

// AHORA: PrismaClient estándar para PostgreSQL
if (dbUrl.startsWith('file:')) {
  throw new Error('SQLite detectado. Solo PostgreSQL permitido.')
}
const client = new PrismaClient()
```

### 2. `scripts/start-dev.ps1`
- ✅ **Agregado:** Validación de DATABASE_URL antes de iniciar
- ✅ **Agregado:** Lectura de `.env.local` para cargar DATABASE_URL
- ✅ **Agregado:** Abortar con `exit 1` si detecta SQLite
- ✅ **Agregado:** Validación de formato PostgreSQL

**Comportamiento:**
- Si `DATABASE_URL` no existe → Aborta con error
- Si `DATABASE_URL` comienza con `file:` → Aborta con error
- Si `DATABASE_URL` no es PostgreSQL → Aborta con error
- Si es válida → Muestra URL redactada y continúa

### 3. `src/lib/startup/checks/checkDatabase.ts`
- ✅ **Agregado:** Guard que detecta SQLite ANTES de intentar conectar
- ✅ **Agregado:** Validación de formato PostgreSQL
- ✅ **Actualizado:** Comentario sobre SQLite removido

**Orden de validación:**
1. Verificar que `DATABASE_URL` existe
2. Verificar que NO es SQLite (`file:`)
3. Verificar que es PostgreSQL (`postgresql://` o `postgres://`)
4. Intentar conectar con timeout

### 4. `prisma/seed.ts`
- ❌ **Eliminado:** Import de `PrismaBetterSqlite3`
- ❌ **Eliminado:** Creación de adapter SQLite
- ❌ **Eliminado:** Fallback a `file:./prisma/dev.db`
- ✅ **Agregado:** Guard crítico de validación
- ✅ **Agregado:** Uso de `PrismaClient` estándar

### 5. `scripts/import-demre-exams.ts`
- ❌ **Eliminado:** Import de `PrismaBetterSqlite3`
- ❌ **Eliminado:** Creación de adapter SQLite
- ❌ **Eliminado:** Fallback a `file:./paes.db`
- ✅ **Agregado:** Guard crítico de validación
- ✅ **Agregado:** Uso de `PrismaClient` estándar

### 6. `scripts/import-sample-careers.ts`
- ❌ **Eliminado:** Import de `PrismaBetterSqlite3`
- ❌ **Eliminado:** Creación de adapter SQLite
- ❌ **Eliminado:** Fallback a `file:./paes.db`
- ✅ **Agregado:** Import de `dotenv/config`
- ✅ **Agregado:** Guard crítico de validación
- ✅ **Agregado:** Uso de `PrismaClient` estándar

### 7. `scripts/import-admission-calendar-2026.ts`
- ❌ **Eliminado:** Import de `PrismaBetterSqlite3`
- ❌ **Eliminado:** Creación de adapter SQLite
- ❌ **Eliminado:** Fallback a `file:./paes.db`
- ✅ **Agregado:** Import de `dotenv/config`
- ✅ **Agregado:** Guard crítico de validación
- ✅ **Agregado:** Uso de `PrismaClient` estándar

### 8. `scripts/clean-start.ps1`
- ❌ **Eliminado:** Fallback a `file:./paes.db`
- ❌ **Eliminado:** Lógica de creación de directorios para SQLite
- ✅ **Agregado:** Validación de PostgreSQL
- ✅ **Agregado:** Lectura de `.env.local` (prioridad sobre `.env`)
- ✅ **Agregado:** Advertencias si detecta SQLite

### 9. `next.config.ts`
- ❌ **Eliminado:** `@prisma/adapter-better-sqlite3` de `serverExternalPackages`
- ❌ **Eliminado:** `better-sqlite3` de `serverExternalPackages`

## 🔒 Guards Implementados

### Guard 1: `src/lib/prisma.ts` (Runtime)
- **Cuándo:** Al crear PrismaClient
- **Qué valida:** `DATABASE_URL` no es SQLite
- **Acción:** Lanza error y aborta

### Guard 2: `scripts/start-dev.ps1` (Pre-startup)
- **Cuándo:** Antes de ejecutar `npm run dev`
- **Qué valida:** `DATABASE_URL` es PostgreSQL válida
- **Acción:** `exit 1` con mensaje claro

### Guard 3: `src/lib/startup/checks/checkDatabase.ts` (Startup)
- **Cuándo:** Durante startup checks
- **Qué valida:** `DATABASE_URL` es PostgreSQL y está disponible
- **Acción:** Lanza `SystemError` y aborta startup

### Guard 4: Scripts de importación (Pre-execution)
- **Cuándo:** Al inicio de cada script
- **Qué valida:** `DATABASE_URL` es PostgreSQL
- **Acción:** Lanza error y aborta script

## 📝 Instrucciones de Verificación

### 1. Verificar que `.env.local` tiene DATABASE_URL de PostgreSQL

```powershell
# Verificar contenido (sin exponer credenciales)
Get-Content .env.local | Select-String "DATABASE_URL"
```

**Debe mostrar:**
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**NO debe mostrar:**
```
DATABASE_URL=file:./paes.db
```

### 2. Verificar que `.env` NO tiene DATABASE_URL de SQLite

```powershell
# Si existe .env, verificar que no tiene SQLite
if (Test-Path .env) {
    Get-Content .env | Select-String "DATABASE_URL"
}
```

**Si encuentra SQLite en `.env`:**
- Opción 1: Remover la línea `DATABASE_URL=file:...`
- Opción 2: Renombrar `.env` a `.env.sqlite.backup`

### 3. Ejecutar `npm run dev:safe` y verificar logs

```powershell
npm run dev:safe
```

**Debe mostrar:**
```
🔍 Validando configuración de base de datos...
✅ DATABASE_URL válida (PostgreSQL): postgresql://user:****@host/database...
🚀 Iniciando servidor de desarrollo...
[Prisma] Base de datos configurada (PostgreSQL): postgresql://user:****@host/database...
✓ Database check passed
```

**NO debe mostrar:**
- `DATABASE_URL: file:./paes.db`
- `@prisma/adapter-better-sqlite3`
- `better-sqlite3`
- Errores de SQLite

### 4. Verificar endpoints API

```powershell
# En otra terminal, probar endpoints
curl http://localhost:3000/api/flashcards
# Debe devolver 401 (no autenticado) o 200, pero NO 500 por DB

curl http://localhost:3000/api/challenges
# Debe devolver 401 o 200, pero NO 500 por DB

curl http://localhost:3000/api/review/quick
# Debe devolver 401 o 200, pero NO 500 por DB
```

### 5. Verificar que no hay referencias a SQLite en runtime

```powershell
# Buscar en logs de desarrollo
# No debe aparecer:
# - "better-sqlite3"
# - "@prisma/adapter-better-sqlite3"
# - "file:./paes.db"
# - "SQLite"
```

### 6. Verificar stack trace (si hay error)

Si hay un error de base de datos, el stack trace **NO debe incluir:**
- `@prisma/adapter-better-sqlite3`
- `better-sqlite3`
- Rutas a archivos `.db`

## 🚨 Comportamiento Esperado

### ✅ Comportamiento Correcto

1. **Al iniciar con PostgreSQL válida:**
   - Script valida DATABASE_URL
   - Muestra URL redactada
   - Inicia servidor
   - Startup checks pasan
   - Endpoints responden correctamente

2. **Al intentar usar SQLite:**
   - Script detecta SQLite
   - Muestra error claro
   - Aborta con `exit 1`
   - NO inicia servidor

3. **Si DATABASE_URL no existe:**
   - Script detecta ausencia
   - Muestra error claro
   - Aborta con `exit 1`
   - NO inicia servidor

### ❌ Comportamiento Incorrecto (Ya no debe ocurrir)

1. **Servidor iniciando con SQLite:**
   - ❌ Ya no es posible
   - Guards previenen esto

2. **Logs mostrando SQLite:**
   - ❌ Ya no debe aparecer
   - Código SQLite eliminado

3. **Errores de "Cannot open database because the directory does not exist":**
   - ❌ Ya no debe ocurrir
   - SQLite eliminado

## 📦 Dependencias (Opcional - No crítico)

Las siguientes dependencias aún están en `package.json` pero **NO se usan**:
- `@prisma/adapter-better-sqlite3`
- `better-sqlite3`
- `@types/better-sqlite3`

**Nota:** Pueden removerse opcionalmente con:
```powershell
npm uninstall @prisma/adapter-better-sqlite3 better-sqlite3 @types/better-sqlite3
```

Sin embargo, esto no es crítico ya que el código ya no las usa.

## ✅ Checklist de Verificación Final

- [ ] `.env.local` tiene `DATABASE_URL` de PostgreSQL
- [ ] `.env` NO tiene `DATABASE_URL` de SQLite (o está renombrado)
- [ ] `npm run dev:safe` muestra URL PostgreSQL redactada
- [ ] `npm run dev:safe` NO muestra SQLite en logs
- [ ] Startup checks pasan sin errores
- [ ] Endpoints `/api/flashcards`, `/api/challenges`, `/api/review/quick` responden (200/401, no 500)
- [ ] Stack traces NO incluyen `better-sqlite3` o `adapter-better-sqlite3`
- [ ] No hay errores de "Cannot open database because the directory does not exist"

## 🎯 Resultado Final

**ANTES:**
- Runtime podía usar SQLite
- Scripts tenían fallback a SQLite
- Errores confusos sobre directorios

**AHORA:**
- ✅ Solo PostgreSQL (Neon)
- ✅ Guards en múltiples capas
- ✅ Errores claros y tempranos
- ✅ Fail-fast si detecta SQLite
- ✅ Validación en pre-startup, startup y runtime
