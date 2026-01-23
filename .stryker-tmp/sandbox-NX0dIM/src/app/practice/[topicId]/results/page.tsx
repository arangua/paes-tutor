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
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertCircle, Loader2, RotateCcw, Home } from 'lucide-react';
import { toast } from 'sonner';
import { captureError } from '@/lib/monitoring';
interface PracticeSession {
  id: string;
  topicId: string;
  totalPreguntas: number;
  correctas: number;
  incorrectas: number;
  omitidas: number;
  porcentaje: number;
  duracionSegundos: number | null;
  startedAt: string;
  finishedAt: string | null;
  topic: {
    nombre: string;
    ejeTematico: string;
  };
}
export default function PracticeResultsPage() {
  if (stryMutAct_9fa48("14915")) {
    {}
  } else {
    stryCov_9fa48("14915");
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const topicId = params.topicId as string;
    const sessionId = searchParams.get(stryMutAct_9fa48("14916") ? "" : (stryCov_9fa48("14916"), 'sessionId'));
    const [session, setSession] = useState<PracticeSession | null>(null);
    const [loading, setLoading] = useState(stryMutAct_9fa48("14917") ? false : (stryCov_9fa48("14917"), true));
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("14918")) {
        {}
      } else {
        stryCov_9fa48("14918");
        // La sesión se obtiene del estado de navegación o localStorage
        // En el futuro, podríamos crear un endpoint GET /api/practice/sessions/[id]
        // Por ahora, usamos datos del estado de navegación
        const sessionData = sessionStorage.getItem(stryMutAct_9fa48("14919") ? `` : (stryCov_9fa48("14919"), `practice-session-${sessionId}`));
        if (stryMutAct_9fa48("14921") ? false : stryMutAct_9fa48("14920") ? true : (stryCov_9fa48("14920", "14921"), sessionData)) {
          if (stryMutAct_9fa48("14922")) {
            {}
          } else {
            stryCov_9fa48("14922");
            try {
              if (stryMutAct_9fa48("14923")) {
                {}
              } else {
                stryCov_9fa48("14923");
                setSession(JSON.parse(sessionData));
              }
            } catch (err) {
              if (stryMutAct_9fa48("14924")) {
                {}
              } else {
                stryCov_9fa48("14924");
                captureError(err instanceof Error ? err : new Error(String(err)), stryMutAct_9fa48("14925") ? {} : (stryCov_9fa48("14925"), {
                  type: stryMutAct_9fa48("14926") ? "" : (stryCov_9fa48("14926"), 'practice_session_parse_error'),
                  sessionId,
                  path: (stryMutAct_9fa48("14929") ? typeof window === 'undefined' : stryMutAct_9fa48("14928") ? false : stryMutAct_9fa48("14927") ? true : (stryCov_9fa48("14927", "14928", "14929"), typeof window !== (stryMutAct_9fa48("14930") ? "" : (stryCov_9fa48("14930"), 'undefined')))) ? window.location.pathname : undefined
                }));
              }
            }
          }
        }
        setLoading(stryMutAct_9fa48("14931") ? true : (stryCov_9fa48("14931"), false));
      }
    }, stryMutAct_9fa48("14932") ? [] : (stryCov_9fa48("14932"), [sessionId]));
    const formatTime = (seconds: number) => {
      if (stryMutAct_9fa48("14933")) {
        {}
      } else {
        stryCov_9fa48("14933");
        const mins = Math.floor(stryMutAct_9fa48("14934") ? seconds * 60 : (stryCov_9fa48("14934"), seconds / 60));
        const secs = stryMutAct_9fa48("14935") ? seconds * 60 : (stryCov_9fa48("14935"), seconds % 60);
        return stryMutAct_9fa48("14936") ? `` : (stryCov_9fa48("14936"), `${mins}:${secs.toString().padStart(2, stryMutAct_9fa48("14937") ? "" : (stryCov_9fa48("14937"), '0'))}`);
      }
    };
    const getScoreColor = (porcentaje: number) => {
      if (stryMutAct_9fa48("14938")) {
        {}
      } else {
        stryCov_9fa48("14938");
        if (stryMutAct_9fa48("14942") ? porcentaje < 80 : stryMutAct_9fa48("14941") ? porcentaje > 80 : stryMutAct_9fa48("14940") ? false : stryMutAct_9fa48("14939") ? true : (stryCov_9fa48("14939", "14940", "14941", "14942"), porcentaje >= 80)) return stryMutAct_9fa48("14943") ? "" : (stryCov_9fa48("14943"), 'text-green-600');
        if (stryMutAct_9fa48("14947") ? porcentaje < 60 : stryMutAct_9fa48("14946") ? porcentaje > 60 : stryMutAct_9fa48("14945") ? false : stryMutAct_9fa48("14944") ? true : (stryCov_9fa48("14944", "14945", "14946", "14947"), porcentaje >= 60)) return stryMutAct_9fa48("14948") ? "" : (stryCov_9fa48("14948"), 'text-yellow-600');
        return stryMutAct_9fa48("14949") ? "" : (stryCov_9fa48("14949"), 'text-red-600');
      }
    };
    const getScoreBadge = (porcentaje: number) => {
      if (stryMutAct_9fa48("14950")) {
        {}
      } else {
        stryCov_9fa48("14950");
        if (stryMutAct_9fa48("14954") ? porcentaje < 80 : stryMutAct_9fa48("14953") ? porcentaje > 80 : stryMutAct_9fa48("14952") ? false : stryMutAct_9fa48("14951") ? true : (stryCov_9fa48("14951", "14952", "14953", "14954"), porcentaje >= 80)) return stryMutAct_9fa48("14955") ? "" : (stryCov_9fa48("14955"), 'default');
        if (stryMutAct_9fa48("14959") ? porcentaje < 60 : stryMutAct_9fa48("14958") ? porcentaje > 60 : stryMutAct_9fa48("14957") ? false : stryMutAct_9fa48("14956") ? true : (stryCov_9fa48("14956", "14957", "14958", "14959"), porcentaje >= 60)) return stryMutAct_9fa48("14960") ? "" : (stryCov_9fa48("14960"), 'secondary');
        return stryMutAct_9fa48("14961") ? "" : (stryCov_9fa48("14961"), 'destructive');
      }
    };
    if (stryMutAct_9fa48("14963") ? false : stryMutAct_9fa48("14962") ? true : (stryCov_9fa48("14962", "14963"), loading)) {
      if (stryMutAct_9fa48("14964")) {
        {}
      } else {
        stryCov_9fa48("14964");
        return <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>;
      }
    }
    if (stryMutAct_9fa48("14966") ? false : stryMutAct_9fa48("14965") ? true : (stryCov_9fa48("14965", "14966"), error)) {
      if (stryMutAct_9fa48("14967")) {
        {}
      } else {
        stryCov_9fa48("14967");
        return <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={stryMutAct_9fa48("14968") ? () => undefined : (stryCov_9fa48("14968"), () => router.push(stryMutAct_9fa48("14969") ? "" : (stryCov_9fa48("14969"), '/practice')))}>Volver a Práctica</Button>
          </CardContent>
        </Card>
      </div>;
      }
    }
    if (stryMutAct_9fa48("14972") ? false : stryMutAct_9fa48("14971") ? true : stryMutAct_9fa48("14970") ? session : (stryCov_9fa48("14970", "14971", "14972"), !session)) {
      if (stryMutAct_9fa48("14973")) {
        {}
      } else {
        stryCov_9fa48("14973");
        return <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Sesión no encontrada
            </CardTitle>
            <CardDescription>
              No se pudo cargar la información de la sesión de práctica.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={stryMutAct_9fa48("14974") ? () => undefined : (stryCov_9fa48("14974"), () => router.push(stryMutAct_9fa48("14975") ? "" : (stryCov_9fa48("14975"), '/practice')))}>Volver a Práctica</Button>
          </CardContent>
        </Card>
      </div>;
      }
    }
    const displaySession = session;
    return <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resultados de Práctica</h1>
          <p className="text-muted-foreground mt-2">{displaySession.topic.nombre}</p>
        </div>
        <Badge variant={getScoreBadge(displaySession.porcentaje)} className="text-lg px-4 py-2">
          {displaySession.porcentaje.toFixed(1)}%
        </Badge>
      </div>

      {/* Score Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Puntuación</span>
            <span className={stryMutAct_9fa48("14976") ? `` : (stryCov_9fa48("14976"), `text-3xl font-bold ${getScoreColor(displaySession.porcentaje)}`)}>
              {displaySession.porcentaje.toFixed(1)}%
            </span>
          </div>
          <Progress value={displaySession.porcentaje} className="h-3" />

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {displaySession.correctas}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Correctas</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">
                  {displaySession.incorrectas}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Incorrectas</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">
                  {displaySession.omitidas}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Omitidas</p>
            </div>
          </div>

          {stryMutAct_9fa48("14979") ? displaySession.duracionSegundos || <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tiempo total</span>
                <span className="font-semibold">{formatTime(displaySession.duracionSegundos)}</span>
              </div>
            </div> : stryMutAct_9fa48("14978") ? false : stryMutAct_9fa48("14977") ? true : (stryCov_9fa48("14977", "14978", "14979"), displaySession.duracionSegundos && <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tiempo total</span>
                <span className="font-semibold">{formatTime(displaySession.duracionSegundos)}</span>
              </div>
            </div>)}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {(stryMutAct_9fa48("14983") ? displaySession.porcentaje < 80 : stryMutAct_9fa48("14982") ? displaySession.porcentaje > 80 : stryMutAct_9fa48("14981") ? false : stryMutAct_9fa48("14980") ? true : (stryCov_9fa48("14980", "14981", "14982", "14983"), displaySession.porcentaje >= 80)) ? <div className="space-y-2">
              <p className="text-green-600 font-semibold">¡Excelente trabajo!</p>
              <p className="text-sm text-muted-foreground">
                Has demostrado un buen dominio de este tema. Considera practicar otros temas o
                aumentar la dificultad.
              </p>
            </div> : (stryMutAct_9fa48("14987") ? displaySession.porcentaje < 60 : stryMutAct_9fa48("14986") ? displaySession.porcentaje > 60 : stryMutAct_9fa48("14985") ? false : stryMutAct_9fa48("14984") ? true : (stryCov_9fa48("14984", "14985", "14986", "14987"), displaySession.porcentaje >= 60)) ? <div className="space-y-2">
              <p className="text-yellow-600 font-semibold">Buen progreso</p>
              <p className="text-sm text-muted-foreground">
                Estás en el camino correcto. Revisa las preguntas incorrectas y considera practicar
                más este tema.
              </p>
            </div> : <div className="space-y-2">
              <p className="text-red-600 font-semibold">Necesitas más práctica</p>
              <p className="text-sm text-muted-foreground">
                Este tema requiere más atención. Revisa los materiales de estudio y vuelve a
                practicar.
              </p>
            </div>}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={stryMutAct_9fa48("14988") ? () => undefined : (stryCov_9fa48("14988"), () => router.push(stryMutAct_9fa48("14989") ? "" : (stryCov_9fa48("14989"), '/practice')))}>
          <Home className="h-4 w-4 mr-2" />
          Volver a Práctica
        </Button>
        <Button onClick={stryMutAct_9fa48("14990") ? () => undefined : (stryCov_9fa48("14990"), () => router.push(stryMutAct_9fa48("14991") ? `` : (stryCov_9fa48("14991"), `/practice/${topicId}`)))}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Practicar Nuevamente
        </Button>
      </div>
    </div>;
  }
}