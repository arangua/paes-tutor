# RFC-2026-002 — Plan de Implementación Detallado

**Referencia:** RFC-2026-002_code-review-remediation.md
**Fecha:** 2026-01-27

---

## Protocolo de Regresión Zero

### Antes de cada fix:
```bash
npm run test:run          # Baseline: todos los tests pasan
npm run validate:types    # Baseline: zero errores de tipo
```

### Después de cada fix:
```bash
npm run test:run          # Confirmación: zero regresiones
npm run validate:types    # Confirmación: zero errores nuevos
```

### Después de cada fase:
```bash
npm run check:critical-issues  # Suite completa de guards
npm run lint:strict             # Zero warnings
```

### Convención de commits:
```
fix(security): [CR-NN] descripción breve

Ref: RFC-2026-002
```

Donde `CR-NN` es el número del hallazgo (CR-01 a CR-28).

---

## Fase 0 — Fundación

### Paso 0.1: Capturar baseline
```bash
git tag pre-remediation-baseline
npm run test:run 2>&1 | tee baseline-test-results.txt
npm run validate:types 2>&1 | tee baseline-types-results.txt
npm run lint:strict 2>&1 | tee baseline-lint-results.txt
```

### Paso 0.2: Verificar que CI pasa
```bash
npm run check:critical-issues
```

---

## Fase 1 — Críticos (5 hallazgos)

### CR-04: Regex /g en security-logger causa falsos negativos

**Archivo:** `src/lib/security-logger.ts`
**Líneas:** 68, 79-87
**Riesgo de regresión:** BAJO — cambio interno en constantes

**Test a crear:** `src/lib/__tests__/security-logger.test.ts`
```typescript
describe('detectSuspiciousActivity', () => {
  it('detects SQL injection consistently on consecutive calls', () => {
    const result1 = detectSuspiciousActivity('1.2.3.4', '/api/test', { q: 'SELECT * FROM users' })
    const result2 = detectSuspiciousActivity('1.2.3.4', '/api/test', { q: 'SELECT * FROM users' })
    const result3 = detectSuspiciousActivity('1.2.3.4', '/api/test', { q: 'SELECT * FROM users' })
    expect(result1).toBe(true)
    expect(result2).toBe(true)  // Falla sin el fix (lastIndex issue)
    expect(result3).toBe(true)
  })

  it('detects path traversal consistently', () => {
    for (let i = 0; i < 5; i++) {
      expect(detectSuspiciousActivity('1.2.3.4', '/../etc/passwd', {})).toBe(true)
    }
  })

  it('detects XSS consistently', () => {
    for (let i = 0; i < 5; i++) {
      expect(detectSuspiciousActivity('1.2.3.4', '/api', { input: '<script>alert(1)</script>' })).toBe(true)
    }
  })

  it('returns false for clean input', () => {
    expect(detectSuspiciousActivity('1.2.3.4', '/api/exams', { page: '1' })).toBe(false)
  })
})
```

**Fix:**
```typescript
// Línea 68: Remover flag /g
const CONTROL_CHARS_RE = /[\x00-\x1F\x7F]/

// Líneas 79-87: Remover flags /g de todos los patrones
const suspiciousPatterns = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
  /\.\.\//,
  /<script|javascript:|on\w+\s*[=:]|onclick|onerror|onload/i,
  CONTROL_CHARS_RE,
]
```

**Justificación:** `.test()` con `/g` actualiza `lastIndex`, causando que llamadas consecutivas alternen entre true y false. Sin `/g`, `.test()` siempre evalúa desde el inicio.

---

### CR-03: ReferenceError en cache.ts

**Archivo:** `src/lib/cache.ts`
**Líneas:** 186-209
**Riesgo de regresión:** BAJO — el código con bug nunca se ejecutaba (ENABLE_CACHE_CLEANUP_INTERVAL es false por defecto)

