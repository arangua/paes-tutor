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
import { useState, useCallback, useRef } from 'react';

/**
 * Hook para sistema de undo/redo
 * Basado en estándares de Google Docs, Figma, Notion
 */
export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}
export function useUndoRedo<T>(initialState: T, maxHistory = 50) {
  if (stryMutAct_9fa48("22380")) {
    {}
  } else {
    stryCov_9fa48("22380");
    const [state, setState] = useState<HistoryState<T>>(stryMutAct_9fa48("22381") ? {} : (stryCov_9fa48("22381"), {
      past: stryMutAct_9fa48("22382") ? ["Stryker was here"] : (stryCov_9fa48("22382"), []),
      present: initialState,
      future: stryMutAct_9fa48("22383") ? ["Stryker was here"] : (stryCov_9fa48("22383"), [])
    }));
    const canUndo = stryMutAct_9fa48("22387") ? state.past.length <= 0 : stryMutAct_9fa48("22386") ? state.past.length >= 0 : stryMutAct_9fa48("22385") ? false : stryMutAct_9fa48("22384") ? true : (stryCov_9fa48("22384", "22385", "22386", "22387"), state.past.length > 0);
    const canRedo = stryMutAct_9fa48("22391") ? state.future.length <= 0 : stryMutAct_9fa48("22390") ? state.future.length >= 0 : stryMutAct_9fa48("22389") ? false : stryMutAct_9fa48("22388") ? true : (stryCov_9fa48("22388", "22389", "22390", "22391"), state.future.length > 0);
    const setPresent = useCallback((newPresent: T) => {
      if (stryMutAct_9fa48("22392")) {
        {}
      } else {
        stryCov_9fa48("22392");
        setState(current => {
          if (stryMutAct_9fa48("22393")) {
            {}
          } else {
            stryCov_9fa48("22393");
            const newPast = stryMutAct_9fa48("22394") ? [...current.past, current.present] : (stryCov_9fa48("22394"), (stryMutAct_9fa48("22395") ? [] : (stryCov_9fa48("22395"), [...current.past, current.present])).slice(stryMutAct_9fa48("22396") ? +maxHistory : (stryCov_9fa48("22396"), -maxHistory)));
            return stryMutAct_9fa48("22397") ? {} : (stryCov_9fa48("22397"), {
              past: newPast,
              present: newPresent,
              future: stryMutAct_9fa48("22398") ? ["Stryker was here"] : (stryCov_9fa48("22398"), []) // Limpiar futuro al hacer nueva acción
            });
          }
        });
      }
    }, stryMutAct_9fa48("22399") ? [] : (stryCov_9fa48("22399"), [maxHistory]));
    const undo = useCallback(() => {
      if (stryMutAct_9fa48("22400")) {
        {}
      } else {
        stryCov_9fa48("22400");
        if (stryMutAct_9fa48("22403") ? false : stryMutAct_9fa48("22402") ? true : stryMutAct_9fa48("22401") ? canUndo : (stryCov_9fa48("22401", "22402", "22403"), !canUndo)) return;
        setState(current => {
          if (stryMutAct_9fa48("22404")) {
            {}
          } else {
            stryCov_9fa48("22404");
            const previous = current.past[stryMutAct_9fa48("22405") ? current.past.length + 1 : (stryCov_9fa48("22405"), current.past.length - 1)];
            const newPast = stryMutAct_9fa48("22406") ? current.past : (stryCov_9fa48("22406"), current.past.slice(0, stryMutAct_9fa48("22407") ? +1 : (stryCov_9fa48("22407"), -1)));
            return stryMutAct_9fa48("22408") ? {} : (stryCov_9fa48("22408"), {
              past: newPast,
              present: previous,
              future: stryMutAct_9fa48("22409") ? [] : (stryCov_9fa48("22409"), [current.present, ...current.future])
            });
          }
        });
      }
    }, stryMutAct_9fa48("22410") ? [] : (stryCov_9fa48("22410"), [canUndo]));
    const redo = useCallback(() => {
      if (stryMutAct_9fa48("22411")) {
        {}
      } else {
        stryCov_9fa48("22411");
        if (stryMutAct_9fa48("22414") ? false : stryMutAct_9fa48("22413") ? true : stryMutAct_9fa48("22412") ? canRedo : (stryCov_9fa48("22412", "22413", "22414"), !canRedo)) return;
        setState(current => {
          if (stryMutAct_9fa48("22415")) {
            {}
          } else {
            stryCov_9fa48("22415");
            const next = current.future[0];
            const newFuture = stryMutAct_9fa48("22416") ? current.future : (stryCov_9fa48("22416"), current.future.slice(1));
            return stryMutAct_9fa48("22417") ? {} : (stryCov_9fa48("22417"), {
              past: stryMutAct_9fa48("22418") ? [] : (stryCov_9fa48("22418"), [...current.past, current.present]),
              present: next,
              future: newFuture
            });
          }
        });
      }
    }, stryMutAct_9fa48("22419") ? [] : (stryCov_9fa48("22419"), [canRedo]));
    const clear = useCallback(() => {
      if (stryMutAct_9fa48("22420")) {
        {}
      } else {
        stryCov_9fa48("22420");
        setState(stryMutAct_9fa48("22421") ? {} : (stryCov_9fa48("22421"), {
          past: stryMutAct_9fa48("22422") ? ["Stryker was here"] : (stryCov_9fa48("22422"), []),
          present: initialState,
          future: stryMutAct_9fa48("22423") ? ["Stryker was here"] : (stryCov_9fa48("22423"), [])
        }));
      }
    }, stryMutAct_9fa48("22424") ? [] : (stryCov_9fa48("22424"), [initialState]));
    return stryMutAct_9fa48("22425") ? {} : (stryCov_9fa48("22425"), {
      state: state.present,
      setState: setPresent,
      undo,
      redo,
      canUndo,
      canRedo,
      clear,
      history: stryMutAct_9fa48("22426") ? {} : (stryCov_9fa48("22426"), {
        past: state.past.length,
        future: state.future.length
      })
    });
  }
}