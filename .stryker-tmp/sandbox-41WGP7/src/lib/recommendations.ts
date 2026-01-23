/**
 * Sistema de Recomendaciones Inteligentes
 *
 * Analiza el rendimiento del estudiante y genera recomendaciones personalizadas
 * basadas en debilidades, fortalezas y patrones de rendimiento.
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
export interface TopicRecommendation {
  topicId: string;
  topicName: string;
  subjectName: string;
  subjectCode: string;
  currentPercentage: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedActions: string[];
}
export interface ExamRecommendation {
  examId: string;
  examTitle: string;
  subjectName: string;
  subjectCode: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  focusTopics: string[];
}
export interface StudyPlan {
  weeklyGoals: Array<{
    week: number;
    topics: string[];
    exams: string[];
    description: string;
  }>;
  estimatedCompletion: string;
  focusAreas: string[];
}
export interface Recommendations {
  topics: TopicRecommendation[];
  exams: ExamRecommendation[];
  studyPlan: StudyPlan | null;
  summary: {
    totalRecommendations: number;
    highPriority: number;
    estimatedStudyTime: string;
  };
}
export interface PerformanceMetric {
  topicId: string;
  topicName: string;
  subjectName: string;
  subjectCode: string;
  porcentaje: number;
  totalPreguntas: number;
  correctas: number;
  nivel: string | null;
}
interface Exam {
  id: string;
  titulo: string;
  subjectId: string;
  subject: {
    nombre: string;
    codigo: string;
  };
  questions: Array<{
    question: {
      topicId: string | null;
    };
  }>;
}

/**
 * Analiza métricas y genera recomendaciones de temas
 */
