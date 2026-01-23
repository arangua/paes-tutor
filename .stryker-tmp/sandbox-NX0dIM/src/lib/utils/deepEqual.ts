/**
 * Función de comparación profunda más robusta que JSON.stringify
 * Maneja casos edge como referencias circulares, funciones, etc.
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
export function deepEqual(a: unknown, b: unknown): boolean {
  if (stryMutAct_9fa48("26260")) {
    {}
  } else {
    stryCov_9fa48("26260");
    // Comparación de igualdad estricta (incluye null, undefined, primitivos)
    if (stryMutAct_9fa48("26263") ? a !== b : stryMutAct_9fa48("26262") ? false : stryMutAct_9fa48("26261") ? true : (stryCov_9fa48("26261", "26262", "26263"), a === b)) return stryMutAct_9fa48("26264") ? false : (stryCov_9fa48("26264"), true);

    // Si uno es null/undefined y el otro no, son diferentes
    if (stryMutAct_9fa48("26267") ? a == null && b == null : stryMutAct_9fa48("26266") ? false : stryMutAct_9fa48("26265") ? true : (stryCov_9fa48("26265", "26266", "26267"), (stryMutAct_9fa48("26269") ? a != null : stryMutAct_9fa48("26268") ? false : (stryCov_9fa48("26268", "26269"), a == null)) || (stryMutAct_9fa48("26271") ? b != null : stryMutAct_9fa48("26270") ? false : (stryCov_9fa48("26270", "26271"), b == null)))) return stryMutAct_9fa48("26272") ? true : (stryCov_9fa48("26272"), false);

    // Si no son objetos, son diferentes
    if (stryMutAct_9fa48("26275") ? typeof a !== 'object' && typeof b !== 'object' : stryMutAct_9fa48("26274") ? false : stryMutAct_9fa48("26273") ? true : (stryCov_9fa48("26273", "26274", "26275"), (stryMutAct_9fa48("26277") ? typeof a === 'object' : stryMutAct_9fa48("26276") ? false : (stryCov_9fa48("26276", "26277"), typeof a !== (stryMutAct_9fa48("26278") ? "" : (stryCov_9fa48("26278"), 'object')))) || (stryMutAct_9fa48("26280") ? typeof b === 'object' : stryMutAct_9fa48("26279") ? false : (stryCov_9fa48("26279", "26280"), typeof b !== (stryMutAct_9fa48("26281") ? "" : (stryCov_9fa48("26281"), 'object')))))) return stryMutAct_9fa48("26282") ? true : (stryCov_9fa48("26282"), false);

    // Si son arrays, comparar elementos
    if (stryMutAct_9fa48("26285") ? Array.isArray(a) || Array.isArray(b) : stryMutAct_9fa48("26284") ? false : stryMutAct_9fa48("26283") ? true : (stryCov_9fa48("26283", "26284", "26285"), Array.isArray(a) && Array.isArray(b))) {
      if (stryMutAct_9fa48("26286")) {
        {}
      } else {
        stryCov_9fa48("26286");
        if (stryMutAct_9fa48("26289") ? a.length === b.length : stryMutAct_9fa48("26288") ? false : stryMutAct_9fa48("26287") ? true : (stryCov_9fa48("26287", "26288", "26289"), a.length !== b.length)) return stryMutAct_9fa48("26290") ? true : (stryCov_9fa48("26290"), false);
        for (let i = 0; stryMutAct_9fa48("26293") ? i >= a.length : stryMutAct_9fa48("26292") ? i <= a.length : stryMutAct_9fa48("26291") ? false : (stryCov_9fa48("26291", "26292", "26293"), i < a.length); stryMutAct_9fa48("26294") ? i-- : (stryCov_9fa48("26294"), i++)) {
          if (stryMutAct_9fa48("26295")) {
            {}
          } else {
            stryCov_9fa48("26295");
            if (stryMutAct_9fa48("26298") ? false : stryMutAct_9fa48("26297") ? true : stryMutAct_9fa48("26296") ? deepEqual(a[i], b[i]) : (stryCov_9fa48("26296", "26297", "26298"), !deepEqual(a[i], b[i]))) return stryMutAct_9fa48("26299") ? true : (stryCov_9fa48("26299"), false);
          }
        }
        return stryMutAct_9fa48("26300") ? false : (stryCov_9fa48("26300"), true);
      }
    }

    // Si uno es array y el otro no, son diferentes
    if (stryMutAct_9fa48("26303") ? Array.isArray(a) && Array.isArray(b) : stryMutAct_9fa48("26302") ? false : stryMutAct_9fa48("26301") ? true : (stryCov_9fa48("26301", "26302", "26303"), Array.isArray(a) || Array.isArray(b))) return stryMutAct_9fa48("26304") ? true : (stryCov_9fa48("26304"), false);

    // Comparar objetos
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (stryMutAct_9fa48("26307") ? keysA.length === keysB.length : stryMutAct_9fa48("26306") ? false : stryMutAct_9fa48("26305") ? true : (stryCov_9fa48("26305", "26306", "26307"), keysA.length !== keysB.length)) return stryMutAct_9fa48("26308") ? true : (stryCov_9fa48("26308"), false);
    for (const key of keysA) {
      if (stryMutAct_9fa48("26309")) {
        {}
      } else {
        stryCov_9fa48("26309");
        if (stryMutAct_9fa48("26312") ? false : stryMutAct_9fa48("26311") ? true : stryMutAct_9fa48("26310") ? keysB.includes(key) : (stryCov_9fa48("26310", "26311", "26312"), !keysB.includes(key))) return stryMutAct_9fa48("26313") ? true : (stryCov_9fa48("26313"), false);
        const valueA = (a as Record<string, unknown>)[key];
        const valueB = (b as Record<string, unknown>)[key];
        if (stryMutAct_9fa48("26316") ? false : stryMutAct_9fa48("26315") ? true : stryMutAct_9fa48("26314") ? deepEqual(valueA, valueB) : (stryCov_9fa48("26314", "26315", "26316"), !deepEqual(valueA, valueB))) return stryMutAct_9fa48("26317") ? true : (stryCov_9fa48("26317"), false);
      }
    }
    return stryMutAct_9fa48("26318") ? false : (stryCov_9fa48("26318"), true);
  }
}

/**
 * Comparación segura que maneja errores (referencias circulares, etc.)
 */
