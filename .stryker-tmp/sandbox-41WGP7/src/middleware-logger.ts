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
import { NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger';
export function logRequest(request: NextRequest, response: NextResponse) {
  if (stryMutAct_9fa48("26574")) {
    {}
  } else {
    stryCov_9fa48("26574");
    const start = Date.now();
    const method = request.method;
    const path = request.nextUrl.pathname;
    const status = response.status;
    response.headers.set(stryMutAct_9fa48("26575") ? "" : (stryCov_9fa48("26575"), 'X-Response-Time'), stryMutAct_9fa48("26576") ? `` : (stryCov_9fa48("26576"), `${stryMutAct_9fa48("26577") ? Date.now() + start : (stryCov_9fa48("26577"), Date.now() - start)}ms`));
    logger.info(stryMutAct_9fa48("26578") ? {} : (stryCov_9fa48("26578"), {
      type: stryMutAct_9fa48("26579") ? "" : (stryCov_9fa48("26579"), 'http_request'),
      method,
      path,
      status,
      duration: stryMutAct_9fa48("26580") ? Date.now() + start : (stryCov_9fa48("26580"), Date.now() - start),
      userAgent: request.headers.get(stryMutAct_9fa48("26581") ? "" : (stryCov_9fa48("26581"), 'user-agent')),
      ip: stryMutAct_9fa48("26584") ? request.headers.get('x-forwarded-for') && request.headers.get('x-real-ip') : stryMutAct_9fa48("26583") ? false : stryMutAct_9fa48("26582") ? true : (stryCov_9fa48("26582", "26583", "26584"), request.headers.get(stryMutAct_9fa48("26585") ? "" : (stryCov_9fa48("26585"), 'x-forwarded-for')) || request.headers.get(stryMutAct_9fa48("26586") ? "" : (stryCov_9fa48("26586"), 'x-real-ip')))
    }), stryMutAct_9fa48("26587") ? `` : (stryCov_9fa48("26587"), `${method} ${path} ${status}`));
    return response;
  }
}