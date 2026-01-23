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
import React from 'react';
import type { ErrorInfo } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { captureError } from '@/lib/monitoring';
interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper del ErrorBoundary con integración de monitoreo
 */
export function ErrorBoundaryWrapper({
  children
}: ErrorBoundaryWrapperProps) {
  if (stryMutAct_9fa48("17232")) {
    {}
  } else {
    stryCov_9fa48("17232");
    const handleError = React.useCallback((error: Error, errorInfo: ErrorInfo) => {
      if (stryMutAct_9fa48("17233")) {
        {}
      } else {
        stryCov_9fa48("17233");
        try {
          if (stryMutAct_9fa48("17234")) {
            {}
          } else {
            stryCov_9fa48("17234");
            captureError(error, stryMutAct_9fa48("17235") ? {} : (stryCov_9fa48("17235"), {
              type: stryMutAct_9fa48("17236") ? "" : (stryCov_9fa48("17236"), 'react_error_boundary'),
              componentStack: errorInfo.componentStack,
              errorBoundary: stryMutAct_9fa48("17237") ? false : (stryCov_9fa48("17237"), true)
            }));
          }
        } catch (err) {
          if (stryMutAct_9fa48("17238")) {
            {}
          } else {
            stryCov_9fa48("17238");
            // Fallback si captureError falla - intentar capturar el error del fallback también
            const fallbackError = err instanceof Error ? err : new Error(String(err));
            captureError(fallbackError, stryMutAct_9fa48("17239") ? {} : (stryCov_9fa48("17239"), {
              type: stryMutAct_9fa48("17240") ? "" : (stryCov_9fa48("17240"), 'error_boundary_fallback'),
              originalError: error.message,
              componentStack: errorInfo.componentStack
            }));
          }
        }
      }
    }, stryMutAct_9fa48("17241") ? ["Stryker was here"] : (stryCov_9fa48("17241"), []));
    return <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>;
  }
}