export function analyzeTopicRecommendations(metrics: PerformanceMetric[]): TopicRecommendation[] {
  if (stryMutAct_9fa48("25524")) {
    {}
  } else {
    stryCov_9fa48("25524");
    const recommendations: TopicRecommendation[] = stryMutAct_9fa48("25525") ? ["Stryker was here"] : (stryCov_9fa48("25525"), []);

    // Clasificar temas por rendimiento
    const weakTopics = stryMutAct_9fa48("25526") ? metrics : (stryCov_9fa48("25526"), metrics.filter(stryMutAct_9fa48("25527") ? () => undefined : (stryCov_9fa48("25527"), m => stryMutAct_9fa48("25530") ? m.porcentaje < 50 || m.totalPreguntas >= 3 : stryMutAct_9fa48("25529") ? false : stryMutAct_9fa48("25528") ? true : (stryCov_9fa48("25528", "25529", "25530"), (stryMutAct_9fa48("25533") ? m.porcentaje >= 50 : stryMutAct_9fa48("25532") ? m.porcentaje <= 50 : stryMutAct_9fa48("25531") ? true : (stryCov_9fa48("25531", "25532", "25533"), m.porcentaje < 50)) && (stryMutAct_9fa48("25536") ? m.totalPreguntas < 3 : stryMutAct_9fa48("25535") ? m.totalPreguntas > 3 : stryMutAct_9fa48("25534") ? true : (stryCov_9fa48("25534", "25535", "25536"), m.totalPreguntas >= 3))))));
    const mediumTopics = stryMutAct_9fa48("25537") ? metrics : (stryCov_9fa48("25537"), metrics.filter(stryMutAct_9fa48("25538") ? () => undefined : (stryCov_9fa48("25538"), m => stryMutAct_9fa48("25541") ? m.porcentaje >= 50 && m.porcentaje < 70 || m.totalPreguntas >= 3 : stryMutAct_9fa48("25540") ? false : stryMutAct_9fa48("25539") ? true : (stryCov_9fa48("25539", "25540", "25541"), (stryMutAct_9fa48("25543") ? m.porcentaje >= 50 || m.porcentaje < 70 : stryMutAct_9fa48("25542") ? true : (stryCov_9fa48("25542", "25543"), (stryMutAct_9fa48("25546") ? m.porcentaje < 50 : stryMutAct_9fa48("25545") ? m.porcentaje > 50 : stryMutAct_9fa48("25544") ? true : (stryCov_9fa48("25544", "25545", "25546"), m.porcentaje >= 50)) && (stryMutAct_9fa48("25549") ? m.porcentaje >= 70 : stryMutAct_9fa48("25548") ? m.porcentaje <= 70 : stryMutAct_9fa48("25547") ? true : (stryCov_9fa48("25547", "25548", "25549"), m.porcentaje < 70)))) && (stryMutAct_9fa48("25552") ? m.totalPreguntas < 3 : stryMutAct_9fa48("25551") ? m.totalPreguntas > 3 : stryMutAct_9fa48("25550") ? true : (stryCov_9fa48("25550", "25551", "25552"), m.totalPreguntas >= 3))))));
    const strongTopics = stryMutAct_9fa48("25553") ? metrics : (stryCov_9fa48("25553"), metrics.filter(stryMutAct_9fa48("25554") ? () => undefined : (stryCov_9fa48("25554"), m => stryMutAct_9fa48("25558") ? m.porcentaje < 70 : stryMutAct_9fa48("25557") ? m.porcentaje > 70 : stryMutAct_9fa48("25556") ? false : stryMutAct_9fa48("25555") ? true : (stryCov_9fa48("25555", "25556", "25557", "25558"), m.porcentaje >= 70))));

    // Temas débiles (alta prioridad)
    weakTopics.forEach(topic => {
      if (stryMutAct_9fa48("25559")) {
        {}
      } else {
        stryCov_9fa48("25559");
        const priority: 'high' | 'medium' | 'low' = (stryMutAct_9fa48("25563") ? topic.porcentaje >= 30 : stryMutAct_9fa48("25562") ? topic.porcentaje <= 30 : stryMutAct_9fa48("25561") ? false : stryMutAct_9fa48("25560") ? true : (stryCov_9fa48("25560", "25561", "25562", "25563"), topic.porcentaje < 30)) ? stryMutAct_9fa48("25564") ? "" : (stryCov_9fa48("25564"), 'high') : stryMutAct_9fa48("25565") ? "" : (stryCov_9fa48("25565"), 'medium');
        recommendations.push(stryMutAct_9fa48("25566") ? {} : (stryCov_9fa48("25566"), {
          topicId: topic.topicId,
          topicName: topic.topicName,
          subjectName: topic.subjectName,
          subjectCode: topic.subjectCode,
          currentPercentage: topic.porcentaje,
          priority,
          reason: (stryMutAct_9fa48("25570") ? topic.porcentaje >= 30 : stryMutAct_9fa48("25569") ? topic.porcentaje <= 30 : stryMutAct_9fa48("25568") ? false : stryMutAct_9fa48("25567") ? true : (stryCov_9fa48("25567", "25568", "25569", "25570"), topic.porcentaje < 30)) ? stryMutAct_9fa48("25571") ? `` : (stryCov_9fa48("25571"), `Rendimiento muy bajo (${topic.porcentaje.toFixed(1)}%). Necesitas reforzar este tema urgentemente.`) : stryMutAct_9fa48("25572") ? `` : (stryCov_9fa48("25572"), `Rendimiento bajo (${topic.porcentaje.toFixed(1)}%). Deberías estudiar más este tema.`),
          suggestedActions: stryMutAct_9fa48("25573") ? [] : (stryCov_9fa48("25573"), [stryMutAct_9fa48("25574") ? "" : (stryCov_9fa48("25574"), 'Revisa los conceptos fundamentales'), stryMutAct_9fa48("25575") ? "" : (stryCov_9fa48("25575"), 'Practica con ejercicios específicos'), stryMutAct_9fa48("25576") ? "" : (stryCov_9fa48("25576"), 'Estudia materiales de apoyo'), stryMutAct_9fa48("25577") ? "" : (stryCov_9fa48("25577"), 'Realiza un examen enfocado en este tema')])
        }));
      }
    });

    // Temas medios (prioridad media)
    mediumTopics.forEach(topic => {
      if (stryMutAct_9fa48("25578")) {
        {}
      } else {
        stryCov_9fa48("25578");
        recommendations.push(stryMutAct_9fa48("25579") ? {} : (stryCov_9fa48("25579"), {
          topicId: topic.topicId,
          topicName: topic.topicName,
          subjectName: topic.subjectName,
          subjectCode: topic.subjectCode,
          currentPercentage: topic.porcentaje,
          priority: stryMutAct_9fa48("25580") ? "" : (stryCov_9fa48("25580"), 'medium'),
          reason: stryMutAct_9fa48("25581") ? `` : (stryCov_9fa48("25581"), `Rendimiento medio (${topic.porcentaje.toFixed(1)}%). Con un poco más de práctica podrías mejorar significativamente.`),
          suggestedActions: stryMutAct_9fa48("25582") ? [] : (stryCov_9fa48("25582"), [stryMutAct_9fa48("25583") ? "" : (stryCov_9fa48("25583"), 'Practica ejercicios adicionales'), stryMutAct_9fa48("25584") ? "" : (stryCov_9fa48("25584"), 'Revisa los errores comunes'), stryMutAct_9fa48("25585") ? "" : (stryCov_9fa48("25585"), 'Realiza un examen de práctica')])
        }));
      }
    });

    // Ordenar por prioridad y porcentaje
    return stryMutAct_9fa48("25586") ? recommendations : (stryCov_9fa48("25586"), recommendations.sort((a, b) => {
      if (stryMutAct_9fa48("25587")) {
        {}
      } else {
        stryCov_9fa48("25587");
        const priorityOrder = stryMutAct_9fa48("25588") ? {} : (stryCov_9fa48("25588"), {
          high: 0,
          medium: 1,
          low: 2
        });
        if (stryMutAct_9fa48("25591") ? priorityOrder[a.priority] === priorityOrder[b.priority] : stryMutAct_9fa48("25590") ? false : stryMutAct_9fa48("25589") ? true : (stryCov_9fa48("25589", "25590", "25591"), priorityOrder[a.priority] !== priorityOrder[b.priority])) {
          if (stryMutAct_9fa48("25592")) {
            {}
          } else {
            stryCov_9fa48("25592");
            return stryMutAct_9fa48("25593") ? priorityOrder[a.priority] + priorityOrder[b.priority] : (stryCov_9fa48("25593"), priorityOrder[a.priority] - priorityOrder[b.priority]);
          }
        }
        return stryMutAct_9fa48("25594") ? a.currentPercentage + b.currentPercentage : (stryCov_9fa48("25594"), a.currentPercentage - b.currentPercentage);
      }
    }));
  }
}

