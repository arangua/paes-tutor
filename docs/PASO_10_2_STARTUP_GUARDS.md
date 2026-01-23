# PASO 10.2 — Startup Guards

## 🎯 Objetivo

Detectar fallas operativas reales antes de servir la primera request.

**Regla Enterprise:**
> Validar configuración no basta; hay que validar capacidad de operar.

## ✅ Resultado Esperado

Al cerrar 10.2, se tienen:

- ✅ Verificaciones críticas ejecutadas en startup
- ✅ Fail-fast si:
  - Servicios no disponibles
  - Timeouts mal configurados
  - Dependencias inconsistentes
- ✅ Errores tipados (SystemError)
- ✅ Guards aislados, testeables y rápidos
- ✅ Base lista para guard CI "Prod-Ready" (10.4)

## 📐 Alcance (Congelable)

### ✅ Incluye

- Conectividad a servicios críticos (DB, Redis si está habilitado)
- Validación de timeouts y límites
- Chequeos de coherencia runtime (flags vs servicios)

### ❌ Excluye

- Migraciones
- Warm-ups pesados
- Performance tuning

## 🧩 Arquitectura

```
src/lib/startup/
  ├─ startup-checks.ts    ← orquestador
  ├─ bootstrap.ts         ← ejecución automática
  ├─ checks/
  │   ├─ checkDatabase.ts
  │   ├─ checkRedis.ts
  │   └─ checkTimeouts.ts
  └─ startup.test.ts
```

### 📌 Reglas

1. **Ningún check tiene side effects**
2. **Si falla → aborta startup**
3. **Ejecución única** (flag de control)
4. **Solo en servidor** (skip en Edge Runtime y cliente)

## 🔍 Checks Implementados

### 1. Check de Base de Datos

**Archivo:** `src/lib/startup/checks/checkDatabase.ts`

**Qué valida:**
- Conectividad a la base de datos
- Query simple (`SELECT 1`)
- Timeout: 5 segundos

**Comportamiento:**
- ✅ Si pasa: continúa
- ❌ Si falla: lanza `SystemError` con código `DATABASE_STARTUP_FAILURE`

**Ejemplo de error:**
```typescript
SystemError: Database not reachable at startup
  code: 'DATABASE_STARTUP_FAILURE'
  context: { timeout: 5000, timestamp: '...' }
```

### 2. Check de Redis (Condicional)

**Archivo:** `src/lib/startup/checks/checkRedis.ts`

**Qué valida:**
- Solo si Redis está configurado (`UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`)
- Ping a Redis
- Timeout: 3 segundos

**Comportamiento:**
- ✅ Si Redis no está configurado: skip (continúa)
- ✅ Si pasa: continúa
- ❌ Si falla: lanza `SystemError` con código `REDIS_STARTUP_FAILURE`

**Ejemplo de error:**
```typescript
SystemError: Redis enabled but not reachable at startup
  code: 'REDIS_STARTUP_FAILURE'
  context: { timeout: 3000, hasUrl: true, hasToken: true, timestamp: '...' }
```

### 3. Check de Timeouts

**Archivo:** `src/lib/startup/checks/checkTimeouts.ts`

**Qué valida:**
- Timeouts mínimos (>= 1000ms)
- Coherencia entre timeouts (RESTORE >= UPDATE, DELETE)
- Timeouts de rate limiting (> 0)

**Comportamiento:**
- ✅ Si pasa: continúa
- ❌ Si falla: lanza `SystemError` con código `INVALID_TIMEOUT_CONFIG`

**Ejemplo de error:**
```typescript
SystemError: Invalid timeout configuration: TRANSACTION_TIMEOUTS.QUERY (500ms) es menor al mínimo requerido (1000ms)
  code: 'INVALID_TIMEOUT_CONFIG'
  context: { errors: [...], minTimeout: 1000, timestamp: '...' }
```

## 🔄 Orquestador

**Archivo:** `src/lib/startup/startup-checks.ts`

**Función:** `runStartupChecks()`

**Orden de ejecución:**
1. `checkTimeouts()` (síncrono, rápido)
2. `checkDatabase()` (asíncrono)
3. `checkRedis()` (asíncrono, condicional)

**Regla:**
- Si cualquier check falla, se aborta el startup
- Logs estructurados en cada paso
- Error tipado (SystemError)

## 🚀 Integración

**Archivo:** `src/lib/startup/bootstrap.ts`

**Cómo funciona:**
- Se ejecuta automáticamente al importar el módulo
- Flag `checksExecuted` evita ejecución múltiple
- Skip en Edge Runtime y cliente
- En producción, aborta el proceso (`process.exit(1)`) si falla

**Integración en layout:**
```typescript
// src/app/layout.tsx
import '@/lib/startup/bootstrap' // Se ejecuta automáticamente
```

**Nota:** El layout es un Server Component, por lo que el bootstrap solo se ejecuta en el servidor.

## 🧪 Tests

**Archivo:** `src/lib/startup/startup.test.ts`

**Cobertura:**
- ✅ Ejecución de todos los checks en orden
- ✅ Fail-fast si `checkTimeouts` falla
- ✅ Fail-fast si `checkDatabase` falla
- ✅ Fail-fast si `checkRedis` falla
- ✅ Verificación de que los módulos existen

**Ejecutar tests:**
```bash
npm test src/lib/startup/startup.test.ts
```

## 📋 Cuándo se Ejecuta

### ✅ Se ejecuta:

- Al iniciar el servidor (una vez)
- En Node.js runtime (no en Edge Runtime)
- Solo en servidor (no en cliente)

### ❌ No se ejecuta:

- Por cada request
- En Edge Runtime
- En el cliente (browser)
- En tests (a menos que se importe explícitamente)

## 🔧 Cómo Extender

### Agregar un nuevo check

1. **Crear el check:**
```typescript
// src/lib/startup/checks/checkNuevoServicio.ts
import { SystemError } from '@/lib/errors/error-types'

export async function checkNuevoServicio(): Promise<void> {
  try {
    // Validación
  } catch (error) {
    throw new SystemError(
      'Nuevo servicio no disponible',
      error instanceof Error ? error : undefined,
      'NUEVO_SERVICIO_STARTUP_FAILURE'
    )
  }
}
```

2. **Agregar al orquestador:**
```typescript
// src/lib/startup/startup-checks.ts
import { checkNuevoServicio } from './checks/checkNuevoServicio'

export async function runStartupChecks(): Promise<void> {
  // ... checks existentes
  await checkNuevoServicio()
  logger.info('✓ Nuevo servicio check passed')
}
```

3. **Agregar test:**
```typescript
// src/lib/startup/startup.test.ts
it('ejecuta checkNuevoServicio', async () => {
  // ...
})
```

## 🎯 Próximos Pasos

- **PASO 10.3:** Health Checks (runtime)
- **PASO 10.4:** Guard CI "Prod-Ready"

## 📚 Referencias

- [Error Types](../src/lib/errors/error-types.ts)
- [Env Schema](../src/lib/env/env.schema.ts)
- [Constants](../src/lib/constants.ts)

---

**Estado:** ✅ **Completado**  
**Fecha:** 2025-01-28
