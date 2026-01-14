# 🔧 Guía Simple: Verificar que Sentry Funciona

## 📋 Paso 1: Verificar que las Variables de Entorno Estén Configuradas

### 1.1. Abre PowerShell en la carpeta del proyecto

```powershell
cd "c:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
```

### 1.2. Verifica que las variables estén configuradas

```powershell
# Verificar DSN del servidor
echo $env:SENTRY_DSN

# Verificar DSN del cliente
echo $env:NEXT_PUBLIC_SENTRY_DSN

# Verificar clave de smoke test
echo $env:SMOKE_TEST_KEY
```

### 1.3. Si no están configuradas, agrégalas

Abre el archivo `.env.local` (o créalo si no existe) y agrega:

```env
SENTRY_DSN=https://tu-dsn-aqui@tu-proyecto.ingest.sentry.io/tu-id
NEXT_PUBLIC_SENTRY_DSN=https://tu-dsn-aqui@tu-proyecto.ingest.sentry.io/tu-id
SMOKE_TEST_KEY=paes-sentry-smoke-2026
```

**Importante:** Reemplaza `tu-dsn-aqui` con tu DSN real de Sentry.

---

## 📋 Paso 2: Reiniciar el Servidor

### 2.1. Detén el servidor si está corriendo

Presiona `Ctrl + C` en la terminal donde está corriendo `npm run dev`

### 2.2. Inicia el servidor de nuevo

```powershell
npm run dev
```

**Espera** a que veas el mensaje: `Ready in X seconds`

---

## 📋 Paso 3: Probar el Endpoint de Smoke Test

### 3.1. Abre una nueva terminal de PowerShell

Mantén el servidor corriendo en una terminal y abre otra nueva.

### 3.2. Ejecuta el comando curl

```powershell
curl -H "x-smoke-key: paes-sentry-smoke-2026" http://localhost:3000/api/sentry-smoke
```

### 3.3. Revisa la respuesta

Deberías ver algo como esto:

```json
{
  "ok": true,
  "sentry": "enabled",
  "timestamp": "2026-01-28T...",
  "eventId": "abc123...",
  "flushed": true,
  "dsnConfigured": true,
  "dsnValid": true,
  "message": "Evento enviado exitosamente a Sentry..."
}
```

**Lo importante:** Verifica que `"flushed": true`

- ✅ Si es `true`: El evento se envió correctamente
- ❌ Si es `false`: Hay un problema (sigue al Paso 4)

---

## 📋 Paso 4: Buscar el Evento en Sentry

### 4.1. Ve a tu proyecto en Sentry

1. Abre tu navegador
2. Ve a [https://sentry.io](https://sentry.io)
3. Inicia sesión
4. Selecciona tu proyecto `paes-tutor`

### 4.2. Busca el evento por tag

1. En el menú lateral, haz clic en **"Discover"**
2. En la barra de búsqueda, escribe: `smoke_test:true`
3. Selecciona el rango de tiempo: **"Last 1 hour"** o **"Last 24 hours"**
4. Haz clic en **"Run Query"** o presiona Enter

### 4.3. Verifica los resultados

- ✅ Si ves eventos: ¡Sentry está funcionando correctamente!
- ❌ Si no ves eventos: Sigue al Paso 5

---

## 📋 Paso 5: Verificar los Logs del Servidor

### 5.1. Revisa la terminal donde está corriendo `npm run dev`

Deberías ver mensajes como:

```
[Sentry Server] Inicializado correctamente
[Sentry Server] DSN configurado: https://...
[Sentry Server] Enviando evento: { ... }
[Sentry Server] Evento de smoke test detectado, asegurando envío
```

### 5.2. Si NO ves estos mensajes

Significa que Sentry no se está inicializando. Verifica:

1. Que `SENTRY_DSN` esté configurado correctamente
2. Que el DSN tenga el formato correcto: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
3. Que hayas reiniciado el servidor después de agregar las variables

---

## 📋 Paso 6: Probar desde el Navegador (Opcional)

### 6.1. Abre tu aplicación en el navegador

```
http://localhost:3000/sentry-example-page
```

### 6.2. Haz clic en los botones de prueba

1. Haz clic en **"Enviar Error de Prueba"** (Cliente)
2. Haz clic en **"Enviar Error de Prueba"** (Servidor)
3. Espera unos segundos

### 6.3. Verifica en Sentry

Ve a Sentry → Issues y busca los nuevos eventos

---

## 🆘 Solución de Problemas

### Problema: `flushed: false`

**Solución:**
1. Verifica que el DSN sea correcto
2. Verifica que no haya firewall bloqueando conexiones a `sentry.io`
3. Espera 2-3 minutos y busca el evento en Sentry (puede llegar más tarde)

### Problema: No veo eventos en Sentry

**Solución:**
1. Verifica que estés buscando en el proyecto correcto
2. Verifica que el tag sea `smoke_test:true` (con dos puntos)
3. Aumenta el rango de tiempo a "Last 24 hours"
4. Verifica que el DSN sea del proyecto correcto

### Problema: Error "No autorizado" al hacer curl

**Solución:**
1. Verifica que `SMOKE_TEST_KEY` esté configurado
2. Verifica que el header sea exactamente: `x-smoke-key: paes-sentry-smoke-2026`
3. Verifica que no haya espacios extra en el comando

---

## ✅ Checklist Final

Marca cada paso cuando lo completes:

- [ ] Variables de entorno configuradas (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SMOKE_TEST_KEY`)
- [ ] Servidor reiniciado después de configurar variables
- [ ] Comando curl ejecutado y muestra `"flushed": true`
- [ ] Evento encontrado en Sentry usando `smoke_test:true`
- [ ] Logs del servidor muestran mensajes de Sentry

---

## 📞 Si Nada Funciona

Si después de seguir todos los pasos no ves eventos en Sentry:

1. **Verifica el DSN:**
   - Ve a Sentry → Settings → Projects → [Tu Proyecto] → Client Keys (DSN)
   - Copia el DSN exacto
   - Asegúrate de que sea el mismo en `.env.local`

2. **Prueba con debug activado:**
   - En `sentry.server.config.ts`, cambia `debug: false` a `debug: true`
   - Reinicia el servidor
   - Revisa los logs para ver más información

3. **Verifica la conexión:**
   ```powershell
   # Prueba si puedes conectarte a Sentry
   curl https://sentry.io
   ```

---

## 🎯 Resumen Rápido

1. ✅ Configura variables de entorno
2. ✅ Reinicia el servidor
3. ✅ Ejecuta: `curl -H "x-smoke-key: paes-sentry-smoke-2026" http://localhost:3000/api/sentry-smoke`
4. ✅ Verifica que `flushed: true`
5. ✅ Busca en Sentry: `smoke_test:true`

¡Listo! 🎉