/**
 * Analiza exámenes disponibles y recomienda basado en debilidades
 */
export function analyzeExamRecommendations(weakTopics: TopicRecommendation[], availableExams: Exam[]): ExamRecommendation[] {
  if (stryMutAct_9fa48("25595")) {
    {}
  } else {
    stryCov_9fa48("25595");
    const recommendations: ExamRecommendation[] = stryMutAct_9fa48("25596") ? ["Stryker was here"] : (stryCov_9fa48("25596"), []);

    // Agrupar temas débiles por asignatura
    const weakTopicsBySubject = new Map<string, TopicRecommendation[]>();
    weakTopics.forEach(topic => {
      if (stryMutAct_9fa48("25597")) {
        {}
      } else {
        stryCov_9fa48("25597");
        if (stryMutAct_9fa48("25600") ? false : stryMutAct_9fa48("25599") ? true : stryMutAct_9fa48("25598") ? weakTopicsBySubject.has(topic.subjectCode) : (stryCov_9fa48("25598", "25599", "25600"), !weakTopicsBySubject.has(topic.subjectCode))) {
          if (stryMutAct_9fa48("25601")) {
            {}
          } else {
            stryCov_9fa48("25601");
            weakTopicsBySubject.set(topic.subjectCode, stryMutAct_9fa48("25602") ? ["Stryker was here"] : (stryCov_9fa48("25602"), []));
          }
        }
        weakTopicsBySubject.get(topic.subjectCode)!.push(topic);
      }
    });

    // Para cada asignatura con temas débiles, buscar exámenes relevantes
    weakTopicsBySubject.forEach((topics, subjectCode) => {
      if (stryMutAct_9fa48("25603")) {
        {}
      } else {
        stryCov_9fa48("25603");
        const relevantExams = stryMutAct_9fa48("25604") ? availableExams : (stryCov_9fa48("25604"), availableExams.filter(stryMutAct_9fa48("25605") ? () => undefined : (stryCov_9fa48("25605"), exam => stryMutAct_9fa48("25608") ? exam.subject.codigo !== subjectCode : stryMutAct_9fa48("25607") ? false : stryMutAct_9fa48("25606") ? true : (stryCov_9fa48("25606", "25607", "25608"), exam.subject.codigo === subjectCode))));
        relevantExams.forEach(exam => {
          if (stryMutAct_9fa48("25609")) {
            {}
          } else {
            stryCov_9fa48("25609");
            // Contar cuántos temas débiles están en este examen
            const examTopicIds = new Set(stryMutAct_9fa48("25610") ? exam.questions.map(q => q.question.topicId) : (stryCov_9fa48("25610"), exam.questions.map(stryMutAct_9fa48("25611") ? () => undefined : (stryCov_9fa48("25611"), q => q.question.topicId)).filter(stryMutAct_9fa48("25612") ? () => undefined : (stryCov_9fa48("25612"), (id): id is string => stryMutAct_9fa48("25615") ? id === null : stryMutAct_9fa48("25614") ? false : stryMutAct_9fa48("25613") ? true : (stryCov_9fa48("25613", "25614", "25615"), id !== null)))));
            const matchingTopics = stryMutAct_9fa48("25616") ? topics : (stryCov_9fa48("25616"), topics.filter(stryMutAct_9fa48("25617") ? () => undefined : (stryCov_9fa48("25617"), t => examTopicIds.has(t.topicId))));
            if (stryMutAct_9fa48("25621") ? matchingTopics.length <= 0 : stryMutAct_9fa48("25620") ? matchingTopics.length >= 0 : stryMutAct_9fa48("25619") ? false : stryMutAct_9fa48("25618") ? true : (stryCov_9fa48("25618", "25619", "25620", "25621"), matchingTopics.length > 0)) {
              if (stryMutAct_9fa48("25622")) {
                {}
              } else {
                stryCov_9fa48("25622");
                const priority: 'high' | 'medium' | 'low' = (stryMutAct_9fa48("25623") ? matchingTopics.every(t => t.priority === 'high') : (stryCov_9fa48("25623"), matchingTopics.some(stryMutAct_9fa48("25624") ? () => undefined : (stryCov_9fa48("25624"), t => stryMutAct_9fa48("25627") ? t.priority !== 'high' : stryMutAct_9fa48("25626") ? false : stryMutAct_9fa48("25625") ? true : (stryCov_9fa48("25625", "25626", "25627"), t.priority === (stryMutAct_9fa48("25628") ? "" : (stryCov_9fa48("25628"), 'high'))))))) ? stryMutAct_9fa48("25629") ? "" : (stryCov_9fa48("25629"), 'high') : stryMutAct_9fa48("25630") ? "" : (stryCov_9fa48("25630"), 'medium');
                recommendations.push(stryMutAct_9fa48("25631") ? {} : (stryCov_9fa48("25631"), {
                  examId: exam.id,
                  examTitle: exam.titulo,
                  subjectName: exam.subject.nombre,
                  subjectCode: exam.subject.codigo,
                  reason: stryMutAct_9fa48("25632") ? `` : (stryCov_9fa48("25632"), `Este examen incluye ${matchingTopics.length} tema(s) que necesitas reforzar: ${stryMutAct_9fa48("25633") ? matchingTopics.map(t => t.topicName).join(', ') : (stryCov_9fa48("25633"), matchingTopics.slice(0, 3).map(stryMutAct_9fa48("25634") ? () => undefined : (stryCov_9fa48("25634"), t => t.topicName)).join(stryMutAct_9fa48("25635") ? "" : (stryCov_9fa48("25635"), ', ')))}`),
                  priority,
                  focusTopics: matchingTopics.map(stryMutAct_9fa48("25636") ? () => undefined : (stryCov_9fa48("25636"), t => t.topicName))
                }));
              }
            }
          }
        });
      }
    });

    // Ordenar por prioridad
    return stryMutAct_9fa48("25637") ? recommendations : (stryCov_9fa48("25637"), recommendations.sort((a, b) => {
      if (stryMutAct_9fa48("25638")) {
        {}
      } else {
        stryCov_9fa48("25638");
        const priorityOrder = stryMutAct_9fa48("25639") ? {} : (stryCov_9fa48("25639"), {
          high: 0,
          medium: 1,
          low: 2
        });
        return stryMutAct_9fa48("25640") ? priorityOrder[a.priority] + priorityOrder[b.priority] : (stryCov_9fa48("25640"), priorityOrder[a.priority] - priorityOrder[b.priority]);
      }
    }));
  }
}

