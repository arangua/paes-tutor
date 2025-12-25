/**
 * Librería de Análisis Avanzado
 *
 * Funciones para análisis profundo del rendimiento del estudiante,
 * incluyendo tendencias, predicciones y comparaciones.
 */
// @ts-nocheck
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
export interface TrendData {
  date: string;
  percentage: number;
  examTitle: string;
  subjectName: string;
}
export interface StrengthWeakness {
  topic: string;
  subject: string;
  percentage: number;
  totalQuestions: number;
  category: 'strength' | 'weakness' | 'average';
}
export interface PAESPrediction {
  predictedScore: number;
  confidence: 'high' | 'medium' | 'low';
  factors: string[];
  estimatedRange: {
    min: number;
    max: number;
  };
}
export interface ComparisonData {
  studentAverage: number;
  overallAverage: number;
  percentile: number;
  comparison: 'above' | 'below' | 'equal';
}
export interface AdvancedAnalytics {
  trends: TrendData[];
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
  paesPrediction: PAESPrediction | null;
  comparison: ComparisonData | null;
  subjectBreakdown: Array<{
    subject: string;
    average: number;
    trend: 'improving' | 'declining' | 'stable';
    attempts: number;
  }>;
}
interface Attempt {
  id: string;
  porcentaje: number;
  createdAt: string;
  exam: {
    titulo: string;
    subject: {
      nombre: string;
      codigo: string;
    };
  };
}
interface Metric {
  topicId: string;
  topicName: string;
  subjectName: string;
  porcentaje: number;
  totalPreguntas: number;
  correctas: number;
}

/**
 * Analiza tendencias a largo plazo
 */
export function analyzeTrends(attempts: Attempt[]): TrendData[] {
  if (stryMutAct_9fa48("22654")) {
    {}
  } else {
    stryCov_9fa48("22654");
    // Ordenar por fecha
    const sortedAttempts = stryMutAct_9fa48("22656") ? [...attempts].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) : stryMutAct_9fa48("22655") ? [...attempts].filter(a => a.porcentaje !== null && a.porcentaje !== undefined) : (stryCov_9fa48("22655", "22656"), (stryMutAct_9fa48("22657") ? [] : (stryCov_9fa48("22657"), [...attempts])).filter(stryMutAct_9fa48("22658") ? () => undefined : (stryCov_9fa48("22658"), a => stryMutAct_9fa48("22661") ? a.porcentaje !== null || a.porcentaje !== undefined : stryMutAct_9fa48("22660") ? false : stryMutAct_9fa48("22659") ? true : (stryCov_9fa48("22659", "22660", "22661"), (stryMutAct_9fa48("22663") ? a.porcentaje === null : stryMutAct_9fa48("22662") ? true : (stryCov_9fa48("22662", "22663"), a.porcentaje !== null)) && (stryMutAct_9fa48("22665") ? a.porcentaje === undefined : stryMutAct_9fa48("22664") ? true : (stryCov_9fa48("22664", "22665"), a.porcentaje !== undefined))))).sort(stryMutAct_9fa48("22666") ? () => undefined : (stryCov_9fa48("22666"), (a, b) => stryMutAct_9fa48("22667") ? new Date(a.createdAt).getTime() + new Date(b.createdAt).getTime() : (stryCov_9fa48("22667"), new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))));
    return sortedAttempts.map(stryMutAct_9fa48("22668") ? () => undefined : (stryCov_9fa48("22668"), attempt => stryMutAct_9fa48("22669") ? {} : (stryCov_9fa48("22669"), {
      date: new Date(attempt.createdAt).toISOString().split(stryMutAct_9fa48("22670") ? "" : (stryCov_9fa48("22670"), 'T'))[0],
      percentage: attempt.porcentaje,
      examTitle: attempt.exam.titulo,
      subjectName: attempt.exam.subject.nombre
    })));
  }
}

/**
 * Identifica fortalezas y debilidades
 */
