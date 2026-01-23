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
const SHORTCUTS_STORAGE_KEY = stryMutAct_9fa48("21331") ? "" : (stryCov_9fa48("21331"), 'paes-tutor-custom-shortcuts');
export interface CustomShortcut {
  id: string;
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: string; // ID de la acción
  category: string;
  enabled: boolean;
}
export interface ShortcutAction {
  id: string;
  name: string;
  description: string;
  handler: () => void;
  category: string;
}

/**
 * Hook para gestionar atajos de teclado personalizables
 * Basado en estándares de VS Code, GitHub, Linear
 */
export function useCustomizableShortcuts(availableActions: ShortcutAction[]) {
  if (stryMutAct_9fa48("21332")) {
    {}
  } else {
    stryCov_9fa48("21332");
    const [customShortcuts, setCustomShortcuts] = useState<Record<string, CustomShortcut>>({});
    const [isLoaded, setIsLoaded] = useState(stryMutAct_9fa48("21333") ? true : (stryCov_9fa48("21333"), false));

    // Cargar atajos personalizados del localStorage
    useEffect(() => {
      if (stryMutAct_9fa48("21334")) {
        {}
      } else {
        stryCov_9fa48("21334");
        if (stryMutAct_9fa48("21337") ? typeof window !== 'undefined' : stryMutAct_9fa48("21336") ? false : stryMutAct_9fa48("21335") ? true : (stryCov_9fa48("21335", "21336", "21337"), typeof window === (stryMutAct_9fa48("21338") ? "" : (stryCov_9fa48("21338"), 'undefined')))) return;
        try {
          if (stryMutAct_9fa48("21339")) {
            {}
          } else {
            stryCov_9fa48("21339");
            const saved = localStorage.getItem(SHORTCUTS_STORAGE_KEY);
            if (stryMutAct_9fa48("21341") ? false : stryMutAct_9fa48("21340") ? true : (stryCov_9fa48("21340", "21341"), saved)) {
              if (stryMutAct_9fa48("21342")) {
                {}
              } else {
                stryCov_9fa48("21342");
                const parsed = JSON.parse(saved);
                setCustomShortcuts(parsed);
              }
            } else {
              if (stryMutAct_9fa48("21343")) {
                {}
              } else {
                stryCov_9fa48("21343");
                // Inicializar con atajos por defecto
                const defaults: Record<string, CustomShortcut> = {};
                availableActions.forEach(action => {
                  if (stryMutAct_9fa48("21344")) {
                    {}
                  } else {
                    stryCov_9fa48("21344");
                    defaults[action.id] = stryMutAct_9fa48("21345") ? {} : (stryCov_9fa48("21345"), {
                      id: action.id,
                      key: stryMutAct_9fa48("21346") ? "Stryker was here!" : (stryCov_9fa48("21346"), ''),
                      description: action.description,
                      action: action.id,
                      category: action.category,
                      enabled: stryMutAct_9fa48("21347") ? false : (stryCov_9fa48("21347"), true)
                    });
                  }
                });
                setCustomShortcuts(defaults);
              }
            }
          }
        } catch {
          // Si hay error, usar defaults
        } finally {
          if (stryMutAct_9fa48("21348")) {
            {}
          } else {
            stryCov_9fa48("21348");
            setIsLoaded(stryMutAct_9fa48("21349") ? false : (stryCov_9fa48("21349"), true));
          }
        }
      }
    }, stryMutAct_9fa48("21350") ? [] : (stryCov_9fa48("21350"), [availableActions]));

    // Guardar atajos personalizados
    const saveShortcuts = useCallback((shortcuts: Record<string, CustomShortcut>) => {
      if (stryMutAct_9fa48("21351")) {
        {}
      } else {
        stryCov_9fa48("21351");
        setCustomShortcuts(shortcuts);
        if (stryMutAct_9fa48("21354") ? typeof window === 'undefined' : stryMutAct_9fa48("21353") ? false : stryMutAct_9fa48("21352") ? true : (stryCov_9fa48("21352", "21353", "21354"), typeof window !== (stryMutAct_9fa48("21355") ? "" : (stryCov_9fa48("21355"), 'undefined')))) {
          if (stryMutAct_9fa48("21356")) {
            {}
          } else {
            stryCov_9fa48("21356");
            try {
              if (stryMutAct_9fa48("21357")) {
                {}
              } else {
                stryCov_9fa48("21357");
                localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts));
              }
            } catch {
              // Ignorar errores de localStorage
            }
          }
        }
      }
    }, stryMutAct_9fa48("21358") ? ["Stryker was here"] : (stryCov_9fa48("21358"), []));

    // Actualizar un atajo específico
    const updateShortcut = useCallback((actionId: string, shortcut: Partial<CustomShortcut>) => {
      if (stryMutAct_9fa48("21359")) {
        {}
      } else {
        stryCov_9fa48("21359");
        const updated = stryMutAct_9fa48("21360") ? {} : (stryCov_9fa48("21360"), {
          ...customShortcuts,
          [actionId]: stryMutAct_9fa48("21361") ? {} : (stryCov_9fa48("21361"), {
            ...customShortcuts[actionId],
            ...shortcut
          })
        });
        saveShortcuts(updated);
      }
    }, stryMutAct_9fa48("21362") ? [] : (stryCov_9fa48("21362"), [customShortcuts, saveShortcuts]));

    // Restablecer a valores por defecto
    const resetToDefaults = useCallback(() => {
      if (stryMutAct_9fa48("21363")) {
        {}
      } else {
        stryCov_9fa48("21363");
        const defaults: Record<string, CustomShortcut> = {};
        availableActions.forEach(action => {
          if (stryMutAct_9fa48("21364")) {
            {}
          } else {
            stryCov_9fa48("21364");
            defaults[action.id] = stryMutAct_9fa48("21365") ? {} : (stryCov_9fa48("21365"), {
              id: action.id,
              key: stryMutAct_9fa48("21366") ? "Stryker was here!" : (stryCov_9fa48("21366"), ''),
              description: action.description,
              action: action.id,
              category: action.category,
              enabled: stryMutAct_9fa48("21367") ? false : (stryCov_9fa48("21367"), true)
            });
          }
        });
        saveShortcuts(defaults);
      }
    }, stryMutAct_9fa48("21368") ? [] : (stryCov_9fa48("21368"), [availableActions, saveShortcuts]));

    // Obtener atajos activos para usar con useKeyboardShortcuts
    const getActiveShortcuts = useCallback(() => {
      if (stryMutAct_9fa48("21369")) {
        {}
      } else {
        stryCov_9fa48("21369");
        return Object.values(customShortcuts).filter(s => s.enabled && s.key).map(s => {
          const action = availableActions.find(a => a.id === s.action);
          if (!action) return null;
          return {
            key: s.key,
            ctrl: s.ctrl,
            shift: s.shift,
            alt: s.alt,
            meta: s.meta,
            description: s.description,
            action: action.handler,
            category: s.category
          };
        }).filter(Boolean) as Array<{
          key: string;
          ctrl?: boolean;
          shift?: boolean;
          alt?: boolean;
          meta?: boolean;
          description: string;
          action: () => void;
          category: string;
        }>;
      }
    }, stryMutAct_9fa48("21370") ? [] : (stryCov_9fa48("21370"), [customShortcuts, availableActions]));
    return stryMutAct_9fa48("21371") ? {} : (stryCov_9fa48("21371"), {
      customShortcuts,
      updateShortcut,
      resetToDefaults,
      getActiveShortcuts,
      isLoaded
    });
  }
}