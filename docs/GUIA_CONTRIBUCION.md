# 👥 Guía de Contribución - PAES Tutor

## 🎯 Cómo Contribuir

### **1. Setup Inicial**

```bash
# Clonar repositorio
git clone <repo-url>
cd paes-tutor

# Instalar dependencias
npm install

# Configurar Husky
npm run prepare
```

### **2. Crear Branch**

```bash
git checkout -b feature/mi-feature
```

### **3. Desarrollo**

- ✅ Seguir `REGLAS_CODIGO.md`
- ✅ Usar funciones seguras
- ✅ Agregar tests
- ✅ Documentar cambios

### **4. Pre-Commit**

Los hooks de Husky ejecutarán automáticamente:

- ✅ Lint-staged (ESLint + Prettier)
- ✅ Validación de tipos
- ✅ Validación de console.log/debugger

### **5. Pre-Push**

Antes de push, se ejecutarán:

- ✅ Tests unitarios
- ✅ Cobertura de tests
- ✅ Build de producción
- ✅ Validación de issues críticos

### **6. Pull Request**

- ✅ Todos los checks de CI deben pasar
- ✅ Code review requerido
- ✅ Tests deben pasar
- ✅ Documentación actualizada

---

## 📋 Checklist de PR

- [ ] Código sigue `REGLAS_CODIGO.md`
- [ ] Tests agregados/actualizados
- [ ] Tests pasan (`npm run test:run`)
- [ ] Linter pasa (`npm run lint:strict`)
- [ ] Tipos válidos (`npm run validate:types`)
- [ ] Build funciona (`npm run build`)
- [ ] Documentación actualizada
- [ ] Sin console.log/debugger
- [ ] Sin secrets hardcodeados

---

## 🚫 No Hacer

- ❌ Commit sin pasar hooks
- ❌ Push sin pasar tests
- ❌ Usar `any` explícito
- ❌ Usar `console.log` en producción
- ❌ Hardcodear secrets
- ❌ Saltarse validaciones

---

## 📚 Referencias

- `ESTANDAR_ENTERPRISE.md` - Estándar completo
- `REGLAS_CODIGO.md` - Reglas de código
- `FASE_3_ENTERPRISE_PLAN_OPTIMIZADO.md` - Plan de Fase 3

---

**Última actualización:** $(date)

