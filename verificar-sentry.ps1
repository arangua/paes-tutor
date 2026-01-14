# Script para verificar configuración de Sentry
# Uso: .\verificar-sentry.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificación de Configuración de Sentry" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar conectividad
Write-Host "1. Verificando conectividad a Sentry..." -ForegroundColor Yellow
try {
    $result = Test-NetConnection -ComputerName sentry.io -Port 443 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($result) {
        Write-Host "   ✓ Conexión a sentry.io:443 exitosa" -ForegroundColor Green
    } else {
        Write-Host "   ✗ No se puede conectar a sentry.io:443" -ForegroundColor Red
        Write-Host "     Verifica tu conexión a internet o firewall" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Error al verificar conectividad: $_" -ForegroundColor Red
}

Write-Host ""

# 2. Verificar archivo .env.local
Write-Host "2. Verificando archivo .env.local..." -ForegroundColor Yellow
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "   ✓ Archivo .env.local encontrado" -ForegroundColor Green
    
    $content = Get-Content $envFile -Raw
    $hasSentryDsn = $content -match 'SENTRY_DSN\s*='
    $hasNextPublicSentryDsn = $content -match 'NEXT_PUBLIC_SENTRY_DSN\s*='
    $hasSmokeKey = $content -match 'SMOKE_TEST_KEY\s*='
    
    if ($hasSentryDsn) {
        Write-Host "   ✓ SENTRY_DSN encontrado en .env.local" -ForegroundColor Green
        $dsnLine = ($content -split "`n" | Where-Object { $_ -match 'SENTRY_DSN\s*=' })[0]
        $dsnValue = ($dsnLine -split '=', 2)[1].Trim()
        if ($dsnValue -match '^https://.*@.*\.ingest\.sentry\.io/') {
            Write-Host "   ✓ Formato de DSN parece correcto" -ForegroundColor Green
            Write-Host "     DSN: $($dsnValue.Substring(0, [Math]::Min(50, $dsnValue.Length)))..." -ForegroundColor Gray
        } else {
            Write-Host "   ⚠ Formato de DSN puede ser incorrecto" -ForegroundColor Yellow
            Write-Host "     Debe ser: https://KEY@ORG.ingest.sentry.io/PROJECT_ID" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ✗ SENTRY_DSN NO encontrado en .env.local" -ForegroundColor Red
    }
    
    if ($hasNextPublicSentryDsn) {
        Write-Host "   ✓ NEXT_PUBLIC_SENTRY_DSN encontrado en .env.local" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ NEXT_PUBLIC_SENTRY_DSN NO encontrado (opcional pero recomendado)" -ForegroundColor Yellow
    }
    
    if ($hasSmokeKey) {
        Write-Host "   ✓ SMOKE_TEST_KEY encontrado en .env.local" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ SMOKE_TEST_KEY NO encontrado" -ForegroundColor Yellow
        Write-Host "     Agrega: SMOKE_TEST_KEY=paes-sentry-smoke-2026" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✗ Archivo .env.local NO encontrado" -ForegroundColor Red
    Write-Host "     Crea el archivo .env.local en la raíz del proyecto" -ForegroundColor Yellow
}

Write-Host ""

# 3. Verificar servidor corriendo
Write-Host "3. Verificando servidor..." -ForegroundColor Yellow
$port3000 = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
$port3001 = Test-NetConnection -ComputerName localhost -Port 3001 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($port3000) {
    Write-Host "   ✓ Servidor corriendo en puerto 3000" -ForegroundColor Green
    $port = 3000
} elseif ($port3001) {
    Write-Host "   ✓ Servidor corriendo en puerto 3001" -ForegroundColor Green
    $port = 3001
} else {
    Write-Host "   ✗ Servidor NO está corriendo" -ForegroundColor Red
    Write-Host "     Ejecuta: npm run dev" -ForegroundColor Yellow
    $port = $null
}

Write-Host ""

# 4. Probar endpoint
if ($port) {
    Write-Host "4. Probando endpoint de smoke test..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port/api/sentry-smoke" -Headers @{"x-smoke-key"="paes-sentry-smoke-2026"} -TimeoutSec 20 -UseBasicParsing -ErrorAction Stop
        $json = $response.Content | ConvertFrom-Json
        
        Write-Host "   ✓ Endpoint respondiendo" -ForegroundColor Green
        Write-Host "     OK: $($json.ok)" -ForegroundColor $(if ($json.ok) { "Green" } else { "Red" })
        Write-Host "     Sentry: $($json.sentry)" -ForegroundColor $(if ($json.sentry -eq "enabled") { "Green" } else { "Yellow" })
        Write-Host "     Event ID: $($json.eventId)" -ForegroundColor Cyan
        Write-Host "     Flushed: $($json.flushed)" -ForegroundColor $(if ($json.flushed) { "Green" } else { "Yellow" })
        
        if (-not $json.flushed) {
            Write-Host ""
            Write-Host "   ⚠ El evento no se envió inmediatamente (flushed: false)" -ForegroundColor Yellow
            Write-Host "     Esto puede ser normal. Espera 2-3 minutos y busca en Sentry:" -ForegroundColor Gray
            Write-Host "     1. Ve a sentry.io → tu proyecto" -ForegroundColor Gray
            Write-Host "     2. Haz clic en 'Discover'" -ForegroundColor Gray
            Write-Host "     3. Busca: smoke_test:true" -ForegroundColor Gray
            Write-Host "     4. Rango: Last 1 hour" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   ✗ Error al probar endpoint: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "4. No se puede probar endpoint (servidor no está corriendo)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resumen" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si Sentry muestra 'Waiting to receive first event':" -ForegroundColor Yellow
Write-Host "1. Verifica que el DSN sea correcto en .env.local" -ForegroundColor White
Write-Host "2. Reinicia el servidor después de cambiar .env.local" -ForegroundColor White
Write-Host "3. Revisa los logs del servidor para mensajes de Sentry" -ForegroundColor White
Write-Host "4. Espera 2-3 minutos y busca en Sentry usando: smoke_test:true" -ForegroundColor White
Write-Host ""
Write-Host "Para más información, consulta: SOLUCION_SENTRY_NO_RECIBE_EVENTOS.md" -ForegroundColor Cyan
