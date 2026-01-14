# PAES-Tutor — Checklist de Mantención Mensual del Repositorio

**Frecuencia:** 1 vez al mes (o antes de hitos grandes)  
**Objetivo:** mantener la raíz limpia, documentación ordenada y repo sostenible.

---

## 1) Raíz del repositorio
- [ ] No existen `.md` nuevos en la raíz (excepto README.md)
- [ ] No existen `*.diff`, `*.backup*`, `*final*.md` en la raíz
- [ ] No existen carpetas generadas (`playwright-report/`, `.tmp/`)

**Comando rápido:**
```sh
ls *.md *.diff *final*.md *.backup* 2>/dev/null
```

---

## 2) Documentación (docs/)
- [ ] Documentos nuevos están bajo `docs/analysis/`, `docs/runbooks/`, `docs/history/` o `docs/archive/`
- [ ] `docs/README.md` refleja la estructura actual
- [ ] No hay duplicados evidentes por fecha/nombre

---

## 3) Artefactos generados
- [ ] `.gitignore` incluye artefactos de tests y temporales
- [ ] `git status` no muestra outputs generados

---

## 4) Scripts y tooling
- [ ] Los scripts en `scripts/` siguen siendo usados
- [ ] No hay scripts "one-off" antiguos sin propósito

---

## 5) Commit final de higiene
- [ ] Commits pequeños y descriptivos
- [ ] Mensaje recomendado: `chore: monthly repo hygiene`

---

## Registro

**Fecha:** _______________

**Responsable:** _______________

**Observaciones:**

___________________________________________________
