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
export interface TrashItem {
  id: string;
  type: 'note' | 'flashcard' | 'bookmark' | 'attempt';
  title: string;
  deletedAt: string;
  data: Record<string, unknown>; // Datos originales del elemento
}
const TRASH_STORAGE_KEY = stryMutAct_9fa48("22280") ? "" : (stryCov_9fa48("22280"), 'paes-tutor-trash');
const TRASH_RETENTION_DAYS = 30; // Días antes de eliminar permanentemente

/**
 * Hook para gestionar la papelera de reciclaje
 * Basado en estándares de Gmail, Notion, Linear
 */
export function useTrash() {
  if (stryMutAct_9fa48("22281")) {
    {}
  } else {
    stryCov_9fa48("22281");
    const [trashItems, setTrashItems] = useState<TrashItem[]>(stryMutAct_9fa48("22282") ? ["Stryker was here"] : (stryCov_9fa48("22282"), []));

    // Cargar elementos de la papelera
    useEffect(() => {
      if (stryMutAct_9fa48("22283")) {
        {}
      } else {
        stryCov_9fa48("22283");
        if (stryMutAct_9fa48("22286") ? typeof window !== 'undefined' : stryMutAct_9fa48("22285") ? false : stryMutAct_9fa48("22284") ? true : (stryCov_9fa48("22284", "22285", "22286"), typeof window === (stryMutAct_9fa48("22287") ? "" : (stryCov_9fa48("22287"), 'undefined')))) return;
        try {
          if (stryMutAct_9fa48("22288")) {
            {}
          } else {
            stryCov_9fa48("22288");
            const saved = localStorage.getItem(TRASH_STORAGE_KEY);
            if (stryMutAct_9fa48("22290") ? false : stryMutAct_9fa48("22289") ? true : (stryCov_9fa48("22289", "22290"), saved)) {
              if (stryMutAct_9fa48("22291")) {
                {}
              } else {
                stryCov_9fa48("22291");
                const items = JSON.parse(saved) as TrashItem[];
                // Filtrar elementos expirados
                const now = new Date();
                const validItems = stryMutAct_9fa48("22292") ? items : (stryCov_9fa48("22292"), items.filter(item => {
                  if (stryMutAct_9fa48("22293")) {
                    {}
                  } else {
                    stryCov_9fa48("22293");
                    const deletedAt = new Date(item.deletedAt);
                    const daysSinceDeleted = stryMutAct_9fa48("22294") ? (now.getTime() - deletedAt.getTime()) * (1000 * 60 * 60 * 24) : (stryCov_9fa48("22294"), (stryMutAct_9fa48("22295") ? now.getTime() + deletedAt.getTime() : (stryCov_9fa48("22295"), now.getTime() - deletedAt.getTime())) / (stryMutAct_9fa48("22296") ? 1000 * 60 * 60 / 24 : (stryCov_9fa48("22296"), (stryMutAct_9fa48("22297") ? 1000 * 60 / 60 : (stryCov_9fa48("22297"), (stryMutAct_9fa48("22298") ? 1000 / 60 : (stryCov_9fa48("22298"), 1000 * 60)) * 60)) * 24)));
                    return stryMutAct_9fa48("22302") ? daysSinceDeleted >= TRASH_RETENTION_DAYS : stryMutAct_9fa48("22301") ? daysSinceDeleted <= TRASH_RETENTION_DAYS : stryMutAct_9fa48("22300") ? false : stryMutAct_9fa48("22299") ? true : (stryCov_9fa48("22299", "22300", "22301", "22302"), daysSinceDeleted < TRASH_RETENTION_DAYS);
                  }
                }));
                setTrashItems(validItems);
                // Guardar si se filtraron elementos
                if (stryMutAct_9fa48("22305") ? validItems.length === items.length : stryMutAct_9fa48("22304") ? false : stryMutAct_9fa48("22303") ? true : (stryCov_9fa48("22303", "22304", "22305"), validItems.length !== items.length)) {
                  if (stryMutAct_9fa48("22306")) {
                    {}
                  } else {
                    stryCov_9fa48("22306");
                    localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(validItems));
                  }
                }
              }
            }
          }
        } catch {
          // Ignorar errores
        }
      }
    }, stryMutAct_9fa48("22307") ? ["Stryker was here"] : (stryCov_9fa48("22307"), []));

    // Agregar elemento a la papelera
    const addToTrash = useCallback((item: Omit<TrashItem, 'deletedAt'>) => {
      if (stryMutAct_9fa48("22308")) {
        {}
      } else {
        stryCov_9fa48("22308");
        const trashItem: TrashItem = stryMutAct_9fa48("22309") ? {} : (stryCov_9fa48("22309"), {
          ...item,
          deletedAt: new Date().toISOString()
        });
        setTrashItems(prev => {
          if (stryMutAct_9fa48("22310")) {
            {}
          } else {
            stryCov_9fa48("22310");
            const updated = stryMutAct_9fa48("22311") ? [] : (stryCov_9fa48("22311"), [trashItem, ...prev]);
            if (stryMutAct_9fa48("22314") ? typeof window === 'undefined' : stryMutAct_9fa48("22313") ? false : stryMutAct_9fa48("22312") ? true : (stryCov_9fa48("22312", "22313", "22314"), typeof window !== (stryMutAct_9fa48("22315") ? "" : (stryCov_9fa48("22315"), 'undefined')))) {
              if (stryMutAct_9fa48("22316")) {
                {}
              } else {
                stryCov_9fa48("22316");
                try {
                  if (stryMutAct_9fa48("22317")) {
                    {}
                  } else {
                    stryCov_9fa48("22317");
                    localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updated));
                  }
                } catch {
                  // Ignorar errores
                }
              }
            }
            return updated;
          }
        });
        return trashItem;
      }
    }, stryMutAct_9fa48("22318") ? ["Stryker was here"] : (stryCov_9fa48("22318"), []));

    // Restaurar elemento
    const restoreItem = useCallback((id: string) => {
      if (stryMutAct_9fa48("22319")) {
        {}
      } else {
        stryCov_9fa48("22319");
        const item = trashItems.find(stryMutAct_9fa48("22320") ? () => undefined : (stryCov_9fa48("22320"), i => stryMutAct_9fa48("22323") ? i.id !== id : stryMutAct_9fa48("22322") ? false : stryMutAct_9fa48("22321") ? true : (stryCov_9fa48("22321", "22322", "22323"), i.id === id)));
        if (stryMutAct_9fa48("22326") ? false : stryMutAct_9fa48("22325") ? true : stryMutAct_9fa48("22324") ? item : (stryCov_9fa48("22324", "22325", "22326"), !item)) return null;
        setTrashItems(prev => {
          if (stryMutAct_9fa48("22327")) {
            {}
          } else {
            stryCov_9fa48("22327");
            const updated = stryMutAct_9fa48("22328") ? prev : (stryCov_9fa48("22328"), prev.filter(stryMutAct_9fa48("22329") ? () => undefined : (stryCov_9fa48("22329"), i => stryMutAct_9fa48("22332") ? i.id === id : stryMutAct_9fa48("22331") ? false : stryMutAct_9fa48("22330") ? true : (stryCov_9fa48("22330", "22331", "22332"), i.id !== id))));
            if (stryMutAct_9fa48("22335") ? typeof window === 'undefined' : stryMutAct_9fa48("22334") ? false : stryMutAct_9fa48("22333") ? true : (stryCov_9fa48("22333", "22334", "22335"), typeof window !== (stryMutAct_9fa48("22336") ? "" : (stryCov_9fa48("22336"), 'undefined')))) {
              if (stryMutAct_9fa48("22337")) {
                {}
              } else {
                stryCov_9fa48("22337");
                try {
                  if (stryMutAct_9fa48("22338")) {
                    {}
                  } else {
                    stryCov_9fa48("22338");
                    localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updated));
                  }
                } catch {
                  // Ignorar errores
                }
              }
            }
            return updated;
          }
        });
        return item;
      }
    }, stryMutAct_9fa48("22339") ? [] : (stryCov_9fa48("22339"), [trashItems]));

    // Eliminar permanentemente
    const deletePermanently = useCallback((id: string) => {
      if (stryMutAct_9fa48("22340")) {
        {}
      } else {
        stryCov_9fa48("22340");
        setTrashItems(prev => {
          if (stryMutAct_9fa48("22341")) {
            {}
          } else {
            stryCov_9fa48("22341");
            const updated = stryMutAct_9fa48("22342") ? prev : (stryCov_9fa48("22342"), prev.filter(stryMutAct_9fa48("22343") ? () => undefined : (stryCov_9fa48("22343"), i => stryMutAct_9fa48("22346") ? i.id === id : stryMutAct_9fa48("22345") ? false : stryMutAct_9fa48("22344") ? true : (stryCov_9fa48("22344", "22345", "22346"), i.id !== id))));
            if (stryMutAct_9fa48("22349") ? typeof window === 'undefined' : stryMutAct_9fa48("22348") ? false : stryMutAct_9fa48("22347") ? true : (stryCov_9fa48("22347", "22348", "22349"), typeof window !== (stryMutAct_9fa48("22350") ? "" : (stryCov_9fa48("22350"), 'undefined')))) {
              if (stryMutAct_9fa48("22351")) {
                {}
              } else {
                stryCov_9fa48("22351");
                try {
                  if (stryMutAct_9fa48("22352")) {
                    {}
                  } else {
                    stryCov_9fa48("22352");
                    localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updated));
                  }
                } catch {
                  // Ignorar errores
                }
              }
            }
            return updated;
          }
        });
      }
    }, stryMutAct_9fa48("22353") ? ["Stryker was here"] : (stryCov_9fa48("22353"), []));

    // Vaciar papelera
    const emptyTrash = useCallback(() => {
      if (stryMutAct_9fa48("22354")) {
        {}
      } else {
        stryCov_9fa48("22354");
        setTrashItems(stryMutAct_9fa48("22355") ? ["Stryker was here"] : (stryCov_9fa48("22355"), []));
        if (stryMutAct_9fa48("22358") ? typeof window === 'undefined' : stryMutAct_9fa48("22357") ? false : stryMutAct_9fa48("22356") ? true : (stryCov_9fa48("22356", "22357", "22358"), typeof window !== (stryMutAct_9fa48("22359") ? "" : (stryCov_9fa48("22359"), 'undefined')))) {
          if (stryMutAct_9fa48("22360")) {
            {}
          } else {
            stryCov_9fa48("22360");
            try {
              if (stryMutAct_9fa48("22361")) {
                {}
              } else {
                stryCov_9fa48("22361");
                localStorage.removeItem(TRASH_STORAGE_KEY);
              }
            } catch {
              // Ignorar errores
            }
          }
        }
      }
    }, stryMutAct_9fa48("22362") ? ["Stryker was here"] : (stryCov_9fa48("22362"), []));

    // Obtener elementos por tipo
    const getItemsByType = useCallback((type: TrashItem['type']) => {
      if (stryMutAct_9fa48("22363")) {
        {}
      } else {
        stryCov_9fa48("22363");
        return stryMutAct_9fa48("22364") ? trashItems : (stryCov_9fa48("22364"), trashItems.filter(stryMutAct_9fa48("22365") ? () => undefined : (stryCov_9fa48("22365"), item => stryMutAct_9fa48("22368") ? item.type !== type : stryMutAct_9fa48("22367") ? false : stryMutAct_9fa48("22366") ? true : (stryCov_9fa48("22366", "22367", "22368"), item.type === type))));
      }
    }, stryMutAct_9fa48("22369") ? [] : (stryCov_9fa48("22369"), [trashItems]));

    // Obtener días restantes antes de eliminación permanente
    const getDaysRemaining = useCallback((deletedAt: string) => {
      if (stryMutAct_9fa48("22370")) {
        {}
      } else {
        stryCov_9fa48("22370");
        const now = new Date();
        const deleted = new Date(deletedAt);
        const daysSinceDeleted = stryMutAct_9fa48("22371") ? (now.getTime() - deleted.getTime()) * (1000 * 60 * 60 * 24) : (stryCov_9fa48("22371"), (stryMutAct_9fa48("22372") ? now.getTime() + deleted.getTime() : (stryCov_9fa48("22372"), now.getTime() - deleted.getTime())) / (stryMutAct_9fa48("22373") ? 1000 * 60 * 60 / 24 : (stryCov_9fa48("22373"), (stryMutAct_9fa48("22374") ? 1000 * 60 / 60 : (stryCov_9fa48("22374"), (stryMutAct_9fa48("22375") ? 1000 / 60 : (stryCov_9fa48("22375"), 1000 * 60)) * 60)) * 24)));
        return stryMutAct_9fa48("22376") ? Math.min(0, Math.floor(TRASH_RETENTION_DAYS - daysSinceDeleted)) : (stryCov_9fa48("22376"), Math.max(0, Math.floor(stryMutAct_9fa48("22377") ? TRASH_RETENTION_DAYS + daysSinceDeleted : (stryCov_9fa48("22377"), TRASH_RETENTION_DAYS - daysSinceDeleted))));
      }
    }, stryMutAct_9fa48("22378") ? ["Stryker was here"] : (stryCov_9fa48("22378"), []));
    return stryMutAct_9fa48("22379") ? {} : (stryCov_9fa48("22379"), {
      trashItems,
      addToTrash,
      restoreItem,
      deletePermanently,
      emptyTrash,
      getItemsByType,
      getDaysRemaining
    });
  }
}