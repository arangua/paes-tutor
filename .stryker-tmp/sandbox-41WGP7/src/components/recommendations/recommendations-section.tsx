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
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecommendationCard } from './recommendation-card';
import { Loader2, Target, BookOpen, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
interface TopicRecommendation {
  topicId: string;
  topicName: string;
  subjectName: string;
  subjectCode: string;
  currentPercentage: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedActions: string[];
}
interface ExamRecommendation {
  examId: string;
  examTitle: string;
  subjectName: string;
  subjectCode: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  focusTopics: string[];
}
interface StudyPlan {
  weeklyGoals: Array<{
    week: number;
    topics: string[];
    exams: string[];
    description: string;
  }>;
  estimatedCompletion: string;
  focusAreas: string[];
}
interface Recommendations {
  topics: TopicRecommendation[];
  exams: ExamRecommendation[];
  studyPlan: StudyPlan | null;
  summary: {
    totalRecommendations: number;
    highPriority: number;
    estimatedStudyTime: string;
  };
}
export function RecommendationsSection() {
  if (stryMutAct_9fa48("19132")) {
    {}
  } else {
    stryCov_9fa48("19132");
    const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19133") ? false : (stryCov_9fa48("19133"), true));
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("19134")) {
        {}
      } else {
        stryCov_9fa48("19134");
        async function loadRecommendations() {
          if (stryMutAct_9fa48("19135")) {
            {}
          } else {
            stryCov_9fa48("19135");
            try {
              if (stryMutAct_9fa48("19136")) {
                {}
              } else {
                stryCov_9fa48("19136");
                setIsLoading(stryMutAct_9fa48("19137") ? false : (stryCov_9fa48("19137"), true));
                setError(null);
                const res = await fetch(stryMutAct_9fa48("19138") ? "" : (stryCov_9fa48("19138"), '/api/recommendations'));
                if (stryMutAct_9fa48("19141") ? false : stryMutAct_9fa48("19140") ? true : stryMutAct_9fa48("19139") ? res.ok : (stryCov_9fa48("19139", "19140", "19141"), !res.ok)) {
                  if (stryMutAct_9fa48("19142")) {
                    {}
                  } else {
                    stryCov_9fa48("19142");
                    // Manejar error 429 (Too Many Requests)
                    if (stryMutAct_9fa48("19145") ? res.status !== 429 : stryMutAct_9fa48("19144") ? false : stryMutAct_9fa48("19143") ? true : (stryCov_9fa48("19143", "19144", "19145"), res.status === 429)) {
                      if (stryMutAct_9fa48("19146")) {
                        {}
                      } else {
                        stryCov_9fa48("19146");
                        const retryAfter = res.headers.get(stryMutAct_9fa48("19147") ? "" : (stryCov_9fa48("19147"), 'Retry-After'));
                        const message = retryAfter ? stryMutAct_9fa48("19148") ? `` : (stryCov_9fa48("19148"), `Demasiadas solicitudes. Intenta nuevamente en ${retryAfter} segundos.`) : stryMutAct_9fa48("19149") ? "" : (stryCov_9fa48("19149"), 'Demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.');
                        throw new Error(message);
                      }
                    }
                    throw new Error(stryMutAct_9fa48("19150") ? "" : (stryCov_9fa48("19150"), 'Error al cargar recomendaciones'));
                  }
                }
                const data = await res.json();
                setRecommendations(data);
              }
            } catch (err) {
              if (stryMutAct_9fa48("19151")) {
                {}
              } else {
                stryCov_9fa48("19151");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("19152") ? "" : (stryCov_9fa48("19152"), 'Error desconocido'));
              }
            } finally {
              if (stryMutAct_9fa48("19153")) {
                {}
              } else {
                stryCov_9fa48("19153");
                setIsLoading(stryMutAct_9fa48("19154") ? true : (stryCov_9fa48("19154"), false));
              }
            }
          }
        }
        loadRecommendations();
      }
    }, stryMutAct_9fa48("19155") ? ["Stryker was here"] : (stryCov_9fa48("19155"), []));
    if (stryMutAct_9fa48("19157") ? false : stryMutAct_9fa48("19156") ? true : (stryCov_9fa48("19156", "19157"), isLoading)) {
      if (stryMutAct_9fa48("19158")) {
        {}
      } else {
        stryCov_9fa48("19158");
        return <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
          <CardDescription>Cargando recomendaciones...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>;
      }
    }
    if (stryMutAct_9fa48("19160") ? false : stryMutAct_9fa48("19159") ? true : (stryCov_9fa48("19159", "19160"), error)) {
      if (stryMutAct_9fa48("19161")) {
        {}
      } else {
        stryCov_9fa48("19161");
        return <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
          <CardDescription>No se pudieron cargar las recomendaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>;
      }
    }
    if (stryMutAct_9fa48("19164") ? !recommendations && recommendations.topics.length === 0 && recommendations.exams.length === 0 : stryMutAct_9fa48("19163") ? false : stryMutAct_9fa48("19162") ? true : (stryCov_9fa48("19162", "19163", "19164"), (stryMutAct_9fa48("19165") ? recommendations : (stryCov_9fa48("19165"), !recommendations)) || (stryMutAct_9fa48("19167") ? recommendations.topics.length === 0 || recommendations.exams.length === 0 : stryMutAct_9fa48("19166") ? false : (stryCov_9fa48("19166", "19167"), (stryMutAct_9fa48("19169") ? recommendations.topics.length !== 0 : stryMutAct_9fa48("19168") ? true : (stryCov_9fa48("19168", "19169"), recommendations.topics.length === 0)) && (stryMutAct_9fa48("19171") ? recommendations.exams.length !== 0 : stryMutAct_9fa48("19170") ? true : (stryCov_9fa48("19170", "19171"), recommendations.exams.length === 0)))))) {
      if (stryMutAct_9fa48("19172")) {
        {}
      } else {
        stryCov_9fa48("19172");
        return <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recomendaciones Personalizadas
          </CardTitle>
          <CardDescription>
            Realiza algunos exámenes para recibir recomendaciones personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              Aún no hay suficientes datos para generar recomendaciones
            </p>
            <Button asChild>
              <Link href="/exams">
                <BookOpen className="h-4 w-4 mr-2" />
                Comenzar a Practicar
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>;
      }
    }
    const highPriorityTopics = stryMutAct_9fa48("19173") ? recommendations.topics : (stryCov_9fa48("19173"), recommendations.topics.filter(stryMutAct_9fa48("19174") ? () => undefined : (stryCov_9fa48("19174"), t => stryMutAct_9fa48("19177") ? t.priority !== 'high' : stryMutAct_9fa48("19176") ? false : stryMutAct_9fa48("19175") ? true : (stryCov_9fa48("19175", "19176", "19177"), t.priority === (stryMutAct_9fa48("19178") ? "" : (stryCov_9fa48("19178"), 'high'))))));
    const mediumPriorityTopics = stryMutAct_9fa48("19179") ? recommendations.topics : (stryCov_9fa48("19179"), recommendations.topics.filter(stryMutAct_9fa48("19180") ? () => undefined : (stryCov_9fa48("19180"), t => stryMutAct_9fa48("19183") ? t.priority !== 'medium' : stryMutAct_9fa48("19182") ? false : stryMutAct_9fa48("19181") ? true : (stryCov_9fa48("19181", "19182", "19183"), t.priority === (stryMutAct_9fa48("19184") ? "" : (stryCov_9fa48("19184"), 'medium'))))));
    const highPriorityExams = stryMutAct_9fa48("19185") ? recommendations.exams : (stryCov_9fa48("19185"), recommendations.exams.filter(stryMutAct_9fa48("19186") ? () => undefined : (stryCov_9fa48("19186"), e => stryMutAct_9fa48("19189") ? e.priority !== 'high' : stryMutAct_9fa48("19188") ? false : stryMutAct_9fa48("19187") ? true : (stryCov_9fa48("19187", "19188", "19189"), e.priority === (stryMutAct_9fa48("19190") ? "" : (stryCov_9fa48("19190"), 'high'))))));
    const mediumPriorityExams = stryMutAct_9fa48("19191") ? recommendations.exams : (stryCov_9fa48("19191"), recommendations.exams.filter(stryMutAct_9fa48("19192") ? () => undefined : (stryCov_9fa48("19192"), e => stryMutAct_9fa48("19195") ? e.priority !== 'medium' : stryMutAct_9fa48("19194") ? false : stryMutAct_9fa48("19193") ? true : (stryCov_9fa48("19193", "19194", "19195"), e.priority === (stryMutAct_9fa48("19196") ? "" : (stryCov_9fa48("19196"), 'medium'))))));
    return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recomendaciones Personalizadas
            </CardTitle>
            <CardDescription>
              {recommendations.summary.totalRecommendations} recomendaciones •{stryMutAct_9fa48("19197") ? "" : (stryCov_9fa48("19197"), ' ')}
              {recommendations.summary.highPriority} de alta prioridad
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Tiempo estimado</p>
            <p className="text-sm font-semibold">{recommendations.summary.estimatedStudyTime}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="topics">
              <Target className="h-4 w-4 mr-2" />
              Temas ({recommendations.topics.length})
            </TabsTrigger>
            <TabsTrigger value="exams">
              <BookOpen className="h-4 w-4 mr-2" />
              Exámenes ({recommendations.exams.length})
            </TabsTrigger>
            <TabsTrigger value="plan">
              <Calendar className="h-4 w-4 mr-2" />
              Plan de Estudio
            </TabsTrigger>
          </TabsList>

          {/* Tab de Temas */}
          <TabsContent value="topics" className="space-y-4 mt-4">
            {stryMutAct_9fa48("19200") ? highPriorityTopics.length > 0 || <div>
                <h3 className="text-sm font-semibold mb-3 text-red-600">Alta Prioridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPriorityTopics.map(topic => <RecommendationCard key={topic.topicId} type="topic" recommendation={topic} />)}
                </div>
              </div> : stryMutAct_9fa48("19199") ? false : stryMutAct_9fa48("19198") ? true : (stryCov_9fa48("19198", "19199", "19200"), (stryMutAct_9fa48("19203") ? highPriorityTopics.length <= 0 : stryMutAct_9fa48("19202") ? highPriorityTopics.length >= 0 : stryMutAct_9fa48("19201") ? true : (stryCov_9fa48("19201", "19202", "19203"), highPriorityTopics.length > 0)) && <div>
                <h3 className="text-sm font-semibold mb-3 text-red-600">Alta Prioridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPriorityTopics.map(stryMutAct_9fa48("19204") ? () => undefined : (stryCov_9fa48("19204"), topic => <RecommendationCard key={topic.topicId} type="topic" recommendation={topic} />))}
                </div>
              </div>)}

            {stryMutAct_9fa48("19207") ? mediumPriorityTopics.length > 0 || <div>
                <h3 className="text-sm font-semibold mb-3 text-yellow-600">Prioridad Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediumPriorityTopics.map(topic => <RecommendationCard key={topic.topicId} type="topic" recommendation={topic} />)}
                </div>
              </div> : stryMutAct_9fa48("19206") ? false : stryMutAct_9fa48("19205") ? true : (stryCov_9fa48("19205", "19206", "19207"), (stryMutAct_9fa48("19210") ? mediumPriorityTopics.length <= 0 : stryMutAct_9fa48("19209") ? mediumPriorityTopics.length >= 0 : stryMutAct_9fa48("19208") ? true : (stryCov_9fa48("19208", "19209", "19210"), mediumPriorityTopics.length > 0)) && <div>
                <h3 className="text-sm font-semibold mb-3 text-yellow-600">Prioridad Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediumPriorityTopics.map(stryMutAct_9fa48("19211") ? () => undefined : (stryCov_9fa48("19211"), topic => <RecommendationCard key={topic.topicId} type="topic" recommendation={topic} />))}
                </div>
              </div>)}

            {stryMutAct_9fa48("19214") ? recommendations.topics.length === 0 || <div className="text-center py-8 text-muted-foreground">
                <p>No hay recomendaciones de temas en este momento</p>
              </div> : stryMutAct_9fa48("19213") ? false : stryMutAct_9fa48("19212") ? true : (stryCov_9fa48("19212", "19213", "19214"), (stryMutAct_9fa48("19216") ? recommendations.topics.length !== 0 : stryMutAct_9fa48("19215") ? true : (stryCov_9fa48("19215", "19216"), recommendations.topics.length === 0)) && <div className="text-center py-8 text-muted-foreground">
                <p>No hay recomendaciones de temas en este momento</p>
              </div>)}
          </TabsContent>

          {/* Tab de Exámenes */}
          <TabsContent value="exams" className="space-y-4 mt-4">
            {stryMutAct_9fa48("19219") ? highPriorityExams.length > 0 || <div>
                <h3 className="text-sm font-semibold mb-3 text-red-600">Alta Prioridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPriorityExams.map(exam => <RecommendationCard key={exam.examId} type="exam" recommendation={exam} />)}
                </div>
              </div> : stryMutAct_9fa48("19218") ? false : stryMutAct_9fa48("19217") ? true : (stryCov_9fa48("19217", "19218", "19219"), (stryMutAct_9fa48("19222") ? highPriorityExams.length <= 0 : stryMutAct_9fa48("19221") ? highPriorityExams.length >= 0 : stryMutAct_9fa48("19220") ? true : (stryCov_9fa48("19220", "19221", "19222"), highPriorityExams.length > 0)) && <div>
                <h3 className="text-sm font-semibold mb-3 text-red-600">Alta Prioridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPriorityExams.map(stryMutAct_9fa48("19223") ? () => undefined : (stryCov_9fa48("19223"), exam => <RecommendationCard key={exam.examId} type="exam" recommendation={exam} />))}
                </div>
              </div>)}

            {stryMutAct_9fa48("19226") ? mediumPriorityExams.length > 0 || <div>
                <h3 className="text-sm font-semibold mb-3 text-yellow-600">Prioridad Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediumPriorityExams.map(exam => <RecommendationCard key={exam.examId} type="exam" recommendation={exam} />)}
                </div>
              </div> : stryMutAct_9fa48("19225") ? false : stryMutAct_9fa48("19224") ? true : (stryCov_9fa48("19224", "19225", "19226"), (stryMutAct_9fa48("19229") ? mediumPriorityExams.length <= 0 : stryMutAct_9fa48("19228") ? mediumPriorityExams.length >= 0 : stryMutAct_9fa48("19227") ? true : (stryCov_9fa48("19227", "19228", "19229"), mediumPriorityExams.length > 0)) && <div>
                <h3 className="text-sm font-semibold mb-3 text-yellow-600">Prioridad Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediumPriorityExams.map(stryMutAct_9fa48("19230") ? () => undefined : (stryCov_9fa48("19230"), exam => <RecommendationCard key={exam.examId} type="exam" recommendation={exam} />))}
                </div>
              </div>)}

            {stryMutAct_9fa48("19233") ? recommendations.exams.length === 0 || <div className="text-center py-8 text-muted-foreground">
                <p>No hay recomendaciones de exámenes en este momento</p>
              </div> : stryMutAct_9fa48("19232") ? false : stryMutAct_9fa48("19231") ? true : (stryCov_9fa48("19231", "19232", "19233"), (stryMutAct_9fa48("19235") ? recommendations.exams.length !== 0 : stryMutAct_9fa48("19234") ? true : (stryCov_9fa48("19234", "19235"), recommendations.exams.length === 0)) && <div className="text-center py-8 text-muted-foreground">
                <p>No hay recomendaciones de exámenes en este momento</p>
              </div>)}
          </TabsContent>

          {/* Tab de Plan de Estudio */}
          <TabsContent value="plan" className="mt-4">
            {recommendations.studyPlan ? <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Áreas de Enfoque</p>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.studyPlan.focusAreas.map(stryMutAct_9fa48("19236") ? () => undefined : (stryCov_9fa48("19236"), (area, idx) => <span key={idx} className="px-3 py-1 bg-background rounded-full text-xs">
                        {area}
                      </span>))}
                  </div>
                </div>

                <div className="space-y-4">
                  {recommendations.studyPlan.weeklyGoals.map(stryMutAct_9fa48("19237") ? () => undefined : (stryCov_9fa48("19237"), goal => <Card key={goal.week}>
                      <CardHeader>
                        <CardTitle className="text-lg">Semana {goal.week}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {stryMutAct_9fa48("19240") ? goal.topics.length > 0 || <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Temas a Estudiar:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {goal.topics.map((topic, idx) => <li key={idx}>{topic}</li>)}
                            </ul>
                          </div> : stryMutAct_9fa48("19239") ? false : stryMutAct_9fa48("19238") ? true : (stryCov_9fa48("19238", "19239", "19240"), (stryMutAct_9fa48("19243") ? goal.topics.length <= 0 : stryMutAct_9fa48("19242") ? goal.topics.length >= 0 : stryMutAct_9fa48("19241") ? true : (stryCov_9fa48("19241", "19242", "19243"), goal.topics.length > 0)) && <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Temas a Estudiar:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {goal.topics.map(stryMutAct_9fa48("19244") ? () => undefined : (stryCov_9fa48("19244"), (topic, idx) => <li key={idx}>{topic}</li>))}
                            </ul>
                          </div>)}
                        {stryMutAct_9fa48("19247") ? goal.exams.length > 0 || <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Exámenes Recomendados:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {goal.exams.map((exam, idx) => <li key={idx}>{exam}</li>)}
                            </ul>
                          </div> : stryMutAct_9fa48("19246") ? false : stryMutAct_9fa48("19245") ? true : (stryCov_9fa48("19245", "19246", "19247"), (stryMutAct_9fa48("19250") ? goal.exams.length <= 0 : stryMutAct_9fa48("19249") ? goal.exams.length >= 0 : stryMutAct_9fa48("19248") ? true : (stryCov_9fa48("19248", "19249", "19250"), goal.exams.length > 0)) && <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Exámenes Recomendados:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {goal.exams.map(stryMutAct_9fa48("19251") ? () => undefined : (stryCov_9fa48("19251"), (exam, idx) => <li key={idx}>{exam}</li>))}
                            </ul>
                          </div>)}
                      </CardContent>
                    </Card>))}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm">
                    <span className="font-medium">Fecha estimada de finalización:</span>{stryMutAct_9fa48("19252") ? "" : (stryCov_9fa48("19252"), ' ')}
                    {recommendations.studyPlan.estimatedCompletion}
                  </p>
                </div>
              </div> : <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay plan de estudio disponible en este momento</p>
                <p className="text-xs mt-2">
                  Realiza más exámenes para generar un plan personalizado
                </p>
              </div>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
  }
}