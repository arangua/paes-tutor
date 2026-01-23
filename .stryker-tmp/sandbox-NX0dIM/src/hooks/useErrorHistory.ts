// @ts-nocheck
'use client';

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
import { useState, useEffect, useCallback } from 'react';
export interface UserError {
  id: string;
  timestamp: string;
  code: string;
  title: string;
  description: string;
  solution: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'validation' | 'network' | 'permission' | 'data' | 'system';
  path?: string;
  context?: Record<string, unknown>;
  resolved?: boolean;
}
const ERROR_HISTORY_KEY = stryMutAct_9fa48("21377") ? "" : (stryCov_9fa48("21377"), 'paes-tutor-error-history');
const MAX_ERRORS = 100; // Mantener solo los últimos 100 errores

/**
 * Hook para manejar historial de errores del usuario
 * Basado en Nielsen Heuristic #9: Help users recognize, diagnose, and recover from errors
 */
export function useErrorHistory() {
  if (stryMutAct_9fa48("21378")) {
    {}
  } else {
    stryCov_9fa48("21378");
    const [errors, setErrors] = useState<UserError[]>(stryMutAct_9fa48("21379") ? ["Stryker was here"] : (stryCov_9fa48("21379"), []));

    // Cargar historial al montar
    useEffect(() => {
      if (stryMutAct_9fa48("21380")) {
        {}
      } else {
        stryCov_9fa48("21380");
        if (stryMutAct_9fa48("21383") ? typeof window !== 'undefined' : stryMutAct_9fa48("21382") ? false : stryMutAct_9fa48("21381") ? true : (stryCov_9fa48("21381", "21382", "21383"), typeof window === (stryMutAct_9fa48("21384") ? "" : (stryCov_9fa48("21384"), 'undefined')))) return;
        try {
          if (stryMutAct_9fa48("21385")) {
            {}
          } else {
            stryCov_9fa48("21385");
            const saved = localStorage.getItem(ERROR_HISTORY_KEY);
            if (stryMutAct_9fa48("21387") ? false : stryMutAct_9fa48("21386") ? true : (stryCov_9fa48("21386", "21387"), saved)) {
              if (stryMutAct_9fa48("21388")) {
                {}
              } else {
                stryCov_9fa48("21388");
                const parsed = JSON.parse(saved);
                setErrors(Array.isArray(parsed) ? parsed : stryMutAct_9fa48("21389") ? ["Stryker was here"] : (stryCov_9fa48("21389"), []));
              }
            }
          }
        } catch {
          // Ignorar errores de localStorage
        }
      }
    }, stryMutAct_9fa48("21390") ? ["Stryker was here"] : (stryCov_9fa48("21390"), []));

    // Agregar error al historial
    const addError = useCallback((error: UserError) => {
      if (stryMutAct_9fa48("21391")) {
        {}
      } else {
        stryCov_9fa48("21391");
        setErrors(prev => {
          if (stryMutAct_9fa48("21392")) {
            {}
          } else {
            stryCov_9fa48("21392");
            // Evitar duplicados recientes (mismo código en los últimos 5 minutos)
            const fiveMinutesAgo = stryMutAct_9fa48("21393") ? Date.now() + 5 * 60 * 1000 : (stryCov_9fa48("21393"), Date.now() - (stryMutAct_9fa48("21394") ? 5 * 60 / 1000 : (stryCov_9fa48("21394"), (stryMutAct_9fa48("21395") ? 5 / 60 : (stryCov_9fa48("21395"), 5 * 60)) * 1000)));
            const recentDuplicate = prev.find(stryMutAct_9fa48("21396") ? () => undefined : (stryCov_9fa48("21396"), e => stryMutAct_9fa48("21399") ? e.code === error.code && new Date(e.timestamp).getTime() > fiveMinutesAgo || e.path === error.path : stryMutAct_9fa48("21398") ? false : stryMutAct_9fa48("21397") ? true : (stryCov_9fa48("21397", "21398", "21399"), (stryMutAct_9fa48("21401") ? e.code === error.code || new Date(e.timestamp).getTime() > fiveMinutesAgo : stryMutAct_9fa48("21400") ? true : (stryCov_9fa48("21400", "21401"), (stryMutAct_9fa48("21403") ? e.code !== error.code : stryMutAct_9fa48("21402") ? true : (stryCov_9fa48("21402", "21403"), e.code === error.code)) && (stryMutAct_9fa48("21406") ? new Date(e.timestamp).getTime() <= fiveMinutesAgo : stryMutAct_9fa48("21405") ? new Date(e.timestamp).getTime() >= fiveMinutesAgo : stryMutAct_9fa48("21404") ? true : (stryCov_9fa48("21404", "21405", "21406"), new Date(e.timestamp).getTime() > fiveMinutesAgo)))) && (stryMutAct_9fa48("21408") ? e.path !== error.path : stryMutAct_9fa48("21407") ? true : (stryCov_9fa48("21407", "21408"), e.path === error.path)))));
            if (stryMutAct_9fa48("21410") ? false : stryMutAct_9fa48("21409") ? true : (stryCov_9fa48("21409", "21410"), recentDuplicate)) {
              if (stryMutAct_9fa48("21411")) {
                {}
              } else {
                stryCov_9fa48("21411");
                return prev; // No agregar duplicado reciente
              }
            }
            const updated = stryMutAct_9fa48("21412") ? [error, ...prev] : (stryCov_9fa48("21412"), (stryMutAct_9fa48("21413") ? [] : (stryCov_9fa48("21413"), [error, ...prev])).slice(0, MAX_ERRORS));

            // Persistir
            try {
              if (stryMutAct_9fa48("21414")) {
                {}
              } else {
                stryCov_9fa48("21414");
                localStorage.setItem(ERROR_HISTORY_KEY, JSON.stringify(updated));
              }
            } catch {
              // Ignorar errores
            }
            return updated;
          }
        });
      }
    }, stryMutAct_9fa48("21415") ? ["Stryker was here"] : (stryCov_9fa48("21415"), []));

    // Marcar error como resuelto
    const markAsResolved = useCallback((errorId: string) => {
      if (stryMutAct_9fa48("21416")) {
        {}
      } else {
        stryCov_9fa48("21416");
        setErrors(prev => {
          if (stryMutAct_9fa48("21417")) {
            {}
          } else {
            stryCov_9fa48("21417");
            const updated = prev.map(stryMutAct_9fa48("21418") ? () => undefined : (stryCov_9fa48("21418"), e => (stryMutAct_9fa48("21421") ? e.id !== errorId : stryMutAct_9fa48("21420") ? false : stryMutAct_9fa48("21419") ? true : (stryCov_9fa48("21419", "21420", "21421"), e.id === errorId)) ? stryMutAct_9fa48("21422") ? {} : (stryCov_9fa48("21422"), {
              ...e,
              resolved: stryMutAct_9fa48("21423") ? false : (stryCov_9fa48("21423"), true)
            }) : e));
            try {
              if (stryMutAct_9fa48("21424")) {
                {}
              } else {
                stryCov_9fa48("21424");
                localStorage.setItem(ERROR_HISTORY_KEY, JSON.stringify(updated));
              }
            } catch {
              // Ignorar errores
            }
            return updated;
          }
        });
      }
    }, stryMutAct_9fa48("21425") ? ["Stryker was here"] : (stryCov_9fa48("21425"), []));

    // Limpiar historial
    const clearHistory = useCallback(() => {
      if (stryMutAct_9fa48("21426")) {
        {}
      } else {
        stryCov_9fa48("21426");
        setErrors(stryMutAct_9fa48("21427") ? ["Stryker was here"] : (stryCov_9fa48("21427"), []));
        try {
          if (stryMutAct_9fa48("21428")) {
            {}
          } else {
            stryCov_9fa48("21428");
            localStorage.removeItem(ERROR_HISTORY_KEY);
          }
        } catch {
          // Ignorar errores
        }
      }
    }, stryMutAct_9fa48("21429") ? ["Stryker was here"] : (stryCov_9fa48("21429"), []));

    // Obtener errores no resueltos
    const unresolvedErrors = stryMutAct_9fa48("21430") ? errors : (stryCov_9fa48("21430"), errors.filter(stryMutAct_9fa48("21431") ? () => undefined : (stryCov_9fa48("21431"), e => stryMutAct_9fa48("21432") ? e.resolved : (stryCov_9fa48("21432"), !e.resolved))));

    // Obtener errores por categoría
    const getErrorsByCategory = useCallback((category: UserError['category']) => {
      if (stryMutAct_9fa48("21433")) {
        {}
      } else {
        stryCov_9fa48("21433");
        return stryMutAct_9fa48("21434") ? errors : (stryCov_9fa48("21434"), errors.filter(stryMutAct_9fa48("21435") ? () => undefined : (stryCov_9fa48("21435"), e => stryMutAct_9fa48("21438") ? e.category !== category : stryMutAct_9fa48("21437") ? false : stryMutAct_9fa48("21436") ? true : (stryCov_9fa48("21436", "21437", "21438"), e.category === category))));
      }
    }, stryMutAct_9fa48("21439") ? [] : (stryCov_9fa48("21439"), [errors]));

    // Obtener errores por severidad
    const getErrorsBySeverity = useCallback((severity: UserError['severity']) => {
      if (stryMutAct_9fa48("21440")) {
        {}
      } else {
        stryCov_9fa48("21440");
        return stryMutAct_9fa48("21441") ? errors : (stryCov_9fa48("21441"), errors.filter(stryMutAct_9fa48("21442") ? () => undefined : (stryCov_9fa48("21442"), e => stryMutAct_9fa48("21445") ? e.severity !== severity : stryMutAct_9fa48("21444") ? false : stryMutAct_9fa48("21443") ? true : (stryCov_9fa48("21443", "21444", "21445"), e.severity === severity))));
      }
    }, stryMutAct_9fa48("21446") ? [] : (stryCov_9fa48("21446"), [errors]));

    // Estadísticas
    const stats = stryMutAct_9fa48("21447") ? {} : (stryCov_9fa48("21447"), {
      total: errors.length,
      unresolved: unresolvedErrors.length,
      byCategory: stryMutAct_9fa48("21448") ? {} : (stryCov_9fa48("21448"), {
        validation: getErrorsByCategory(stryMutAct_9fa48("21449") ? "" : (stryCov_9fa48("21449"), 'validation')).length,
        network: getErrorsByCategory(stryMutAct_9fa48("21450") ? "" : (stryCov_9fa48("21450"), 'network')).length,
        permission: getErrorsByCategory(stryMutAct_9fa48("21451") ? "" : (stryCov_9fa48("21451"), 'permission')).length,
        data: getErrorsByCategory(stryMutAct_9fa48("21452") ? "" : (stryCov_9fa48("21452"), 'data')).length,
        system: getErrorsByCategory(stryMutAct_9fa48("21453") ? "" : (stryCov_9fa48("21453"), 'system')).length
      }),
      bySeverity: stryMutAct_9fa48("21454") ? {} : (stryCov_9fa48("21454"), {
        low: getErrorsBySeverity(stryMutAct_9fa48("21455") ? "" : (stryCov_9fa48("21455"), 'low')).length,
        medium: getErrorsBySeverity(stryMutAct_9fa48("21456") ? "" : (stryCov_9fa48("21456"), 'medium')).length,
        high: getErrorsBySeverity(stryMutAct_9fa48("21457") ? "" : (stryCov_9fa48("21457"), 'high')).length,
        critical: getErrorsBySeverity(stryMutAct_9fa48("21458") ? "" : (stryCov_9fa48("21458"), 'critical')).length
      })
    });
    return stryMutAct_9fa48("21459") ? {} : (stryCov_9fa48("21459"), {
      errors,
      unresolvedErrors,
      addError,
      markAsResolved,
      clearHistory,
      getErrorsByCategory,
      getErrorsBySeverity,
      stats
    });
  }
}