export function analyzeStrengthsWeaknesses(metrics: Metric[]): {
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
} {
  if (stryMutAct_9fa48("22671")) {
    {}
  } else {
    stryCov_9fa48("22671");
    const strengths: StrengthWeakness[] = stryMutAct_9fa48("22672") ? ["Stryker was here"] : (stryCov_9fa48("22672"), []);
    const weaknesses: StrengthWeakness[] = stryMutAct_9fa48("22673") ? ["Stryker was here"] : (stryCov_9fa48("22673"), []);
    metrics.forEach(metric => {
      if (stryMutAct_9fa48("22674")) {
        {}
      } else {
        stryCov_9fa48("22674");
        if (stryMutAct_9fa48("22678") ? metric.totalPreguntas >= 3 : stryMutAct_9fa48("22677") ? metric.totalPreguntas <= 3 : stryMutAct_9fa48("22676") ? false : stryMutAct_9fa48("22675") ? true : (stryCov_9fa48("22675", "22676", "22677", "22678"), metric.totalPreguntas < 3)) return; // Ignorar temas con pocas preguntas

        const item: StrengthWeakness = stryMutAct_9fa48("22679") ? {} : (stryCov_9fa48("22679"), {
          topic: metric.topicName,
          subject: metric.subjectName,
          percentage: metric.porcentaje,
          totalQuestions: metric.totalPreguntas,
          category: (stryMutAct_9fa48("22683") ? metric.porcentaje < 70 : stryMutAct_9fa48("22682") ? metric.porcentaje > 70 : stryMutAct_9fa48("22681") ? false : stryMutAct_9fa48("22680") ? true : (stryCov_9fa48("22680", "22681", "22682", "22683"), metric.porcentaje >= 70)) ? stryMutAct_9fa48("22684") ? "" : (stryCov_9fa48("22684"), 'strength') : (stryMutAct_9fa48("22688") ? metric.porcentaje >= 50 : stryMutAct_9fa48("22687") ? metric.porcentaje <= 50 : stryMutAct_9fa48("22686") ? false : stryMutAct_9fa48("22685") ? true : (stryCov_9fa48("22685", "22686", "22687", "22688"), metric.porcentaje < 50)) ? stryMutAct_9fa48("22689") ? "" : (stryCov_9fa48("22689"), 'weakness') : stryMutAct_9fa48("22690") ? "" : (stryCov_9fa48("22690"), 'average')
        });
        if (stryMutAct_9fa48("22693") ? item.category !== 'strength' : stryMutAct_9fa48("22692") ? false : stryMutAct_9fa48("22691") ? true : (stryCov_9fa48("22691", "22692", "22693"), item.category === (stryMutAct_9fa48("22694") ? "" : (stryCov_9fa48("22694"), 'strength')))) {
          if (stryMutAct_9fa48("22695")) {
            {}
          } else {
            stryCov_9fa48("22695");
            strengths.push(item);
          }
        } else if (stryMutAct_9fa48("22698") ? item.category !== 'weakness' : stryMutAct_9fa48("22697") ? false : stryMutAct_9fa48("22696") ? true : (stryCov_9fa48("22696", "22697", "22698"), item.category === (stryMutAct_9fa48("22699") ? "" : (stryCov_9fa48("22699"), 'weakness')))) {
          if (stryMutAct_9fa48("22700")) {
            {}
          } else {
            stryCov_9fa48("22700");
            weaknesses.push(item);
          }
        }
      }
    });

    // Ordenar: fortalezas por porcentaje descendente, debilidades por porcentaje ascendente
    stryMutAct_9fa48("22701") ? strengths : (stryCov_9fa48("22701"), strengths.sort(stryMutAct_9fa48("22702") ? () => undefined : (stryCov_9fa48("22702"), (a, b) => stryMutAct_9fa48("22703") ? b.percentage + a.percentage : (stryCov_9fa48("22703"), b.percentage - a.percentage))));
    stryMutAct_9fa48("22704") ? weaknesses : (stryCov_9fa48("22704"), weaknesses.sort(stryMutAct_9fa48("22705") ? () => undefined : (stryCov_9fa48("22705"), (a, b) => stryMutAct_9fa48("22706") ? a.percentage + b.percentage : (stryCov_9fa48("22706"), a.percentage - b.percentage))));
    return stryMutAct_9fa48("22707") ? {} : (stryCov_9fa48("22707"), {
      strengths,
      weaknesses
    });
  }
}

/**
 * Predice puntaje PAES basado en rendimiento histórico
 */
