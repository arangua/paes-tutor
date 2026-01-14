# 📚 Información Importante de DEMRE para Mejorar PAES Tutor

**Fecha:** 2025-12-26  
**Fuente:** https://demre.cl/

---

## 🎯 Resumen Ejecutivo

El sitio oficial de DEMRE contiene información valiosa que puede mejorar significativamente el PAES Tutor, especialmente en términos de:
- **Alineación con temarios oficiales**
- **Información sobre fechas y calendarios**
- **Estructura real de las pruebas**
- **Recursos oficiales disponibles**
- **Tablas de transformación de puntajes**

---

## 📋 Información Clave Disponible en DEMRE

### 1. **Temarios Oficiales de las Pruebas** ⭐⭐⭐

**Ubicación:** https://www.psu.demre.cl/la-prueba/pruebas-y-temarios/

**Información Disponible:**
- Temarios vigentes para el proceso de admisión 2025/2026
- Elaborados en conjunto con la Unidad de Currículum y Evaluación (UCE) del MINEDUC
- Detallan conocimientos y habilidades evaluadas en cada prueba
- Aseguran pertinencia y relevancia para la educación superior

**Recomendación para PAES Tutor:**
- ✅ **Integrar temarios oficiales** en la generación de exámenes
- ✅ **Validar que los temas cubiertos** estén alineados con los temarios oficiales
- ✅ **Actualizar automáticamente** cuando se publiquen nuevos temarios
- ✅ **Mostrar a los estudiantes** qué temas están cubiertos según el temario oficial

**Implementación Sugerida:**
```typescript
// Agregar campo de temario oficial a los temas
interface Topic {
  // ... campos existentes
  temarioOficial?: {
    codigo: string
    descripcion: string
    habilidades: string[]
    vigenciaDesde: string
    vigenciaHasta?: string
  }
}
```

---

### 2. **Simulaciones PAES (Pilotos)** ⭐⭐⭐

**Ubicación:** https://www.psu.demre.cl/la-prueba/prueba-simulaciones-paes/

**Información Disponible:**
- Simulaciones oficiales que permiten practicar
- Familiarización con el tipo de preguntas reales
- Retroalimentación sobre preguntas evaluadas
- Contribuyen al proceso de mejora continua

**Recomendación para PAES Tutor:**
- ✅ **Importar simulaciones oficiales** como exámenes de práctica
- ✅ **Marcar claramente** qué exámenes son simulaciones oficiales vs. generados
- ✅ **Usar simulaciones como referencia** para validar la calidad de exámenes generados
- ✅ **Ofrecer simulaciones** como preparación específica antes de la PAES real

**Implementación Sugerida:**
```typescript
// Agregar campo para identificar simulaciones oficiales
interface Exam {
  // ... campos existentes
  esSimulacionOficial?: boolean
  fuenteSimulacion?: string // URL o referencia a DEMRE
  fechaSimulacion?: Date
}
```

---

### 3. **Fechas y Calendarios del Proceso de Admisión** ⭐⭐

**Ubicación:** Sección "Calendario" en la página principal de DEMRE

**Información Disponible:**
- Fechas importantes del proceso de admisión
- Horarios de aplicación de las PAES
- Fechas de publicación de resultados
- Fechas de postulación
- Fechas límite para diferentes etapas

**Ejemplo de Fechas (Proceso 2026):**
- **5 de enero:** Resultados de Puntajes PAES Regular - 08:00 hrs.
- **5 de enero:** Inicio Etapa de Postulaciones - 09:00 hrs.
- **8 de enero:** Finaliza Etapa de Postulaciones - 13:00 hrs.

**Recomendación para PAES Tutor:**
- ✅ **Integrar calendario oficial** en el dashboard
- ✅ **Recordatorios automáticos** de fechas importantes
- ✅ **Planificación de estudio** basada en fechas reales
- ✅ **Contador regresivo** hacia la fecha de la PAES
- ✅ **Sincronización automática** con el calendario oficial de DEMRE

**Implementación Sugerida:**
```typescript
// Nuevo modelo para calendario
interface AdmissionCalendar {
  id: string
  proceso: string // "2026", "2027", etc.
  eventos: Array<{
    fecha: Date
    hora?: string
    titulo: string
    descripcion: string
    tipo: 'resultados' | 'postulacion' | 'aplicacion' | 'otro'
    importante: boolean
  }>
}
```

---

### 4. **Oferta Definitiva de Carreras, Vacantes y Ponderaciones** ⭐⭐⭐

**Ubicación:** https://portaldemre.demre.cl/publicaciones/pdf/

