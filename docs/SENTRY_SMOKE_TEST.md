# 🔍 Sentry Smoke Test Endpoint

## 📋 Descripción

Endpoint para verificar que Sentry está configurado y funcionando correctamente. Útil para:
- Verificar configuración de Sentry en diferentes entornos
- Probar que los errores se envían correctamente a Sentry
- Monitoreo automatizado de la integración con Sentry

## 🔗 Endpoint

```
GET /api/sentry-smoke
```

## 🔐 Autenticación

El endpoint requiere un header de autenticación para seguridad:

```
x-smoke-key: <SMOKE_TEST_KEY>
```

Donde `SMOKE_TEST_KEY` debe coincidir con la variable de entorno `SMOKE_TEST_KEY`.

## 📝 Variables de Entorno Requeridas

### Mínimas
```env
SMOKE_TEST_KEY=tu-clave-secreta-aqui
```

### Para Probar Sentry
```env
SMOKE_TEST_KEY=tu-clave-secreta-aqui
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

## 📤 Respuestas

### Sentry Deshabilitado
Cuando `SENTRY_DSN` no está configurado:

```json
{
  "ok": true,
  "sentry": "disabled",
  "timestamp": "2025-01-28T21:47:34.123Z"
}
```

**Status:** `200 OK`

### Sentry Habilitado
Cuando `SENTRY_DSN` está configurado y el error de prueba se envía:

```json
{
  "ok": true,
  "sentry": "enabled",
  "timestamp": "2025-01-28T21:47:34.123Z"
}
```

**Status:** `200 OK`

### Error de Autenticación
Cuando la clave no es válida o no se proporciona:

```json
{
  "error": "No autorizado"
}
```

**Status:** `403 Forbidden`

### Configuración No Disponible
Cuando `SMOKE_TEST_KEY` no está configurado:

```json
{
  "error": "Configuración de smoke test no disponible"
}
```

**Status:** `503 Service Unavailable`

## 🚀 Ejemplos de Uso

### cURL

```bash
# Con Sentry configurado
curl -X GET http://localhost:3000/api/sentry-smoke \
  -H "x-smoke-key: tu-clave-secreta-aqui"

# Respuesta esperada:
# {
#   "ok": true,
#   "sentry": "enabled",
#   "timestamp": "2025-01-28T21:47:34.123Z"
# }
```

### PowerShell

```powershell
# Con Sentry configurado
$headers = @{
    "x-smoke-key" = "tu-clave-secreta-aqui"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/sentry-smoke" `
    -Method GET `
    -Headers $headers
```

### JavaScript/TypeScript

```typescript
const response = await fetch('http://localhost:3000/api/sentry-smoke', {
  method: 'GET',
  headers: {
    'x-smoke-key': process.env.SMOKE_TEST_KEY || 'tu-clave-secreta-aqui',
  },
})

const data = await response.json()
console.log(data)
// { ok: true, sentry: 'enabled', timestamp: '...' }
```

## 🔍 Verificación en Sentry

Después de llamar al endpoint con Sentry habilitado:

1. Ve a tu proyecto en Sentry
2. Navega a **Issues**
3. Busca un error con el mensaje: `SENTRY_SMOKE_TEST`
4. Verifica que tenga el tag `smoke_test: true`
5. Verifica que tenga el tag `endpoint: /api/sentry-smoke`

## ⚠️ Seguridad

- **Nunca expongas `SMOKE_TEST_KEY`** en el código o en logs
- Usa una clave fuerte y única
- No uses este endpoint en producción sin protección adicional (rate limiting, IP whitelist, etc.)
- Considera agregar rate limiting específico para este endpoint

## 🧪 Tests

El endpoint incluye tests completos que verifican:
- ✅ Validación de autenticación
- ✅ Respuesta cuando Sentry está deshabilitado
- ✅ Respuesta cuando Sentry está habilitado
- ✅ Manejo de errores de Sentry
- ✅ Manejo de errores inesperados

Ejecutar tests:
```bash
npm test src/app/api/sentry-smoke/route.test.ts
```

## 📚 Integración con Monitoreo

Este endpoint puede ser usado por:
- **Health checks** de load balancers
- **Monitoreo automatizado** (ej: UptimeRobot, Pingdom)
- **CI/CD pipelines** para verificar configuración
- **Scripts de deployment** para validar configuración

### Ejemplo de Health Check

```bash
#!/bin/bash
SMOKE_KEY="tu-clave-secreta"
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "x-smoke-key: $SMOKE_KEY" \
  http://localhost:3000/api/sentry-smoke)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Sentry smoke test passed"
  exit 0
else
  echo "❌ Sentry smoke test failed: $HTTP_CODE"
  echo "$BODY"
  exit 1
fi
```

---

**Última actualización:** 2025-01-28
