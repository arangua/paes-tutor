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
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
import { captureError } from '@/lib/monitoring';
import { Loader2, Sparkles, BookOpen, AlertCircle, CheckCircle2, Info, ArrowLeft } from 'lucide-react';
interface Subject {
  id: string;
  nombre: string;
  codigo: string;
}
interface Topic {
  id: string;
  nombre: string;
  ejeTematico: string;
}
export default function GenerateExamPage() {
  if (stryMutAct_9fa48("143")) {
    {}
  } else {
    stryCov_9fa48("143");
    const router = useRouter();
    const [loading, setLoading] = useState(stryMutAct_9fa48("144") ? true : (stryCov_9fa48("144"), false));
    const [loadingData, setLoadingData] = useState(stryMutAct_9fa48("145") ? false : (stryCov_9fa48("145"), true));
    const [subjects, setSubjects] = useState<Subject[]>(stryMutAct_9fa48("146") ? ["Stryker was here"] : (stryCov_9fa48("146"), []));
    const [topics, setTopics] = useState<Topic[]>(stryMutAct_9fa48("147") ? ["Stryker was here"] : (stryCov_9fa48("147"), []));
    const [selectedSubject, setSelectedSubject] = useState<string>(stryMutAct_9fa48("148") ? "Stryker was here!" : (stryCov_9fa48("148"), ''));
    const [selectedTopics, setSelectedTopics] = useState<string[]>(stryMutAct_9fa48("149") ? ["Stryker was here"] : (stryCov_9fa48("149"), []));
    const [numQuestions, setNumQuestions] = useState(30);
    const [difficulty, setDifficulty] = useState<'baja' | 'media' | 'alta' | 'mixta'>(stryMutAct_9fa48("150") ? "" : (stryCov_9fa48("150"), 'mixta'));
    const [tipo, setTipo] = useState<'objetiva' | 'desarrollo' | 'mixta'>(stryMutAct_9fa48("151") ? "" : (stryCov_9fa48("151"), 'objetiva'));
    const [titulo, setTitulo] = useState(stryMutAct_9fa48("152") ? "Stryker was here!" : (stryCov_9fa48("152"), ''));
    const [descripcion, setDescripcion] = useState(stryMutAct_9fa48("153") ? "Stryker was here!" : (stryCov_9fa48("153"), ''));
    const [tiempoLimiteMin, setTiempoLimiteMin] = useState<number | undefined>();
    const [fuente, setFuente] = useState(stryMutAct_9fa48("154") ? "Stryker was here!" : (stryCov_9fa48("154"), ''));
    const [includeAnswerKey, setIncludeAnswerKey] = useState(stryMutAct_9fa48("155") ? false : (stryCov_9fa48("155"), true));
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<{
      examId: string;
      message: string;
    } | null>(null);

    // Cargar asignaturas
    useEffect(() => {
      if (stryMutAct_9fa48("156")) {
        {}
      } else {
        stryCov_9fa48("156");
        async function loadSubjects() {
          if (stryMutAct_9fa48("157")) {
            {}
          } else {
            stryCov_9fa48("157");
            try {
              if (stryMutAct_9fa48("158")) {
                {}
              } else {
                stryCov_9fa48("158");
                setLoadingData(stryMutAct_9fa48("159") ? false : (stryCov_9fa48("159"), true));
                const res = await fetch(stryMutAct_9fa48("160") ? "" : (stryCov_9fa48("160"), '/api/subjects'));
                if (stryMutAct_9fa48("163") ? false : stryMutAct_9fa48("162") ? true : stryMutAct_9fa48("161") ? res.ok : (stryCov_9fa48("161", "162", "163"), !res.ok)) throw new Error(stryMutAct_9fa48("164") ? "" : (stryCov_9fa48("164"), 'Error al cargar asignaturas'));
                const data = await res.json();
                setSubjects(stryMutAct_9fa48("167") ? data.subjects && [] : stryMutAct_9fa48("166") ? false : stryMutAct_9fa48("165") ? true : (stryCov_9fa48("165", "166", "167"), data.subjects || (stryMutAct_9fa48("168") ? ["Stryker was here"] : (stryCov_9fa48("168"), []))));
              }
            } catch (error) {
              if (stryMutAct_9fa48("169")) {
                {}
              } else {
                stryCov_9fa48("169");
                setError(error instanceof Error ? error.message : stryMutAct_9fa48("170") ? "" : (stryCov_9fa48("170"), 'Error desconocido'));
              }
            } finally {
              if (stryMutAct_9fa48("171")) {
                {}
              } else {
                stryCov_9fa48("171");
                setLoadingData(stryMutAct_9fa48("172") ? true : (stryCov_9fa48("172"), false));
              }
            }
          }
        }
        loadSubjects();
      }
    }, stryMutAct_9fa48("173") ? ["Stryker was here"] : (stryCov_9fa48("173"), []));

    // Cargar temas cuando se selecciona una asignatura
    useEffect(() => {
      if (stryMutAct_9fa48("174")) {
        {}
      } else {
        stryCov_9fa48("174");
        async function loadTopics() {
          if (stryMutAct_9fa48("175")) {
            {}
          } else {
            stryCov_9fa48("175");
            if (stryMutAct_9fa48("178") ? false : stryMutAct_9fa48("177") ? true : stryMutAct_9fa48("176") ? selectedSubject : (stryCov_9fa48("176", "177", "178"), !selectedSubject)) {
              if (stryMutAct_9fa48("179")) {
                {}
              } else {
                stryCov_9fa48("179");
                setTopics(stryMutAct_9fa48("180") ? ["Stryker was here"] : (stryCov_9fa48("180"), []));
                return;
              }
            }
            try {
              if (stryMutAct_9fa48("181")) {
                {}
              } else {
                stryCov_9fa48("181");
                const res = await fetch(stryMutAct_9fa48("182") ? `` : (stryCov_9fa48("182"), `/api/topics?subjectId=${selectedSubject}`));
                if (stryMutAct_9fa48("185") ? false : stryMutAct_9fa48("184") ? true : stryMutAct_9fa48("183") ? res.ok : (stryCov_9fa48("183", "184", "185"), !res.ok)) throw new Error(stryMutAct_9fa48("186") ? "" : (stryCov_9fa48("186"), 'Error al cargar temas'));
                const data = await res.json();
                setTopics(stryMutAct_9fa48("189") ? data.topics && [] : stryMutAct_9fa48("188") ? false : stryMutAct_9fa48("187") ? true : (stryCov_9fa48("187", "188", "189"), data.topics || (stryMutAct_9fa48("190") ? ["Stryker was here"] : (stryCov_9fa48("190"), []))));
                setSelectedTopics(stryMutAct_9fa48("191") ? ["Stryker was here"] : (stryCov_9fa48("191"), [])); // Resetear selección de temas
              }
            } catch (err) {
              if (stryMutAct_9fa48("192")) {
                {}
              } else {
                stryCov_9fa48("192");
                captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("193") ? {} : (stryCov_9fa48("193"), {
                  type: stryMutAct_9fa48("194") ? "" : (stryCov_9fa48("194"), 'admin_generate_exam_error'),
                  action: stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), 'load_topics'),
                  subjectId: selectedSubject,
                  path: (stryMutAct_9fa48("198") ? typeof window === 'undefined' : stryMutAct_9fa48("197") ? false : stryMutAct_9fa48("196") ? true : (stryCov_9fa48("196", "197", "198"), typeof window !== (stryMutAct_9fa48("199") ? "" : (stryCov_9fa48("199"), 'undefined')))) ? window.location.pathname : undefined
                }));
                setTopics(stryMutAct_9fa48("200") ? ["Stryker was here"] : (stryCov_9fa48("200"), []));
              }
            }
          }
        }
        loadTopics();
      }
    }, stryMutAct_9fa48("201") ? [] : (stryCov_9fa48("201"), [selectedSubject]));

    // Calcular tiempo límite sugerido
    useEffect(() => {
      if (stryMutAct_9fa48("202")) {
        {}
      } else {
        stryCov_9fa48("202");
        if (stryMutAct_9fa48("205") ? !tiempoLimiteMin || numQuestions : stryMutAct_9fa48("204") ? false : stryMutAct_9fa48("203") ? true : (stryCov_9fa48("203", "204", "205"), (stryMutAct_9fa48("206") ? tiempoLimiteMin : (stryCov_9fa48("206"), !tiempoLimiteMin)) && numQuestions)) {
          if (stryMutAct_9fa48("207")) {
            {}
          } else {
            stryCov_9fa48("207");
            setTiempoLimiteMin(Math.ceil(stryMutAct_9fa48("208") ? numQuestions / 1.5 : (stryCov_9fa48("208"), numQuestions * 1.5)));
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // Solo recalcular cuando cambia numQuestions, tiempoLimiteMin no debe estar en deps
        // para evitar loops infinitos cuando el usuario establece manualmente el tiempo
      }
    }, stryMutAct_9fa48("209") ? [] : (stryCov_9fa48("209"), [numQuestions]));
    const handleTopicToggle = (topicId: string) => {
      if (stryMutAct_9fa48("210")) {
        {}
      } else {
        stryCov_9fa48("210");
        setSelectedTopics(stryMutAct_9fa48("211") ? () => undefined : (stryCov_9fa48("211"), prev => prev.includes(topicId) ? stryMutAct_9fa48("212") ? prev : (stryCov_9fa48("212"), prev.filter(stryMutAct_9fa48("213") ? () => undefined : (stryCov_9fa48("213"), id => stryMutAct_9fa48("216") ? id === topicId : stryMutAct_9fa48("215") ? false : stryMutAct_9fa48("214") ? true : (stryCov_9fa48("214", "215", "216"), id !== topicId)))) : stryMutAct_9fa48("217") ? [] : (stryCov_9fa48("217"), [...prev, topicId])));
      }
    };
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("218")) {
        {}
      } else {
        stryCov_9fa48("218");
        e.preventDefault();
        setLoading(stryMutAct_9fa48("219") ? false : (stryCov_9fa48("219"), true));
        setError(null);
        setSuccess(null);
        try {
          if (stryMutAct_9fa48("220")) {
            {}
          } else {
            stryCov_9fa48("220");
            const res = await fetch(stryMutAct_9fa48("221") ? "" : (stryCov_9fa48("221"), '/api/admin/generate-exam'), stryMutAct_9fa48("222") ? {} : (stryCov_9fa48("222"), {
              method: stryMutAct_9fa48("223") ? "" : (stryCov_9fa48("223"), 'POST'),
              headers: stryMutAct_9fa48("224") ? {} : (stryCov_9fa48("224"), {
                'Content-Type': stryMutAct_9fa48("225") ? "" : (stryCov_9fa48("225"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("226") ? {} : (stryCov_9fa48("226"), {
                subjectId: selectedSubject,
                topicIds: (stryMutAct_9fa48("230") ? selectedTopics.length <= 0 : stryMutAct_9fa48("229") ? selectedTopics.length >= 0 : stryMutAct_9fa48("228") ? false : stryMutAct_9fa48("227") ? true : (stryCov_9fa48("227", "228", "229", "230"), selectedTopics.length > 0)) ? selectedTopics : undefined,
                numQuestions,
                difficulty,
                tipo,
                includeAnswerKey,
                titulo: stryMutAct_9fa48("233") ? titulo && undefined : stryMutAct_9fa48("232") ? false : stryMutAct_9fa48("231") ? true : (stryCov_9fa48("231", "232", "233"), titulo || undefined),
                descripcion: stryMutAct_9fa48("236") ? descripcion && undefined : stryMutAct_9fa48("235") ? false : stryMutAct_9fa48("234") ? true : (stryCov_9fa48("234", "235", "236"), descripcion || undefined),
                tiempoLimiteMin: stryMutAct_9fa48("239") ? tiempoLimiteMin && undefined : stryMutAct_9fa48("238") ? false : stryMutAct_9fa48("237") ? true : (stryCov_9fa48("237", "238", "239"), tiempoLimiteMin || undefined),
                fuente: stryMutAct_9fa48("242") ? fuente && undefined : stryMutAct_9fa48("241") ? false : stryMutAct_9fa48("240") ? true : (stryCov_9fa48("240", "241", "242"), fuente || undefined)
              }))
            }));
            const data = await res.json();
            if (stryMutAct_9fa48("245") ? false : stryMutAct_9fa48("244") ? true : stryMutAct_9fa48("243") ? res.ok : (stryCov_9fa48("243", "244", "245"), !res.ok)) {
              if (stryMutAct_9fa48("246")) {
                {}
              } else {
                stryCov_9fa48("246");
                throw new Error(stryMutAct_9fa48("249") ? data.error && 'Error al generar examen' : stryMutAct_9fa48("248") ? false : stryMutAct_9fa48("247") ? true : (stryCov_9fa48("247", "248", "249"), data.error || (stryMutAct_9fa48("250") ? "" : (stryCov_9fa48("250"), 'Error al generar examen'))));
              }
            }
            setSuccess(stryMutAct_9fa48("251") ? {} : (stryCov_9fa48("251"), {
              examId: data.exam.id,
              message: data.message
            }));

            // Limpiar formulario después de 3 segundos
            setTimeout(() => {
              if (stryMutAct_9fa48("252")) {
                {}
              } else {
                stryCov_9fa48("252");
                setTitulo(stryMutAct_9fa48("253") ? "Stryker was here!" : (stryCov_9fa48("253"), ''));
                setDescripcion(stryMutAct_9fa48("254") ? "Stryker was here!" : (stryCov_9fa48("254"), ''));
                setFuente(stryMutAct_9fa48("255") ? "Stryker was here!" : (stryCov_9fa48("255"), ''));
                setSelectedTopics(stryMutAct_9fa48("256") ? ["Stryker was here"] : (stryCov_9fa48("256"), []));
              }
            }, 3000);
          }
        } catch (error) {
          if (stryMutAct_9fa48("257")) {
            {}
          } else {
            stryCov_9fa48("257");
            setError(error instanceof Error ? error.message : stryMutAct_9fa48("258") ? "" : (stryCov_9fa48("258"), 'Error desconocido'));
          }
        } finally {
          if (stryMutAct_9fa48("259")) {
            {}
          } else {
            stryCov_9fa48("259");
            setLoading(stryMutAct_9fa48("260") ? true : (stryCov_9fa48("260"), false));
          }
        }
      }
    };
    if (stryMutAct_9fa48("262") ? false : stryMutAct_9fa48("261") ? true : (stryCov_9fa48("261", "262"), loadingData)) {
      if (stryMutAct_9fa48("263")) {
        {}
      } else {
        stryCov_9fa48("263");
        return <div className="container mx-auto py-6 px-4 max-w-4xl">
        <Breadcrumbs className="mb-6" />
        <SkeletonLoader variant="form" />
      </div>;
      }
    }
    return <div className="container mx-auto py-6 px-4 max-w-4xl">
      <Breadcrumbs className="mb-6" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("264") ? () => undefined : (stryCov_9fa48("264"), () => router.back())}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            Generar Examen con IA
          </h1>
          <p className="text-muted-foreground mt-2">
            Genera exámenes automáticamente basados en temarios y la malla curricular chilena
          </p>
        </div>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Generación Inteligente de Exámenes</AlertTitle>
        <AlertDescription className="mt-2">
          El sistema utiliza IA para generar exámenes alineados con la malla curricular del MINEDUC.
          Las preguntas se basan en los temarios importados y siguen el formato de la PAES.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asignatura */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Examen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Asignatura *</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecciona una asignatura" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(stryMutAct_9fa48("265") ? () => undefined : (stryCov_9fa48("265"), subject => <SelectItem key={subject.id} value={subject.id}>
                      {subject.nombre} ({subject.codigo})
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            {/* Temas (opcional) */}
            {stryMutAct_9fa48("268") ? selectedSubject && topics.length > 0 || <div className="space-y-2">
                <Label>Temas Específicos (opcional)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Selecciona temas específicos. Si no seleccionas ninguno, se usarán todos los temas
                  de la asignatura.
                </p>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {topics.map(topic => <div key={topic.id} className="flex items-start space-x-2">
                        <Checkbox id={`topic-${topic.id}`} checked={selectedTopics.includes(topic.id)} onCheckedChange={() => handleTopicToggle(topic.id)} />
                        <label htmlFor={`topic-${topic.id}`} className="text-sm cursor-pointer flex-1">
                          <div className="font-medium">{topic.nombre}</div>
                          <div className="text-xs text-muted-foreground">
                            Eje: {topic.ejeTematico}
                          </div>
                        </label>
                      </div>)}
                  </div>
                </div>
              </div> : stryMutAct_9fa48("267") ? false : stryMutAct_9fa48("266") ? true : (stryCov_9fa48("266", "267", "268"), (stryMutAct_9fa48("270") ? selectedSubject || topics.length > 0 : stryMutAct_9fa48("269") ? true : (stryCov_9fa48("269", "270"), selectedSubject && (stryMutAct_9fa48("273") ? topics.length <= 0 : stryMutAct_9fa48("272") ? topics.length >= 0 : stryMutAct_9fa48("271") ? true : (stryCov_9fa48("271", "272", "273"), topics.length > 0)))) && <div className="space-y-2">
                <Label>Temas Específicos (opcional)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Selecciona temas específicos. Si no seleccionas ninguno, se usarán todos los temas
                  de la asignatura.
                </p>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {topics.map(stryMutAct_9fa48("274") ? () => undefined : (stryCov_9fa48("274"), topic => <div key={topic.id} className="flex items-start space-x-2">
                        <Checkbox id={stryMutAct_9fa48("275") ? `` : (stryCov_9fa48("275"), `topic-${topic.id}`)} checked={selectedTopics.includes(topic.id)} onCheckedChange={stryMutAct_9fa48("276") ? () => undefined : (stryCov_9fa48("276"), () => handleTopicToggle(topic.id))} />
                        <label htmlFor={stryMutAct_9fa48("277") ? `` : (stryCov_9fa48("277"), `topic-${topic.id}`)} className="text-sm cursor-pointer flex-1">
                          <div className="font-medium">{topic.nombre}</div>
                          <div className="text-xs text-muted-foreground">
                            Eje: {topic.ejeTematico}
                          </div>
                        </label>
                      </div>))}
                  </div>
                </div>
              </div>)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numQuestions">Número de Preguntas *</Label>
                <Input id="numQuestions" type="number" min={5} max={80} value={numQuestions} onChange={stryMutAct_9fa48("278") ? () => undefined : (stryCov_9fa48("278"), e => setNumQuestions(stryMutAct_9fa48("281") ? parseInt(e.target.value) && 30 : stryMutAct_9fa48("280") ? false : stryMutAct_9fa48("279") ? true : (stryCov_9fa48("279", "280", "281"), parseInt(e.target.value) || 30)))} required />
                <p className="text-xs text-muted-foreground">Entre 5 y 80 preguntas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select value={difficulty} onValueChange={stryMutAct_9fa48("282") ? () => undefined : (stryCov_9fa48("282"), v => setDifficulty(v as '1' | '2' | '3' | '4' | '5' | 'all'))}>
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixta">Mixta</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Examen</Label>
                <Select value={tipo} onValueChange={stryMutAct_9fa48("283") ? () => undefined : (stryCov_9fa48("283"), v => setTipo(v as 'obligatorio' | 'electivo' | 'all'))}>
                  <SelectTrigger id="tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="objetiva">Objetiva (Opción Múltiple)</SelectItem>
                    <SelectItem value="desarrollo">Desarrollo</SelectItem>
                    <SelectItem value="mixta">Mixta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiempoLimiteMin">Tiempo Límite (minutos)</Label>
                <Input id="tiempoLimiteMin" type="number" min={1} value={stryMutAct_9fa48("286") ? tiempoLimiteMin && '' : stryMutAct_9fa48("285") ? false : stryMutAct_9fa48("284") ? true : (stryCov_9fa48("284", "285", "286"), tiempoLimiteMin || (stryMutAct_9fa48("287") ? "Stryker was here!" : (stryCov_9fa48("287"), '')))} onChange={stryMutAct_9fa48("288") ? () => undefined : (stryCov_9fa48("288"), e => setTiempoLimiteMin(e.target.value ? parseInt(e.target.value) : undefined))} placeholder="Auto (1.5 min/pregunta)" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional (Opcional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título del Examen</Label>
              <Input id="titulo" value={titulo} onChange={stryMutAct_9fa48("289") ? () => undefined : (stryCov_9fa48("289"), e => setTitulo(e.target.value))} placeholder="Ej: PAES 2026 - Matemática (Simulacro)" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" value={descripcion} onChange={stryMutAct_9fa48("290") ? () => undefined : (stryCov_9fa48("290"), e => setDescripcion(e.target.value))} placeholder="Descripción del examen..." rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuente">Fuente</Label>
              <Input id="fuente" value={fuente} onChange={stryMutAct_9fa48("291") ? () => undefined : (stryCov_9fa48("291"), e => setFuente(e.target.value))} placeholder="Ej: Generado con IA - PAES Tutor" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="includeAnswerKey" checked={includeAnswerKey} onCheckedChange={stryMutAct_9fa48("292") ? () => undefined : (stryCov_9fa48("292"), checked => setIncludeAnswerKey(stryMutAct_9fa48("295") ? checked !== true : stryMutAct_9fa48("294") ? false : stryMutAct_9fa48("293") ? true : (stryCov_9fa48("293", "294", "295"), checked === (stryMutAct_9fa48("296") ? false : (stryCov_9fa48("296"), true)))))} />
              <label htmlFor="includeAnswerKey" className="text-sm cursor-pointer">
                Incluir clavijero (respuestas correctas)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Mensajes */}
        {stryMutAct_9fa48("299") ? error || <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert> : stryMutAct_9fa48("298") ? false : stryMutAct_9fa48("297") ? true : (stryCov_9fa48("297", "298", "299"), error && <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>)}

        {stryMutAct_9fa48("302") ? success || <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              Examen Generado Exitosamente
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              {success.message}
            </AlertDescription>
          </Alert> : stryMutAct_9fa48("301") ? false : stryMutAct_9fa48("300") ? true : (stryCov_9fa48("300", "301", "302"), success && <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              Examen Generado Exitosamente
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              {success.message}
            </AlertDescription>
          </Alert>)}

        {/* Botón de generar */}
        <div className="flex gap-4">
          <Button type="submit" disabled={stryMutAct_9fa48("305") ? loading && !selectedSubject : stryMutAct_9fa48("304") ? false : stryMutAct_9fa48("303") ? true : (stryCov_9fa48("303", "304", "305"), loading || (stryMutAct_9fa48("306") ? selectedSubject : (stryCov_9fa48("306"), !selectedSubject)))} className="flex-1" size="lg">
            {loading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando Examen...
              </> : <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar Examen con IA
              </>}
          </Button>
          <Button type="button" variant="outline" onClick={stryMutAct_9fa48("307") ? () => undefined : (stryCov_9fa48("307"), () => router.push(stryMutAct_9fa48("308") ? "" : (stryCov_9fa48("308"), '/admin')))} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>;
  }
}