# 📊 CONFIGURACIÓN DE MONITOREO - PAES TUTOR

**Fecha:** 2025-01-28  
**Estado:** ⚠️ **BÁSICO** - Sistema de logs implementado, integración externa pendiente

---

## 📋 ESTADO ACTUAL

### ✅ Implementado

1. **Sistema de Logging Estructurado**
   - ✅ Logger con Pino (`src/lib/logger.ts`)
   - ✅ Logs estructurados en formato JSON
   - ✅ Niveles de log (info, warn, error, debug)

2. **Sistema de Monitoreo Básico**
   - ✅ `MetricsTracker` - Tracking de métricas
   - ✅ `ErrorTracker` - Tracking de errores
   - ✅ `PerformanceTracker` - Tracking de performance
   - ✅ `MonitoringService` - Servicio centralizado

3. **Performance Monitoring**
   - ✅ `performance-monitor.ts` - Monitoreo de performance
   - ✅ Alertas de performance configuradas
   - ✅ Métricas de validación integradas

### ⚠️ Pendiente

1. **Integración con Servicios Externos**
   - ❌ Sentry (para tracking de errores)
   - ❌ DataDog (para métricas y APM)
   - ❌ PagerDuty (para alertas críticas)
   - ❌ Slack/Discord (para notificaciones)

2. **Alertas Configuradas**
   - ⚠️ Alertas solo en logs (no notificaciones)
   - ❌ Alertas por email/Slack
   - ❌ Alertas por PagerDuty

3. **Dashboards**
   - ❌ Dashboard de métricas
   - ❌ Dashboard de errores
   - ❌ Dashboard de performance

---

## 🔧 CONFIGURACIÓN RECOMENDADA

### Opción 1: Sentry (Recomendado para Errores)

**Ventajas:**
- ✅ Gratis hasta 5,000 eventos/mes
- ✅ Fácil de integrar
- ✅ Tracking de errores en tiempo real
- ✅ Stack traces completos
- ✅ Source maps para debugging

**Pasos de Integración:**

1. **Instalar dependencias:**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configurar Sentry:**
   ```typescript
   // sentry.client.config.ts
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
     debug: false,
   });
   ```

3. **Integrar con MonitoringService:**
   ```typescript
   // src/lib/monitoring.ts
   import * as Sentry from "@sentry/nextjs";

   export class ErrorTracker {
     track(error: ErrorData): void {
       // ... código existente ...
       
       // Enviar a Sentry
       if (error.severity === 'critical' || error.severity === 'high') {
         Sentry.captureException(error.error, {
           level: error.severity === 'critical' ? 'fatal' : 'error',
           tags: error.context,
         });
       }
     }
   }
   ```

4. **Variables de entorno:**
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_AUTH_TOKEN=xxx
   SENTRY_ORG=tu-org
   SENTRY_PROJECT=paes-tutor
   ```

**Documentación:** https://docs.sentry.io/platforms/javascript/guides/nextjs/

---

### Opción 2: DataDog (Recomendado para Métricas y APM)

**Ventajas:**
- ✅ Métricas en tiempo real
- ✅ APM completo
- ✅ Dashboards personalizables
- ✅ Alertas avanzadas

**Pasos de Integración:**

1. **Instalar dependencias:**
   ```bash
   npm install dd-trace
   ```

2. **Configurar DataDog:**
   ```typescript
   // datadog.ts
   import tracer from 'dd-trace';
   
   tracer.init({
     service: 'paes-tutor',
     env: process.env.NODE_ENV,
     version: process.env.npm_package_version,
   });
   ```

3. **Integrar con MonitoringService:**
   ```typescript
   // src/lib/monitoring.ts
   import tracer from 'dd-trace';

   export class MetricsTracker {
     track(metric: MetricData): void {
       // ... código existente ...
       
       // Enviar a DataDog
       tracer.dogstatsd.gauge(metric.name, metric.value, {
         tags: Object.entries(metric.tags || {}).map(([k, v]) => `${k}:${v}`),
       });
     }
   }
   ```

4. **Variables de entorno:**
   ```env
   DD_API_KEY=xxx
   DD_SITE=datadoghq.com
   DD_SERVICE=paes-tutor
   DD_ENV=production
   ```

**Documentación:** https://docs.datadoghq.com/tracing/setup_overview/setup/nodejs/

---

### Opción 3: Vercel Analytics (Si usas Vercel)

**Ventajas:**
- ✅ Integrado con Vercel
- ✅ Métricas de performance automáticas
- ✅ Web Vitals tracking

**Pasos de Integración:**

1. **Instalar dependencias:**
   ```bash
   npm install @vercel/analytics
   ```

2. **Agregar a la app:**
   ```typescript
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

**Documentación:** https://vercel.com/docs/analytics

---

## 🚨 CONFIGURACIÓN DE ALERTAS

### Alertas Críticas (Inmediatas)

Configurar alertas para:

1. **Errores Críticos**
   - Tasa de error >5%
   - Errores 500 >10 en 5 minutos
   - Errores de autenticación

2. **Performance**
   - Tiempo de respuesta >2s (p95)
   - CPU >80%
   - Memoria >90%

3. **Disponibilidad**
   - Health check falla
   - Base de datos inaccesible
   - Caché inaccesible

### Alertas de Advertencia

1. **Degradación de Performance**
   - Tiempo de respuesta >1s (p95)
   - CPU >60%
   - Memoria >70%

2. **Errores Moderados**
   - Tasa de error >1%
   - Errores 4xx >50 en 10 minutos

---

## 📊 DASHBOARDS RECOMENDADOS

### Dashboard Principal

1. **Métricas de Salud**
   - Tasa de error
   - Tiempo de respuesta (p50, p95, p99)
   - Requests por minuto
   - Health check status

2. **Métricas de Performance**
   - CPU usage
   - Memoria usage
   - Tiempo de respuesta por endpoint
   - Throughput

3. **Métricas de Negocio**
   - Usuarios activos
   - Exámenes completados
   - Intentos creados
   - Conversión

### Dashboard de Errores

1. **Errores por Tipo**
   - Errores 500
   - Errores 400
   - Errores de base de datos
   - Errores de caché

2. **Errores por Endpoint**
   - Top 10 endpoints con errores
   - Tasa de error por endpoint
   - Tiempo de respuesta por endpoint

---

## 🔄 INTEGRACIÓN CON CÓDIGO EXISTENTE

### Actualizar `sendPerformanceAlertsToMonitoring`

```typescript
// src/app/api/notes/versions/performance-monitor.ts

export function sendPerformanceAlertsToMonitoring(
  alerts: PerformanceAlert[],
  metadata?: Record<string, unknown>
): void {
  try {
    // ... código existente ...

    const criticalAlerts = filterAlertsByLevel(alerts, PerformanceAlertLevel.CRITICAL)
    
    if (hasAlerts(criticalAlerts) && isProduction()) {
      // Log existente
      logger.error(
        {
          type: 'performance_alert',
          alerts: criticalAlerts,
          validationMetrics,
          ...metadata,
        },
        'ALERTA CRÍTICA DE PERFORMANCE - Requiere atención inmediata'
      )
      
      // NUEVO: Enviar a Sentry
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        import('@sentry/nextjs').then((Sentry) => {
          Sentry.captureMessage('ALERTA CRÍTICA DE PERFORMANCE', {
            level: 'error',
            tags: {
              type: 'performance_alert',
              alertCount: criticalAlerts.length,
            },
            extra: {
              alerts: criticalAlerts,
              validationMetrics,
              ...metadata,
            },
          });
        }).catch(() => {
          // Silenciar error si Sentry no está disponible
        });
      }
      
      // NUEVO: Enviar a Slack (opcional)
      if (process.env.SLACK_WEBHOOK_URL) {
        sendSlackAlert(criticalAlerts, metadata).catch(() => {
          // Silenciar error si Slack falla
        });
      }
    }
  } catch (error) {
    // ... código existente ...
  }
}
```

---

## 📋 CHECKLIST DE CONFIGURACIÓN

### Pre-Producción

- [ ] **Elegir servicio de monitoreo** (Sentry, DataDog, o Vercel Analytics)
- [ ] **Crear cuenta** en el servicio elegido
- [ ] **Instalar dependencias** necesarias
- [ ] **Configurar variables de entorno**
- [ ] **Integrar con código existente**
- [ ] **Configurar alertas básicas**
- [ ] **Probar en staging**

### Post-Producción (Primera Semana)

- [ ] **Configurar dashboards**
- [ ] **Ajustar umbrales de alertas** según datos reales
- [ ] **Configurar notificaciones** (email, Slack, etc.)
- [ ] **Documentar procedimientos** de respuesta a alertas
- [ ] **Revisar métricas diariamente**

---

## 🎯 RECOMENDACIÓN FINAL

### Para Lanzamiento Inicial:

**Mínimo Viable:**
1. ✅ **Sistema de logs** (ya implementado)
2. ⚠️ **Sentry básico** (2-3 horas de configuración)
3. ⚠️ **Alertas por email** (1 hora)

**Ideal:**
1. ✅ **Sentry** para errores
2. ✅ **Vercel Analytics** (si usas Vercel) para métricas
3. ✅ **Slack webhook** para notificaciones

**No crítico para lanzamiento:**
- DataDog (puede agregarse después)
- Dashboards avanzados (pueden crearse después)
- PagerDuty (solo si hay equipo 24/7)

---

## 📚 RECURSOS

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [DataDog Node.js Docs](https://docs.datadoghq.com/tracing/setup_overview/setup/nodejs/)
- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Pino Logger Docs](https://getpino.io/)

---

**Última actualización:** 2025-01-28  
**Próxima revisión:** Post-deployment