export function safeDeepEqual(a: unknown, b: unknown): boolean {
  if (stryMutAct_9fa48("26319")) {
    {}
  } else {
    stryCov_9fa48("26319");
    try {
      if (stryMutAct_9fa48("26320")) {
        {}
      } else {
        stryCov_9fa48("26320");
        return deepEqual(a, b);
      }
    } catch (error) {
      if (stryMutAct_9fa48("26321")) {
        {}
      } else {
        stryCov_9fa48("26321");
        // Si hay error (referencia circular, etc.), usar JSON.stringify como fallback
        try {
          if (stryMutAct_9fa48("26322")) {
            {}
          } else {
            stryCov_9fa48("26322");
            return stryMutAct_9fa48("26325") ? JSON.stringify(a) !== JSON.stringify(b) : stryMutAct_9fa48("26324") ? false : stryMutAct_9fa48("26323") ? true : (stryCov_9fa48("26323", "26324", "26325"), JSON.stringify(a) === JSON.stringify(b));
          }
        } catch {
          if (stryMutAct_9fa48("26326")) {
            {}
          } else {
            stryCov_9fa48("26326");
            // Si JSON.stringify también falla, considerar diferentes
            return stryMutAct_9fa48("26327") ? true : (stryCov_9fa48("26327"), false);
          }
        }
      }
    }
  }
}