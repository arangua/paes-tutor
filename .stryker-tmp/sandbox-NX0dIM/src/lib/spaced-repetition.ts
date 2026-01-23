/**
 * Implementación del algoritmo SM-2 (SuperMemo 2) para repaso espaciado
 * Basado en: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
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
export interface SM2Result {
  easeFactor: number;
  interval: number; // días hasta próximo repaso
  nextReview: Date;
  reviewCount: number; // nuevo contador de repasos
}
export interface SM2Input {
  quality: number; // 0-5: 0=no recordé, 5=perfecto
  easeFactor: number;
  interval: number;
  reviewCount: number;
}

/**
 * Calcula el próximo intervalo de repaso usando el algoritmo SM-2
 * @param input Parámetros actuales de la tarjeta
 * @returns Nuevos parámetros calculados
 */
export function calculateSM2(input: SM2Input): SM2Result {
  if (stryMutAct_9fa48("26097")) {
    {}
  } else {
    stryCov_9fa48("26097");
    let {
      quality,
      easeFactor,
      interval,
      reviewCount
    } = input;

    // Calcular nuevo factor de facilidad
    easeFactor = stryMutAct_9fa48("26098") ? easeFactor - (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)) : (stryCov_9fa48("26098"), easeFactor + (stryMutAct_9fa48("26099") ? 0.1 + (5 - quality) * (0.08 + (5 - quality) * 0.02) : (stryCov_9fa48("26099"), 0.1 - (stryMutAct_9fa48("26100") ? (5 - quality) / (0.08 + (5 - quality) * 0.02) : (stryCov_9fa48("26100"), (stryMutAct_9fa48("26101") ? 5 + quality : (stryCov_9fa48("26101"), 5 - quality)) * (stryMutAct_9fa48("26102") ? 0.08 - (5 - quality) * 0.02 : (stryCov_9fa48("26102"), 0.08 + (stryMutAct_9fa48("26103") ? (5 - quality) / 0.02 : (stryCov_9fa48("26103"), (stryMutAct_9fa48("26104") ? 5 + quality : (stryCov_9fa48("26104"), 5 - quality)) * 0.02)))))))));

    // Asegurar que el factor de facilidad no sea menor que 1.3
    if (stryMutAct_9fa48("26108") ? easeFactor >= 1.3 : stryMutAct_9fa48("26107") ? easeFactor <= 1.3 : stryMutAct_9fa48("26106") ? false : stryMutAct_9fa48("26105") ? true : (stryCov_9fa48("26105", "26106", "26107", "26108"), easeFactor < 1.3)) {
      if (stryMutAct_9fa48("26109")) {
        {}
      } else {
        stryCov_9fa48("26109");
        easeFactor = 1.3;
      }
    }

    // Calcular nuevo intervalo
    if (stryMutAct_9fa48("26113") ? quality >= 3 : stryMutAct_9fa48("26112") ? quality <= 3 : stryMutAct_9fa48("26111") ? false : stryMutAct_9fa48("26110") ? true : (stryCov_9fa48("26110", "26111", "26112", "26113"), quality < 3)) {
      if (stryMutAct_9fa48("26114")) {
        {}
      } else {
        stryCov_9fa48("26114");
        // Si la respuesta fue incorrecta, reiniciar
        interval = 1;
        reviewCount = 0;
      }
    } else {
      if (stryMutAct_9fa48("26115")) {
        {}
      } else {
        stryCov_9fa48("26115");
        if (stryMutAct_9fa48("26118") ? reviewCount !== 0 : stryMutAct_9fa48("26117") ? false : stryMutAct_9fa48("26116") ? true : (stryCov_9fa48("26116", "26117", "26118"), reviewCount === 0)) {
          if (stryMutAct_9fa48("26119")) {
            {}
          } else {
            stryCov_9fa48("26119");
            interval = 1;
          }
        } else if (stryMutAct_9fa48("26122") ? reviewCount !== 1 : stryMutAct_9fa48("26121") ? false : stryMutAct_9fa48("26120") ? true : (stryCov_9fa48("26120", "26121", "26122"), reviewCount === 1)) {
          if (stryMutAct_9fa48("26123")) {
            {}
          } else {
            stryCov_9fa48("26123");
            interval = 6;
          }
        } else {
          if (stryMutAct_9fa48("26124")) {
            {}
          } else {
            stryCov_9fa48("26124");
            interval = Math.round(stryMutAct_9fa48("26125") ? interval / easeFactor : (stryCov_9fa48("26125"), interval * easeFactor));
          }
        }
        stryMutAct_9fa48("26126") ? reviewCount-- : (stryCov_9fa48("26126"), reviewCount++);
      }
    }

    // Calcular próxima fecha de repaso
    const nextReview = new Date();
    stryMutAct_9fa48("26127") ? nextReview.setTime(nextReview.getDate() + interval) : (stryCov_9fa48("26127"), nextReview.setDate(stryMutAct_9fa48("26128") ? nextReview.getDate() - interval : (stryCov_9fa48("26128"), nextReview.getDate() + interval)));
    return stryMutAct_9fa48("26129") ? {} : (stryCov_9fa48("26129"), {
      easeFactor,
      interval,
      nextReview,
      reviewCount
    });
  }
}

/**
 * Convierte una respuesta del usuario a un valor de calidad (0-5)
 * @param isCorrect Si la respuesta fue correcta
 * @param difficulty Dificultad percibida (opcional)
 * @returns Valor de calidad 0-5
 */
export function responseToQuality(isCorrect: boolean, difficulty: 'easy' | 'medium' | 'hard' = stryMutAct_9fa48("26130") ? "" : (stryCov_9fa48("26130"), 'medium')): number {
  if (stryMutAct_9fa48("26131")) {
    {}
  } else {
    stryCov_9fa48("26131");
    if (stryMutAct_9fa48("26134") ? false : stryMutAct_9fa48("26133") ? true : stryMutAct_9fa48("26132") ? isCorrect : (stryCov_9fa48("26132", "26133", "26134"), !isCorrect)) return 0;
    switch (difficulty) {
      case stryMutAct_9fa48("26136") ? "" : (stryCov_9fa48("26136"), 'easy'):
        if (stryMutAct_9fa48("26135")) {} else {
          stryCov_9fa48("26135");
          return 5;
        }
      case stryMutAct_9fa48("26138") ? "" : (stryCov_9fa48("26138"), 'medium'):
        if (stryMutAct_9fa48("26137")) {} else {
          stryCov_9fa48("26137");
          return 4;
        }
      case stryMutAct_9fa48("26140") ? "" : (stryCov_9fa48("26140"), 'hard'):
        if (stryMutAct_9fa48("26139")) {} else {
          stryCov_9fa48("26139");
          return 3;
        }
      default:
        if (stryMutAct_9fa48("26141")) {} else {
          stryCov_9fa48("26141");
          return 4;
        }
    }
  }
}