/**
 * Genera un plan de estudio personalizado
 */
export function generateStudyPlan(topicRecommendations: TopicRecommendation[], examRecommendations: ExamRecommendation[]): StudyPlan {
  if (stryMutAct_9fa48("25641")) {
    {}
  } else {
    stryCov_9fa48("25641");
    const highPriorityTopics = stryMutAct_9fa48("25642") ? topicRecommendations : (stryCov_9fa48("25642"), topicRecommendations.filter(stryMutAct_9fa48("25643") ? () => undefined : (stryCov_9fa48("25643"), t => stryMutAct_9fa48("25646") ? t.priority !== 'high' : stryMutAct_9fa48("25645") ? false : stryMutAct_9fa48("25644") ? true : (stryCov_9fa48("25644", "25645", "25646"), t.priority === (stryMutAct_9fa48("25647") ? "" : (stryCov_9fa48("25647"), 'high'))))));
    const mediumPriorityTopics = stryMutAct_9fa48("25648") ? topicRecommendations : (stryCov_9fa48("25648"), topicRecommendations.filter(stryMutAct_9fa48("25649") ? () => undefined : (stryCov_9fa48("25649"), t => stryMutAct_9fa48("25652") ? t.priority !== 'medium' : stryMutAct_9fa48("25651") ? false : stryMutAct_9fa48("25650") ? true : (stryCov_9fa48("25650", "25651", "25652"), t.priority === (stryMutAct_9fa48("25653") ? "" : (stryCov_9fa48("25653"), 'medium'))))));
    const weeks: StudyPlan['weeklyGoals'] = stryMutAct_9fa48("25654") ? ["Stryker was here"] : (stryCov_9fa48("25654"), []);

    // Semana 1-2: Enfocarse en temas de alta prioridad
    if (stryMutAct_9fa48("25658") ? highPriorityTopics.length <= 0 : stryMutAct_9fa48("25657") ? highPriorityTopics.length >= 0 : stryMutAct_9fa48("25656") ? false : stryMutAct_9fa48("25655") ? true : (stryCov_9fa48("25655", "25656", "25657", "25658"), highPriorityTopics.length > 0)) {
      if (stryMutAct_9fa48("25659")) {
        {}
      } else {
        stryCov_9fa48("25659");
        weeks.push(stryMutAct_9fa48("25660") ? {} : (stryCov_9fa48("25660"), {
          week: 1,
          topics: stryMutAct_9fa48("25661") ? highPriorityTopics.map(t => t.topicName) : (stryCov_9fa48("25661"), highPriorityTopics.slice(0, 3).map(stryMutAct_9fa48("25662") ? () => undefined : (stryCov_9fa48("25662"), t => t.topicName))),
          exams: stryMutAct_9fa48("25664") ? examRecommendations.slice(0, 2).map(e => e.examTitle) : stryMutAct_9fa48("25663") ? examRecommendations.filter(e => e.priority === 'high').map(e => e.examTitle) : (stryCov_9fa48("25663", "25664"), examRecommendations.filter(stryMutAct_9fa48("25665") ? () => undefined : (stryCov_9fa48("25665"), e => stryMutAct_9fa48("25668") ? e.priority !== 'high' : stryMutAct_9fa48("25667") ? false : stryMutAct_9fa48("25666") ? true : (stryCov_9fa48("25666", "25667", "25668"), e.priority === (stryMutAct_9fa48("25669") ? "" : (stryCov_9fa48("25669"), 'high'))))).slice(0, 2).map(stryMutAct_9fa48("25670") ? () => undefined : (stryCov_9fa48("25670"), e => e.examTitle))),
          description: stryMutAct_9fa48("25671") ? "" : (stryCov_9fa48("25671"), 'Enfócate en los temas más críticos. Dedica tiempo extra a estudiar estos conceptos fundamentales.')
        }));
      }
    }

    // Semana 3-4: Continuar con alta prioridad y empezar con media
    if (stryMutAct_9fa48("25674") ? highPriorityTopics.length > 3 && mediumPriorityTopics.length > 0 : stryMutAct_9fa48("25673") ? false : stryMutAct_9fa48("25672") ? true : (stryCov_9fa48("25672", "25673", "25674"), (stryMutAct_9fa48("25677") ? highPriorityTopics.length <= 3 : stryMutAct_9fa48("25676") ? highPriorityTopics.length >= 3 : stryMutAct_9fa48("25675") ? false : (stryCov_9fa48("25675", "25676", "25677"), highPriorityTopics.length > 3)) || (stryMutAct_9fa48("25680") ? mediumPriorityTopics.length <= 0 : stryMutAct_9fa48("25679") ? mediumPriorityTopics.length >= 0 : stryMutAct_9fa48("25678") ? false : (stryCov_9fa48("25678", "25679", "25680"), mediumPriorityTopics.length > 0)))) {
      if (stryMutAct_9fa48("25681")) {
        {}
      } else {
        stryCov_9fa48("25681");
        weeks.push(stryMutAct_9fa48("25682") ? {} : (stryCov_9fa48("25682"), {
          week: 2,
          topics: stryMutAct_9fa48("25683") ? [] : (stryCov_9fa48("25683"), [...(stryMutAct_9fa48("25684") ? highPriorityTopics.map(t => t.topicName) : (stryCov_9fa48("25684"), highPriorityTopics.slice(3, 5).map(stryMutAct_9fa48("25685") ? () => undefined : (stryCov_9fa48("25685"), t => t.topicName)))), ...(stryMutAct_9fa48("25686") ? mediumPriorityTopics.map(t => t.topicName) : (stryCov_9fa48("25686"), mediumPriorityTopics.slice(0, 2).map(stryMutAct_9fa48("25687") ? () => undefined : (stryCov_9fa48("25687"), t => t.topicName))))]),
          exams: stryMutAct_9fa48("25689") ? examRecommendations.slice(0, 2).map(e => e.examTitle) : stryMutAct_9fa48("25688") ? examRecommendations.filter(e => e.priority === 'medium').map(e => e.examTitle) : (stryCov_9fa48("25688", "25689"), examRecommendations.filter(stryMutAct_9fa48("25690") ? () => undefined : (stryCov_9fa48("25690"), e => stryMutAct_9fa48("25693") ? e.priority !== 'medium' : stryMutAct_9fa48("25692") ? false : stryMutAct_9fa48("25691") ? true : (stryCov_9fa48("25691", "25692", "25693"), e.priority === (stryMutAct_9fa48("25694") ? "" : (stryCov_9fa48("25694"), 'medium'))))).slice(0, 2).map(stryMutAct_9fa48("25695") ? () => undefined : (stryCov_9fa48("25695"), e => e.examTitle))),
          description: stryMutAct_9fa48("25696") ? "" : (stryCov_9fa48("25696"), 'Continúa reforzando temas débiles y comienza a trabajar en áreas de mejora.')
        }));
      }
    }

    // Semana 5-6: Consolidación
    if (stryMutAct_9fa48("25700") ? weeks.length <= 0 : stryMutAct_9fa48("25699") ? weeks.length >= 0 : stryMutAct_9fa48("25698") ? false : stryMutAct_9fa48("25697") ? true : (stryCov_9fa48("25697", "25698", "25699", "25700"), weeks.length > 0)) {
      if (stryMutAct_9fa48("25701")) {
        {}
      } else {
        stryCov_9fa48("25701");
        weeks.push(stryMutAct_9fa48("25702") ? {} : (stryCov_9fa48("25702"), {
          week: 3,
          topics: stryMutAct_9fa48("25703") ? mediumPriorityTopics.map(t => t.topicName) : (stryCov_9fa48("25703"), mediumPriorityTopics.slice(2, 5).map(stryMutAct_9fa48("25704") ? () => undefined : (stryCov_9fa48("25704"), t => t.topicName))),
          exams: stryMutAct_9fa48("25705") ? examRecommendations.map(e => e.examTitle) : (stryCov_9fa48("25705"), examRecommendations.slice(0, 3).map(stryMutAct_9fa48("25706") ? () => undefined : (stryCov_9fa48("25706"), e => e.examTitle))),
          description: stryMutAct_9fa48("25707") ? "" : (stryCov_9fa48("25707"), 'Consolida tu aprendizaje realizando exámenes completos y revisando todos los temas estudiados.')
        }));
      }
    }
    const estimatedWeeks = stryMutAct_9fa48("25708") ? Math.min(weeks.length, 2) : (stryCov_9fa48("25708"), Math.max(weeks.length, 2));
    const estimatedCompletion = new Date();
    stryMutAct_9fa48("25709") ? estimatedCompletion.setTime(estimatedCompletion.getDate() + estimatedWeeks * 7) : (stryCov_9fa48("25709"), estimatedCompletion.setDate(stryMutAct_9fa48("25710") ? estimatedCompletion.getDate() - estimatedWeeks * 7 : (stryCov_9fa48("25710"), estimatedCompletion.getDate() + (stryMutAct_9fa48("25711") ? estimatedWeeks / 7 : (stryCov_9fa48("25711"), estimatedWeeks * 7)))));
    return stryMutAct_9fa48("25712") ? {} : (stryCov_9fa48("25712"), {
      weeklyGoals: weeks,
      estimatedCompletion: estimatedCompletion.toLocaleDateString(stryMutAct_9fa48("25713") ? "" : (stryCov_9fa48("25713"), 'es-CL'), stryMutAct_9fa48("25714") ? {} : (stryCov_9fa48("25714"), {
        year: stryMutAct_9fa48("25715") ? "" : (stryCov_9fa48("25715"), 'numeric'),
        month: stryMutAct_9fa48("25716") ? "" : (stryCov_9fa48("25716"), 'long'),
        day: stryMutAct_9fa48("25717") ? "" : (stryCov_9fa48("25717"), 'numeric')
      })),
      focusAreas: Array.from(new Set(topicRecommendations.map(stryMutAct_9fa48("25718") ? () => undefined : (stryCov_9fa48("25718"), t => t.subjectName))))
    });
  }
}

