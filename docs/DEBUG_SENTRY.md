# 🔍 Debug: Sentry No Recibe Eventos

## Problemas Comunes y Soluciones

### 1. Verificar que Sentry esté Inicializado

El código ahora verifica que Sentry esté inicializado antes de enviar eventos. Si ves la advertencia `"Sentry no inicializado correctamente"`, puede ser que:

- El archivo `sentry.server.config.ts` no se esté cargando
- Hay un problema con la inicialización de Next.js

**Solución:**
1. Reinicia el servidor de desarrollo completamente
2. Verifica que no haya errores en la consola al iniciar
3. Busca el mensaje `[Sentry] Inicializado correctamente en servidor` en los logs

### 2. Verificar DSN

Asegúrate de que el DSN sea correcto:

```env
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

**Verificar:**
- El DSN debe empezar con `https://`
- Debe tener el formato correcto
- No debe tener espacios o caracteres extra

### 3. Habilitar Debug Mode

El código ahora tiene debug habilitado en desarrollo. Deberías ver logs en la consola del servidor:

```
[Sentry] Inicializado correctamente en servidor
[Sentry] Enviando evento: { message: '...', level: 'error', ... }
```

Si no ves estos logs, Sentry no se está inicializando.

### 4. Verificar en Sentry

**Dónde buscar el evento:**

1. **Issues** - Busca `SENTRY_SMOKE_TEST`
2. **All Events** - Ve a "All Events" en lugar de "Issues"
3. **Filtros** - Asegúrate de no tener filtros activos que oculten el evento
4. **Tiempo** - Los eventos pueden tardar 10-30 segundos en aparecer

### 5. Verificar Network/Firewall

Sentry necesita conexión a internet. Verifica:

```powershell
# Probar conectividad
Test-NetConnection sentry.io -Port 443
```

### 6. Verificar Logs del Servidor

Revisa los logs del servidor de desarrollo. Deberías ver:

```
[Sentry] Inicializado correctamente en servidor
Sentry smoke test: Error de prueba capturado, enviando...
Sentry smoke test: Evento enviado exitosamente a Sentry
```

Si ves errores, cópialos y revisa la solución.

### 7. Probar con Sentry SDK Directamente

Puedes probar enviar un evento directamente desde la consola del servidor:

```typescript
// En algún endpoint temporal
import * as Sentry from '@sentry/nextjs'

Sentry.captureMessage('Test directo', 'info')
await Sentry.flush(5000)
```

### 8. Verificar Variables de Entorno

Asegúrate de que las variables estén cargadas:

```powershell
# En PowerShell
Get-Content .env.local | Select-String "SENTRY"
```

### 9. Reiniciar Servidor

Después de cambiar configuración de Sentry, **siempre reinicia el servidor**:

```powershell
# Detener servidor (Ctrl+C)
# Luego iniciar de nuevo
npm run dev
```

### 10. Verificar Proyecto en Sentry

Asegúrate de estar viendo el proyecto correcto en Sentry:
- Verifica el nombre del proyecto
- Verifica la organización
- Verifica que el DSN corresponda al proyecto correcto

## Checklist de Debugging

- [ ] Servidor reiniciado después de cambios
- [ ] DSN correcto en .env.local
- [ ] Logs de inicialización visibles en consola
- [ ] No hay errores en la consola del servidor
- [ ] Conectividad a internet funcionando
- [ ] Revisado "All Events" en Sentry, no solo "Issues"
- [ ] Esperado 10-30 segundos después del smoke test
- [ ] Verificado que el proyecto en Sentry sea el correcto

## Si Nada Funciona

1. **Habilita debug completo temporalmente:**

   En `sentry.server.config.ts`:
   ```typescript
   debug: true, // Cambiar a true
   ```

2. **Verifica los logs detallados** en la consola

3. **Prueba con un DSN de prueba** de Sentry para verificar conectividad

4. **Contacta soporte de Sentry** si el problema persiste

---

**Última actualización:** 2025-01-28