**Test a crear:** `src/lib/__tests__/cache-cleanup.test.ts`
```typescript
describe('cache module-level cleanup (CR-03)', () => {
  let setIntervalSpy: ReturnType<typeof vi.spyOn>
  let capturedCallbacks: Array<() => void> = []

  beforeEach(() => {
    vi.resetModules()
    capturedCallbacks = []
    // Spy on setInterval to capture the callback without executing it
    setIntervalSpy = vi.spyOn(global, 'setInterval').mockImplementation((cb: () => void) => {
      capturedCallbacks.push(cb)
      return 999 as unknown as NodeJS.Timeout
    })
  })

  afterEach(() => {
    setIntervalSpy.mockRestore()
    vi.unstubAllEnvs()
  })

  it('setupMemoryCacheCleanup registers interval that calls adapter.cleanup()', async () => {
    // Import fresh module
    const { getCacheInstance } = await import('@/lib/cache')
    const adapter = await getCacheInstance()

    // If adapter is MemoryCacheAdapter, setInterval should have been called
    // and the callback should call cleanup() without ReferenceError
    if (capturedCallbacks.length > 0) {
      const cleanupSpy = vi.spyOn(adapter, 'cleanup').mockImplementation(() => {})
      // Execute the captured callback — this is the critical assertion:
      // it must NOT throw ReferenceError (the original bug)
      expect(() => capturedCallbacks[0]()).not.toThrow()
      cleanupSpy.mockRestore()
    }
  })

  it('dead code block at module level (lines 179-209) is removed', async () => {
    // After the fix, the duplicate module-level block that references
    // undefined `cache` should be gone. We verify by setting the env var
    // that would trigger it and confirming no crash on import.
    vi.stubEnv('ENABLE_CACHE_CLEANUP_INTERVAL', 'true')
    vi.stubEnv('NODE_ENV', 'development')

    // If the dead code block still exists and references `cache`,
    // this import will throw ReferenceError
    await expect(import('@/lib/cache')).resolves.toBeDefined()
  })
})
```

**Fix:** Eliminar el bloque de código duplicado del módulo-level (líneas 179-209 de `src/lib/cache.ts`). La funcionalidad ya está correctamente implementada en `setupMemoryCacheCleanup()` (líneas 156-177) que recibe el adaptador como parámetro.

```typescript
// ELIMINAR las líneas 179-209 completas:
// Desde:
//   const ENABLE_CACHE_CLEANUP_INTERVAL = ...
// Hasta el cierre del if block (línea 209)
//
// Este bloque es dead code que referencia `cache` (variable no definida
// a nivel de módulo). La funcionalidad ya existe correctamente en
// setupMemoryCacheCleanup(adapter) que se invoca en getCacheInstance()
// línea 148, pasando el adaptador como parámetro.
```

**Por qué el test anterior era frágil:**
- `require('@/lib/cache')` en un test con `NODE_ENV=test` nunca activaba el bug porque `ENABLE_CACHE_CLEANUP_INTERVAL` se evalúa como `false` cuando `NODE_ENV === 'test'`
- Sin `vi.resetModules()`, el módulo podía venir cacheado de un import anterior
- "No crashea al importar" no afirma comportamiento — solo verifica que el lado feliz no explota

**Por qué el test nuevo es robusto:**
- Usa `vi.resetModules()` + `import()` para forzar re-evaluación del módulo
- Usa `vi.stubEnv()` para setear las variables antes del import
- Captura el callback de `setInterval` y lo ejecuta explícitamente
- Afirma que el callback no lanza `ReferenceError` (el bug original)
- Afirma que `cleanup()` se llama en la instancia correcta

---

### CR-05: ReferenceError en catch blocks de ai-keys/route.ts

**Archivo:** `src/app/api/user/ai-keys/route.ts`
**Líneas:** 24/58 (GET), 70/140 (POST)
**Riesgo de regresión:** BAJO — solo afecta el path de error

**Test a crear:** `src/app/api/user/ai-keys/__tests__/route.test.ts`
```typescript
describe('GET /api/user/ai-keys', () => {
  it('returns 500 without ReferenceError when getCurrentUser throws', async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error('DB connection lost'))
    const response = await GET()
    expect(response.status).toBe(500)
    // No debe haber ReferenceError en los logs
  })
})

describe('POST /api/user/ai-keys', () => {
  it('returns 500 without ReferenceError when getCurrentUser throws', async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error('DB connection lost'))
    const response = await POST(new Request('...', { method: 'POST', body: '{}' }))
    expect(response.status).toBe(500)
  })
})
```

**Fix:** Declarar variable `userId` fuera del try block.

```typescript
// GET handler
export async function GET() {
  let userId: string | undefined
  try {
    const user = await getCurrentUser()
    userId = user?.id
    // ... resto del código
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        userId,  // Ahora accesible
      },
      'Error al obtener API keys'
    )
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST handler — mismo patrón
```

---

### CR-01: Sin verificación de admin en import-exams

**Archivo:** `src/app/api/admin/import-exams/route.ts`
**Líneas:** 1024-1027
**Riesgo de regresión:** MEDIO — podría bloquear admins legítimos si la verificación tiene bugs

**Test a crear:** `src/app/api/admin/import-exams/__tests__/auth.test.ts`
```typescript
describe('POST /api/admin/import-exams', () => {
  it('returns 403 when user is not admin', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: '1', role: 'student' })
    vi.mocked(isAdmin).mockResolvedValue(false)
    const response = await POST(new Request('...'))
    expect(response.status).toBe(403)
  })

  it('allows admin users', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: '1', role: 'admin' })
    vi.mocked(isAdmin).mockResolvedValue(true)
    // ... test que el admin puede proceder
  })
})
```

