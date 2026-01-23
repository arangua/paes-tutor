# ✅ Paso 8.2: Patrón de Validación del Contrato

## 🎯 Objetivo

Implementar un patrón único, reutilizable y testeable para validar todos los inputs que cruzan el borde HTTP (API Routes), aplicable a los 200+ endpoints del proyecto.

## 📐 Decisiones Técnicas (Congeladas)

- ✅ **Zod** como runtime validator (strict)
- ✅ **TypeScript** inferido desde el contrato (no duplicado)
- ✅ **Un contrato por endpoint**
- ✅ **Sin coerciones silenciosas**
- ✅ **Sin defaults implícitos**
- ✅ **Sin validación distribuida**

## 🧩 Arquitectura del Patrón

```
/src/lib/contracts/
  ├─ http/
  │   ├─ parseFormData.ts        ← Parser de FormData
  │   ├─ parseJsonBody.ts        ← Parser de JSON
  │   ├─ validateRouteParams.ts  ← Validador de route params
  │   └─ validateQueryParams.ts  ← Validador de query params
  ├─ schemas/
  │   └─ *.schema.ts             ← Schemas Zod por endpoint
  ├─ validateRequest.ts          ← ORQUESTADOR ÚNICO
  └─ index.ts                    ← Exports centralizados
```

### **📌 Regla Enterprise**

> **El handler no valida. Solo consume datos ya validados.**

## 🔧 Componentes Implementados

### **1. Parser de FormData**

**Archivo:** `src/lib/contracts/http/parseFormData.ts`

**Responsabilidad:**
- Extraer valores string de FormData
- Rechazar valores no string (File objects, etc.)

**Reglas:**
- ✅ No coerciona
- ✅ No ignora
- ✅ No transforma
- ✅ Solo extrae strings

**Ejemplo:**
```typescript
const formData = await request.formData()
const rawInput = parseFormData(formData)
// rawInput: Record<string, unknown>
```

### **2. Parser de JSON Body**

**Archivo:** `src/lib/contracts/http/parseJsonBody.ts`

**Responsabilidad:**
- Parsear JSON body del request
- Manejar body vacío

**Reglas:**
- ✅ No coerciona
- ✅ No transforma
- ✅ Solo parsea JSON válido

**Ejemplo:**
```typescript
const rawInput = await parseJsonBody(request)
// rawInput: unknown
```

### **3. Validador de Route Params**

**Archivo:** `src/lib/contracts/http/validateRouteParams.ts`

**Responsabilidad:**
- Validar parámetros dinámicos de la ruta (ej: `/api/notes/[id]`)

**Ejemplo:**
```typescript
const params = validateRouteParams(
  { id: 'c123...' },
  z.object({ id: z.string().cuid() })
)
```

### **4. Validador de Query Params**

**Archivo:** `src/lib/contracts/http/validateQueryParams.ts`

**Responsabilidad:**
- Validar query parameters de la URL

**Ejemplo:**
```typescript
const query = validateQueryParams(
  request,
  z.object({ page: z.string().transform(Number) })
)
```

### **5. Orquestador Único de Validación**

**Archivo:** `src/lib/contracts/validateRequest.ts`

**Responsabilidad:**
- Punto único de validación
- Validar con schema Zod
- Lanzar error tipado si falla

**Características:**
- ✅ Un solo punto de validación
- ✅ Reusable
- ✅ Testeable
- ✅ Guardable en CI

**Ejemplo:**
```typescript
const input = validateRequest({
  schema: CreateNoteSchema,
  input: rawInput,
})
// input: CreateNoteInput (tipado)
```

**Error Handling:**
```typescript
try {
  input = validateRequest({ schema, input: rawInput })
} catch (error) {
  if (error instanceof ContractValidationError) {
    return error.toResponse() // NextResponse con error 400
  }
  throw error
}
```

### **6. Schema de Contrato**

**Archivo:** `src/lib/contracts/schemas/create-note.schema.ts`

**Responsabilidad:**
- Definir el contrato del endpoint
- Inferir tipos TypeScript

**Características:**
- ✅ `.strict()` - Campos extra prohibidos
- ✅ Tipos explícitos
- ✅ Sin defaults implícitos
- ✅ Mensajes de error claros

**Ejemplo:**
```typescript
export const CreateNoteSchema = z
  .object({
    title: z.string().min(1, 'El título es requerido'),
    content: z.string().min(1, 'El contenido es requerido'),
    questionId: z.string().cuid().optional(),
    topicId: z.string().cuid().optional(),
    tags: z.string().optional(),
  })
  .strict() // ⛔ Campos extra prohibidos

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>
```

## 📋 Patrón de Uso en API Route

