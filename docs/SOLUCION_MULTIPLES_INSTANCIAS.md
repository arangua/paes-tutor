# Solución: Múltiples Instancias de Next.js

## 🔍 Problema Identificado

El error muestra:
```
⚠ Port 3000 is in use by process 20340, using available port 3001 instead.
⨯ Unable to acquire lock at .next\dev\lock, is another instance of next dev running?
```

**Causa:**
- Múltiples instancias de Next.js están corriendo
- El lock file está bloqueando el inicio
- Esto puede causar errores 500 en los endpoints

## ✅ Solución Aplicada

1. **Detener todos los procesos Node.js** ✅
2. **Eliminar lock file** ✅
3. **Verificar puertos libres** ✅

## 📋 Próximos Pasos

### Reiniciar el servidor:
```powershell
npm run dev:safe
```

O simplemente:
```powershell
npm run dev
```

### Verificar que funciona:
1. El servidor debería iniciar en el puerto 3000 (o 3001 si 3000 está ocupado)
2. Los endpoints deberían funcionar correctamente
3. No debería haber errores de lock

## 🎯 Resultado Esperado

Después de reiniciar:
- ✅ Servidor inicia correctamente
- ✅ Endpoints devuelven 200/401, no 500
- ✅ No hay errores de lock o múltiples instancias

## ⚠️ Nota

Si el problema persiste después de reiniciar, puede ser necesario:
- Verificar que no hay otros procesos usando los puertos
- Limpiar completamente `.next` con `npm run clean` o `Remove-Item .next -Recurse -Force`
