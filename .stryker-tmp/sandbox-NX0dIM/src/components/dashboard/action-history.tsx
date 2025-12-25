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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// ScrollArea no existe, usaremos un div con overflow
import { useGlobalUndoRedo } from '@/hooks/useGlobalUndoRedo';
import { History, Clock, Undo2, Redo2, Trash2, Edit, Plus, FileText } from 'lucide-react';
// Usaremos una función nativa para formatear tiempo
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpIcon } from '@/components/help/help-icon';
import { cn } from '@/lib/utils';

/**
 * Componente para mostrar el historial de acciones recientes en el dashboard
 * Basado en Nielsen Heuristic #3: User control and freedom
 */
export function ActionHistory() {
  if (stryMutAct_9fa48("16337")) {
    {}
  } else {
    stryCov_9fa48("16337");
    const {
      getRecentActions,
      historyLength,
      undo,
      redo,
      canUndo,
      canRedo
    } = useGlobalUndoRedo();
    const recentActions = getRecentActions(10);
    const getActionIcon = (type: string) => {
      if (stryMutAct_9fa48("16338")) {
        {}
      } else {
        stryCov_9fa48("16338");
        switch (type) {
          case stryMutAct_9fa48("16340") ? "" : (stryCov_9fa48("16340"), 'create'):
            if (stryMutAct_9fa48("16339")) {} else {
              stryCov_9fa48("16339");
              return Plus;
            }
          case stryMutAct_9fa48("16342") ? "" : (stryCov_9fa48("16342"), 'update'):
            if (stryMutAct_9fa48("16341")) {} else {
              stryCov_9fa48("16341");
              return Edit;
            }
          case stryMutAct_9fa48("16344") ? "" : (stryCov_9fa48("16344"), 'delete'):
            if (stryMutAct_9fa48("16343")) {} else {
              stryCov_9fa48("16343");
              return Trash2;
            }
          default:
            if (stryMutAct_9fa48("16345")) {} else {
              stryCov_9fa48("16345");
              return FileText;
            }
        }
      }
    };
    const getActionColor = (type: string) => {
      if (stryMutAct_9fa48("16346")) {
        {}
      } else {
        stryCov_9fa48("16346");
        switch (type) {
          case stryMutAct_9fa48("16348") ? "" : (stryCov_9fa48("16348"), 'create'):
            if (stryMutAct_9fa48("16347")) {} else {
              stryCov_9fa48("16347");
              return stryMutAct_9fa48("16349") ? "" : (stryCov_9fa48("16349"), 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400');
            }
          case stryMutAct_9fa48("16351") ? "" : (stryCov_9fa48("16351"), 'update'):
            if (stryMutAct_9fa48("16350")) {} else {
              stryCov_9fa48("16350");
              return stryMutAct_9fa48("16352") ? "" : (stryCov_9fa48("16352"), 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400');
            }
          case stryMutAct_9fa48("16354") ? "" : (stryCov_9fa48("16354"), 'delete'):
            if (stryMutAct_9fa48("16353")) {} else {
              stryCov_9fa48("16353");
              return stryMutAct_9fa48("16355") ? "" : (stryCov_9fa48("16355"), 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400');
            }
          default:
            if (stryMutAct_9fa48("16356")) {} else {
              stryCov_9fa48("16356");
              return stryMutAct_9fa48("16357") ? "" : (stryCov_9fa48("16357"), 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300');
            }
        }
      }
    };
    const formatTimeAgo = (date: Date) => {
      if (stryMutAct_9fa48("16358")) {
        {}
      } else {
        stryCov_9fa48("16358");
        const seconds = Math.floor(stryMutAct_9fa48("16359") ? (Date.now() - date.getTime()) * 1000 : (stryCov_9fa48("16359"), (stryMutAct_9fa48("16360") ? Date.now() + date.getTime() : (stryCov_9fa48("16360"), Date.now() - date.getTime())) / 1000));
        if (stryMutAct_9fa48("16364") ? seconds >= 60 : stryMutAct_9fa48("16363") ? seconds <= 60 : stryMutAct_9fa48("16362") ? false : stryMutAct_9fa48("16361") ? true : (stryCov_9fa48("16361", "16362", "16363", "16364"), seconds < 60)) return stryMutAct_9fa48("16365") ? "" : (stryCov_9fa48("16365"), 'hace unos segundos');
        if (stryMutAct_9fa48("16369") ? seconds >= 3600 : stryMutAct_9fa48("16368") ? seconds <= 3600 : stryMutAct_9fa48("16367") ? false : stryMutAct_9fa48("16366") ? true : (stryCov_9fa48("16366", "16367", "16368", "16369"), seconds < 3600)) {
          if (stryMutAct_9fa48("16370")) {
            {}
          } else {
            stryCov_9fa48("16370");
            const minutes = Math.floor(stryMutAct_9fa48("16371") ? seconds * 60 : (stryCov_9fa48("16371"), seconds / 60));
            return stryMutAct_9fa48("16372") ? `` : (stryCov_9fa48("16372"), `hace ${minutes} ${(stryMutAct_9fa48("16375") ? minutes !== 1 : stryMutAct_9fa48("16374") ? false : stryMutAct_9fa48("16373") ? true : (stryCov_9fa48("16373", "16374", "16375"), minutes === 1)) ? stryMutAct_9fa48("16376") ? "" : (stryCov_9fa48("16376"), 'minuto') : stryMutAct_9fa48("16377") ? "" : (stryCov_9fa48("16377"), 'minutos')}`);
          }
        }
        if (stryMutAct_9fa48("16381") ? seconds >= 86400 : stryMutAct_9fa48("16380") ? seconds <= 86400 : stryMutAct_9fa48("16379") ? false : stryMutAct_9fa48("16378") ? true : (stryCov_9fa48("16378", "16379", "16380", "16381"), seconds < 86400)) {
          if (stryMutAct_9fa48("16382")) {
            {}
          } else {
            stryCov_9fa48("16382");
            const hours = Math.floor(stryMutAct_9fa48("16383") ? seconds * 3600 : (stryCov_9fa48("16383"), seconds / 3600));
            return stryMutAct_9fa48("16384") ? `` : (stryCov_9fa48("16384"), `hace ${hours} ${(stryMutAct_9fa48("16387") ? hours !== 1 : stryMutAct_9fa48("16386") ? false : stryMutAct_9fa48("16385") ? true : (stryCov_9fa48("16385", "16386", "16387"), hours === 1)) ? stryMutAct_9fa48("16388") ? "" : (stryCov_9fa48("16388"), 'hora') : stryMutAct_9fa48("16389") ? "" : (stryCov_9fa48("16389"), 'horas')}`);
          }
        }
        const days = Math.floor(stryMutAct_9fa48("16390") ? seconds * 86400 : (stryCov_9fa48("16390"), seconds / 86400));
        return stryMutAct_9fa48("16391") ? `` : (stryCov_9fa48("16391"), `hace ${days} ${(stryMutAct_9fa48("16394") ? days !== 1 : stryMutAct_9fa48("16393") ? false : stryMutAct_9fa48("16392") ? true : (stryCov_9fa48("16392", "16393", "16394"), days === 1)) ? stryMutAct_9fa48("16395") ? "" : (stryCov_9fa48("16395"), 'día') : stryMutAct_9fa48("16396") ? "" : (stryCov_9fa48("16396"), 'días')}`);
      }
    };
    if (stryMutAct_9fa48("16399") ? historyLength !== 0 : stryMutAct_9fa48("16398") ? false : stryMutAct_9fa48("16397") ? true : (stryCov_9fa48("16397", "16398", "16399"), historyLength === 0)) {
      if (stryMutAct_9fa48("16400")) {
        {}
      } else {
        stryCov_9fa48("16400");
        return <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Historial de Acciones</CardTitle>
            </div>
            <HelpIcon content={<>
                  <strong>Historial de acciones</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Aquí verás las últimas cosas que hiciste en la plataforma. Como el historial de
                    tu navegador, pero para tus acciones dentro de la app.
                  </span>
                </>} />
          </div>
          <CardDescription>
            Tus acciones recientes aparecerán aquí para que puedas ver qué has hecho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              Aún no hay acciones registradas. <br />
              Cuando realices cambios, aparecerán aquí.
            </p>
          </div>
        </CardContent>
      </Card>;
      }
    }
    return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Historial de Acciones</CardTitle>
            <Badge variant="outline" className="ml-2">
              {historyLength}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={undo} disabled={stryMutAct_9fa48("16401") ? canUndo : (stryCov_9fa48("16401"), !canUndo)} className="h-8 w-8">
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  <strong>Deshacer</strong> (Ctrl+Z)
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Revierte tu última acción. Como en Word o Gmail.
                  </span>
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={redo} disabled={stryMutAct_9fa48("16402") ? canRedo : (stryCov_9fa48("16402"), !canRedo)} className="h-8 w-8">
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  <strong>Rehacer</strong> (Ctrl+Shift+Z)
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Restaura lo que deshiciste. Como el botón "adelante" en tu navegador.
                  </span>
                </p>
              </TooltipContent>
            </Tooltip>
            <HelpIcon content={<>
                  <strong>Historial de acciones</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Ve las últimas {stryMutAct_9fa48("16405") ? historyLength && 0 : stryMutAct_9fa48("16404") ? false : stryMutAct_9fa48("16403") ? true : (stryCov_9fa48("16403", "16404", "16405"), historyLength || 0)} cosas que hiciste. Útil para encontrar
                    cambios recientes o deshacer acciones.
                  </span>
                </>} />
          </div>
        </div>
        <CardDescription>
          Últimas {recentActions.length} acciones realizadas en la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-auto pr-2">
          <div className="space-y-2">
            {recentActions.map((action, index) => {
              if (stryMutAct_9fa48("16406")) {
                {}
              } else {
                stryCov_9fa48("16406");
                const Icon = getActionIcon(action.type);
                return <div key={action.id} className={cn(stryMutAct_9fa48("16407") ? "" : (stryCov_9fa48("16407"), 'flex items-start gap-3 p-3 rounded-lg border transition-colors'), stryMutAct_9fa48("16408") ? "" : (stryCov_9fa48("16408"), 'hover:bg-muted/50'), stryMutAct_9fa48("16411") ? index === 0 || 'bg-primary/5 border-primary/20' : stryMutAct_9fa48("16410") ? false : stryMutAct_9fa48("16409") ? true : (stryCov_9fa48("16409", "16410", "16411"), (stryMutAct_9fa48("16413") ? index !== 0 : stryMutAct_9fa48("16412") ? true : (stryCov_9fa48("16412", "16413"), index === 0)) && (stryMutAct_9fa48("16414") ? "" : (stryCov_9fa48("16414"), 'bg-primary/5 border-primary/20'))))}>
                  <div className={cn(stryMutAct_9fa48("16415") ? "" : (stryCov_9fa48("16415"), 'p-2 rounded-md flex-shrink-0'), getActionColor(action.type))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{action.description}</p>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {action.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(action.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>;
              }
            })}
          </div>
        </div>
      </CardContent>
    </Card>;
  }
}