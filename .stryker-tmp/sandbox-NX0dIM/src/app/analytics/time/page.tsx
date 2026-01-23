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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Clock, TrendingUp, BookOpen, Target, BarChart3, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { HelpIcon } from '@/components/help/help-icon';
import { BackButton } from '@/components/navigation/back-button';
interface SubjectStat {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  totalTime: number;
  count: number;
  averageTime: number;
  averageCorrectTime: number;
  averageIncorrectTime: number;
  correctCount: number;
  incorrectCount: number;
}
interface TopicStat {
  topicId: string;
  topicName: string;
  ejeTematico: string;
  subjectName: string;
  subjectCode: string;
  totalTime: number;
  count: number;
  averageTime: number;
  averageCorrectTime: number;
  averageIncorrectTime: number;
  correctCount: number;
  incorrectCount: number;
}
interface DifficultyStat {
  difficulty: number;
  totalTime: number;
  count: number;
  averageTime: number;
  averageCorrectTime: number;
  averageIncorrectTime: number;
  correctCount: number;
  incorrectCount: number;
}
interface TypeStat {
  exam: {
    totalTime: number;
    count: number;
    averageTime: number;
  };
  practice: {
    totalTime: number;
    count: number;
    averageTime: number;
  };
}
export default function TimeStatsPage() {
  if (stryMutAct_9fa48("2124")) {
    {}
  } else {
    stryCov_9fa48("2124");
    const [loading, setLoading] = useState(stryMutAct_9fa48("2125") ? false : (stryCov_9fa48("2125"), true));
    const [error, setError] = useState<string | null>(null);
    const [overall, setOverall] = useState<{
      totalTime: number;
      totalCount: number;
      averageTime: number;
    } | null>(null);
    const [subjectStats, setSubjectStats] = useState<SubjectStat[]>(stryMutAct_9fa48("2126") ? ["Stryker was here"] : (stryCov_9fa48("2126"), []));
    const [topicStats, setTopicStats] = useState<TopicStat[]>(stryMutAct_9fa48("2127") ? ["Stryker was here"] : (stryCov_9fa48("2127"), []));
    const [difficultyStats, setDifficultyStats] = useState<DifficultyStat[]>(stryMutAct_9fa48("2128") ? ["Stryker was here"] : (stryCov_9fa48("2128"), []));
    const [typeStats, setTypeStats] = useState<TypeStat | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("2129")) {
        {}
      } else {
        stryCov_9fa48("2129");
        loadTimeStats();
      }
    }, stryMutAct_9fa48("2130") ? ["Stryker was here"] : (stryCov_9fa48("2130"), []));
    async function loadTimeStats() {
      if (stryMutAct_9fa48("2131")) {
        {}
      } else {
        stryCov_9fa48("2131");
        try {
          if (stryMutAct_9fa48("2132")) {
            {}
          } else {
            stryCov_9fa48("2132");
            setLoading(stryMutAct_9fa48("2133") ? false : (stryCov_9fa48("2133"), true));
            setError(null);
            const res = await fetch(stryMutAct_9fa48("2134") ? "" : (stryCov_9fa48("2134"), '/api/analytics/time'));
            if (stryMutAct_9fa48("2137") ? false : stryMutAct_9fa48("2136") ? true : stryMutAct_9fa48("2135") ? res.ok : (stryCov_9fa48("2135", "2136", "2137"), !res.ok)) throw new Error(stryMutAct_9fa48("2138") ? "" : (stryCov_9fa48("2138"), 'Error al cargar estadísticas de tiempo'));
            const data = await res.json();
            setOverall(data.overall);
            setSubjectStats(stryMutAct_9fa48("2141") ? data.bySubject && [] : stryMutAct_9fa48("2140") ? false : stryMutAct_9fa48("2139") ? true : (stryCov_9fa48("2139", "2140", "2141"), data.bySubject || (stryMutAct_9fa48("2142") ? ["Stryker was here"] : (stryCov_9fa48("2142"), []))));
            setTopicStats(stryMutAct_9fa48("2145") ? data.byTopic && [] : stryMutAct_9fa48("2144") ? false : stryMutAct_9fa48("2143") ? true : (stryCov_9fa48("2143", "2144", "2145"), data.byTopic || (stryMutAct_9fa48("2146") ? ["Stryker was here"] : (stryCov_9fa48("2146"), []))));
            setDifficultyStats(stryMutAct_9fa48("2149") ? data.byDifficulty && [] : stryMutAct_9fa48("2148") ? false : stryMutAct_9fa48("2147") ? true : (stryCov_9fa48("2147", "2148", "2149"), data.byDifficulty || (stryMutAct_9fa48("2150") ? ["Stryker was here"] : (stryCov_9fa48("2150"), []))));
            setTypeStats(stryMutAct_9fa48("2153") ? data.byType && null : stryMutAct_9fa48("2152") ? false : stryMutAct_9fa48("2151") ? true : (stryCov_9fa48("2151", "2152", "2153"), data.byType || null));
          }
        } catch (err) {
          if (stryMutAct_9fa48("2154")) {
            {}
          } else {
            stryCov_9fa48("2154");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("2155") ? "" : (stryCov_9fa48("2155"), 'Error desconocido'));
            toast.error(stryMutAct_9fa48("2156") ? "" : (stryCov_9fa48("2156"), 'Error al cargar estadísticas de tiempo'));
          }
        } finally {
          if (stryMutAct_9fa48("2157")) {
            {}
          } else {
            stryCov_9fa48("2157");
            setLoading(stryMutAct_9fa48("2158") ? true : (stryCov_9fa48("2158"), false));
          }
        }
      }
    }
    const formatTime = (seconds: number) => {
      if (stryMutAct_9fa48("2159")) {
        {}
      } else {
        stryCov_9fa48("2159");
        if (stryMutAct_9fa48("2163") ? seconds >= 60 : stryMutAct_9fa48("2162") ? seconds <= 60 : stryMutAct_9fa48("2161") ? false : stryMutAct_9fa48("2160") ? true : (stryCov_9fa48("2160", "2161", "2162", "2163"), seconds < 60)) {
          if (stryMutAct_9fa48("2164")) {
            {}
          } else {
            stryCov_9fa48("2164");
            return stryMutAct_9fa48("2165") ? `` : (stryCov_9fa48("2165"), `${seconds.toFixed(0)}s`);
          }
        }
        const minutes = Math.floor(stryMutAct_9fa48("2166") ? seconds * 60 : (stryCov_9fa48("2166"), seconds / 60));
        const secs = Math.floor(stryMutAct_9fa48("2167") ? seconds * 60 : (stryCov_9fa48("2167"), seconds % 60));
        return stryMutAct_9fa48("2168") ? `` : (stryCov_9fa48("2168"), `${minutes}m ${secs}s`);
      }
    };
    const formatTimeShort = (seconds: number) => {
      if (stryMutAct_9fa48("2169")) {
        {}
      } else {
        stryCov_9fa48("2169");
        if (stryMutAct_9fa48("2173") ? seconds >= 60 : stryMutAct_9fa48("2172") ? seconds <= 60 : stryMutAct_9fa48("2171") ? false : stryMutAct_9fa48("2170") ? true : (stryCov_9fa48("2170", "2171", "2172", "2173"), seconds < 60)) {
          if (stryMutAct_9fa48("2174")) {
            {}
          } else {
            stryCov_9fa48("2174");
            return stryMutAct_9fa48("2175") ? `` : (stryCov_9fa48("2175"), `${seconds.toFixed(1)}s`);
          }
        }
        return stryMutAct_9fa48("2176") ? `` : (stryCov_9fa48("2176"), `${(stryMutAct_9fa48("2177") ? seconds * 60 : (stryCov_9fa48("2177"), seconds / 60)).toFixed(1)}m`);
      }
    };
    if (stryMutAct_9fa48("2179") ? false : stryMutAct_9fa48("2178") ? true : (stryCov_9fa48("2178", "2179"), loading)) {
      if (stryMutAct_9fa48("2180")) {
        {}
      } else {
        stryCov_9fa48("2180");
        return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 h-12 w-12 mx-auto">
              <div className="h-full w-full border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Cargando estadísticas...
            </p>
            <p className="text-sm text-muted-foreground">Analizando tus tiempos de respuesta</p>
          </div>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("2182") ? false : stryMutAct_9fa48("2181") ? true : (stryCov_9fa48("2181", "2182"), error)) {
      if (stryMutAct_9fa48("2183")) {
        {}
      } else {
        stryCov_9fa48("2183");
        return <div className="container mx-auto p-6">
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="relative inline-block">
                <Clock className="h-20 w-20 mx-auto text-muted-foreground/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{error}</h3>
                <p className="text-muted-foreground">
                  No hay datos de tiempo disponibles. Completa algunos exámenes o prácticas para ver
                  estadísticas.
                </p>
              </div>
              <div className="pt-4">
                <a href="/exams" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  <BookOpen className="h-4 w-4" />
                  Explorar exámenes disponibles
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>;
      }
    }
    return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <BackButton href="/analytics" label="Volver a Analytics" />
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8" />
            Estadísticas de Tiempo
          </h1>
          <p className="text-muted-foreground mt-2">
            Analiza cuánto tiempo dedicas a cada tipo de pregunta
          </p>
        </div>
        <HelpIcon content="Estas estadísticas muestran el tiempo promedio que dedicas a responder preguntas, desglosado por asignatura, tema, dificultad y tipo de sesión (examen vs práctica)." />
      </div>

      {/* Overall Stats */}
      {stryMutAct_9fa48("2186") ? overall && overall.totalCount > 0 || <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Clock className="h-4 w-4" />
                Tiempo Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-blue-900 dark:text-blue-100">
                {formatTime(overall.averageTime)}
              </div>
              <p className="text-xs text-muted-foreground">Por pregunta</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
                <Target className="h-4 w-4" />
                Total de Preguntas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-green-900 dark:text-green-100">
                {overall.totalCount}
              </div>
              <p className="text-xs text-muted-foreground">Con tiempo registrado</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <TrendingUp className="h-4 w-4" />
                Tiempo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-purple-900 dark:text-purple-100">
                {formatTime(overall.totalTime)}
              </div>
              <p className="text-xs text-muted-foreground">Acumulado</p>
            </CardContent>
          </Card>
        </div> : stryMutAct_9fa48("2185") ? false : stryMutAct_9fa48("2184") ? true : (stryCov_9fa48("2184", "2185", "2186"), (stryMutAct_9fa48("2188") ? overall || overall.totalCount > 0 : stryMutAct_9fa48("2187") ? true : (stryCov_9fa48("2187", "2188"), overall && (stryMutAct_9fa48("2191") ? overall.totalCount <= 0 : stryMutAct_9fa48("2190") ? overall.totalCount >= 0 : stryMutAct_9fa48("2189") ? true : (stryCov_9fa48("2189", "2190", "2191"), overall.totalCount > 0)))) && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Clock className="h-4 w-4" />
                Tiempo Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-blue-900 dark:text-blue-100">
                {formatTime(overall.averageTime)}
              </div>
              <p className="text-xs text-muted-foreground">Por pregunta</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
                <Target className="h-4 w-4" />
                Total de Preguntas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-green-900 dark:text-green-100">
                {overall.totalCount}
              </div>
              <p className="text-xs text-muted-foreground">Con tiempo registrado</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <TrendingUp className="h-4 w-4" />
                Tiempo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-purple-900 dark:text-purple-100">
                {formatTime(overall.totalTime)}
              </div>
              <p className="text-xs text-muted-foreground">Acumulado</p>
            </CardContent>
          </Card>
        </div>)}

      {/* Type Comparison */}
      {stryMutAct_9fa48("2194") ? typeStats || <Card>
          <CardHeader>
            <CardTitle>Comparación: Examen vs Práctica</CardTitle>
            <CardDescription>
              Tiempo promedio en exámenes versus sesiones de práctica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Exámenes</span>
                  <Badge variant="outline">{typeStats.exam.count} preguntas</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatTime(typeStats.exam.averageTime)}
                </div>
                <p className="text-sm text-muted-foreground">Tiempo promedio por pregunta</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Práctica</span>
                  <Badge variant="outline">{typeStats.practice.count} preguntas</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatTime(typeStats.practice.averageTime)}
                </div>
                <p className="text-sm text-muted-foreground">Tiempo promedio por pregunta</p>
              </div>
            </div>
          </CardContent>
        </Card> : stryMutAct_9fa48("2193") ? false : stryMutAct_9fa48("2192") ? true : (stryCov_9fa48("2192", "2193", "2194"), typeStats && <Card>
          <CardHeader>
            <CardTitle>Comparación: Examen vs Práctica</CardTitle>
            <CardDescription>
              Tiempo promedio en exámenes versus sesiones de práctica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Exámenes</span>
                  <Badge variant="outline">{typeStats.exam.count} preguntas</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatTime(typeStats.exam.averageTime)}
                </div>
                <p className="text-sm text-muted-foreground">Tiempo promedio por pregunta</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Práctica</span>
                  <Badge variant="outline">{typeStats.practice.count} preguntas</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatTime(typeStats.practice.averageTime)}
                </div>
                <p className="text-sm text-muted-foreground">Tiempo promedio por pregunta</p>
              </div>
            </div>
          </CardContent>
        </Card>)}

      <Tabs defaultValue="subject" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subject">Por Asignatura</TabsTrigger>
          <TabsTrigger value="topic">Por Tema</TabsTrigger>
          <TabsTrigger value="difficulty">Por Dificultad</TabsTrigger>
        </TabsList>

        <TabsContent value="subject" className="space-y-4">
          {(stryMutAct_9fa48("2197") ? subjectStats.length !== 0 : stryMutAct_9fa48("2196") ? false : stryMutAct_9fa48("2195") ? true : (stryCov_9fa48("2195", "2196", "2197"), subjectStats.length === 0)) ? <Card className="border-2 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="space-y-3">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground font-medium">
                    No hay datos disponibles por asignatura
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Completa más exámenes para ver estadísticas detalladas
                  </p>
                </div>
              </CardContent>
            </Card> : <div className="space-y-4">
              {subjectStats.map(stryMutAct_9fa48("2198") ? () => undefined : (stryCov_9fa48("2198"), (stat, index) => <Card key={stat.subjectId} className="hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500" style={stryMutAct_9fa48("2199") ? {} : (stryCov_9fa48("2199"), {
              animationDelay: stryMutAct_9fa48("2200") ? `` : (stryCov_9fa48("2200"), `${stryMutAct_9fa48("2201") ? index / 50 : (stryCov_9fa48("2201"), index * 50)}ms`)
            })}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{stat.subjectName}</CardTitle>
                        <CardDescription>{stat.subjectCode}</CardDescription>
                      </div>
                      <Badge variant="outline">{stat.count} preguntas</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tiempo Promedio</p>
                        <p className="text-xl font-bold">{formatTime(stat.averageTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Correctas</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatTime(stat.averageCorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.correctCount} preguntas
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Incorrectas</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatTime(stat.averageIncorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.incorrectCount} preguntas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>))}
            </div>}
        </TabsContent>

        <TabsContent value="topic" className="space-y-4">
          {(stryMutAct_9fa48("2204") ? topicStats.length !== 0 : stryMutAct_9fa48("2203") ? false : stryMutAct_9fa48("2202") ? true : (stryCov_9fa48("2202", "2203", "2204"), topicStats.length === 0)) ? <Card className="border-2 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="space-y-3">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground font-medium">
                    No hay datos disponibles por tema
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Completa más exámenes para ver estadísticas detalladas
                  </p>
                </div>
              </CardContent>
            </Card> : <div className="space-y-4">
              {stryMutAct_9fa48("2205") ? topicStats.map((stat, index) => <Card key={stat.topicId} className="hover:shadow-md transition-all duration-300 border-l-4 border-l-green-500" style={{
              animationDelay: `${index * 50}ms`
            }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{stat.topicName}</CardTitle>
                        <CardDescription>
                          {stat.subjectName} • {stat.ejeTematico}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{stat.count} preguntas</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tiempo Promedio</p>
                        <p className="text-xl font-bold">{formatTime(stat.averageTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Correctas</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatTime(stat.averageCorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.correctCount} preguntas
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Incorrectas</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatTime(stat.averageIncorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.incorrectCount} preguntas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>) : (stryCov_9fa48("2205"), topicStats.slice(0, 10).map(stryMutAct_9fa48("2206") ? () => undefined : (stryCov_9fa48("2206"), (stat, index) => <Card key={stat.topicId} className="hover:shadow-md transition-all duration-300 border-l-4 border-l-green-500" style={stryMutAct_9fa48("2207") ? {} : (stryCov_9fa48("2207"), {
              animationDelay: stryMutAct_9fa48("2208") ? `` : (stryCov_9fa48("2208"), `${stryMutAct_9fa48("2209") ? index / 50 : (stryCov_9fa48("2209"), index * 50)}ms`)
            })}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{stat.topicName}</CardTitle>
                        <CardDescription>
                          {stat.subjectName} • {stat.ejeTematico}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{stat.count} preguntas</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tiempo Promedio</p>
                        <p className="text-xl font-bold">{formatTime(stat.averageTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Correctas</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatTime(stat.averageCorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.correctCount} preguntas
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Incorrectas</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatTime(stat.averageIncorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.incorrectCount} preguntas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>)))}
            </div>}
        </TabsContent>

        <TabsContent value="difficulty" className="space-y-4">
          {(stryMutAct_9fa48("2212") ? difficultyStats.length !== 0 : stryMutAct_9fa48("2211") ? false : stryMutAct_9fa48("2210") ? true : (stryCov_9fa48("2210", "2211", "2212"), difficultyStats.length === 0)) ? <Card className="border-2 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="space-y-3">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground font-medium">
                    No hay datos disponibles por dificultad
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Completa más exámenes para ver estadísticas detalladas
                  </p>
                </div>
              </CardContent>
            </Card> : <div className="space-y-4">
              {difficultyStats.map(stryMutAct_9fa48("2213") ? () => undefined : (stryCov_9fa48("2213"), (stat, index) => <Card key={stat.difficulty} className="hover:shadow-md transition-all duration-300 border-l-4 border-l-purple-500" style={stryMutAct_9fa48("2214") ? {} : (stryCov_9fa48("2214"), {
              animationDelay: stryMutAct_9fa48("2215") ? `` : (stryCov_9fa48("2215"), `${stryMutAct_9fa48("2216") ? index / 50 : (stryCov_9fa48("2216"), index * 50)}ms`)
            })}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Dificultad {stat.difficulty}/5</CardTitle>
                        <CardDescription>Nivel de dificultad de las preguntas</CardDescription>
                      </div>
                      <Badge variant="outline">{stat.count} preguntas</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tiempo Promedio</p>
                        <p className="text-xl font-bold">{formatTime(stat.averageTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Correctas</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatTime(stat.averageCorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.correctCount} preguntas
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Incorrectas</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatTime(stat.averageIncorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.incorrectCount} preguntas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>))}
            </div>}
        </TabsContent>
      </Tabs>
    </div>;
  }
}