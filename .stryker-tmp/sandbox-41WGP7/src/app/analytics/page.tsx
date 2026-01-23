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
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { TrendChart } from '@/components/analytics/trend-chart';
import { TrendingUp, TrendingDown, Minus, Target, AlertCircle, Loader2, BarChart3, Award, ArrowLeft, CheckCircle2, XCircle, Printer, AlertTriangle, Clock } from 'lucide-react';
import { ExportButton } from '@/components/export/export-button';
import { exportAnalyticsToPDF, exportAnalyticsToExcel, type AnalyticsData } from '@/lib/export-utils';
import { toast } from 'sonner';
import Link from 'next/link';
interface TrendData {
  date: string;
  percentage: number;
  examTitle: string;
  subjectName: string;
}
interface StrengthWeakness {
  topic: string;
  subject: string;
  percentage: number;
  totalQuestions: number;
  category: 'strength' | 'weakness' | 'average';
}
interface PAESPrediction {
  predictedScore: number;
  confidence: 'high' | 'medium' | 'low';
  factors: string[];
  estimatedRange: {
    min: number;
    max: number;
  };
}
interface ComparisonData {
  studentAverage: number;
  overallAverage: number;
  percentile: number;
  comparison: 'above' | 'below' | 'equal';
}
interface SubjectBreakdown {
  subject: string;
  average: number;
  trend: 'improving' | 'declining' | 'stable';
  attempts: number;
}
interface AdvancedAnalytics {
  trends: TrendData[];
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
  paesPrediction: PAESPrediction | null;
  comparison: ComparisonData | null;
  subjectBreakdown: SubjectBreakdown[];
}
export default function AnalyticsPage() {
  if (stryMutAct_9fa48("1892")) {
    {}
  } else {
    stryCov_9fa48("1892");
    const router = useRouter();
    const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("1893") ? false : (stryCov_9fa48("1893"), true));
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("1894")) {
        {}
      } else {
        stryCov_9fa48("1894");
        async function loadAnalytics() {
          if (stryMutAct_9fa48("1895")) {
            {}
          } else {
            stryCov_9fa48("1895");
            try {
              if (stryMutAct_9fa48("1896")) {
                {}
              } else {
                stryCov_9fa48("1896");
                setIsLoading(stryMutAct_9fa48("1897") ? false : (stryCov_9fa48("1897"), true));
                setError(null);
                const res = await fetch(stryMutAct_9fa48("1898") ? "" : (stryCov_9fa48("1898"), '/api/analytics'));
                if (stryMutAct_9fa48("1901") ? res.status !== 401 : stryMutAct_9fa48("1900") ? false : stryMutAct_9fa48("1899") ? true : (stryCov_9fa48("1899", "1900", "1901"), res.status === 401)) {
                  if (stryMutAct_9fa48("1902")) {
                    {}
                  } else {
                    stryCov_9fa48("1902");
                    router.push(stryMutAct_9fa48("1903") ? "" : (stryCov_9fa48("1903"), '/auth/signin?callbackUrl=/analytics'));
                    return;
                  }
                }
                if (stryMutAct_9fa48("1906") ? false : stryMutAct_9fa48("1905") ? true : stryMutAct_9fa48("1904") ? res.ok : (stryCov_9fa48("1904", "1905", "1906"), !res.ok)) {
                  if (stryMutAct_9fa48("1907")) {
                    {}
                  } else {
                    stryCov_9fa48("1907");
                    throw new Error(stryMutAct_9fa48("1908") ? "" : (stryCov_9fa48("1908"), 'Error al cargar estadísticas'));
                  }
                }
                const data = await res.json();
                setAnalytics(data);
              }
            } catch (err) {
              if (stryMutAct_9fa48("1909")) {
                {}
              } else {
                stryCov_9fa48("1909");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("1910") ? "" : (stryCov_9fa48("1910"), 'Error desconocido'));
              }
            } finally {
              if (stryMutAct_9fa48("1911")) {
                {}
              } else {
                stryCov_9fa48("1911");
                setIsLoading(stryMutAct_9fa48("1912") ? true : (stryCov_9fa48("1912"), false));
              }
            }
          }
        }
        loadAnalytics();
      }
    }, stryMutAct_9fa48("1913") ? [] : (stryCov_9fa48("1913"), [router]));
    if (stryMutAct_9fa48("1915") ? false : stryMutAct_9fa48("1914") ? true : (stryCov_9fa48("1914", "1915"), isLoading)) {
      if (stryMutAct_9fa48("1916")) {
        {}
      } else {
        stryCov_9fa48("1916");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("1919") ? error && !analytics : stryMutAct_9fa48("1918") ? false : stryMutAct_9fa48("1917") ? true : (stryCov_9fa48("1917", "1918", "1919"), error || (stryMutAct_9fa48("1920") ? analytics : (stryCov_9fa48("1920"), !analytics)))) {
      if (stryMutAct_9fa48("1921")) {
        {}
      } else {
        stryCov_9fa48("1921");
        return <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{stryMutAct_9fa48("1924") ? error && 'No se pudieron cargar las estadísticas' : stryMutAct_9fa48("1923") ? false : stryMutAct_9fa48("1922") ? true : (stryCov_9fa48("1922", "1923", "1924"), error || (stryMutAct_9fa48("1925") ? "" : (stryCov_9fa48("1925"), 'No se pudieron cargar las estadísticas')))}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={stryMutAct_9fa48("1926") ? () => undefined : (stryCov_9fa48("1926"), () => router.push(stryMutAct_9fa48("1927") ? "" : (stryCov_9fa48("1927"), '/dashboard')))}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>;
      }
    }
    const handlePrint = () => {
      if (stryMutAct_9fa48("1928")) {
        {}
      } else {
        stryCov_9fa48("1928");
        window.print();
      }
    };
    const prepareExportData = (): AnalyticsData | null => {
      if (stryMutAct_9fa48("1929")) {
        {}
      } else {
        stryCov_9fa48("1929");
        if (stryMutAct_9fa48("1932") ? false : stryMutAct_9fa48("1931") ? true : stryMutAct_9fa48("1930") ? analytics : (stryCov_9fa48("1930", "1931", "1932"), !analytics)) return null;
        return stryMutAct_9fa48("1933") ? {} : (stryCov_9fa48("1933"), {
          studentAverage: stryMutAct_9fa48("1936") ? analytics.comparison?.studentAverage && 0 : stryMutAct_9fa48("1935") ? false : stryMutAct_9fa48("1934") ? true : (stryCov_9fa48("1934", "1935", "1936"), (stryMutAct_9fa48("1937") ? analytics.comparison.studentAverage : (stryCov_9fa48("1937"), analytics.comparison?.studentAverage)) || 0),
          overallAverage: stryMutAct_9fa48("1940") ? analytics.comparison?.overallAverage && 0 : stryMutAct_9fa48("1939") ? false : stryMutAct_9fa48("1938") ? true : (stryCov_9fa48("1938", "1939", "1940"), (stryMutAct_9fa48("1941") ? analytics.comparison.overallAverage : (stryCov_9fa48("1941"), analytics.comparison?.overallAverage)) || 0),
          percentile: stryMutAct_9fa48("1944") ? analytics.comparison?.percentile && 0 : stryMutAct_9fa48("1943") ? false : stryMutAct_9fa48("1942") ? true : (stryCov_9fa48("1942", "1943", "1944"), (stryMutAct_9fa48("1945") ? analytics.comparison.percentile : (stryCov_9fa48("1945"), analytics.comparison?.percentile)) || 0),
          paesPrediction: analytics.paesPrediction ? stryMutAct_9fa48("1946") ? {} : (stryCov_9fa48("1946"), {
            predictedScore: analytics.paesPrediction.predictedScore,
            confidence: analytics.paesPrediction.confidence,
            estimatedRange: analytics.paesPrediction.estimatedRange
          }) : stryMutAct_9fa48("1947") ? {} : (stryCov_9fa48("1947"), {
            predictedScore: 0,
            confidence: stryMutAct_9fa48("1948") ? "" : (stryCov_9fa48("1948"), 'low'),
            estimatedRange: stryMutAct_9fa48("1949") ? {} : (stryCov_9fa48("1949"), {
              min: 0,
              max: 0
            })
          }),
          trends: analytics.trends.map(stryMutAct_9fa48("1950") ? () => undefined : (stryCov_9fa48("1950"), t => stryMutAct_9fa48("1951") ? {} : (stryCov_9fa48("1951"), {
            date: t.date,
            percentage: t.percentage,
            examTitle: t.examTitle
          }))),
          strengths: analytics.strengths.map(stryMutAct_9fa48("1952") ? () => undefined : (stryCov_9fa48("1952"), s => stryMutAct_9fa48("1953") ? {} : (stryCov_9fa48("1953"), {
            topic: s.topic,
            percentage: s.percentage
          }))),
          weaknesses: analytics.weaknesses.map(stryMutAct_9fa48("1954") ? () => undefined : (stryCov_9fa48("1954"), w => stryMutAct_9fa48("1955") ? {} : (stryCov_9fa48("1955"), {
            topic: w.topic,
            percentage: w.percentage
          }))),
          subjectBreakdown: analytics.subjectBreakdown.map(stryMutAct_9fa48("1956") ? () => undefined : (stryCov_9fa48("1956"), s => stryMutAct_9fa48("1957") ? {} : (stryCov_9fa48("1957"), {
            subject: s.subject,
            average: s.average,
            attempts: s.attempts,
            trend: s.trend
          })))
        });
      }
    };
    const handleExportPDF = async () => {
      if (stryMutAct_9fa48("1958")) {
        {}
      } else {
        stryCov_9fa48("1958");
        const data = prepareExportData();
        if (stryMutAct_9fa48("1961") ? false : stryMutAct_9fa48("1960") ? true : stryMutAct_9fa48("1959") ? data : (stryCov_9fa48("1959", "1960", "1961"), !data)) {
          if (stryMutAct_9fa48("1962")) {
            {}
          } else {
            stryCov_9fa48("1962");
            toast.error(stryMutAct_9fa48("1963") ? "" : (stryCov_9fa48("1963"), 'No hay datos disponibles'), stryMutAct_9fa48("1964") ? {} : (stryCov_9fa48("1964"), {
              description: stryMutAct_9fa48("1965") ? "" : (stryCov_9fa48("1965"), 'No se encontraron estadísticas para exportar. Completa más exámenes para generar datos.')
            }));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("1966")) {
            {}
          } else {
            stryCov_9fa48("1966");
            toast.loading(stryMutAct_9fa48("1967") ? "" : (stryCov_9fa48("1967"), 'Exportando estadísticas a PDF...'), stryMutAct_9fa48("1968") ? {} : (stryCov_9fa48("1968"), {
              id: stryMutAct_9fa48("1969") ? "" : (stryCov_9fa48("1969"), 'export-analytics-pdf')
            }));
            await exportAnalyticsToPDF(data);
            toast.success(stryMutAct_9fa48("1970") ? "" : (stryCov_9fa48("1970"), 'Exportación exitosa'), stryMutAct_9fa48("1971") ? {} : (stryCov_9fa48("1971"), {
              id: stryMutAct_9fa48("1972") ? "" : (stryCov_9fa48("1972"), 'export-analytics-pdf'),
              description: stryMutAct_9fa48("1973") ? "" : (stryCov_9fa48("1973"), 'El archivo PDF con tus estadísticas se ha descargado correctamente.')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1974")) {
            {}
          } else {
            stryCov_9fa48("1974");
            toast.error(stryMutAct_9fa48("1975") ? "" : (stryCov_9fa48("1975"), 'Error al exportar'), stryMutAct_9fa48("1976") ? {} : (stryCov_9fa48("1976"), {
              id: stryMutAct_9fa48("1977") ? "" : (stryCov_9fa48("1977"), 'export-analytics-pdf'),
              description: error instanceof Error ? error.message : stryMutAct_9fa48("1978") ? "" : (stryCov_9fa48("1978"), 'No se pudo exportar el archivo PDF. Por favor, intenta nuevamente.')
            }));
          }
        }
      }
    };
    const handleExportExcel = async () => {
      if (stryMutAct_9fa48("1979")) {
        {}
      } else {
        stryCov_9fa48("1979");
        const data = prepareExportData();
        if (stryMutAct_9fa48("1982") ? false : stryMutAct_9fa48("1981") ? true : stryMutAct_9fa48("1980") ? data : (stryCov_9fa48("1980", "1981", "1982"), !data)) {
          if (stryMutAct_9fa48("1983")) {
            {}
          } else {
            stryCov_9fa48("1983");
            toast.error(stryMutAct_9fa48("1984") ? "" : (stryCov_9fa48("1984"), 'No hay datos disponibles'), stryMutAct_9fa48("1985") ? {} : (stryCov_9fa48("1985"), {
              description: stryMutAct_9fa48("1986") ? "" : (stryCov_9fa48("1986"), 'No se encontraron estadísticas para exportar. Completa más exámenes para generar datos.')
            }));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("1987")) {
            {}
          } else {
            stryCov_9fa48("1987");
            toast.loading(stryMutAct_9fa48("1988") ? "" : (stryCov_9fa48("1988"), 'Exportando estadísticas a Excel...'), stryMutAct_9fa48("1989") ? {} : (stryCov_9fa48("1989"), {
              id: stryMutAct_9fa48("1990") ? "" : (stryCov_9fa48("1990"), 'export-analytics-excel')
            }));
            await exportAnalyticsToExcel(data);
            toast.success(stryMutAct_9fa48("1991") ? "" : (stryCov_9fa48("1991"), 'Exportación exitosa'), stryMutAct_9fa48("1992") ? {} : (stryCov_9fa48("1992"), {
              id: stryMutAct_9fa48("1993") ? "" : (stryCov_9fa48("1993"), 'export-analytics-excel'),
              description: stryMutAct_9fa48("1994") ? "" : (stryCov_9fa48("1994"), 'El archivo Excel con tus estadísticas se ha descargado correctamente.')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("1995")) {
            {}
          } else {
            stryCov_9fa48("1995");
            toast.error(stryMutAct_9fa48("1996") ? "" : (stryCov_9fa48("1996"), 'Error al exportar'), stryMutAct_9fa48("1997") ? {} : (stryCov_9fa48("1997"), {
              id: stryMutAct_9fa48("1998") ? "" : (stryCov_9fa48("1998"), 'export-analytics-excel'),
              description: error instanceof Error ? error.message : stryMutAct_9fa48("1999") ? "" : (stryCov_9fa48("1999"), 'No se pudo exportar el archivo Excel. Por favor, intenta nuevamente.')
            }));
          }
        }
      }
    };
    const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
      if (stryMutAct_9fa48("2000")) {
        {}
      } else {
        stryCov_9fa48("2000");
        switch (trend) {
          case stryMutAct_9fa48("2002") ? "" : (stryCov_9fa48("2002"), 'improving'):
            if (stryMutAct_9fa48("2001")) {} else {
              stryCov_9fa48("2001");
              return <TrendingUp className="h-4 w-4 text-green-600" />;
            }
          case stryMutAct_9fa48("2004") ? "" : (stryCov_9fa48("2004"), 'declining'):
            if (stryMutAct_9fa48("2003")) {} else {
              stryCov_9fa48("2003");
              return <TrendingDown className="h-4 w-4 text-red-600" />;
            }
          default:
            if (stryMutAct_9fa48("2005")) {} else {
              stryCov_9fa48("2005");
              return <Minus className="h-4 w-4 text-gray-600" />;
            }
        }
      }
    };
    const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
      if (stryMutAct_9fa48("2006")) {
        {}
      } else {
        stryCov_9fa48("2006");
        switch (confidence) {
          case stryMutAct_9fa48("2008") ? "" : (stryCov_9fa48("2008"), 'high'):
            if (stryMutAct_9fa48("2007")) {} else {
              stryCov_9fa48("2007");
              return stryMutAct_9fa48("2009") ? "" : (stryCov_9fa48("2009"), 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400');
            }
          case stryMutAct_9fa48("2011") ? "" : (stryCov_9fa48("2011"), 'medium'):
            if (stryMutAct_9fa48("2010")) {} else {
              stryCov_9fa48("2010");
              return stryMutAct_9fa48("2012") ? "" : (stryCov_9fa48("2012"), 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400');
            }
          default:
            if (stryMutAct_9fa48("2013")) {} else {
              stryCov_9fa48("2013");
              return stryMutAct_9fa48("2014") ? "" : (stryCov_9fa48("2014"), 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400');
            }
        }
      }
    };
    return <>
      <style jsx global>{stryMutAct_9fa48("2015") ? `` : (stryCov_9fa48("2015"), `
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
          .print-avoid-break {
            page-break-inside: avoid;
          }
        }
      `)}</style>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-6 no-print">
          <Breadcrumbs items={stryMutAct_9fa48("2016") ? [] : (stryCov_9fa48("2016"), [stryMutAct_9fa48("2017") ? {} : (stryCov_9fa48("2017"), {
            label: stryMutAct_9fa48("2018") ? "" : (stryCov_9fa48("2018"), 'Inicio'),
            href: stryMutAct_9fa48("2019") ? "" : (stryCov_9fa48("2019"), '/')
          }), stryMutAct_9fa48("2020") ? {} : (stryCov_9fa48("2020"), {
            label: stryMutAct_9fa48("2021") ? "" : (stryCov_9fa48("2021"), 'Dashboard'),
            href: stryMutAct_9fa48("2022") ? "" : (stryCov_9fa48("2022"), '/dashboard')
          }), stryMutAct_9fa48("2023") ? {} : (stryCov_9fa48("2023"), {
            label: stryMutAct_9fa48("2024") ? "" : (stryCov_9fa48("2024"), 'Estadísticas Avanzadas')
          })])} />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 no-print">
          <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <div>
                    <h3 className="font-semibold">Análisis de Errores</h3>
                    <p className="text-sm text-muted-foreground">
                      Identifica patrones y temas problemáticos
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/analytics/errors">
                    Ver
                    <AlertTriangle className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Comparación Anónima</h3>
                    <p className="text-sm text-muted-foreground">
                      Compara tu rendimiento con otros estudiantes
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/analytics/comparison">
                    Ver
                    <BarChart3 className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">Estadísticas de Tiempo</h3>
                    <p className="text-sm text-muted-foreground">
                      Tiempo promedio por tipo de pregunta
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/analytics/time">
                    Ver
                    <Clock className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 no-print">
              <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("2025") ? () => undefined : (stryCov_9fa48("2025"), () => router.back())}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Estadísticas Avanzadas</h1>
            <p className="text-muted-foreground">
              Análisis profundo de tu rendimiento y predicciones
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="no-print">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <ExportButton onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} variant="outline" />
          </div>
        </div>

        {/* Comparación con Promedio */}
        {stryMutAct_9fa48("2028") ? analytics.comparison || <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Comparación con Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Tu Promedio</p>
                  <p className="text-3xl font-bold">
                    {analytics.comparison.studentAverage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Promedio General</p>
                  <p className="text-3xl font-bold text-muted-foreground">
                    {analytics.comparison.overallAverage}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Percentil</p>
                  <p className="text-3xl font-bold">
                    {analytics.comparison.percentile}
                    <span className="text-lg text-muted-foreground">º</span>
                  </p>
                  <Badge variant={analytics.comparison.comparison === 'above' ? 'default' : analytics.comparison.comparison === 'below' ? 'destructive' : 'secondary'} className="mt-2">
                    {analytics.comparison.comparison === 'above' ? 'Por encima del promedio' : analytics.comparison.comparison === 'below' ? 'Por debajo del promedio' : 'En el promedio'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card> : stryMutAct_9fa48("2027") ? false : stryMutAct_9fa48("2026") ? true : (stryCov_9fa48("2026", "2027", "2028"), analytics.comparison && <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Comparación con Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Tu Promedio</p>
                  <p className="text-3xl font-bold">
                    {analytics.comparison.studentAverage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Promedio General</p>
                  <p className="text-3xl font-bold text-muted-foreground">
                    {analytics.comparison.overallAverage}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Percentil</p>
                  <p className="text-3xl font-bold">
                    {analytics.comparison.percentile}
                    <span className="text-lg text-muted-foreground">º</span>
                  </p>
                  <Badge variant={(stryMutAct_9fa48("2031") ? analytics.comparison.comparison !== 'above' : stryMutAct_9fa48("2030") ? false : stryMutAct_9fa48("2029") ? true : (stryCov_9fa48("2029", "2030", "2031"), analytics.comparison.comparison === (stryMutAct_9fa48("2032") ? "" : (stryCov_9fa48("2032"), 'above')))) ? stryMutAct_9fa48("2033") ? "" : (stryCov_9fa48("2033"), 'default') : (stryMutAct_9fa48("2036") ? analytics.comparison.comparison !== 'below' : stryMutAct_9fa48("2035") ? false : stryMutAct_9fa48("2034") ? true : (stryCov_9fa48("2034", "2035", "2036"), analytics.comparison.comparison === (stryMutAct_9fa48("2037") ? "" : (stryCov_9fa48("2037"), 'below')))) ? stryMutAct_9fa48("2038") ? "" : (stryCov_9fa48("2038"), 'destructive') : stryMutAct_9fa48("2039") ? "" : (stryCov_9fa48("2039"), 'secondary')} className="mt-2">
                    {(stryMutAct_9fa48("2042") ? analytics.comparison.comparison !== 'above' : stryMutAct_9fa48("2041") ? false : stryMutAct_9fa48("2040") ? true : (stryCov_9fa48("2040", "2041", "2042"), analytics.comparison.comparison === (stryMutAct_9fa48("2043") ? "" : (stryCov_9fa48("2043"), 'above')))) ? stryMutAct_9fa48("2044") ? "" : (stryCov_9fa48("2044"), 'Por encima del promedio') : (stryMutAct_9fa48("2047") ? analytics.comparison.comparison !== 'below' : stryMutAct_9fa48("2046") ? false : stryMutAct_9fa48("2045") ? true : (stryCov_9fa48("2045", "2046", "2047"), analytics.comparison.comparison === (stryMutAct_9fa48("2048") ? "" : (stryCov_9fa48("2048"), 'below')))) ? stryMutAct_9fa48("2049") ? "" : (stryCov_9fa48("2049"), 'Por debajo del promedio') : stryMutAct_9fa48("2050") ? "" : (stryCov_9fa48("2050"), 'En el promedio')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>)}

        {/* Gráfico de Tendencias */}
        <div className="mb-6">
          <TrendChart data={analytics.trends} />
        </div>

        {/* Predicción PAES */}
        {stryMutAct_9fa48("2053") ? analytics.paesPrediction || <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Predicción de Puntaje PAES
              </CardTitle>
              <CardDescription>Estimación basada en tu rendimiento histórico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Puntaje Predicho</p>
                  <p className="text-5xl font-bold mb-2">
                    {analytics.paesPrediction.predictedScore}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rango estimado: {analytics.paesPrediction.estimatedRange.min} -{' '}
                    {analytics.paesPrediction.estimatedRange.max} puntos
                  </p>
                  <Badge className={`mt-3 ${getConfidenceColor(analytics.paesPrediction.confidence)}`}>
                    Confianza:{' '}
                    {analytics.paesPrediction.confidence === 'high' ? 'Alta' : analytics.paesPrediction.confidence === 'medium' ? 'Media' : 'Baja'}
                  </Badge>
                </div>

                {analytics.paesPrediction.factors.length > 0 && <div>
                    <p className="text-sm font-medium mb-2">Factores Considerados:</p>
                    <ul className="space-y-1">
                      {analytics.paesPrediction.factors.map((factor, idx) => <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {factor}
                        </li>)}
                    </ul>
                  </div>}
              </div>
            </CardContent>
          </Card> : stryMutAct_9fa48("2052") ? false : stryMutAct_9fa48("2051") ? true : (stryCov_9fa48("2051", "2052", "2053"), analytics.paesPrediction && <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Predicción de Puntaje PAES
              </CardTitle>
              <CardDescription>Estimación basada en tu rendimiento histórico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Puntaje Predicho</p>
                  <p className="text-5xl font-bold mb-2">
                    {analytics.paesPrediction.predictedScore}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rango estimado: {analytics.paesPrediction.estimatedRange.min} -{stryMutAct_9fa48("2054") ? "" : (stryCov_9fa48("2054"), ' ')}
                    {analytics.paesPrediction.estimatedRange.max} puntos
                  </p>
                  <Badge className={stryMutAct_9fa48("2055") ? `` : (stryCov_9fa48("2055"), `mt-3 ${getConfidenceColor(analytics.paesPrediction.confidence)}`)}>
                    Confianza:{stryMutAct_9fa48("2056") ? "" : (stryCov_9fa48("2056"), ' ')}
                    {(stryMutAct_9fa48("2059") ? analytics.paesPrediction.confidence !== 'high' : stryMutAct_9fa48("2058") ? false : stryMutAct_9fa48("2057") ? true : (stryCov_9fa48("2057", "2058", "2059"), analytics.paesPrediction.confidence === (stryMutAct_9fa48("2060") ? "" : (stryCov_9fa48("2060"), 'high')))) ? stryMutAct_9fa48("2061") ? "" : (stryCov_9fa48("2061"), 'Alta') : (stryMutAct_9fa48("2064") ? analytics.paesPrediction.confidence !== 'medium' : stryMutAct_9fa48("2063") ? false : stryMutAct_9fa48("2062") ? true : (stryCov_9fa48("2062", "2063", "2064"), analytics.paesPrediction.confidence === (stryMutAct_9fa48("2065") ? "" : (stryCov_9fa48("2065"), 'medium')))) ? stryMutAct_9fa48("2066") ? "" : (stryCov_9fa48("2066"), 'Media') : stryMutAct_9fa48("2067") ? "" : (stryCov_9fa48("2067"), 'Baja')}
                  </Badge>
                </div>

                {stryMutAct_9fa48("2070") ? analytics.paesPrediction.factors.length > 0 || <div>
                    <p className="text-sm font-medium mb-2">Factores Considerados:</p>
                    <ul className="space-y-1">
                      {analytics.paesPrediction.factors.map((factor, idx) => <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {factor}
                        </li>)}
                    </ul>
                  </div> : stryMutAct_9fa48("2069") ? false : stryMutAct_9fa48("2068") ? true : (stryCov_9fa48("2068", "2069", "2070"), (stryMutAct_9fa48("2073") ? analytics.paesPrediction.factors.length <= 0 : stryMutAct_9fa48("2072") ? analytics.paesPrediction.factors.length >= 0 : stryMutAct_9fa48("2071") ? true : (stryCov_9fa48("2071", "2072", "2073"), analytics.paesPrediction.factors.length > 0)) && <div>
                    <p className="text-sm font-medium mb-2">Factores Considerados:</p>
                    <ul className="space-y-1">
                      {analytics.paesPrediction.factors.map(stryMutAct_9fa48("2074") ? () => undefined : (stryCov_9fa48("2074"), (factor, idx) => <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {factor}
                        </li>))}
                    </ul>
                  </div>)}
              </div>
            </CardContent>
          </Card>)}

        {/* Fortalezas y Debilidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Fortalezas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Fortalezas
              </CardTitle>
              <CardDescription>Temas donde tienes mejor rendimiento (≥70%)</CardDescription>
            </CardHeader>
            <CardContent>
              {(stryMutAct_9fa48("2077") ? analytics.strengths.length !== 0 : stryMutAct_9fa48("2076") ? false : stryMutAct_9fa48("2075") ? true : (stryCov_9fa48("2075", "2076", "2077"), analytics.strengths.length === 0)) ? <p className="text-sm text-muted-foreground text-center py-4">
                  Aún no hay fortalezas identificadas
                </p> : <div className="space-y-3">
                  {stryMutAct_9fa48("2078") ? analytics.strengths.map((strength, idx) => <div key={idx} className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{strength.topic}</p>
                          <p className="text-xs text-muted-foreground">{strength.subject}</p>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          {strength.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {strength.totalQuestions} preguntas respondidas
                      </p>
                    </div>) : (stryCov_9fa48("2078"), analytics.strengths.slice(0, 5).map(stryMutAct_9fa48("2079") ? () => undefined : (stryCov_9fa48("2079"), (strength, idx) => <div key={idx} className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{strength.topic}</p>
                          <p className="text-xs text-muted-foreground">{strength.subject}</p>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          {strength.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {strength.totalQuestions} preguntas respondidas
                      </p>
                    </div>)))}
                </div>}
            </CardContent>
          </Card>

          {/* Debilidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Debilidades
              </CardTitle>
              <CardDescription>Temas que necesitas reforzar (&lt;50%)</CardDescription>
            </CardHeader>
            <CardContent>
              {(stryMutAct_9fa48("2082") ? analytics.weaknesses.length !== 0 : stryMutAct_9fa48("2081") ? false : stryMutAct_9fa48("2080") ? true : (stryCov_9fa48("2080", "2081", "2082"), analytics.weaknesses.length === 0)) ? <p className="text-sm text-muted-foreground text-center py-4">
                  ¡Excelente! No hay debilidades identificadas
                </p> : <div className="space-y-3">
                  {stryMutAct_9fa48("2083") ? analytics.weaknesses.map((weakness, idx) => <div key={idx} className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{weakness.topic}</p>
                          <p className="text-xs text-muted-foreground">{weakness.subject}</p>
                        </div>
                        <Badge variant="destructive">{weakness.percentage.toFixed(1)}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {weakness.totalQuestions} preguntas respondidas
                      </p>
                    </div>) : (stryCov_9fa48("2083"), analytics.weaknesses.slice(0, 5).map(stryMutAct_9fa48("2084") ? () => undefined : (stryCov_9fa48("2084"), (weakness, idx) => <div key={idx} className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{weakness.topic}</p>
                          <p className="text-xs text-muted-foreground">{weakness.subject}</p>
                        </div>
                        <Badge variant="destructive">{weakness.percentage.toFixed(1)}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {weakness.totalQuestions} preguntas respondidas
                      </p>
                    </div>)))}
                </div>}
            </CardContent>
          </Card>
        </div>

        {/* Desglose por Asignatura */}
        {stryMutAct_9fa48("2087") ? analytics.subjectBreakdown.length > 0 || <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Desglose por Asignatura
              </CardTitle>
              <CardDescription>Rendimiento y tendencias por materia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.subjectBreakdown.map((subject, idx) => <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{subject.subject}</h3>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{subject.average}%</p>
                        <p className="text-xs text-muted-foreground">
                          {subject.attempts} intento{subject.attempts !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant={subject.trend === 'improving' ? 'default' : subject.trend === 'declining' ? 'destructive' : 'secondary'} className="text-xs">
                      {subject.trend === 'improving' ? 'Mejorando' : subject.trend === 'declining' ? 'En declive' : 'Estable'}
                    </Badge>
                  </div>)}
              </div>
            </CardContent>
          </Card> : stryMutAct_9fa48("2086") ? false : stryMutAct_9fa48("2085") ? true : (stryCov_9fa48("2085", "2086", "2087"), (stryMutAct_9fa48("2090") ? analytics.subjectBreakdown.length <= 0 : stryMutAct_9fa48("2089") ? analytics.subjectBreakdown.length >= 0 : stryMutAct_9fa48("2088") ? true : (stryCov_9fa48("2088", "2089", "2090"), analytics.subjectBreakdown.length > 0)) && <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Desglose por Asignatura
              </CardTitle>
              <CardDescription>Rendimiento y tendencias por materia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.subjectBreakdown.map(stryMutAct_9fa48("2091") ? () => undefined : (stryCov_9fa48("2091"), (subject, idx) => <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{subject.subject}</h3>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{subject.average}%</p>
                        <p className="text-xs text-muted-foreground">
                          {subject.attempts} intento{(stryMutAct_9fa48("2094") ? subject.attempts === 1 : stryMutAct_9fa48("2093") ? false : stryMutAct_9fa48("2092") ? true : (stryCov_9fa48("2092", "2093", "2094"), subject.attempts !== 1)) ? stryMutAct_9fa48("2095") ? "" : (stryCov_9fa48("2095"), 's') : stryMutAct_9fa48("2096") ? "Stryker was here!" : (stryCov_9fa48("2096"), '')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={(stryMutAct_9fa48("2099") ? subject.trend !== 'improving' : stryMutAct_9fa48("2098") ? false : stryMutAct_9fa48("2097") ? true : (stryCov_9fa48("2097", "2098", "2099"), subject.trend === (stryMutAct_9fa48("2100") ? "" : (stryCov_9fa48("2100"), 'improving')))) ? stryMutAct_9fa48("2101") ? "" : (stryCov_9fa48("2101"), 'default') : (stryMutAct_9fa48("2104") ? subject.trend !== 'declining' : stryMutAct_9fa48("2103") ? false : stryMutAct_9fa48("2102") ? true : (stryCov_9fa48("2102", "2103", "2104"), subject.trend === (stryMutAct_9fa48("2105") ? "" : (stryCov_9fa48("2105"), 'declining')))) ? stryMutAct_9fa48("2106") ? "" : (stryCov_9fa48("2106"), 'destructive') : stryMutAct_9fa48("2107") ? "" : (stryCov_9fa48("2107"), 'secondary')} className="text-xs">
                      {(stryMutAct_9fa48("2110") ? subject.trend !== 'improving' : stryMutAct_9fa48("2109") ? false : stryMutAct_9fa48("2108") ? true : (stryCov_9fa48("2108", "2109", "2110"), subject.trend === (stryMutAct_9fa48("2111") ? "" : (stryCov_9fa48("2111"), 'improving')))) ? stryMutAct_9fa48("2112") ? "" : (stryCov_9fa48("2112"), 'Mejorando') : (stryMutAct_9fa48("2115") ? subject.trend !== 'declining' : stryMutAct_9fa48("2114") ? false : stryMutAct_9fa48("2113") ? true : (stryCov_9fa48("2113", "2114", "2115"), subject.trend === (stryMutAct_9fa48("2116") ? "" : (stryCov_9fa48("2116"), 'declining')))) ? stryMutAct_9fa48("2117") ? "" : (stryCov_9fa48("2117"), 'En declive') : stryMutAct_9fa48("2118") ? "" : (stryCov_9fa48("2118"), 'Estable')}
                    </Badge>
                  </div>))}
              </div>
            </CardContent>
          </Card>)}

        {/* Mensaje si no hay datos suficientes */}
        {stryMutAct_9fa48("2121") ? analytics.trends.length === 0 || <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Necesitas completar más exámenes para ver estadísticas avanzadas
              </p>
              <Button asChild>
                <Link href="/exams">Realizar Exámenes</Link>
              </Button>
            </CardContent>
          </Card> : stryMutAct_9fa48("2120") ? false : stryMutAct_9fa48("2119") ? true : (stryCov_9fa48("2119", "2120", "2121"), (stryMutAct_9fa48("2123") ? analytics.trends.length !== 0 : stryMutAct_9fa48("2122") ? true : (stryCov_9fa48("2122", "2123"), analytics.trends.length === 0)) && <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Necesitas completar más exámenes para ver estadísticas avanzadas
              </p>
              <Button asChild>
                <Link href="/exams">Realizar Exámenes</Link>
              </Button>
            </CardContent>
          </Card>)}
      </div>
    </>;
  }
}