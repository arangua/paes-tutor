# 🔍 Cómo Verificar que los Eventos Aparecen en Sentry

## 📋 Pasos para Verificar en Sentry

### Paso 1: Abrir Sentry

1. Abre tu navegador
2. Ve a [https://sentry.io](https://sentry.io)
3. Inicia sesión con tus credenciales
4. Selecciona tu proyecto **`paes-tutor`**

### Paso 2: Ir a Discover

1. En el menú lateral izquierdo, busca **"Discover"**
2. Haz clic en **"Discover"** o **"Discover & Analytics"**

### Paso 3: Buscar Eventos

1. En la barra de búsqueda (arriba), escribe:
   ```
   smoke_test:true
   ```
2. **Importante:** Usa dos puntos (`:`) no un signo igual (`=`)

### Paso 4: Seleccionar Rango de Tiempo

1. En el selector de tiempo (arriba a la derecha), selecciona:
   - **"Last 1 hour"** (recomendado para eventos recientes)
   - O **"Last 24 hours"** (si el evento fue hace más tiempo)

### Paso 5: Ejecutar Búsqueda

1. Haz clic en **"Run Query"** o presiona **Enter**
2. Espera a que se carguen los resultados

### Paso 6: Verificar Resultados

Si los eventos aparecen, deberías ver:

- **Message:** `SENTRY_SMOKE_TEST`
- **Tags:** `smoke_test:true`
- **Level:** `error`
- **Timestamp:** Reciente (últimos minutos)
- **Event ID:** Un ID como `fb8610c1c2f740b79b2b9d00a157fe9c`

---

## ✅ Si Ves Eventos

¡**Sentry está funcionando correctamente!** 🎉

Los eventos se están enviando y recibiendo correctamente.

---

## ❌ Si NO Ves Eventos

### Verificación 1: DSN Correcto

1. En Sentry, ve a **Settings** → **Projects** → **Client Keys (DSN)**
2. Copia el DSN completo
3. Compara con el DSN en tu `.env.local`
4. Deben ser **exactamente iguales** (sin espacios, sin comillas)

### Verificación 2: Proyecto Activo

1. En Sentry, ve a **Settings** → **Projects** → **General**
2. Verifica que el proyecto esté **activo**
3. Verifica que no haya alcanzado el **límite de eventos**

### Verificación 3: Filtros de Entorno

1. En Sentry, ve a **Settings** → **Projects** → **Inbound Filters**
2. Verifica que no haya filtros bloqueando eventos de `development`
3. Si hay filtros, agrega una excepción para `smoke_test:true`

### Verificación 4: Logs del Servidor

Revisa la terminal donde corre `npm run dev`. Deberías ver:

```
[Sentry Server] Inicializado correctamente
[Sentry Server] DSN configurado: https://...
[Sentry Server] Enviando evento: { ... }
[Sentry Server] Evento de smoke test detectado, asegurando envío
```

**Si NO ves estos mensajes:**
- Sentry no se está inicializando
- Reinicia el servidor después de verificar `.env.local`

**Si ves errores:**
- Copia el error completo
- Verifica la conectividad a internet
- Verifica que no haya firewall bloqueando

### Verificación 5: Esperar Más Tiempo

Los eventos pueden tardar hasta **5-10 minutos** en aparecer, especialmente en desarrollo local.

1. Espera 5-10 minutos después del smoke test
2. Busca de nuevo usando `smoke_test:true`
3. Usa el rango **"Last 24 hours"** para ver eventos más antiguos

---

## 🔧 Comandos Útiles

### Ejecutar Smoke Test

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/sentry-smoke" -Headers @{"x-smoke-key"="paes-sentry-smoke-2026"}
```

### Verificar Configuración

```powershell
.\verificar-sentry.ps1
```

---

## 📊 Qué Buscar en los Logs

### Logs Exitosos

```
[Sentry Server] Inicializado correctamente
[Sentry Server] DSN configurado: https://8b693cbc1d4cb1712be8...
[Sentry Server] Enviando evento: { message: 'SENTRY_SMOKE_TEST', ... }
[Sentry Server] Evento de smoke test detectado, asegurando envío
[Sentry Server] Evento enviado exitosamente: { statusCode: 200, eventId: '...' }
```

### Logs con Problemas

```
[Sentry Server] No se recibió respuesta del servidor de Sentry
```

O ningún mensaje de Sentry (no se inicializó).

---

## 🎯 Resumen

1. **Busca en Sentry:** `smoke_test:true` en Discover
2. **Espera 2-5 minutos** después del smoke test
3. **Revisa los logs** del servidor para confirmar envío
4. **Verifica el DSN** si no aparecen eventos después de 10 minutos

---

**Última actualización:** 2026-01-10
