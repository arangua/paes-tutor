# 🔧 Solución: Problema de Credenciales en Tests E2E

**Fecha:** 2025-01-28  
**Problema:** Los tests E2E fallan porque las credenciales no funcionan

---

## 🔍 Diagnóstico

### **Credenciales Esperadas:**
- **Email:** `matias@paestutor.com`
- **Password:** `password123`

### **Posibles Causas:**
1. ❌ El seed no se ejecutó → El usuario no existe en la base de datos
2. ❌ La base de datos está vacía o corrupta
3. ❌ El email está en mayúsculas o tiene espacios
4. ❌ La contraseña fue cambiada manualmente

---

## ✅ Solución Paso a Paso

### **1. Verificar que el Seed se Ejecutó**

```bash
# Ejecutar el seed para crear el usuario de prueba
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

### **2. Verificar que el Usuario Existe**

**Opción A: Usar Prisma Studio**
```bash
npx prisma studio
```
- Abrir la tabla `User`
- Buscar `matias@paestutor.com`
- Verificar que existe y tiene un `password` hasheado

**Opción B: Verificar con SQL**
```bash
# Si usas SQLite
sqlite3 prisma/paes.db "SELECT email, name FROM User WHERE email = 'matias@paestutor.com';"
```

### **3. Verificar la Contraseña**

La contraseña debe estar hasheada con bcrypt. El seed usa:
```typescript
const hashedPassword = await bcrypt.hash('password123', 10)
```

Si el usuario existe pero la contraseña no funciona:
- El hash puede estar corrupto
- La contraseña puede haber sido cambiada manualmente

**Solución:** Ejecutar el seed nuevamente (limpiará y recreará el usuario)

### **4. Verificar Normalización de Email**

La autenticación normaliza el email a minúsculas:
```typescript
const normalizedEmail = credentials.email.trim().toLowerCase()
```

**Importante:** 
- `matias@paestutor.com` ✅ (correcto)
- `Matias@Paestutor.com` ✅ (se normaliza correctamente)
- ` matias@paestutor.com ` ✅ (se normaliza correctamente)

---

## 🧪 Verificar Manualmente

### **1. Probar Login en el Navegador**

1. Ir a `http://localhost:3000/auth/signin`
2. Intentar login con:
   - Email: `matias@paestutor.com`
   - Password: `password123`
3. Si falla, verificar los logs del servidor

### **2. Verificar Logs del Servidor**

Los logs deberían mostrar:
```
[DEBUG] Intentando autenticar usuario { email: 'matias@paestutor.com' }
[DEBUG] Usuario encontrado { userId: '...' }
[DEBUG] Autenticación exitosa
```

Si ves:
```
[WARN] Usuario no encontrado { email: 'matias@paestutor.com' }
```
→ El usuario no existe, ejecutar seed

Si ves:
```
[WARN] Contraseña inválida { userId: '...' }
```
→ La contraseña no coincide, ejecutar seed nuevamente

---

## 🔧 Soluciones Comunes

### **Problema 1: Usuario No Existe**

**Síntomas:**
- Error: "Usuario no encontrado"
- Tests fallan en `authenticatedPage` fixture

**Solución:**
```bash
# Ejecutar seed
npx prisma db seed

# Verificar
npx prisma studio
```

### **Problema 2: Contraseña Incorrecta**

**Síntomas:**
- Error: "Credenciales inválidas"
- Login falla en el navegador

**Solución:**
```bash
# Recrear usuario con seed
npx prisma db seed
```

### **Problema 3: Base de Datos Corrupta**

**Síntomas:**
- Errores de conexión
- Datos inconsistentes

**Solución:**
```bash
# Resetear base de datos
npx prisma migrate reset

# Ejecutar seed
npx prisma db seed
```

### **Problema 4: Email con Mayúsculas**

**Síntomas:**
- Login funciona manualmente pero no en tests
- Tests usan email diferente

**Solución:**
- Verificar que los tests usan `matias@paestutor.com` (minúsculas)
- La autenticación normaliza automáticamente, pero es mejor usar minúsculas

---

## 📋 Checklist de Verificación

Antes de ejecutar tests E2E, verificar:

- [ ] El seed se ejecutó correctamente (`npx prisma db seed`)
- [ ] El usuario `matias@paestutor.com` existe en la base de datos
- [ ] El usuario tiene un `password` hasheado (no null)
- [ ] El usuario tiene un `student` asociado
- [ ] El login funciona manualmente en el navegador
- [ ] Los tests usan las credenciales correctas:
  - Email: `matias@paestutor.com`
  - Password: `password123`

---

## 🚀 Comando Rápido

Para resetear todo y empezar de nuevo:

```bash
# Resetear base de datos y ejecutar seed
npx prisma migrate reset --skip-seed
npx prisma db seed
```

---

## 📝 Notas

- El seed limpia toda la base de datos antes de crear datos nuevos
- El usuario se crea con password hasheado con bcrypt (10 rounds)
- La autenticación normaliza emails a minúsculas automáticamente
- Los tests capturan screenshots cuando falla el login (ver `test-results/login-error.png`)

---

**Documento generado:** 2025-01-28  
**Versión:** 1.0.0  
**Estado:** ✅ Guía completa de solución

