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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, BookOpen, PlayCircle, TrendingUp, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { HelpIcon } from '@/components/help/help-icon';
interface Subject {
  id: string;
  nombre: string;
  codigo: string;
  tipo: string;
}
interface Topic {
  id: string;
  nombre: string;
  ejeTematico: string;
  descripcion: string | null;
  subjectId: string;
}
export default function PracticePage() {
  if (stryMutAct_9fa48("14577")) {
    {}
  } else {
    stryCov_9fa48("14577");
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>(stryMutAct_9fa48("14578") ? ["Stryker was here"] : (stryCov_9fa48("14578"), []));
    const [topics, setTopics] = useState<Topic[]>(stryMutAct_9fa48("14579") ? ["Stryker was here"] : (stryCov_9fa48("14579"), []));
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>(stryMutAct_9fa48("14580") ? "Stryker was here!" : (stryCov_9fa48("14580"), ''));
    const [loading, setLoading] = useState(stryMutAct_9fa48("14581") ? false : (stryCov_9fa48("14581"), true));
    const [loadingTopics, setLoadingTopics] = useState(stryMutAct_9fa48("14582") ? true : (stryCov_9fa48("14582"), false));
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("14583")) {
        {}
      } else {
        stryCov_9fa48("14583");
        async function loadSubjects() {
          if (stryMutAct_9fa48("14584")) {
            {}
          } else {
            stryCov_9fa48("14584");
            try {
              if (stryMutAct_9fa48("14585")) {
                {}
              } else {
                stryCov_9fa48("14585");
                setLoading(stryMutAct_9fa48("14586") ? false : (stryCov_9fa48("14586"), true));
                const res = await fetch(stryMutAct_9fa48("14587") ? "" : (stryCov_9fa48("14587"), '/api/subjects'));
                if (stryMutAct_9fa48("14590") ? false : stryMutAct_9fa48("14589") ? true : stryMutAct_9fa48("14588") ? res.ok : (stryCov_9fa48("14588", "14589", "14590"), !res.ok)) throw new Error(stryMutAct_9fa48("14591") ? "" : (stryCov_9fa48("14591"), 'Error al cargar asignaturas'));
                const data = await res.json();
                setSubjects(stryMutAct_9fa48("14594") ? data.subjects && [] : stryMutAct_9fa48("14593") ? false : stryMutAct_9fa48("14592") ? true : (stryCov_9fa48("14592", "14593", "14594"), data.subjects || (stryMutAct_9fa48("14595") ? ["Stryker was here"] : (stryCov_9fa48("14595"), []))));
              }
            } catch (err) {
              if (stryMutAct_9fa48("14596")) {
                {}
              } else {
                stryCov_9fa48("14596");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("14597") ? "" : (stryCov_9fa48("14597"), 'Error desconocido'));
                toast.error(stryMutAct_9fa48("14598") ? "" : (stryCov_9fa48("14598"), 'Error al cargar asignaturas'));
              }
            } finally {
              if (stryMutAct_9fa48("14599")) {
                {}
              } else {
                stryCov_9fa48("14599");
                setLoading(stryMutAct_9fa48("14600") ? true : (stryCov_9fa48("14600"), false));
              }
            }
          }
        }
        loadSubjects();
      }
    }, stryMutAct_9fa48("14601") ? ["Stryker was here"] : (stryCov_9fa48("14601"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("14602")) {
        {}
      } else {
        stryCov_9fa48("14602");
        async function loadTopics() {
          if (stryMutAct_9fa48("14603")) {
            {}
          } else {
            stryCov_9fa48("14603");
            if (stryMutAct_9fa48("14606") ? false : stryMutAct_9fa48("14605") ? true : stryMutAct_9fa48("14604") ? selectedSubjectId : (stryCov_9fa48("14604", "14605", "14606"), !selectedSubjectId)) {
              if (stryMutAct_9fa48("14607")) {
                {}
              } else {
                stryCov_9fa48("14607");
                setTopics(stryMutAct_9fa48("14608") ? ["Stryker was here"] : (stryCov_9fa48("14608"), []));
                return;
              }
            }
            try {
              if (stryMutAct_9fa48("14609")) {
                {}
              } else {
                stryCov_9fa48("14609");
                setLoadingTopics(stryMutAct_9fa48("14610") ? false : (stryCov_9fa48("14610"), true));
                const res = await fetch(stryMutAct_9fa48("14611") ? `` : (stryCov_9fa48("14611"), `/api/topics?subjectId=${selectedSubjectId}`));
                if (stryMutAct_9fa48("14614") ? false : stryMutAct_9fa48("14613") ? true : stryMutAct_9fa48("14612") ? res.ok : (stryCov_9fa48("14612", "14613", "14614"), !res.ok)) throw new Error(stryMutAct_9fa48("14615") ? "" : (stryCov_9fa48("14615"), 'Error al cargar temas'));
                const data = await res.json();
                setTopics(stryMutAct_9fa48("14618") ? data.topics && [] : stryMutAct_9fa48("14617") ? false : stryMutAct_9fa48("14616") ? true : (stryCov_9fa48("14616", "14617", "14618"), data.topics || (stryMutAct_9fa48("14619") ? ["Stryker was here"] : (stryCov_9fa48("14619"), []))));
              }
            } catch (err) {
              if (stryMutAct_9fa48("14620")) {
                {}
              } else {
                stryCov_9fa48("14620");
                toast.error(stryMutAct_9fa48("14621") ? "" : (stryCov_9fa48("14621"), 'Error al cargar temas'));
                setTopics(stryMutAct_9fa48("14622") ? ["Stryker was here"] : (stryCov_9fa48("14622"), []));
              }
            } finally {
              if (stryMutAct_9fa48("14623")) {
                {}
              } else {
                stryCov_9fa48("14623");
                setLoadingTopics(stryMutAct_9fa48("14624") ? true : (stryCov_9fa48("14624"), false));
              }
            }
          }
        }
        loadTopics();
      }
    }, stryMutAct_9fa48("14625") ? [] : (stryCov_9fa48("14625"), [selectedSubjectId]));
    const handleStartPractice = (topicId: string) => {
      if (stryMutAct_9fa48("14626")) {
        {}
      } else {
        stryCov_9fa48("14626");
        router.push(stryMutAct_9fa48("14627") ? `` : (stryCov_9fa48("14627"), `/practice/${topicId}`));
      }
    };
    if (stryMutAct_9fa48("14629") ? false : stryMutAct_9fa48("14628") ? true : (stryCov_9fa48("14628", "14629"), loading)) {
      if (stryMutAct_9fa48("14630")) {
        {}
      } else {
        stryCov_9fa48("14630");
        return <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(stryMutAct_9fa48("14631") ? [] : (stryCov_9fa48("14631"), [1, 2, 3, 4, 5, 6])).map(stryMutAct_9fa48("14632") ? () => undefined : (stryCov_9fa48("14632"), i => <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>))}
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("14634") ? false : stryMutAct_9fa48("14633") ? true : (stryCov_9fa48("14633", "14634"), error)) {
      if (stryMutAct_9fa48("14635")) {
        {}
      } else {
        stryCov_9fa48("14635");
        return <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>;
      }
    }
    return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PlayCircle className="h-8 w-8" />
            Modo de Práctica
          </h1>
          <p className="text-muted-foreground mt-2">
            Practica preguntas de temas específicos sin presión de tiempo
          </p>
        </div>
        <HelpIcon content="En el modo de práctica puedes estudiar temas específicos sin timer. Recibirás feedback inmediato después de cada respuesta." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecciona un Tema</CardTitle>
          <CardDescription>
            Elige una asignatura y luego un tema para comenzar a practicar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Asignatura</label>
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una asignatura" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(stryMutAct_9fa48("14636") ? () => undefined : (stryCov_9fa48("14636"), subject => <SelectItem key={subject.id} value={subject.id}>
                    {subject.nombre}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {stryMutAct_9fa48("14639") ? loadingTopics || <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div> : stryMutAct_9fa48("14638") ? false : stryMutAct_9fa48("14637") ? true : (stryCov_9fa48("14637", "14638", "14639"), loadingTopics && <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>)}

          {stryMutAct_9fa48("14642") ? !loadingTopics && selectedSubjectId && topics.length === 0 || <div className="text-center py-8 text-muted-foreground">
              No hay temas disponibles para esta asignatura
            </div> : stryMutAct_9fa48("14641") ? false : stryMutAct_9fa48("14640") ? true : (stryCov_9fa48("14640", "14641", "14642"), (stryMutAct_9fa48("14644") ? !loadingTopics && selectedSubjectId || topics.length === 0 : stryMutAct_9fa48("14643") ? true : (stryCov_9fa48("14643", "14644"), (stryMutAct_9fa48("14646") ? !loadingTopics || selectedSubjectId : stryMutAct_9fa48("14645") ? true : (stryCov_9fa48("14645", "14646"), (stryMutAct_9fa48("14647") ? loadingTopics : (stryCov_9fa48("14647"), !loadingTopics)) && selectedSubjectId)) && (stryMutAct_9fa48("14649") ? topics.length !== 0 : stryMutAct_9fa48("14648") ? true : (stryCov_9fa48("14648", "14649"), topics.length === 0)))) && <div className="text-center py-8 text-muted-foreground">
              No hay temas disponibles para esta asignatura
            </div>)}

          {stryMutAct_9fa48("14652") ? !loadingTopics && topics.length > 0 || <div className="space-y-2">
              <label className="text-sm font-medium">Tema</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map(topic => <Card key={topic.id} className="hover:border-primary transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{topic.nombre}</CardTitle>
                        <Badge variant="outline">{topic.ejeTematico}</Badge>
                      </div>
                      {topic.descripcion && <CardDescription className="text-sm mt-2">
                          {topic.descripcion}
                        </CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => handleStartPractice(topic.id)} className="w-full" size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Practicar
                      </Button>
                    </CardContent>
                  </Card>)}
              </div>
            </div> : stryMutAct_9fa48("14651") ? false : stryMutAct_9fa48("14650") ? true : (stryCov_9fa48("14650", "14651", "14652"), (stryMutAct_9fa48("14654") ? !loadingTopics || topics.length > 0 : stryMutAct_9fa48("14653") ? true : (stryCov_9fa48("14653", "14654"), (stryMutAct_9fa48("14655") ? loadingTopics : (stryCov_9fa48("14655"), !loadingTopics)) && (stryMutAct_9fa48("14658") ? topics.length <= 0 : stryMutAct_9fa48("14657") ? topics.length >= 0 : stryMutAct_9fa48("14656") ? true : (stryCov_9fa48("14656", "14657", "14658"), topics.length > 0)))) && <div className="space-y-2">
              <label className="text-sm font-medium">Tema</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map(stryMutAct_9fa48("14659") ? () => undefined : (stryCov_9fa48("14659"), topic => <Card key={topic.id} className="hover:border-primary transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{topic.nombre}</CardTitle>
                        <Badge variant="outline">{topic.ejeTematico}</Badge>
                      </div>
                      {stryMutAct_9fa48("14662") ? topic.descripcion || <CardDescription className="text-sm mt-2">
                          {topic.descripcion}
                        </CardDescription> : stryMutAct_9fa48("14661") ? false : stryMutAct_9fa48("14660") ? true : (stryCov_9fa48("14660", "14661", "14662"), topic.descripcion && <CardDescription className="text-sm mt-2">
                          {topic.descripcion}
                        </CardDescription>)}
                    </CardHeader>
                    <CardContent>
                      <Button onClick={stryMutAct_9fa48("14663") ? () => undefined : (stryCov_9fa48("14663"), () => handleStartPractice(topic.id))} className="w-full" size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Practicar
                      </Button>
                    </CardContent>
                  </Card>))}
              </div>
            </div>)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Beneficios del Modo de Práctica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Sin Presión</h3>
                <p className="text-sm text-muted-foreground">
                  Practica sin timer, a tu propio ritmo
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Feedback Inmediato</h3>
                <p className="text-sm text-muted-foreground">Recibe explicaciones al instante</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Enfoque Dirigido</h3>
                <p className="text-sm text-muted-foreground">
                  Practica solo los temas que necesitas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
  }
}