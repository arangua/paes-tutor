# 📐 Paso 8.1: Perímetro del Contrato - Form Submission → API Routes

## 🎯 Objetivo

Definir formalmente el perímetro del contrato entre el cliente (Browser) y las API Routes, estableciendo límites claros, invariantes y reglas que se aplicarán a todos los 200+ endpoints del proyecto.

---

## 1️⃣ Límite Formal del Contrato (Boundary)

### **Definición del Borde**

El contrato vive **exclusivamente en el borde HTTP**, no en UI ni en DB.

```
[ Browser ]
   └─ <form> / fetch
        ↓
     FormData / JSON body
        ↓
┌──────────────────────────┐
│  API Route (/api/*)      │  ← AQUÍ NACE EL CONTRATO
│  (request boundary)      │     (request boundary)
└──────────────────────────┘
        ↓
   Lógica de dominio
        ↓
     Persistencia / Output
```

### **📌 Regla Enterprise #1**

> **Todo lo que cruza este borde es hostil hasta que el contrato lo valida.**

**Implicaciones:**
- ✅ No se confía en ningún dato del cliente
- ✅ No se asume formato, tipo o existencia
- ✅ Todo debe ser validado explícitamente
- ✅ La validación ocurre **antes** de cualquier lógica de dominio

### **Punto de Entrada**

**Ubicación:** Primera línea de la función handler de la API Route

**Ejemplo conceptual:**
```typescript
// src/app/api/[endpoint]/route.ts
export async function POST(request: NextRequest) {
  // ← AQUÍ EMPIEZA EL CONTRATO
  // Todo lo que viene después de esta línea debe estar validado
}
```

### **Punto de Salida del Contrato**

**Ubicación:** Después de la validación exitosa, antes de la lógica de dominio

**Ejemplo conceptual:**
```typescript
// Después de validación:
const validatedData = await validateContract(request)
// ← AQUÍ TERMINA EL CONTRATO
// validatedData es seguro y tipado
```

---

## 2️⃣ Qué Datos Están DENTRO del Contrato

### **A. Inputs desde Cliente**

#### **1. FormData (POST / PUT / PATCH)**

**Incluido:**
- ✅ Todos los campos del formulario
- ✅ Archivos (File objects)
- ✅ Valores de campos (strings)

**Formato:**
- `FormData` nativo del browser
- Acceso mediante `request.formData()`

**Reglas:**
- Cada campo debe estar declarado en el contrato
- Tipos deben ser explícitos (string, number, boolean, File)
- No se aceptan campos no declarados

#### **2. JSON Body (cuando aplique)**

**Incluido:**
- ✅ Objetos JSON completos
- ✅ Arrays
- ✅ Valores primitivos

**Formato:**
- `application/json`
- Acceso mediante `request.json()`

**Reglas:**
- Schema explícito (Zod)
- Tipos estrictos
- No se aceptan propiedades adicionales

#### **3. Query Parameters**

**Incluido SOLO si:**
- ✅ Disparan lógica específica
- ✅ Son parte del contrato del endpoint
- ✅ Están documentados

**Ejemplos válidos:**
- `?page=1&limit=20` (paginación)
- `?search=term` (búsqueda)
- `?filter=active` (filtros)

**NO incluido:**
- ❌ Query params no documentados
- ❌ Query params que no afectan lógica
- ❌ Query params "por si acaso"

#### **4. Route Parameters**

**Incluido:**
- ✅ Parámetros dinámicos en la ruta
- ✅ Ejemplo: `/api/notes/[id]` → `id` es parte del contrato

**Reglas:**
- Deben estar tipados
- Deben ser validados (formato, existencia)
- No se asumen formatos (ej: CUID, UUID)

### **B. Metadatos Relevantes**

#### **Headers (solo si influyen en lógica)**

**Incluido SOLO si:**
- ✅ Afectan el comportamiento del endpoint
- ✅ Son parte del contrato explícito

**Ejemplos válidos:**
- `Authorization` (si se usa directamente)
- `Content-Type` (si afecta parsing)
- `X-Request-ID` (si se usa para tracking)

**NO incluido:**
- ❌ Headers que no se usan
- ❌ Headers de debugging
- ❌ Headers de terceros no relevantes

#### **Contexto de Autenticación (ya resuelto)**

**Incluido:**
- ✅ `session` (después de `auth()`)
- ✅ `userId` / `studentId` (después de resolución)
- ✅ Roles/permissions (si aplica)

