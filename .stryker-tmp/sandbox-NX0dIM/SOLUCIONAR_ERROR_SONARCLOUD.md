# 🔧 Solucionar Error de SonarCloud

## 🔴 Problema Identificado

El análisis de SonarCloud está fallando. SonarCloud muestra:
- "The last analysis has failed"
- Pide elegir un método de análisis

## 🔍 Posibles Causas

### 1. Secret SONAR_TOKEN no configurado
El workflow necesita el token de SonarCloud en los secrets de GitHub.

### 2. Proyecto no configurado en SonarCloud
El proyecto puede no estar correctamente vinculado.

### 3. Token inválido o expirado
El token puede haber expirado o ser incorrecto.

## ✅ Solución Paso a Paso

### Paso 1: Obtener Token de SonarCloud

1. **Ir a SonarCloud:**
   - https://sonarcloud.io/
   - Iniciar sesión con GitHub

2. **Ir a tu perfil:**
   - Click en tu avatar (arriba a la derecha)
   - Click en "My Account"

3. **Generar Token:**
   - Click en "Security" (o "Tokens")
   - Click en "Generate Token"
   - Nombre: `paes-tutor-github-actions`
   - Tipo: "Global Analysis Token"
   - Click en "Generate"
   - **⚠️ IMPORTANTE: Copia el token inmediatamente (solo se muestra una vez)**

### Paso 2: Configurar Secret en GitHub

1. **Ir a tu repositorio en GitHub:**
   - https://github.com/arangua/paes-tutor

2. **Ir a Settings:**
   - Click en "Settings" (arriba del repositorio)

3. **Ir a Secrets:**
   - En el menú lateral: "Secrets and variables"
   - Click en "Actions"

4. **Agregar Secret:**
   - Click en "New repository secret"
   - **Name:** `SONAR_TOKEN`
   - **Secret:** Pega el token que copiaste de SonarCloud
   - Click en "Add secret"

### Paso 3: Configurar Proyecto en SonarCloud

1. **Ir a SonarCloud:**
   - https://sonarcloud.io/

2. **Agregar Proyecto:**
   - Click en "+" (arriba) o "Add new project"
   - Seleccionar "From GitHub"
   - Seleccionar tu organización: `arangua`
   - Buscar y seleccionar: `paes-tutor`
   - Click en "Set Up"

3. **Elegir Método de Análisis:**
   - Seleccionar: **"With GitHub Actions"** (logo de GitHub Actions)
   - SonarCloud detectará automáticamente el workflow existente

4. **Verificar Configuración:**
   - SonarCloud mostrará los pasos
   - Verificar que el `sonar-project.properties` esté correcto
   - El `projectKey` debe ser: `paes-tutor`
   - La `organization` debe ser: `arangua`

### Paso 4: Verificar sonar-project.properties

Asegúrate de que el archivo tenga:

```properties
sonar.projectKey=paes-tutor
sonar.organization=arangua
```

### Paso 5: Forzar Nuevo Análisis

Una vez configurado todo:

1. **Hacer commit vacío:**
   ```bash
   git commit --allow-empty -m "Retry SonarCloud analysis after configuration"
   git push origin main
   ```

2. **O ejecutar manualmente desde GitHub:**
   - Ir a: https://github.com/arangua/paes-tutor/actions
   - Click en "SonarCloud Analysis"
   - Click en "Run workflow"

## 🔍 Verificar que Funciona

### En GitHub Actions:
1. Ir a: https://github.com/arangua/paes-tutor/actions
2. Ver el workflow "SonarCloud Analysis"
3. Debería ejecutarse sin errores

### En SonarCloud:
1. Ir a: https://sonarcloud.io/project/overview?id=paes-tutor
2. Deberías ver "Last analysis: [fecha reciente]"
3. Deberías ver métricas y resultados

## ⚠️ Errores Comunes

### Error: "Invalid token"
- **Solución:** Regenerar token en SonarCloud y actualizar el secret en GitHub

### Error: "Project not found"
- **Solución:** Verificar que el proyecto esté agregado en SonarCloud y que `projectKey` coincida

### Error: "Organization not found"
- **Solución:** Verificar que la organización `arangua` exista en SonarCloud

---

## 🎯 Checklist de Verificación

- [ ] Token de SonarCloud generado
- [ ] Secret `SONAR_TOKEN` agregado en GitHub
- [ ] Proyecto agregado en SonarCloud
- [ ] Método de análisis seleccionado: "With GitHub Actions"
- [ ] `sonar-project.properties` tiene `projectKey` y `organization` correctos
- [ ] Workflow ejecutado y completado exitosamente