/**
 * Genera recomendaciones completas
 */
export function generateRecommendations(metrics: PerformanceMetric[], availableExams: Exam[]): Recommendations {
  if (stryMutAct_9fa48("25719")) {
    {}
  } else {
    stryCov_9fa48("25719");
    const topicRecommendations = analyzeTopicRecommendations(metrics);
    const weakTopics = stryMutAct_9fa48("25720") ? topicRecommendations : (stryCov_9fa48("25720"), topicRecommendations.filter(stryMutAct_9fa48("25721") ? () => undefined : (stryCov_9fa48("25721"), t => stryMutAct_9fa48("25724") ? t.priority === 'high' && t.priority === 'medium' : stryMutAct_9fa48("25723") ? false : stryMutAct_9fa48("25722") ? true : (stryCov_9fa48("25722", "25723", "25724"), (stryMutAct_9fa48("25726") ? t.priority !== 'high' : stryMutAct_9fa48("25725") ? false : (stryCov_9fa48("25725", "25726"), t.priority === (stryMutAct_9fa48("25727") ? "" : (stryCov_9fa48("25727"), 'high')))) || (stryMutAct_9fa48("25729") ? t.priority !== 'medium' : stryMutAct_9fa48("25728") ? false : (stryCov_9fa48("25728", "25729"), t.priority === (stryMutAct_9fa48("25730") ? "" : (stryCov_9fa48("25730"), 'medium'))))))));
    const examRecommendations = analyzeExamRecommendations(weakTopics, availableExams);
    const studyPlan = (stryMutAct_9fa48("25734") ? topicRecommendations.length <= 0 : stryMutAct_9fa48("25733") ? topicRecommendations.length >= 0 : stryMutAct_9fa48("25732") ? false : stryMutAct_9fa48("25731") ? true : (stryCov_9fa48("25731", "25732", "25733", "25734"), topicRecommendations.length > 0)) ? generateStudyPlan(topicRecommendations, examRecommendations) : null;
    const highPriorityCount = stryMutAct_9fa48("25735") ? topicRecommendations.filter(t => t.priority === 'high').length - examRecommendations.filter(e => e.priority === 'high').length : (stryCov_9fa48("25735"), (stryMutAct_9fa48("25736") ? topicRecommendations.length : (stryCov_9fa48("25736"), topicRecommendations.filter(stryMutAct_9fa48("25737") ? () => undefined : (stryCov_9fa48("25737"), t => stryMutAct_9fa48("25740") ? t.priority !== 'high' : stryMutAct_9fa48("25739") ? false : stryMutAct_9fa48("25738") ? true : (stryCov_9fa48("25738", "25739", "25740"), t.priority === (stryMutAct_9fa48("25741") ? "" : (stryCov_9fa48("25741"), 'high'))))).length)) + (stryMutAct_9fa48("25742") ? examRecommendations.length : (stryCov_9fa48("25742"), examRecommendations.filter(stryMutAct_9fa48("25743") ? () => undefined : (stryCov_9fa48("25743"), e => stryMutAct_9fa48("25746") ? e.priority !== 'high' : stryMutAct_9fa48("25745") ? false : stryMutAct_9fa48("25744") ? true : (stryCov_9fa48("25744", "25745", "25746"), e.priority === (stryMutAct_9fa48("25747") ? "" : (stryCov_9fa48("25747"), 'high'))))).length)));

    // Estimar tiempo de estudio (1-2 horas por tema de alta prioridad, 30min-1h por tema medio)
    const estimatedHours = stryMutAct_9fa48("25748") ? topicRecommendations.filter(t => t.priority === 'high').length * 1.5 - topicRecommendations.filter(t => t.priority === 'medium').length * 0.75 : (stryCov_9fa48("25748"), (stryMutAct_9fa48("25749") ? topicRecommendations.filter(t => t.priority === 'high').length / 1.5 : (stryCov_9fa48("25749"), (stryMutAct_9fa48("25750") ? topicRecommendations.length : (stryCov_9fa48("25750"), topicRecommendations.filter(stryMutAct_9fa48("25751") ? () => undefined : (stryCov_9fa48("25751"), t => stryMutAct_9fa48("25754") ? t.priority !== 'high' : stryMutAct_9fa48("25753") ? false : stryMutAct_9fa48("25752") ? true : (stryCov_9fa48("25752", "25753", "25754"), t.priority === (stryMutAct_9fa48("25755") ? "" : (stryCov_9fa48("25755"), 'high'))))).length)) * 1.5)) + (stryMutAct_9fa48("25756") ? topicRecommendations.filter(t => t.priority === 'medium').length / 0.75 : (stryCov_9fa48("25756"), (stryMutAct_9fa48("25757") ? topicRecommendations.length : (stryCov_9fa48("25757"), topicRecommendations.filter(stryMutAct_9fa48("25758") ? () => undefined : (stryCov_9fa48("25758"), t => stryMutAct_9fa48("25761") ? t.priority !== 'medium' : stryMutAct_9fa48("25760") ? false : stryMutAct_9fa48("25759") ? true : (stryCov_9fa48("25759", "25760", "25761"), t.priority === (stryMutAct_9fa48("25762") ? "" : (stryCov_9fa48("25762"), 'medium'))))).length)) * 0.75)));
    return stryMutAct_9fa48("25763") ? {} : (stryCov_9fa48("25763"), {
      topics: topicRecommendations,
      exams: examRecommendations,
      studyPlan,
      summary: stryMutAct_9fa48("25764") ? {} : (stryCov_9fa48("25764"), {
        totalRecommendations: stryMutAct_9fa48("25765") ? topicRecommendations.length - examRecommendations.length : (stryCov_9fa48("25765"), topicRecommendations.length + examRecommendations.length),
        highPriority: highPriorityCount,
        estimatedStudyTime: (stryMutAct_9fa48("25769") ? estimatedHours < 1 : stryMutAct_9fa48("25768") ? estimatedHours > 1 : stryMutAct_9fa48("25767") ? false : stryMutAct_9fa48("25766") ? true : (stryCov_9fa48("25766", "25767", "25768", "25769"), estimatedHours >= 1)) ? stryMutAct_9fa48("25770") ? `` : (stryCov_9fa48("25770"), `${Math.ceil(estimatedHours)} horas`) : stryMutAct_9fa48("25771") ? `` : (stryCov_9fa48("25771"), `${Math.ceil(stryMutAct_9fa48("25772") ? estimatedHours / 60 : (stryCov_9fa48("25772"), estimatedHours * 60))} minutos`)
      })
    });
  }
}