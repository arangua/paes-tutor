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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertTriangle, TrendingUp, TrendingDown, Minus, BookOpen, Target } from 'lucide-react';
import { toast } from 'sonner';
import { HelpIcon } from '@/components/help/help-icon';
import { BackButton } from '@/components/navigation/back-button';
interface ErrorAnalysis {
  summary: {
    totalErrors: number;
    uniqueQuestions: number;
    topicsAffected: number;
    trend: 'mejorando' | 'empeorando' | 'estable';
    recentErrorRate: number;
    olderErrorRate: number;
  };
  topErrors: Array<{
    questionId: string;
    enunciado: string;
    topicName: string | null;
    subjectName: string;
    errorCount: number;
  }>;
  errorsByTopic: Array<{
    topicId: string;
    topicName: string;
    ejeTematico: string;
    subjectName: string;
    subjectCode: string;
    errorCount: number;
  }>;
  errorsBySubject: Array<{
    subjectId: string;
    subjectName: string;
    subjectCode: string;
    errorCount: number;
    topicCount: number;
  }>;
}
export default function ErrorAnalysisPage() {
  if (stryMutAct_9fa48("1753")) {
    {}
  } else {
    stryCov_9fa48("1753");
    const [data, setData] = useState<ErrorAnalysis | null>(null);
    const [loading, setLoading] = useState(stryMutAct_9fa48("1754") ? false : (stryCov_9fa48("1754"), true));
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("1755")) {
        {}
      } else {
        stryCov_9fa48("1755");
        loadErrorAnalysis();
      }
    }, stryMutAct_9fa48("1756") ? ["Stryker was here"] : (stryCov_9fa48("1756"), []));
    async function loadErrorAnalysis() {
      if (stryMutAct_9fa48("1757")) {
        {}
      } else {
        stryCov_9fa48("1757");
        try {
          if (stryMutAct_9fa48("1758")) {
            {}
          } else {
            stryCov_9fa48("1758");
            setLoading(stryMutAct_9fa48("1759") ? false : (stryCov_9fa48("1759"), true));
            const res = await fetch(stryMutAct_9fa48("1760") ? "" : (stryCov_9fa48("1760"), '/api/analytics/errors'));
            if (stryMutAct_9fa48("1763") ? false : stryMutAct_9fa48("1762") ? true : stryMutAct_9fa48("1761") ? res.ok : (stryCov_9fa48("1761", "1762", "1763"), !res.ok)) throw new Error(stryMutAct_9fa48("1764") ? "" : (stryCov_9fa48("1764"), 'Error al cargar análisis de errores'));
            const analysisData = await res.json();
            setData(analysisData);
          }
        } catch (err) {
          if (stryMutAct_9fa48("1765")) {
            {}
          } else {
            stryCov_9fa48("1765");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("1766") ? "" : (stryCov_9fa48("1766"), 'Error desconocido'));
            toast.error(stryMutAct_9fa48("1767") ? "" : (stryCov_9fa48("1767"), 'Error al cargar análisis de errores'));
          }
        } finally {
          if (stryMutAct_9fa48("1768")) {
            {}
          } else {
            stryCov_9fa48("1768");
            setLoading(stryMutAct_9fa48("1769") ? true : (stryCov_9fa48("1769"), false));
          }
        }
      }
    }
    const getTrendIcon = (trend: string) => {
      if (stryMutAct_9fa48("1770")) {
        {}
      } else {
        stryCov_9fa48("1770");
        switch (trend) {
          case stryMutAct_9fa48("1772") ? "" : (stryCov_9fa48("1772"), 'mejorando'):
            if (stryMutAct_9fa48("1771")) {} else {
              stryCov_9fa48("1771");
              return <TrendingDown className="h-5 w-5 text-green-600" />;
            }
          case stryMutAct_9fa48("1774") ? "" : (stryCov_9fa48("1774"), 'empeorando'):
            if (stryMutAct_9fa48("1773")) {} else {
              stryCov_9fa48("1773");
              return <TrendingUp className="h-5 w-5 text-red-600" />;
            }
          default:
            if (stryMutAct_9fa48("1775")) {} else {
              stryCov_9fa48("1775");
              return <Minus className="h-5 w-5 text-yellow-600" />;
            }
        }
      }
    };
    const getTrendColor = (trend: string) => {
      if (stryMutAct_9fa48("1776")) {
        {}
      } else {
        stryCov_9fa48("1776");
        switch (trend) {
          case stryMutAct_9fa48("1778") ? "" : (stryCov_9fa48("1778"), 'mejorando'):
            if (stryMutAct_9fa48("1777")) {} else {
              stryCov_9fa48("1777");
              return stryMutAct_9fa48("1779") ? "" : (stryCov_9fa48("1779"), 'text-green-600');
            }
          case stryMutAct_9fa48("1781") ? "" : (stryCov_9fa48("1781"), 'empeorando'):
            if (stryMutAct_9fa48("1780")) {} else {
              stryCov_9fa48("1780");
              return stryMutAct_9fa48("1782") ? "" : (stryCov_9fa48("1782"), 'text-red-600');
            }
          default:
            if (stryMutAct_9fa48("1783")) {} else {
              stryCov_9fa48("1783");
              return stryMutAct_9fa48("1784") ? "" : (stryCov_9fa48("1784"), 'text-yellow-600');
            }
        }
      }
    };
    if (stryMutAct_9fa48("1786") ? false : stryMutAct_9fa48("1785") ? true : (stryCov_9fa48("1785", "1786"), loading)) {
      if (stryMutAct_9fa48("1787")) {
        {}
      } else {
        stryCov_9fa48("1787");
        return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-red-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" />
            <div className="absolute inset-0 h-12 w-12 mx-auto">
              <div className="h-full w-full border-4 border-orange-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Analizando errores...
            </p>
            <p className="text-sm text-muted-foreground">
              Identificando patrones y áreas de mejora
            </p>
          </div>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("1790") ? error && !data : stryMutAct_9fa48("1789") ? false : stryMutAct_9fa48("1788") ? true : (stryCov_9fa48("1788", "1789", "1790"), error || (stryMutAct_9fa48("1791") ? data : (stryCov_9fa48("1791"), !data)))) {
      if (stryMutAct_9fa48("1792")) {
        {}
      } else {
        stryCov_9fa48("1792");
        return <div className="container mx-auto p-6">
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="relative inline-block">
                <AlertTriangle className="h-20 w-20 mx-auto text-muted-foreground/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-orange-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-destructive">
                  {stryMutAct_9fa48("1795") ? error && 'No se pudo cargar el análisis' : stryMutAct_9fa48("1794") ? false : stryMutAct_9fa48("1793") ? true : (stryCov_9fa48("1793", "1794", "1795"), error || (stryMutAct_9fa48("1796") ? "" : (stryCov_9fa48("1796"), 'No se pudo cargar el análisis')))}
                </h3>
                <p className="text-muted-foreground">
                  Intenta nuevamente o completa algunos exámenes para generar datos de análisis.
                </p>
              </div>
              <div className="pt-4">
                <a href="/exams" className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">
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
    const maxErrorCount = stryMutAct_9fa48("1797") ? Math.min(...data.errorsByTopic.map(t => t.errorCount), ...data.errorsBySubject.map(s => s.errorCount), 1) : (stryCov_9fa48("1797"), Math.max(...data.errorsByTopic.map(stryMutAct_9fa48("1798") ? () => undefined : (stryCov_9fa48("1798"), t => t.errorCount)), ...data.errorsBySubject.map(stryMutAct_9fa48("1799") ? () => undefined : (stryCov_9fa48("1799"), s => s.errorCount)), 1));
    return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <BackButton href="/analytics" label="Volver a Analytics" />
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            Análisis de Errores
          </h1>
          <p className="text-muted-foreground mt-2">
            Identifica patrones y temas problemáticos en tu rendimiento
          </p>
        </div>
        <HelpIcon content="Este análisis te ayuda a identificar tus áreas débiles. Revisa los temas y preguntas donde más fallas para enfocar tu estudio." />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Total de Errores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-900 dark:text-red-100">
              {data.summary.totalErrors}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.summary.uniqueQuestions} preguntas únicas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Temas Afectados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-900 dark:text-orange-100">
              {data.summary.topicsAffected}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tasa de Error Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-900 dark:text-yellow-100">
              {data.summary.recentErrorRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Últimos 30 días</p>
          </CardContent>
        </Card>

        <Card className={stryMutAct_9fa48("1800") ? `` : (stryCov_9fa48("1800"), `border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${(stryMutAct_9fa48("1803") ? data.summary.trend !== 'mejorando' : stryMutAct_9fa48("1802") ? false : stryMutAct_9fa48("1801") ? true : (stryCov_9fa48("1801", "1802", "1803"), data.summary.trend === (stryMutAct_9fa48("1804") ? "" : (stryCov_9fa48("1804"), 'mejorando')))) ? stryMutAct_9fa48("1805") ? "" : (stryCov_9fa48("1805"), 'from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20') : (stryMutAct_9fa48("1808") ? data.summary.trend !== 'empeorando' : stryMutAct_9fa48("1807") ? false : stryMutAct_9fa48("1806") ? true : (stryCov_9fa48("1806", "1807", "1808"), data.summary.trend === (stryMutAct_9fa48("1809") ? "" : (stryCov_9fa48("1809"), 'empeorando')))) ? stryMutAct_9fa48("1810") ? "" : (stryCov_9fa48("1810"), 'from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20') : stryMutAct_9fa48("1811") ? "" : (stryCov_9fa48("1811"), 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20')}`)}>
          <CardHeader className="pb-3">
            <CardTitle className={stryMutAct_9fa48("1812") ? `` : (stryCov_9fa48("1812"), `text-sm font-medium flex items-center gap-2 ${(stryMutAct_9fa48("1815") ? data.summary.trend !== 'mejorando' : stryMutAct_9fa48("1814") ? false : stryMutAct_9fa48("1813") ? true : (stryCov_9fa48("1813", "1814", "1815"), data.summary.trend === (stryMutAct_9fa48("1816") ? "" : (stryCov_9fa48("1816"), 'mejorando')))) ? stryMutAct_9fa48("1817") ? "" : (stryCov_9fa48("1817"), 'text-green-700 dark:text-green-400') : (stryMutAct_9fa48("1820") ? data.summary.trend !== 'empeorando' : stryMutAct_9fa48("1819") ? false : stryMutAct_9fa48("1818") ? true : (stryCov_9fa48("1818", "1819", "1820"), data.summary.trend === (stryMutAct_9fa48("1821") ? "" : (stryCov_9fa48("1821"), 'empeorando')))) ? stryMutAct_9fa48("1822") ? "" : (stryCov_9fa48("1822"), 'text-red-700 dark:text-red-400') : stryMutAct_9fa48("1823") ? "" : (stryCov_9fa48("1823"), 'text-blue-700 dark:text-blue-400')}`)}>
              Tendencia
              {getTrendIcon(data.summary.trend)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={stryMutAct_9fa48("1824") ? `` : (stryCov_9fa48("1824"), `text-4xl font-bold capitalize ${(stryMutAct_9fa48("1827") ? data.summary.trend !== 'mejorando' : stryMutAct_9fa48("1826") ? false : stryMutAct_9fa48("1825") ? true : (stryCov_9fa48("1825", "1826", "1827"), data.summary.trend === (stryMutAct_9fa48("1828") ? "" : (stryCov_9fa48("1828"), 'mejorando')))) ? stryMutAct_9fa48("1829") ? "" : (stryCov_9fa48("1829"), 'text-green-900 dark:text-green-100') : (stryMutAct_9fa48("1832") ? data.summary.trend !== 'empeorando' : stryMutAct_9fa48("1831") ? false : stryMutAct_9fa48("1830") ? true : (stryCov_9fa48("1830", "1831", "1832"), data.summary.trend === (stryMutAct_9fa48("1833") ? "" : (stryCov_9fa48("1833"), 'empeorando')))) ? stryMutAct_9fa48("1834") ? "" : (stryCov_9fa48("1834"), 'text-red-900 dark:text-red-100') : stryMutAct_9fa48("1835") ? "" : (stryCov_9fa48("1835"), 'text-blue-900 dark:text-blue-100')}`)}>
              {data.summary.trend}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(stryMutAct_9fa48("1839") ? data.summary.recentErrorRate >= data.summary.olderErrorRate : stryMutAct_9fa48("1838") ? data.summary.recentErrorRate <= data.summary.olderErrorRate : stryMutAct_9fa48("1837") ? false : stryMutAct_9fa48("1836") ? true : (stryCov_9fa48("1836", "1837", "1838", "1839"), data.summary.recentErrorRate < data.summary.olderErrorRate)) ? stryMutAct_9fa48("1840") ? "" : (stryCov_9fa48("1840"), 'Mejor que antes') : (stryMutAct_9fa48("1844") ? data.summary.recentErrorRate <= data.summary.olderErrorRate : stryMutAct_9fa48("1843") ? data.summary.recentErrorRate >= data.summary.olderErrorRate : stryMutAct_9fa48("1842") ? false : stryMutAct_9fa48("1841") ? true : (stryCov_9fa48("1841", "1842", "1843", "1844"), data.summary.recentErrorRate > data.summary.olderErrorRate)) ? stryMutAct_9fa48("1845") ? "" : (stryCov_9fa48("1845"), 'Peor que antes') : stryMutAct_9fa48("1846") ? "" : (stryCov_9fa48("1846"), 'Sin cambios')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="top-errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="top-errors">Top 10 Errores</TabsTrigger>
          <TabsTrigger value="by-topic">Por Tema</TabsTrigger>
          <TabsTrigger value="by-subject">Por Asignatura</TabsTrigger>
        </TabsList>

        <TabsContent value="top-errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Top 10 Preguntas Más Falladas
              </CardTitle>
              <CardDescription>Estas son las preguntas que has fallado más veces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stryMutAct_9fa48("1849") ? data.topErrors.length !== 0 : stryMutAct_9fa48("1848") ? false : stryMutAct_9fa48("1847") ? true : (stryCov_9fa48("1847", "1848", "1849"), data.topErrors.length === 0)) ? <div className="text-center py-12 space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                      ¡Excelente!
                    </p>
                    <p className="text-muted-foreground">
                      No tienes errores registrados. Sigue así.
                    </p>
                  </div> : data.topErrors.map(stryMutAct_9fa48("1850") ? () => undefined : (stryCov_9fa48("1850"), (error, index) => <div key={error.questionId} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-all duration-300 border-l-4 border-l-red-500">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-red-700 dark:text-red-400">
                          {stryMutAct_9fa48("1851") ? index - 1 : (stryCov_9fa48("1851"), index + 1)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{error.subjectName}</Badge>
                          {stryMutAct_9fa48("1854") ? error.topicName || <Badge variant="secondary">{error.topicName}</Badge> : stryMutAct_9fa48("1853") ? false : stryMutAct_9fa48("1852") ? true : (stryCov_9fa48("1852", "1853", "1854"), error.topicName && <Badge variant="secondary">{error.topicName}</Badge>)}
                          <Badge variant="destructive" className="ml-auto">
                            {error.errorCount} vez{(stryMutAct_9fa48("1857") ? error.errorCount === 1 : stryMutAct_9fa48("1856") ? false : stryMutAct_9fa48("1855") ? true : (stryCov_9fa48("1855", "1856", "1857"), error.errorCount !== 1)) ? stryMutAct_9fa48("1858") ? "" : (stryCov_9fa48("1858"), 'es') : stryMutAct_9fa48("1859") ? "Stryker was here!" : (stryCov_9fa48("1859"), '')}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed">{error.enunciado}</p>
                      </div>
                    </div>))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-topic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Errores por Tema
              </CardTitle>
              <CardDescription>Distribución de errores agrupados por tema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stryMutAct_9fa48("1862") ? data.errorsByTopic.length !== 0 : stryMutAct_9fa48("1861") ? false : stryMutAct_9fa48("1860") ? true : (stryCov_9fa48("1860", "1861", "1862"), data.errorsByTopic.length === 0)) ? <div className="text-center py-12 space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      No hay errores por tema para mostrar
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Completa más exámenes para ver estadísticas detalladas
                    </p>
                  </div> : data.errorsByTopic.map(stryMutAct_9fa48("1863") ? () => undefined : (stryCov_9fa48("1863"), topic => <div key={topic.topicId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{topic.topicName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {topic.subjectName} • {topic.ejeTematico}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {topic.errorCount} error{(stryMutAct_9fa48("1866") ? topic.errorCount === 1 : stryMutAct_9fa48("1865") ? false : stryMutAct_9fa48("1864") ? true : (stryCov_9fa48("1864", "1865", "1866"), topic.errorCount !== 1)) ? stryMutAct_9fa48("1867") ? "" : (stryCov_9fa48("1867"), 'es') : stryMutAct_9fa48("1868") ? "Stryker was here!" : (stryCov_9fa48("1868"), '')}
                        </Badge>
                      </div>
                      <Progress value={stryMutAct_9fa48("1869") ? topic.errorCount / maxErrorCount / 100 : (stryCov_9fa48("1869"), (stryMutAct_9fa48("1870") ? topic.errorCount * maxErrorCount : (stryCov_9fa48("1870"), topic.errorCount / maxErrorCount)) * 100)} className="h-2" />
                    </div>))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-subject" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Errores por Asignatura
              </CardTitle>
              <CardDescription>Distribución de errores agrupados por asignatura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stryMutAct_9fa48("1873") ? data.errorsBySubject.length !== 0 : stryMutAct_9fa48("1872") ? false : stryMutAct_9fa48("1871") ? true : (stryCov_9fa48("1871", "1872", "1873"), data.errorsBySubject.length === 0)) ? <div className="text-center py-12 space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      No hay errores por asignatura para mostrar
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Completa más exámenes para ver estadísticas detalladas
                    </p>
                  </div> : data.errorsBySubject.map(stryMutAct_9fa48("1874") ? () => undefined : (stryCov_9fa48("1874"), subject => <div key={subject.subjectId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{subject.subjectName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subject.topicCount} tema{(stryMutAct_9fa48("1877") ? subject.topicCount === 1 : stryMutAct_9fa48("1876") ? false : stryMutAct_9fa48("1875") ? true : (stryCov_9fa48("1875", "1876", "1877"), subject.topicCount !== 1)) ? stryMutAct_9fa48("1878") ? "" : (stryCov_9fa48("1878"), 's') : stryMutAct_9fa48("1879") ? "Stryker was here!" : (stryCov_9fa48("1879"), '')} afectado
                            {(stryMutAct_9fa48("1882") ? subject.topicCount === 1 : stryMutAct_9fa48("1881") ? false : stryMutAct_9fa48("1880") ? true : (stryCov_9fa48("1880", "1881", "1882"), subject.topicCount !== 1)) ? stryMutAct_9fa48("1883") ? "" : (stryCov_9fa48("1883"), 's') : stryMutAct_9fa48("1884") ? "Stryker was here!" : (stryCov_9fa48("1884"), '')}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {subject.errorCount} error{(stryMutAct_9fa48("1887") ? subject.errorCount === 1 : stryMutAct_9fa48("1886") ? false : stryMutAct_9fa48("1885") ? true : (stryCov_9fa48("1885", "1886", "1887"), subject.errorCount !== 1)) ? stryMutAct_9fa48("1888") ? "" : (stryCov_9fa48("1888"), 'es') : stryMutAct_9fa48("1889") ? "Stryker was here!" : (stryCov_9fa48("1889"), '')}
                        </Badge>
                      </div>
                      <Progress value={stryMutAct_9fa48("1890") ? subject.errorCount / maxErrorCount / 100 : (stryCov_9fa48("1890"), (stryMutAct_9fa48("1891") ? subject.errorCount * maxErrorCount : (stryCov_9fa48("1891"), subject.errorCount / maxErrorCount)) * 100)} className="h-2" />
                    </div>))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
  }
}