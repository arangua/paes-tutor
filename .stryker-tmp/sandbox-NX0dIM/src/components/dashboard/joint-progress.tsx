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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, TrendingDown, Minus, Users, Trophy, Target, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
import { captureError } from '@/lib/monitoring';
interface JointProgressData {
  current: {
    student: {
      id: string;
      nombre: string;
      email: string | null;
    };
    progress: {
      totalAttempts: number;
      averagePercentage: number;
      bestPercentage: number;
      averagePaesScore: number | null;
      bestPaesScore: number | null;
      recentAttempts: Array<{
        id: string;
        porcentaje: number;
        puntajePaes: number | null;
        correctas: number;
        totalPreguntas: number;
        createdAt: string;
        exam: {
          id: string;
          titulo: string;
          subject: {
            id: string;
            nombre: string;
            codigo: string;
          };
        };
      }>;
      topTopics: Array<{
        topicId: string;
        porcentaje: number;
        totalPreguntas: number;
        correctas: number;
        topic: {
          nombre: string;
          subject: {
            nombre: string;
            codigo: string;
          };
        };
      }>;
      trend: 'improving' | 'declining' | 'stable';
    };
  };
  other: {
    student: {
      id: string;
      nombre: string;
      email: string | null;
    };
    progress: {
      totalAttempts: number;
      averagePercentage: number;
      bestPercentage: number;
      averagePaesScore: number | null;
      bestPaesScore: number | null;
      recentAttempts: Array<{
        id: string;
        porcentaje: number;
        puntajePaes: number | null;
        correctas: number;
        totalPreguntas: number;
        createdAt: string;
        exam: {
          id: string;
          titulo: string;
          subject: {
            id: string;
            nombre: string;
            codigo: string;
          };
        };
      }>;
      topTopics: Array<{
        topicId: string;
        porcentaje: number;
        totalPreguntas: number;
        correctas: number;
        topic: {
          nombre: string;
          subject: {
            nombre: string;
            codigo: string;
          };
        };
      }>;
      trend: 'improving' | 'declining' | 'stable';
    };
  };
}
export function JointProgress() {
  if (stryMutAct_9fa48("16613")) {
    {}
  } else {
    stryCov_9fa48("16613");
    const [data, setData] = useState<JointProgressData | null>(null);
    const [loading, setLoading] = useState(stryMutAct_9fa48("16614") ? false : (stryCov_9fa48("16614"), true));
    useEffect(() => {
      if (stryMutAct_9fa48("16615")) {
        {}
      } else {
        stryCov_9fa48("16615");
        loadJointProgress();
      }
    }, stryMutAct_9fa48("16616") ? ["Stryker was here"] : (stryCov_9fa48("16616"), []));
    async function loadJointProgress() {
      if (stryMutAct_9fa48("16617")) {
        {}
      } else {
        stryCov_9fa48("16617");
        try {
          if (stryMutAct_9fa48("16618")) {
            {}
          } else {
            stryCov_9fa48("16618");
            setLoading(stryMutAct_9fa48("16619") ? false : (stryCov_9fa48("16619"), true));
            const res = await fetch(stryMutAct_9fa48("16620") ? "" : (stryCov_9fa48("16620"), '/api/analytics/joint-progress'));
            if (stryMutAct_9fa48("16623") ? false : stryMutAct_9fa48("16622") ? true : stryMutAct_9fa48("16621") ? res.ok : (stryCov_9fa48("16621", "16622", "16623"), !res.ok)) {
              if (stryMutAct_9fa48("16624")) {
                {}
              } else {
                stryCov_9fa48("16624");
                // Manejar error 429 (Too Many Requests) - no mostrar error, solo ocultar componente
                if (stryMutAct_9fa48("16627") ? res.status !== 429 : stryMutAct_9fa48("16626") ? false : stryMutAct_9fa48("16625") ? true : (stryCov_9fa48("16625", "16626", "16627"), res.status === 429)) {
                  if (stryMutAct_9fa48("16628")) {
                    {}
                  } else {
                    stryCov_9fa48("16628");
                    setData(null);
                    return;
                  }
                }
                const {
                  safeJsonParse
                } = await import(stryMutAct_9fa48("16629") ? "" : (stryCov_9fa48("16629"), '@/lib/api-helpers'));
                const errorData = await safeJsonParse<{
                  error?: string;
                  message?: string;
                }>(res, stryMutAct_9fa48("16630") ? {} : (stryCov_9fa48("16630"), {
                  path: (stryMutAct_9fa48("16633") ? typeof window === 'undefined' : stryMutAct_9fa48("16632") ? false : stryMutAct_9fa48("16631") ? true : (stryCov_9fa48("16631", "16632", "16633"), typeof window !== (stryMutAct_9fa48("16634") ? "" : (stryCov_9fa48("16634"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("16635") ? "" : (stryCov_9fa48("16635"), '/dashboard'),
                  operation: stryMutAct_9fa48("16636") ? "" : (stryCov_9fa48("16636"), 'cargar progreso conjunto')
                }));

                // Si la respuesta tiene un mensaje, es un caso esperado (ej: no hay suficientes estudiantes)
                // No es un error, solo ocultamos el componente
                if (stryMutAct_9fa48("16638") ? false : stryMutAct_9fa48("16637") ? true : (stryCov_9fa48("16637", "16638"), errorData.message)) {
                  if (stryMutAct_9fa48("16639")) {
                    {}
                  } else {
                    stryCov_9fa48("16639");
                    setData(null);
                    return;
                  }
                }

                // Si es 401 (no autorizado), no mostrar error, solo ocultar componente
                if (stryMutAct_9fa48("16642") ? res.status !== 401 : stryMutAct_9fa48("16641") ? false : stryMutAct_9fa48("16640") ? true : (stryCov_9fa48("16640", "16641", "16642"), res.status === 401)) {
                  if (stryMutAct_9fa48("16643")) {
                    {}
                  } else {
                    stryCov_9fa48("16643");
                    setData(null);
                    return;
                  }
                }

                // Solo para errores reales del servidor (500, 503, etc.)
                // Registrar y mostrar mensaje apropiado
                if (stryMutAct_9fa48("16647") ? res.status < 500 : stryMutAct_9fa48("16646") ? res.status > 500 : stryMutAct_9fa48("16645") ? false : stryMutAct_9fa48("16644") ? true : (stryCov_9fa48("16644", "16645", "16646", "16647"), res.status >= 500)) {
                  if (stryMutAct_9fa48("16648")) {
                    {}
                  } else {
                    stryCov_9fa48("16648");
                    const errorInfo = extractErrorInfo(stryMutAct_9fa48("16651") ? errorData.error && 'Error al cargar progreso conjunto' : stryMutAct_9fa48("16650") ? false : stryMutAct_9fa48("16649") ? true : (stryCov_9fa48("16649", "16650", "16651"), errorData.error || (stryMutAct_9fa48("16652") ? "" : (stryCov_9fa48("16652"), 'Error al cargar progreso conjunto'))));
                    const errorMessage = getErrorMessage(ERROR_CODES.SYSTEM_LOAD_FAILED, stryMutAct_9fa48("16653") ? {} : (stryCov_9fa48("16653"), {
                      message: errorInfo.message,
                      context: stryMutAct_9fa48("16654") ? {} : (stryCov_9fa48("16654"), {
                        endpoint: stryMutAct_9fa48("16655") ? "" : (stryCov_9fa48("16655"), 'joint-progress'),
                        status: res.status
                      })
                    }));
                    captureError(new Error(stryMutAct_9fa48("16656") ? `` : (stryCov_9fa48("16656"), `[${errorInfo.code}] ${errorMessage.description}`)), stryMutAct_9fa48("16657") ? {} : (stryCov_9fa48("16657"), {
                      type: stryMutAct_9fa48("16658") ? "" : (stryCov_9fa48("16658"), 'joint_progress_load_error'),
                      status: res.status,
                      endpoint: stryMutAct_9fa48("16659") ? "" : (stryCov_9fa48("16659"), '/api/analytics/joint-progress')
                    }));
                    toast.error(errorMessage.title, stryMutAct_9fa48("16660") ? {} : (stryCov_9fa48("16660"), {
                      description: errorMessage.description
                    }));
                  }
                }
                setData(null);
                return;
              }
            }
            const response = await res.json();
            if (stryMutAct_9fa48("16662") ? false : stryMutAct_9fa48("16661") ? true : (stryCov_9fa48("16661", "16662"), response.message)) {
              if (stryMutAct_9fa48("16663")) {
                {}
              } else {
                stryCov_9fa48("16663");
                // No hay suficientes estudiantes, no mostrar el componente
                // Esto es un caso esperado, no un error
                setData(null);
                return;
              }
            }
            setData(response);
          }
        } catch (error) {
          if (stryMutAct_9fa48("16664")) {
            {}
          } else {
            stryCov_9fa48("16664");
            // Manejar errores de red u otros errores inesperados
            // Solo registrar si es un error real de red, no errores de parsing JSON
            const isNetworkError = stryMutAct_9fa48("16667") ? error instanceof TypeError || error.message.includes('fetch') : stryMutAct_9fa48("16666") ? false : stryMutAct_9fa48("16665") ? true : (stryCov_9fa48("16665", "16666", "16667"), error instanceof TypeError && error.message.includes(stryMutAct_9fa48("16668") ? "" : (stryCov_9fa48("16668"), 'fetch')));
            const isRealError = stryMutAct_9fa48("16671") ? error instanceof Error || !error.message.includes('JSON') : stryMutAct_9fa48("16670") ? false : stryMutAct_9fa48("16669") ? true : (stryCov_9fa48("16669", "16670", "16671"), error instanceof Error && (stryMutAct_9fa48("16672") ? error.message.includes('JSON') : (stryCov_9fa48("16672"), !error.message.includes(stryMutAct_9fa48("16673") ? "" : (stryCov_9fa48("16673"), 'JSON')))));
            if (stryMutAct_9fa48("16676") ? isNetworkError && isRealError : stryMutAct_9fa48("16675") ? false : stryMutAct_9fa48("16674") ? true : (stryCov_9fa48("16674", "16675", "16676"), isNetworkError || isRealError)) {
              if (stryMutAct_9fa48("16677")) {
                {}
              } else {
                stryCov_9fa48("16677");
                const errorInfo = extractErrorInfo(error);
                const errorMessage = getErrorMessage(ERROR_CODES.NETWORK_SERVER_ERROR, stryMutAct_9fa48("16678") ? {} : (stryCov_9fa48("16678"), {
                  message: errorInfo.message,
                  context: stryMutAct_9fa48("16679") ? {} : (stryCov_9fa48("16679"), {
                    endpoint: stryMutAct_9fa48("16680") ? "" : (stryCov_9fa48("16680"), 'joint-progress')
                  })
                }));

                // Solo registrar errores de red reales, no errores de parsing
                captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("16681") ? {} : (stryCov_9fa48("16681"), {
                  type: stryMutAct_9fa48("16682") ? "" : (stryCov_9fa48("16682"), 'joint_progress_load_error'),
                  endpoint: stryMutAct_9fa48("16683") ? "" : (stryCov_9fa48("16683"), '/api/analytics/joint-progress'),
                  errorType: stryMutAct_9fa48("16684") ? "" : (stryCov_9fa48("16684"), 'network_error')
                }));
                toast.error(errorMessage.title, stryMutAct_9fa48("16685") ? {} : (stryCov_9fa48("16685"), {
                  description: errorMessage.description
                }));
              }
            }

            // En cualquier caso, ocultar el componente
            setData(null);
          }
        } finally {
          if (stryMutAct_9fa48("16686")) {
            {}
          } else {
            stryCov_9fa48("16686");
            setLoading(stryMutAct_9fa48("16687") ? true : (stryCov_9fa48("16687"), false));
          }
        }
      }
    }
    const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
      if (stryMutAct_9fa48("16688")) {
        {}
      } else {
        stryCov_9fa48("16688");
        switch (trend) {
          case stryMutAct_9fa48("16690") ? "" : (stryCov_9fa48("16690"), 'improving'):
            if (stryMutAct_9fa48("16689")) {} else {
              stryCov_9fa48("16689");
              return <TrendingUp className="h-4 w-4 text-green-600" />;
            }
          case stryMutAct_9fa48("16692") ? "" : (stryCov_9fa48("16692"), 'declining'):
            if (stryMutAct_9fa48("16691")) {} else {
              stryCov_9fa48("16691");
              return <TrendingDown className="h-4 w-4 text-red-600" />;
            }
          default:
            if (stryMutAct_9fa48("16693")) {} else {
              stryCov_9fa48("16693");
              return <Minus className="h-4 w-4 text-gray-600" />;
            }
        }
      }
    };
    const formatDate = (dateString: string) => {
      if (stryMutAct_9fa48("16694")) {
        {}
      } else {
        stryCov_9fa48("16694");
        return new Date(dateString).toLocaleDateString(stryMutAct_9fa48("16695") ? "" : (stryCov_9fa48("16695"), 'es-CL'), stryMutAct_9fa48("16696") ? {} : (stryCov_9fa48("16696"), {
          month: stryMutAct_9fa48("16697") ? "" : (stryCov_9fa48("16697"), 'short'),
          day: stryMutAct_9fa48("16698") ? "" : (stryCov_9fa48("16698"), 'numeric')
        }));
      }
    };
    if (stryMutAct_9fa48("16700") ? false : stryMutAct_9fa48("16699") ? true : (stryCov_9fa48("16699", "16700"), loading)) {
      if (stryMutAct_9fa48("16701")) {
        {}
      } else {
        stryCov_9fa48("16701");
        return <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Progreso Conjunto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>;
      }
    }
    if (stryMutAct_9fa48("16704") ? false : stryMutAct_9fa48("16703") ? true : stryMutAct_9fa48("16702") ? data : (stryCov_9fa48("16702", "16703", "16704"), !data)) {
      if (stryMutAct_9fa48("16705")) {
        {}
      } else {
        stryCov_9fa48("16705");
        return null; // No mostrar si no hay suficientes estudiantes
      }
    }
    const {
      current,
      other
    } = data;
    return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Progreso Conjunto
            </CardTitle>
            <CardDescription>Compara tu progreso con {other.student.nombre}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/comparison">Ver Comparación Completa</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Usuario Actual */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{current.student.nombre}</h3>
              {getTrendIcon(current.progress.trend)}
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Promedio</span>
                  <span className="font-bold">
                    {current.progress.averagePercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={current.progress.averagePercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Mejor:</span>
                  <span className="ml-2 font-bold">
                    {current.progress.bestPercentage.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Intentos:</span>
                  <span className="ml-2 font-bold">{current.progress.totalAttempts}</span>
                </div>
                {stryMutAct_9fa48("16708") ? current.progress.averagePaesScore || <div>
                    <span className="text-muted-foreground">PAES Prom:</span>
                    <span className="ml-2 font-bold">
                      {current.progress.averagePaesScore.toFixed(0)}
                    </span>
                  </div> : stryMutAct_9fa48("16707") ? false : stryMutAct_9fa48("16706") ? true : (stryCov_9fa48("16706", "16707", "16708"), current.progress.averagePaesScore && <div>
                    <span className="text-muted-foreground">PAES Prom:</span>
                    <span className="ml-2 font-bold">
                      {current.progress.averagePaesScore.toFixed(0)}
                    </span>
                  </div>)}
              </div>
            </div>
          </div>

          {/* Otro Usuario */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{other.student.nombre}</h3>
              {getTrendIcon(other.progress.trend)}
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Promedio</span>
                  <span className="font-bold">{other.progress.averagePercentage.toFixed(1)}%</span>
                </div>
                <Progress value={other.progress.averagePercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Mejor:</span>
                  <span className="ml-2 font-bold">
                    {other.progress.bestPercentage.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Intentos:</span>
                  <span className="ml-2 font-bold">{other.progress.totalAttempts}</span>
                </div>
                {stryMutAct_9fa48("16711") ? other.progress.averagePaesScore || <div>
                    <span className="text-muted-foreground">PAES Prom:</span>
                    <span className="ml-2 font-bold">
                      {other.progress.averagePaesScore.toFixed(0)}
                    </span>
                  </div> : stryMutAct_9fa48("16710") ? false : stryMutAct_9fa48("16709") ? true : (stryCov_9fa48("16709", "16710", "16711"), other.progress.averagePaesScore && <div>
                    <span className="text-muted-foreground">PAES Prom:</span>
                    <span className="ml-2 font-bold">
                      {other.progress.averagePaesScore.toFixed(0)}
                    </span>
                  </div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Últimos Exámenes */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Últimos Exámenes Realizados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Exámenes del usuario actual */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                {current.student.nombre}
              </div>
              {(stryMutAct_9fa48("16714") ? current.progress.recentAttempts.length !== 0 : stryMutAct_9fa48("16713") ? false : stryMutAct_9fa48("16712") ? true : (stryCov_9fa48("16712", "16713", "16714"), current.progress.recentAttempts.length === 0)) ? <p className="text-sm text-muted-foreground">Aún no has realizado exámenes</p> : stryMutAct_9fa48("16715") ? current.progress.recentAttempts.map(attempt => <div key={attempt.id} className="p-2 border rounded-lg text-sm hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <Link href={`/exams/${attempt.exam.id}/results`} className="font-medium hover:underline line-clamp-1 flex-1">
                        {attempt.exam.titulo}
                      </Link>
                      <Badge variant={attempt.porcentaje >= 70 ? 'default' : attempt.porcentaje >= 50 ? 'secondary' : 'destructive'} className="ml-2">
                        {attempt.porcentaje.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{attempt.exam.subject.codigo}</span>
                      <span>{formatDate(attempt.createdAt)}</span>
                    </div>
                  </div>) : (stryCov_9fa48("16715"), current.progress.recentAttempts.slice(0, 3).map(stryMutAct_9fa48("16716") ? () => undefined : (stryCov_9fa48("16716"), attempt => <div key={attempt.id} className="p-2 border rounded-lg text-sm hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <Link href={stryMutAct_9fa48("16717") ? `` : (stryCov_9fa48("16717"), `/exams/${attempt.exam.id}/results`)} className="font-medium hover:underline line-clamp-1 flex-1">
                        {attempt.exam.titulo}
                      </Link>
                      <Badge variant={(stryMutAct_9fa48("16721") ? attempt.porcentaje < 70 : stryMutAct_9fa48("16720") ? attempt.porcentaje > 70 : stryMutAct_9fa48("16719") ? false : stryMutAct_9fa48("16718") ? true : (stryCov_9fa48("16718", "16719", "16720", "16721"), attempt.porcentaje >= 70)) ? stryMutAct_9fa48("16722") ? "" : (stryCov_9fa48("16722"), 'default') : (stryMutAct_9fa48("16726") ? attempt.porcentaje < 50 : stryMutAct_9fa48("16725") ? attempt.porcentaje > 50 : stryMutAct_9fa48("16724") ? false : stryMutAct_9fa48("16723") ? true : (stryCov_9fa48("16723", "16724", "16725", "16726"), attempt.porcentaje >= 50)) ? stryMutAct_9fa48("16727") ? "" : (stryCov_9fa48("16727"), 'secondary') : stryMutAct_9fa48("16728") ? "" : (stryCov_9fa48("16728"), 'destructive')} className="ml-2">
                        {attempt.porcentaje.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{attempt.exam.subject.codigo}</span>
                      <span>{formatDate(attempt.createdAt)}</span>
                    </div>
                  </div>)))}
            </div>

            {/* Exámenes del otro usuario */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                {other.student.nombre}
              </div>
              {(stryMutAct_9fa48("16731") ? other.progress.recentAttempts.length !== 0 : stryMutAct_9fa48("16730") ? false : stryMutAct_9fa48("16729") ? true : (stryCov_9fa48("16729", "16730", "16731"), other.progress.recentAttempts.length === 0)) ? <p className="text-sm text-muted-foreground">Aún no ha realizado exámenes</p> : stryMutAct_9fa48("16732") ? other.progress.recentAttempts.map(attempt => <div key={attempt.id} className="p-2 border rounded-lg text-sm hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium line-clamp-1 flex-1">{attempt.exam.titulo}</span>
                      <Badge variant={attempt.porcentaje >= 70 ? 'default' : attempt.porcentaje >= 50 ? 'secondary' : 'destructive'} className="ml-2">
                        {attempt.porcentaje.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{attempt.exam.subject.codigo}</span>
                      <span>{formatDate(attempt.createdAt)}</span>
                    </div>
                  </div>) : (stryCov_9fa48("16732"), other.progress.recentAttempts.slice(0, 3).map(stryMutAct_9fa48("16733") ? () => undefined : (stryCov_9fa48("16733"), attempt => <div key={attempt.id} className="p-2 border rounded-lg text-sm hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium line-clamp-1 flex-1">{attempt.exam.titulo}</span>
                      <Badge variant={(stryMutAct_9fa48("16737") ? attempt.porcentaje < 70 : stryMutAct_9fa48("16736") ? attempt.porcentaje > 70 : stryMutAct_9fa48("16735") ? false : stryMutAct_9fa48("16734") ? true : (stryCov_9fa48("16734", "16735", "16736", "16737"), attempt.porcentaje >= 70)) ? stryMutAct_9fa48("16738") ? "" : (stryCov_9fa48("16738"), 'default') : (stryMutAct_9fa48("16742") ? attempt.porcentaje < 50 : stryMutAct_9fa48("16741") ? attempt.porcentaje > 50 : stryMutAct_9fa48("16740") ? false : stryMutAct_9fa48("16739") ? true : (stryCov_9fa48("16739", "16740", "16741", "16742"), attempt.porcentaje >= 50)) ? stryMutAct_9fa48("16743") ? "" : (stryCov_9fa48("16743"), 'secondary') : stryMutAct_9fa48("16744") ? "" : (stryCov_9fa48("16744"), 'destructive')} className="ml-2">
                        {attempt.porcentaje.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{attempt.exam.subject.codigo}</span>
                      <span>{formatDate(attempt.createdAt)}</span>
                    </div>
                  </div>)))}
            </div>
          </div>
        </div>

        {/* Top Temas */}
        {stryMutAct_9fa48("16747") ? current.progress.topTopics.length > 0 || other.progress.topTopics.length > 0 || <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mejores Temas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Temas del usuario actual */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {current.student.nombre}
                </div>
                {current.progress.topTopics.length === 0 ? <p className="text-sm text-muted-foreground">Aún no hay métricas</p> : current.progress.topTopics.map(metric => <div key={metric.topicId} className="p-2 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium line-clamp-1">{metric.topic.nombre}</span>
                        <Badge variant="default">{metric.porcentaje.toFixed(0)}%</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.topic.subject.codigo} • {metric.correctas}/{metric.totalPreguntas}{' '}
                        correctas
                      </div>
                    </div>)}
              </div>

              {/* Temas del otro usuario */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {other.student.nombre}
                </div>
                {other.progress.topTopics.length === 0 ? <p className="text-sm text-muted-foreground">Aún no hay métricas</p> : other.progress.topTopics.map(metric => <div key={metric.topicId} className="p-2 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium line-clamp-1">{metric.topic.nombre}</span>
                        <Badge variant="default">{metric.porcentaje.toFixed(0)}%</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.topic.subject.codigo} • {metric.correctas}/{metric.totalPreguntas}{' '}
                        correctas
                      </div>
                    </div>)}
              </div>
            </div>
          </div> : stryMutAct_9fa48("16746") ? false : stryMutAct_9fa48("16745") ? true : (stryCov_9fa48("16745", "16746", "16747"), (stryMutAct_9fa48("16749") ? current.progress.topTopics.length > 0 && other.progress.topTopics.length > 0 : stryMutAct_9fa48("16748") ? true : (stryCov_9fa48("16748", "16749"), (stryMutAct_9fa48("16752") ? current.progress.topTopics.length <= 0 : stryMutAct_9fa48("16751") ? current.progress.topTopics.length >= 0 : stryMutAct_9fa48("16750") ? false : (stryCov_9fa48("16750", "16751", "16752"), current.progress.topTopics.length > 0)) || (stryMutAct_9fa48("16755") ? other.progress.topTopics.length <= 0 : stryMutAct_9fa48("16754") ? other.progress.topTopics.length >= 0 : stryMutAct_9fa48("16753") ? false : (stryCov_9fa48("16753", "16754", "16755"), other.progress.topTopics.length > 0)))) && <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mejores Temas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Temas del usuario actual */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {current.student.nombre}
                </div>
                {(stryMutAct_9fa48("16758") ? current.progress.topTopics.length !== 0 : stryMutAct_9fa48("16757") ? false : stryMutAct_9fa48("16756") ? true : (stryCov_9fa48("16756", "16757", "16758"), current.progress.topTopics.length === 0)) ? <p className="text-sm text-muted-foreground">Aún no hay métricas</p> : current.progress.topTopics.map(stryMutAct_9fa48("16759") ? () => undefined : (stryCov_9fa48("16759"), metric => <div key={metric.topicId} className="p-2 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium line-clamp-1">{metric.topic.nombre}</span>
                        <Badge variant="default">{metric.porcentaje.toFixed(0)}%</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.topic.subject.codigo} • {metric.correctas}/{metric.totalPreguntas}{stryMutAct_9fa48("16760") ? "" : (stryCov_9fa48("16760"), ' ')}
                        correctas
                      </div>
                    </div>))}
              </div>

              {/* Temas del otro usuario */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {other.student.nombre}
                </div>
                {(stryMutAct_9fa48("16763") ? other.progress.topTopics.length !== 0 : stryMutAct_9fa48("16762") ? false : stryMutAct_9fa48("16761") ? true : (stryCov_9fa48("16761", "16762", "16763"), other.progress.topTopics.length === 0)) ? <p className="text-sm text-muted-foreground">Aún no hay métricas</p> : other.progress.topTopics.map(stryMutAct_9fa48("16764") ? () => undefined : (stryCov_9fa48("16764"), metric => <div key={metric.topicId} className="p-2 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium line-clamp-1">{metric.topic.nombre}</span>
                        <Badge variant="default">{metric.porcentaje.toFixed(0)}%</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.topic.subject.codigo} • {metric.correctas}/{metric.totalPreguntas}{stryMutAct_9fa48("16765") ? "" : (stryCov_9fa48("16765"), ' ')}
                        correctas
                      </div>
                    </div>))}
              </div>
            </div>
          </div>)}
      </CardContent>
    </Card>;
  }
}