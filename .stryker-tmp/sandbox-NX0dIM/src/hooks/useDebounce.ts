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
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para debounce de valores
 * Útil para búsquedas y filtros que no necesitan ejecutarse en cada keystroke
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  if (stryMutAct_9fa48("21372")) {
    {}
  } else {
    stryCov_9fa48("21372");
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
      if (stryMutAct_9fa48("21373")) {
        {}
      } else {
        stryCov_9fa48("21373");
        const handler = setTimeout(() => {
          if (stryMutAct_9fa48("21374")) {
            {}
          } else {
            stryCov_9fa48("21374");
            setDebouncedValue(value);
          }
        }, delay);
        return () => {
          if (stryMutAct_9fa48("21375")) {
            {}
          } else {
            stryCov_9fa48("21375");
            clearTimeout(handler);
          }
        };
      }
    }, stryMutAct_9fa48("21376") ? [] : (stryCov_9fa48("21376"), [value, delay]));
    return debouncedValue;
  }
}