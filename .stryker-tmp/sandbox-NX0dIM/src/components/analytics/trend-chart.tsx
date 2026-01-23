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
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
interface TrendData {
  date: string;
  percentage: number;
  examTitle: string;
  subjectName: string;
}
interface TrendChartProps {
  data: TrendData[];
  className?: string;
}
export function TrendChart({
  data,
  className
}: TrendChartProps) {
  if (stryMutAct_9fa48("15893")) {
    {}
  } else {
    stryCov_9fa48("15893");
    // Preparar datos para el gráfico
    const chartData = useMemo(() => {
      if (stryMutAct_9fa48("15894")) {
        {}
      } else {
        stryCov_9fa48("15894");
        return data.map(stryMutAct_9fa48("15895") ? () => undefined : (stryCov_9fa48("15895"), (item, index) => stryMutAct_9fa48("15896") ? {} : (stryCov_9fa48("15896"), {
          name: stryMutAct_9fa48("15897") ? `` : (stryCov_9fa48("15897"), `Intento ${stryMutAct_9fa48("15898") ? index - 1 : (stryCov_9fa48("15898"), index + 1)}`),
          date: new Date(item.date).toLocaleDateString(stryMutAct_9fa48("15899") ? "" : (stryCov_9fa48("15899"), 'es-CL'), stryMutAct_9fa48("15900") ? {} : (stryCov_9fa48("15900"), {
            month: stryMutAct_9fa48("15901") ? "" : (stryCov_9fa48("15901"), 'short'),
            day: stryMutAct_9fa48("15902") ? "" : (stryCov_9fa48("15902"), 'numeric')
          })),
          porcentaje: stryMutAct_9fa48("15903") ? Math.round(item.percentage * 10) * 10 : (stryCov_9fa48("15903"), Math.round(stryMutAct_9fa48("15904") ? item.percentage / 10 : (stryCov_9fa48("15904"), item.percentage * 10)) / 10),
          fullDate: item.date
        })));
      }
    }, stryMutAct_9fa48("15905") ? [] : (stryCov_9fa48("15905"), [data]));

    // Calcular promedio móvil (últimos 3 puntos)
    const dataWithAverage = useMemo(() => {
      if (stryMutAct_9fa48("15906")) {
        {}
      } else {
        stryCov_9fa48("15906");
        return chartData.map((item, index) => {
          if (stryMutAct_9fa48("15907")) {
            {}
          } else {
            stryCov_9fa48("15907");
            if (stryMutAct_9fa48("15911") ? index >= 2 : stryMutAct_9fa48("15910") ? index <= 2 : stryMutAct_9fa48("15909") ? false : stryMutAct_9fa48("15908") ? true : (stryCov_9fa48("15908", "15909", "15910", "15911"), index < 2)) {
              if (stryMutAct_9fa48("15912")) {
                {}
              } else {
                stryCov_9fa48("15912");
                return stryMutAct_9fa48("15913") ? {} : (stryCov_9fa48("15913"), {
                  ...item,
                  promedio: item.porcentaje
                });
              }
            }
            const lastThree = stryMutAct_9fa48("15914") ? chartData : (stryCov_9fa48("15914"), chartData.slice(stryMutAct_9fa48("15915") ? Math.min(0, index - 2) : (stryCov_9fa48("15915"), Math.max(0, stryMutAct_9fa48("15916") ? index + 2 : (stryCov_9fa48("15916"), index - 2))), stryMutAct_9fa48("15917") ? index - 1 : (stryCov_9fa48("15917"), index + 1)));
            const avg = stryMutAct_9fa48("15918") ? lastThree.reduce((sum, d) => sum + d.porcentaje, 0) * lastThree.length : (stryCov_9fa48("15918"), lastThree.reduce(stryMutAct_9fa48("15919") ? () => undefined : (stryCov_9fa48("15919"), (sum, d) => stryMutAct_9fa48("15920") ? sum - d.porcentaje : (stryCov_9fa48("15920"), sum + d.porcentaje)), 0) / lastThree.length);
            return stryMutAct_9fa48("15921") ? {} : (stryCov_9fa48("15921"), {
              ...item,
              promedio: stryMutAct_9fa48("15922") ? Math.round(avg * 10) * 10 : (stryCov_9fa48("15922"), Math.round(stryMutAct_9fa48("15923") ? avg / 10 : (stryCov_9fa48("15923"), avg * 10)) / 10)
            });
          }
        });
      }
    }, stryMutAct_9fa48("15924") ? [] : (stryCov_9fa48("15924"), [chartData]));
    if (stryMutAct_9fa48("15927") ? data.length !== 0 : stryMutAct_9fa48("15926") ? false : stryMutAct_9fa48("15925") ? true : (stryCov_9fa48("15925", "15926", "15927"), data.length === 0)) {
      if (stryMutAct_9fa48("15928")) {
        {}
      } else {
        stryCov_9fa48("15928");
        return <Card className={className}>
        <CardHeader>
          <CardTitle>Tendencias a Largo Plazo</CardTitle>
          <CardDescription>Evolución de tu rendimiento en el tiempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No hay suficientes datos para mostrar tendencias</p>
          </div>
        </CardContent>
      </Card>;
      }
    }
    return <Card className={className}>
      <CardHeader>
        <CardTitle>Tendencias a Largo Plazo</CardTitle>
        <CardDescription>
          Evolución de tu rendimiento en el tiempo ({data.length} intentos)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataWithAverage}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" tick={stryMutAct_9fa48("15929") ? {} : (stryCov_9fa48("15929"), {
              fill: stryMutAct_9fa48("15930") ? "" : (stryCov_9fa48("15930"), 'currentColor')
            })} />
            <YAxis domain={stryMutAct_9fa48("15931") ? [] : (stryCov_9fa48("15931"), [0, 100])} className="text-xs" tick={stryMutAct_9fa48("15932") ? {} : (stryCov_9fa48("15932"), {
              fill: stryMutAct_9fa48("15933") ? "" : (stryCov_9fa48("15933"), 'currentColor')
            })} label={stryMutAct_9fa48("15934") ? {} : (stryCov_9fa48("15934"), {
              value: stryMutAct_9fa48("15935") ? "" : (stryCov_9fa48("15935"), 'Porcentaje (%)'),
              angle: stryMutAct_9fa48("15936") ? +90 : (stryCov_9fa48("15936"), -90),
              position: stryMutAct_9fa48("15937") ? "" : (stryCov_9fa48("15937"), 'insideLeft')
            })} />
            <Tooltip contentStyle={stryMutAct_9fa48("15938") ? {} : (stryCov_9fa48("15938"), {
              backgroundColor: stryMutAct_9fa48("15939") ? "" : (stryCov_9fa48("15939"), 'hsl(var(--background))'),
              border: stryMutAct_9fa48("15940") ? "" : (stryCov_9fa48("15940"), '1px solid hsl(var(--border))'),
              borderRadius: stryMutAct_9fa48("15941") ? "" : (stryCov_9fa48("15941"), '6px')
            })} formatter={stryMutAct_9fa48("15942") ? () => undefined : (stryCov_9fa48("15942"), (value: number | undefined) => stryMutAct_9fa48("15943") ? [] : (stryCov_9fa48("15943"), [stryMutAct_9fa48("15944") ? `` : (stryCov_9fa48("15944"), `${stryMutAct_9fa48("15945") ? value && 0 : (stryCov_9fa48("15945"), value ?? 0)}%`), stryMutAct_9fa48("15946") ? "Stryker was here!" : (stryCov_9fa48("15946"), '')]))} labelFormatter={stryMutAct_9fa48("15947") ? () => undefined : (stryCov_9fa48("15947"), label => stryMutAct_9fa48("15948") ? `` : (stryCov_9fa48("15948"), `Fecha: ${label}`))} />
            <Legend />
            <Line type="monotone" dataKey="porcentaje" stroke="hsl(var(--primary))" strokeWidth={2} dot={stryMutAct_9fa48("15949") ? {} : (stryCov_9fa48("15949"), {
              r: 4
            })} activeDot={stryMutAct_9fa48("15950") ? {} : (stryCov_9fa48("15950"), {
              r: 6
            })} name="Rendimiento" />
            <Line type="monotone" dataKey="promedio" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={stryMutAct_9fa48("15951") ? true : (stryCov_9fa48("15951"), false)} name="Promedio Móvil (3)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
  }
}