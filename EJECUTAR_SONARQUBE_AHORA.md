# 🚀 Ejecutar SonarQube Ahora - Guía Rápida

## ✅ Lo que ya tienes configurado

- ✅ GitHub Actions workflow (`.github/workflows/sonarcloud.yml`)
- ✅ Configuración de SonarCloud (`sonar-project.properties`)
- ✅ Scripts en `package.json` (`sonar`, `sonar:local`)

---

## 🎯 Opción 1: Ejecutar Localmente (Requiere Token)

Si tienes el token de SonarCloud configurado:

### Paso 1: Configurar Token (si no lo tienes)

```powershell
# Temporal (solo esta sesión)
$env:SONAR_TOKEN="tu_token_de_sonarcloud"
$env:SONAR_HOST_URL="https://sonarcloud.io"
```

**Obtener token:**
1. Ir a https://sonarcloud.io/
2. My Account → Security → Generate Token
3. Copiar el token

### Paso 2: Generar Cobertura

```powershell
npm run test:coverage
```

### Paso 3: Ejecutar Análisis

```powershell
npx sonar-scanner "-Dsonar.host.url=https://sonarcloud.io" "-Dsonar.login=$env:SONAR_TOKEN"
```

O si tienes el token en variables de entorno:
```powershell
npm run sonar
```

---

## 🎯 Opción 2: Ver Resultados en SonarCloud (Si ya se ejecutó)

Si el análisis ya se ejecutó antes (por GitHub Actions o manualmente):

1. **Ir a SonarCloud:**
   - https://sonarcloud.io/
   - Buscar proyecto: `arangua/paes-tutor` o `paes-tutor`

2. **Ver Issues:**
   - Click en "Issues" en el menú
   - Ver todos los problemas encontrados

3. **Compartir conmigo:**
   - Copiar la URL del proyecto
   - O exportar los issues como CSV/JSON
   - O hacer screenshot de los problemas principales

---

## 🎯 Opción 3: Ejecutar a través de GitHub Actions

Si el repositorio está en GitHub:

### Paso 1: Inicializar Git (si no está inicializado)

```powershell
git init
git remote add origin https://github.com/arangua/paes-tutor.git
```

### Paso 2: Hacer Commit y Push

```powershell
git add .
git commit -m "Trigger SonarCloud analysis"
git push origin main
```

Esto activará automáticamente el workflow de GitHub Actions que ejecutará SonarQube.

### Paso 3: Ver Resultados

1. **En GitHub:**
   - Ir a la pestaña "Actions"
   - Ver el workflow ejecutándose

2. **En SonarCloud:**
   - Los resultados aparecerán automáticamente
   - https://sonarcloud.io/dashboard?id=paes-tutor

---

## 🎯 Opción 4: Usar Análisis Manual (Más Rápido)

Ya tienes un análisis completo en:
- `ANALISIS_SONARQUBE_COMPLETO_2025_12_23_ACTUALIZADO.md`

**Puedo corregir los problemas identificados ahí directamente:**
- ✅ Función muy larga (`generateExamWithAI`)
- ✅ Magic numbers (12 instancias)
- ✅ Duplicación de código (3 áreas)
- ✅ Manejo de errores en desencriptación
- ✅ Uso de `any` en tipos

---

## 🔍 Verificar Estado Actual

### ¿Tienes token configurado?

```powershell
# Verificar si está configurado
$env:SONAR_TOKEN
$env:SONAR_HOST_URL
```

### ¿Tienes cobertura generada?

```powershell
Test-Path coverage/lcov.info
```

### ¿Puedes ejecutar sonar-scanner?

```powershell
npx sonar-scanner --version
```

---

## 🚀 Recomendación

**Para empezar rápido:**
1. **Opción 4:** Corregir problemas del análisis manual (más rápido)
2. **Opción 2:** Ver resultados en SonarCloud si ya se ejecutó
3. **Opción 1:** Ejecutar localmente si tienes token
4. **Opción 3:** Ejecutar vía GitHub Actions si el repo está en GitHub

---

## 📝 ¿Qué prefieres hacer?

1. **Corregir problemas del análisis manual** (más rápido, sin configuración)
2. **Ver resultados en SonarCloud** (si ya se ejecutó antes)
3. **Ejecutar análisis ahora** (necesita token o GitHub configurado)
4. **Configurar todo desde cero** (te guío paso a paso)

¡Dime qué opción prefieres!