export function predictPAESScore(attempts: Attempt[]): PAESPrediction | null {
  if (stryMutAct_9fa48("22708")) {
    {}
  } else {
    stryCov_9fa48("22708");
    if (stryMutAct_9fa48("22712") ? attempts.length >= 3 : stryMutAct_9fa48("22711") ? attempts.length <= 3 : stryMutAct_9fa48("22710") ? false : stryMutAct_9fa48("22709") ? true : (stryCov_9fa48("22709", "22710", "22711", "22712"), attempts.length < 3)) {
      if (stryMutAct_9fa48("22713")) {
        {}
      } else {
        stryCov_9fa48("22713");
        return null; // Necesita al menos 3 intentos para predecir
      }
    }

    // Filtrar intentos completados con puntaje PAES
    const validAttempts = stryMutAct_9fa48("22714") ? attempts : (stryCov_9fa48("22714"), attempts.filter(stryMutAct_9fa48("22715") ? () => undefined : (stryCov_9fa48("22715"), a => stryMutAct_9fa48("22718") ? a.porcentaje !== null && a.porcentaje !== undefined || a.porcentaje > 0 : stryMutAct_9fa48("22717") ? false : stryMutAct_9fa48("22716") ? true : (stryCov_9fa48("22716", "22717", "22718"), (stryMutAct_9fa48("22720") ? a.porcentaje !== null || a.porcentaje !== undefined : stryMutAct_9fa48("22719") ? true : (stryCov_9fa48("22719", "22720"), (stryMutAct_9fa48("22722") ? a.porcentaje === null : stryMutAct_9fa48("22721") ? true : (stryCov_9fa48("22721", "22722"), a.porcentaje !== null)) && (stryMutAct_9fa48("22724") ? a.porcentaje === undefined : stryMutAct_9fa48("22723") ? true : (stryCov_9fa48("22723", "22724"), a.porcentaje !== undefined)))) && (stryMutAct_9fa48("22727") ? a.porcentaje <= 0 : stryMutAct_9fa48("22726") ? a.porcentaje >= 0 : stryMutAct_9fa48("22725") ? true : (stryCov_9fa48("22725", "22726", "22727"), a.porcentaje > 0))))));
    if (stryMutAct_9fa48("22731") ? validAttempts.length >= 3 : stryMutAct_9fa48("22730") ? validAttempts.length <= 3 : stryMutAct_9fa48("22729") ? false : stryMutAct_9fa48("22728") ? true : (stryCov_9fa48("22728", "22729", "22730", "22731"), validAttempts.length < 3)) {
      if (stryMutAct_9fa48("22732")) {
        {}
      } else {
        stryCov_9fa48("22732");
        return null;
      }
    }

    // Calcular promedio de los últimos intentos (últimos 5 o todos si son menos)
    const recentAttempts = stryMutAct_9fa48("22733") ? validAttempts : (stryCov_9fa48("22733"), validAttempts.slice(stryMutAct_9fa48("22734") ? +5 : (stryCov_9fa48("22734"), -5)));
    const averagePercentage = stryMutAct_9fa48("22735") ? recentAttempts.reduce((sum, a) => sum + a.porcentaje, 0) * recentAttempts.length : (stryCov_9fa48("22735"), recentAttempts.reduce(stryMutAct_9fa48("22736") ? () => undefined : (stryCov_9fa48("22736"), (sum, a) => stryMutAct_9fa48("22737") ? sum - a.porcentaje : (stryCov_9fa48("22737"), sum + a.porcentaje)), 0) / recentAttempts.length);

    // Calcular tendencia (mejora o declive)
    const firstHalf = stryMutAct_9fa48("22738") ? recentAttempts : (stryCov_9fa48("22738"), recentAttempts.slice(0, Math.floor(stryMutAct_9fa48("22739") ? recentAttempts.length * 2 : (stryCov_9fa48("22739"), recentAttempts.length / 2))));
    const secondHalf = stryMutAct_9fa48("22740") ? recentAttempts : (stryCov_9fa48("22740"), recentAttempts.slice(Math.floor(stryMutAct_9fa48("22741") ? recentAttempts.length * 2 : (stryCov_9fa48("22741"), recentAttempts.length / 2))));

    // Validación defensiva: asegurar que ambas mitades tengan al menos un elemento
    let trend = 0;
    if (stryMutAct_9fa48("22744") ? firstHalf.length > 0 || secondHalf.length > 0 : stryMutAct_9fa48("22743") ? false : stryMutAct_9fa48("22742") ? true : (stryCov_9fa48("22742", "22743", "22744"), (stryMutAct_9fa48("22747") ? firstHalf.length <= 0 : stryMutAct_9fa48("22746") ? firstHalf.length >= 0 : stryMutAct_9fa48("22745") ? true : (stryCov_9fa48("22745", "22746", "22747"), firstHalf.length > 0)) && (stryMutAct_9fa48("22750") ? secondHalf.length <= 0 : stryMutAct_9fa48("22749") ? secondHalf.length >= 0 : stryMutAct_9fa48("22748") ? true : (stryCov_9fa48("22748", "22749", "22750"), secondHalf.length > 0)))) {
      if (stryMutAct_9fa48("22751")) {
        {}
      } else {
        stryCov_9fa48("22751");
        const firstAvg = stryMutAct_9fa48("22752") ? firstHalf.reduce((sum, a) => sum + a.porcentaje, 0) * firstHalf.length : (stryCov_9fa48("22752"), firstHalf.reduce(stryMutAct_9fa48("22753") ? () => undefined : (stryCov_9fa48("22753"), (sum, a) => stryMutAct_9fa48("22754") ? sum - a.porcentaje : (stryCov_9fa48("22754"), sum + a.porcentaje)), 0) / firstHalf.length);
        const secondAvg = stryMutAct_9fa48("22755") ? secondHalf.reduce((sum, a) => sum + a.porcentaje, 0) * secondHalf.length : (stryCov_9fa48("22755"), secondHalf.reduce(stryMutAct_9fa48("22756") ? () => undefined : (stryCov_9fa48("22756"), (sum, a) => stryMutAct_9fa48("22757") ? sum - a.porcentaje : (stryCov_9fa48("22757"), sum + a.porcentaje)), 0) / secondHalf.length);
        trend = stryMutAct_9fa48("22758") ? secondAvg + firstAvg : (stryCov_9fa48("22758"), secondAvg - firstAvg);
      }
    }

    // Estimar puntaje PAES (rango típico: 150-850)
    // Asumiendo que 100% = 850 puntos y 0% = 150 puntos
    const baseScore = 150;
    const maxScore = 850;
    const scoreRange = stryMutAct_9fa48("22759") ? maxScore + baseScore : (stryCov_9fa48("22759"), maxScore - baseScore);
    const predictedScore = stryMutAct_9fa48("22760") ? baseScore - averagePercentage / 100 * scoreRange : (stryCov_9fa48("22760"), baseScore + (stryMutAct_9fa48("22761") ? averagePercentage / 100 / scoreRange : (stryCov_9fa48("22761"), (stryMutAct_9fa48("22762") ? averagePercentage * 100 : (stryCov_9fa48("22762"), averagePercentage / 100)) * scoreRange)));

    // Ajustar según tendencia
    const trendAdjustment = stryMutAct_9fa48("22763") ? trend / 100 * scoreRange / 0.3 : (stryCov_9fa48("22763"), (stryMutAct_9fa48("22764") ? trend / 100 / scoreRange : (stryCov_9fa48("22764"), (stryMutAct_9fa48("22765") ? trend * 100 : (stryCov_9fa48("22765"), trend / 100)) * scoreRange)) * 0.3); // Factor de ajuste conservador
    const adjustedScore = stryMutAct_9fa48("22766") ? predictedScore - trendAdjustment : (stryCov_9fa48("22766"), predictedScore + trendAdjustment);

    // Calcular rango de confianza
    const variance = stryMutAct_9fa48("22767") ? recentAttempts.reduce((sum, a) => {
      const diff = a.porcentaje - averagePercentage;
      return sum + diff * diff;
    }, 0) * recentAttempts.length : (stryCov_9fa48("22767"), recentAttempts.reduce((sum, a) => {
      if (stryMutAct_9fa48("22768")) {
        {}
      } else {
        stryCov_9fa48("22768");
        const diff = stryMutAct_9fa48("22769") ? a.porcentaje + averagePercentage : (stryCov_9fa48("22769"), a.porcentaje - averagePercentage);
        return stryMutAct_9fa48("22770") ? sum - diff * diff : (stryCov_9fa48("22770"), sum + (stryMutAct_9fa48("22771") ? diff / diff : (stryCov_9fa48("22771"), diff * diff)));
      }
    }, 0) / recentAttempts.length);
    const stdDev = Math.sqrt(variance);
    const margin = stryMutAct_9fa48("22772") ? stdDev / 100 / scoreRange : (stryCov_9fa48("22772"), (stryMutAct_9fa48("22773") ? stdDev * 100 : (stryCov_9fa48("22773"), stdDev / 100)) * scoreRange);

    // Determinar confianza
    let confidence: 'high' | 'medium' | 'low';
    if (stryMutAct_9fa48("22777") ? stdDev >= 5 : stryMutAct_9fa48("22776") ? stdDev <= 5 : stryMutAct_9fa48("22775") ? false : stryMutAct_9fa48("22774") ? true : (stryCov_9fa48("22774", "22775", "22776", "22777"), stdDev < 5)) {
      if (stryMutAct_9fa48("22778")) {
        {}
      } else {
        stryCov_9fa48("22778");
        confidence = stryMutAct_9fa48("22779") ? "" : (stryCov_9fa48("22779"), 'high');
      }
    } else if (stryMutAct_9fa48("22783") ? stdDev >= 15 : stryMutAct_9fa48("22782") ? stdDev <= 15 : stryMutAct_9fa48("22781") ? false : stryMutAct_9fa48("22780") ? true : (stryCov_9fa48("22780", "22781", "22782", "22783"), stdDev < 15)) {
      if (stryMutAct_9fa48("22784")) {
        {}
      } else {
        stryCov_9fa48("22784");
        confidence = stryMutAct_9fa48("22785") ? "" : (stryCov_9fa48("22785"), 'medium');
      }
    } else {
      if (stryMutAct_9fa48("22786")) {
        {}
      } else {
        stryCov_9fa48("22786");
        confidence = stryMutAct_9fa48("22787") ? "" : (stryCov_9fa48("22787"), 'low');
      }
    }

    // Factores que influyen
    const factors: string[] = stryMutAct_9fa48("22788") ? ["Stryker was here"] : (stryCov_9fa48("22788"), []);
    if (stryMutAct_9fa48("22792") ? trend <= 5 : stryMutAct_9fa48("22791") ? trend >= 5 : stryMutAct_9fa48("22790") ? false : stryMutAct_9fa48("22789") ? true : (stryCov_9fa48("22789", "22790", "22791", "22792"), trend > 5)) {
      if (stryMutAct_9fa48("22793")) {
        {}
      } else {
        stryCov_9fa48("22793");
        factors.push(stryMutAct_9fa48("22794") ? "" : (stryCov_9fa48("22794"), 'Tendencia de mejora'));
      }
    } else if (stryMutAct_9fa48("22798") ? trend >= -5 : stryMutAct_9fa48("22797") ? trend <= -5 : stryMutAct_9fa48("22796") ? false : stryMutAct_9fa48("22795") ? true : (stryCov_9fa48("22795", "22796", "22797", "22798"), trend < (stryMutAct_9fa48("22799") ? +5 : (stryCov_9fa48("22799"), -5)))) {
      if (stryMutAct_9fa48("22800")) {
        {}
      } else {
        stryCov_9fa48("22800");
        factors.push(stryMutAct_9fa48("22801") ? "" : (stryCov_9fa48("22801"), 'Tendencia de declive'));
      }
    }
    if (stryMutAct_9fa48("22805") ? recentAttempts.length < 5 : stryMutAct_9fa48("22804") ? recentAttempts.length > 5 : stryMutAct_9fa48("22803") ? false : stryMutAct_9fa48("22802") ? true : (stryCov_9fa48("22802", "22803", "22804", "22805"), recentAttempts.length >= 5)) {
      if (stryMutAct_9fa48("22806")) {
        {}
      } else {
        stryCov_9fa48("22806");
        factors.push(stryMutAct_9fa48("22807") ? "" : (stryCov_9fa48("22807"), 'Múltiples intentos recientes'));
      }
    }
    if (stryMutAct_9fa48("22811") ? stdDev >= 10 : stryMutAct_9fa48("22810") ? stdDev <= 10 : stryMutAct_9fa48("22809") ? false : stryMutAct_9fa48("22808") ? true : (stryCov_9fa48("22808", "22809", "22810", "22811"), stdDev < 10)) {
      if (stryMutAct_9fa48("22812")) {
        {}
      } else {
        stryCov_9fa48("22812");
        factors.push(stryMutAct_9fa48("22813") ? "" : (stryCov_9fa48("22813"), 'Rendimiento consistente'));
      }
    } else {
      if (stryMutAct_9fa48("22814")) {
        {}
      } else {
        stryCov_9fa48("22814");
        factors.push(stryMutAct_9fa48("22815") ? "" : (stryCov_9fa48("22815"), 'Rendimiento variable'));
      }
    }
    return stryMutAct_9fa48("22816") ? {} : (stryCov_9fa48("22816"), {
      predictedScore: Math.round(stryMutAct_9fa48("22817") ? Math.min(150, Math.min(850, adjustedScore)) : (stryCov_9fa48("22817"), Math.max(150, stryMutAct_9fa48("22818") ? Math.max(850, adjustedScore) : (stryCov_9fa48("22818"), Math.min(850, adjustedScore))))),
      confidence,
      factors,
      estimatedRange: stryMutAct_9fa48("22819") ? {} : (stryCov_9fa48("22819"), {
        min: Math.round(stryMutAct_9fa48("22820") ? Math.min(150, adjustedScore - margin) : (stryCov_9fa48("22820"), Math.max(150, stryMutAct_9fa48("22821") ? adjustedScore + margin : (stryCov_9fa48("22821"), adjustedScore - margin)))),
        max: Math.round(stryMutAct_9fa48("22822") ? Math.max(850, adjustedScore + margin) : (stryCov_9fa48("22822"), Math.min(850, stryMutAct_9fa48("22823") ? adjustedScore - margin : (stryCov_9fa48("22823"), adjustedScore + margin))))
      })
    });
  }
}

