# ✅ Verificar Configuración de SonarCloud

## 🔍 Checklist de Verificación

### 1. Verificar Secret en GitHub

1. **Ir a:**
   - https://github.com/arangua/paes-tutor/settings/secrets/actions

2. **Verificar que existe:**
   - Debe haber un secret llamado `SONAR_TOKEN`
   - Si no existe, agregarlo (ver Paso 2 abajo)

### 2. Verificar Proyecto en SonarCloud

1. **Ir a:**
   - https://sonarcloud.io/

2. **Buscar tu proyecto:**
   - Buscar: `paes-tutor` o `arangua/paes-tutor`
   - O ir a: https://sonarcloud.io/project/overview?id=paes-tutor

3. **Verificar estado:**
   - Si aparece "Choose your Analysis Method" = Proyecto no configurado
   - Si aparece dashboard con métricas = Proyecto configurado

### 3. Verificar Logs del Workflow

1. **Ir a:**
   - https://github.com/arangua/paes-tutor/actions

2. **Click en el último "SonarCloud Analysis"**

3. **Ver el error específico:**
   - Click en el step que falló
   - Leer el mensaje de error

## 🔧 Soluciones Según el Error

### Error: "SONAR_TOKEN not found"
**Solución:** Agregar el secret en GitHub (Paso 2 abajo)

### Error: "Project not found" o "Organization not found"
**Solución:** Configurar proyecto en SonarCloud (Paso 3 abajo)

### Error: "Invalid token"
**Solución:** Regenerar token y actualizar el secret

---

## 📝 Pasos de Configuración

### Paso 2: Agregar Secret en GitHub (Si no existe)

1. **Ir a:**
   - https://github.com/arangua/paes-tutor/settings/secrets/actions

2. **Click en "New repository secret"**

3. **Configurar:**
   - **Name:** `SONAR_TOKEN`
   - **Secret:** Tu token de SonarCloud
   - **Click en "Add secret"**

### Paso 3: Configurar Proyecto en SonarCloud (Si no está configurado)

1. **Ir a SonarCloud:**
   - https://sonarcloud.io/

2. **Click en "+" o "Add new project"**

3. **Seleccionar:**
   - "From GitHub"
   - Organización: `arangua`
   - Repositorio: `paes-tutor`
   - Click en "Set Up"

4. **Elegir método:**
   - Seleccionar: **"With GitHub Actions"** (logo de GitHub Actions)

5. **SonarCloud detectará automáticamente:**
   - El workflow existente (`.github/workflows/sonarcloud.yml`)
   - La configuración (`sonar-project.properties`)

---

## 🚀 Después de Configurar

Una vez que todo esté configurado, forzar un nuevo análisis:

```bash
git commit --allow-empty -m "Retry SonarCloud after configuration"
git push origin main
```

O ejecutar manualmente desde GitHub Actions.

