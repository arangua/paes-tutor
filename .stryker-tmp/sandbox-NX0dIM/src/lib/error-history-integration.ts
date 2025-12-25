/**
 * Integración del historial de errores con el sistema de errores estructurado
 * Agrega automáticamente errores al historial cuando se muestran al usuario
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import type { ErrorMessage } from './error-messages';
import type { UserError } from '@/hooks/useErrorHistory';

/**
 * Convierte un ErrorMessage a UserError para el historial
 */
export function errorMessageToUserError(error: ErrorMessage, path?: string, context?: Record<string, unknown>): UserError {
  if (stryMutAct_9fa48("23659")) {
    {}
  } else {
    stryCov_9fa48("23659");
    return stryMutAct_9fa48("23660") ? {} : (stryCov_9fa48("23660"), {
      id: stryMutAct_9fa48("23661") ? `` : (stryCov_9fa48("23661"), `${error.code}-${Date.now()}-${stryMutAct_9fa48("23662") ? Math.random().toString(36) : (stryCov_9fa48("23662"), Math.random().toString(36).substr(2, 9))}`),
      timestamp: new Date().toISOString(),
      code: error.code,
      title: error.title,
      description: error.description,
      solution: error.solution,
      severity: error.severity,
      category: error.category,
      path: stryMutAct_9fa48("23665") ? path && (typeof window !== 'undefined' ? window.location.pathname : undefined) : stryMutAct_9fa48("23664") ? false : stryMutAct_9fa48("23663") ? true : (stryCov_9fa48("23663", "23664", "23665"), path || ((stryMutAct_9fa48("23668") ? typeof window === 'undefined' : stryMutAct_9fa48("23667") ? false : stryMutAct_9fa48("23666") ? true : (stryCov_9fa48("23666", "23667", "23668"), typeof window !== (stryMutAct_9fa48("23669") ? "" : (stryCov_9fa48("23669"), 'undefined')))) ? window.location.pathname : undefined)),
      context,
      resolved: stryMutAct_9fa48("23670") ? true : (stryCov_9fa48("23670"), false)
    });
  }
}

/**
 * Función helper para agregar error al historial desde el cliente
 * Esta función debe ser llamada desde componentes del cliente
 */
export function addErrorToHistory(error: ErrorMessage, path?: string, context?: Record<string, unknown>) {
  if (stryMutAct_9fa48("23671")) {
    {}
  } else {
    stryCov_9fa48("23671");
    if (stryMutAct_9fa48("23674") ? typeof window !== 'undefined' : stryMutAct_9fa48("23673") ? false : stryMutAct_9fa48("23672") ? true : (stryCov_9fa48("23672", "23673", "23674"), typeof window === (stryMutAct_9fa48("23675") ? "" : (stryCov_9fa48("23675"), 'undefined')))) return;
    try {
      if (stryMutAct_9fa48("23676")) {
        {}
      } else {
        stryCov_9fa48("23676");
        const userError = errorMessageToUserError(error, path, context);
        const historyKey = stryMutAct_9fa48("23677") ? "" : (stryCov_9fa48("23677"), 'paes-tutor-error-history');
        const existing = localStorage.getItem(historyKey);
        const history: UserError[] = existing ? JSON.parse(existing) : stryMutAct_9fa48("23678") ? ["Stryker was here"] : (stryCov_9fa48("23678"), []);

        // Evitar duplicados recientes (mismo código en los últimos 5 minutos)
        const fiveMinutesAgo = stryMutAct_9fa48("23679") ? Date.now() + 5 * 60 * 1000 : (stryCov_9fa48("23679"), Date.now() - (stryMutAct_9fa48("23680") ? 5 * 60 / 1000 : (stryCov_9fa48("23680"), (stryMutAct_9fa48("23681") ? 5 / 60 : (stryCov_9fa48("23681"), 5 * 60)) * 1000)));
        const recentDuplicate = history.find(stryMutAct_9fa48("23682") ? () => undefined : (stryCov_9fa48("23682"), e => stryMutAct_9fa48("23685") ? e.code === userError.code && new Date(e.timestamp).getTime() > fiveMinutesAgo || e.path === userError.path : stryMutAct_9fa48("23684") ? false : stryMutAct_9fa48("23683") ? true : (stryCov_9fa48("23683", "23684", "23685"), (stryMutAct_9fa48("23687") ? e.code === userError.code || new Date(e.timestamp).getTime() > fiveMinutesAgo : stryMutAct_9fa48("23686") ? true : (stryCov_9fa48("23686", "23687"), (stryMutAct_9fa48("23689") ? e.code !== userError.code : stryMutAct_9fa48("23688") ? true : (stryCov_9fa48("23688", "23689"), e.code === userError.code)) && (stryMutAct_9fa48("23692") ? new Date(e.timestamp).getTime() <= fiveMinutesAgo : stryMutAct_9fa48("23691") ? new Date(e.timestamp).getTime() >= fiveMinutesAgo : stryMutAct_9fa48("23690") ? true : (stryCov_9fa48("23690", "23691", "23692"), new Date(e.timestamp).getTime() > fiveMinutesAgo)))) && (stryMutAct_9fa48("23694") ? e.path !== userError.path : stryMutAct_9fa48("23693") ? true : (stryCov_9fa48("23693", "23694"), e.path === userError.path)))));
        if (stryMutAct_9fa48("23697") ? false : stryMutAct_9fa48("23696") ? true : stryMutAct_9fa48("23695") ? recentDuplicate : (stryCov_9fa48("23695", "23696", "23697"), !recentDuplicate)) {
          if (stryMutAct_9fa48("23698")) {
            {}
          } else {
            stryCov_9fa48("23698");
            const updated = stryMutAct_9fa48("23699") ? [userError, ...history] : (stryCov_9fa48("23699"), (stryMutAct_9fa48("23700") ? [] : (stryCov_9fa48("23700"), [userError, ...history])).slice(0, 100)); // Mantener solo los últimos 100
            localStorage.setItem(historyKey, JSON.stringify(updated));
          }
        }
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }
}