/**
 * Compara con promedio general (simulado)
 */
export function compareWithAverage(studentAverage: number): ComparisonData {
  if (stryMutAct_9fa48("22824")) {
    {}
  } else {
    stryCov_9fa48("22824");
    // En una implementación real, esto vendría de la base de datos
    // Por ahora, simulamos un promedio general de 60%
    const overallAverage = 60;
    const difference = stryMutAct_9fa48("22825") ? studentAverage + overallAverage : (stryCov_9fa48("22825"), studentAverage - overallAverage);
    const comparison: 'above' | 'below' | 'equal' = (stryMutAct_9fa48("22829") ? difference <= 5 : stryMutAct_9fa48("22828") ? difference >= 5 : stryMutAct_9fa48("22827") ? false : stryMutAct_9fa48("22826") ? true : (stryCov_9fa48("22826", "22827", "22828", "22829"), difference > 5)) ? stryMutAct_9fa48("22830") ? "" : (stryCov_9fa48("22830"), 'above') : (stryMutAct_9fa48("22834") ? difference >= -5 : stryMutAct_9fa48("22833") ? difference <= -5 : stryMutAct_9fa48("22832") ? false : stryMutAct_9fa48("22831") ? true : (stryCov_9fa48("22831", "22832", "22833", "22834"), difference < (stryMutAct_9fa48("22835") ? +5 : (stryCov_9fa48("22835"), -5)))) ? stryMutAct_9fa48("22836") ? "" : (stryCov_9fa48("22836"), 'below') : stryMutAct_9fa48("22837") ? "" : (stryCov_9fa48("22837"), 'equal');

    // Calcular percentil aproximado (simulado)
    // En producción, esto se calcularía con datos reales
    let percentile = 50;
    if (stryMutAct_9fa48("22841") ? studentAverage < 80 : stryMutAct_9fa48("22840") ? studentAverage > 80 : stryMutAct_9fa48("22839") ? false : stryMutAct_9fa48("22838") ? true : (stryCov_9fa48("22838", "22839", "22840", "22841"), studentAverage >= 80)) percentile = 90;else if (stryMutAct_9fa48("22845") ? studentAverage < 70 : stryMutAct_9fa48("22844") ? studentAverage > 70 : stryMutAct_9fa48("22843") ? false : stryMutAct_9fa48("22842") ? true : (stryCov_9fa48("22842", "22843", "22844", "22845"), studentAverage >= 70)) percentile = 75;else if (stryMutAct_9fa48("22849") ? studentAverage < 60 : stryMutAct_9fa48("22848") ? studentAverage > 60 : stryMutAct_9fa48("22847") ? false : stryMutAct_9fa48("22846") ? true : (stryCov_9fa48("22846", "22847", "22848", "22849"), studentAverage >= 60)) percentile = 50;else if (stryMutAct_9fa48("22853") ? studentAverage < 50 : stryMutAct_9fa48("22852") ? studentAverage > 50 : stryMutAct_9fa48("22851") ? false : stryMutAct_9fa48("22850") ? true : (stryCov_9fa48("22850", "22851", "22852", "22853"), studentAverage >= 50)) percentile = 30;else percentile = 15;
    return stryMutAct_9fa48("22854") ? {} : (stryCov_9fa48("22854"), {
      studentAverage,
      overallAverage,
      percentile,
      comparison
    });
  }
}

