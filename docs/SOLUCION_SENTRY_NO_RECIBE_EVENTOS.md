# 🔧 Solución: Sentry No Recibe Eventos ("Waiting to receive first event")

## 📋 Diagnóstico

Si Sentry muestra "Waiting to receive first event to continue", significa que:
- ✅ El endpoint está funcionando (captura eventos)
- ✅ El DSN está configurado
- ❌ Los eventos NO están llegando a Sentry

## 🔍 Verificaciones Inmediatas

### 1. Verificar DSN Correcto

El DSN debe tener este formato:
```
https://[KEY]@[ORG].ingest.sentry.io/[PROJECT_ID]
```

**Verificar:**
1. Ve a tu proyecto en Sentry
2. Settings → Client Keys (DSN)
3. Copia el DSN completo
4. Asegúrate de que esté en `.env.local` como `SENTRY_DSN=...`

### 2. Verificar Conectividad

Ejecuta en PowerShell:
```powershell
Test-NetConnection sentry.io -Port 443
```

Si falla:
- Verifica tu conexión a internet
- Verifica que no haya firewall bloqueando
- Verifica que no haya proxy corporativo

### 3. Verificar Logs del Servidor

Revisa la terminal donde corre `npm run dev`. Deberías ver:

```
[Sentry Server] Inicializado correctamente
[Sentry Server] DSN configurado: https://...
[Sentry Server] Enviando evento: { ... }
[Sentry Server] Evento de smoke test detectado, asegurando envío
```

**Si NO ves estos mensajes:**
- Sentry no se está inicializando
- Verifica que `SENTRY_DSN` esté en `.env.local`
- Reinicia el servidor después de agregar la variable

### 4. Verificar Variables de Entorno

Asegúrate de que `.env.local` tenga:

```env
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SMOKE_TEST_KEY=paes-sentry-smoke-2026
```

**Importante:**
- Reinicia el servidor después de cambiar `.env.local`
- No uses comillas en el DSN
- No dejes espacios

## 🛠️ Soluciones Aplicadas

### 1. Timeout de Flush Aumentado

Se aumentó el timeout de flush de 10s a 20s para dar más tiempo al envío.

### 2. Más Intentos de Flush

Se aumentaron los intentos de 3 a 5 para mayor robustez.

### 3. Mejor Manejo de Errores

Se agregó try-catch alrededor del flush para capturar errores de transporte.

## 📊 Cómo Verificar que Funciona

### Paso 1: Ejecutar Smoke Test

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/sentry-smoke" -Headers @{"x-smoke-key"="paes-sentry-smoke-2026"}
```

### Paso 2: Revisar Logs del Servidor

Deberías ver:
- `[Sentry Server] Enviando evento:`
- `[Sentry Server] Evento de smoke test detectado`

### Paso 3: Buscar en Sentry

1. Ve a [sentry.io](https://sentry.io) → tu proyecto
2. Haz clic en **"Discover"**
3. Busca: `smoke_test:true`
4. Rango: **"Last 1 hour"**

**Si ves eventos:** ✅ Funciona correctamente  
**Si no ves eventos:** Sigue al siguiente paso

## 🚨 Si Aún No Funciona

### Verificar DSN Manualmente

1. Ve a Sentry → Settings → Client Keys (DSN)
2. Copia el DSN
3. Verifica que sea exactamente igual en `.env.local`
4. Reinicia el servidor

### Verificar Proyecto Activo

1. Ve a Sentry → Settings → General
2. Verifica que el proyecto esté activo
3. Verifica que no haya alcanzado el límite de eventos

### Verificar Filtros de Entorno

1. Ve a Sentry → Settings → Inbound Filters
2. Verifica que no haya filtros bloqueando eventos de "development"
3. Si hay filtros, agrega una excepción para `smoke_test:true`

### Probar con cURL Directo

```powershell
# Obtener el DSN de .env.local
$dsn = "TU_DSN_AQUI"

# Extraer partes del DSN
# Formato: https://KEY@ORG.ingest.sentry.io/PROJECT_ID
$match = $dsn -match 'https://([^@]+)@([^/]+)/(.+)'
if ($match) {
    $key = $matches[1]
    $host = $matches[2]
    $projectId = $matches[3]
    
    $url = "https://$host/api/$projectId/store/"
    
    $body = @{
        message = "Test desde PowerShell"
        level = "error"
        tags = @{
            smoke_test = "true"
        }
    } | ConvertTo-Json
    
    $headers = @{
        "X-Sentry-Auth" = "Sentry sentry_version=7, sentry_key=$key, sentry_client=test/1.0"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method POST -Body $body -Headers $headers
        Write-Host "✓ Evento enviado directamente: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

## 📝 Checklist Final

- [ ] DSN correcto en `.env.local`
- [ ] Variables de entorno cargadas (reiniciar servidor)
- [ ] Conectividad a `sentry.io:443` funciona
- [ ] Logs del servidor muestran inicialización de Sentry
- [ ] Logs muestran "Enviando evento"
- [ ] Buscado en Sentry usando `smoke_test:true`
- [ ] Esperado 2-3 minutos después del smoke test
- [ ] Verificado que el proyecto esté activo en Sentry

## 🎯 Próximos Pasos

Si después de todo esto aún no funciona:

1. **Verifica los logs del servidor** para errores específicos de transporte
2. **Prueba con un DSN de prueba** de otro proyecto de Sentry
3. **Verifica la versión de `@sentry/nextjs`** (debe ser compatible)
4. **Revisa si hay proxy/VPN** que pueda estar bloqueando

---

**Última actualización:** 2026-01-10
