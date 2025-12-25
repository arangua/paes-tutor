/**
 * Logger especializado para eventos de seguridad
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
import { logger } from './logger';
export interface SecurityEvent {
  type: 'auth_failure' | 'auth_success' | 'rate_limit' | 'invalid_input' | 'unauthorized_access' | 'suspicious_activity';
  userId?: string;
  ip?: string;
  path?: string;
  details?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Registra un evento de seguridad
 */
export function logSecurityEvent(event: SecurityEvent) {
  if (stryMutAct_9fa48("25773")) {
    {}
  } else {
    stryCov_9fa48("25773");
    const logData = stryMutAct_9fa48("25774") ? {} : (stryCov_9fa48("25774"), {
      security: stryMutAct_9fa48("25775") ? false : (stryCov_9fa48("25775"), true),
      type: event.type,
      userId: event.userId,
      ip: event.ip,
      path: event.path,
      severity: event.severity,
      timestamp: new Date().toISOString(),
      ...event.details
    });

    // Usar nivel de log apropiado según severidad
    switch (event.severity) {
      case stryMutAct_9fa48("25777") ? "" : (stryCov_9fa48("25777"), 'critical'):
        if (stryMutAct_9fa48("25776")) {} else {
          stryCov_9fa48("25776");
          logger.error(logData, stryMutAct_9fa48("25778") ? `` : (stryCov_9fa48("25778"), `[SECURITY CRITICAL] ${event.type}`));
          break;
        }
      case stryMutAct_9fa48("25780") ? "" : (stryCov_9fa48("25780"), 'high'):
        if (stryMutAct_9fa48("25779")) {} else {
          stryCov_9fa48("25779");
          logger.warn(logData, stryMutAct_9fa48("25781") ? `` : (stryCov_9fa48("25781"), `[SECURITY HIGH] ${event.type}`));
          break;
        }
      case stryMutAct_9fa48("25783") ? "" : (stryCov_9fa48("25783"), 'medium'):
        if (stryMutAct_9fa48("25782")) {} else {
          stryCov_9fa48("25782");
          logger.warn(logData, stryMutAct_9fa48("25784") ? `` : (stryCov_9fa48("25784"), `[SECURITY MEDIUM] ${event.type}`));
          break;
        }
      case stryMutAct_9fa48("25786") ? "" : (stryCov_9fa48("25786"), 'low'):
        if (stryMutAct_9fa48("25785")) {} else {
          stryCov_9fa48("25785");
          logger.info(logData, stryMutAct_9fa48("25787") ? `` : (stryCov_9fa48("25787"), `[SECURITY LOW] ${event.type}`));
          break;
        }
    }
  }
}

/**
 * Helper para obtener IP del request
 */
export function getClientIp(request: Request): string {
  if (stryMutAct_9fa48("25788")) {
    {}
  } else {
    stryCov_9fa48("25788");
    const forwarded = request.headers.get(stryMutAct_9fa48("25789") ? "" : (stryCov_9fa48("25789"), 'x-forwarded-for'));
    const realIp = request.headers.get(stryMutAct_9fa48("25790") ? "" : (stryCov_9fa48("25790"), 'x-real-ip'));
    const ip = forwarded ? stryMutAct_9fa48("25791") ? forwarded.split(',')[0] : (stryCov_9fa48("25791"), forwarded.split(stryMutAct_9fa48("25792") ? "" : (stryCov_9fa48("25792"), ','))[0].trim()) : stryMutAct_9fa48("25795") ? realIp && 'unknown' : stryMutAct_9fa48("25794") ? false : stryMutAct_9fa48("25793") ? true : (stryCov_9fa48("25793", "25794", "25795"), realIp || (stryMutAct_9fa48("25796") ? "" : (stryCov_9fa48("25796"), 'unknown')));
    return ip;
  }
}

/**
 * Helper para detectar actividad sospechosa
 */
export function detectSuspiciousActivity(ip: string, path: string, details: Record<string, unknown>): boolean {
  if (stryMutAct_9fa48("25797")) {
    {}
  } else {
    stryCov_9fa48("25797");
    // Detectar patrones sospechosos
    const suspiciousPatterns = stryMutAct_9fa48("25798") ? [] : (stryCov_9fa48("25798"), [
    // Intentos de inyección SQL
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    // Intentos de path traversal
    /\.\.\//g, // Intentos de XSS - detectar event handlers (onclick, onerror, etc.)
    stryMutAct_9fa48("25803") ? /<script|javascript:|on\w+\s*[^=:]|onclick|onerror|onload/gi : stryMutAct_9fa48("25802") ? /<script|javascript:|on\w+\S*[=:]|onclick|onerror|onload/gi : stryMutAct_9fa48("25801") ? /<script|javascript:|on\w+\s[=:]|onclick|onerror|onload/gi : stryMutAct_9fa48("25800") ? /<script|javascript:|on\W+\s*[=:]|onclick|onerror|onload/gi : stryMutAct_9fa48("25799") ? /<script|javascript:|on\w\s*[=:]|onclick|onerror|onload/gi : (stryCov_9fa48("25799", "25800", "25801", "25802", "25803"), /<script|javascript:|on\w+\s*[=:]|onclick|onerror|onload/gi), // Caracteres de control
    stryMutAct_9fa48("25804") ? /[^\x00-\x1F\x7F]/g : (stryCov_9fa48("25804"), /[\x00-\x1F\x7F]/g)]);
    const pathLower = stryMutAct_9fa48("25805") ? path.toUpperCase() : (stryCov_9fa48("25805"), path.toLowerCase());
    const detailsStr = stryMutAct_9fa48("25806") ? JSON.stringify(details).toUpperCase() : (stryCov_9fa48("25806"), JSON.stringify(details).toLowerCase());
    return stryMutAct_9fa48("25807") ? suspiciousPatterns.every(pattern => pattern.test(pathLower) || pattern.test(detailsStr)) : (stryCov_9fa48("25807"), suspiciousPatterns.some(stryMutAct_9fa48("25808") ? () => undefined : (stryCov_9fa48("25808"), pattern => stryMutAct_9fa48("25811") ? pattern.test(pathLower) && pattern.test(detailsStr) : stryMutAct_9fa48("25810") ? false : stryMutAct_9fa48("25809") ? true : (stryCov_9fa48("25809", "25810", "25811"), pattern.test(pathLower) || pattern.test(detailsStr)))));
  }
}