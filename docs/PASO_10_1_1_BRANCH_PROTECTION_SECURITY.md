# PASO 10.1.1 — Branch Protection: Security Required Checks

## Nombres exactos de los Required Checks

Basándome en los workflows configurados, los checks que deben seleccionarse como requeridos son:

### 1. CodeQL Analysis
**Nombre esperado del check:**
- **`CodeQL Analysis / Analyze`** (formato completo: workflow/job)
- O simplemente: **`Analyze`** (si GitHub muestra solo el nombre del job)

### 2. Security Posture
**Nombre esperado del check:**
- **`Security Posture / Security Posture Check`** (formato completo: workflow/job)
- O simplemente: **`Security Posture Check`** (si GitHub muestra solo el nombre del job)

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

### 3) Seleccionar los Required Status Checks

En la sección **"Status checks that are required"**:

1. Busca y selecciona: **`CodeQL Analysis / Analyze`** (o `Analyze`)
2. Busca y selecciona: **`Security Posture / Security Posture Check`** (o `Security Posture Check`)

**Nota importante:** Si alguno de los checks no aparece en la lista, es porque GitHub solo muestra checks que ya han corrido al menos una vez. En ese caso:
1. Abre o crea un PR hacia `main`
2. Los workflows se ejecutarán automáticamente
3. Espera a que terminen
4. Vuelve a **Settings → Branches** y los checks deberían aparecer ahora

Alternativamente, puedes ejecutar los workflows manualmente desde **Actions** → selecciona el workflow → **Run workflow**

### 4) Guardar

Haz clic en **Save changes** al final de la página.

## Verificación

### Criterio de salida

✅ **En un PR hacia main debe ocurrir:**

- Si CodeQL falla → PR no se puede mergear
- Si Trivy detecta y marca failure (HIGH/CRITICAL según policy) → PR no se puede mergear
- Si ambos pasan (y también pasan tus required checks existentes: `release-gate`, `deps-major-label-gate`) → merge permitido

### Confirmación

**Checks agregados en Branch Protection:** ✅

Esto garantiza que:
- Vulnerabilidades críticas/altas detectadas por CodeQL → merge bloqueado
- Vulnerabilidades críticas/altas detectadas por Trivy → merge bloqueado
- Solo con ambos checks en verde + otros required checks → merge permitido
- Política reforzada sin depender de disciplina humana

## Workflows configurados

### CodeQL Analysis (`.github/workflows/codeql-analysis.yml`)
- ✅ Análisis estático de código TypeScript
- ✅ Queries: `security-and-quality` + `security-extended`
- ✅ Ejecución: push/PR a `main` + semanal (domingos)
- ✅ Resultados en GitHub Security → Code scanning

### Security Posture (`.github/workflows/security.yml`)
- ✅ Escaneo de vulnerabilidades con Trivy
- ✅ Severidad: CRITICAL y HIGH
- ✅ Ejecución: push/PR a `main` + semanal (domingos)
- ✅ Resultados en GitHub Security (SARIF)

Una vez configurada la Branch Protection Rule, cualquier PR a `main` requerirá que ambos checks de seguridad pasen antes de permitir el merge.