/**
 * Analiza rendimiento por asignatura
 */
export function analyzeSubjectBreakdown(attempts: Attempt[]): Array<{
  subject: string;
  average: number;
  trend: 'improving' | 'declining' | 'stable';
  attempts: number;
}> {
  if (stryMutAct_9fa48("22855")) {
    {}
  } else {
    stryCov_9fa48("22855");
    // Agrupar por asignatura
    const bySubject = new Map<string, Attempt[]>();
    attempts.forEach(attempt => {
      if (stryMutAct_9fa48("22856")) {
        {}
      } else {
        stryCov_9fa48("22856");
        const subjectCode = attempt.exam.subject.codigo;
        if (stryMutAct_9fa48("22859") ? false : stryMutAct_9fa48("22858") ? true : stryMutAct_9fa48("22857") ? bySubject.has(subjectCode) : (stryCov_9fa48("22857", "22858", "22859"), !bySubject.has(subjectCode))) {
          if (stryMutAct_9fa48("22860")) {
            {}
          } else {
            stryCov_9fa48("22860");
            bySubject.set(subjectCode, stryMutAct_9fa48("22861") ? ["Stryker was here"] : (stryCov_9fa48("22861"), []));
          }
        }
        bySubject.get(subjectCode)!.push(attempt);
      }
    });
    const breakdown: Array<{
      subject: string;
      average: number;
      trend: 'improving' | 'declining' | 'stable';
      attempts: number;
    }> = stryMutAct_9fa48("22862") ? ["Stryker was here"] : (stryCov_9fa48("22862"), []);
    bySubject.forEach((subjectAttempts, subjectCode) => {
      if (stryMutAct_9fa48("22863")) {
        {}
      } else {
        stryCov_9fa48("22863");
        if (stryMutAct_9fa48("22867") ? subjectAttempts.length >= 2 : stryMutAct_9fa48("22866") ? subjectAttempts.length <= 2 : stryMutAct_9fa48("22865") ? false : stryMutAct_9fa48("22864") ? true : (stryCov_9fa48("22864", "22865", "22866", "22867"), subjectAttempts.length < 2)) return; // Necesita al menos 2 intentos

        const sorted = stryMutAct_9fa48("22868") ? subjectAttempts : (stryCov_9fa48("22868"), subjectAttempts.sort(stryMutAct_9fa48("22869") ? () => undefined : (stryCov_9fa48("22869"), (a, b) => stryMutAct_9fa48("22870") ? new Date(a.createdAt).getTime() + new Date(b.createdAt).getTime() : (stryCov_9fa48("22870"), new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))));
        const average = stryMutAct_9fa48("22871") ? sorted.reduce((sum, a) => sum + a.porcentaje, 0) * sorted.length : (stryCov_9fa48("22871"), sorted.reduce(stryMutAct_9fa48("22872") ? () => undefined : (stryCov_9fa48("22872"), (sum, a) => stryMutAct_9fa48("22873") ? sum - a.porcentaje : (stryCov_9fa48("22873"), sum + a.porcentaje)), 0) / sorted.length);

        // Calcular tendencia
        const firstHalf = stryMutAct_9fa48("22874") ? sorted : (stryCov_9fa48("22874"), sorted.slice(0, Math.floor(stryMutAct_9fa48("22875") ? sorted.length * 2 : (stryCov_9fa48("22875"), sorted.length / 2))));
        const secondHalf = stryMutAct_9fa48("22876") ? sorted : (stryCov_9fa48("22876"), sorted.slice(Math.floor(stryMutAct_9fa48("22877") ? sorted.length * 2 : (stryCov_9fa48("22877"), sorted.length / 2))));

        // Validación defensiva: asegurar que ambas mitades tengan al menos un elemento
        let trend: 'improving' | 'declining' | 'stable' = stryMutAct_9fa48("22878") ? "" : (stryCov_9fa48("22878"), 'stable');
        if (stryMutAct_9fa48("22881") ? firstHalf.length > 0 || secondHalf.length > 0 : stryMutAct_9fa48("22880") ? false : stryMutAct_9fa48("22879") ? true : (stryCov_9fa48("22879", "22880", "22881"), (stryMutAct_9fa48("22884") ? firstHalf.length <= 0 : stryMutAct_9fa48("22883") ? firstHalf.length >= 0 : stryMutAct_9fa48("22882") ? true : (stryCov_9fa48("22882", "22883", "22884"), firstHalf.length > 0)) && (stryMutAct_9fa48("22887") ? secondHalf.length <= 0 : stryMutAct_9fa48("22886") ? secondHalf.length >= 0 : stryMutAct_9fa48("22885") ? true : (stryCov_9fa48("22885", "22886", "22887"), secondHalf.length > 0)))) {
          if (stryMutAct_9fa48("22888")) {
            {}
          } else {
            stryCov_9fa48("22888");
            const firstAvg = stryMutAct_9fa48("22889") ? firstHalf.reduce((sum, a) => sum + a.porcentaje, 0) * firstHalf.length : (stryCov_9fa48("22889"), firstHalf.reduce(stryMutAct_9fa48("22890") ? () => undefined : (stryCov_9fa48("22890"), (sum, a) => stryMutAct_9fa48("22891") ? sum - a.porcentaje : (stryCov_9fa48("22891"), sum + a.porcentaje)), 0) / firstHalf.length);
            const secondAvg = stryMutAct_9fa48("22892") ? secondHalf.reduce((sum, a) => sum + a.porcentaje, 0) * secondHalf.length : (stryCov_9fa48("22892"), secondHalf.reduce(stryMutAct_9fa48("22893") ? () => undefined : (stryCov_9fa48("22893"), (sum, a) => stryMutAct_9fa48("22894") ? sum - a.porcentaje : (stryCov_9fa48("22894"), sum + a.porcentaje)), 0) / secondHalf.length);
            const trendDiff = stryMutAct_9fa48("22895") ? secondAvg + firstAvg : (stryCov_9fa48("22895"), secondAvg - firstAvg);
            trend = (stryMutAct_9fa48("22899") ? trendDiff <= 3 : stryMutAct_9fa48("22898") ? trendDiff >= 3 : stryMutAct_9fa48("22897") ? false : stryMutAct_9fa48("22896") ? true : (stryCov_9fa48("22896", "22897", "22898", "22899"), trendDiff > 3)) ? stryMutAct_9fa48("22900") ? "" : (stryCov_9fa48("22900"), 'improving') : (stryMutAct_9fa48("22904") ? trendDiff >= -3 : stryMutAct_9fa48("22903") ? trendDiff <= -3 : stryMutAct_9fa48("22902") ? false : stryMutAct_9fa48("22901") ? true : (stryCov_9fa48("22901", "22902", "22903", "22904"), trendDiff < (stryMutAct_9fa48("22905") ? +3 : (stryCov_9fa48("22905"), -3)))) ? stryMutAct_9fa48("22906") ? "" : (stryCov_9fa48("22906"), 'declining') : stryMutAct_9fa48("22907") ? "" : (stryCov_9fa48("22907"), 'stable');
          }
        }
        breakdown.push(stryMutAct_9fa48("22908") ? {} : (stryCov_9fa48("22908"), {
          subject: sorted[0].exam.subject.nombre,
          average: stryMutAct_9fa48("22909") ? Math.round(average * 10) * 10 : (stryCov_9fa48("22909"), Math.round(stryMutAct_9fa48("22910") ? average / 10 : (stryCov_9fa48("22910"), average * 10)) / 10),
          trend,
          attempts: sorted.length
        }));
      }
    });
    return stryMutAct_9fa48("22911") ? breakdown : (stryCov_9fa48("22911"), breakdown.sort(stryMutAct_9fa48("22912") ? () => undefined : (stryCov_9fa48("22912"), (a, b) => stryMutAct_9fa48("22913") ? b.average + a.average : (stryCov_9fa48("22913"), b.average - a.average))));
  }
}

