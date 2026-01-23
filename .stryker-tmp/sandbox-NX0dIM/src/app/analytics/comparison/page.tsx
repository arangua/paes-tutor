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
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, Users, Award, Target, BarChart3, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { HelpIcon } from '@/components/help/help-icon';
import { BackButton } from '@/components/navigation/back-button';
interface UserStats {
  totalAttempts: number;
  averagePercentage: number;
  bestPercentage: number;
  averagePaesScore: number | null;
  percentile: number;
  bestPercentile: number;
  rank: number;
  totalStudents: number;
  rankPercentage: number;
}
interface OverallStats {
  totalAttempts: number;
  averagePercentage: number;
  medianPercentage: number;
  minPercentage: number;
  maxPercentage: number;
  averagePaesScore: number | null;
  medianPaesScore: number | null;
}
interface SubjectStat {
  subjectCode: string;
  subjectName: string;
  totalAttempts: number;
  userAttempts: number;
  userAverage: number;
  overallAverage: number;
  userPercentile: number;
  userRank: number;
  totalStudents: number;
}
export default function ComparisonPage() {
  if (stryMutAct_9fa48("1648")) {
    {}
  } else {
    stryCov_9fa48("1648");
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
    const [subjectStats, setSubjectStats] = useState<SubjectStat[]>(stryMutAct_9fa48("1649") ? ["Stryker was here"] : (stryCov_9fa48("1649"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("1650") ? false : (stryCov_9fa48("1650"), true));
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("1651")) {
        {}
      } else {
        stryCov_9fa48("1651");
        loadComparison();
      }
    }, stryMutAct_9fa48("1652") ? ["Stryker was here"] : (stryCov_9fa48("1652"), []));
    async function loadComparison() {
      if (stryMutAct_9fa48("1653")) {
        {}
      } else {
        stryCov_9fa48("1653");
        try {
          if (stryMutAct_9fa48("1654")) {
            {}
          } else {
            stryCov_9fa48("1654");
            setLoading(stryMutAct_9fa48("1655") ? false : (stryCov_9fa48("1655"), true));
            setError(null);
            const res = await fetch(stryMutAct_9fa48("1656") ? "" : (stryCov_9fa48("1656"), '/api/analytics/comparison'));
            if (stryMutAct_9fa48("1659") ? false : stryMutAct_9fa48("1658") ? true : stryMutAct_9fa48("1657") ? res.ok : (stryCov_9fa48("1657", "1658", "1659"), !res.ok)) throw new Error(stryMutAct_9fa48("1660") ? "" : (stryCov_9fa48("1660"), 'Error al cargar comparación'));
            const data = await res.json();
            if (stryMutAct_9fa48("1662") ? false : stryMutAct_9fa48("1661") ? true : (stryCov_9fa48("1661", "1662"), data.message)) {
              if (stryMutAct_9fa48("1663")) {
                {}
              } else {
                stryCov_9fa48("1663");
                setError(data.message);
                return;
              }
            }
            setUserStats(data.userStats);
            setOverallStats(data.overallStats);
            setSubjectStats(stryMutAct_9fa48("1666") ? data.subjectStats && [] : stryMutAct_9fa48("1665") ? false : stryMutAct_9fa48("1664") ? true : (stryCov_9fa48("1664", "1665", "1666"), data.subjectStats || (stryMutAct_9fa48("1667") ? ["Stryker was here"] : (stryCov_9fa48("1667"), []))));
          }
        } catch (err) {
          if (stryMutAct_9fa48("1668")) {
            {}
          } else {
            stryCov_9fa48("1668");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("1669") ? "" : (stryCov_9fa48("1669"), 'Error desconocido'));
            toast.error(stryMutAct_9fa48("1670") ? "" : (stryCov_9fa48("1670"), 'Error al cargar comparación'));
          }
        } finally {
          if (stryMutAct_9fa48("1671")) {
            {}
          } else {
            stryCov_9fa48("1671");
            setLoading(stryMutAct_9fa48("1672") ? true : (stryCov_9fa48("1672"), false));
          }
        }
      }
    }

    // Memoizar funciones de utilidad para evitar recrearlas en cada render
    const getPercentileColor = useCallback((percentile: number) => {
      if (stryMutAct_9fa48("1673")) {
        {}
      } else {
        stryCov_9fa48("1673");
        if (stryMutAct_9fa48("1677") ? percentile < 90 : stryMutAct_9fa48("1676") ? percentile > 90 : stryMutAct_9fa48("1675") ? false : stryMutAct_9fa48("1674") ? true : (stryCov_9fa48("1674", "1675", "1676", "1677"), percentile >= 90)) return stryMutAct_9fa48("1678") ? "" : (stryCov_9fa48("1678"), 'text-green-600');
        if (stryMutAct_9fa48("1682") ? percentile < 75 : stryMutAct_9fa48("1681") ? percentile > 75 : stryMutAct_9fa48("1680") ? false : stryMutAct_9fa48("1679") ? true : (stryCov_9fa48("1679", "1680", "1681", "1682"), percentile >= 75)) return stryMutAct_9fa48("1683") ? "" : (stryCov_9fa48("1683"), 'text-blue-600');
        if (stryMutAct_9fa48("1687") ? percentile < 50 : stryMutAct_9fa48("1686") ? percentile > 50 : stryMutAct_9fa48("1685") ? false : stryMutAct_9fa48("1684") ? true : (stryCov_9fa48("1684", "1685", "1686", "1687"), percentile >= 50)) return stryMutAct_9fa48("1688") ? "" : (stryCov_9fa48("1688"), 'text-yellow-600');
        if (stryMutAct_9fa48("1692") ? percentile < 25 : stryMutAct_9fa48("1691") ? percentile > 25 : stryMutAct_9fa48("1690") ? false : stryMutAct_9fa48("1689") ? true : (stryCov_9fa48("1689", "1690", "1691", "1692"), percentile >= 25)) return stryMutAct_9fa48("1693") ? "" : (stryCov_9fa48("1693"), 'text-orange-600');
        return stryMutAct_9fa48("1694") ? "" : (stryCov_9fa48("1694"), 'text-red-600');
      }
    }, stryMutAct_9fa48("1695") ? ["Stryker was here"] : (stryCov_9fa48("1695"), []));
    const getPercentileLabel = useCallback((percentile: number) => {
      if (stryMutAct_9fa48("1696")) {
        {}
      } else {
        stryCov_9fa48("1696");
        if (stryMutAct_9fa48("1700") ? percentile < 90 : stryMutAct_9fa48("1699") ? percentile > 90 : stryMutAct_9fa48("1698") ? false : stryMutAct_9fa48("1697") ? true : (stryCov_9fa48("1697", "1698", "1699", "1700"), percentile >= 90)) return stryMutAct_9fa48("1701") ? "" : (stryCov_9fa48("1701"), 'Excelente');
        if (stryMutAct_9fa48("1705") ? percentile < 75 : stryMutAct_9fa48("1704") ? percentile > 75 : stryMutAct_9fa48("1703") ? false : stryMutAct_9fa48("1702") ? true : (stryCov_9fa48("1702", "1703", "1704", "1705"), percentile >= 75)) return stryMutAct_9fa48("1706") ? "" : (stryCov_9fa48("1706"), 'Muy Bueno');
        if (stryMutAct_9fa48("1710") ? percentile < 50 : stryMutAct_9fa48("1709") ? percentile > 50 : stryMutAct_9fa48("1708") ? false : stryMutAct_9fa48("1707") ? true : (stryCov_9fa48("1707", "1708", "1709", "1710"), percentile >= 50)) return stryMutAct_9fa48("1711") ? "" : (stryCov_9fa48("1711"), 'Bueno');
        if (stryMutAct_9fa48("1715") ? percentile < 25 : stryMutAct_9fa48("1714") ? percentile > 25 : stryMutAct_9fa48("1713") ? false : stryMutAct_9fa48("1712") ? true : (stryCov_9fa48("1712", "1713", "1714", "1715"), percentile >= 25)) return stryMutAct_9fa48("1716") ? "" : (stryCov_9fa48("1716"), 'Regular');
        return stryMutAct_9fa48("1717") ? "" : (stryCov_9fa48("1717"), 'Necesita Mejora');
      }
    }, stryMutAct_9fa48("1718") ? ["Stryker was here"] : (stryCov_9fa48("1718"), []));
    if (stryMutAct_9fa48("1720") ? false : stryMutAct_9fa48("1719") ? true : (stryCov_9fa48("1719", "1720"), loading)) {
      if (stryMutAct_9fa48("1721")) {
        {}
      } else {
        stryCov_9fa48("1721");
        return <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>;
      }
    }
    if (stryMutAct_9fa48("1723") ? false : stryMutAct_9fa48("1722") ? true : (stryCov_9fa48("1722", "1723"), error)) {
      if (stryMutAct_9fa48("1724")) {
        {}
      } else {
        stryCov_9fa48("1724");
        return <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-semibold mb-2">{error}</p>
              <p className="text-muted-foreground">
                {error.includes(stryMutAct_9fa48("1725") ? "" : (stryCov_9fa48("1725"), 'No tienes')) ? stryMutAct_9fa48("1726") ? "" : (stryCov_9fa48("1726"), 'Completa algunos exámenes para ver tu comparación') : stryMutAct_9fa48("1727") ? "" : (stryCov_9fa48("1727"), 'Completa algunos exámenes para generar datos de comparación')}
              </p>
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
            <BarChart3 className="h-8 w-8" />
            Comparación Anónima
          </h1>
          <p className="text-muted-foreground mt-2">
            Compara tu rendimiento con otros estudiantes de forma anónima
          </p>
        </div>
        <HelpIcon content="Esta comparación es completamente anónima. No se muestran nombres ni información personal. Solo estadísticas agregadas para ayudarte a entender tu posición relativa." />
      </div>

      {/* User Stats */}
      {stryMutAct_9fa48("1730") ? userStats || <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Percentil General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                <span className={getPercentileColor(userStats.percentile)}>
                  {userStats.percentile}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getPercentileLabel(userStats.percentile)}
              </p>
              <Progress value={userStats.percentile} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Posición en Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">#{userStats.rank}</div>
              <p className="text-xs text-muted-foreground">
                de {userStats.totalStudents} estudiantes
              </p>
              <Progress value={userStats.rankPercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {userStats.averagePercentage.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Mejor: {userStats.bestPercentage.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Intentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{userStats.totalAttempts}</div>
              <p className="text-xs text-muted-foreground">Exámenes completados</p>
            </CardContent>
          </Card>
        </div> : stryMutAct_9fa48("1729") ? false : stryMutAct_9fa48("1728") ? true : (stryCov_9fa48("1728", "1729", "1730"), userStats && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Percentil General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                <span className={getPercentileColor(userStats.percentile)}>
                  {userStats.percentile}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getPercentileLabel(userStats.percentile)}
              </p>
              <Progress value={userStats.percentile} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Posición en Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">#{userStats.rank}</div>
              <p className="text-xs text-muted-foreground">
                de {userStats.totalStudents} estudiantes
              </p>
              <Progress value={userStats.rankPercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {userStats.averagePercentage.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Mejor: {userStats.bestPercentage.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Intentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{userStats.totalAttempts}</div>
              <p className="text-xs text-muted-foreground">Exámenes completados</p>
            </CardContent>
          </Card>
        </div>)}

      {/* Overall Stats */}
      {stryMutAct_9fa48("1733") ? overallStats || <Card>
          <CardHeader>
            <CardTitle>Estadísticas Generales del Sistema</CardTitle>
            <CardDescription>
              Datos agregados de todos los estudiantes (completamente anónimos)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Intentos</p>
                <p className="text-2xl font-bold">{overallStats.totalAttempts}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Promedio General</p>
                <p className="text-2xl font-bold">{overallStats.averagePercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mediana</p>
                <p className="text-2xl font-bold">{overallStats.medianPercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rango</p>
                <p className="text-lg font-semibold">
                  {overallStats.minPercentage.toFixed(1)}% - {overallStats.maxPercentage.toFixed(1)}
                  %
                </p>
              </div>
            </div>
            {overallStats.averagePaesScore && <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Puntaje PAES Promedio</p>
                <p className="text-2xl font-bold">
                  {overallStats.averagePaesScore.toFixed(0)} puntos
                </p>
                {overallStats.medianPaesScore && <p className="text-sm text-muted-foreground mt-1">
                    Mediana: {overallStats.medianPaesScore.toFixed(0)} puntos
                  </p>}
              </div>}
          </CardContent>
        </Card> : stryMutAct_9fa48("1732") ? false : stryMutAct_9fa48("1731") ? true : (stryCov_9fa48("1731", "1732", "1733"), overallStats && <Card>
          <CardHeader>
            <CardTitle>Estadísticas Generales del Sistema</CardTitle>
            <CardDescription>
              Datos agregados de todos los estudiantes (completamente anónimos)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Intentos</p>
                <p className="text-2xl font-bold">{overallStats.totalAttempts}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Promedio General</p>
                <p className="text-2xl font-bold">{overallStats.averagePercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mediana</p>
                <p className="text-2xl font-bold">{overallStats.medianPercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rango</p>
                <p className="text-lg font-semibold">
                  {overallStats.minPercentage.toFixed(1)}% - {overallStats.maxPercentage.toFixed(1)}
                  %
                </p>
              </div>
            </div>
            {stryMutAct_9fa48("1736") ? overallStats.averagePaesScore || <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Puntaje PAES Promedio</p>
                <p className="text-2xl font-bold">
                  {overallStats.averagePaesScore.toFixed(0)} puntos
                </p>
                {overallStats.medianPaesScore && <p className="text-sm text-muted-foreground mt-1">
                    Mediana: {overallStats.medianPaesScore.toFixed(0)} puntos
                  </p>}
              </div> : stryMutAct_9fa48("1735") ? false : stryMutAct_9fa48("1734") ? true : (stryCov_9fa48("1734", "1735", "1736"), overallStats.averagePaesScore && <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Puntaje PAES Promedio</p>
                <p className="text-2xl font-bold">
                  {overallStats.averagePaesScore.toFixed(0)} puntos
                </p>
                {stryMutAct_9fa48("1739") ? overallStats.medianPaesScore || <p className="text-sm text-muted-foreground mt-1">
                    Mediana: {overallStats.medianPaesScore.toFixed(0)} puntos
                  </p> : stryMutAct_9fa48("1738") ? false : stryMutAct_9fa48("1737") ? true : (stryCov_9fa48("1737", "1738", "1739"), overallStats.medianPaesScore && <p className="text-sm text-muted-foreground mt-1">
                    Mediana: {overallStats.medianPaesScore.toFixed(0)} puntos
                  </p>)}
              </div>)}
          </CardContent>
        </Card>)}

      {/* Subject Stats */}
      {stryMutAct_9fa48("1742") ? subjectStats.length > 0 || <Card>
          <CardHeader>
            <CardTitle>Comparación por Asignatura</CardTitle>
            <CardDescription>
              Tu rendimiento comparado con otros estudiantes por asignatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectStats.map(subject => <div key={subject.subjectCode} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{subject.subjectName}</h3>
                      <p className="text-sm text-muted-foreground">{subject.subjectCode}</p>
                    </div>
                    <Badge variant="outline">
                      {subject.userAttempts} intento{subject.userAttempts !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tu Promedio</p>
                      <p className="text-xl font-bold">{subject.userAverage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Promedio General</p>
                      <p className="text-xl font-bold">{subject.overallAverage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Percentil</p>
                      <p className={`text-xl font-bold ${getPercentileColor(subject.userPercentile)}`}>
                        {subject.userPercentile}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Posición #{subject.userRank} de {subject.totalStudents}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Tu rendimiento</span>
                      <span>{subject.userPercentile}%</span>
                    </div>
                    <Progress value={subject.userPercentile} className="h-2" />
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card> : stryMutAct_9fa48("1741") ? false : stryMutAct_9fa48("1740") ? true : (stryCov_9fa48("1740", "1741", "1742"), (stryMutAct_9fa48("1745") ? subjectStats.length <= 0 : stryMutAct_9fa48("1744") ? subjectStats.length >= 0 : stryMutAct_9fa48("1743") ? true : (stryCov_9fa48("1743", "1744", "1745"), subjectStats.length > 0)) && <Card>
          <CardHeader>
            <CardTitle>Comparación por Asignatura</CardTitle>
            <CardDescription>
              Tu rendimiento comparado con otros estudiantes por asignatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectStats.map(stryMutAct_9fa48("1746") ? () => undefined : (stryCov_9fa48("1746"), subject => <div key={subject.subjectCode} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{subject.subjectName}</h3>
                      <p className="text-sm text-muted-foreground">{subject.subjectCode}</p>
                    </div>
                    <Badge variant="outline">
                      {subject.userAttempts} intento{(stryMutAct_9fa48("1749") ? subject.userAttempts === 1 : stryMutAct_9fa48("1748") ? false : stryMutAct_9fa48("1747") ? true : (stryCov_9fa48("1747", "1748", "1749"), subject.userAttempts !== 1)) ? stryMutAct_9fa48("1750") ? "" : (stryCov_9fa48("1750"), 's') : stryMutAct_9fa48("1751") ? "Stryker was here!" : (stryCov_9fa48("1751"), '')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tu Promedio</p>
                      <p className="text-xl font-bold">{subject.userAverage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Promedio General</p>
                      <p className="text-xl font-bold">{subject.overallAverage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Percentil</p>
                      <p className={stryMutAct_9fa48("1752") ? `` : (stryCov_9fa48("1752"), `text-xl font-bold ${getPercentileColor(subject.userPercentile)}`)}>
                        {subject.userPercentile}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Posición #{subject.userRank} de {subject.totalStudents}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Tu rendimiento</span>
                      <span>{subject.userPercentile}%</span>
                    </div>
                    <Progress value={subject.userPercentile} className="h-2" />
                  </div>
                </div>))}
            </div>
          </CardContent>
        </Card>)}
    </div>;
  }
}