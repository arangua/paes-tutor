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
const SEARCH_HISTORY_KEY = stryMutAct_9fa48("22062") ? "" : (stryCov_9fa48("22062"), 'paes-tutor-search-history');
const MAX_HISTORY_ITEMS = 10;
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  type?: 'exam' | 'material' | 'topic' | 'general';
}

/**
 * Hook para manejar historial de búsquedas
 * Basado en estándares de Google, GitHub, VS Code
 */
export function useSearchHistory() {
  if (stryMutAct_9fa48("22063")) {
    {}
  } else {
    stryCov_9fa48("22063");
    const [history, setHistory] = useState<SearchHistoryItem[]>(stryMutAct_9fa48("22064") ? ["Stryker was here"] : (stryCov_9fa48("22064"), []));

    // Cargar historial al montar
    useEffect(() => {
      if (stryMutAct_9fa48("22065")) {
        {}
      } else {
        stryCov_9fa48("22065");
        if (stryMutAct_9fa48("22068") ? typeof window !== 'undefined' : stryMutAct_9fa48("22067") ? false : stryMutAct_9fa48("22066") ? true : (stryCov_9fa48("22066", "22067", "22068"), typeof window === (stryMutAct_9fa48("22069") ? "" : (stryCov_9fa48("22069"), 'undefined')))) return;
        try {
          if (stryMutAct_9fa48("22070")) {
            {}
          } else {
            stryCov_9fa48("22070");
            const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
            if (stryMutAct_9fa48("22072") ? false : stryMutAct_9fa48("22071") ? true : (stryCov_9fa48("22071", "22072"), saved)) {
              if (stryMutAct_9fa48("22073")) {
                {}
              } else {
                stryCov_9fa48("22073");
                setHistory(JSON.parse(saved));
              }
            }
          }
        } catch {
          // Ignorar errores de localStorage
        }
      }
    }, stryMutAct_9fa48("22074") ? ["Stryker was here"] : (stryCov_9fa48("22074"), []));

    // Guardar en historial
    const addToHistory = useCallback((query: string, type?: SearchHistoryItem['type']) => {
      if (stryMutAct_9fa48("22075")) {
        {}
      } else {
        stryCov_9fa48("22075");
        if (stryMutAct_9fa48("22078") ? false : stryMutAct_9fa48("22077") ? true : stryMutAct_9fa48("22076") ? query.trim() : (stryCov_9fa48("22076", "22077", "22078"), !(stryMutAct_9fa48("22079") ? query : (stryCov_9fa48("22079"), query.trim())))) return;
        setHistory(prev => {
          if (stryMutAct_9fa48("22080")) {
            {}
          } else {
            stryCov_9fa48("22080");
            // Eliminar duplicados y mantener orden cronológico
            const filtered = stryMutAct_9fa48("22081") ? prev : (stryCov_9fa48("22081"), prev.filter(stryMutAct_9fa48("22082") ? () => undefined : (stryCov_9fa48("22082"), item => stryMutAct_9fa48("22085") ? item.query.toLowerCase() === query.toLowerCase() : stryMutAct_9fa48("22084") ? false : stryMutAct_9fa48("22083") ? true : (stryCov_9fa48("22083", "22084", "22085"), (stryMutAct_9fa48("22086") ? item.query.toUpperCase() : (stryCov_9fa48("22086"), item.query.toLowerCase())) !== (stryMutAct_9fa48("22087") ? query.toUpperCase() : (stryCov_9fa48("22087"), query.toLowerCase()))))));
            const newItem: SearchHistoryItem = stryMutAct_9fa48("22088") ? {} : (stryCov_9fa48("22088"), {
              query: stryMutAct_9fa48("22089") ? query : (stryCov_9fa48("22089"), query.trim()),
              timestamp: Date.now(),
              type
            });
            const updated = stryMutAct_9fa48("22090") ? [newItem, ...filtered] : (stryCov_9fa48("22090"), (stryMutAct_9fa48("22091") ? [] : (stryCov_9fa48("22091"), [newItem, ...filtered])).slice(0, MAX_HISTORY_ITEMS));

            // Persistir
            try {
              if (stryMutAct_9fa48("22092")) {
                {}
              } else {
                stryCov_9fa48("22092");
                localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
              }
            } catch {
              // Ignorar errores
            }
            return updated;
          }
        });
      }
    }, stryMutAct_9fa48("22093") ? ["Stryker was here"] : (stryCov_9fa48("22093"), []));

    // Limpiar historial
    const clearHistory = useCallback(() => {
      if (stryMutAct_9fa48("22094")) {
        {}
      } else {
        stryCov_9fa48("22094");
        setHistory(stryMutAct_9fa48("22095") ? ["Stryker was here"] : (stryCov_9fa48("22095"), []));
        try {
          if (stryMutAct_9fa48("22096")) {
            {}
          } else {
            stryCov_9fa48("22096");
            localStorage.removeItem(SEARCH_HISTORY_KEY);
          }
        } catch {
          // Ignorar errores
        }
      }
    }, stryMutAct_9fa48("22097") ? ["Stryker was here"] : (stryCov_9fa48("22097"), []));

    // Obtener sugerencias basadas en query
    const getSuggestions = useCallback((query: string, limit = 5): SearchHistoryItem[] => {
      if (stryMutAct_9fa48("22098")) {
        {}
      } else {
        stryCov_9fa48("22098");
        if (stryMutAct_9fa48("22101") ? false : stryMutAct_9fa48("22100") ? true : stryMutAct_9fa48("22099") ? query.trim() : (stryCov_9fa48("22099", "22100", "22101"), !(stryMutAct_9fa48("22102") ? query : (stryCov_9fa48("22102"), query.trim())))) return stryMutAct_9fa48("22103") ? history : (stryCov_9fa48("22103"), history.slice(0, limit));
        const lowerQuery = stryMutAct_9fa48("22104") ? query.toUpperCase() : (stryCov_9fa48("22104"), query.toLowerCase());
        return stryMutAct_9fa48("22106") ? history.slice(0, limit) : stryMutAct_9fa48("22105") ? history.filter(item => item.query.toLowerCase().includes(lowerQuery)) : (stryCov_9fa48("22105", "22106"), history.filter(stryMutAct_9fa48("22107") ? () => undefined : (stryCov_9fa48("22107"), item => stryMutAct_9fa48("22108") ? item.query.toUpperCase().includes(lowerQuery) : (stryCov_9fa48("22108"), item.query.toLowerCase().includes(lowerQuery)))).slice(0, limit));
      }
    }, stryMutAct_9fa48("22109") ? [] : (stryCov_9fa48("22109"), [history]));
    return stryMutAct_9fa48("22110") ? {} : (stryCov_9fa48("22110"), {
      history,
      addToHistory,
      clearHistory,
      getSuggestions
    });
  }
}