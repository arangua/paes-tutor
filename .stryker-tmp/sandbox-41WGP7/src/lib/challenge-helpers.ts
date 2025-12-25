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
import type { Attempt } from '@prisma/client';

/**
 * Determina el ganador de un desafío comparando los porcentajes de dos intentos
 * @param challengerAttempt - Intento del desafiador
 * @param challengedAttempt - Intento del desafiado
 * @param challengerId - ID del desafiador
 * @param challengedId - ID del desafiado
 * @returns ID del ganador o null si hay empate
 */
export function determineChallengeWinner(challengerAttempt: Attempt | null, challengedAttempt: Attempt | null, challengerId: string, challengedId: string): string | null {
  if (stryMutAct_9fa48("23283")) {
    {}
  } else {
    stryCov_9fa48("23283");
    if (stryMutAct_9fa48("23286") ? !challengerAttempt && !challengedAttempt : stryMutAct_9fa48("23285") ? false : stryMutAct_9fa48("23284") ? true : (stryCov_9fa48("23284", "23285", "23286"), (stryMutAct_9fa48("23287") ? challengerAttempt : (stryCov_9fa48("23287"), !challengerAttempt)) || (stryMutAct_9fa48("23288") ? challengedAttempt : (stryCov_9fa48("23288"), !challengedAttempt)))) {
      if (stryMutAct_9fa48("23289")) {
        {}
      } else {
        stryCov_9fa48("23289");
        return null;
      }
    }
    if (stryMutAct_9fa48("23293") ? challengedAttempt.porcentaje <= challengerAttempt.porcentaje : stryMutAct_9fa48("23292") ? challengedAttempt.porcentaje >= challengerAttempt.porcentaje : stryMutAct_9fa48("23291") ? false : stryMutAct_9fa48("23290") ? true : (stryCov_9fa48("23290", "23291", "23292", "23293"), challengedAttempt.porcentaje > challengerAttempt.porcentaje)) {
      if (stryMutAct_9fa48("23294")) {
        {}
      } else {
        stryCov_9fa48("23294");
        return challengedId;
      }
    }
    if (stryMutAct_9fa48("23298") ? challengedAttempt.porcentaje >= challengerAttempt.porcentaje : stryMutAct_9fa48("23297") ? challengedAttempt.porcentaje <= challengerAttempt.porcentaje : stryMutAct_9fa48("23296") ? false : stryMutAct_9fa48("23295") ? true : (stryCov_9fa48("23295", "23296", "23297", "23298"), challengedAttempt.porcentaje < challengerAttempt.porcentaje)) {
      if (stryMutAct_9fa48("23299")) {
        {}
      } else {
        stryCov_9fa48("23299");
        return challengerId;
      }
    }
    // Si son iguales, queda null (empate)
    return null;
  }
}

/**
 * Valida que un intento pertenezca al estudiante correcto y esté completado
 * @param attempt - Intento a validar
 * @param expectedStudentId - ID del estudiante esperado
 * @param challengeExamId - ID del examen del desafío (opcional)
 * @returns Objeto con isValid y errorMessage
 */
