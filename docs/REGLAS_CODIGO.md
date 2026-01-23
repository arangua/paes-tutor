# 📋 Reglas de Código - PAES Tutor

## 🎯 Reglas Estrictas (Enterprise)

### **TypeScript**

```typescript
// ❌ MAL
function processData(data: any) {
  return data.value
}

// ✅ BIEN
function processData(data: { value: number }): number {
  return data.value
}
```

### **Funciones Seguras**

```typescript
// ❌ MAL
const percentage = (correct / total) * 100
const rounded = Math.round(value)

// ✅ BIEN
import { safeDivide, safeRound } from '@/app/api/notes/versions/validation-utils'
const percentage = safeRound(safeDivide(correct, total, 0) * 100, 2)
const rounded = safeRound(value, 0)
```

### **Logging**

```typescript
// ❌ MAL
console.log('Processing data', data)
console.error('Error occurred', error)

// ✅ BIEN
import { logger } from '@/lib/logger'
logger.info({ data }, 'Processing data')
logger.error({ error }, 'Error occurred')
```

### **Validación**

```typescript
// ❌ MAL
export async function POST(request: NextRequest) {
  const body = await request.json()
  const id = body.id // Sin validación
}

// ✅ BIEN
import { z } from 'zod'
const schema = z.object({
  id: z.string().cuid('ID inválido'),
})
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { id } = schema.parse(body)
}
```

### **Manejo de Errores**

```typescript
// ❌ MAL
try {
  await operation()
} catch (error) {
  return NextResponse.json({ error: 'Error' }, { status: 500 })
}

// ✅ BIEN
import { handleApiError } from '@/lib/api-helpers'
try {
  await operation()
} catch (error) {
  return handleApiError(error, 'Error en operación', { context })
}
```

---

## 🔍 Reglas de Detección

### **ESLint Rules**

- `@typescript-eslint/no-explicit-any: error`
- `@typescript-eslint/no-unused-vars: error`
- `no-console: error` (excepto warn/error)
- `no-debugger: error`

### **Validaciones Automáticas**

- `validate:types` - TypeScript types
- `validate:secrets` - Secrets hardcodeados
- `lint:strict` - ESLint estricto

---

## 📚 Más Información

Ver `ESTANDAR_ENTERPRISE.md` para el estándar completo.