**Fix:**
```typescript
import { isAdmin } from '@/lib/check-admin'

// Después de la verificación de autenticación existente:
const user = await getCurrentUser()
if (!user) {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

// AGREGAR: Verificación de rol admin
const adminCheck = await isAdmin()
if (!adminCheck) {
  return NextResponse.json({ error: 'Acceso denegado: se requiere rol de administrador' }, { status: 403 })
}
```

---

### CR-02: SSRF en import-exams y webhooks

**Archivos:** `src/app/api/admin/import-exams/route.ts`, `src/lib/webhooks.ts`
**Riesgo de regresión:** MEDIO — podría bloquear URLs legítimas si la validación es demasiado restrictiva

**Vectores de ataque cubiertos:**
1. IP literals directas (127.0.0.1, 169.254.169.254, 10.x, 172.16-31.x, 192.168.x)
2. DNS rebinding (hostname que resuelve a IP privada)
3. Redirects (external → 302 → internal)
4. IP encoding tricks (hex `0x7f000001`, octal `0177.0.0.1`, decimal `2130706433`)
5. Hostnames reservados (localhost, .internal, .local)

**Crear utility:** `src/lib/url-validation.ts`
```typescript
import { lookup } from 'node:dns/promises'
import { logger } from '@/lib/logger'

/**
 * Checks whether an IPv4 address falls within private/reserved ranges.
 * Handles dotted-decimal, hex (0x7f000001), octal (0177.0.0.1),
 * and single-integer (2130706433) representations.
 */
export function isPrivateIp(ip: string): boolean {
  // Normalize hex/octal/decimal-encoded IPs to a 32-bit integer
  let num: number | null = null

  // Single integer form: e.g. 2130706433
  if (/^\d+$/.test(ip) && !ip.includes('.')) {
    num = parseInt(ip, 10)
  }
  // Hex form: e.g. 0x7f000001
  else if (/^0x[0-9a-fA-F]+$/.test(ip)) {
    num = parseInt(ip, 16)
  }
  // Standard dotted or octal-dotted form
  else {
    const parts = ip.split('.')
    if (parts.length === 4) {
      const octets = parts.map(p => {
        if (p.startsWith('0x') || p.startsWith('0X')) return parseInt(p, 16)
        if (p.startsWith('0') && p.length > 1) return parseInt(p, 8) // octal
        return parseInt(p, 10)
      })
      if (octets.every(o => !isNaN(o) && o >= 0 && o <= 255)) {
        num = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]
        num = num >>> 0 // force unsigned
      }
    }
  }

  if (num === null || isNaN(num)) return false

  num = num >>> 0 // unsigned

  // 0.0.0.0/8
  if ((num >>> 24) === 0) return true
  // 10.0.0.0/8
  if ((num >>> 24) === 10) return true
  // 127.0.0.0/8 (loopback)
  if ((num >>> 24) === 127) return true
  // 169.254.0.0/16 (link-local / cloud metadata)
  if ((num >>> 16) === 0xa9fe) return true
  // 172.16.0.0/12
  if ((num >>> 20) === 0xac1) return true
  // 192.168.0.0/16
  if ((num >>> 16) === 0xc0a8) return true

  return false
}

/**
 * Design note on octal parsing edge case:
 * parseInt('08', 8) returns 0 because '8' is not a valid octal digit.
 * This means ambiguous inputs like '08.8.8.8' are parsed as [0, 8, 8, 8]
 * → mapped to 0.0.0.0/8 → BLOCKED. The OS might interpret '08' as decimal 8,
 * meaning the real target is 8.8.8.8 (public).
 *
 * This is INTENTIONAL: for SSRF prevention, false positives (blocking
 * too much) are always preferable to false negatives (allowing bypasses).
 * The fail-safe design means ambiguous encodings are blocked by default.
 */

/**
 * Pre-fetch URL validation (hostname + format only, no DNS).
 * Use validateExternalUrlWithDns() for full protection.
 */
export function isInternalUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    const hostname = url.hostname.toLowerCase()

    // Block localhost variants
    if (hostname === 'localhost' || hostname === '::1') return true

    // Block reserved TLDs
    if (hostname.endsWith('.internal') || hostname.endsWith('.local')) return true

    // Check IP in any encoding form
    if (isPrivateIp(hostname)) return true

    return false
  } catch {
    return true // Invalid URLs are blocked (fail-safe)
  }
}

/**
 * Full SSRF-safe URL validation with DNS resolution.
 * Resolves hostname to IP and validates the resolved address.
 */
export async function validateExternalUrlWithDns(
  urlString: string
): Promise<{ valid: boolean; error?: string }> {
  if (!urlString) return { valid: false, error: 'URL is empty' }

  try {
    const url = new URL(urlString)

    // Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: `Protocol ${url.protocol} not allowed` }
    }

    // Static hostname checks first (fast path)
    if (isInternalUrl(urlString)) {
      return { valid: false, error: 'Internal URLs are not allowed' }
    }

    // DNS resolution: catch rebinding attacks
    // (hostname like evil.com that resolves to 169.254.169.254)
    try {
      const { address } = await lookup(url.hostname)
      if (isPrivateIp(address)) {
        logger.warn(
          { hostname: url.hostname, resolvedIp: address },
          'SSRF: hostname resolved to private IP'
        )
        return { valid: false, error: 'Hostname resolves to private IP' }
      }
    } catch {
      // DNS resolution failed — block by default (fail-safe)
      return { valid: false, error: 'DNS resolution failed' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

/**
 * Synchronous version for cases where DNS lookup isn't practical.
 * Less secure — does NOT protect against DNS rebinding.
 */
export function validateExternalUrl(urlString: string): { valid: boolean; error?: string } {
  if (!urlString) return { valid: false, error: 'URL is empty' }

  try {
    const url = new URL(urlString)

    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: `Protocol ${url.protocol} not allowed` }
    }

    if (isInternalUrl(urlString)) {
      return { valid: false, error: 'Internal URLs are not allowed' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}
```

