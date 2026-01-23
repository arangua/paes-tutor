# 🚀 Guía Rápida: Ejecutar `lint:e2e` Sin Errores de Conexión

## ✅ Solución Implementada

El comando `npm run lint:e2e` ahora usa un script aislado que evita errores de conexión de Cursor.

## 🎯 Uso Simple

```powershell
npm run lint:e2e
```

**Eso es todo.** El script se ejecuta automáticamente en modo aislado.

## 📋 Qué Hace el Script

1. ✅ Deshabilita todas las variables de entorno de Cursor
2. ✅ Configura terminal "tonto" (TERM=dumb) para evitar códigos de escape
3. ✅ Ejecuta ESLint directamente sin pasar por npm
4. ✅ Usa Start-Process para aislar completamente el proceso
5. ✅ Preserva el código de salida correctamente

## 🔍 Verificación

Para verificar que funciona:

```powershell
cd "c:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"
npm run lint:e2e
```

**Resultado esperado:**
- ✅ No deberías ver errores de conexión de Cursor
- ✅ Verás la salida de ESLint normalmente
- ✅ El código de salida será correcto (0 = éxito, != 0 = errores)

## 🔧 Si Necesitas Ejecutar el Script Directamente

```powershell
.\scripts\run-lint-e2e-isolated.ps1
```

## 📝 Archivos Relacionados

- **Script principal:** `scripts/run-lint-e2e-isolated.ps1`
- **Script alternativo:** `scripts/run-lint-e2e-cmd.ps1` (usa cmd.exe)
- **Documentación completa:** `SOLUCION_DEFINITIVA_LINT_E2E.md`
- **Resumen:** `RESUMEN_SOLUCION_LINT_E2E.md`

## ⚠️ Notas

- El script busca ESLint en `node_modules/.bin/eslint.cmd` (Windows)
- Si ESLint no se encuentra, muestra un error claro
- El código de salida se preserva correctamente
- Funciona incluso con SonarLint habilitado

## 🆘 Si el Problema Persiste

1. **Verifica que ESLint está instalado:**
   ```powershell
   Test-Path node_modules\.bin\eslint.cmd
   ```

2. **Reinstala dependencias:**
   ```powershell
   npm install
   ```

3. **Usa la versión alternativa:**
   - Edita `package.json` y cambia a `scripts/run-lint-e2e-cmd.ps1`

4. **Ejecuta en terminal externo:**
   - Abre PowerShell fuera de Cursor
   - Ejecuta `npm run lint:e2e`
