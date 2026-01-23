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
import * as React from 'react';
import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { captureError } from '@/lib/monitoring';
export interface GlobalAction {
  id: string;
  type: 'create' | 'update' | 'delete' | 'custom';
  description: string;
  undo: () => Promise<void> | void;
  redo: () => Promise<void> | void;
  timestamp: Date;
}
const MAX_HISTORY = 50;

// Contexto para compartir estado global
const UndoRedoContext = createContext<ReturnType<typeof useGlobalUndoRedoInternal> | null>(null);

/**
 * Hook interno para sistema de undo/redo
 * Basado en estándares de Google Docs, Figma, Notion
 */
function useGlobalUndoRedoInternal() {
  if (stryMutAct_9fa48("21604")) {
    {}
  } else {
    stryCov_9fa48("21604");
    const [history, setHistory] = useState<GlobalAction[]>(stryMutAct_9fa48("21605") ? ["Stryker was here"] : (stryCov_9fa48("21605"), []));
    const [currentIndex, setCurrentIndex] = useState(stryMutAct_9fa48("21606") ? +1 : (stryCov_9fa48("21606"), -1));
    const [isUndoing, setIsUndoing] = useState(stryMutAct_9fa48("21607") ? true : (stryCov_9fa48("21607"), false));
    const [isRedoing, setIsRedoing] = useState(stryMutAct_9fa48("21608") ? true : (stryCov_9fa48("21608"), false));
    const canUndo = stryMutAct_9fa48("21612") ? currentIndex < 0 : stryMutAct_9fa48("21611") ? currentIndex > 0 : stryMutAct_9fa48("21610") ? false : stryMutAct_9fa48("21609") ? true : (stryCov_9fa48("21609", "21610", "21611", "21612"), currentIndex >= 0);
    const canRedo = stryMutAct_9fa48("21616") ? currentIndex >= history.length - 1 : stryMutAct_9fa48("21615") ? currentIndex <= history.length - 1 : stryMutAct_9fa48("21614") ? false : stryMutAct_9fa48("21613") ? true : (stryCov_9fa48("21613", "21614", "21615", "21616"), currentIndex < (stryMutAct_9fa48("21617") ? history.length + 1 : (stryCov_9fa48("21617"), history.length - 1)));

    // Agregar acción al historial
    const addAction = useCallback((action: Omit<GlobalAction, 'timestamp'>) => {
      if (stryMutAct_9fa48("21618")) {
        {}
      } else {
        stryCov_9fa48("21618");
        if (stryMutAct_9fa48("21621") ? isUndoing && isRedoing : stryMutAct_9fa48("21620") ? false : stryMutAct_9fa48("21619") ? true : (stryCov_9fa48("21619", "21620", "21621"), isUndoing || isRedoing)) return;
        const newAction: GlobalAction = stryMutAct_9fa48("21622") ? {} : (stryCov_9fa48("21622"), {
          ...action,
          timestamp: new Date()
        });
        setHistory(prev => {
          if (stryMutAct_9fa48("21623")) {
            {}
          } else {
            stryCov_9fa48("21623");
            // Eliminar acciones futuras si estamos en medio del historial
            const newHistory = stryMutAct_9fa48("21624") ? prev : (stryCov_9fa48("21624"), prev.slice(0, stryMutAct_9fa48("21625") ? currentIndex - 1 : (stryCov_9fa48("21625"), currentIndex + 1)));
            // Agregar nueva acción
            const updated = stryMutAct_9fa48("21626") ? [...newHistory, newAction] : (stryCov_9fa48("21626"), (stryMutAct_9fa48("21627") ? [] : (stryCov_9fa48("21627"), [...newHistory, newAction])).slice(stryMutAct_9fa48("21628") ? +MAX_HISTORY : (stryCov_9fa48("21628"), -MAX_HISTORY)));
            setCurrentIndex(stryMutAct_9fa48("21629") ? updated.length + 1 : (stryCov_9fa48("21629"), updated.length - 1));
            return updated;
          }
        });
      }
    }, stryMutAct_9fa48("21630") ? [] : (stryCov_9fa48("21630"), [currentIndex, isUndoing, isRedoing]));

    // Deshacer última acción
    const undo = useCallback(async () => {
      if (stryMutAct_9fa48("21631")) {
        {}
      } else {
        stryCov_9fa48("21631");
        if (stryMutAct_9fa48("21634") ? (!canUndo || isUndoing) && isRedoing : stryMutAct_9fa48("21633") ? false : stryMutAct_9fa48("21632") ? true : (stryCov_9fa48("21632", "21633", "21634"), (stryMutAct_9fa48("21636") ? !canUndo && isUndoing : stryMutAct_9fa48("21635") ? false : (stryCov_9fa48("21635", "21636"), (stryMutAct_9fa48("21637") ? canUndo : (stryCov_9fa48("21637"), !canUndo)) || isUndoing)) || isRedoing)) return;
        setIsUndoing(stryMutAct_9fa48("21638") ? false : (stryCov_9fa48("21638"), true));
        try {
          if (stryMutAct_9fa48("21639")) {
            {}
          } else {
            stryCov_9fa48("21639");
            const action = history[currentIndex];
            if (stryMutAct_9fa48("21641") ? false : stryMutAct_9fa48("21640") ? true : (stryCov_9fa48("21640", "21641"), action)) {
              if (stryMutAct_9fa48("21642")) {
                {}
              } else {
                stryCov_9fa48("21642");
                await action.undo();
                setCurrentIndex(stryMutAct_9fa48("21643") ? () => undefined : (stryCov_9fa48("21643"), prev => stryMutAct_9fa48("21644") ? prev + 1 : (stryCov_9fa48("21644"), prev - 1)));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("21645")) {
            {}
          } else {
            stryCov_9fa48("21645");
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("21646") ? {} : (stryCov_9fa48("21646"), {
              type: stryMutAct_9fa48("21647") ? "" : (stryCov_9fa48("21647"), 'undo_redo_error'),
              operation: stryMutAct_9fa48("21648") ? "" : (stryCov_9fa48("21648"), 'undo'),
              currentIndex,
              historyLength: history.length
            }));
          }
        } finally {
          if (stryMutAct_9fa48("21649")) {
            {}
          } else {
            stryCov_9fa48("21649");
            setIsUndoing(stryMutAct_9fa48("21650") ? true : (stryCov_9fa48("21650"), false));
          }
        }
      }
    }, stryMutAct_9fa48("21651") ? [] : (stryCov_9fa48("21651"), [canUndo, currentIndex, history.length, isUndoing, isRedoing]));

    // Rehacer última acción deshecha
    const redo = useCallback(async () => {
      if (stryMutAct_9fa48("21652")) {
        {}
      } else {
        stryCov_9fa48("21652");
        if (stryMutAct_9fa48("21655") ? (!canRedo || isUndoing) && isRedoing : stryMutAct_9fa48("21654") ? false : stryMutAct_9fa48("21653") ? true : (stryCov_9fa48("21653", "21654", "21655"), (stryMutAct_9fa48("21657") ? !canRedo && isUndoing : stryMutAct_9fa48("21656") ? false : (stryCov_9fa48("21656", "21657"), (stryMutAct_9fa48("21658") ? canRedo : (stryCov_9fa48("21658"), !canRedo)) || isUndoing)) || isRedoing)) return;
        setIsRedoing(stryMutAct_9fa48("21659") ? false : (stryCov_9fa48("21659"), true));
        try {
          if (stryMutAct_9fa48("21660")) {
            {}
          } else {
            stryCov_9fa48("21660");
            const nextIndex = stryMutAct_9fa48("21661") ? currentIndex - 1 : (stryCov_9fa48("21661"), currentIndex + 1);
            const action = history[nextIndex];
            if (stryMutAct_9fa48("21663") ? false : stryMutAct_9fa48("21662") ? true : (stryCov_9fa48("21662", "21663"), action)) {
              if (stryMutAct_9fa48("21664")) {
                {}
              } else {
                stryCov_9fa48("21664");
                await action.redo();
                setCurrentIndex(nextIndex);
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("21665")) {
            {}
          } else {
            stryCov_9fa48("21665");
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("21666") ? {} : (stryCov_9fa48("21666"), {
              type: stryMutAct_9fa48("21667") ? "" : (stryCov_9fa48("21667"), 'undo_redo_error'),
              operation: stryMutAct_9fa48("21668") ? "" : (stryCov_9fa48("21668"), 'redo'),
              currentIndex,
              historyLength: history.length
            }));
          }
        } finally {
          if (stryMutAct_9fa48("21669")) {
            {}
          } else {
            stryCov_9fa48("21669");
            setIsRedoing(stryMutAct_9fa48("21670") ? true : (stryCov_9fa48("21670"), false));
          }
        }
      }
    }, stryMutAct_9fa48("21671") ? [] : (stryCov_9fa48("21671"), [canRedo, currentIndex, history.length, isUndoing, isRedoing]));

    // Limpiar historial
    const clear = useCallback(() => {
      if (stryMutAct_9fa48("21672")) {
        {}
      } else {
        stryCov_9fa48("21672");
        setHistory(stryMutAct_9fa48("21673") ? ["Stryker was here"] : (stryCov_9fa48("21673"), []));
        setCurrentIndex(stryMutAct_9fa48("21674") ? +1 : (stryCov_9fa48("21674"), -1));
      }
    }, stryMutAct_9fa48("21675") ? ["Stryker was here"] : (stryCov_9fa48("21675"), []));

    // Obtener historial reciente
    const getRecentActions = useCallback((limit = 10) => {
      if (stryMutAct_9fa48("21676")) {
        {}
      } else {
        stryCov_9fa48("21676");
        return stryMutAct_9fa48("21678") ? history.reverse() : stryMutAct_9fa48("21677") ? history.slice(-limit) : (stryCov_9fa48("21677", "21678"), history.slice(stryMutAct_9fa48("21679") ? +limit : (stryCov_9fa48("21679"), -limit)).reverse());
      }
    }, stryMutAct_9fa48("21680") ? [] : (stryCov_9fa48("21680"), [history]));
    return stryMutAct_9fa48("21681") ? {} : (stryCov_9fa48("21681"), {
      addAction,
      undo,
      redo,
      canUndo,
      canRedo,
      isUndoing,
      isRedoing,
      clear,
      getRecentActions,
      historyLength: history.length,
      currentIndex
    });
  }
}

/**
 * Hook para usar undo/redo global (debe usarse dentro del Provider)
 */
export function useGlobalUndoRedo() {
  if (stryMutAct_9fa48("21682")) {
    {}
  } else {
    stryCov_9fa48("21682");
    const context = useContext(UndoRedoContext);
    if (stryMutAct_9fa48("21685") ? false : stryMutAct_9fa48("21684") ? true : stryMutAct_9fa48("21683") ? context : (stryCov_9fa48("21683", "21684", "21685"), !context)) {
      if (stryMutAct_9fa48("21686")) {
        {}
      } else {
        stryCov_9fa48("21686");
        // Retornar implementación básica si no hay provider
        return stryMutAct_9fa48("21687") ? {} : (stryCov_9fa48("21687"), {
          addAction: () => {},
          undo: async () => {},
          redo: async () => {},
          canUndo: stryMutAct_9fa48("21688") ? true : (stryCov_9fa48("21688"), false),
          canRedo: stryMutAct_9fa48("21689") ? true : (stryCov_9fa48("21689"), false),
          isUndoing: stryMutAct_9fa48("21690") ? true : (stryCov_9fa48("21690"), false),
          isRedoing: stryMutAct_9fa48("21691") ? true : (stryCov_9fa48("21691"), false),
          clear: () => {},
          getRecentActions: stryMutAct_9fa48("21692") ? () => undefined : (stryCov_9fa48("21692"), () => stryMutAct_9fa48("21693") ? ["Stryker was here"] : (stryCov_9fa48("21693"), [])),
          historyLength: 0,
          currentIndex: stryMutAct_9fa48("21694") ? +1 : (stryCov_9fa48("21694"), -1)
        });
      }
    }
    return context;
  }
}

/**
 * Provider para undo/redo global
 */
export function GlobalUndoRedoProvider({
  children
}: {
  children: React.ReactNode;
}) {
  if (stryMutAct_9fa48("21695")) {
    {}
  } else {
    stryCov_9fa48("21695");
    const undoRedo = useGlobalUndoRedoInternal();

    // Atajos de teclado globales
    useEffect(() => {
      if (stryMutAct_9fa48("21696")) {
        {}
      } else {
        stryCov_9fa48("21696");
        const handleKeyDown = (e: KeyboardEvent) => {
          if (stryMutAct_9fa48("21697")) {
            {}
          } else {
            stryCov_9fa48("21697");
            // Ignorar si está escribiendo en un input
            const target = e.target as HTMLElement;
            if (stryMutAct_9fa48("21700") ? (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.isContentEditable : stryMutAct_9fa48("21699") ? false : stryMutAct_9fa48("21698") ? true : (stryCov_9fa48("21698", "21699", "21700"), (stryMutAct_9fa48("21702") ? target.tagName === 'INPUT' && target.tagName === 'TEXTAREA' : stryMutAct_9fa48("21701") ? false : (stryCov_9fa48("21701", "21702"), (stryMutAct_9fa48("21704") ? target.tagName !== 'INPUT' : stryMutAct_9fa48("21703") ? false : (stryCov_9fa48("21703", "21704"), target.tagName === (stryMutAct_9fa48("21705") ? "" : (stryCov_9fa48("21705"), 'INPUT')))) || (stryMutAct_9fa48("21707") ? target.tagName !== 'TEXTAREA' : stryMutAct_9fa48("21706") ? false : (stryCov_9fa48("21706", "21707"), target.tagName === (stryMutAct_9fa48("21708") ? "" : (stryCov_9fa48("21708"), 'TEXTAREA')))))) || target.isContentEditable)) {
              if (stryMutAct_9fa48("21709")) {
                {}
              } else {
                stryCov_9fa48("21709");
                return;
              }
            }

            // Ctrl/Cmd + Z para undo
            if (stryMutAct_9fa48("21712") ? (e.ctrlKey || e.metaKey) && e.key === 'z' || !e.shiftKey : stryMutAct_9fa48("21711") ? false : stryMutAct_9fa48("21710") ? true : (stryCov_9fa48("21710", "21711", "21712"), (stryMutAct_9fa48("21714") ? e.ctrlKey || e.metaKey || e.key === 'z' : stryMutAct_9fa48("21713") ? true : (stryCov_9fa48("21713", "21714"), (stryMutAct_9fa48("21716") ? e.ctrlKey && e.metaKey : stryMutAct_9fa48("21715") ? true : (stryCov_9fa48("21715", "21716"), e.ctrlKey || e.metaKey)) && (stryMutAct_9fa48("21718") ? e.key !== 'z' : stryMutAct_9fa48("21717") ? true : (stryCov_9fa48("21717", "21718"), e.key === (stryMutAct_9fa48("21719") ? "" : (stryCov_9fa48("21719"), 'z')))))) && (stryMutAct_9fa48("21720") ? e.shiftKey : (stryCov_9fa48("21720"), !e.shiftKey)))) {
              if (stryMutAct_9fa48("21721")) {
                {}
              } else {
                stryCov_9fa48("21721");
                e.preventDefault();
                undoRedo.undo();
              }
            }

            // Ctrl/Cmd + Shift + Z o Ctrl/Cmd + Y para redo
            if (stryMutAct_9fa48("21724") ? (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z' && (e.ctrlKey || e.metaKey) && e.key === 'y' : stryMutAct_9fa48("21723") ? false : stryMutAct_9fa48("21722") ? true : (stryCov_9fa48("21722", "21723", "21724"), (stryMutAct_9fa48("21726") ? (e.ctrlKey || e.metaKey) && e.shiftKey || e.key === 'z' : stryMutAct_9fa48("21725") ? false : (stryCov_9fa48("21725", "21726"), (stryMutAct_9fa48("21728") ? e.ctrlKey || e.metaKey || e.shiftKey : stryMutAct_9fa48("21727") ? true : (stryCov_9fa48("21727", "21728"), (stryMutAct_9fa48("21730") ? e.ctrlKey && e.metaKey : stryMutAct_9fa48("21729") ? true : (stryCov_9fa48("21729", "21730"), e.ctrlKey || e.metaKey)) && e.shiftKey)) && (stryMutAct_9fa48("21732") ? e.key !== 'z' : stryMutAct_9fa48("21731") ? true : (stryCov_9fa48("21731", "21732"), e.key === (stryMutAct_9fa48("21733") ? "" : (stryCov_9fa48("21733"), 'z')))))) || (stryMutAct_9fa48("21735") ? e.ctrlKey || e.metaKey || e.key === 'y' : stryMutAct_9fa48("21734") ? false : (stryCov_9fa48("21734", "21735"), (stryMutAct_9fa48("21737") ? e.ctrlKey && e.metaKey : stryMutAct_9fa48("21736") ? true : (stryCov_9fa48("21736", "21737"), e.ctrlKey || e.metaKey)) && (stryMutAct_9fa48("21739") ? e.key !== 'y' : stryMutAct_9fa48("21738") ? true : (stryCov_9fa48("21738", "21739"), e.key === (stryMutAct_9fa48("21740") ? "" : (stryCov_9fa48("21740"), 'y')))))))) {
              if (stryMutAct_9fa48("21741")) {
                {}
              } else {
                stryCov_9fa48("21741");
                e.preventDefault();
                undoRedo.redo();
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("21742") ? "" : (stryCov_9fa48("21742"), 'keydown'), handleKeyDown);
        return stryMutAct_9fa48("21743") ? () => undefined : (stryCov_9fa48("21743"), () => window.removeEventListener(stryMutAct_9fa48("21744") ? "" : (stryCov_9fa48("21744"), 'keydown'), handleKeyDown));
      }
    }, stryMutAct_9fa48("21745") ? [] : (stryCov_9fa48("21745"), [undoRedo]));
    return React.createElement(UndoRedoContext.Provider, stryMutAct_9fa48("21746") ? {} : (stryCov_9fa48("21746"), {
      value: undoRedo
    }), children);
  }
}