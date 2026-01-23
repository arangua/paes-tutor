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
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { captureError } from '@/lib/monitoring';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = stryMutAct_9fa48("17161") ? {} : (stryCov_9fa48("17161"), {
      hasError: stryMutAct_9fa48("17162") ? true : (stryCov_9fa48("17162"), false),
      error: null,
      errorInfo: null
    });
  }
  static getDerivedStateFromError(error: Error): State {
    if (stryMutAct_9fa48("17163")) {
      {}
    } else {
      stryCov_9fa48("17163");
      return stryMutAct_9fa48("17164") ? {} : (stryCov_9fa48("17164"), {
        hasError: stryMutAct_9fa48("17165") ? false : (stryCov_9fa48("17165"), true),
        error,
        errorInfo: null
      });
    }
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (stryMutAct_9fa48("17166")) {
      {}
    } else {
      stryCov_9fa48("17166");
      // Log to error tracking service
      captureError(error, stryMutAct_9fa48("17167") ? {} : (stryCov_9fa48("17167"), {
        type: stryMutAct_9fa48("17168") ? "" : (stryCov_9fa48("17168"), 'react_error_boundary'),
        componentStack: errorInfo.componentStack,
        path: (stryMutAct_9fa48("17171") ? typeof window === 'undefined' : stryMutAct_9fa48("17170") ? false : stryMutAct_9fa48("17169") ? true : (stryCov_9fa48("17169", "17170", "17171"), typeof window !== (stryMutAct_9fa48("17172") ? "" : (stryCov_9fa48("17172"), 'undefined')))) ? window.location.pathname : undefined
      }));
      this.setState(stryMutAct_9fa48("17173") ? {} : (stryCov_9fa48("17173"), {
        error,
        errorInfo
      }));
    }
  }
  handleReset = () => {
    if (stryMutAct_9fa48("17174")) {
      {}
    } else {
      stryCov_9fa48("17174");
      this.setState(stryMutAct_9fa48("17175") ? {} : (stryCov_9fa48("17175"), {
        hasError: stryMutAct_9fa48("17176") ? true : (stryCov_9fa48("17176"), false),
        error: null,
        errorInfo: null
      }));
    }
  };
  render() {
    if (stryMutAct_9fa48("17177")) {
      {}
    } else {
      stryCov_9fa48("17177");
      if (stryMutAct_9fa48("17179") ? false : stryMutAct_9fa48("17178") ? true : (stryCov_9fa48("17178", "17179"), this.state.hasError)) {
        if (stryMutAct_9fa48("17180")) {
          {}
        } else {
          stryCov_9fa48("17180");
          if (stryMutAct_9fa48("17182") ? false : stryMutAct_9fa48("17181") ? true : (stryCov_9fa48("17181", "17182"), this.props.fallback)) {
            if (stryMutAct_9fa48("17183")) {
              {}
            } else {
              stryCov_9fa48("17183");
              return this.props.fallback;
            }
          }
          return <div className="container mx-auto p-6">
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle>Algo salió mal</CardTitle>
              </div>
              <CardDescription>
                Ocurrió un error inesperado. Por favor, intenta recargar la página.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stryMutAct_9fa48("17186") ? process.env.NODE_ENV === 'development' && this.state.error || <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-mono text-destructive">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && <details className="mt-2">
                      <summary className="text-sm cursor-pointer">Stack trace</summary>
                      <pre className="mt-2 text-xs overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>}
                </div> : stryMutAct_9fa48("17185") ? false : stryMutAct_9fa48("17184") ? true : (stryCov_9fa48("17184", "17185", "17186"), (stryMutAct_9fa48("17188") ? process.env.NODE_ENV === 'development' || this.state.error : stryMutAct_9fa48("17187") ? true : (stryCov_9fa48("17187", "17188"), (stryMutAct_9fa48("17190") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("17189") ? true : (stryCov_9fa48("17189", "17190"), process.env.NODE_ENV === (stryMutAct_9fa48("17191") ? "" : (stryCov_9fa48("17191"), 'development')))) && this.state.error)) && <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-mono text-destructive">
                    {this.state.error.toString()}
                  </p>
                  {stryMutAct_9fa48("17194") ? this.state.errorInfo || <details className="mt-2">
                      <summary className="text-sm cursor-pointer">Stack trace</summary>
                      <pre className="mt-2 text-xs overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details> : stryMutAct_9fa48("17193") ? false : stryMutAct_9fa48("17192") ? true : (stryCov_9fa48("17192", "17193", "17194"), this.state.errorInfo && <details className="mt-2">
                      <summary className="text-sm cursor-pointer">Stack trace</summary>
                      <pre className="mt-2 text-xs overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>)}
                </div>)}
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Intentar de nuevo
                </Button>
                <Button onClick={stryMutAct_9fa48("17195") ? () => undefined : (stryCov_9fa48("17195"), () => window.location.reload())}>Recargar página</Button>
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