# Smoke Test Manual - Verificación rápida de funcionalidad
# Ejecutar con: .\scripts\smoke-test.ps1

Write-Host "🔥 Smoke Test - Verificación de funcionalidad básica" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$email = "matias@paestutor.com"
$password = "password123"

# 1. Verificar que el servidor está corriendo
Write-Host "1️⃣ Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl" -Method GET -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Servidor respondiendo" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Servidor no responde correctamente" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Servidor no está corriendo. Ejecuta: npm run dev" -ForegroundColor Red
    exit 1
}

# 2. Verificar página de login
Write-Host "2️⃣ Verificando página de login..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/signin" -Method GET -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Página de login accesible" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Página de login no accesible" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Error al acceder a página de login" -ForegroundColor Red
}

# 3. Verificar API de búsqueda (sin autenticación debería dar 401)
Write-Host "3️⃣ Verificando API de búsqueda..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/search?q=test" -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ⚠️  API de búsqueda accesible sin autenticación (inesperado)" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "   ✅ API de búsqueda protegida (requiere autenticación)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error inesperado: $statusCode" -ForegroundColor Red
    }
}

# 4. Verificar API de notas (sin autenticación debería dar 401)
Write-Host "4️⃣ Verificando API de notas..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/notes" -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ⚠️  API de notas accesible sin autenticación (inesperado)" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "   ✅ API de notas protegida (requiere autenticación)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error inesperado: $statusCode" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📋 Resumen del Smoke Test:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para completar el smoke test manual:" -ForegroundColor Yellow
Write-Host "1. Abre http://localhost:3000/auth/signin en tu navegador" -ForegroundColor White
Write-Host "2. Inicia sesión con:" -ForegroundColor White
Write-Host "   Email: $email" -ForegroundColor White
Write-Host "   Password: $password" -ForegroundColor White
Write-Host "3. Verifica:" -ForegroundColor White
Write-Host "   - Navegación: Ve al dashboard y haz clic en 2 secciones" -ForegroundColor White
Write-Host "   - Crear nota: Ve a /notes y crea una nota 'prueba'" -ForegroundColor White
Write-Host "   - Buscar: Usa Cmd/Ctrl+K o el buscador con 'test'" -ForegroundColor White
Write-Host "   - Re-login: Cierra sesión y vuelve a entrar" -ForegroundColor White
Write-Host ""