**Reglas:**
- Debe estar resuelto **antes** del contrato
- No forma parte del input del cliente
- Es parte del contexto de ejecución

### **📌 Requisitos Obligatorios**

Todo lo que está DENTRO del contrato DEBE:

1. ✅ **Tener shape explícito**
   - Schema definido (Zod)
   - Documentado

2. ✅ **Tener tipos**
   - TypeScript types
   - Inferidos del schema

3. ✅ **Tener validación runtime**
   - Zod validation
   - Ejecutada antes de lógica

---

## 3️⃣ Qué Queda FUERA del Contrato

### **❌ NO Forman Parte del Contrato**

#### **1. Objetos Request Completos**

**Excluido:**
- ❌ El objeto `Request` completo
- ❌ Propiedades internas de `Request`
- ❌ Métodos de `Request` no usados

**Razón:** El contrato es sobre **datos**, no sobre objetos de infraestructura.

#### **2. Headers que No Afectan Lógica**

**Excluido:**
- ❌ `User-Agent`
- ❌ `Accept-Language` (si no se usa)
- ❌ `Referer`
- ❌ Headers de debugging

**Razón:** Si no afectan la lógica, no son parte del contrato.

#### **3. Cookies No Usadas**

**Excluido:**
- ❌ Cookies de analytics
- ❌ Cookies de terceros
- ❌ Cookies no relevantes

**Razón:** Solo cookies que afectan lógica (ej: session) son parte del contrato.

#### **4. Datos Derivados Internamente**

**Excluido:**
- ❌ Valores calculados
- ❌ Transformaciones internas
- ❌ Defaults aplicados

**Razón:** El contrato es sobre **input**, no sobre procesamiento interno.

#### **5. Defaults Implícitos**

**Excluido:**
- ❌ Valores por defecto no declarados
- ❌ Coerciones silenciosas
- ❌ "Si no viene, asumimos X"

**Razón:** El contrato debe ser explícito. Si hay defaults, deben estar declarados.

#### **6. Coerciones Silenciosas**

**Excluido:**
- ❌ `"123"` → `123` (sin validación)
- ❌ `null` → `undefined` (sin validación)
- ❌ `""` → `undefined` (sin validación)

**Razón:** Las conversiones deben ser explícitas y validadas.

### **📌 Regla Dura**

> **Si no está en el contrato, no existe.**

**Implicaciones:**
- ✅ No se puede usar datos no declarados
- ✅ No se puede asumir existencia
- ✅ No se puede inferir formato

---

## 4️⃣ Invariantes Fundamentales del Dominio

Estas invariantes se **congelan ahora**. No se discuten después. Son reglas absolutas.

### **🔒 Invariante 1 — Campos Inexistentes No Existen**

**Regla:**
> Si un campo no viene en el input → no se asume

**Implicaciones:**
- ❌ No hay defaults implícitos
- ❌ No hay "string vacía = undefined"
- ❌ No hay "si no viene, usamos X"
- ✅ Si se necesita un valor, debe venir o estar explícitamente declarado como opcional

**Ejemplo:**
```typescript
// ❌ MAL
const name = formData.get('name') || 'Usuario Anónimo' // Default implícito

// ✅ BIEN
const schema = z.object({
  name: z.string().optional() // Explícito
})
```

### **🔒 Invariante 2 — Campos Extra Están Prohibidos**

**Regla:**
> Input con campos no declarados → rechazo inmediato

**Implicaciones:**
- ❌ No se ignoran campos extra
- ❌ No se "pasan de largo"
- ✅ Se rechaza con error 400
- ✅ El error debe ser claro: "Campo 'X' no permitido"

**Ejemplo:**
```typescript
// Schema
const schema = z.object({
  name: z.string(),
  email: z.string()
}).strict() // ← Rechaza campos extra

// ❌ Input con campo extra
{ name: "Juan", email: "juan@example.com", age: 25 }
// → Error 400: "Campo 'age' no permitido"
```

### **🔒 Invariante 3 — Tipos Inválidos No Entran al Sistema**

**Regla:**
> Conversión explícita o nada. No se aceptan tipos ambiguos.

**Implicaciones:**
- ❌ `number | string` no aceptado
- ❌ `unknown` no permitido
- ❌ `any` prohibido
- ✅ Tipos explícitos y estrictos
- ✅ Conversiones validadas