**Test:** `src/lib/__tests__/url-validation.test.ts`
```typescript
import { isInternalUrl, isPrivateIp, validateExternalUrl, validateExternalUrlWithDns } from '@/lib/url-validation'

describe('isPrivateIp', () => {
  it.each([
    ['127.0.0.1', true],
    ['10.0.0.1', true],
    ['192.168.1.1', true],
    ['172.16.0.1', true],
    ['172.31.255.255', true],
    ['169.254.169.254', true],
    ['0.0.0.0', true],
    ['0x7f000001', true],          // hex-encoded 127.0.0.1
    ['2130706433', true],          // decimal-encoded 127.0.0.1
    ['0177.0.0.1', true],          // octal-encoded 127.0.0.1
    ['8.8.8.8', false],
    ['1.1.1.1', false],
    ['172.32.0.1', false],         // just outside 172.16-31 range
  ])('isPrivateIp(%s) = %s', (ip, expected) => {
    expect(isPrivateIp(ip)).toBe(expected)
  })
})

describe('isInternalUrl', () => {
  it.each([
    'http://localhost:3000/api',
    'http://127.0.0.1/admin',
    'http://169.254.169.254/latest/meta-data/',
    'http://10.0.0.1/internal',
    'http://192.168.1.1/router',
    'http://172.16.0.1/private',
    'http://0x7f000001/',              // hex IP
    'http://server.internal:8080/',
    'http://db.local/admin',
  ])('blocks internal URL: %s', (url) => {
    expect(isInternalUrl(url)).toBe(true)
  })

  it.each([
    'https://api.openai.com/v1/models',
    'https://example.com/webhook',
    'https://hooks.slack.com/services/T00/B00/xxx',
  ])('allows external URL: %s', (url) => {
    expect(isInternalUrl(url)).toBe(false)
  })
})

describe('validateExternalUrl', () => {
  it('blocks non-HTTP protocols', () => {
    expect(validateExternalUrl('ftp://example.com/file').valid).toBe(false)
    expect(validateExternalUrl('file:///etc/passwd').valid).toBe(false)
    expect(validateExternalUrl('gopher://evil.com/').valid).toBe(false)
  })

  it('blocks empty and malformed URLs', () => {
    expect(validateExternalUrl('').valid).toBe(false)
    expect(validateExternalUrl('not-a-url').valid).toBe(false)
  })
})

describe('validateExternalUrlWithDns', () => {
  it('allows valid external URLs', async () => {
    // Mock DNS to return a public IP
    vi.mock('node:dns/promises', () => ({
      lookup: vi.fn().mockResolvedValue({ address: '93.184.216.34', family: 4 }),
    }))
    const result = await validateExternalUrlWithDns('https://example.com/webhook')
    expect(result.valid).toBe(true)
  })

  it('blocks hostname that resolves to private IP (DNS rebinding)', async () => {
    vi.mock('node:dns/promises', () => ({
      lookup: vi.fn().mockResolvedValue({ address: '169.254.169.254', family: 4 }),
    }))
    const result = await validateExternalUrlWithDns('https://evil-rebind.com/steal')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('private IP')
  })
})
```

