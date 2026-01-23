# 📊 Guía de Configuración de SonarQube - PAES Tutor

## 🎯 Descripción

SonarQube es una plataforma de análisis estático de código que ayuda a detectar:

- 🐛 Bugs y errores
- 🔒 Vulnerabilidades de seguridad
- 💡 Code smells (malas prácticas)
- 📊 Cobertura de código
- 🔄 Duplicación de código

---

## 📦 Instalación

### Opción 1: SonarQube Cloud (Recomendado para empezar)

1. Crear cuenta en [SonarCloud](https://sonarcloud.io/)
2. Conectar con GitHub/GitLab
3. Agregar el proyecto
4. Obtener el token de autenticación

### Opción 2: SonarQube Server Local

1. Descargar SonarQube Server desde [sonarqube.org](https://www.sonarqube.org/downloads/)
2. Ejecutar el servidor
3. Acceder a `http://localhost:9000`
4. Crear proyecto y obtener token

### Instalar SonarScanner

```bash
# Windows (con Chocolatey)
choco install sonarscanner-msbuild-net46

# O descargar desde:
# https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
```

---

## ⚙️ Configuración

### 1. Archivo de Configuración

Ya está creado: `sonar-project.properties`

### 2. Variables de Entorno

Crear archivo `.env.local` o agregar a `.env`:

```env
# SonarQube Configuration
SONAR_TOKEN=tu_token_aqui
SONAR_HOST_URL=https://sonarcloud.io
# O para servidor local:
# SONAR_HOST_URL=http://localhost:9000
```

### 3. Scripts en package.json

Agregar scripts para ejecutar análisis:

```json
{
  "scripts": {
    "sonar": "sonar-scanner",
    "sonar:local": "sonar-scanner -Dsonar.host.url=http://localhost:9000",
    "test:coverage:sonar": "npm run test:coverage && npm run sonar"
  }
}
```

---

## 🚀 Uso

### 1. Generar Cobertura de Tests

```bash
npm run test:coverage
```

Esto genera `coverage/lcov.info` que SonarQube usará.

### 2. Ejecutar Análisis de SonarQube

```bash
# Con SonarCloud
npm run sonar

# Con servidor local
npm run sonar:local
```

### 3. Ver Resultados

- **SonarCloud:** Ir a tu proyecto en sonarcloud.io
- **Servidor Local:** Ir a http://localhost:9000

---

## 📊 Métricas Analizadas

### Calidad de Código

- ✅ Bugs detectados
- ⚠️ Vulnerabilidades de seguridad
- 💡 Code smells
- 📈 Deuda técnica

### Cobertura

- 📊 Cobertura de líneas
- 📊 Cobertura de funciones
- 📊 Cobertura de branches
- 📊 Cobertura de statements

### Duplicación

- 🔄 Bloques de código duplicados
- 📊 Porcentaje de duplicación

---

## 🎯 Reglas Configuradas

### Excluidos del Análisis

- `node_modules/`
- `dist/`, `.next/`
- `coverage/`
- Archivos de test (`*.test.ts`, `*.test.tsx`)
- Archivos de configuración
- `prisma/`, `e2e/`

### Cobertura

- Excluye archivos de test de la cobertura
- Usa reportes de `vitest` (lcov.info)

---

## 🔧 Integración con CI/CD

### GitHub Actions

Crear `.github/workflows/sonar.yml`:

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sonar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: SonarQube Scan
        uses: sonarsource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

## 📝 Notas Importantes

### Para SonarCloud

- Necesitas token de autenticación
- El proyecto debe estar en un repositorio Git
- Gratis para proyectos open source

### Para Servidor Local

- Requiere Java 11+
- Necesita base de datos (PostgreSQL recomendado)
- Más configuración inicial

### Cobertura de Tests

- SonarQube usa los reportes de `vitest`
- Asegúrate de ejecutar `npm run test:coverage` antes del análisis
- El archivo `coverage/lcov.info` debe existir

---

## 🎯 Próximos Pasos

1. **Configurar SonarCloud o servidor local**
2. **Obtener token de autenticación**
3. **Agregar token a variables de entorno**
4. **Ejecutar análisis inicial**
5. **Revisar y corregir issues encontrados**

---

## 📚 Recursos

- [Documentación de SonarQube](https://docs.sonarqube.org/)
- [SonarCloud](https://sonarcloud.io/)
- [Reglas de TypeScript](https://rules.sonarsource.com/typescript)
- [Integración con GitHub Actions](https://docs.sonarcloud.io/integrations/github/)

---

**Fecha:** 2025-01-28  
**Estado:** ✅ **Configuración básica lista**
