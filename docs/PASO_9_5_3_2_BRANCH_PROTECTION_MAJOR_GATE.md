# PASO 9.5.3.2 — Branch Protection: deps-major-label-gate requerido

## Nombre exacto del Required Check

El check que debe seleccionarse como requerido es:
- **`deps-major-label-gate / Major deps label gate`** (formato completo)
- O simplemente: **`Major deps label gate`** (nombre del job)

## Instrucciones paso a paso

### 1) Acceder a Branch Protection Rules

1. Ve a tu repositorio en GitHub
2. **Settings** → **Branches**
3. En "Branch protection rules":
   - Si ya existe regla para `main`: haz clic en **Edit**
   - Si no existe: haz clic en **Add rule**

### 2) Configurar la regla

**Branch name pattern:** `main`

Asegúrate de tener marcado:
- ✅ **Require a pull request before merging** (recomendado)
- ✅ **Require status checks to pass before merging** (debe estar activo)
- ✅ **Require branches to be up to date before merging** (recomendado)

### 3) Seleccionar el Required Status Check

En la sección **"Status checks that are required"**:

1. Busca en la lista el check: **`deps-major-label-gate / Major deps label gate`** o **`Major deps label gate`**
2. Márcalo como requerido (checkbox)

**Nota importante:** Si el check no aparece en la lista, es porque GitHub solo muestra checks que ya han corrido al menos una vez. En ese caso:
1. Abre o crea un PR hacia `main`
2. El workflow se ejecutará automáticamente
3. Espera a que termine
4. Vuelve a **Settings → Branches** y el check debería aparecer ahora

### 4) Guardar

Haz clic en **Save changes** al final de la página.

## Verificación

### Criterio de salida

✅ **Un PR major de Dependabot:**
- Sin label `deps-major-approved` → merge bloqueado (check rojo)
- Con label `deps-major-approved` → merge permitido (si además pasa `release-gate`)

✅ **PRs minor/patch:**
- Pasan automáticamente (no requieren label)

### Confirmación

**Check agregado en Branch Protection:** ✅

Esto garantiza que:
- Major updates sin label → merge bloqueado automáticamente
- Solo con label `deps-major-approved` + revisión → merge permitido
- Política reforzada sin depender de disciplina humana

## Workflow configurado

El workflow `.github/workflows/deps-major-label-gate.yml` está configurado con:
- ✅ Detección automática de PRs de Dependabot
- ✅ Identificación de major updates
- ✅ Validación de label `deps-major-approved`
- ✅ Trigger en eventos relevantes (opened, synchronize, reopened, labeled, unlabeled)

Una vez configurada la Branch Protection Rule, cualquier PR major de Dependabot requerirá el label de aprobación antes de permitir el merge.
