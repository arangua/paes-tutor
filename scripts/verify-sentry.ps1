# Script de Verificación de Sentry
# Verifica si Sentry está configurado y recibiendo eventos

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Verificación de Configuración de Sentry" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar archivos de configuración
Write-Host "1️⃣ Verificando archivos de configuración..." -ForegroundColor Yellow

$sentryClient = Test-Path "sentry.client.config.ts"
$sentryServer = Test-Path "sentry.server.config.ts"
$sentrySmoke = Test-Path "src/app/api/sentry-smoke/route.ts"

if ($sentryClient -and $sentryServer -and $sentrySmoke) {
    Write-Host "   ✅ Archivos de configuración encontrados" -ForegroundColor Green
} else {
    Write-Host "   ❌ Faltan archivos de configuración" -ForegroundColor Red
    if (-not $sentryClient) { Write-Host "      - sentry.client.config.ts" -ForegroundColor Red }
    if (-not $sentryServer) { Write-Host "      - sentry.server.config.ts" -ForegroundColor Red }
    if (-not $sentrySmoke) { Write-Host "      - src/app/api/sentry-smoke/route.ts" -ForegroundColor Red }
}

Write-Host ""

# 2. Verificar variables de entorno
Write-Host "2️⃣ Verificando variables de entorno..." -ForegroundColor Yellow

