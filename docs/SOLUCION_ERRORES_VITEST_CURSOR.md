# 🔧 Solución: Errores de Vitest y Conexión de Cursor

## 📋 Problemas Identificados

1. **Error de conexión de Cursor**: "Connection failed. If the problem persists, please check your internet connection or VPN"
2. **Repetición de vitest (1-402)**: El comando `npx vitest` se ejecuta repetidamente
3. **Tests fallando**: Tests retornan 500 en lugar de códigos específicos (400, 401, 403, 404)

## ✅ Soluciones Implementadas

### 1. Corrección de Tests de Route

**Problema**: Los tests retornaban 500 en lugar de códigos específicos porque `getCurrentStudentId` no estaba mockeado correctamente.

**Solución**: Se agregó mock por defecto en `beforeEach` para asegurar que `getCurrentStudentId` esté configurado antes de cada test.

```typescript
beforeEach(() => {
  vi.clearAllMocks()
  setupCircuitBreakerSuccess()
  // Asegurar que getCurrentStudentId esté mockeado por defecto
  vi.mocked(getCurrentStudentId).mockResolvedValue(TEST_IDS.STUDENT)
})
```

### 2. Corrección de Tests de useAutoSave

**Problema**: Los tests fallaban porque `vi.runAllTimersAsync()` ejecutaba todos los timers pendientes, incluso los que no deberían ejecutarse aún.

**Solución**: Se removió `vi.runAllTimersAsync()` de los tests y se usa solo `vi.advanceTimersByTime()` para avanzar el tiempo sin ejecutar timers prematuramente.

### 3. Error de Conexión de Cursor

**Causa**: Cursor intenta conectarse a sus servidores para telemetría, actualizaciones y servicios de IA cuando se ejecutan comandos en el terminal.

**Soluciones**:

#### Opción A: Deshabilitar Telemetría (Recomendado)

1. Abre Configuración de Cursor: `Ctrl + ,`
2. Busca y deshabilita:
   - `telemetry.enableTelemetry` → ❌ Desmarcar
   - `telemetry.enableCrashReporter` → ❌ Desmarcar
   - `update.enableWindowsBackgroundUpdates` → ❌ Desmarcar
3. Reinicia Cursor: `Ctrl + Shift + P` → `Reload Window`

#### Opción B: Usar Script de Ejecución Silenciosa

Ya existe un script en `scripts/run-tests-silent.ps1` que reduce las conexiones:

```powershell
npm run test:run:silent
```

#### Opción C: Ignorar el Error

Si los comandos funcionan correctamente (como `npm run lint`, `npm run dev`, etc.), puedes **ignorar el error**. Es solo una notificación de Cursor y no afecta tu trabajo.

### 4. Repetición de Vitest (1-402)

**Causa**: Podría ser que Cursor esté intentando ejecutar vitest en modo watch o que haya algún proceso en segundo plano.

**Soluciones**:

1. **Verificar procesos activos**:
   ```powershell
   Get-Process | Where-Object {$_.ProcessName -like "*node*"}
   ```

2. **Cerrar procesos de vitest**:
   ```powershell
   Stop-Process -Name "node" -Force
   ```

3. **Usar modo run en lugar de watch**:
   ```powershell
   npm run test:run
   # En lugar de
   npm run test
   ```

4. **Verificar configuración de vitest**: Asegúrate de que `vitest.config.ts` no tenga `watch: true` por defecto.

## 🚀 Uso Recomendado

### Para Ejecutar Tests Sin Errores de Conexión

```powershell
# Opción 1: Usar script silencioso
npm run test:run:silent

# Opción 2: Ejecutar directamente (ignorar error de conexión)
npm run test:run

# Opción 3: Ejecutar tests específicos
npx vitest run src/hooks/useAutoSave.test.ts
```

### Para Deshabilitar Telemetría Permanentemente

El archivo `.vscode/settings.json` ya tiene configuraciones para reducir conexiones:

```json
{
  "telemetry.enableTelemetry": false,
  "telemetry.enableCrashReporter": false,
  "update.enableWindowsBackgroundUpdates": false
}
```

Si el error persiste, reinicia Cursor después de cambiar estas configuraciones.

## 📝 Notas Importantes

- ✅ **Tu código NO tiene problemas** - El error de conexión viene de Cursor, no de tu proyecto
- ✅ **Los comandos funcionan normalmente** - Aunque aparezca el error
- ✅ **Los tests ahora deberían pasar** - Se corrigieron los mocks y la lógica de los tests

## 🔍 Si el Problema Persiste

1. **Verificar conexión a Internet**:
   ```powershell
   Test-NetConnection google.com -Port 80
   ```

2. **Verificar DNS**:
   ```powershell
   nslookup cursor.sh
   ```

3. **Deshabilitar SonarLint temporalmente** (si está causando problemas):
   Edita `.vscode/settings.json` y comenta:
   ```json
   // "sonarlint.connectedMode.project": {
   //   "connectionId": "arangua",
   //   "projectKey": "paes-tutor"
   // }
   ```

4. **Usar terminal externo**: Ejecuta los tests en PowerShell o CMD fuera de Cursor para evitar el error completamente.

