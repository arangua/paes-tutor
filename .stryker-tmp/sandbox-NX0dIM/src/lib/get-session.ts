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
import { auth } from '@/lib/auth';
import { prisma } from './prisma';
import type { User, Student } from '@prisma/client';
export async function getSession() {
  if (stryMutAct_9fa48("25001")) {
    {}
  } else {
    stryCov_9fa48("25001");
    return await auth();
  }
}
export async function getCurrentUser() {
  if (stryMutAct_9fa48("25002")) {
    {}
  } else {
    stryCov_9fa48("25002");
    const session = await getSession();
    return stryMutAct_9fa48("25005") ? session?.user && null : stryMutAct_9fa48("25004") ? false : stryMutAct_9fa48("25003") ? true : (stryCov_9fa48("25003", "25004", "25005"), (stryMutAct_9fa48("25006") ? session.user : (stryCov_9fa48("25006"), session?.user)) || null);
  }
}
export async function getCurrentStudentId() {
  if (stryMutAct_9fa48("25007")) {
    {}
  } else {
    stryCov_9fa48("25007");
    const session = await getSession();
    return stryMutAct_9fa48("25010") ? session?.user?.studentId && null : stryMutAct_9fa48("25009") ? false : stryMutAct_9fa48("25008") ? true : (stryCov_9fa48("25008", "25009", "25010"), (stryMutAct_9fa48("25012") ? session.user?.studentId : stryMutAct_9fa48("25011") ? session?.user.studentId : (stryCov_9fa48("25011", "25012"), session?.user?.studentId)) || null);
  }
}

/**
 * Obtiene el usuario de la base de datos con su estudiante asociado
 * Helper para eliminar duplicación de código en múltiples endpoints
 * @param userEmail - Email del usuario de la sesión
 * @returns Usuario con student incluido o null si no existe
 */
export async function getDbUserWithStudent(userEmail: string | null | undefined): Promise<(User & {
  student: Student | null;
}) | null> {
  if (stryMutAct_9fa48("25013")) {
    {}
  } else {
    stryCov_9fa48("25013");
    if (stryMutAct_9fa48("25016") ? false : stryMutAct_9fa48("25015") ? true : stryMutAct_9fa48("25014") ? userEmail : (stryCov_9fa48("25014", "25015", "25016"), !userEmail)) {
      if (stryMutAct_9fa48("25017")) {
        {}
      } else {
        stryCov_9fa48("25017");
        return null;
      }
    }
    return await prisma.user.findUnique(stryMutAct_9fa48("25018") ? {} : (stryCov_9fa48("25018"), {
      where: stryMutAct_9fa48("25019") ? {} : (stryCov_9fa48("25019"), {
        email: userEmail
      }),
      include: stryMutAct_9fa48("25020") ? {} : (stryCov_9fa48("25020"), {
        student: stryMutAct_9fa48("25021") ? false : (stryCov_9fa48("25021"), true)
      })
    }));
  }
}

/**
 * Obtiene el usuario autenticado con su estudiante de la base de datos
 * Helper que combina getCurrentUser y getDbUserWithStudent
 * @returns Usuario con student o null si no está autenticado
 */
export async function getAuthenticatedUserWithStudent(): Promise<(User & {
  student: Student | null;
}) | null> {
  if (stryMutAct_9fa48("25022")) {
    {}
  } else {
    stryCov_9fa48("25022");
    const user = await getCurrentUser();
    if (stryMutAct_9fa48("25025") ? false : stryMutAct_9fa48("25024") ? true : stryMutAct_9fa48("25023") ? user?.email : (stryCov_9fa48("25023", "25024", "25025"), !(stryMutAct_9fa48("25026") ? user.email : (stryCov_9fa48("25026"), user?.email)))) {
      if (stryMutAct_9fa48("25027")) {
        {}
      } else {
        stryCov_9fa48("25027");
        return null;
      }
    }
    return await getDbUserWithStudent(user.email);
  }
}