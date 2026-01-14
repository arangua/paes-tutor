# Script para ejecutar el smoke test de Sentry
# Requiere que el servidor esté corriendo (npm run dev)

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Sentry Smoke Test" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar que el servidor esté corriendo
Write-Host "Verificando servidor..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Servidor corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor no está corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, inicia el servidor primero:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Obtener SMOKE_TEST_KEY de .env.local
$envLocal = ".env.local"
if (-not (Test-Path $envLocal)) {
    Write-Host "❌ .env.local no encontrado" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $envLocal -ErrorAction SilentlyContinue
$smokeKeyLine = $envContent | Where-Object { $_ -match "^SMOKE_TEST_KEY=" }

if (-not $smokeKeyLine) {
    Write-Host "❌ SMOKE_TEST_KEY no encontrado en .env.local" -ForegroundColor Red
    exit 1
}

$smokeKey = ($smokeKeyLine -split "=", 2)[1].Trim()

if ([string]::IsNullOrEmpty($smokeKey)) {
    Write-Host "❌ SMOKE_TEST_KEY está vacío" -ForegroundColor Red
    exit 1
}

Write-Host "Ejecutando smoke test..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "x-smoke-key" = $smokeKey
    }
    
    $result = Invoke-RestMethod -Uri "http://localhost:3000/api/sentry-smoke" -Method GET -Headers $headers -ErrorAction Stop
    
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✅ Smoke Test Exitoso!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "Resultado:" -ForegroundColor Yellow
    Write-Host "  ok: $($result.ok)" -ForegroundColor White
    Write-Host "  sentry: $($result.sentry)" -ForegroundColor White
    Write-Host "  timestamp: $($result.timestamp)" -ForegroundColor White
    Write-Host ""
    
    if ($result.sentry -eq "enabled") {
        Write-Host "✅ Sentry está habilitado" -ForegroundColor Green
        Write-Host "✅ El evento de prueba debería haberse enviado a Sentry" -ForegroundColor Green
        Write-Host ""
        Write-Host "Para verificar que Sentry recibió el evento:" -ForegroundColor Yellow
        Write-Host "1. Ve a https://sentry.io" -ForegroundColor White
        Write-Host "2. Navega a tu proyecto" -ForegroundColor White
        Write-Host "3. Ve a 'Issues'" -ForegroundColor White
        Write-Host "4. Busca un error con el mensaje: 'SENTRY_SMOKE_TEST'" -ForegroundColor White
        Write-Host "5. Verifica que tenga el tag: smoke_test: true" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "⚠️  Sentry está deshabilitado" -ForegroundColor Yellow
        Write-Host "   (SENTRY_DSN no está configurado en .env.local)" -ForegroundColor Yellow
        Write-Host ""
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ❌ Error al ejecutar smoke test" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    
    if ($statusCode -eq 403) {
        Write-Host "Error 403: Clave de autenticación inválida" -ForegroundColor Red
        Write-Host "Verifica que SMOKE_TEST_KEY en .env.local coincida con la clave usada" -ForegroundColor Yellow
    } elseif ($statusCode -eq 503) {
        Write-Host "Error 503: SMOKE_TEST_KEY no configurado" -ForegroundColor Red
        Write-Host "Agrega SMOKE_TEST_KEY a .env.local" -ForegroundColor Yellow
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    exit 1
}

Write-Host ""