export function validateChallengeAttempt(attempt: Attempt | null, expectedStudentId: string, challengeExamId?: string | null): {
  isValid: boolean;
  errorMessage?: string;
} {
  if (stryMutAct_9fa48("23300")) {
    {}
  } else {
    stryCov_9fa48("23300");
    if (stryMutAct_9fa48("23303") ? false : stryMutAct_9fa48("23302") ? true : stryMutAct_9fa48("23301") ? attempt : (stryCov_9fa48("23301", "23302", "23303"), !attempt)) {
      if (stryMutAct_9fa48("23304")) {
        {}
      } else {
        stryCov_9fa48("23304");
        return stryMutAct_9fa48("23305") ? {} : (stryCov_9fa48("23305"), {
          isValid: stryMutAct_9fa48("23306") ? true : (stryCov_9fa48("23306"), false),
          errorMessage: stryMutAct_9fa48("23307") ? "" : (stryCov_9fa48("23307"), 'Intento no encontrado')
        });
      }
    }
    if (stryMutAct_9fa48("23310") ? attempt.studentId === expectedStudentId : stryMutAct_9fa48("23309") ? false : stryMutAct_9fa48("23308") ? true : (stryCov_9fa48("23308", "23309", "23310"), attempt.studentId !== expectedStudentId)) {
      if (stryMutAct_9fa48("23311")) {
        {}
      } else {
        stryCov_9fa48("23311");
        return stryMutAct_9fa48("23312") ? {} : (stryCov_9fa48("23312"), {
          isValid: stryMutAct_9fa48("23313") ? true : (stryCov_9fa48("23313"), false),
          errorMessage: stryMutAct_9fa48("23314") ? "" : (stryCov_9fa48("23314"), 'Intento inválido')
        });
      }
    }
    if (stryMutAct_9fa48("23317") ? attempt.estado === 'completado' : stryMutAct_9fa48("23316") ? false : stryMutAct_9fa48("23315") ? true : (stryCov_9fa48("23315", "23316", "23317"), attempt.estado !== (stryMutAct_9fa48("23318") ? "" : (stryCov_9fa48("23318"), 'completado')))) {
      if (stryMutAct_9fa48("23319")) {
        {}
      } else {
        stryCov_9fa48("23319");
        return stryMutAct_9fa48("23320") ? {} : (stryCov_9fa48("23320"), {
          isValid: stryMutAct_9fa48("23321") ? true : (stryCov_9fa48("23321"), false),
          errorMessage: stryMutAct_9fa48("23322") ? "" : (stryCov_9fa48("23322"), 'El intento debe estar completado')
        });
      }
    }
    if (stryMutAct_9fa48("23325") ? challengeExamId || attempt.examId !== challengeExamId : stryMutAct_9fa48("23324") ? false : stryMutAct_9fa48("23323") ? true : (stryCov_9fa48("23323", "23324", "23325"), challengeExamId && (stryMutAct_9fa48("23327") ? attempt.examId === challengeExamId : stryMutAct_9fa48("23326") ? true : (stryCov_9fa48("23326", "23327"), attempt.examId !== challengeExamId)))) {
      if (stryMutAct_9fa48("23328")) {
        {}
      } else {
        stryCov_9fa48("23328");
        return stryMutAct_9fa48("23329") ? {} : (stryCov_9fa48("23329"), {
          isValid: stryMutAct_9fa48("23330") ? true : (stryCov_9fa48("23330"), false),
          errorMessage: stryMutAct_9fa48("23331") ? "" : (stryCov_9fa48("23331"), 'El intento no corresponde al examen del desafío')
        });
      }
    }
    return stryMutAct_9fa48("23332") ? {} : (stryCov_9fa48("23332"), {
      isValid: stryMutAct_9fa48("23333") ? false : (stryCov_9fa48("23333"), true)
    });
  }
}

/**
 * Obtiene el include estándar para desafíos con todas las relaciones
 */
export function getChallengeInclude() {
  if (stryMutAct_9fa48("23334")) {
    {}
  } else {
    stryCov_9fa48("23334");
    return {
      exam: {
        include: {
          subject: {
            select: {
              id: true,
              nombre: true,
              codigo: true
            }
          }
        }
      },
      challenger: {
        select: {
          id: true,
          nombre: true
        }
      },
      challenged: {
        select: {
          id: true,
          nombre: true
        }
      },
      challengerAttempt: {
        select: {
          id: true,
          porcentaje: true,
          puntajePaes: true,
          correctas: true,
          totalPreguntas: true,
          createdAt: true
        }
      },
      challengedAttempt: {
        select: {
          id: true,
          porcentaje: true,
          puntajePaes: true,
          correctas: true,
          totalPreguntas: true,
          createdAt: true
        }
      },
      winner: {
        select: {
          id: true,
          nombre: true
        }
      }
    } as const;
  }
}