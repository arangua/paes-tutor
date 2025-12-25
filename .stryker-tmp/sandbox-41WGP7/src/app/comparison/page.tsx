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
import { Loader2, TrendingUp, TrendingDown, Minus, Trophy, Award, Target, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { HelpIcon } from '@/components/help/help-icon';
import { BackButton } from '@/components/navigation/back-button';
import Link from 'next/link';
interface ComparisonData {
  current: {
    student: {
      id: string;
      nombre: string;
      email: string | null;
    };
    stats: {
      totalAttempts: number;
      averagePercentage: number;
      bestPercentage: number;
      worstPercentage: number;
      averagePaesScore: number | null;
      bestPaesScore: number | null;
      totalCorrect: number;
      totalQuestions: number;
      recentTrend: 'improving' | 'declining' | 'stable';
    };
    subjectStats: Array<{
      subjectCode: string;
      subjectName: string;
      totalAttempts: number;
      averagePercentage: number;
      bestPercentage: number;
      averagePaesScore: number | null;
    }>;
  };
  other: {
    student: {
      id: string;
      nombre: string;
      email: string | null;
    };
    stats: {
      totalAttempts: number;
      averagePercentage: number;
      bestPercentage: number;
      worstPercentage: number;
      averagePaesScore: number | null;
      bestPaesScore: number | null;
      totalCorrect: number;
      totalQuestions: number;
      recentTrend: 'improving' | 'declining' | 'stable';
    };
    subjectStats: Array<{
      subjectCode: string;
      subjectName: string;
      totalAttempts: number;
      averagePercentage: number;
      bestPercentage: number;
      averagePaesScore: number | null;
    }>;
  };
  commonExams: Array<{
    examId: string;
    examTitle: string;
    subject: {
      codigo: string;
      nombre: string;
    };
    current: {
      porcentaje: number;
      puntajePaes: number | null;
      correctas: number;
      totalPreguntas: number;
      createdAt: string;
    };
    other: {
      porcentaje: number;
      puntajePaes: number | null;
      correctas: number;
      totalPreguntas: number;
      createdAt: string;
    };
    winner: 'current' | 'other' | 'tie';
  }>;
  summary: {
    currentWins: number;
    otherWins: number;
    ties: number;
    averageDifference: number;
  };
}
export default function DirectComparisonPage() {
  if (stryMutAct_9fa48("12162")) {
    {}
  } else {
    stryCov_9fa48("12162");
    const [data, setData] = useState<ComparisonData | null>(null);
    const [loading, setLoading] = useState(stryMutAct_9fa48("12163") ? false : (stryCov_9fa48("12163"), true));
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("12164")) {
        {}
      } else {
        stryCov_9fa48("12164");
        loadComparison();
      }
    }, stryMutAct_9fa48("12165") ? ["Stryker was here"] : (stryCov_9fa48("12165"), []));
    async function loadComparison() {
      if (stryMutAct_9fa48("12166")) {
        {}
      } else {
        stryCov_9fa48("12166");
        try {
          if (stryMutAct_9fa48("12167")) {
            {}
          } else {
            stryCov_9fa48("12167");
            setLoading(stryMutAct_9fa48("12168") ? false : (stryCov_9fa48("12168"), true));
            setError(null);
            const res = await fetch(stryMutAct_9fa48("12169") ? "" : (stryCov_9fa48("12169"), '/api/analytics/direct-comparison'));
            if (stryMutAct_9fa48("12172") ? false : stryMutAct_9fa48("12171") ? true : stryMutAct_9fa48("12170") ? res.ok : (stryCov_9fa48("12170", "12171", "12172"), !res.ok)) throw new Error(stryMutAct_9fa48("12173") ? "" : (stryCov_9fa48("12173"), 'Error al cargar comparación'));
            const response = await res.json();
            if (stryMutAct_9fa48("12175") ? false : stryMutAct_9fa48("12174") ? true : (stryCov_9fa48("12174", "12175"), response.message)) {
              if (stryMutAct_9fa48("12176")) {
                {}
              } else {
                stryCov_9fa48("12176");
                setError(response.message);
                return;
              }
            }
            setData(response);
          }
        } catch (err) {
          if (stryMutAct_9fa48("12177")) {
            {}
          } else {
            stryCov_9fa48("12177");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("12178") ? "" : (stryCov_9fa48("12178"), 'Error desconocido'));
            toast.error(stryMutAct_9fa48("12179") ? "" : (stryCov_9fa48("12179"), 'Error al cargar comparación'));
          }
        } finally {
          if (stryMutAct_9fa48("12180")) {
            {}
          } else {
            stryCov_9fa48("12180");
            setLoading(stryMutAct_9fa48("12181") ? true : (stryCov_9fa48("12181"), false));
          }
        }
      }
    }
    const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
      if (stryMutAct_9fa48("12182")) {
        {}
      } else {
        stryCov_9fa48("12182");
        switch (trend) {
          case stryMutAct_9fa48("12184") ? "" : (stryCov_9fa48("12184"), 'improving'):
            if (stryMutAct_9fa48("12183")) {} else {
              stryCov_9fa48("12183");
              return <TrendingUp className="h-4 w-4 text-green-600" />;
            }
          case stryMutAct_9fa48("12186") ? "" : (stryCov_9fa48("12186"), 'declining'):
            if (stryMutAct_9fa48("12185")) {} else {
              stryCov_9fa48("12185");
              return <TrendingDown className="h-4 w-4 text-red-600" />;
            }
          default:
            if (stryMutAct_9fa48("12187")) {} else {
              stryCov_9fa48("12187");
              return <Minus className="h-4 w-4 text-gray-600" />;
            }
        }
      }
    };
    const formatDate = (dateString: string) => {
      if (stryMutAct_9fa48("12188")) {
        {}
      } else {
        stryCov_9fa48("12188");
        return new Date(dateString).toLocaleDateString(stryMutAct_9fa48("12189") ? "" : (stryCov_9fa48("12189"), 'es-CL'), stryMutAct_9fa48("12190") ? {} : (stryCov_9fa48("12190"), {
          year: stryMutAct_9fa48("12191") ? "" : (stryCov_9fa48("12191"), 'numeric'),
          month: stryMutAct_9fa48("12192") ? "" : (stryCov_9fa48("12192"), 'short'),
          day: stryMutAct_9fa48("12193") ? "" : (stryCov_9fa48("12193"), 'numeric')
        }));
      }
    };
    if (stryMutAct_9fa48("12195") ? false : stryMutAct_9fa48("12194") ? true : (stryCov_9fa48("12194", "12195"), loading)) {
      if (stryMutAct_9fa48("12196")) {
        {}
      } else {
        stryCov_9fa48("12196");
        return <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("12199") ? error && !data : stryMutAct_9fa48("12198") ? false : stryMutAct_9fa48("12197") ? true : (stryCov_9fa48("12197", "12198", "12199"), error || (stryMutAct_9fa48("12200") ? data : (stryCov_9fa48("12200"), !data)))) {
      if (stryMutAct_9fa48("12201")) {
        {}
      } else {
        stryCov_9fa48("12201");
        return <div className="container mx-auto p-6">
        <BackButton />
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Comparación Directa</CardTitle>
            <CardDescription>Compara tu progreso con el otro estudiante</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {stryMutAct_9fa48("12204") ? error && 'No hay datos disponibles para comparar' : stryMutAct_9fa48("12203") ? false : stryMutAct_9fa48("12202") ? true : (stryCov_9fa48("12202", "12203", "12204"), error || (stryMutAct_9fa48("12205") ? "" : (stryCov_9fa48("12205"), 'No hay datos disponibles para comparar')))}
            </p>
          </CardContent>
        </Card>
      </div>;
      }
    }
    const {
      current,
      other,
      commonExams,
      summary
    } = data;
    return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comparación Directa</h1>
          <p className="text-muted-foreground mt-2">
            Compara tu progreso con {other.student.nombre}
          </p>
        </div>
        <BackButton />
      </div>

      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Resumen General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{current.student.nombre}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Ganó {summary.currentWins} exámenes
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">Empates</div>
              <div className="text-sm text-muted-foreground mt-1">{summary.ties} exámenes</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-secondary">{other.student.nombre}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Ganó {summary.otherWins} exámenes
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Diferencia promedio:</span>
              <span className={stryMutAct_9fa48("12206") ? `` : (stryCov_9fa48("12206"), `font-bold ${(stryMutAct_9fa48("12210") ? summary.averageDifference <= 0 : stryMutAct_9fa48("12209") ? summary.averageDifference >= 0 : stryMutAct_9fa48("12208") ? false : stryMutAct_9fa48("12207") ? true : (stryCov_9fa48("12207", "12208", "12209", "12210"), summary.averageDifference > 0)) ? stryMutAct_9fa48("12211") ? "" : (stryCov_9fa48("12211"), 'text-green-600') : (stryMutAct_9fa48("12215") ? summary.averageDifference >= 0 : stryMutAct_9fa48("12214") ? summary.averageDifference <= 0 : stryMutAct_9fa48("12213") ? false : stryMutAct_9fa48("12212") ? true : (stryCov_9fa48("12212", "12213", "12214", "12215"), summary.averageDifference < 0)) ? stryMutAct_9fa48("12216") ? "" : (stryCov_9fa48("12216"), 'text-red-600') : stryMutAct_9fa48("12217") ? "" : (stryCov_9fa48("12217"), 'text-gray-600')}`)}>
                {(stryMutAct_9fa48("12221") ? summary.averageDifference <= 0 : stryMutAct_9fa48("12220") ? summary.averageDifference >= 0 : stryMutAct_9fa48("12219") ? false : stryMutAct_9fa48("12218") ? true : (stryCov_9fa48("12218", "12219", "12220", "12221"), summary.averageDifference > 0)) ? stryMutAct_9fa48("12222") ? "" : (stryCov_9fa48("12222"), '+') : stryMutAct_9fa48("12223") ? "Stryker was here!" : (stryCov_9fa48("12223"), '')}
                {summary.averageDifference.toFixed(1)}%
              </span>
            </div>
            {stryMutAct_9fa48("12226") ? summary.averageDifference > 0 || <p className="text-sm text-muted-foreground mt-1">
                {current.student.nombre} tiene un promedio {summary.averageDifference.toFixed(1)}%
                mayor
              </p> : stryMutAct_9fa48("12225") ? false : stryMutAct_9fa48("12224") ? true : (stryCov_9fa48("12224", "12225", "12226"), (stryMutAct_9fa48("12229") ? summary.averageDifference <= 0 : stryMutAct_9fa48("12228") ? summary.averageDifference >= 0 : stryMutAct_9fa48("12227") ? true : (stryCov_9fa48("12227", "12228", "12229"), summary.averageDifference > 0)) && <p className="text-sm text-muted-foreground mt-1">
                {current.student.nombre} tiene un promedio {summary.averageDifference.toFixed(1)}%
                mayor
              </p>)}
            {stryMutAct_9fa48("12232") ? summary.averageDifference < 0 || <p className="text-sm text-muted-foreground mt-1">
                {other.student.nombre} tiene un promedio{' '}
                {Math.abs(summary.averageDifference).toFixed(1)}% mayor
              </p> : stryMutAct_9fa48("12231") ? false : stryMutAct_9fa48("12230") ? true : (stryCov_9fa48("12230", "12231", "12232"), (stryMutAct_9fa48("12235") ? summary.averageDifference >= 0 : stryMutAct_9fa48("12234") ? summary.averageDifference <= 0 : stryMutAct_9fa48("12233") ? true : (stryCov_9fa48("12233", "12234", "12235"), summary.averageDifference < 0)) && <p className="text-sm text-muted-foreground mt-1">
                {other.student.nombre} tiene un promedio{stryMutAct_9fa48("12236") ? "" : (stryCov_9fa48("12236"), ' ')}
                {Math.abs(summary.averageDifference).toFixed(1)}% mayor
              </p>)}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usuario Actual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {current.student.nombre}
            </CardTitle>
            <CardDescription>Tus estadísticas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Promedio General</span>
                <span className="font-bold">{current.stats.averagePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={current.stats.averagePercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Mejor Resultado</div>
                <div className="text-lg font-bold">{current.stats.bestPercentage.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Intentos</div>
                <div className="text-lg font-bold">{current.stats.totalAttempts}</div>
              </div>
              {stryMutAct_9fa48("12239") ? current.stats.averagePaesScore || <div>
                  <div className="text-sm text-muted-foreground">Promedio PAES</div>
                  <div className="text-lg font-bold">
                    {current.stats.averagePaesScore.toFixed(0)} pts
                  </div>
                </div> : stryMutAct_9fa48("12238") ? false : stryMutAct_9fa48("12237") ? true : (stryCov_9fa48("12237", "12238", "12239"), current.stats.averagePaesScore && <div>
                  <div className="text-sm text-muted-foreground">Promedio PAES</div>
                  <div className="text-lg font-bold">
                    {current.stats.averagePaesScore.toFixed(0)} pts
                  </div>
                </div>)}
              <div>
                <div className="text-sm text-muted-foreground">Tendencia</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(current.stats.recentTrend)}
                  <span className="text-sm">
                    {(stryMutAct_9fa48("12242") ? current.stats.recentTrend !== 'improving' : stryMutAct_9fa48("12241") ? false : stryMutAct_9fa48("12240") ? true : (stryCov_9fa48("12240", "12241", "12242"), current.stats.recentTrend === (stryMutAct_9fa48("12243") ? "" : (stryCov_9fa48("12243"), 'improving')))) ? stryMutAct_9fa48("12244") ? "" : (stryCov_9fa48("12244"), 'Mejorando') : (stryMutAct_9fa48("12247") ? current.stats.recentTrend !== 'declining' : stryMutAct_9fa48("12246") ? false : stryMutAct_9fa48("12245") ? true : (stryCov_9fa48("12245", "12246", "12247"), current.stats.recentTrend === (stryMutAct_9fa48("12248") ? "" : (stryCov_9fa48("12248"), 'declining')))) ? stryMutAct_9fa48("12249") ? "" : (stryCov_9fa48("12249"), 'Bajando') : stryMutAct_9fa48("12250") ? "" : (stryCov_9fa48("12250"), 'Estable')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Otro Usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {other.student.nombre}
            </CardTitle>
            <CardDescription>Estadísticas de {other.student.nombre}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Promedio General</span>
                <span className="font-bold">{other.stats.averagePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={other.stats.averagePercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Mejor Resultado</div>
                <div className="text-lg font-bold">{other.stats.bestPercentage.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Intentos</div>
                <div className="text-lg font-bold">{other.stats.totalAttempts}</div>
              </div>
              {stryMutAct_9fa48("12253") ? other.stats.averagePaesScore || <div>
                  <div className="text-sm text-muted-foreground">Promedio PAES</div>
                  <div className="text-lg font-bold">
                    {other.stats.averagePaesScore.toFixed(0)} pts
                  </div>
                </div> : stryMutAct_9fa48("12252") ? false : stryMutAct_9fa48("12251") ? true : (stryCov_9fa48("12251", "12252", "12253"), other.stats.averagePaesScore && <div>
                  <div className="text-sm text-muted-foreground">Promedio PAES</div>
                  <div className="text-lg font-bold">
                    {other.stats.averagePaesScore.toFixed(0)} pts
                  </div>
                </div>)}
              <div>
                <div className="text-sm text-muted-foreground">Tendencia</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(other.stats.recentTrend)}
                  <span className="text-sm">
                    {(stryMutAct_9fa48("12256") ? other.stats.recentTrend !== 'improving' : stryMutAct_9fa48("12255") ? false : stryMutAct_9fa48("12254") ? true : (stryCov_9fa48("12254", "12255", "12256"), other.stats.recentTrend === (stryMutAct_9fa48("12257") ? "" : (stryCov_9fa48("12257"), 'improving')))) ? stryMutAct_9fa48("12258") ? "" : (stryCov_9fa48("12258"), 'Mejorando') : (stryMutAct_9fa48("12261") ? other.stats.recentTrend !== 'declining' : stryMutAct_9fa48("12260") ? false : stryMutAct_9fa48("12259") ? true : (stryCov_9fa48("12259", "12260", "12261"), other.stats.recentTrend === (stryMutAct_9fa48("12262") ? "" : (stryCov_9fa48("12262"), 'declining')))) ? stryMutAct_9fa48("12263") ? "" : (stryCov_9fa48("12263"), 'Bajando') : stryMutAct_9fa48("12264") ? "" : (stryCov_9fa48("12264"), 'Estable')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparación por Asignatura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparación por Asignatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(() => {
              if (stryMutAct_9fa48("12265")) {
                {}
              } else {
                stryCov_9fa48("12265");
                const allSubjects = new Set(stryMutAct_9fa48("12266") ? [] : (stryCov_9fa48("12266"), [...current.subjectStats.map(stryMutAct_9fa48("12267") ? () => undefined : (stryCov_9fa48("12267"), s => s.subjectCode)), ...other.subjectStats.map(stryMutAct_9fa48("12268") ? () => undefined : (stryCov_9fa48("12268"), s => s.subjectCode))]));
                return Array.from(allSubjects).map(subjectCode => {
                  if (stryMutAct_9fa48("12269")) {
                    {}
                  } else {
                    stryCov_9fa48("12269");
                    const currentSubject = current.subjectStats.find(stryMutAct_9fa48("12270") ? () => undefined : (stryCov_9fa48("12270"), s => stryMutAct_9fa48("12273") ? s.subjectCode !== subjectCode : stryMutAct_9fa48("12272") ? false : stryMutAct_9fa48("12271") ? true : (stryCov_9fa48("12271", "12272", "12273"), s.subjectCode === subjectCode)));
                    const otherSubject = other.subjectStats.find(stryMutAct_9fa48("12274") ? () => undefined : (stryCov_9fa48("12274"), s => stryMutAct_9fa48("12277") ? s.subjectCode !== subjectCode : stryMutAct_9fa48("12276") ? false : stryMutAct_9fa48("12275") ? true : (stryCov_9fa48("12275", "12276", "12277"), s.subjectCode === subjectCode)));
                    if (stryMutAct_9fa48("12280") ? !currentSubject || !otherSubject : stryMutAct_9fa48("12279") ? false : stryMutAct_9fa48("12278") ? true : (stryCov_9fa48("12278", "12279", "12280"), (stryMutAct_9fa48("12281") ? currentSubject : (stryCov_9fa48("12281"), !currentSubject)) && (stryMutAct_9fa48("12282") ? otherSubject : (stryCov_9fa48("12282"), !otherSubject)))) return null;
                    const currentAvg = stryMutAct_9fa48("12285") ? currentSubject?.averagePercentage && 0 : stryMutAct_9fa48("12284") ? false : stryMutAct_9fa48("12283") ? true : (stryCov_9fa48("12283", "12284", "12285"), (stryMutAct_9fa48("12286") ? currentSubject.averagePercentage : (stryCov_9fa48("12286"), currentSubject?.averagePercentage)) || 0);
                    const otherAvg = stryMutAct_9fa48("12289") ? otherSubject?.averagePercentage && 0 : stryMutAct_9fa48("12288") ? false : stryMutAct_9fa48("12287") ? true : (stryCov_9fa48("12287", "12288", "12289"), (stryMutAct_9fa48("12290") ? otherSubject.averagePercentage : (stryCov_9fa48("12290"), otherSubject?.averagePercentage)) || 0);
                    const winner = (stryMutAct_9fa48("12294") ? currentAvg <= otherAvg : stryMutAct_9fa48("12293") ? currentAvg >= otherAvg : stryMutAct_9fa48("12292") ? false : stryMutAct_9fa48("12291") ? true : (stryCov_9fa48("12291", "12292", "12293", "12294"), currentAvg > otherAvg)) ? current.student.nombre : (stryMutAct_9fa48("12298") ? currentAvg >= otherAvg : stryMutAct_9fa48("12297") ? currentAvg <= otherAvg : stryMutAct_9fa48("12296") ? false : stryMutAct_9fa48("12295") ? true : (stryCov_9fa48("12295", "12296", "12297", "12298"), currentAvg < otherAvg)) ? other.student.nombre : stryMutAct_9fa48("12299") ? "" : (stryCov_9fa48("12299"), 'Empate');
                    return <div key={subjectCode} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">
                        {stryMutAct_9fa48("12302") ? currentSubject?.subjectName && otherSubject?.subjectName : stryMutAct_9fa48("12301") ? false : stryMutAct_9fa48("12300") ? true : (stryCov_9fa48("12300", "12301", "12302"), (stryMutAct_9fa48("12303") ? currentSubject.subjectName : (stryCov_9fa48("12303"), currentSubject?.subjectName)) || (stryMutAct_9fa48("12304") ? otherSubject.subjectName : (stryCov_9fa48("12304"), otherSubject?.subjectName)))}
                      </h3>
                      <Badge variant={(stryMutAct_9fa48("12308") ? currentAvg <= otherAvg : stryMutAct_9fa48("12307") ? currentAvg >= otherAvg : stryMutAct_9fa48("12306") ? false : stryMutAct_9fa48("12305") ? true : (stryCov_9fa48("12305", "12306", "12307", "12308"), currentAvg > otherAvg)) ? stryMutAct_9fa48("12309") ? "" : (stryCov_9fa48("12309"), 'default') : (stryMutAct_9fa48("12313") ? currentAvg >= otherAvg : stryMutAct_9fa48("12312") ? currentAvg <= otherAvg : stryMutAct_9fa48("12311") ? false : stryMutAct_9fa48("12310") ? true : (stryCov_9fa48("12310", "12311", "12312", "12313"), currentAvg < otherAvg)) ? stryMutAct_9fa48("12314") ? "" : (stryCov_9fa48("12314"), 'secondary') : stryMutAct_9fa48("12315") ? "" : (stryCov_9fa48("12315"), 'outline')}>
                        {winner}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {current.student.nombre}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={currentAvg} className="flex-1 h-2" />
                          <span className="text-sm font-bold w-16 text-right">
                            {currentAvg.toFixed(1)}%
                          </span>
                        </div>
                        {stryMutAct_9fa48("12318") ? currentSubject || <div className="text-xs text-muted-foreground mt-1">
                            {currentSubject.totalAttempts} intento
                            {currentSubject.totalAttempts !== 1 ? 's' : ''}
                          </div> : stryMutAct_9fa48("12317") ? false : stryMutAct_9fa48("12316") ? true : (stryCov_9fa48("12316", "12317", "12318"), currentSubject && <div className="text-xs text-muted-foreground mt-1">
                            {currentSubject.totalAttempts} intento
                            {(stryMutAct_9fa48("12321") ? currentSubject.totalAttempts === 1 : stryMutAct_9fa48("12320") ? false : stryMutAct_9fa48("12319") ? true : (stryCov_9fa48("12319", "12320", "12321"), currentSubject.totalAttempts !== 1)) ? stryMutAct_9fa48("12322") ? "" : (stryCov_9fa48("12322"), 's') : stryMutAct_9fa48("12323") ? "Stryker was here!" : (stryCov_9fa48("12323"), '')}
                          </div>)}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {other.student.nombre}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={otherAvg} className="flex-1 h-2" />
                          <span className="text-sm font-bold w-16 text-right">
                            {otherAvg.toFixed(1)}%
                          </span>
                        </div>
                        {stryMutAct_9fa48("12326") ? otherSubject || <div className="text-xs text-muted-foreground mt-1">
                            {otherSubject.totalAttempts} intento
                            {otherSubject.totalAttempts !== 1 ? 's' : ''}
                          </div> : stryMutAct_9fa48("12325") ? false : stryMutAct_9fa48("12324") ? true : (stryCov_9fa48("12324", "12325", "12326"), otherSubject && <div className="text-xs text-muted-foreground mt-1">
                            {otherSubject.totalAttempts} intento
                            {(stryMutAct_9fa48("12329") ? otherSubject.totalAttempts === 1 : stryMutAct_9fa48("12328") ? false : stryMutAct_9fa48("12327") ? true : (stryCov_9fa48("12327", "12328", "12329"), otherSubject.totalAttempts !== 1)) ? stryMutAct_9fa48("12330") ? "" : (stryCov_9fa48("12330"), 's') : stryMutAct_9fa48("12331") ? "Stryker was here!" : (stryCov_9fa48("12331"), '')}
                          </div>)}
                      </div>
                    </div>
                  </div>;
                  }
                });
              }
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Exámenes Comunes */}
      {stryMutAct_9fa48("12334") ? commonExams.length > 0 || <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Exámenes Comunes
            </CardTitle>
            <CardDescription>
              Exámenes que ambos han realizado ({commonExams.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonExams.map(exam => <div key={exam.examId} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{exam.examTitle}</h3>
                      <p className="text-sm text-muted-foreground">{exam.subject.nombre}</p>
                    </div>
                    {exam.winner === 'current' && <Badge className="bg-green-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        {current.student.nombre} ganó
                      </Badge>}
                    {exam.winner === 'other' && <Badge className="bg-blue-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        {other.student.nombre} ganó
                      </Badge>}
                    {exam.winner === 'tie' && <Badge variant="outline">Empate</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">{current.student.nombre}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Resultado:</span>
                          <span className="font-bold">{exam.current.porcentaje.toFixed(1)}%</span>
                        </div>
                        {exam.current.puntajePaes && <div className="flex justify-between text-sm">
                            <span>PAES:</span>
                            <span className="font-bold">{exam.current.puntajePaes} pts</span>
                          </div>}
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Fecha:</span>
                          <span>{formatDate(exam.current.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">{other.student.nombre}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Resultado:</span>
                          <span className="font-bold">{exam.other.porcentaje.toFixed(1)}%</span>
                        </div>
                        {exam.other.puntajePaes && <div className="flex justify-between text-sm">
                            <span>PAES:</span>
                            <span className="font-bold">{exam.other.puntajePaes} pts</span>
                          </div>}
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Fecha:</span>
                          <span>{formatDate(exam.other.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Link href={`/exams/${exam.examId}/take`} className="text-sm text-primary hover:underline">
                      Ver examen →
                    </Link>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card> : stryMutAct_9fa48("12333") ? false : stryMutAct_9fa48("12332") ? true : (stryCov_9fa48("12332", "12333", "12334"), (stryMutAct_9fa48("12337") ? commonExams.length <= 0 : stryMutAct_9fa48("12336") ? commonExams.length >= 0 : stryMutAct_9fa48("12335") ? true : (stryCov_9fa48("12335", "12336", "12337"), commonExams.length > 0)) && <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Exámenes Comunes
            </CardTitle>
            <CardDescription>
              Exámenes que ambos han realizado ({commonExams.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonExams.map(stryMutAct_9fa48("12338") ? () => undefined : (stryCov_9fa48("12338"), exam => <div key={exam.examId} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{exam.examTitle}</h3>
                      <p className="text-sm text-muted-foreground">{exam.subject.nombre}</p>
                    </div>
                    {stryMutAct_9fa48("12341") ? exam.winner === 'current' || <Badge className="bg-green-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        {current.student.nombre} ganó
                      </Badge> : stryMutAct_9fa48("12340") ? false : stryMutAct_9fa48("12339") ? true : (stryCov_9fa48("12339", "12340", "12341"), (stryMutAct_9fa48("12343") ? exam.winner !== 'current' : stryMutAct_9fa48("12342") ? true : (stryCov_9fa48("12342", "12343"), exam.winner === (stryMutAct_9fa48("12344") ? "" : (stryCov_9fa48("12344"), 'current')))) && <Badge className="bg-green-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        {current.student.nombre} ganó
                      </Badge>)}
                    {stryMutAct_9fa48("12347") ? exam.winner === 'other' || <Badge className="bg-blue-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        {other.student.nombre} ganó
                      </Badge> : stryMutAct_9fa48("12346") ? false : stryMutAct_9fa48("12345") ? true : (stryCov_9fa48("12345", "12346", "12347"), (stryMutAct_9fa48("12349") ? exam.winner !== 'other' : stryMutAct_9fa48("12348") ? true : (stryCov_9fa48("12348", "12349"), exam.winner === (stryMutAct_9fa48("12350") ? "" : (stryCov_9fa48("12350"), 'other')))) && <Badge className="bg-blue-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        {other.student.nombre} ganó
                      </Badge>)}
                    {stryMutAct_9fa48("12353") ? exam.winner === 'tie' || <Badge variant="outline">Empate</Badge> : stryMutAct_9fa48("12352") ? false : stryMutAct_9fa48("12351") ? true : (stryCov_9fa48("12351", "12352", "12353"), (stryMutAct_9fa48("12355") ? exam.winner !== 'tie' : stryMutAct_9fa48("12354") ? true : (stryCov_9fa48("12354", "12355"), exam.winner === (stryMutAct_9fa48("12356") ? "" : (stryCov_9fa48("12356"), 'tie')))) && <Badge variant="outline">Empate</Badge>)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">{current.student.nombre}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Resultado:</span>
                          <span className="font-bold">{exam.current.porcentaje.toFixed(1)}%</span>
                        </div>
                        {stryMutAct_9fa48("12359") ? exam.current.puntajePaes || <div className="flex justify-between text-sm">
                            <span>PAES:</span>
                            <span className="font-bold">{exam.current.puntajePaes} pts</span>
                          </div> : stryMutAct_9fa48("12358") ? false : stryMutAct_9fa48("12357") ? true : (stryCov_9fa48("12357", "12358", "12359"), exam.current.puntajePaes && <div className="flex justify-between text-sm">
                            <span>PAES:</span>
                            <span className="font-bold">{exam.current.puntajePaes} pts</span>
                          </div>)}
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Fecha:</span>
                          <span>{formatDate(exam.current.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">{other.student.nombre}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Resultado:</span>
                          <span className="font-bold">{exam.other.porcentaje.toFixed(1)}%</span>
                        </div>
                        {stryMutAct_9fa48("12362") ? exam.other.puntajePaes || <div className="flex justify-between text-sm">
                            <span>PAES:</span>
                            <span className="font-bold">{exam.other.puntajePaes} pts</span>
                          </div> : stryMutAct_9fa48("12361") ? false : stryMutAct_9fa48("12360") ? true : (stryCov_9fa48("12360", "12361", "12362"), exam.other.puntajePaes && <div className="flex justify-between text-sm">
                            <span>PAES:</span>
                            <span className="font-bold">{exam.other.puntajePaes} pts</span>
                          </div>)}
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Fecha:</span>
                          <span>{formatDate(exam.other.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Link href={stryMutAct_9fa48("12363") ? `` : (stryCov_9fa48("12363"), `/exams/${exam.examId}/take`)} className="text-sm text-primary hover:underline">
                      Ver examen →
                    </Link>
                  </div>
                </div>))}
            </div>
          </CardContent>
        </Card>)}

      {stryMutAct_9fa48("12366") ? commonExams.length === 0 || <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Aún no hay exámenes comunes. Realiza exámenes para comparar resultados.
            </p>
          </CardContent>
        </Card> : stryMutAct_9fa48("12365") ? false : stryMutAct_9fa48("12364") ? true : (stryCov_9fa48("12364", "12365", "12366"), (stryMutAct_9fa48("12368") ? commonExams.length !== 0 : stryMutAct_9fa48("12367") ? true : (stryCov_9fa48("12367", "12368"), commonExams.length === 0)) && <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Aún no hay exámenes comunes. Realiza exámenes para comparar resultados.
            </p>
          </CardContent>
        </Card>)}
    </div>;
  }
}