**Información Disponible:**
- Carreras ofrecidas por universidades
- Número de vacantes por carrera
- Ponderaciones de factores de selección (NEM, Ranking, PAES)
- Información oficial para postulación centralizada

**Recomendación para PAES Tutor:**
- ✅ **Integrar calculadora de puntaje ponderado** basada en ponderaciones reales
- ✅ **Mostrar carreras disponibles** y sus requisitos
- ✅ **Simulador de postulación** con ponderaciones reales
- ✅ **Recomendaciones de carreras** basadas en rendimiento y ponderaciones
- ✅ **Información sobre vacantes** y competencia

**Implementación Sugerida:**
```typescript
// Nuevo modelo para carreras y ponderaciones
interface Career {
  id: string
  nombre: string
  universidad: string
  vacantes: number
  ponderaciones: {
    nem: number
    ranking: number
    lectora: number
    m1: number
    m2?: number
    ciencias?: number // BIO, FIS o QUI
    historia?: number
  }
  requisitos?: {
    puntajeMinimo?: number
    pruebasRequeridas: string[]
  }
}
```

---

### 5. **Tablas de Transformación de Puntajes** ⭐⭐

**Ubicación:** Enlaces en la página principal de DEMRE

**Información Disponible:**
- Tabla de transformación NEM (Notas de Enseñanza Media)
- Tabla de transformación de puntajes PAES
- Conversión entre escalas antiguas (PSU, PDT) y PAES
- Información para calcular puntajes ponderados

**Recomendación para PAES Tutor:**
- ✅ **Integrar calculadora de transformación** de puntajes
- ✅ **Mostrar equivalencias** entre diferentes escalas
- ✅ **Calcular puntajes ponderados** automáticamente
- ✅ **Simular diferentes escenarios** de puntajes

**Implementación Sugerida:**
```typescript
// Funciones de transformación
interface ScoreTransformation {
  transformNEM(nem: number): number
  transformPAES(puntaje: number, prueba: string): number
  calculateWeightedScore(
    nem: number,
    ranking: number,
    puntajesPAES: Record<string, number>,
    ponderaciones: Career['ponderaciones']
  ): number
}
```

---

### 6. **Informes Técnicos y Resultados** ⭐⭐

**Ubicación:** https://www.psu.demre.cl/estadisticas/

**Información Disponible:**
- Informes técnicos detallados sobre las pruebas
- Características de construcción de las pruebas
- Análisis de aplicación y resultados
- Estadísticas de rendimiento por prueba
- Análisis de dificultad de preguntas

**Recomendación para PAES Tutor:**
- ✅ **Usar estadísticas oficiales** para validar dificultad de preguntas
- ✅ **Comparar rendimiento del estudiante** con estadísticas nacionales
- ✅ **Ajustar dificultad** de exámenes según estadísticas reales
- ✅ **Mostrar percentiles** basados en datos oficiales

**Implementación Sugerida:**
```typescript
// Integrar estadísticas oficiales
interface OfficialStatistics {
  prueba: string
  año: number
  estadisticas: {
    promedio: number
    desviacionEstandar: number
    percentiles: Record<number, number> // {50: 650, 75: 720, etc.}
    distribucionDificultad: {
      facil: number
      media: number
      dificil: number
    }
  }
}
```

---

### 7. **Preguntas Frecuentes y Medios de Ayuda** ⭐

**Ubicación:** Sección "Medios de ayuda y preguntas frecuentes" en DEMRE

**Información Disponible:**
- Preguntas frecuentes sobre el proceso
- Información sobre inclusión (PeSD y NEE)
- Contacto y soporte
- Teléfono: +56 2 2978 3806

**Recomendación para PAES Tutor:**
- ✅ **Integrar FAQ oficial** en la aplicación
- ✅ **Información sobre inclusión** y adaptaciones
- ✅ **Enlaces a recursos oficiales** de ayuda

---

### 8. **Videos Instructivos** ⭐

**Ubicación:** Sección "Videos" en la página principal

**Información Disponible:**
- Instructivos sobre uso del Portal de Postulación
- Charlas y recomendaciones para rendir la PAES
- Guías paso a paso del proceso

**Recomendación para PAES Tutor:**
- ✅ **Integrar videos oficiales** como material de estudio
- ✅ **Enlaces a recursos oficiales** de DEMRE
- ✅ **Sección de "Cómo prepararse"** con recursos oficiales

---

### 9. **Base de Datos Abierta** ⭐⭐

**Ubicación:** Portal de datos abiertos de DEMRE

**Información Disponible:**
- Resultados PAES por colegio
- Datos históricos de rendimiento
- Estadísticas públicas

**Recomendación para PAES Tutor:**
- ✅ **Integrar datos abiertos** para análisis comparativo
- ✅ **Mostrar rendimiento relativo** al colegio o región
- ✅ **Tendencias históricas** de rendimiento

