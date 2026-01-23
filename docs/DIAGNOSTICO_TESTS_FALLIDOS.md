# 🔍 Diagnóstico: Tests Fallidos en API de Versiones

**Fecha:** 2025-01-11  
**Problema:** 166 tests fallando con error 400 "El cuerpo de la solicitud no puede estar vacío"

---

## 🔍 Problema Identificado

### **Síntomas:**
- Tests esperan status 200 pero reciben 400
- Mensaje de error: "El cuerpo de la solicitud no puede estar vacío"
- Afecta múltiples endpoints:
  - `POST /api/notes/versions/export-bulk`
  - `POST /api/notes/versions/merge`
  - `POST /api/notes/versions/semantic-search`
  - `POST /api/notes/versions/compress`
  - `GET /api/notes/versions/timeline`

### **Causa Raíz:**
El problema está en cómo `NextRequest` maneja el body en el entorno de tests. Cuando se crea un `NextRequest` con:

```typescript
new NextRequest(url.toString(), {
  method: 'POST',
  body: JSON.stringify(data),
  headers: { 'Content-Type': 'application/json' }
})
```

El body puede no estar disponible cuando se llama a `request.json()` en el entorno de tests de Vitest.

---

## 🔧 Solución Propuesta

### **Opción 1: Ajustar `parseRequestBody` para tests**
Modificar `parseRequestBody` para detectar el entorno de tests y manejar el body de forma diferente.

### **Opción 2: Ajustar `createTestRequest`**
Modificar `createTestRequest` para crear requests de forma que funcionen correctamente en tests.

### **Opción 3: Mockear `request.json()`**
Mockear `request.json()` en los tests para que retorne el body correctamente.

---

## 📋 Archivos Afectados

1. `src/app/api/notes/versions/helpers.ts` - `parseRequestBody`
2. `src/app/api/notes/versions/__tests__/test-helpers.ts` - `createTestRequest`
3. Todos los archivos de test que usan `createTestRequest` con body

---

## ⚠️ Nota

Este es un problema conocido con NextRequest en entornos de tests. La solución más robusta sería ajustar cómo se crean los requests en los tests para que el body esté disponible cuando se llama a `request.json()`.
