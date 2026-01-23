# ✅ Paso 10.1: ENV Contracts (Runtime Safety)

## 🎯 Objetivo

Garantizar que el sistema no pueda arrancar con:
- ❌ Variables de entorno faltantes
- ❌ Tipos incorrectos
- ❌ Combinaciones peligrosas
- ❌ Flags inconsistentes

## 📐 Regla Enterprise

> **Una app que arranca mal ya falló.**

## 🔒 Decisiones Técnicas (Congeladas)

- ✅ **Zod + loader propio** (coherencia con Paso 8/9)
- ✅ **Fail-fast al importar** (validación antes de arranque)
- ✅ **Prohibición de process.env directo** (solo a través de env.ts)

## 🧩 Arquitectura Implementada

```
src/lib/env/
  ├─ env.schema.ts      ✅ Contrato único
  ├─ env.ts             ✅ Loader + validación (fail-fast)
  ├─ env.test.ts        ✅ Tests de ruptura
  └─ index.ts           ✅ Exports centralizados
```

## 📋 Variables Definidas en el Contrato

### **Requeridas (Siempre)**

- `NODE_ENV` - Entorno (development | test | production), default: development
- `DATABASE_URL` - URL de base de datos
- `NEXTAUTH_SECRET` - Secret de NextAuth (mínimo 32 caracteres)
- `ENCRYPTION_KEY` - Clave de encriptación (mínimo 32 caracteres)

### **Opcionales**

- `NEXTAUTH_URL` - URL base (requerida en producción)
- `UPSTASH_REDIS_REST_URL` - URL de Redis
- `UPSTASH_REDIS_REST_TOKEN` - Token de Redis
- `OPENAI_API_KEY` - API key de OpenAI
- `GOOGLE_AI_API_KEY` - API key de Google AI
- `ANTHROPIC_API_KEY` - API key de Anthropic
- `SENTRY_DSN` - DSN de Sentry
- `NEXT_PUBLIC_SENTRY_DSN` - DSN público de Sentry
- `SENTRY_ORG` - Organización de Sentry
- `SENTRY_PROJECT` - Proyecto de Sentry
- `LOG_LEVEL` - Nivel de logging (debug | info | warn | error), default: info
- `NEXT_RUNTIME` - Runtime de Next.js (nodejs | edge)

## 🔒 Dependencias Declaradas

### **1. NEXTAUTH_URL requerida en producción**

```typescript
if (env.NODE_ENV === 'production' && !env.NEXTAUTH_URL) {
  // Error
}
```

### **2. Redis: URL y Token juntos**

```typescript
// Si hay URL, debe haber token
if (env.UPSTASH_REDIS_REST_URL && !env.UPSTASH_REDIS_REST_TOKEN) {
  // Error
}

// Si hay token, debe haber URL
if (env.UPSTASH_REDIS_REST_TOKEN && !env.UPSTASH_REDIS_REST_URL) {
  // Error
}
```

### **3. ENCRYPTION_KEY no puede usar prefijos de desarrollo en producción**

```typescript
if (env.NODE_ENV === 'production') {
  if (env.ENCRYPTION_KEY.startsWith('dev-') || env.ENCRYPTION_KEY.startsWith('test-')) {
    // Error
  }
}
```

## 📋 Uso Correcto

### **✅ BIEN:**

```typescript
import { env } from '@/lib/env'

const dbUrl = env.DATABASE_URL // ✅ Tipado y validado
const isProduction = env.NODE_ENV === 'production' // ✅ Tipado
```

### **❌ MAL:**

```typescript
const dbUrl = process.env.DATABASE_URL // ❌ Prohibido
const isProduction = process.env.NODE_ENV === 'production' // ❌ Prohibido
```

## 🔧 Loader (Fail-Fast)

**Archivo:** `src/lib/env/env.ts`

**Características:**
- ✅ Se ejecuta al importar (fail-fast)
- ✅ Falla antes de que la app haga nada
- ✅ Error tipado (SystemError)
- ✅ Mensajes de error claros

**Ejemplo de error:**
```
❌ Invalid environment variables:
{
  DATABASE_URL: {
    _errors: ['Required']
  }
}

💡 Corrección:
   - Verifica que todas las variables requeridas están configuradas
   - Verifica que los tipos son correctos
   - Verifica que las dependencias entre variables se cumplen
```

## 🧪 Tests Implementados

**Archivo:** `src/lib/env/env.test.ts`

**Cobertura:**
- ✅ Entorno válido (mínimo y completo)
- ✅ Campos faltantes (todos los requeridos)
- ✅ Tipos inválidos (NODE_ENV, URLs, longitudes)
- ✅ Dependencias (NEXTAUTH_URL en producción, Redis URL/token)
- ✅ Seguridad en producción (prefijos dev/test)
- ✅ Defaults (NODE_ENV, LOG_LEVEL)
- ✅ Campos extra (strict mode)

## ⚠️ Anti-Patterns Prohibidos

### **1. Leer process.env directamente**

**❌ Prohibido:**
```typescript
const dbUrl = process.env.DATABASE_URL
```

**✅ Requerido:**
```typescript
import { env } from '@/lib/env'
const dbUrl = env.DATABASE_URL
```

### **2. Validación parcial**

**❌ Prohibido:**
```typescript
if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL')
}
// ... más validaciones dispersas
```

**✅ Requerido:**
```typescript
// Validación centralizada en env.ts
import { env } from '@/lib/env'
```

### **3. Defaults implícitos**

**❌ Prohibido:**
```typescript
const nodeEnv = process.env.NODE_ENV || 'development'
```

**✅ Requerido:**
```typescript
// Default declarado en schema
import { env } from '@/lib/env'
const nodeEnv = env.NODE_ENV // Ya tiene default
```

## 📊 Resultado Esperado

Al cerrar este paso:

- ✅ **Esquema único y estricto** de variables de entorno
- ✅ **Tipos + runtime validation** (Zod)
- ✅ **Dependencias entre variables explícitas** (superRefine)
- ✅ **Defaults solo cuando son seguros** (declarados en schema)
- ✅ **Fail-fast con errores tipados** (SystemError)
- ✅ **Base lista para Startup Guards** (10.2)

## 🚀 Próximo Paso

**Paso 10.2:** Startup Guards

- Verificar que servicios externos están disponibles
- Verificar que la base de datos está accesible
- Verificar que secrets son válidos
- Bloquear arranque si algo falla

---

**Fecha:** 2026-01-10  
**Estado:** ✅ ENV Contracts implementados  
**Próximo:** Paso 10.2 - Startup Guards
