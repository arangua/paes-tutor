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
import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { captureError } from '@/lib/monitoring';
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary para capturar errores de React y mostrar UI de fallback
 * Útil para prevenir que errores en componentes rompan toda la aplicación
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = stryMutAct_9fa48("17196") ? {} : (stryCov_9fa48("17196"), {
      hasError: stryMutAct_9fa48("17197") ? true : (stryCov_9fa48("17197"), false),
      error: null
    });
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    if (stryMutAct_9fa48("17198")) {
      {}
    } else {
      stryCov_9fa48("17198");
      return stryMutAct_9fa48("17199") ? {} : (stryCov_9fa48("17199"), {
        hasError: stryMutAct_9fa48("17200") ? false : (stryCov_9fa48("17200"), true),
        error
      });
    }
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (stryMutAct_9fa48("17201")) {
      {}
    } else {
      stryCov_9fa48("17201");
      // Log error to monitoring service (Sentry, etc.)
      if (stryMutAct_9fa48("17203") ? false : stryMutAct_9fa48("17202") ? true : (stryCov_9fa48("17202", "17203"), this.props.onError)) {
        if (stryMutAct_9fa48("17204")) {
          {}
        } else {
          stryCov_9fa48("17204");
          this.props.onError(error, errorInfo);
        }
      } else {
        if (stryMutAct_9fa48("17205")) {
          {}
        } else {
          stryCov_9fa48("17205");
          // Fallback logging usando servicio de monitoreo
          captureError(error, stryMutAct_9fa48("17206") ? {} : (stryCov_9fa48("17206"), {
            type: stryMutAct_9fa48("17207") ? "" : (stryCov_9fa48("17207"), 'react_error_boundary'),
            componentStack: errorInfo.componentStack,
            path: (stryMutAct_9fa48("17210") ? typeof window === 'undefined' : stryMutAct_9fa48("17209") ? false : stryMutAct_9fa48("17208") ? true : (stryCov_9fa48("17208", "17209", "17210"), typeof window !== (stryMutAct_9fa48("17211") ? "" : (stryCov_9fa48("17211"), 'undefined')))) ? window.location.pathname : undefined
          }));
        }
      }
    }
  }
  handleReset = () => {
    if (stryMutAct_9fa48("17212")) {
      {}
    } else {
      stryCov_9fa48("17212");
      this.setState(stryMutAct_9fa48("17213") ? {} : (stryCov_9fa48("17213"), {
        hasError: stryMutAct_9fa48("17214") ? true : (stryCov_9fa48("17214"), false),
        error: null
      }));
      window.location.reload();
    }
  };
  render() {
    if (stryMutAct_9fa48("17215")) {
      {}
    } else {
      stryCov_9fa48("17215");
      if (stryMutAct_9fa48("17217") ? false : stryMutAct_9fa48("17216") ? true : (stryCov_9fa48("17216", "17217"), this.state.hasError)) {
        if (stryMutAct_9fa48("17218")) {
          {}
        } else {
          stryCov_9fa48("17218");
          if (stryMutAct_9fa48("17220") ? false : stryMutAct_9fa48("17219") ? true : (stryCov_9fa48("17219", "17220"), this.props.fallback)) {
            if (stryMutAct_9fa48("17221")) {
              {}
            } else {
              stryCov_9fa48("17221");
              return this.props.fallback;
            }
          }
          return <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <CardTitle>Algo salió mal</CardTitle>
              </div>
              <CardDescription>
                Ocurrió un error inesperado. Por favor, intenta recargar la página.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stryMutAct_9fa48("17224") ? process.env.NODE_ENV === 'development' && this.state.error || <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <p className="text-sm font-mono text-red-800 dark:text-red-200">
                    {this.state.error.message}
                  </p>
                </div> : stryMutAct_9fa48("17223") ? false : stryMutAct_9fa48("17222") ? true : (stryCov_9fa48("17222", "17223", "17224"), (stryMutAct_9fa48("17226") ? process.env.NODE_ENV === 'development' || this.state.error : stryMutAct_9fa48("17225") ? true : (stryCov_9fa48("17225", "17226"), (stryMutAct_9fa48("17228") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("17227") ? true : (stryCov_9fa48("17227", "17228"), process.env.NODE_ENV === (stryMutAct_9fa48("17229") ? "" : (stryCov_9fa48("17229"), 'development')))) && this.state.error)) && <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <p className="text-sm font-mono text-red-800 dark:text-red-200">
                    {this.state.error.message}
                  </p>
                </div>)}
              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  Recargar Página
                </Button>
                <Button variant="outline" onClick={stryMutAct_9fa48("17230") ? () => undefined : (stryCov_9fa48("17230"), () => window.location.href = stryMutAct_9fa48("17231") ? "" : (stryCov_9fa48("17231"), '/'))} className="flex-1">
                  Ir al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>;
        }
      }
      return this.props.children;
    }
  }
}
export { ErrorBoundary };