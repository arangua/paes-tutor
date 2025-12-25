# 🔍 Diagnóstico: SonarQube Analizando Directorio Incorrecto

**Fecha:** 2025-12-23  
**Problema:** SonarQube está ejecutando tareas en `OneDrive/Escritorio/PROY. SLA/c2-servel-v3/src/hooks/__tests__/` en lugar del proyecto actual `paes-tutor`

---

## 🔴 Problema Identificado

SonarQube está analizando un proyecto diferente (`c2-servel-v3`) en lugar del proyecto actual (`paes-tutor`).

**Ruta incorrecta detectada:**
```
OneDrive/Escritorio/PROY. SLA/c2-servel-v3/src/hooks/__tests__/
```

**Ruta esperada:**
```
OneDrive/Escritorio/PROY. PAES/paes-tutor/paes-tutor/src/
```

---

## 🔍 Posibles Causas

### 1. Configuración Global de SonarQube
SonarQube puede tener una configuración global en:
- `%USERPROFILE%\.sonar\cache\`
- Variables de entorno del sistema
- Archivo de configuración en otro directorio

### 2. Directorio de Trabajo Incorrecto
El comando podría estar ejecutándose desde otro directorio.

### 3. Archivo de Configuración en Otro Proyecto
Podría haber un `sonar-project.properties` en el directorio padre o en otro proyecto que esté siendo usado.

---

## ✅ Soluciones

### Solución 1: Verificar y Limpiar Configuración Global

```powershell
# Verificar caché de SonarQube
Get-ChildItem -Path "$env:USERPROFILE\.sonar" -Recurse -ErrorAction SilentlyContinue

# Limpiar caché si es necesario
Remove-Item -Path "$env:USERPROFILE\.sonar\cache\*" -Recurse -Force -ErrorAction SilentlyContinue
```

### Solución 2: Ejecutar desde el Directorio Correcto

```powershell
# Asegurarse de estar en el directorio correcto
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"

# Verificar que estamos en el lugar correcto
Get-Location
Get-ChildItem sonar-project.properties

# Ejecutar SonarQube desde aquí
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
npx sonar-scanner
```

### Solución 3: Especificar Ruta Absoluta en Configuración

Agregar al `sonar-project.properties`:

```properties
# Forzar directorio base del proyecto
sonar.projectBaseDir=C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor
```

**Nota:** Esto puede causar problemas si el proyecto se mueve. Mejor usar rutas relativas.

### Solución 4: Usar Análisis Manual (Recomendado)

Dado que no hay servidor de SonarQube configurado, usar el análisis manual ya generado:
- `ANALISIS_SONARQUBE_COMPLETO_2025_12_23.md`
- `REVISION_CODIGO_FINAL_2025_12_23.md`

---

## 🎯 Recomendación

**Para este proyecto, usar el análisis manual** que ya generamos, ya que:
1. ✅ No requiere servidor de SonarQube
2. ✅ No requiere configuración adicional
3. ✅ Ya identifica todos los problemas
4. ✅ Incluye recomendaciones detalladas

**Si necesitas SonarQube real:**
1. Configurar SonarCloud (recomendado)
2. O configurar servidor local de SonarQube
3. Asegurarse de ejecutar desde el directorio correcto

---

## 📋 Checklist de Verificación

- [ ] Verificar directorio de trabajo actual
- [ ] Verificar que `sonar-project.properties` está en el directorio correcto
- [ ] Limpiar caché de SonarQube si es necesario
- [ ] Ejecutar desde el directorio correcto del proyecto
- [ ] Verificar que no hay otros archivos `sonar-project.properties` en directorios padre

---

**Estado:** ⚠️ **Problema identificado - Usar análisis manual o configurar SonarQube correctamente**