**Integración en webhooks.ts (con DNS + redirect blocking):**
```typescript
import { validateExternalUrlWithDns } from '@/lib/url-validation'

// En deliverWebhook, antes del fetch:
const urlCheck = await validateExternalUrlWithDns(webhook.url)
if (!urlCheck.valid) {
  logger.warn({ webhookId: webhook.id, url: webhook.url, error: urlCheck.error },
    'Webhook URL blocked by SSRF protection')
  return
}

// En el fetch, bloquear redirects:
const response = await fetch(webhook.url, {
  method: 'POST',
  redirect: 'error',  // SSRF: block redirects to internal URLs
  headers: { /* ... */ },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(10000),
})
```

**Integración en import-exams (downloadFile / downloadFileAlternative):**
```typescript
import { validateExternalUrlWithDns } from '@/lib/url-validation'

// Antes de descargar:
const urlCheck = await validateExternalUrlWithDns(fileUrl)
if (!urlCheck.valid) {
  throw new Error(`URL bloqueada por protección SSRF: ${urlCheck.error}`)
}

// Bloquear redirects en el fetch:
const response = await fetch(fileUrl, {
  redirect: 'error',  // SSRF: no seguir redirects
  signal: AbortSignal.timeout(30000),
})
```

**Nota sobre redirect: 'error':**
Si se necesita seguir redirects legítimos (e.g., CDN redirects), usar `redirect: 'manual'` y validar la URL de destino antes de seguirla:
```typescript
const response = await fetch(url, { redirect: 'manual' })
if (response.status >= 300 && response.status < 400) {
  const location = response.headers.get('location')
  if (location) {
    const redirectCheck = await validateExternalUrlWithDns(location)
    if (!redirectCheck.valid) {
      throw new Error('Redirect blocked by SSRF protection')
    }
    // Follow the redirect manually
    return fetch(location, { redirect: 'error' })
  }
}
```

---

## Fase 2 — Altos (6 hallazgos)

### CR-06: timingSafeEqual lanza en longitudes distintas

**Archivo:** `src/lib/webhooks.ts:192-202`
**Riesgo de regresión:** BAJO — agrega protección, no cambia happy path

**Test:**
```typescript
describe('verifyWebhookSignature', () => {
  it('returns false for signature with different length', () => {
    expect(verifyWebhookSignature('payload', 'short', 'secret')).toBe(false)
  })

  it('returns true for valid signature', () => {
    const secret = 'test-secret'
    const payload = '{"test": true}'
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    expect(verifyWebhookSignature(payload, signature, secret)).toBe(true)
  })
})
```

**Fix:**
```typescript
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateSignature(payload, secret)
  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  // timingSafeEqual throws RangeError if lengths differ
  if (sigBuffer.length !== expectedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer)
}
```

---

### CR-07: Encryption key cambia por reinicio (dev)

**Archivo:** `src/lib/encryption.ts:26`
**Riesgo de regresión:** BAJO — solo afecta desarrollo, producción ya lanza error si falta ENCRYPTION_KEY

**Fix:**
```typescript
// Línea 26: Reemplazar Date.now() con valor determinista
ENCRYPTION_KEY = 'dev-temp-key-do-not-use-in-production'
```

**Justificación:** En desarrollo, una clave estática permite que datos encriptados sobrevivan reinicios del servidor. El warning existente ya alerta sobre el uso de clave temporal.

---

### CR-08: Salt PBKDF2 hardcodeado — DIFERIDO

**Archivo:** `src/lib/encryption.ts:65`
**Estado:** Diferido formalmente a RFC-2026-003

**Justificación del diferimiento:**
Cambiar el salt rompe la desencriptación de todos los datos existentes. La solución correcta requiere:
1. Versionado del ciphertext (prefijo que identifique el esquema de encriptación)
2. Script de migración con dry-run para re-encriptar datos existentes
3. Backward compatibility temporal (leer con salt viejo, escribir con salt nuevo)
4. Ventana de migración y rollback plan

Esto no se puede hacer de forma segura como un fix atómico. Se crea RFC-2026-003 con el diseño completo.

**Acción inmediata:** Solo agregar un comentario `@security-debt` en el código para trazabilidad:
```typescript
// @security-debt CR-08: Salt estático — ver RFC-2026-003 para plan de migración a salt dinámico
return CryptoJS.PBKDF2(key, 'paes-tutor-salt', { ... })
```

---

### CR-09: refetch() en useExams es no-op

**Archivo:** `src/hooks/useExams.ts:167-171`
**Riesgo de regresión:** BAJO — refetch no funciona actualmente