### **Flujo Canónico**

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Autenticación (contexto, no parte del contrato)
    const dbUser = await getAuthenticatedUserWithStudent()
    if (!dbUser?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Parse del input (según Content-Type)
    const contentType = request.headers.get('content-type') || ''
    let rawInput: unknown

    if (contentType.includes('form')) {
      const formData = await request.formData()
      rawInput = parseFormData(formData)
    } else {
      rawInput = await parseJsonBody(request)
    }

    // 3. Validación del contrato (⛔ ANTES de cualquier lógica)
    let input: CreateNoteInput
    try {
      input = validateRequest({
        schema: CreateNoteSchema,
        input: rawInput,
      })
    } catch (error) {
      if (error instanceof ContractValidationError) {
        return error.toResponse()
      }
      throw error
    }

    // ⛔ Desde aquí, input ES válido por contrato
    // ✅ Lógica segura (después de validación)

    // 4. Lógica de dominio
    const note = await prisma.studyNote.create({
      data: { ...input, studentId: dbUser.student.id },
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    logger.error({ error }, 'Error al crear nota')
    return NextResponse.json({ error: 'Error al crear nota' }, { status: 500 })
  }
}
```

### **Orden Estricto**

1. ✅ Autenticación (contexto)
2. ✅ Parse del input (FormData/JSON)
3. ✅ **Validación del contrato** (Zod)
4. ✅ Si falla → Error 400 (sin side effects)
5. ✅ Si pasa → Lógica de dominio

## 🔒 Lo que este Patrón PROHÍBE

### **❌ Anti-patterns Prohibidos**

1. **`req.body as any`**
   - ❌ No se permite
   - ✅ Usar `unknown` y validar

2. **Validaciones parciales**
   - ❌ No validar algunos campos
   - ✅ Validar todo o nada

3. **`z.coerce.*`**
   - ❌ Coerciones silenciosas
   - ✅ Conversiones explícitas con validación

4. **Defaults ocultos**
   - ❌ `z.string().default('')`
   - ✅ Opcional explícito: `z.string().optional()`

5. **`unknown` pasando capas**
   - ❌ Pasar `unknown` a lógica de dominio
   - ✅ Validar antes de usar

6. **"Ya validé más abajo"**
   - ❌ Validar en múltiples lugares
   - ✅ Validar una vez, al inicio

## ✅ Invariantes Cumplidas

### **Invariante 1: Campos Inexistentes No Existen**
- ✅ No defaults implícitos
- ✅ Opcionales explícitos con `.optional()`

### **Invariante 2: Campos Extra Están Prohibidos**
- ✅ `.strict()` en todos los schemas
- ✅ Rechazo inmediato con error 400

### **Invariante 3: Tipos Inválidos No Entran**
- ✅ Tipos explícitos en schema
- ✅ Conversiones validadas (no coerciones)

### **Invariante 4: Contrato Único por Endpoint**
- ✅ Un schema por endpoint
- ✅ No variantes condicionales

### **Invariante 5: Validación Antes de Toda Lógica**
- ✅ Validación al inicio del handler
- ✅ Sin side effects antes de validación

## 📊 Resultado Esperado

Al cerrar este paso, el sistema cumple:

- ✅ **Patrón único reutilizable** por los 200+ endpoints
- ✅ **Validación type + runtime** (Zod + TypeScript)
- ✅ **Rechazo explícito** de campos extra, faltantes, tipos inválidos
- ✅ **Fail-fast** antes de cualquier lógica
- ✅ **Base lista** para tests (8.3) y guard CI (8.4)

## 🧪 Endpoint Canónico de Ejemplo

**Archivo:** `src/app/api/notes/create/route.ts`

Este endpoint demuestra el patrón completo:
- ✅ Parse de FormData/JSON
- ✅ Validación con schema
- ✅ Manejo de errores
- ✅ Lógica de dominio después de validación

## 📋 Checklist de Implementación

- [x] ✅ Parser de FormData implementado
- [x] ✅ Parser de JSON body implementado
- [x] ✅ Validador de route params implementado
- [x] ✅ Validador de query params implementado
- [x] ✅ Orquestador único (validateRequest) implementado
- [x] ✅ Schema de ejemplo (create-note) creado
- [x] ✅ Endpoint canónico de ejemplo creado
- [x] ✅ Documentación completa

## 🚀 Próximo Paso

**Paso 8.3:** Tests de ruptura contractual (Vitest)

- Probar inputs válidos
- Probar todos los inválidos
- Garantizar que el contrato no se puede romper sin CI rojo

---

**Fecha:** 2026-01-10  
**Estado:** ✅ Patrón implementado y documentado  
**Próximo:** Paso 8.3 - Tests de ruptura contractual
