# 🔐 Variables de Entorno de Producción

**Fecha:** 2025-01-28  
**Estado:** ✅ **COMPLETADO**  
**Prioridad:** 🔴 **CRÍTICA**

---

## 📋 Resumen

Este documento detalla todas las variables de entorno requeridas para el despliegue en producción de PAES Tutor.

---

## 🔴 Variables Críticas (REQUERIDAS)

### **1. DATABASE_URL**
- **Descripción:** URL de conexión a la base de datos SQLite
- **Formato:** `file:./prisma/production.db` (relativa) o `file:/ruta/absoluta/production.db` (absoluta)
- **Ejemplo Desarrollo:** `file:./prisma/dev.db`
- **Ejemplo Producción:** `file:/var/lib/paes-tutor/production.db`
- **Validación:** Requerida, validada por Prisma
- **Notas:** 
  - En producción, usar ruta absoluta
  - Asegurar permisos de lectura/escritura en el directorio

### **2. NEXTAUTH_SECRET**
- **Descripción:** Secret para firmar tokens de sesión de NextAuth.js
- **Longitud mínima:** 32 caracteres (recomendado)
- **Generación:** `openssl rand -base64 32`
- **Validación:** 
  - Requerida en producción (la app no iniciará sin ella)
  - Validada al iniciar la aplicación
- **Notas:**
  - Debe ser único y aleatorio
  - No compartir entre ambientes
  - Rotar periódicamente

### **3. NEXTAUTH_URL**
- **Descripción:** URL base de la aplicación
- **Formato:** `https://your-domain.com` (sin trailing slash)
- **Ejemplo:** `https://paestutor.com`
- **Validación:** Requerida por NextAuth.js
- **Notas:**
  - Debe coincidir con el dominio de producción
  - Usar HTTPS en producción

### **4. ENCRYPTION_KEY**
- **Descripción:** Clave de encriptación para datos sensibles (API keys, etc.)
- **Longitud mínima:** 32 caracteres (recomendado)
- **Generación:** `openssl rand -base64 32`
- **Validación:**
  - Requerida en producción (la app no iniciará sin ella)
  - Validada que tenga mínimo 32 caracteres
  - Validada que no use prefijos de desarrollo/test en producción
- **Notas:**
  - Debe ser diferente de `NEXTAUTH_SECRET`
  - Usada para encriptar API keys de usuarios
  - No cambiar después de encriptar datos (requiere migración)

---

## 🟡 Variables Importantes (Recomendadas)

### **5. UPSTASH_REDIS_REST_URL**
- **Descripción:** URL de la API REST de Upstash Redis para rate limiting
- **Formato:** `https://your-instance.upstash.io`
- **Obtener desde:** https://console.upstash.com/
- **Validación:** Opcional, pero recomendada
- **Notas:**
  - Sin Redis, el rate limiting funciona con memoria local (menos robusto)
  - Redis distribuye el rate limiting entre instancias

### **6. UPSTASH_REDIS_REST_TOKEN**
- **Descripción:** Token de autenticación de Upstash Redis
- **Obtener desde:** https://console.upstash.com/
- **Validación:** Opcional, pero recomendada si se usa Redis
- **Notas:**
  - Debe usarse junto con `UPSTASH_REDIS_REST_URL`
  - Mantener seguro y no compartir

---

## 🟢 Variables Opcionales (Funcionalidades Adicionales)

### **7. OPENAI_API_KEY**
- **Descripción:** API key de OpenAI para funcionalidades de AI Tutor
- **Formato:** `sk-...`
- **Obtener desde:** https://platform.openai.com/api-keys
- **Validación:** Opcional
- **Notas:**
  - Solo requerida si se usan funcionalidades de AI Tutor
  - Si no está configurada, esas funcionalidades estarán deshabilitadas

### **8. GOOGLE_AI_API_KEY**
- **Descripción:** API key de Google AI (alternativa a OpenAI)
- **Obtener desde:** https://makersuite.google.com/app/apikey
- **Validación:** Opcional
- **Notas:**
  - Solo requerida si se usan funcionalidades de AI Tutor con Google AI
  - Si no está configurada, se usará OpenAI (si está disponible)

---

## 🔧 Configuración de Entorno

### **9. NODE_ENV**
- **Descripción:** Entorno de ejecución
- **Valores:** `development`, `production`, `test`
- **Valor Producción:** `production`
- **Validación:** Requerida
- **Notas:**
  - Afecta el comportamiento de Next.js
  - En producción, habilita optimizaciones

---

## 📝 Instrucciones de Configuración

### **Paso 1: Crear archivo de variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.production.example .env.production
```

### **Paso 2: Generar secrets seguros**
```bash
# Generar NEXTAUTH_SECRET
openssl rand -base64 32

# Generar ENCRYPTION_KEY (debe ser diferente)
openssl rand -base64 32
```

### **Paso 3: Configurar variables críticas**
Editar `.env.production` y configurar:
- `DATABASE_URL` - Ruta absoluta a la base de datos
- `NEXTAUTH_SECRET` - Secret generado (mínimo 32 caracteres)
- `NEXTAUTH_URL` - URL de producción
- `ENCRYPTION_KEY` - Clave generada (mínimo 32 caracteres, diferente de NEXTAUTH_SECRET)

### **Paso 4: Configurar variables opcionales**
- `UPSTASH_REDIS_REST_URL` - Si se usa Redis
- `UPSTASH_REDIS_REST_TOKEN` - Si se usa Redis
- `OPENAI_API_KEY` - Si se usan funcionalidades de AI
- `GOOGLE_AI_API_KEY` - Si se usa Google AI

### **Paso 5: Validar configuración**
```bash
# Validar que todas las variables críticas están configuradas
npm run validate:secrets
```

---

## 🔒 Seguridad

### **Mejores Prácticas:**
1. ✅ **NUNCA** commitear `.env.production` al repositorio
2. ✅ Usar gestor de secrets (Vercel, AWS Secrets Manager, etc.)
3. ✅ Rotar secrets periódicamente (cada 3-6 meses)
4. ✅ Usar diferentes secrets para cada ambiente
5. ✅ Validar que `.env.production` está en `.gitignore`
6. ✅ No compartir secrets públicamente
7. ✅ Usar HTTPS en producción

### **Validaciones Implementadas:**
- ✅ `NEXTAUTH_SECRET` y `ENCRYPTION_KEY` son requeridas en producción
- ✅ `ENCRYPTION_KEY` debe tener mínimo 32 caracteres
- ✅ `ENCRYPTION_KEY` no puede usar prefijos de desarrollo/test en producción
- ✅ La aplicación NO iniciará si faltan variables críticas

---

## 🧪 Verificación

### **Verificar que variables están configuradas:**
```bash
# Verificar secrets
npm run validate:secrets

# Verificar tipos
npm run validate:types

# Verificar todo
npm run validate:all
```

### **Verificar que la aplicación inicia:**
```bash
# Build de producción
npm run build

# Iniciar en modo producción
npm start
```

---

## 📚 Referencias

- [NextAuth.js - Environment Variables](https://next-auth.js.org/configuration/options#environment-variables)
- [Next.js - Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Prisma - Connection URLs](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#connection-urls)

---

**Documento generado:** 2025-01-28  
**Versión:** 1.0.0  
**Estado:** ✅ **COMPLETADO**