/**
 * Genera análisis avanzado completo
 */
export function generateAdvancedAnalytics(attempts: Attempt[], metrics: Metric[]): AdvancedAnalytics {
  if (stryMutAct_9fa48("22914")) {
    {}
  } else {
    stryCov_9fa48("22914");
    const trends = analyzeTrends(attempts);
    const {
      strengths,
      weaknesses
    } = analyzeStrengthsWeaknesses(metrics);
    const paesPrediction = predictPAESScore(attempts);
    const studentAverage = (stryMutAct_9fa48("22918") ? attempts.length <= 0 : stryMutAct_9fa48("22917") ? attempts.length >= 0 : stryMutAct_9fa48("22916") ? false : stryMutAct_9fa48("22915") ? true : (stryCov_9fa48("22915", "22916", "22917", "22918"), attempts.length > 0)) ? stryMutAct_9fa48("22919") ? attempts.reduce((sum, a) => sum + a.porcentaje, 0) * attempts.length : (stryCov_9fa48("22919"), attempts.reduce(stryMutAct_9fa48("22920") ? () => undefined : (stryCov_9fa48("22920"), (sum, a) => stryMutAct_9fa48("22921") ? sum - a.porcentaje : (stryCov_9fa48("22921"), sum + a.porcentaje)), 0) / attempts.length) : 0;
    const comparison = (stryMutAct_9fa48("22925") ? attempts.length <= 0 : stryMutAct_9fa48("22924") ? attempts.length >= 0 : stryMutAct_9fa48("22923") ? false : stryMutAct_9fa48("22922") ? true : (stryCov_9fa48("22922", "22923", "22924", "22925"), attempts.length > 0)) ? compareWithAverage(studentAverage) : null;
    const subjectBreakdown = analyzeSubjectBreakdown(attempts);
    return stryMutAct_9fa48("22926") ? {} : (stryCov_9fa48("22926"), {
      trends,
      strengths,
      weaknesses,
      paesPrediction,
      comparison,
      subjectBreakdown
    });
  }
}