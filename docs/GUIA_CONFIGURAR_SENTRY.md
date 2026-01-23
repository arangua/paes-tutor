# 🔧 Guía: Configurar Sentry para PAES Tutor

## 📋 Estado Actual

✅ **Código preparado:**
- `sentry.client.config.ts` - Configuración para cliente (browser)
- `sentry.server.config.ts` - Configuración para servidor (Node.js)
- `@sentry/nextjs` instalado (v10.32.1)

❌ **Pendiente:**
- Crear proyecto en Sentry
- Obtener DSN
- Configurar variables de entorno

---

## 🚀 Pasos para Configurar Sentry

### Paso 1: Crear Cuenta en Sentry (Si No Tienes)

1. Ve a [https://sentry.io/signup/](https://sentry.io/signup/)
2. Crea una cuenta (puedes usar GitHub, Google, etc.)
3. Elige el plan **Developer** (gratis hasta 5,000 eventos/mes)

### Paso 2: Crear Proyecto en Sentry

1. **Inicia sesión en Sentry**
2. **Crea una nueva organización** (si es la primera vez):
   - Haz clic en "Create Organization"
   - Elige un nombre (ej: "paes-tutor" o tu nombre)
   - Selecciona el plan Developer (gratis)

3. **Crea un nuevo proyecto:**
   - Haz clic en "Create Project" o el botón "+" en el dashboard
   - Selecciona la plataforma: **"Next.js"**
   - Ingresa el nombre del proyecto: **"paes-tutor"** (o el que prefieras)
   - Selecciona tu organización
   - Haz clic en "Create Project"

### Paso 3: Obtener el DSN

Después de crear el proyecto, Sentry te mostrará una página de configuración con el **DSN**.

El DSN tiene este formato:
```
https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

**Dónde encontrar el DSN:**
1. En la página de configuración inicial del proyecto
2. O ve a: **Settings → Projects → [Tu Proyecto] → Client Keys (DSN)**
3. Copia el DSN (puedes hacer clic en "Show DSN" si está oculto)

### Paso 4: Configurar Variables de Entorno

Necesitas agregar las siguientes variables de entorno:

#### Para Desarrollo Local (.env.local)

Crea o edita el archivo `.env.local` en la raíz del proyecto:

```env
# Sentry Configuration
# DSN para el cliente (browser) - debe empezar con NEXT_PUBLIC_
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# DSN para el servidor (Node.js)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Opcional: Para upload de source maps (recomendado para producción)
SENTRY_AUTH_TOKEN=tu_auth_token_aqui
SENTRY_ORG=tu-organizacion
SENTRY_PROJECT=paes-tutor
```

**Nota:** Usa el **mismo DSN** para ambas variables (`NEXT_PUBLIC_SENTRY_DSN` y `SENTRY_DSN`).

#### Para Producción (Vercel/Plataforma de Despliegue)

1. **Vercel:**
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agrega las mismas variables:
     - `NEXT_PUBLIC_SENTRY_DSN`
     - `SENTRY_DSN`
     - `SENTRY_AUTH_TOKEN` (opcional)
     - `SENTRY_ORG` (opcional)
     - `SENTRY_PROJECT` (opcional)

2. **Otras plataformas:**
   - Agrega las variables de entorno en la configuración de tu plataforma

### Paso 5: Obtener Auth Token (Opcional, para Source Maps)

Si quieres subir source maps automáticamente a Sentry:

1. Ve a: **Settings → Auth Tokens** en Sentry
2. Haz clic en "Create New Token"
3. Selecciona los permisos:
   - ✅ `project:read`
   - ✅ `project:releases`
   - ✅ `org:read`
4. Copia el token generado
5. Agrégala como `SENTRY_AUTH_TOKEN` en tus variables de entorno

### Paso 6: Verificar Configuración

1. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Verifica que Sentry se inicialice:**
   - Abre la consola del navegador
   - No deberías ver errores relacionados con Sentry
   - Si ves errores, verifica que el DSN sea correcto

3. **Prueba enviar un error de prueba:**
   - Puedes crear un botón temporal que lance un error:
   ```typescript
   // En algún componente de prueba
   <button onClick={() => {
     throw new Error('Test error para Sentry')
   }}>
     Test Sentry
   </button>
   ```
   - Haz clic en el botón
   - Ve a Sentry → Issues y deberías ver el error

---

## 📝 Variables de Entorno Requeridas

### Mínimas (Requeridas)
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Opcionales (Para Source Maps)
```env
SENTRY_AUTH_TOKEN=tu_auth_token
SENTRY_ORG=tu-organizacion
SENTRY_PROJECT=paes-tutor
```

---

## 🔍 Verificar que Funciona

### Método 1: Consola del Navegador

1. Abre las DevTools (F12)
2. Ve a la pestaña "Console"
3. Ejecuta:
   ```javascript
   // Verificar que Sentry está inicializado
   console.log(window.Sentry)
   ```
   - Si ves un objeto, Sentry está funcionando
   - Si ves `undefined`, verifica las variables de entorno

### Método 2: Enviar Error de Prueba

1. En algún componente, agrega temporalmente:
   ```typescript
   import * as Sentry from '@sentry/nextjs'
   
   // En un botón o función
   const testSentry = () => {
     Sentry.captureException(new Error('Test error desde PAES Tutor'))
   }
   ```

2. Ejecuta la función
3. Ve a Sentry → Issues
4. Deberías ver el error en la lista

---

## 🎯 Configuración Avanzada (Opcional)

### Habilitar Performance Monitoring

Edita `sentry.client.config.ts` y `sentry.server.config.ts`:

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment,
  ...(release && { release }),
  debug: false,
  // Cambiar de 0 a un valor entre 0 y 1 (ej: 0.1 = 10% de requests)
  tracesSampleRate: 0.1, // 10% de las requests
})
```

### Configurar Entornos

Sentry detecta automáticamente el entorno desde:
- `VERCEL_ENV` (si estás en Vercel)
- `NODE_ENV` (si no estás en Vercel)

Los entornos comunes son:
- `development` - Desarrollo local
- `preview` - Preview en Vercel
- `production` - Producción

---

## 🆘 Solución de Problemas

### Sentry no se inicializa

1. **Verifica las variables de entorno:**
   ```bash
   # En PowerShell
   echo $env:NEXT_PUBLIC_SENTRY_DSN
   ```

2. **Verifica que el DSN sea correcto:**
   - Debe empezar con `https://`
   - Debe tener el formato: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

3. **Reinicia el servidor de desarrollo**

### No veo errores en Sentry

1. **Verifica que el DSN sea correcto**
2. **Verifica que no estés en modo desarrollo con errores silenciados**
3. **Revisa la consola del navegador** para ver si hay errores de conexión
4. **Verifica el firewall/VPN** - Sentry necesita conexión a internet

### Errores de CORS

Si ves errores de CORS, verifica que:
- El DSN sea correcto
- No haya problemas de red/firewall
- Sentry esté accesible desde tu ubicación

---

## 📚 Recursos

- [Documentación oficial de Sentry para Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Guía de configuración de DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)
- [Configuración de Source Maps](https://docs.sentry.io/platforms/javascript/sourcemaps/)

---

## ✅ Checklist de Configuración

- [ ] Cuenta creada en Sentry
- [ ] Organización creada
- [ ] Proyecto "Next.js" creado
- [ ] DSN copiado
- [ ] Variables de entorno configuradas (`.env.local`)
- [ ] Variables de entorno configuradas en producción (Vercel/otra plataforma)
- [ ] Servidor reiniciado
- [ ] Error de prueba enviado y verificado en Sentry
- [ ] (Opcional) Auth Token configurado para source maps

---

**Última actualización:** 2025-01-28
