# PASO 9.4.2.1 — Branch Protection: release-gate obligatorio

## Configuración requerida

### Nombre del check en GitHub
El check que debe seleccionarse como requerido es:
- **`Release Gate / release-gate`** (formato completo)
- O simplemente: **`release-gate`** (nombre del job)

## Instrucciones paso a paso

### 1) Acceder a Branch Protection Rules

1. Ve a tu repositorio en GitHub
2. Settings → Branches
3. En "Branch protection rules":
   - Si ya existe regla para `main`: haz clic en **Edit**
   - Si no existe: haz clic en **Add rule**

### 2) Configurar la regla

**Branch name pattern:** `main`

Marcar las siguientes opciones:
- ✅ **Require a pull request before merging** (recomendado)
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging** (recomendado)

### 3) Seleccionar el Required Status Check

En la sección **"Status checks that are required"**:

1. Busca en la lista el check: **`Release Gate / release-gate`** o **`release-gate`**
2. Márcalo como requerido

**Nota importante:** Si el check no aparece en la lista, es porque GitHub solo muestra checks que ya han corrido al menos una vez. En ese caso:
1. Ve a **Actions** → **Release Gate**
2. Haz clic en **Run workflow** (dispara una corrida manual)
3. Espera a que termine
4. Vuelve a **Settings → Branches** y el check debería aparecer ahora

### 4) Guardar

Haz clic en **Save changes** al final de la página.

## Verificación

### Criterio de salida

✅ **En un PR hacia main:**
- Debe aparecer el check `Release Gate / release-gate` como **Required**
- Si el step "Attest build provenance" falla, el PR queda bloqueado (merge no permitido)
- Si cualquier parte del workflow falla, el merge queda bloqueado

### Confirmación

**PR a main queda bloqueado si release-gate falla:** ✅

Esto incluye:
- Fallos en `npm run ci:release`
- Fallos en el step "Attest build provenance"
- Timeouts del workflow
- Cualquier error en el job `release-gate`

## Workflow configurado

El workflow `.github/workflows/release-gate.yml` está configurado con:
- ✅ Permisos para attestation (`id-token: write`, `attestations: write`)
- ✅ Step de attestation después del build
- ✅ Trigger en `push` y `pull_request` hacia `main`

Una vez configurada la Branch Protection Rule, cualquier PR a `main` requerirá que este check pase antes de permitir el merge.