**Ejemplo:**
```typescript
// ❌ MAL
const age = formData.get('age') // string | null
const ageNum = parseInt(age) // Puede ser NaN

// ✅ BIEN
const schema = z.object({
  age: z.string().transform((val) => {
    const num = parseInt(val, 10)
    if (isNaN(num)) throw new Error('age debe ser número')
    return num
  })
})
```

### **🔒 Invariante 4 — Contrato Único por Endpoint**

**Regla:**
> Un endpoint = un contrato. No variantes implícitas.

**Implicaciones:**
- ❌ No "si viene X entonces el contrato es Y"
- ❌ No variantes basadas en headers
- ❌ No contratos condicionales
- ✅ Un schema por endpoint
- ✅ Si hay variantes, son endpoints diferentes

**Ejemplo:**
```typescript
// ❌ MAL
if (request.headers.get('Content-Type') === 'application/json') {
  // Contrato A
} else {
  // Contrato B
}

// ✅ BIEN
// Endpoint A: POST /api/notes (JSON)
// Endpoint B: POST /api/notes/form (FormData)
```

### **🔒 Invariante 5 — El Contrato Se Valida Antes de Toda Lógica**

**Regla:**
> La validación ocurre **antes** de cualquier operación.

**Orden estricto:**
1. ✅ Parse del input (FormData/JSON)
2. ✅ Validación del contrato (Zod)
3. ✅ Si falla → Error 400 (sin side effects)
4. ✅ Si pasa → Lógica de dominio

**Prohibido antes de validación:**
- ❌ Acceso a base de datos
- ❌ Llamadas a servicios
- ❌ Side effects (logs, métricas, etc.)
- ❌ Transformaciones de datos

**Ejemplo:**
```typescript
// ❌ MAL
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const name = formData.get('name')
  
  // ❌ Lógica antes de validar
  await logRequest(name) // Side effect
  const user = await db.user.findFirst() // DB access
  
  // Validación después
  if (!name) return error()
}

// ✅ BIEN
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  
  // ✅ Validación primero
  const validation = schema.safeParse(formData)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }
  
  // ✅ Lógica después
  const { name } = validation.data
  await logRequest(name)
  const user = await db.user.findFirst()
}
```

---

## 5️⃣ Resultado Esperado del Paso 8.1

Al cerrar este sub-paso, el sistema cumple:

### **📐 El Borde de Entrada Está Definido**

- ✅ Punto exacto donde nace el contrato identificado
- ✅ Punto exacto donde termina el contrato identificado
- ✅ No hay ambigüedad sobre qué es input y qué no

### **🔒 Estados Inválidos No Pueden Avanzar**

- ✅ Datos inválidos se rechazan antes de cualquier lógica
- ✅ No hay "paso silencioso" de datos inválidos
- ✅ Errores son claros y específicos

### **🧠 Todos los Endpoints Comparten un Patrón**

- ✅ Mismo flujo de validación
- ✅ Mismo manejo de errores
- ✅ Misma estructura de código
- ✅ Replicable a los 200+ endpoints

### **🧪 El Contrato Es Testeable**

- ✅ Se puede testear la validación independientemente
- ✅ Se puede testear con datos inválidos
- ✅ Se puede testear con datos válidos
- ✅ Tests son claros y mantenibles

### **🔁 El Patrón Es Replicable**

- ✅ Se puede aplicar a cualquier endpoint nuevo
- ✅ Se puede migrar endpoints existentes
- ✅ No requiere decisiones ad-hoc por endpoint

---

## 📋 Checklist de Cumplimiento

Antes de pasar al Paso 8.2, verificar:

- [ ] ✅ El borde HTTP está claramente definido
- [ ] ✅ Qué datos están DENTRO está documentado
- [ ] ✅ Qué datos están FUERA está documentado
- [ ] ✅ Las 5 invariantes están congeladas
- [ ] ✅ El patrón es replicable
- [ ] ✅ El patrón es testeable
- [ ] ✅ No hay ambigüedades

---

## 🎯 Siguiente Movimiento (Paso 8.2)

Una vez que este perímetro esté congelado, el siguiente paso será:

**Paso 8.2:** Implementar el patrón de validación del contrato

- Crear utilities de validación
- Implementar schema base
- Crear helpers de validación
- Aplicar a un endpoint de ejemplo

---

**Fecha:** 2026-01-10  
**Estado:** ✅ Perímetro definido y congelado  
**Próximo:** Paso 8.2 - Implementación del patrón