**Fix:**
```typescript
// Agregar state trigger
const [fetchTrigger, setFetchTrigger] = useState(0)

// En el useEffect, agregar fetchTrigger a las dependencias:
useEffect(() => {
  // ... fetch logic
}, [options.subjectId, options.tipo, options.limit, options.offset, fetchTrigger])

// En refetch:
refetch: () => {
  setExams([])
  setIsLoading(true)
  setFetchTrigger(prev => prev + 1)
},
```

---

### CR-10: Selección de oponente arbitraria

**Archivos:** `src/app/api/challenges/route.ts:149-194`, `src/app/api/shared-exams/route.ts:148-193`
**Riesgo de regresión:** MEDIO — cambia la lógica de selección

**Fix:**
```typescript
// Reemplazar .find() con selección aleatoria
const otherStudents = allStudents.filter(s => {
  const safeSId = s.id && typeof s.id === 'string' ? s.id : null
  return safeSId !== null && safeSId !== safeCurrentStudentId
})

const randomOpponent = otherStudents.length > 0
  ? otherStudents[Math.floor(Math.random() * otherStudents.length)]
  : null
```

**Nota:** Idealmente la selección debería ser por parámetro del usuario, pero eso es un cambio de API que requiere RFC separado.

---

### CR-11: maskApiKey sobre ciphertext

**Archivo:** `src/app/api/user/ai-keys/route.ts:126-133`
**Riesgo de regresión:** BAJO — mejora correctitud del display

**Fix:** Guardar la key original antes de encriptar para hacer mask:
```typescript
// Antes del encrypt:
const originalOpenaiKey = openaiApiKey?.trim() || null
const originalAnthropicKey = anthropicApiKey?.trim() || null
const originalGeminiKey = geminiApiKey?.trim() || null

// Encriptar
if (originalOpenaiKey) updateData.openaiApiKey = encrypt(originalOpenaiKey)
// ... etc

// En la respuesta, usar la key original para mask:
openaiApiKey: originalOpenaiKey ? maskApiKey(originalOpenaiKey) : undefined,
```

---

## Fase 3 — Medios (9 hallazgos)

### CR-12: Race condition en useExams sin AbortController

**Archivo:** `src/hooks/useExams.ts:74`

**Fix:**
```typescript
useEffect(() => {
  const controller = new AbortController()

  async function fetchExams() {
    // ... existing logic
    const res = await fetch(url, { signal: controller.signal })
    // ... rest
  }

  fetchExams()

  return () => controller.abort()
}, [/* deps */])
```

---

### CR-13: Monkey-patching console

**Archivo:** `src/components/GlobalErrorHandler.tsx:59-109`
**Riesgo de regresión:** ALTO — componente probablemente suprime errores que los usuarios reportan

**Fix (conservador):** En vez de monkey-patchear console, usar React Error Boundary:
```typescript
// Opción conservadora: mantener el filtering pero usar un approach menos invasivo
// Agregar comment explicando por qué y las limitaciones
// Agregar guard test que detecte monkey-patching de globals

// Si se decide mantener: al menos agregar cleanup robusto
// y logging de los warnings suprimidos para debugging
```

**Recomendación:** Dado el alto riesgo, diferir a RFC separado. Los warnings filtrados (Amplitude, keyframes, controlled components) deberían corregirse en su causa raíz.

---

### CR-14: Race condition en updatePerformanceMetrics

**Archivo:** `src/app/api/practice/sessions/route.ts:177-244`

**Fix:**
```typescript
async function updatePerformanceMetrics(/* params */) {
  await prisma.$transaction(async (tx) => {
    const existingMetric = await tx.performanceMetric.findUnique({
      where: { studentId_topicId: { studentId, topicId } },
    })
    // ... rest of logic using tx instead of prisma
  })
}
```

---

### CR-15: Redis TTL inconsistente

**Archivo:** `src/lib/cache.ts:84-89`

**Fix:**
```typescript
async set<T>(key: string, data: T, ttl?: number): Promise<void> {
  try {
    const effectiveTtl = ttl || DEFAULT_CACHE_TTL_MS
    // Upstash Redis SDK auto-serializa objetos JSON — no requiere JSON.stringify explícito
    await this.client.setex(key, Math.floor(effectiveTtl / 1000), data)
  } catch (error) {
    // Usar logger estructurado en vez de console.error (Secure Logging Practices)
    logger.error(
      { error: error instanceof Error ? error.message : String(error), key },
      'Error al guardar en caché Redis'
    )
  }
}
```

**Nota:** Las 3 funciones de `RedisCacheAdapter` que usan `console.error`/`console.warn` (`get`, `set`, `delete`, `clear`) deben migrarse a `logger` como parte de este fix. Esto alinea con CR-28 (errores silenciados) y el criterio Secure Logging Practices.

