/**
 * Utilidades para verificar permisos de administrador
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
import { getCurrentUser } from './get-session';
import { prisma } from './prisma';
export type UserRole = 'student' | 'admin' | 'teacher';

/**
 * Verifica si el usuario actual es administrador
 * @returns true si el usuario es admin, false en caso contrario
 */
export async function isAdmin(): Promise<boolean> {
  if (stryMutAct_9fa48("23404")) {
    {}
  } else {
    stryCov_9fa48("23404");
    try {
      if (stryMutAct_9fa48("23405")) {
        {}
      } else {
        stryCov_9fa48("23405");
        const user = await getCurrentUser();
        if (stryMutAct_9fa48("23408") ? false : stryMutAct_9fa48("23407") ? true : stryMutAct_9fa48("23406") ? user : (stryCov_9fa48("23406", "23407", "23408"), !user)) return stryMutAct_9fa48("23409") ? true : (stryCov_9fa48("23409"), false);
        const fullUser = await prisma.user.findUnique(stryMutAct_9fa48("23410") ? {} : (stryCov_9fa48("23410"), {
          where: stryMutAct_9fa48("23411") ? {} : (stryCov_9fa48("23411"), {
            id: user.id
          }),
          select: stryMutAct_9fa48("23412") ? {} : (stryCov_9fa48("23412"), {
            role: stryMutAct_9fa48("23413") ? false : (stryCov_9fa48("23413"), true)
          })
        }));
        return stryMutAct_9fa48("23416") ? fullUser?.role !== 'admin' : stryMutAct_9fa48("23415") ? false : stryMutAct_9fa48("23414") ? true : (stryCov_9fa48("23414", "23415", "23416"), (stryMutAct_9fa48("23417") ? fullUser.role : (stryCov_9fa48("23417"), fullUser?.role)) === (stryMutAct_9fa48("23418") ? "" : (stryCov_9fa48("23418"), 'admin')));
      }
    } catch {
      if (stryMutAct_9fa48("23419")) {
        {}
      } else {
        stryCov_9fa48("23419");
        return stryMutAct_9fa48("23420") ? true : (stryCov_9fa48("23420"), false);
      }
    }
  }
}

