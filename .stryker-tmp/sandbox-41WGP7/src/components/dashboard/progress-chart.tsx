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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
interface ProgressChartProps {
  attempts: Array<{
    porcentaje: number;
    startedAt: string;
    exam: {
      titulo: string;
      subject: {
        codigo: string;
      };
    };
  }>;
}
export function ProgressChart({
  attempts
}: ProgressChartProps) {
  if (stryMutAct_9fa48("16976")) {
    {}
  } else {
    stryCov_9fa48("16976");
    if (stryMutAct_9fa48("16979") ? attempts.length !== 0 : stryMutAct_9fa48("16978") ? false : stryMutAct_9fa48("16977") ? true : (stryCov_9fa48("16977", "16978", "16979"), attempts.length === 0)) {
      if (stryMutAct_9fa48("16980")) {
        {}
      } else {
        stryCov_9fa48("16980");
        return <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        <p>No hay intentos para mostrar el progreso</p>
      </div>;
      }
    }

    // Preparar datos: últimos 10 intentos ordenados por fecha
    const sortedAttempts = stryMutAct_9fa48("16982") ? [...attempts].slice(-10) : stryMutAct_9fa48("16981") ? [...attempts].sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()) : (stryCov_9fa48("16981", "16982"), (stryMutAct_9fa48("16983") ? [] : (stryCov_9fa48("16983"), [...attempts])).sort(stryMutAct_9fa48("16984") ? () => undefined : (stryCov_9fa48("16984"), (a, b) => stryMutAct_9fa48("16985") ? new Date(a.startedAt).getTime() + new Date(b.startedAt).getTime() : (stryCov_9fa48("16985"), new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()))).slice(stryMutAct_9fa48("16986") ? +10 : (stryCov_9fa48("16986"), -10)));
    const chartData = sortedAttempts.map(stryMutAct_9fa48("16987") ? () => undefined : (stryCov_9fa48("16987"), (attempt, index) => stryMutAct_9fa48("16988") ? {} : (stryCov_9fa48("16988"), {
      name: stryMutAct_9fa48("16989") ? `` : (stryCov_9fa48("16989"), `Intento ${stryMutAct_9fa48("16990") ? index - 1 : (stryCov_9fa48("16990"), index + 1)}`),
      fecha: new Date(attempt.startedAt).toLocaleDateString(stryMutAct_9fa48("16991") ? "" : (stryCov_9fa48("16991"), 'es-CL'), stryMutAct_9fa48("16992") ? {} : (stryCov_9fa48("16992"), {
        month: stryMutAct_9fa48("16993") ? "" : (stryCov_9fa48("16993"), 'short'),
        day: stryMutAct_9fa48("16994") ? "" : (stryCov_9fa48("16994"), 'numeric')
      })),
      porcentaje: Math.round(attempt.porcentaje),
      asignatura: attempt.exam.subject.codigo
    })));

    // Calcular promedio móvil (últimos 3 intentos)
    const movingAverage = chartData.map((_, index) => {
      if (stryMutAct_9fa48("16995")) {
        {}
      } else {
        stryCov_9fa48("16995");
        if (stryMutAct_9fa48("16999") ? index >= 2 : stryMutAct_9fa48("16998") ? index <= 2 : stryMutAct_9fa48("16997") ? false : stryMutAct_9fa48("16996") ? true : (stryCov_9fa48("16996", "16997", "16998", "16999"), index < 2)) return null;
        const lastThree = stryMutAct_9fa48("17000") ? chartData : (stryCov_9fa48("17000"), chartData.slice(stryMutAct_9fa48("17001") ? index + 2 : (stryCov_9fa48("17001"), index - 2), stryMutAct_9fa48("17002") ? index - 1 : (stryCov_9fa48("17002"), index + 1)));
        const avg = stryMutAct_9fa48("17003") ? lastThree.reduce((sum, d) => sum + d.porcentaje, 0) * lastThree.length : (stryCov_9fa48("17003"), lastThree.reduce(stryMutAct_9fa48("17004") ? () => undefined : (stryCov_9fa48("17004"), (sum, d) => stryMutAct_9fa48("17005") ? sum - d.porcentaje : (stryCov_9fa48("17005"), sum + d.porcentaje)), 0) / lastThree.length);
        return Math.round(avg);
      }
    });
    const dataWithAverage = chartData.map(stryMutAct_9fa48("17006") ? () => undefined : (stryCov_9fa48("17006"), (d, i) => stryMutAct_9fa48("17007") ? {} : (stryCov_9fa48("17007"), {
      ...d,
      promedio: stryMutAct_9fa48("17008") ? movingAverage[i] && null : (stryCov_9fa48("17008"), movingAverage[i] ?? null)
    })));
    return <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dataWithAverage}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" angle={stryMutAct_9fa48("17009") ? +45 : (stryCov_9fa48("17009"), -45)} textAnchor="end" height={60} />
        <YAxis domain={stryMutAct_9fa48("17010") ? [] : (stryCov_9fa48("17010"), [0, 100])} />
        <Tooltip formatter={stryMutAct_9fa48("17011") ? () => undefined : (stryCov_9fa48("17011"), (value: number | undefined) => stryMutAct_9fa48("17012") ? `` : (stryCov_9fa48("17012"), `${stryMutAct_9fa48("17013") ? value && 0 : (stryCov_9fa48("17013"), value ?? 0)}%`))} labelFormatter={stryMutAct_9fa48("17014") ? () => undefined : (stryCov_9fa48("17014"), label => stryMutAct_9fa48("17015") ? `` : (stryCov_9fa48("17015"), `Fecha: ${label}`))} />
        <Legend />
        <Line type="monotone" dataKey="porcentaje" stroke="#3b82f6" strokeWidth={2} name="Puntaje" dot={stryMutAct_9fa48("17016") ? {} : (stryCov_9fa48("17016"), {
          r: 4
        })} activeDot={stryMutAct_9fa48("17017") ? {} : (stryCov_9fa48("17017"), {
          r: 6
        })} />
        {stryMutAct_9fa48("17020") ? movingAverage.some(m => m !== null) || <Line type="monotone" dataKey="promedio" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Promedio móvil (3 intentos)" dot={false} /> : stryMutAct_9fa48("17019") ? false : stryMutAct_9fa48("17018") ? true : (stryCov_9fa48("17018", "17019", "17020"), (stryMutAct_9fa48("17021") ? movingAverage.every(m => m !== null) : (stryCov_9fa48("17021"), movingAverage.some(stryMutAct_9fa48("17022") ? () => undefined : (stryCov_9fa48("17022"), m => stryMutAct_9fa48("17025") ? m === null : stryMutAct_9fa48("17024") ? false : stryMutAct_9fa48("17023") ? true : (stryCov_9fa48("17023", "17024", "17025"), m !== null))))) && <Line type="monotone" dataKey="promedio" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Promedio móvil (3 intentos)" dot={stryMutAct_9fa48("17026") ? true : (stryCov_9fa48("17026"), false)} />)}
      </LineChart>
    </ResponsiveContainer>;
  }
}