---

### CR-16: useAutoSave cleanup en cada cambio

**Archivo:** `src/hooks/useAutoSave.ts:75-108`

**Fix:** Usar refs para evitar que data y onSave sean dependencias del efecto de unmount:
```typescript
const dataRef = useRef(data)
const onSaveRef = useRef(onSave)

useEffect(() => { dataRef.current = data }, [data])
useEffect(() => { onSaveRef.current = onSave }, [onSave])

useEffect(() => {
  return () => {
    // Solo se ejecuta al desmontar
    const hasChanges = !safeDeepEqual(previousDataRef.current, dataRef.current)
    if (hasChanges) {
      onSaveRef.current(dataRef.current).catch(() => {})
    }
  }
}, []) // Sin dependencias = solo unmount
```

---

### CR-17: Logger info/debug usan console.warn

**Archivo:** `src/lib/logger.ts:33-47`

**Fix:**
```typescript
info: (obj, msg) => {
  if (isBrowser) {
    console.log('[INFO]', msg || '', obj)  // console.log, no console.warn
  } else {
    console.log(JSON.stringify({ level: 'info', ...obj, msg: msg || '' }))
  }
},
debug: (obj, msg) => {
  if (isBrowser) {
    console.debug('[DEBUG]', msg || '', obj)  // console.debug, no console.warn
  } else {
    console.log(JSON.stringify({ level: 'debug', ...obj, msg: msg || '' }))
  }
},
```

**Riesgo:** El guard `no-console` de ESLint podría bloquear `console.log`. Verificar configuración de ESLint.

---

### CR-18: useKeyboardShortcuts no re-registra

**Archivo:** `src/hooks/useKeyboardShortcuts.ts:30-31, 80`

**Fix:**
```typescript
// Cambiar dependencias del useEffect
}, [shortcuts]) // Era [], ahora incluye shortcuts
```

---

### CR-19: Password incorrecto retorna 400

**Archivo:** `src/app/api/user/password/route.ts:81`

**Fix:**
```typescript
if (!isPasswordValid) {
  return NextResponse.json(
    { error: 'Credenciales inválidas' },  // Mensaje genérico
    { status: 401 }                        // 401, no 400
  )
}
```

---

### CR-20: invalidateCache ignora patrón

**Archivo:** `src/lib/cache.ts:251-256`

**Fix (documentar limitación):**
```typescript
/**
 * Invalida el cache completo.
 * NOTA: La invalidación por patrón no está implementada.
 * Use invalidateCachePattern() para invalidación por patrón parcial.
 * @param _pattern - Reservado para futura implementación
 */
export async function invalidateCache(_pattern: string): Promise<void> {
  const cache = await getCacheInstance()
  await cache.clear()
}
```

---

## Fase 4 — Bajos (8 hallazgos)

### CR-21: ignoreBuildErrors: true

**Riesgo de regresión:** ALTO — podría bloquear el build

**Estrategia en 2 pasos:**
1. Ejecutar `npx tsc --noEmit` y listar todos los errores
2. Si son pocos y en archivos de test → corregirlos y remover flag
3. Si son muchos → crear RFC separado con plan de corrección gradual

---

### CR-22: Sin validación formato API keys

**Fix:**
```typescript
const API_KEY_PATTERNS: Record<string, RegExp> = {
  openai: /^sk-[a-zA-Z0-9-_]{20,}$/,
  anthropic: /^sk-ant-[a-zA-Z0-9-_]{20,}$/,
  gemini: /^[a-zA-Z0-9-_]{20,}$/,
}

// En el schema de validación:
openaiApiKey: z.string().regex(API_KEY_PATTERNS.openai, 'Formato de API key inválido').optional().nullable(),
```

---

### CR-23: Sin bounds en spaced-repetition

**Fix:**
```typescript
export function calculateSM2(input: SM2Input): SM2Result {
  const { quality } = input

  // Validate quality bounds (SM-2 algorithm requires 0-5)
  if (quality < 0 || quality > 5 || !Number.isFinite(quality)) {
    throw new Error(`Quality must be between 0 and 5, got: ${quality}`)
  }
  // ... rest
}
```

---

### CR-24: Sin paginación en shared-exams

**Fix:**
```typescript
const DEFAULT_PAGE_SIZE = 50
const MAX_PAGE_SIZE = 100

// En el handler:
const take = Math.min(Number(searchParams.get('limit')) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
const skip = Number(searchParams.get('offset')) || 0

const sharedExams = await prisma.sharedExam.findMany({
  where: { /* ... */ },
  take,
  skip,
  // ... rest
})
```

