# 🔧 Configurar SonarCloud con GitHub Actions

## 📋 Pasos para Configurar

### Paso 1: Agregar Secret en GitHub

1. **Ir a tu repositorio en GitHub**
   - https://github.com/arangua/paes-tutor

2. **Ir a Settings**
   - Click en "Settings" (arriba del repositorio)

3. **Ir a Secrets and variables → Actions**
   - En el menú lateral izquierdo
   - Click en "Secrets and variables"
   - Click en "Actions"

4. **Agregar Secret**
   - Click en "New repository secret"
   - **Name:** `SONAR_TOKEN`
   - **Secret:** Pega tu token de SonarCloud: `c8a0b2a435f6c6c62f8f1ad16eb33cae4b50b2c1`
   - Click en "Add secret"

### Paso 2: Configurar en SonarCloud

1. **Ir a SonarCloud**
   - https://sonarcloud.io/
   - Ve a tu proyecto: `arangua/paes-tutor`

2. **Elegir Método de Análisis**
   - En la página del proyecto, verás: "Choose your Analysis Method"
   - Selecciona: **"With GitHub Actions"** (el logo de GitHub Actions)

3. **Seguir las Instrucciones**
   - SonarCloud te mostrará los pasos
   - Ya creamos el archivo `.github/workflows/sonarcloud.yml`
   - Solo necesitas agregar el secret `SONAR_TOKEN` en GitHub (Paso 1)

### Paso 3: Verificar Configuración

El workflow se ejecutará automáticamente cuando:
- Hagas push a las ramas `main` o `develop`
- Crees un Pull Request hacia `main` o `develop`

---

## ✅ Archivo Creado

He creado el archivo `.github/workflows/sonarcloud.yml` que:
- ✅ Se ejecuta automáticamente en push y PRs
- ✅ Genera cobertura de tests
- ✅ Ejecuta análisis de SonarCloud
- ✅ Usa el token desde GitHub Secrets

---

## 🚀 Próximos Pasos

1. **Agregar el secret `SONAR_TOKEN` en GitHub** (Paso 1 arriba)
2. **Elegir "With GitHub Actions" en SonarCloud** (Paso 2 arriba)
3. **Hacer un commit y push** para activar el workflow:

```powershell
git add .github/workflows/sonarcloud.yml
git commit -m "Add SonarCloud GitHub Actions workflow"
git push origin main
```

---

## 📊 Ver Resultados

Una vez configurado:
- **GitHub Actions:** Ve a la pestaña "Actions" en tu repositorio
- **SonarCloud:** Ve a https://sonarcloud.io/dashboard?id=paes-tutor

---

## 🔍 Verificar que Funciona

Después de hacer push, verás:
1. Un workflow ejecutándose en GitHub Actions
2. El análisis completándose en SonarCloud
3. Resultados actualizados en el dashboard

---

**¿Necesitas ayuda con algún paso?**

