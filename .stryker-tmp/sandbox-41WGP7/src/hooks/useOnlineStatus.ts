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
import { useState, useEffect } from 'react';

/**
 * Hook para detectar el estado de conexión a internet
 * Basado en estándares de Google Chrome y Firefox
 */
export function useOnlineStatus() {
  if (stryMutAct_9fa48("21932")) {
    {}
  } else {
    stryCov_9fa48("21932");
    const [isOnline, setIsOnline] = useState<boolean>(() => {
      if (stryMutAct_9fa48("21933")) {
        {}
      } else {
        stryCov_9fa48("21933");
        if (stryMutAct_9fa48("21936") ? typeof window !== 'undefined' : stryMutAct_9fa48("21935") ? false : stryMutAct_9fa48("21934") ? true : (stryCov_9fa48("21934", "21935", "21936"), typeof window === (stryMutAct_9fa48("21937") ? "" : (stryCov_9fa48("21937"), 'undefined')))) return stryMutAct_9fa48("21938") ? false : (stryCov_9fa48("21938"), true);
        return navigator.onLine;
      }
    });
    useEffect(() => {
      if (stryMutAct_9fa48("21939")) {
        {}
      } else {
        stryCov_9fa48("21939");
        if (stryMutAct_9fa48("21942") ? typeof window !== 'undefined' : stryMutAct_9fa48("21941") ? false : stryMutAct_9fa48("21940") ? true : (stryCov_9fa48("21940", "21941", "21942"), typeof window === (stryMutAct_9fa48("21943") ? "" : (stryCov_9fa48("21943"), 'undefined')))) return;
        const handleOnline = stryMutAct_9fa48("21944") ? () => undefined : (stryCov_9fa48("21944"), (() => {
          const handleOnline = () => setIsOnline(stryMutAct_9fa48("21945") ? false : (stryCov_9fa48("21945"), true));
          return handleOnline;
        })());
        const handleOffline = stryMutAct_9fa48("21946") ? () => undefined : (stryCov_9fa48("21946"), (() => {
          const handleOffline = () => setIsOnline(stryMutAct_9fa48("21947") ? true : (stryCov_9fa48("21947"), false));
          return handleOffline;
        })());
        window.addEventListener(stryMutAct_9fa48("21948") ? "" : (stryCov_9fa48("21948"), 'online'), handleOnline);
        window.addEventListener(stryMutAct_9fa48("21949") ? "" : (stryCov_9fa48("21949"), 'offline'), handleOffline);
        return () => {
          if (stryMutAct_9fa48("21950")) {
            {}
          } else {
            stryCov_9fa48("21950");
            window.removeEventListener(stryMutAct_9fa48("21951") ? "" : (stryCov_9fa48("21951"), 'online'), handleOnline);
            window.removeEventListener(stryMutAct_9fa48("21952") ? "" : (stryCov_9fa48("21952"), 'offline'), handleOffline);
          }
        };
      }
    }, stryMutAct_9fa48("21953") ? ["Stryker was here"] : (stryCov_9fa48("21953"), []));
    return isOnline;
  }
}