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
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
function createPrismaClient() {
  if (stryMutAct_9fa48("25310")) {
    {}
  } else {
    stryCov_9fa48("25310");
    // Verificar que no estemos en Edge Runtime
    const isEdgeRuntime = stryMutAct_9fa48("25313") ? typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge' && typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis : stryMutAct_9fa48("25312") ? false : stryMutAct_9fa48("25311") ? true : (stryCov_9fa48("25311", "25312", "25313"), (stryMutAct_9fa48("25315") ? typeof process !== 'undefined' || process.env.NEXT_RUNTIME === 'edge' : stryMutAct_9fa48("25314") ? false : (stryCov_9fa48("25314", "25315"), (stryMutAct_9fa48("25317") ? typeof process === 'undefined' : stryMutAct_9fa48("25316") ? true : (stryCov_9fa48("25316", "25317"), typeof process !== (stryMutAct_9fa48("25318") ? "" : (stryCov_9fa48("25318"), 'undefined')))) && (stryMutAct_9fa48("25320") ? process.env.NEXT_RUNTIME !== 'edge' : stryMutAct_9fa48("25319") ? true : (stryCov_9fa48("25319", "25320"), process.env.NEXT_RUNTIME === (stryMutAct_9fa48("25321") ? "" : (stryCov_9fa48("25321"), 'edge')))))) || (stryMutAct_9fa48("25323") ? typeof globalThis !== 'undefined' || 'EdgeRuntime' in globalThis : stryMutAct_9fa48("25322") ? false : (stryCov_9fa48("25322", "25323"), (stryMutAct_9fa48("25325") ? typeof globalThis === 'undefined' : stryMutAct_9fa48("25324") ? true : (stryCov_9fa48("25324", "25325"), typeof globalThis !== (stryMutAct_9fa48("25326") ? "" : (stryCov_9fa48("25326"), 'undefined')))) && (stryMutAct_9fa48("25327") ? "" : (stryCov_9fa48("25327"), 'EdgeRuntime')) in globalThis)));
    if (stryMutAct_9fa48("25329") ? false : stryMutAct_9fa48("25328") ? true : (stryCov_9fa48("25328", "25329"), isEdgeRuntime)) {
      if (stryMutAct_9fa48("25330")) {
        {}
      } else {
        stryCov_9fa48("25330");
        throw new Error(stryMutAct_9fa48("25331") ? "" : (stryCov_9fa48("25331"), 'Prisma no puede ser usado en Edge Runtime. Asegúrate de que las rutas API tengan export const runtime = "nodejs"'));
      }
    }

    // Usar DATABASE_URL del .env o la ruta relativa por defecto
    // La URL de SQLite debe tener formato: file:./paes.db o file:paes.db
    const dbUrl = stryMutAct_9fa48("25334") ? process.env.DATABASE_URL && 'file:./paes.db' : stryMutAct_9fa48("25333") ? false : stryMutAct_9fa48("25332") ? true : (stryCov_9fa48("25332", "25333", "25334"), process.env.DATABASE_URL || (stryMutAct_9fa48("25335") ? "" : (stryCov_9fa48("25335"), 'file:./paes.db')));

    // Crear el adapter con la URL de la base de datos
    const adapter = new PrismaBetterSqlite3(stryMutAct_9fa48("25336") ? {} : (stryCov_9fa48("25336"), {
      url: dbUrl
    }));

    // Crear PrismaClient con el adapter y configuración de timeouts
    // Nota: SQLite no tiene timeouts nativos, pero podemos configurar el cliente
    return new PrismaClient(stryMutAct_9fa48("25337") ? {} : (stryCov_9fa48("25337"), {
      adapter,
      log: (stryMutAct_9fa48("25340") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("25339") ? false : stryMutAct_9fa48("25338") ? true : (stryCov_9fa48("25338", "25339", "25340"), process.env.NODE_ENV === (stryMutAct_9fa48("25341") ? "" : (stryCov_9fa48("25341"), 'development')))) ? stryMutAct_9fa48("25342") ? [] : (stryCov_9fa48("25342"), [stryMutAct_9fa48("25343") ? "" : (stryCov_9fa48("25343"), 'query'), stryMutAct_9fa48("25344") ? "" : (stryCov_9fa48("25344"), 'error'), stryMutAct_9fa48("25345") ? "" : (stryCov_9fa48("25345"), 'warn')]) : stryMutAct_9fa48("25346") ? [] : (stryCov_9fa48("25346"), [stryMutAct_9fa48("25347") ? "" : (stryCov_9fa48("25347"), 'error'), stryMutAct_9fa48("25348") ? "" : (stryCov_9fa48("25348"), 'warn')])
      // Configuración adicional para prevenir queries colgadas
      // En producción, considerar usar un timeout wrapper si es necesario
    }));
  }
}

// Lazy initialization - solo se crea cuando se accede
let prismaInstance: PrismaClient | null = null;
export const prisma = new Proxy({} as PrismaClient, stryMutAct_9fa48("25349") ? {} : (stryCov_9fa48("25349"), {
  get(_target, prop) {
    if (stryMutAct_9fa48("25350")) {
      {}
    } else {
      stryCov_9fa48("25350");
      if (stryMutAct_9fa48("25353") ? false : stryMutAct_9fa48("25352") ? true : stryMutAct_9fa48("25351") ? prismaInstance : (stryCov_9fa48("25351", "25352", "25353"), !prismaInstance)) {
        if (stryMutAct_9fa48("25354")) {
          {}
        } else {
          stryCov_9fa48("25354");
          prismaInstance = stryMutAct_9fa48("25355") ? globalForPrisma.prisma && createPrismaClient() : (stryCov_9fa48("25355"), globalForPrisma.prisma ?? createPrismaClient());
          if (stryMutAct_9fa48("25358") ? process.env.NODE_ENV === 'production' : stryMutAct_9fa48("25357") ? false : stryMutAct_9fa48("25356") ? true : (stryCov_9fa48("25356", "25357", "25358"), process.env.NODE_ENV !== (stryMutAct_9fa48("25359") ? "" : (stryCov_9fa48("25359"), 'production')))) {
            if (stryMutAct_9fa48("25360")) {
              {}
            } else {
              stryCov_9fa48("25360");
              globalForPrisma.prisma = prismaInstance;
            }
          }
        }
      }
      return (prismaInstance as unknown as Record<string | symbol, unknown>)[prop];
    }
  }
}));