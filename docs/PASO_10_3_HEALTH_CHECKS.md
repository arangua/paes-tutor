# PASO 10.3 — Health Checks (Runtime)

## 🎯 Objetivo

Exponer estado operativo en tiempo real, sin afectar lógica ni seguridad.

**Regla Enterprise:**
> Startup guards previenen el arranque malo; health checks detectan degradación en ejecución.

## ✅ Resultado Esperado

Al cerrar 10.3, se tienen:

- ✅ Endpoint(s) de salud claros y estables
- ✅ Separación:
  - **liveness** (¿está vivo?)
  - **readiness** (¿puede recibir tráfico?)
- ✅ Sin side effects
- ✅ Respuestas deterministas y rápidas
- ✅ Integrable con:
  - Orquestadores (Kubernetes)
  - Monitoreo
  - Balanceadores
- ✅ Tests que garantizan qué reporta y cuándo

## 📐 Alcance (Congelable)

### ✅ Incluye

- `/api/health/liveness` - Verifica que el proceso está vivo
- `/api/health/readiness` - Verifica que puede recibir tráfico
- Checks ligeros (no reintentan, no escriben)
- Mapeo a HTTP claro (200 / 503)

### ❌ Excluye

- Diagnósticos pesados
- Logs verbosos
- Información sensible

## 🧩 Arquitectura

```
src/app/api/health/
  ├─ liveness/route.ts    ← endpoint de liveness
  └─ readiness/route.ts  ← endpoint de readiness

src/lib/health/
  ├─ liveness.ts         ← lógica de liveness
  ├─ readiness.ts        ← lógica de readiness
  ├─ health.types.ts     ← tipos y contratos
  ├─ health.test.ts      ← tests de lógica
  └─ index.ts            ← exports

src/app/api/health/
  ├─ liveness/route.test.ts
  └─ readiness/route.test.ts
```

### 📌 Regla

**Los endpoints solo orquestan; la lógica vive en `lib/health`.**

## 🔍 Endpoints Implementados

### 1. Liveness Check

**Endpoint:** `GET /api/health/liveness`

**Semántica:** ¿Está vivo el proceso?

**Características:**
- ✅ No depende de servicios externos
- ✅ No depende de DB
- ✅ No depende de Redis
- ✅ Siempre rápido (< 100ms)
- ✅ Siempre retorna 200 si el proceso responde

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-28T12:00:00.000Z"
}
```

**HTTP:**
- `200` → proceso vivo
- Nunca `500` (si el proceso está tan colgado que no puede responder, el endpoint no se ejecutará)

**Uso recomendado:**
- Kubernetes liveness probe
- Load balancers (verificar que el proceso responde)
- Monitoreo básico

### 2. Readiness Check

**Endpoint:** `GET /api/health/readiness`

**Semántica:** ¿Puede recibir tráfico ahora?

**Características:**
- ✅ Verifica servicios críticos:
  - Base de datos
  - Redis (si está habilitado)
- ✅ No reintenta
- ✅ Timeouts cortos (2 segundos)
- ✅ Ejecuta checks en paralelo

**Respuesta:**
```json
{
  "status": "ok" | "degraded",
  "checks": {
    "database": "ok" | "down",
    "redis": "ok" | "skipped" | "down"
  },
  "timestamp": "2025-01-28T12:00:00.000Z"
}
```

**HTTP:**
- `200` → listo para recibir tráfico
- `503` → degradado (no puede recibir tráfico)

**Lógica de estado:**
- `ok`: Todos los servicios críticos disponibles
- `degraded`: 
  - Base de datos down, O
  - Redis down (si está configurado)

**Uso recomendado:**
- Kubernetes readiness probe
- Load balancers (verificar que puede servir tráfico)
- Monitoreo de servicios

## 📋 Contrato de Respuesta

### Liveness

```typescript
{
  status: "ok"
  timestamp: string // ISO-8601
}
```

### Readiness

```typescript
{
  status: "ok" | "degraded"
  checks: {
    database: "ok" | "down"
    redis: "ok" | "skipped" | "down"
  }
  timestamp: string // ISO-8601
}
```

### 📌 Reglas del Contrato

1. **Sin detalles internos** - No expone stacks, mensajes de error internos
2. **Sin secretos** - No expone URLs, tokens, o información sensible
3. **Determinista** - Misma entrada → misma salida
4. **Rápido** - Liveness < 100ms, Readiness < 2s

## 🧪 Tests

### Tests de Lógica

**Archivo:** `src/lib/health/health.test.ts`

**Cobertura:**
- ✅ `checkLiveness` siempre retorna `ok` si el proceso responde
- ✅ `checkReadiness` retorna `ok` cuando todos los servicios están disponibles
- ✅ `checkReadiness` retorna `degraded` cuando DB está down
- ✅ `checkReadiness` retorna `degraded` cuando Redis está configurado pero down
- ✅ `checkReadiness` retorna `skipped` para Redis cuando no está configurado
- ✅ Timestamps en formato ISO-8601
- ✅ Checks ejecutados en paralelo

### Tests de Endpoints

**Archivos:**
- `src/app/api/health/liveness/route.test.ts`
- `src/app/api/health/readiness/route.test.ts`

**Cobertura:**
- ✅ Liveness siempre retorna 200
- ✅ Readiness retorna 200 cuando está listo
- ✅ Readiness retorna 503 cuando está degradado
- ✅ Headers de no-cache

**Ejecutar tests:**
```bash
npm test src/lib/health/health.test.ts
npm test src/app/api/health/liveness/route.test.ts
npm test src/app/api/health/readiness/route.test.ts
```

## 🔧 Integración con Orquestadores

### Kubernetes

**Liveness Probe:**
```yaml
livenessProbe:
  httpGet:
    path: /api/health/liveness
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 1
```

**Readiness Probe:**
```yaml
readinessProbe:
  httpGet:
    path: /api/health/readiness
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 2
```

### Load Balancer

**Configuración:**
- Health check endpoint: `/api/health/readiness`
- Healthy threshold: `200`
- Unhealthy threshold: `503`
- Interval: `10s`
- Timeout: `2s`

## 📊 Monitoreo

### Métricas Recomendadas

1. **Liveness**
   - Disponibilidad del endpoint
   - Tiempo de respuesta

2. **Readiness**
   - Estado de servicios (DB, Redis)
   - Tiempo de respuesta
   - Frecuencia de degradación

### Alertas Recomendadas

- Readiness retorna `503` por más de 1 minuto
- Liveness no responde (proceso colgado)
- Tiempo de respuesta > 2s en readiness

## 🔄 Diferencias con Startup Guards

| Aspecto | Startup Guards | Health Checks |
|---------|---------------|---------------|
| **Cuándo** | Al iniciar (una vez) | En runtime (continuo) |
| **Objetivo** | Prevenir arranque malo | Detectar degradación |
| **Si falla** | Aborta startup | Retorna 503 |
| **Dependencias** | Críticas | Opcionales (Redis) |
| **Performance** | Puede ser más lento | Debe ser rápido |

## 🎯 Próximos Pasos

- **PASO 10.4:** Guard CI "Prod-Ready"

## 📚 Referencias

- [Startup Guards](./PASO_10_2_STARTUP_GUARDS.md)
- [Error Types](../src/lib/errors/error-types.ts)
- [Env Schema](../src/lib/env/env.schema.ts)

---

**Estado:** ✅ **Completado**  
**Fecha:** 2025-01-28