---

### 10. **Universidades Participantes** ⭐

**Ubicación:** Enlace en la página principal

**Información Disponible:**
- Lista de universidades que participan en el proceso
- Información sobre cada institución
- Requisitos específicos

**Recomendación para PAES Tutor:**
- ✅ **Lista de universidades** con información relevante
- ✅ **Filtros por universidad** en recomendaciones de carreras
- ✅ **Información sobre requisitos** específicos

---

## 🎯 Priorización de Implementación

### **Prioridad ALTA** ⭐⭐⭐

1. **Temarios Oficiales**
   - Impacto: Crítico para alineación con PAES real
   - Esfuerzo: Medio
   - Valor: Muy alto

2. **Simulaciones Oficiales**
   - Impacto: Alto - Material de práctica oficial
   - Esfuerzo: Bajo (importación)
   - Valor: Muy alto

3. **Calculadora de Puntajes Ponderados**
   - Impacto: Alto - Funcionalidad muy solicitada
   - Esfuerzo: Medio
   - Valor: Alto

### **Prioridad MEDIA** ⭐⭐

4. **Calendario del Proceso**
   - Impacto: Medio - Mejora UX
   - Esfuerzo: Bajo
   - Valor: Medio

5. **Tablas de Transformación**
   - Impacto: Medio - Útil para algunos estudiantes
   - Esfuerzo: Bajo
   - Valor: Medio

6. **Estadísticas Oficiales**
   - Impacto: Medio - Mejora análisis
   - Esfuerzo: Medio
   - Valor: Medio

### **Prioridad BAJA** ⭐

7. **Base de Datos Abierta**
   - Impacto: Bajo - Nice to have
   - Esfuerzo: Alto
   - Valor: Bajo

8. **Videos y FAQ**
   - Impacto: Bajo - Enlaces simples
   - Esfuerzo: Muy bajo
   - Valor: Bajo

---

## 📝 Plan de Acción Sugerido

### Fase 1: Integración de Temarios (2-3 semanas)
- [ ] Investigar estructura de temarios oficiales
- [ ] Crear modelo de datos para temarios
- [ ] Importar temarios vigentes
- [ ] Validar alineación de temas existentes
- [ ] Actualizar generador de exámenes para usar temarios

### Fase 2: Simulaciones Oficiales (1 semana)
- [ ] Crear funcionalidad de importación de simulaciones
- [ ] Marcar exámenes como "oficiales" vs "generados"
- [ ] Importar simulaciones disponibles
- [ ] UI para distinguir tipos de exámenes

### Fase 3: Calculadora de Puntajes (2 semanas)
- [ ] Investigar estructura de ponderaciones
- [ ] Crear modelo de datos para carreras
- [ ] Implementar calculadora de puntajes ponderados
- [ ] UI para simulador de postulación
- [ ] Integrar con resultados de exámenes

### Fase 4: Calendario y Recordatorios (1 semana)
- [ ] Crear modelo de calendario
- [ ] Importar fechas oficiales
- [ ] UI para mostrar calendario
- [ ] Sistema de recordatorios
- [ ] Contador regresivo

### Fase 5: Estadísticas y Comparación (2 semanas)
- [ ] Investigar acceso a estadísticas oficiales
- [ ] Crear modelo de estadísticas
- [ ] Implementar comparación con percentiles
- [ ] UI para mostrar estadísticas comparativas

---

## 🔗 Enlaces Importantes

- **Sitio Principal:** https://demre.cl/
- **Temarios:** https://www.psu.demre.cl/la-prueba/pruebas-y-temarios/
- **Simulaciones:** https://www.psu.demre.cl/la-prueba/prueba-simulaciones-paes/
- **Estadísticas:** https://www.psu.demre.cl/estadisticas/
- **Publicaciones:** https://demre.cl/publicaciones/
- **Portal de Postulación:** https://portaldemre.demre.cl/

---

## ✅ Conclusión

El sitio DEMRE contiene información valiosa que puede mejorar significativamente el PAES Tutor:

1. **Alineación oficial** con temarios y estructura real
2. **Material de práctica oficial** (simulaciones)
3. **Herramientas útiles** (calculadoras, calendarios)
4. **Datos comparativos** (estadísticas, percentiles)
5. **Información actualizada** sobre el proceso

**Recomendación:** Priorizar la integración de temarios oficiales y simulaciones, ya que tienen el mayor impacto en la calidad y relevancia del contenido educativo.

---

**Nota:** Esta información debe actualizarse periódicamente, ya que DEMRE publica nueva información cada año para el proceso de admisión correspondiente.

