# ✅ Paso 8.3: Tests de Ruptura Contractual

## 🎯 Objetivo

Garantizar que el contrato no se pueda romper sin CI rojo mediante tests exhaustivos que cubren todos los casos de ruptura contractual.

## 📐 Regla Dura

> **Todo contrato sin test es documentación. Todo contrato con test es ley.**

## 📊 Alcance Exacto del Test

### **✅ Se Testea:**

1. **CreateNoteSchema**
   - Inputs válidos
   - Campos faltantes
   - Campos extra
   - Tipos inválidos
   - Validación de CUID
   - Strings vacíos

2. **validateRequest**
   - Validación exitosa
   - Errores de validación
   - ContractValidationError
   - Conversión a NextResponse
   - Schemas complejos

3. **Parsers**
   - `parseFormData`: valores string, valores no string
   - `parseJsonBody`: JSON válido, JSON inválido, body vacío

### **❌ NO Se Testea:**

- Next.js runtime
- NextRequest
- fetch
- middleware
- Integración HTTP completa

**Razón:** Mantener tests rápidos, deterministas y aislados.

## 🧩 Estructura de Tests

```
src/lib/contracts/
  ├─ schemas/
  │   └─ create-note.schema.test.ts    ✅ 15+ tests
  ├─ validateRequest.test.ts            ✅ 10+ tests
  └─ http/
      ├─ parseFormData.test.ts          ✅ 10+ tests
      └─ parseJsonBody.test.ts          ✅ 8+ tests
```

## 📋 Tests Implementados

### **1. Test del Contrato (Schema)**

**Archivo:** `src/lib/contracts/schemas/create-note.schema.test.ts`

**Cobertura:**
- ✅ Inputs válidos (con y sin campos opcionales)
- ✅ Campos faltantes (Invariante 1)
- ✅ Campos extra (Invariante 2)
- ✅ Tipos inválidos (Invariante 3)
- ✅ Strings vacíos
- ✅ Validación de CUID

**Tests:**
- `accepts valid input with required fields`
- `accepts valid input with all optional fields`
- `rejects missing required field: title`
- `rejects missing required field: content`
- `rejects extra field`
- `rejects invalid type: title as number`
- `rejects empty string for title`
- `rejects invalid CUID format for questionId`
- Y más...

### **2. Test del Orquestador**

**Archivo:** `src/lib/contracts/validateRequest.test.ts`

**Cobertura:**
- ✅ Validación exitosa
- ✅ Errores de validación
- ✅ ContractValidationError
- ✅ Conversión a NextResponse
- ✅ Schemas complejos

**Tests:**
- `returns validated data for valid input`
- `throws ContractValidationError for invalid input`
- `throws with "Invalid request contract" message`
- `includes zodError in ContractValidationError`
- `converts error to NextResponse with 400 status`
- Y más...

### **3. Test del Parser FormData**

**Archivo:** `src/lib/contracts/http/parseFormData.test.ts`

**Cobertura:**
- ✅ Valores string válidos
- ✅ Valores no string (prohibidos)
- ✅ FormData vacío
- ✅ Caracteres especiales y unicode

**Tests:**
- `parses string values correctly`
- `throws on File object`
- `throws on Blob object`
- `throws with descriptive error message`
- `returns empty object for empty FormData`
- Y más...

### **4. Test del Parser JSON Body**

**Archivo:** `src/lib/contracts/http/parseJsonBody.test.ts`

**Cobertura:**
- ✅ JSON válido (objeto, array, primitivo)
- ✅ Body vacío
- ✅ JSON inválido

**Tests:**
- `parses valid JSON object`
- `parses valid JSON array`
- `returns empty object for empty body`
- `throws on invalid JSON syntax`
- Y más...

## 🔒 Reglas Obligatorias de Testing

### **❌ Prohibido:**

1. **Mocks innecesarios**
   - ❌ No mockear FormData (usar real)
   - ❌ No mockear Request (usar real)
   - ✅ Solo mockear si es absolutamente necesario