$envLocal = Test-Path ".env.local"
if ($envLocal) {
    Write-Host "   ✅ .env.local existe" -ForegroundColor Green
    
    # Leer .env.local (sin exponer valores completos)
    $envContent = Get-Content ".env.local" -ErrorAction SilentlyContinue
    
    $hasSentryDsn = $envContent | Where-Object { $_ -match "^SENTRY_DSN=" }
    $hasPublicSentryDsn = $envContent | Where-Object { $_ -match "^NEXT_PUBLIC_SENTRY_DSN=" }
    $hasSmokeKey = $envContent | Where-Object { $_ -match "^SMOKE_TEST_KEY=" }
    
    if ($hasSentryDsn) {
        $dsnValue = ($hasSentryDsn -split "=")[1]
        if ($dsnValue -and $dsnValue -ne "") {
            $dsnPreview = $dsnValue.Substring(0, [Math]::Min(30, $dsnValue.Length)) + "..."
            Write-Host "   ✅ SENTRY_DSN configurado: $dsnPreview" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  SENTRY_DSN está vacío" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ❌ SENTRY_DSN no configurado" -ForegroundColor Red
    }
    
    if ($hasPublicSentryDsn) {
        $dsnValue = ($hasPublicSentryDsn -split "=")[1]
        if ($dsnValue -and $dsnValue -ne "") {
            $dsnPreview = $dsnValue.Substring(0, [Math]::Min(30, $dsnValue.Length)) + "..."
            Write-Host "   ✅ NEXT_PUBLIC_SENTRY_DSN configurado: $dsnPreview" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  NEXT_PUBLIC_SENTRY_DSN está vacío" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ❌ NEXT_PUBLIC_SENTRY_DSN no configurado" -ForegroundColor Red
    }
    
    if ($hasSmokeKey) {
        Write-Host "   ✅ SMOKE_TEST_KEY configurado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  SMOKE_TEST_KEY no configurado (necesario para smoke test)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ .env.local no existe" -ForegroundColor Red
    Write-Host "      Crea el archivo y agrega:" -ForegroundColor Yellow
    Write-Host "      SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx" -ForegroundColor Yellow
    Write-Host "      NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx" -ForegroundColor Yellow
    Write-Host "      SMOKE_TEST_KEY=tu-clave-secreta" -ForegroundColor Yellow
}

Write-Host ""

# 3. Verificar paquete instalado
Write-Host "3️⃣ Verificando paquete @sentry/nextjs..." -ForegroundColor Yellow

$packageJson = Get-Content "package.json" -Raw -ErrorAction SilentlyContinue
if ($packageJson -match '@sentry/nextjs') {
    $version = if ($packageJson -match '"@sentry/nextjs":\s*"([^"]+)"') { $matches[1] } else { "instalado" }
    Write-Host "   ✅ @sentry/nextjs instalado (versión: $version)" -ForegroundColor Green
} else {
    Write-Host "   ❌ @sentry/nextjs no encontrado en package.json" -ForegroundColor Red
    Write-Host "      Ejecuta: npm install @sentry/nextjs" -ForegroundColor Yellow
}

Write-Host ""

# 4. Verificar si el servidor está corriendo
Write-Host "4️⃣ Verificando servidor de desarrollo..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   ✅ Servidor corriendo en http://localhost:3000" -ForegroundColor Green
    $serverRunning = $true
} catch {
    Write-Host "   ⚠️  Servidor no está corriendo o no responde" -ForegroundColor Yellow
    Write-Host "      Inicia el servidor con: npm run dev" -ForegroundColor Yellow
    $serverRunning = $false
}

Write-Host ""

# 5. Probar endpoint de smoke test (si está configurado)
if ($hasSmokeKey -and $serverRunning) {
    Write-Host "5️⃣ Probando endpoint de smoke test..." -ForegroundColor Yellow
    
    $smokeKeyValue = ($hasSmokeKey -split "=")[1].Trim()
    
    try {
        $headers = @{
            "x-smoke-key" = $smokeKeyValue
        }
        
        $smokeResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/sentry-smoke" -Method GET -Headers $headers -ErrorAction Stop
        
        Write-Host "   ✅ Endpoint responde correctamente" -ForegroundColor Green
        Write-Host "      Estado: $($smokeResponse.ok)" -ForegroundColor Cyan
        Write-Host "      Sentry: $($smokeResponse.sentry)" -ForegroundColor Cyan
        
        if ($smokeResponse.sentry -eq "enabled") {
            Write-Host "   ✅ Sentry está habilitado y debería recibir eventos" -ForegroundColor Green
            Write-Host "      Verifica en tu cuenta de Sentry → Issues" -ForegroundColor Yellow
            Write-Host "      Busca: 'SENTRY_SMOKE_TEST'" -ForegroundColor Yellow
        } else {
            Write-Host "   ⚠️  Sentry está deshabilitado (SENTRY_DSN no configurado)" -ForegroundColor Yellow
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 403) {
            Write-Host "   ❌ Error 403: Clave de autenticación inválida" -ForegroundColor Red
        } elseif ($statusCode -eq 503) {
            Write-Host "   ❌ Error 503: SMOKE_TEST_KEY no configurado" -ForegroundColor Red
        } else {
            Write-Host "   ❌ Error al probar endpoint: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "5️⃣ Saltando prueba de smoke test..." -ForegroundColor Yellow
    if (-not $hasSmokeKey) {
        Write-Host "   ⚠️  SMOKE_TEST_KEY no configurado" -ForegroundColor Yellow
    }
    if (-not $serverRunning) {
        Write-Host "   ⚠️  Servidor no está corriendo" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Resumen" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Resumen final
$allGood = $sentryClient -and $sentryServer -and $sentrySmoke -and $hasSentryDsn -and $hasPublicSentryDsn

if ($allGood) {
    Write-Host "✅ Configuración completa" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para verificar que Sentry recibe eventos:" -ForegroundColor Yellow
    Write-Host "1. Ve a https://sentry.io" -ForegroundColor White
    Write-Host "2. Navega a tu proyecto" -ForegroundColor White
    Write-Host "3. Ve a Issues" -ForegroundColor White
    Write-Host "4. Busca 'SENTRY_SMOKE_TEST'" -ForegroundColor White
    Write-Host ""
    Write-Host "O ejecuta el smoke test manualmente:" -ForegroundColor Yellow
    Write-Host '   $headers = @{ "x-smoke-key" = "tu-clave" }' -ForegroundColor White
    Write-Host '   Invoke-RestMethod -Uri "http://localhost:3000/api/sentry-smoke" -Method GET -Headers $headers' -ForegroundColor White
} else {
    Write-Host "⚠️  Configuración incompleta" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pasos pendientes:" -ForegroundColor Yellow
    if (-not $hasSentryDsn) {
        Write-Host "1. Configura SENTRY_DSN en .env.local" -ForegroundColor White
    }
    if (-not $hasPublicSentryDsn) {
        Write-Host "2. Configura NEXT_PUBLIC_SENTRY_DSN en .env.local" -ForegroundColor White
    }
    if (-not $hasSmokeKey) {
        Write-Host "3. Configura SMOKE_TEST_KEY en .env.local" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "Ver GUIA_CONFIGURAR_SENTRY.md para más detalles" -ForegroundColor Cyan
}

Write-Host ""