/**
 * Verifica si el usuario actual tiene un rol específico
 * @param role - Rol a verificar
 * @returns true si el usuario tiene el rol, false en caso contrario
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  if (stryMutAct_9fa48("23421")) {
    {}
  } else {
    stryCov_9fa48("23421");
    try {
      if (stryMutAct_9fa48("23422")) {
        {}
      } else {
        stryCov_9fa48("23422");
        const user = await getCurrentUser();
        if (stryMutAct_9fa48("23425") ? false : stryMutAct_9fa48("23424") ? true : stryMutAct_9fa48("23423") ? user : (stryCov_9fa48("23423", "23424", "23425"), !user)) return stryMutAct_9fa48("23426") ? true : (stryCov_9fa48("23426"), false);
        const fullUser = await prisma.user.findUnique(stryMutAct_9fa48("23427") ? {} : (stryCov_9fa48("23427"), {
          where: stryMutAct_9fa48("23428") ? {} : (stryCov_9fa48("23428"), {
            id: user.id
          }),
          select: stryMutAct_9fa48("23429") ? {} : (stryCov_9fa48("23429"), {
            role: stryMutAct_9fa48("23430") ? false : (stryCov_9fa48("23430"), true)
          })
        }));
        return stryMutAct_9fa48("23433") ? fullUser?.role !== role : stryMutAct_9fa48("23432") ? false : stryMutAct_9fa48("23431") ? true : (stryCov_9fa48("23431", "23432", "23433"), (stryMutAct_9fa48("23434") ? fullUser.role : (stryCov_9fa48("23434"), fullUser?.role)) === role);
      }
    } catch {
      if (stryMutAct_9fa48("23435")) {
        {}
      } else {
        stryCov_9fa48("23435");
        return stryMutAct_9fa48("23436") ? true : (stryCov_9fa48("23436"), false);
      }
    }
  }
}

/**
 * Verifica si el usuario actual tiene al menos uno de los roles especificados
 * @param roles - Array de roles a verificar
 * @returns true si el usuario tiene al menos uno de los roles, false en caso contrario
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  if (stryMutAct_9fa48("23437")) {
    {}
  } else {
    stryCov_9fa48("23437");
    try {
      if (stryMutAct_9fa48("23438")) {
        {}
      } else {
        stryCov_9fa48("23438");
        const user = await getCurrentUser();
        if (stryMutAct_9fa48("23441") ? false : stryMutAct_9fa48("23440") ? true : stryMutAct_9fa48("23439") ? user : (stryCov_9fa48("23439", "23440", "23441"), !user)) return stryMutAct_9fa48("23442") ? true : (stryCov_9fa48("23442"), false);
        const fullUser = await prisma.user.findUnique(stryMutAct_9fa48("23443") ? {} : (stryCov_9fa48("23443"), {
          where: stryMutAct_9fa48("23444") ? {} : (stryCov_9fa48("23444"), {
            id: user.id
          }),
          select: stryMutAct_9fa48("23445") ? {} : (stryCov_9fa48("23445"), {
            role: stryMutAct_9fa48("23446") ? false : (stryCov_9fa48("23446"), true)
          })
        }));
        if (stryMutAct_9fa48("23449") ? false : stryMutAct_9fa48("23448") ? true : stryMutAct_9fa48("23447") ? fullUser?.role : (stryCov_9fa48("23447", "23448", "23449"), !(stryMutAct_9fa48("23450") ? fullUser.role : (stryCov_9fa48("23450"), fullUser?.role)))) return stryMutAct_9fa48("23451") ? true : (stryCov_9fa48("23451"), false);
        return roles.includes(fullUser.role as UserRole);
      }
    } catch {
      if (stryMutAct_9fa48("23452")) {
        {}
      } else {
        stryCov_9fa48("23452");
        return stryMutAct_9fa48("23453") ? true : (stryCov_9fa48("23453"), false);
      }
    }
  }
}

/**
 * Obtiene el rol del usuario actual
 * @returns El rol del usuario o null si no está autenticado
 */
export async function getUserRole(): Promise<UserRole | null> {
  if (stryMutAct_9fa48("23454")) {
    {}
  } else {
    stryCov_9fa48("23454");
    try {
      if (stryMutAct_9fa48("23455")) {
        {}
      } else {
        stryCov_9fa48("23455");
        const user = await getCurrentUser();
        if (stryMutAct_9fa48("23458") ? false : stryMutAct_9fa48("23457") ? true : stryMutAct_9fa48("23456") ? user : (stryCov_9fa48("23456", "23457", "23458"), !user)) return null;
        const fullUser = await prisma.user.findUnique(stryMutAct_9fa48("23459") ? {} : (stryCov_9fa48("23459"), {
          where: stryMutAct_9fa48("23460") ? {} : (stryCov_9fa48("23460"), {
            id: user.id
          }),
          select: stryMutAct_9fa48("23461") ? {} : (stryCov_9fa48("23461"), {
            role: stryMutAct_9fa48("23462") ? false : (stryCov_9fa48("23462"), true)
          })
        }));
        return stryMutAct_9fa48("23465") ? fullUser?.role as UserRole && 'student' : stryMutAct_9fa48("23464") ? false : stryMutAct_9fa48("23463") ? true : (stryCov_9fa48("23463", "23464", "23465"), fullUser?.role as UserRole || (stryMutAct_9fa48("23466") ? "" : (stryCov_9fa48("23466"), 'student')));
      }
    } catch {
      if (stryMutAct_9fa48("23467")) {
        {}
      } else {
        stryCov_9fa48("23467");
        return null;
      }
    }
  }
}