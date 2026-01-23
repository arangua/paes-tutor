# 🔍 Resumen: Problema de Credenciales en Tests E2E

**Fecha:** 2025-01-28  
**Problema:** Tests E2E fallan por credenciales inválidas

---

## 🎯 Problema Identificado

Los tests E2E están fallando porque:
1. **El usuario de prueba no existe en la base de datos**
2. **El seed no se ejecutó** o se ejecutó en otra ubicación
3. **Hay múltiples bases de datos** (principal + temporales de tests)

---

## 📊 Estado Actual

### **Base de Datos Principal:**
- **Ubicación:** `C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor\paes.db`
- **Tamaño:** 815,104 bytes (~815 KB)
- **Última modificación:** 03-01-2026 6:40:38

### **Bases de Datos Temporales:**
- `.stryker-tmp\sandbox-41WGP7\paes.db` (tests de mutación)
- `.stryker-tmp\sandbox-NX0dIM\paes.db` (tests de mutación)
- ⚠️ Estas NO son el problema, son temporales

### **Credenciales Esperadas:**
- **Email:** `matias@paestutor.com`
- **Password:** `password123`

---

## ✅ Solución Inmediata

### **Paso 1: Ejecutar Seed**

```bash
# Asegurar que estamos en el directorio correcto
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"

# Ejecutar seed para crear el usuario
npx prisma db seed
```

**Salida esperada:**
```
🌱 Iniciando seed...
🧹 Limpiando base de datos existente...
✅ Base de datos limpiada
✅ Usuario y estudiante creados: Matías
📧 Email: matias@paestutor.com
🔑 Password: password123
```

### **Paso 2: Verificar Usuario**

```bash
# Abrir Prisma Studio
npx prisma studio
```

- Abrir tabla `User`
- Buscar `matias@paestutor.com`
- Verificar que existe y tiene `password` hasheado

### **Paso 3: Probar Login Manualmente**

1. Ir a `http://localhost:3000/auth/signin`
2. Login con:
   - Email: `matias@paestutor.com`
   - Password: `password123`
3. Debe redirigir al dashboard

### **Paso 4: Ejecutar Tests E2E**

```bash
# Ejecutar tests
npx playwright test e2e/recommendations.spec.ts e2e/practice.spec.ts --project=chromium
```

---

## 🔧 Si el Problema Persiste

### **Verificar Variables de Entorno**

```bash
# Verificar DATABASE_URL
# Debe apuntar a: file:./paes.db
```

### **Verificar Múltiples Bases de Datos**

Si hay múltiples bases de datos:
1. Identificar cuál es la principal (la más reciente)
2. Eliminar las demás (excepto las de `.stryker-tmp` que son temporales)
3. Asegurar que `.env` apunta a la correcta

### **Resetear Base de Datos**

```bash
# Resetear y ejecutar seed
npx prisma migrate reset --skip-seed
npx prisma db seed
```

---

## 📋 Checklist Final

Antes de ejecutar tests:

- [ ] Seed ejecutado correctamente
- [ ] Usuario `matias@paestutor.com` existe en la base de datos
- [ ] Login funciona manualmente en el navegador
- [ ] Base de datos principal es la correcta (815 KB, 03-01-2026)
- [ ] Variables de entorno apuntan a la base de datos correcta

---

**Documento generado:** 2025-01-28  
**Versión:** 1.0.0  
**Estado:** ✅ Guía de solución completa