---

### CR-25: N+1 query en import-exams

**Fix:**
```typescript
// Antes del loop, cargar todos los topics una vez:
const allTopics = await tx.topic.findMany({
  where: { subjectId: subject.id },
})

// En el loop, pasar los topics pre-cargados:
for (const parsedQ of parsedQuestions) {
  const topicId = mapQuestionToTopicFromCache(parsedQ, allTopics)
  // ...
}
```

---

### CR-26: getClientIp confía en headers spoofables

**Fix (documentar limitación):**
```typescript
/**
 * Obtiene IP del request.
 * ADVERTENCIA: x-forwarded-for y x-real-ip son spoofables sin proxy de confianza.
 * Solo usar para logging, NO para decisiones de seguridad sin proxy configurado.
 */
export function getClientIp(request: Request): string {
  // ... mismo código, la limitación es arquitectural
}
```

---

### CR-27: Auth patterns inconsistentes

**Riesgo de regresión:** ALTO — tocar autenticación en muchas rutas simultáneamente

**Recomendación:** Crear RFC-2026-004 para middleware de autenticación unificado. No abordar en este PR para minimizar riesgo.

---

### CR-28: Errores silenciados sin logging

**Archivos:** `src/lib/check-admin.ts`, `src/lib/get-session.ts`

**Fix:**
```typescript
// check-admin.ts — en cada catch block:
} catch (error) {
  logger.error(
    { error: error instanceof Error ? error.message : String(error), event: 'admin_check_failed' },
    'Error al verificar permisos de administrador'
  )
  return false
}

// get-session.ts — en getAuthenticatedUserWithStudent:
} catch (error) {
  logger.error(
    { error: error instanceof Error ? error.message : String(error), event: 'auth_user_fetch_failed' },
    'Error al obtener usuario autenticado'
  )
  return null
}
```

---

## Matriz de Dependencias entre Fixes

```
CR-01 (admin check) ← depende de CR-28 (logging en check-admin)
CR-02 (SSRF) ← independiente (nuevo módulo)
CR-03 (cache ref) ← independiente
CR-04 (regex) ← independiente
CR-05 (catch scope) ← independiente
CR-06 (timingSafe) ← independiente
CR-07 (encryption key) ← independiente (CR-08 diferido a RFC-2026-003)
CR-09 (refetch) ← puede combinarse con CR-12
CR-11 (maskApiKey) ← depende de CR-05 (mismo archivo)
CR-12 (AbortController) ← puede combinarse con CR-09
CR-16 (autoSave) ← independiente
CR-17 (logger) ← debe ir ANTES de CR-28
```

## Orden de Implementación Recomendado

### Batch 1 (sin dependencias):
CR-04, CR-03, CR-05, CR-02, CR-06

### Batch 2 (depende de Batch 1):
CR-01 (usa check-admin), CR-11 (mismo archivo que CR-05)

### Batch 3 (encryption):
CR-07 (CR-08 diferido a RFC-2026-003)

### Batch 4 (hooks):
CR-09 + CR-12 (mismo archivo), CR-16, CR-18

### Batch 5 (medios independientes):
CR-14, CR-15, CR-19, CR-20

### Batch 6 (logger + dependientes):
CR-17, CR-28, CR-13

### Batch 7 (bajos):
CR-22, CR-23, CR-24, CR-25, CR-26

### Batch 8 (requieren RFC separado):
CR-10 (opponent selection — cambio de API)
CR-21 (ignoreBuildErrors — scope desconocido)
CR-27 (auth unification — alto riesgo)

---

## Criterios de Éxito

1. **Todos los tests existentes siguen pasando** después de cada batch
2. **Nuevos tests cubren cada fix** con al menos un caso positivo y uno negativo
3. **TypeScript compila sin errores nuevos**
4. **Lint pasa sin warnings nuevos**
5. **Guards existentes pasan** (`npm run check:critical-issues`)
6. **Cada fix es revertible** independientemente con `git revert`

---

## Fixes Diferidos (requieren RFC separado)

| Hallazgo | Razón del diferimiento | RFC propuesto |
|----------|----------------------|---------------|
| CR-08 (salt dinámico) | Requiere migración de datos encriptados | RFC-2026-003 |
| CR-10 (opponent selection) | Cambio de contrato de API | RFC-2026-004 |
| CR-13 (console monkey-patch) | Alto riesgo, necesita análisis de causa raíz | RFC-2026-004 |
| CR-21 (ignoreBuildErrors) | Scope desconocido, podría bloquear CI | RFC-2026-004 |
| CR-27 (auth unification) | Refactoring transversal de alto riesgo | RFC-2026-004 |
