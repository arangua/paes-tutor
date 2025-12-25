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
import { useCallback, useRef, useEffect } from 'react';
import { safeDeepEqual } from '@/lib/utils/deepEqual';
import { captureError } from '@/lib/monitoring';
interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

/**
 * Hook personalizado para auto-guardado con debounce
 * Útil para guardar respuestas, formularios, etc.
 */
export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = stryMutAct_9fa48("21271") ? false : (stryCov_9fa48("21271"), true)
}: UseAutoSaveOptions<T>) {
  if (stryMutAct_9fa48("21272")) {
    {}
  } else {
    stryCov_9fa48("21272");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const previousDataRef = useRef<T>(data);
    const isSavingRef = useRef(stryMutAct_9fa48("21273") ? true : (stryCov_9fa48("21273"), false));
    const save = useCallback(async () => {
      if (stryMutAct_9fa48("21274")) {
        {}
      } else {
        stryCov_9fa48("21274");
        if (stryMutAct_9fa48("21276") ? false : stryMutAct_9fa48("21275") ? true : (stryCov_9fa48("21275", "21276"), isSavingRef.current)) return;
        try {
          if (stryMutAct_9fa48("21277")) {
            {}
          } else {
            stryCov_9fa48("21277");
            isSavingRef.current = stryMutAct_9fa48("21278") ? false : (stryCov_9fa48("21278"), true);
            await onSave(data);
            previousDataRef.current = data;
          }
        } catch (error) {
          if (stryMutAct_9fa48("21279")) {
            {}
          } else {
            stryCov_9fa48("21279");
            // Log error usando servicio de monitoreo
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("21280") ? {} : (stryCov_9fa48("21280"), {
              type: stryMutAct_9fa48("21281") ? "" : (stryCov_9fa48("21281"), 'autosave_error'),
              path: (stryMutAct_9fa48("21284") ? typeof window === 'undefined' : stryMutAct_9fa48("21283") ? false : stryMutAct_9fa48("21282") ? true : (stryCov_9fa48("21282", "21283", "21284"), typeof window !== (stryMutAct_9fa48("21285") ? "" : (stryCov_9fa48("21285"), 'undefined')))) ? window.location.pathname : undefined
            }));
            throw error;
          }
        } finally {
          if (stryMutAct_9fa48("21286")) {
            {}
          } else {
            stryCov_9fa48("21286");
            isSavingRef.current = stryMutAct_9fa48("21287") ? true : (stryCov_9fa48("21287"), false);
          }
        }
      }
    }, stryMutAct_9fa48("21288") ? [] : (stryCov_9fa48("21288"), [data, onSave]));
    useEffect(() => {
      if (stryMutAct_9fa48("21289")) {
        {}
      } else {
        stryCov_9fa48("21289");
        if (stryMutAct_9fa48("21292") ? false : stryMutAct_9fa48("21291") ? true : stryMutAct_9fa48("21290") ? enabled : (stryCov_9fa48("21290", "21291", "21292"), !enabled)) return;

        // Comparar datos para evitar saves innecesarios (usar comparación profunda segura)
        if (stryMutAct_9fa48("21294") ? false : stryMutAct_9fa48("21293") ? true : (stryCov_9fa48("21293", "21294"), safeDeepEqual(previousDataRef.current, data))) {
          if (stryMutAct_9fa48("21295")) {
            {}
          } else {
            stryCov_9fa48("21295");
            return;
          }
        }

        // Limpiar timeout anterior
        if (stryMutAct_9fa48("21297") ? false : stryMutAct_9fa48("21296") ? true : (stryCov_9fa48("21296", "21297"), timeoutRef.current)) {
          if (stryMutAct_9fa48("21298")) {
            {}
          } else {
            stryCov_9fa48("21298");
            clearTimeout(timeoutRef.current);
          }
        }

        // Crear nuevo timeout
        timeoutRef.current = setTimeout(() => {
          if (stryMutAct_9fa48("21299")) {
            {}
          } else {
            stryCov_9fa48("21299");
            save();
          }
        }, delay);
        return () => {
          if (stryMutAct_9fa48("21300")) {
            {}
          } else {
            stryCov_9fa48("21300");
            if (stryMutAct_9fa48("21302") ? false : stryMutAct_9fa48("21301") ? true : (stryCov_9fa48("21301", "21302"), timeoutRef.current)) {
              if (stryMutAct_9fa48("21303")) {
                {}
              } else {
                stryCov_9fa48("21303");
                clearTimeout(timeoutRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("21304") ? [] : (stryCov_9fa48("21304"), [data, delay, enabled, save]));

    // Guardar inmediatamente al desmontar
    useEffect(() => {
      if (stryMutAct_9fa48("21305")) {
        {}
      } else {
        stryCov_9fa48("21305");
        let isMounted = stryMutAct_9fa48("21306") ? false : (stryCov_9fa48("21306"), true);
        return () => {
          if (stryMutAct_9fa48("21307")) {
            {}
          } else {
            stryCov_9fa48("21307");
            isMounted = stryMutAct_9fa48("21308") ? true : (stryCov_9fa48("21308"), false);
            if (stryMutAct_9fa48("21310") ? false : stryMutAct_9fa48("21309") ? true : (stryCov_9fa48("21309", "21310"), timeoutRef.current)) {
              if (stryMutAct_9fa48("21311")) {
                {}
              } else {
                stryCov_9fa48("21311");
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            }

            // Guardar datos pendientes si hay cambios (solo si no estamos guardando)
            if (stryMutAct_9fa48("21314") ? false : stryMutAct_9fa48("21313") ? true : stryMutAct_9fa48("21312") ? isSavingRef.current : (stryCov_9fa48("21312", "21313", "21314"), !isSavingRef.current)) {
              if (stryMutAct_9fa48("21315")) {
                {}
              } else {
                stryCov_9fa48("21315");
                // Comparar datos de forma segura (maneja referencias circulares, etc.)
                const hasChanges = stryMutAct_9fa48("21316") ? safeDeepEqual(previousDataRef.current, data) : (stryCov_9fa48("21316"), !safeDeepEqual(previousDataRef.current, data));
                if (stryMutAct_9fa48("21318") ? false : stryMutAct_9fa48("21317") ? true : (stryCov_9fa48("21317", "21318"), hasChanges)) {
                  if (stryMutAct_9fa48("21319")) {
                    {}
                  } else {
                    stryCov_9fa48("21319");
                    // Ejecutar save de forma segura, capturando errores silenciosamente
                    // Solo actualizar refs, no estado (el componente ya se está desmontando)
                    onSave(data).then(() => {
                      if (stryMutAct_9fa48("21320")) {
                        {}
                      } else {
                        stryCov_9fa48("21320");
                        // Solo actualizar ref si el componente aún está montado
                        // (aunque en cleanup esto siempre será false, es por seguridad)
                        if (stryMutAct_9fa48("21322") ? false : stryMutAct_9fa48("21321") ? true : (stryCov_9fa48("21321", "21322"), isMounted)) {
                          if (stryMutAct_9fa48("21323")) {
                            {}
                          } else {
                            stryCov_9fa48("21323");
                            previousDataRef.current = data;
                          }
                        }
                      }
                    }).catch(() => {
                      // Silenciar errores en cleanup - el componente ya se está desmontando
                      // No intentar actualizar estado
                    });
                  }
                }
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("21324") ? [] : (stryCov_9fa48("21324"), [data, onSave]));
    return stryMutAct_9fa48("21325") ? {} : (stryCov_9fa48("21325"), {
      save: useCallback(() => {
        if (stryMutAct_9fa48("21326")) {
          {}
        } else {
          stryCov_9fa48("21326");
          if (stryMutAct_9fa48("21328") ? false : stryMutAct_9fa48("21327") ? true : (stryCov_9fa48("21327", "21328"), timeoutRef.current)) {
            if (stryMutAct_9fa48("21329")) {
              {}
            } else {
              stryCov_9fa48("21329");
              clearTimeout(timeoutRef.current);
            }
          }
          return save();
        }
      }, stryMutAct_9fa48("21330") ? [] : (stryCov_9fa48("21330"), [save]))
    });
  }
}