2. **Snapshots**
   - ❌ No usar snapshots para validación
   - ✅ Usar assertions explícitas

3. **Tests "happy-only"**
   - ❌ No solo testear casos válidos
   - ✅ Testear todos los casos inválidos

4. **Testing indirecto**
   - ❌ No testear a través de otros componentes
   - ✅ Testear directamente el contrato

## ✅ Invariantes Cubiertas

### **Invariante 1: Campos Inexistentes No Existen**
- ✅ Tests: `rejects missing required field: title`
- ✅ Tests: `rejects missing required field: content`
- ✅ Tests: `rejects empty object`

### **Invariante 2: Campos Extra Están Prohibidos**
- ✅ Tests: `rejects extra field`
- ✅ Tests: `rejects multiple extra fields`
- ✅ Tests: `rejects extra field even with valid optional fields`

### **Invariante 3: Tipos Inválidos No Entran**
- ✅ Tests: `rejects invalid type: title as number`
- ✅ Tests: `rejects invalid type: content as boolean`
- ✅ Tests: `rejects null for required fields`

## 📊 Cobertura de Tests

### **Casos Válidos:**
- ✅ Input completo con todos los campos
- ✅ Input con campos requeridos solamente
- ✅ Input con campos opcionales parciales

### **Casos Inválidos:**
- ✅ Campos faltantes (todos los requeridos)
- ✅ Campos extra (uno y múltiples)
- ✅ Tipos inválidos (number, boolean, null, undefined, array)
- ✅ Strings vacíos
- ✅ CUIDs inválidos
- ✅ JSON malformado
- ✅ FormData con File/Blob

## 🚀 Cómo Replicar en Nuevos Endpoints

### **Paso 1: Crear Schema**
```typescript
// src/lib/contracts/schemas/my-endpoint.schema.ts
export const MyEndpointSchema = z.object({...}).strict()
```

### **Paso 2: Crear Test del Schema**
```typescript
// src/lib/contracts/schemas/my-endpoint.schema.test.ts
describe('MyEndpointSchema', () => {
  it('accepts valid input', () => {...})
  it('rejects missing fields', () => {...})
  it('rejects extra fields', () => {...})
  it('rejects invalid types', () => {...})
})
```

### **Paso 3: Usar en Endpoint**
```typescript
// src/app/api/my-endpoint/route.ts
const input = validateRequest({
  schema: MyEndpointSchema,
  input: rawInput,
})
```

## 📋 Checklist de Tests

Antes de considerar completo, verificar:

- [x] ✅ Tests de inputs válidos
- [x] ✅ Tests de campos faltantes
- [x] ✅ Tests de campos extra
- [x] ✅ Tests de tipos inválidos
- [x] ✅ Tests de edge cases (empty strings, null, undefined)
- [x] ✅ Tests de validaciones específicas (CUID, email, etc.)
- [x] ✅ Tests de parsers
- [x] ✅ Tests de orquestador
- [x] ✅ Tests de manejo de errores

## 🎯 Resultado Esperado

Al cerrar este paso:

- ✅ **Tests que prueban inputs válidos → pasan**
- ✅ **Tests que prueban inputs inválidos → fallan explícitamente**
- ✅ **Cobertura completa** de campos faltantes, extra, tipos inválidos
- ✅ **Tests puros** (sin HTTP real)
- ✅ **Base replicable** a todos los endpoints
- ✅ **Cero flakiness** (tests deterministas)

## 🚀 Ejecutar Tests

```bash
# Ejecutar todos los tests de contratos
npm run test:run -- src/lib/contracts

# Ejecutar test específico
npm run test:run -- src/lib/contracts/schemas/create-note.schema.test.ts
```

## 📄 Próximo Paso

**Paso 8.4:** Guard CI de contratos

- Si alguien rompe schema → CI rojo
- Si alguien rompe orquestador → CI rojo
- Si alguien rompe invariantes → CI rojo

---

**Fecha:** 2026-01-10  
**Estado:** ✅ Tests implementados  
**Próximo:** Paso 8.4 - Guard CI de contratos
