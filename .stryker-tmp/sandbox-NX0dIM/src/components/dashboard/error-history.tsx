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
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// ScrollArea no existe, usaremos un div con overflow
import { AlertCircle, CheckCircle2, Clock, Wifi, Shield, Database, Settings, FileText, ExternalLink } from 'lucide-react';
import { useErrorHistory, UserError } from '@/hooks/useErrorHistory';
import { HelpIcon } from '@/components/help/help-icon';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Componente para mostrar el historial de errores del usuario
 * Basado en Nielsen Heuristic #9: Help users recognize, diagnose, and recover from errors
 */
export function ErrorHistory() {
  if (stryMutAct_9fa48("16416")) {
    {}
  } else {
    stryCov_9fa48("16416");
    const {
      errors,
      unresolvedErrors,
      markAsResolved,
      clearHistory,
      stats
    } = useErrorHistory();
    const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>(stryMutAct_9fa48("16417") ? "" : (stryCov_9fa48("16417"), 'all'));
    const [categoryFilter, setCategoryFilter] = useState<string>(stryMutAct_9fa48("16418") ? "" : (stryCov_9fa48("16418"), 'all'));
    const [severityFilter, setSeverityFilter] = useState<string>(stryMutAct_9fa48("16419") ? "" : (stryCov_9fa48("16419"), 'all'));
    const getCategoryIcon = (category: UserError['category']) => {
      if (stryMutAct_9fa48("16420")) {
        {}
      } else {
        stryCov_9fa48("16420");
        switch (category) {
          case stryMutAct_9fa48("16422") ? "" : (stryCov_9fa48("16422"), 'validation'):
            if (stryMutAct_9fa48("16421")) {} else {
              stryCov_9fa48("16421");
              return FileText;
            }
          case stryMutAct_9fa48("16424") ? "" : (stryCov_9fa48("16424"), 'network'):
            if (stryMutAct_9fa48("16423")) {} else {
              stryCov_9fa48("16423");
              return Wifi;
            }
          case stryMutAct_9fa48("16426") ? "" : (stryCov_9fa48("16426"), 'permission'):
            if (stryMutAct_9fa48("16425")) {} else {
              stryCov_9fa48("16425");
              return Shield;
            }
          case stryMutAct_9fa48("16428") ? "" : (stryCov_9fa48("16428"), 'data'):
            if (stryMutAct_9fa48("16427")) {} else {
              stryCov_9fa48("16427");
              return Database;
            }
          case stryMutAct_9fa48("16430") ? "" : (stryCov_9fa48("16430"), 'system'):
            if (stryMutAct_9fa48("16429")) {} else {
              stryCov_9fa48("16429");
              return Settings;
            }
          default:
            if (stryMutAct_9fa48("16431")) {} else {
              stryCov_9fa48("16431");
              return AlertCircle;
            }
        }
      }
    };
    const getCategoryColor = (category: UserError['category']) => {
      if (stryMutAct_9fa48("16432")) {
        {}
      } else {
        stryCov_9fa48("16432");
        switch (category) {
          case stryMutAct_9fa48("16434") ? "" : (stryCov_9fa48("16434"), 'validation'):
            if (stryMutAct_9fa48("16433")) {} else {
              stryCov_9fa48("16433");
              return stryMutAct_9fa48("16435") ? "" : (stryCov_9fa48("16435"), 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400');
            }
          case stryMutAct_9fa48("16437") ? "" : (stryCov_9fa48("16437"), 'network'):
            if (stryMutAct_9fa48("16436")) {} else {
              stryCov_9fa48("16436");
              return stryMutAct_9fa48("16438") ? "" : (stryCov_9fa48("16438"), 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400');
            }
          case stryMutAct_9fa48("16440") ? "" : (stryCov_9fa48("16440"), 'permission'):
            if (stryMutAct_9fa48("16439")) {} else {
              stryCov_9fa48("16439");
              return stryMutAct_9fa48("16441") ? "" : (stryCov_9fa48("16441"), 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400');
            }
          case stryMutAct_9fa48("16443") ? "" : (stryCov_9fa48("16443"), 'data'):
            if (stryMutAct_9fa48("16442")) {} else {
              stryCov_9fa48("16442");
              return stryMutAct_9fa48("16444") ? "" : (stryCov_9fa48("16444"), 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400');
            }
          case stryMutAct_9fa48("16446") ? "" : (stryCov_9fa48("16446"), 'system'):
            if (stryMutAct_9fa48("16445")) {} else {
              stryCov_9fa48("16445");
              return stryMutAct_9fa48("16447") ? "" : (stryCov_9fa48("16447"), 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300');
            }
          default:
            if (stryMutAct_9fa48("16448")) {} else {
              stryCov_9fa48("16448");
              return stryMutAct_9fa48("16449") ? "" : (stryCov_9fa48("16449"), 'bg-gray-100 text-gray-700');
            }
        }
      }
    };
    const getSeverityColor = (severity: UserError['severity']) => {
      if (stryMutAct_9fa48("16450")) {
        {}
      } else {
        stryCov_9fa48("16450");
        switch (severity) {
          case stryMutAct_9fa48("16452") ? "" : (stryCov_9fa48("16452"), 'critical'):
            if (stryMutAct_9fa48("16451")) {} else {
              stryCov_9fa48("16451");
              return stryMutAct_9fa48("16453") ? "" : (stryCov_9fa48("16453"), 'bg-red-500 text-white');
            }
          case stryMutAct_9fa48("16455") ? "" : (stryCov_9fa48("16455"), 'high'):
            if (stryMutAct_9fa48("16454")) {} else {
              stryCov_9fa48("16454");
              return stryMutAct_9fa48("16456") ? "" : (stryCov_9fa48("16456"), 'bg-orange-500 text-white');
            }
          case stryMutAct_9fa48("16458") ? "" : (stryCov_9fa48("16458"), 'medium'):
            if (stryMutAct_9fa48("16457")) {} else {
              stryCov_9fa48("16457");
              return stryMutAct_9fa48("16459") ? "" : (stryCov_9fa48("16459"), 'bg-yellow-500 text-white');
            }
          case stryMutAct_9fa48("16461") ? "" : (stryCov_9fa48("16461"), 'low'):
            if (stryMutAct_9fa48("16460")) {} else {
              stryCov_9fa48("16460");
              return stryMutAct_9fa48("16462") ? "" : (stryCov_9fa48("16462"), 'bg-blue-500 text-white');
            }
          default:
            if (stryMutAct_9fa48("16463")) {} else {
              stryCov_9fa48("16463");
              return stryMutAct_9fa48("16464") ? "" : (stryCov_9fa48("16464"), 'bg-gray-500 text-white');
            }
        }
      }
    };
    const formatTimeAgo = (timestamp: string) => {
      if (stryMutAct_9fa48("16465")) {
        {}
      } else {
        stryCov_9fa48("16465");
        try {
          if (stryMutAct_9fa48("16466")) {
            {}
          } else {
            stryCov_9fa48("16466");
            const now = new Date();
            const date = new Date(timestamp);
            const diffMs = stryMutAct_9fa48("16467") ? now.getTime() + date.getTime() : (stryCov_9fa48("16467"), now.getTime() - date.getTime());
            const diffSecs = Math.floor(stryMutAct_9fa48("16468") ? diffMs * 1000 : (stryCov_9fa48("16468"), diffMs / 1000));
            const diffMins = Math.floor(stryMutAct_9fa48("16469") ? diffSecs * 60 : (stryCov_9fa48("16469"), diffSecs / 60));
            const diffHours = Math.floor(stryMutAct_9fa48("16470") ? diffMins * 60 : (stryCov_9fa48("16470"), diffMins / 60));
            const diffDays = Math.floor(stryMutAct_9fa48("16471") ? diffHours * 24 : (stryCov_9fa48("16471"), diffHours / 24));
            if (stryMutAct_9fa48("16475") ? diffSecs >= 60 : stryMutAct_9fa48("16474") ? diffSecs <= 60 : stryMutAct_9fa48("16473") ? false : stryMutAct_9fa48("16472") ? true : (stryCov_9fa48("16472", "16473", "16474", "16475"), diffSecs < 60)) return stryMutAct_9fa48("16476") ? "" : (stryCov_9fa48("16476"), 'Hace un momento');
            if (stryMutAct_9fa48("16480") ? diffMins >= 60 : stryMutAct_9fa48("16479") ? diffMins <= 60 : stryMutAct_9fa48("16478") ? false : stryMutAct_9fa48("16477") ? true : (stryCov_9fa48("16477", "16478", "16479", "16480"), diffMins < 60)) return stryMutAct_9fa48("16481") ? `` : (stryCov_9fa48("16481"), `Hace ${diffMins} ${(stryMutAct_9fa48("16484") ? diffMins !== 1 : stryMutAct_9fa48("16483") ? false : stryMutAct_9fa48("16482") ? true : (stryCov_9fa48("16482", "16483", "16484"), diffMins === 1)) ? stryMutAct_9fa48("16485") ? "" : (stryCov_9fa48("16485"), 'minuto') : stryMutAct_9fa48("16486") ? "" : (stryCov_9fa48("16486"), 'minutos')}`);
            if (stryMutAct_9fa48("16490") ? diffHours >= 24 : stryMutAct_9fa48("16489") ? diffHours <= 24 : stryMutAct_9fa48("16488") ? false : stryMutAct_9fa48("16487") ? true : (stryCov_9fa48("16487", "16488", "16489", "16490"), diffHours < 24)) return stryMutAct_9fa48("16491") ? `` : (stryCov_9fa48("16491"), `Hace ${diffHours} ${(stryMutAct_9fa48("16494") ? diffHours !== 1 : stryMutAct_9fa48("16493") ? false : stryMutAct_9fa48("16492") ? true : (stryCov_9fa48("16492", "16493", "16494"), diffHours === 1)) ? stryMutAct_9fa48("16495") ? "" : (stryCov_9fa48("16495"), 'hora') : stryMutAct_9fa48("16496") ? "" : (stryCov_9fa48("16496"), 'horas')}`);
            if (stryMutAct_9fa48("16500") ? diffDays >= 7 : stryMutAct_9fa48("16499") ? diffDays <= 7 : stryMutAct_9fa48("16498") ? false : stryMutAct_9fa48("16497") ? true : (stryCov_9fa48("16497", "16498", "16499", "16500"), diffDays < 7)) return stryMutAct_9fa48("16501") ? `` : (stryCov_9fa48("16501"), `Hace ${diffDays} ${(stryMutAct_9fa48("16504") ? diffDays !== 1 : stryMutAct_9fa48("16503") ? false : stryMutAct_9fa48("16502") ? true : (stryCov_9fa48("16502", "16503", "16504"), diffDays === 1)) ? stryMutAct_9fa48("16505") ? "" : (stryCov_9fa48("16505"), 'día') : stryMutAct_9fa48("16506") ? "" : (stryCov_9fa48("16506"), 'días')}`);
            return date.toLocaleDateString(stryMutAct_9fa48("16507") ? "" : (stryCov_9fa48("16507"), 'es-ES'), stryMutAct_9fa48("16508") ? {} : (stryCov_9fa48("16508"), {
              day: stryMutAct_9fa48("16509") ? "" : (stryCov_9fa48("16509"), 'numeric'),
              month: stryMutAct_9fa48("16510") ? "" : (stryCov_9fa48("16510"), 'short')
            }));
          }
        } catch {
          if (stryMutAct_9fa48("16511")) {
            {}
          } else {
            stryCov_9fa48("16511");
            return stryMutAct_9fa48("16512") ? "" : (stryCov_9fa48("16512"), 'Hace un momento');
          }
        }
      }
    };

    // Filtrar errores
    const filteredErrors = stryMutAct_9fa48("16513") ? errors : (stryCov_9fa48("16513"), errors.filter(error => {
      if (stryMutAct_9fa48("16514")) {
        {}
      } else {
        stryCov_9fa48("16514");
        if (stryMutAct_9fa48("16517") ? filter === 'unresolved' || error.resolved : stryMutAct_9fa48("16516") ? false : stryMutAct_9fa48("16515") ? true : (stryCov_9fa48("16515", "16516", "16517"), (stryMutAct_9fa48("16519") ? filter !== 'unresolved' : stryMutAct_9fa48("16518") ? true : (stryCov_9fa48("16518", "16519"), filter === (stryMutAct_9fa48("16520") ? "" : (stryCov_9fa48("16520"), 'unresolved')))) && error.resolved)) return stryMutAct_9fa48("16521") ? true : (stryCov_9fa48("16521"), false);
        if (stryMutAct_9fa48("16524") ? filter === 'resolved' || !error.resolved : stryMutAct_9fa48("16523") ? false : stryMutAct_9fa48("16522") ? true : (stryCov_9fa48("16522", "16523", "16524"), (stryMutAct_9fa48("16526") ? filter !== 'resolved' : stryMutAct_9fa48("16525") ? true : (stryCov_9fa48("16525", "16526"), filter === (stryMutAct_9fa48("16527") ? "" : (stryCov_9fa48("16527"), 'resolved')))) && (stryMutAct_9fa48("16528") ? error.resolved : (stryCov_9fa48("16528"), !error.resolved)))) return stryMutAct_9fa48("16529") ? true : (stryCov_9fa48("16529"), false);
        if (stryMutAct_9fa48("16532") ? categoryFilter !== 'all' || error.category !== categoryFilter : stryMutAct_9fa48("16531") ? false : stryMutAct_9fa48("16530") ? true : (stryCov_9fa48("16530", "16531", "16532"), (stryMutAct_9fa48("16534") ? categoryFilter === 'all' : stryMutAct_9fa48("16533") ? true : (stryCov_9fa48("16533", "16534"), categoryFilter !== (stryMutAct_9fa48("16535") ? "" : (stryCov_9fa48("16535"), 'all')))) && (stryMutAct_9fa48("16537") ? error.category === categoryFilter : stryMutAct_9fa48("16536") ? true : (stryCov_9fa48("16536", "16537"), error.category !== categoryFilter)))) return stryMutAct_9fa48("16538") ? true : (stryCov_9fa48("16538"), false);
        if (stryMutAct_9fa48("16541") ? severityFilter !== 'all' || error.severity !== severityFilter : stryMutAct_9fa48("16540") ? false : stryMutAct_9fa48("16539") ? true : (stryCov_9fa48("16539", "16540", "16541"), (stryMutAct_9fa48("16543") ? severityFilter === 'all' : stryMutAct_9fa48("16542") ? true : (stryCov_9fa48("16542", "16543"), severityFilter !== (stryMutAct_9fa48("16544") ? "" : (stryCov_9fa48("16544"), 'all')))) && (stryMutAct_9fa48("16546") ? error.severity === severityFilter : stryMutAct_9fa48("16545") ? true : (stryCov_9fa48("16545", "16546"), error.severity !== severityFilter)))) return stryMutAct_9fa48("16547") ? true : (stryCov_9fa48("16547"), false);
        return stryMutAct_9fa48("16548") ? false : (stryCov_9fa48("16548"), true);
      }
    }));
    if (stryMutAct_9fa48("16551") ? errors.length !== 0 : stryMutAct_9fa48("16550") ? false : stryMutAct_9fa48("16549") ? true : (stryCov_9fa48("16549", "16550", "16551"), errors.length === 0)) {
      if (stryMutAct_9fa48("16552")) {
        {}
      } else {
        stryCov_9fa48("16552");
        return <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle>Historial de Errores</CardTitle>
            </div>
            <HelpIcon content={<>
                  <strong>Historial de errores</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Aquí verás un registro de los errores que has experimentado, con información
                    sobre cómo resolverlos. Como un registro médico, pero para problemas técnicos.
                  </span>
                </>} />
          </div>
          <CardDescription>No has experimentado errores recientemente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              ¡Excelente! No hay errores registrados en tu historial.
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
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Historial de Errores</CardTitle>
            {stryMutAct_9fa48("16555") ? unresolvedErrors.length > 0 || <Badge variant="destructive" className="ml-2">
                {unresolvedErrors.length} sin resolver
              </Badge> : stryMutAct_9fa48("16554") ? false : stryMutAct_9fa48("16553") ? true : (stryCov_9fa48("16553", "16554", "16555"), (stryMutAct_9fa48("16558") ? unresolvedErrors.length <= 0 : stryMutAct_9fa48("16557") ? unresolvedErrors.length >= 0 : stryMutAct_9fa48("16556") ? true : (stryCov_9fa48("16556", "16557", "16558"), unresolvedErrors.length > 0)) && <Badge variant="destructive" className="ml-2">
                {unresolvedErrors.length} sin resolver
              </Badge>)}
          </div>
          <div className="flex items-center gap-2">
            <HelpIcon content={<>
                  <strong>Historial de errores</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Registro de errores que has experimentado, con soluciones sugeridas. Puedes
                    marcar errores como resueltos cuando los hayas solucionado.
                  </span>
                </>} />
            {stryMutAct_9fa48("16561") ? errors.length > 0 || <Button variant="ghost" size="sm" onClick={clearHistory}>
                Limpiar
              </Button> : stryMutAct_9fa48("16560") ? false : stryMutAct_9fa48("16559") ? true : (stryCov_9fa48("16559", "16560", "16561"), (stryMutAct_9fa48("16564") ? errors.length <= 0 : stryMutAct_9fa48("16563") ? errors.length >= 0 : stryMutAct_9fa48("16562") ? true : (stryCov_9fa48("16562", "16563", "16564"), errors.length > 0)) && <Button variant="ghost" size="sm" onClick={clearHistory}>
                Limpiar
              </Button>)}
          </div>
        </div>
        <CardDescription>
          {stats.total} error{(stryMutAct_9fa48("16567") ? stats.total === 1 : stryMutAct_9fa48("16566") ? false : stryMutAct_9fa48("16565") ? true : (stryCov_9fa48("16565", "16566", "16567"), stats.total !== 1)) ? stryMutAct_9fa48("16568") ? "" : (stryCov_9fa48("16568"), 'es') : stryMutAct_9fa48("16569") ? "Stryker was here!" : (stryCov_9fa48("16569"), '')} registrado
          {(stryMutAct_9fa48("16572") ? stats.total === 1 : stryMutAct_9fa48("16571") ? false : stryMutAct_9fa48("16570") ? true : (stryCov_9fa48("16570", "16571", "16572"), stats.total !== 1)) ? stryMutAct_9fa48("16573") ? "" : (stryCov_9fa48("16573"), 's') : stryMutAct_9fa48("16574") ? "Stryker was here!" : (stryCov_9fa48("16574"), '')} • {stats.unresolved} sin resolver
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={setFilter as (value: string) => void}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="unresolved">Sin resolver</SelectItem>
                <SelectItem value="resolved">Resueltos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="validation">Validación</SelectItem>
                <SelectItem value="network">Red</SelectItem>
                <SelectItem value="permission">Permisos</SelectItem>
                <SelectItem value="data">Datos</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de errores */}
          <div className="h-[400px] overflow-y-auto pr-2">
            <div className="space-y-3">
              {(stryMutAct_9fa48("16577") ? filteredErrors.length !== 0 : stryMutAct_9fa48("16576") ? false : stryMutAct_9fa48("16575") ? true : (stryCov_9fa48("16575", "16576", "16577"), filteredErrors.length === 0)) ? <div className="flex items-center justify-center py-8 text-center text-muted-foreground">
                  No hay errores que coincidan con los filtros seleccionados.
                </div> : filteredErrors.map(error => {
                if (stryMutAct_9fa48("16578")) {
                  {}
                } else {
                  stryCov_9fa48("16578");
                  const CategoryIcon = getCategoryIcon(error.category);
                  return <div key={error.id} className={cn(stryMutAct_9fa48("16579") ? "" : (stryCov_9fa48("16579"), 'flex items-start gap-3 p-3 rounded-lg border transition-colors'), stryMutAct_9fa48("16580") ? "" : (stryCov_9fa48("16580"), 'hover:bg-muted/50'), stryMutAct_9fa48("16583") ? error.resolved || 'opacity-60' : stryMutAct_9fa48("16582") ? false : stryMutAct_9fa48("16581") ? true : (stryCov_9fa48("16581", "16582", "16583"), error.resolved && (stryMutAct_9fa48("16584") ? "" : (stryCov_9fa48("16584"), 'opacity-60'))), stryMutAct_9fa48("16587") ? error.severity === 'critical' || 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20' : stryMutAct_9fa48("16586") ? false : stryMutAct_9fa48("16585") ? true : (stryCov_9fa48("16585", "16586", "16587"), (stryMutAct_9fa48("16589") ? error.severity !== 'critical' : stryMutAct_9fa48("16588") ? true : (stryCov_9fa48("16588", "16589"), error.severity === (stryMutAct_9fa48("16590") ? "" : (stryCov_9fa48("16590"), 'critical')))) && (stryMutAct_9fa48("16591") ? "" : (stryCov_9fa48("16591"), 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20'))), stryMutAct_9fa48("16594") ? error.severity === 'high' || 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20' : stryMutAct_9fa48("16593") ? false : stryMutAct_9fa48("16592") ? true : (stryCov_9fa48("16592", "16593", "16594"), (stryMutAct_9fa48("16596") ? error.severity !== 'high' : stryMutAct_9fa48("16595") ? true : (stryCov_9fa48("16595", "16596"), error.severity === (stryMutAct_9fa48("16597") ? "" : (stryCov_9fa48("16597"), 'high')))) && (stryMutAct_9fa48("16598") ? "" : (stryCov_9fa48("16598"), 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20'))))}>
                      <div className={cn(stryMutAct_9fa48("16599") ? "" : (stryCov_9fa48("16599"), 'p-2 rounded-md flex-shrink-0'), getCategoryColor(error.category))}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium leading-tight">{error.title}</p>
                            <Badge variant="outline" className={cn(stryMutAct_9fa48("16600") ? "" : (stryCov_9fa48("16600"), 'text-xs'), getCategoryColor(error.category))}>
                              {error.category}
                            </Badge>
                            <Badge className={cn(stryMutAct_9fa48("16601") ? "" : (stryCov_9fa48("16601"), 'text-xs'), getSeverityColor(error.severity))}>
                              {error.severity}
                            </Badge>
                            {stryMutAct_9fa48("16604") ? error.resolved || <Badge variant="outline" className="text-xs text-green-600">
                                Resuelto
                              </Badge> : stryMutAct_9fa48("16603") ? false : stryMutAct_9fa48("16602") ? true : (stryCov_9fa48("16602", "16603", "16604"), error.resolved && <Badge variant="outline" className="text-xs text-green-600">
                                Resuelto
                              </Badge>)}
                          </div>
                          {stryMutAct_9fa48("16607") ? !error.resolved || <Button variant="ghost" size="sm" onClick={() => markAsResolved(error.id)} className="h-7 w-7 p-0">
                              <CheckCircle2 className="h-3 w-3" />
                            </Button> : stryMutAct_9fa48("16606") ? false : stryMutAct_9fa48("16605") ? true : (stryCov_9fa48("16605", "16606", "16607"), (stryMutAct_9fa48("16608") ? error.resolved : (stryCov_9fa48("16608"), !error.resolved)) && <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("16609") ? () => undefined : (stryCov_9fa48("16609"), () => markAsResolved(error.id))} className="h-7 w-7 p-0">
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{error.description}</p>
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded p-2 mb-2">
                          <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">
                            Solución:
                          </p>
                          <p className="text-xs text-blue-800 dark:text-blue-400">
                            {error.solution}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(error.timestamp)}
                          </div>
                          {stryMutAct_9fa48("16612") ? error.path || <div className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              {error.path}
                            </div> : stryMutAct_9fa48("16611") ? false : stryMutAct_9fa48("16610") ? true : (stryCov_9fa48("16610", "16611", "16612"), error.path && <div className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              {error.path}
                            </div>)}
                        </div>
                      </div>
                    </div>;
                }
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
  }
}