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
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Proxy simplificado para Edge Runtime (reemplazo de middleware en Next.js 16+)
// No importamos next-auth aquí para evitar problemas con fs
export default async function proxy(req: NextRequest) {
  if (stryMutAct_9fa48("26588")) {
    {}
  } else {
    stryCov_9fa48("26588");
    const {
      pathname
    } = req.nextUrl;

    // Verificar si hay cookie de sesión de NextAuth
    const sessionToken = stryMutAct_9fa48("26591") ? req.cookies.get('next-auth.session-token') && req.cookies.get('__Secure-next-auth.session-token') : stryMutAct_9fa48("26590") ? false : stryMutAct_9fa48("26589") ? true : (stryCov_9fa48("26589", "26590", "26591"), req.cookies.get(stryMutAct_9fa48("26592") ? "" : (stryCov_9fa48("26592"), 'next-auth.session-token')) || req.cookies.get(stryMutAct_9fa48("26593") ? "" : (stryCov_9fa48("26593"), '__Secure-next-auth.session-token')));

    // Proteger rutas de APIs
    if (stryMutAct_9fa48("26596") ? (pathname.startsWith('/api/student') || pathname.startsWith('/api/metrics') || pathname.startsWith('/api/attempts') || pathname.startsWith('/api/exams') || pathname.startsWith('/api/recommendations') || pathname.startsWith('/api/analytics') || pathname.startsWith('/api/materials') || pathname.startsWith('/api/user')) && pathname.startsWith('/api/admin') : stryMutAct_9fa48("26595") ? false : stryMutAct_9fa48("26594") ? true : (stryCov_9fa48("26594", "26595", "26596"), (stryMutAct_9fa48("26598") ? (pathname.startsWith('/api/student') || pathname.startsWith('/api/metrics') || pathname.startsWith('/api/attempts') || pathname.startsWith('/api/exams') || pathname.startsWith('/api/recommendations') || pathname.startsWith('/api/analytics') || pathname.startsWith('/api/materials')) && pathname.startsWith('/api/user') : stryMutAct_9fa48("26597") ? false : (stryCov_9fa48("26597", "26598"), (stryMutAct_9fa48("26600") ? (pathname.startsWith('/api/student') || pathname.startsWith('/api/metrics') || pathname.startsWith('/api/attempts') || pathname.startsWith('/api/exams') || pathname.startsWith('/api/recommendations') || pathname.startsWith('/api/analytics')) && pathname.startsWith('/api/materials') : stryMutAct_9fa48("26599") ? false : (stryCov_9fa48("26599", "26600"), (stryMutAct_9fa48("26602") ? (pathname.startsWith('/api/student') || pathname.startsWith('/api/metrics') || pathname.startsWith('/api/attempts') || pathname.startsWith('/api/exams') || pathname.startsWith('/api/recommendations')) && pathname.startsWith('/api/analytics') : stryMutAct_9fa48("26601") ? false : (stryCov_9fa48("26601", "26602"), (stryMutAct_9fa48("26604") ? (pathname.startsWith('/api/student') || pathname.startsWith('/api/metrics') || pathname.startsWith('/api/attempts') || pathname.startsWith('/api/exams')) && pathname.startsWith('/api/recommendations') : stryMutAct_9fa48("26603") ? false : (stryCov_9fa48("26603", "26604"), (stryMutAct_9fa48("26606") ? (pathname.startsWith('/api/student') || pathname.startsWith('/api/metrics') || pathname.startsWith('/api/attempts')) && pathname.startsWith('/api/exams') : stryMutAct_9fa48("26605") ? false : (stryCov_9fa48("26605", "26606"), (stryMutAct_9fa48("26608") ? (pathname.startsWith('/api/student') || pathname.startsWith('/api/metrics')) && pathname.startsWith('/api/attempts') : stryMutAct_9fa48("26607") ? false : (stryCov_9fa48("26607", "26608"), (stryMutAct_9fa48("26610") ? pathname.startsWith('/api/student') && pathname.startsWith('/api/metrics') : stryMutAct_9fa48("26609") ? false : (stryCov_9fa48("26609", "26610"), (stryMutAct_9fa48("26611") ? pathname.endsWith('/api/student') : (stryCov_9fa48("26611"), pathname.startsWith(stryMutAct_9fa48("26612") ? "" : (stryCov_9fa48("26612"), '/api/student')))) || (stryMutAct_9fa48("26613") ? pathname.endsWith('/api/metrics') : (stryCov_9fa48("26613"), pathname.startsWith(stryMutAct_9fa48("26614") ? "" : (stryCov_9fa48("26614"), '/api/metrics')))))) || (stryMutAct_9fa48("26615") ? pathname.endsWith('/api/attempts') : (stryCov_9fa48("26615"), pathname.startsWith(stryMutAct_9fa48("26616") ? "" : (stryCov_9fa48("26616"), '/api/attempts')))))) || (stryMutAct_9fa48("26617") ? pathname.endsWith('/api/exams') : (stryCov_9fa48("26617"), pathname.startsWith(stryMutAct_9fa48("26618") ? "" : (stryCov_9fa48("26618"), '/api/exams')))))) || (stryMutAct_9fa48("26619") ? pathname.endsWith('/api/recommendations') : (stryCov_9fa48("26619"), pathname.startsWith(stryMutAct_9fa48("26620") ? "" : (stryCov_9fa48("26620"), '/api/recommendations')))))) || (stryMutAct_9fa48("26621") ? pathname.endsWith('/api/analytics') : (stryCov_9fa48("26621"), pathname.startsWith(stryMutAct_9fa48("26622") ? "" : (stryCov_9fa48("26622"), '/api/analytics')))))) || (stryMutAct_9fa48("26623") ? pathname.endsWith('/api/materials') : (stryCov_9fa48("26623"), pathname.startsWith(stryMutAct_9fa48("26624") ? "" : (stryCov_9fa48("26624"), '/api/materials')))))) || (stryMutAct_9fa48("26625") ? pathname.endsWith('/api/user') : (stryCov_9fa48("26625"), pathname.startsWith(stryMutAct_9fa48("26626") ? "" : (stryCov_9fa48("26626"), '/api/user')))))) || (stryMutAct_9fa48("26627") ? pathname.endsWith('/api/admin') : (stryCov_9fa48("26627"), pathname.startsWith(stryMutAct_9fa48("26628") ? "" : (stryCov_9fa48("26628"), '/api/admin')))))) {
      if (stryMutAct_9fa48("26629")) {
        {}
      } else {
        stryCov_9fa48("26629");
        // Para APIs, retornar 401 JSON si no hay sesión
        if (stryMutAct_9fa48("26632") ? false : stryMutAct_9fa48("26631") ? true : stryMutAct_9fa48("26630") ? sessionToken : (stryCov_9fa48("26630", "26631", "26632"), !sessionToken)) {
          if (stryMutAct_9fa48("26633")) {
            {}
          } else {
            stryCov_9fa48("26633");
            return NextResponse.json(stryMutAct_9fa48("26634") ? {} : (stryCov_9fa48("26634"), {
              error: stryMutAct_9fa48("26635") ? "" : (stryCov_9fa48("26635"), 'No autorizado')
            }), stryMutAct_9fa48("26636") ? {} : (stryCov_9fa48("26636"), {
              status: 401
            }));
          }
        }

        // Si hay cookie, dejar que la ruta API valide el token
        // Las rutas API tienen runtime='nodejs' y pueden usar getToken
      }
    }

    // Proteger rutas de páginas (redirigir a signin)
    if (stryMutAct_9fa48("26639") ? (pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/materials') || pathname.startsWith('/analytics')) && pathname.startsWith('/admin') : stryMutAct_9fa48("26638") ? false : stryMutAct_9fa48("26637") ? true : (stryCov_9fa48("26637", "26638", "26639"), (stryMutAct_9fa48("26641") ? (pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/materials')) && pathname.startsWith('/analytics') : stryMutAct_9fa48("26640") ? false : (stryCov_9fa48("26640", "26641"), (stryMutAct_9fa48("26643") ? (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) && pathname.startsWith('/materials') : stryMutAct_9fa48("26642") ? false : (stryCov_9fa48("26642", "26643"), (stryMutAct_9fa48("26645") ? pathname.startsWith('/dashboard') && pathname.startsWith('/profile') : stryMutAct_9fa48("26644") ? false : (stryCov_9fa48("26644", "26645"), (stryMutAct_9fa48("26646") ? pathname.endsWith('/dashboard') : (stryCov_9fa48("26646"), pathname.startsWith(stryMutAct_9fa48("26647") ? "" : (stryCov_9fa48("26647"), '/dashboard')))) || (stryMutAct_9fa48("26648") ? pathname.endsWith('/profile') : (stryCov_9fa48("26648"), pathname.startsWith(stryMutAct_9fa48("26649") ? "" : (stryCov_9fa48("26649"), '/profile')))))) || (stryMutAct_9fa48("26650") ? pathname.endsWith('/materials') : (stryCov_9fa48("26650"), pathname.startsWith(stryMutAct_9fa48("26651") ? "" : (stryCov_9fa48("26651"), '/materials')))))) || (stryMutAct_9fa48("26652") ? pathname.endsWith('/analytics') : (stryCov_9fa48("26652"), pathname.startsWith(stryMutAct_9fa48("26653") ? "" : (stryCov_9fa48("26653"), '/analytics')))))) || (stryMutAct_9fa48("26654") ? pathname.endsWith('/admin') : (stryCov_9fa48("26654"), pathname.startsWith(stryMutAct_9fa48("26655") ? "" : (stryCov_9fa48("26655"), '/admin')))))) {
      if (stryMutAct_9fa48("26656")) {
        {}
      } else {
        stryCov_9fa48("26656");
        if (stryMutAct_9fa48("26659") ? false : stryMutAct_9fa48("26658") ? true : stryMutAct_9fa48("26657") ? sessionToken : (stryCov_9fa48("26657", "26658", "26659"), !sessionToken)) {
          if (stryMutAct_9fa48("26660")) {
            {}
          } else {
            stryCov_9fa48("26660");
            const signInUrl = new URL(stryMutAct_9fa48("26661") ? "" : (stryCov_9fa48("26661"), '/auth/signin'), req.url);
            signInUrl.searchParams.set(stryMutAct_9fa48("26662") ? "" : (stryCov_9fa48("26662"), 'callbackUrl'), pathname);
            return NextResponse.redirect(signInUrl);
          }
        }
      }
    }
    return NextResponse.next();
  }
}
export const config = stryMutAct_9fa48("26663") ? {} : (stryCov_9fa48("26663"), {
  matcher: stryMutAct_9fa48("26664") ? [] : (stryCov_9fa48("26664"), [stryMutAct_9fa48("26665") ? "" : (stryCov_9fa48("26665"), '/dashboard/:path*'), stryMutAct_9fa48("26666") ? "" : (stryCov_9fa48("26666"), '/profile/:path*'), stryMutAct_9fa48("26667") ? "" : (stryCov_9fa48("26667"), '/materials/:path*'), stryMutAct_9fa48("26668") ? "" : (stryCov_9fa48("26668"), '/analytics/:path*'), stryMutAct_9fa48("26669") ? "" : (stryCov_9fa48("26669"), '/admin/:path*'), stryMutAct_9fa48("26670") ? "" : (stryCov_9fa48("26670"), '/api/student'), stryMutAct_9fa48("26671") ? "" : (stryCov_9fa48("26671"), '/api/student/:path*'), stryMutAct_9fa48("26672") ? "" : (stryCov_9fa48("26672"), '/api/metrics'), stryMutAct_9fa48("26673") ? "" : (stryCov_9fa48("26673"), '/api/metrics/:path*'), stryMutAct_9fa48("26674") ? "" : (stryCov_9fa48("26674"), '/api/attempts'), stryMutAct_9fa48("26675") ? "" : (stryCov_9fa48("26675"), '/api/attempts/:path*'), stryMutAct_9fa48("26676") ? "" : (stryCov_9fa48("26676"), '/api/exams'), stryMutAct_9fa48("26677") ? "" : (stryCov_9fa48("26677"), '/api/exams/:path*'), stryMutAct_9fa48("26678") ? "" : (stryCov_9fa48("26678"), '/api/recommendations/:path*'), stryMutAct_9fa48("26679") ? "" : (stryCov_9fa48("26679"), '/api/analytics/:path*'), stryMutAct_9fa48("26680") ? "" : (stryCov_9fa48("26680"), '/api/materials/:path*'), stryMutAct_9fa48("26681") ? "" : (stryCov_9fa48("26681"), '/api/user/:path*'), stryMutAct_9fa48("26682") ? "" : (stryCov_9fa48("26682"), '/api/admin/:path*')])
});