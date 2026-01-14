# ✅ Paso 9: Error Handling Enterprise

## 🎯 Objetivo

Garantizar que cuando algo falle, el sistema:
- ✅ Falle bien
- ✅ De forma clasificada
- ✅ Observable
- ✅ Sin filtrar estados inválidos
- ✅ Sin ruido

## 📐 Regla Enterprise

> **Un error no clasificado es deuda técnica activa.**

## 🔒 Decisiones Técnicas (Congeladas)

- ✅ **Errores tipados** (clases, no strings)
- ✅ **Un punto de traducción** error → HTTP
- ✅ **Contrato de error estable**
- ✅ **No leaks de stack/implementación** al cliente
- ✅ **Errores de contrato NO llegan al dominio**

## 🧩 Taxonomía de Errores

### **1. Errores de Contrato (ContractError)**

**Características:**
- Ocurren en el borde HTTP
- Antes de la lógica de dominio
- Siempre 400 Bad Request
- ⛔ **NO llegan al dominio**

**Ejemplos:**
- Validación de schema fallida
- Campos faltantes
- Tipos inválidos

**Código:**
```typescript
throw new ContractError('Invalid input', zodError, 'INVALID_CONTRACT')
```

### **2. Errores de Dominio (DomainError)**

**Características:**
- Ocurren en la lógica de negocio
- Después de validación de contrato
- Códigos HTTP según tipo (400, 404, 409, etc.)
- Mensajes específicos del dominio

**Ejemplos:**
- Recurso no encontrado (404)
- Conflicto (409)
- No autorizado (401)
- Prohibido (403)

**Códigos:**
```typescript
throw new NotFoundError('Note', '123')
throw new ConflictError('Resource already exists')
throw new UnauthorizedError()
throw new ForbiddenError()
```

### **3. Errores de Sistema (SystemError)**

**Características:**
- Ocurren en infraestructura (DB, servicios externos, etc.)
- Siempre 500 Internal Server Error
- Mensajes genéricos al cliente (no leaks)
- Detalles completos en logs

**Ejemplos:**
- Error de conexión a DB
- Timeout de servicio externo
- Error inesperado

**Código:**
```typescript
throw new SystemError('Database connection failed', originalError)
```

## 📋 Arquitectura Implementada

```
src/lib/errors/
  ├─ error-types.ts          ✅ Taxonomía de errores
  ├─ error-handler.ts        ✅ Punto único de traducción
  ├─ error-handler.test.ts   ✅ Tests
  ├─ error-types.test.ts     ✅ Tests
  └─ index.ts                ✅ Exports
```

## 🔧 Componentes

### **1. Taxonomía de Errores**

**Archivo:** `src/lib/errors/error-types.ts`

**Clases:**
- `AppError` (base abstracta)
- `ContractError` (400)
- `DomainError` (400, 404, 409, etc.)
- `SystemError` (500)
- Helpers: `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`

### **2. Error Handler**

**Archivo:** `src/lib/errors/error-handler.ts`

**Funciones:**
- `handleError()` - Punto único de traducción
- `withErrorHandler()` - Wrapper para handlers
- `isContractError()`, `isDomainError()`, `isSystemError()` - Type guards

### **3. Integración con Contratos**

**Cambio:** `validateRequest` ahora lanza `ContractError` en lugar de `ContractValidationError`

**Beneficio:**
- ✅ Consistencia en el sistema de errores
- ✅ Errores de contrato NO llegan al dominio
- ✅ Traducción automática a HTTP

## 📊 Mapeo Error → HTTP

| Error Type | HTTP Status | Código | Cliente Ve |
|------------|-------------|--------|------------|
| `ContractError` | 400 | `INVALID_CONTRACT` | "Invalid request contract" + details |
| `NotFoundError` | 404 | `NOT_FOUND` | "Note with id '123' not found" |
| `ConflictError` | 409 | `CONFLICT` | "Resource already exists" |
| `UnauthorizedError` | 401 | `UNAUTHORIZED` | "Unauthorized" |
| `ForbiddenError` | 403 | `FORBIDDEN` | "Forbidden" |
| `SystemError` | 500 | `SYSTEM_ERROR` | "Internal server error" (no leaks) |

## 🔍 Observabilidad

### **Logging Estructurado**

Cada error se loggea con:
- Categoría (contract, domain, system)
- Código de error
- Mensaje
- Contexto
- Stack (solo en development)

### **Niveles de Log**

- **Contract errors:** `warn` (esperados, no críticos)
- **Domain errors:** `warn` (lógica de negocio)
- **System errors:** `error` (críticos, requieren atención)

## 📋 Uso en API Routes

### **Patrón Canónico**

```typescript
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    // 1. Autenticación
    const user = await getAuthenticatedUser()
    if (!user) {
      throw new UnauthorizedError()
    }

    // 2. Validación de contrato
    const input = validateRequest({
      schema: MySchema,
      input: rawInput,
    })
    // ⛔ Si falla, ContractError se lanza y NO llega aquí

    // 3. Lógica de dominio
    const resource = await findResource(input.id)
    if (!resource) {
      throw new NotFoundError('Resource', input.id)
    }

    // 4. Operación
    const result = await createResource(input)
    return NextResponse.json({ result }, { status: 201 })
  }, { endpoint: 'my-endpoint', method: 'POST' })
}
```

## ✅ Invariantes Cumplidas

### **Invariante: Errores de Contrato NO Llegan al Dominio**

- ✅ `validateRequest` lanza `ContractError`
- ✅ `ContractError` se maneja antes de lógica de dominio
- ✅ Tests verifican que errores de contrato no avanzan

### **Invariante: No Leaks de Stack**

- ✅ `SystemError.toResponse()` no incluye stack
- ✅ Solo mensajes genéricos al cliente
- ✅ Detalles completos en logs (observabilidad)

### **Invariante: Contrato de Error Estable**

- ✅ Todos los errores extienden `AppError`
- ✅ Todos tienen `toResponse()` y `toObservable()`
- ✅ Mapeo consistente a HTTP

## 🧪 Tests Implementados

### **1. Error Types Tests**

**Archivo:** `src/lib/errors/error-types.test.ts`

**Cobertura:**
- ✅ Categorías correctas
- ✅ Status HTTP correctos
- ✅ Códigos de error
- ✅ No leaks de stack
- ✅ Observabilidad

### **2. Error Handler Tests**

**Archivo:** `src/lib/errors/error-handler.test.ts`

**Cobertura:**
- ✅ Manejo de cada tipo de error
- ✅ Conversión de errores estándar
- ✅ `withErrorHandler` wrapper
- ✅ Type guards

## 📊 Resultado Esperado

Al cerrar este paso:

- ✅ **Taxonomía única de errores** (contract, domain, system)
- ✅ **Separación estricta** (errores de contrato NO llegan al dominio)
- ✅ **Mapeo consistente a HTTP** (un punto de traducción)
- ✅ **Integración limpia con observabilidad** (logging estructurado)
- ✅ **Tests que garantizan cómo se falla**
- ✅ **CI detecta regresiones** (tests automáticos)

## 🚀 Próximos Pasos (Opcional)

### **Migración Gradual**
1. Aplicar `withErrorHandler` a endpoints críticos
2. Reemplazar `handleApiError` con nuevo sistema
3. Migrar endpoints existentes gradualmente

### **Extensión**
1. Agregar más tipos de error específicos según necesidad
2. Integrar con Sentry/monitoring
3. Agregar métricas de errores

---

**Fecha:** 2026-01-10  
**Estado:** ✅ Sistema de Error Handling implementado  
**Próximo:** Aplicar a endpoints existentes (opcional)
