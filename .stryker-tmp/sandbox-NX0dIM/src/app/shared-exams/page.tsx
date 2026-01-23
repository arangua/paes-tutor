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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Share2, Eye, EyeOff, BookOpen, Clock, User, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { BackButton } from '@/components/navigation/back-button';
import Link from 'next/link';
// Función simple para formatear fechas relativas
function formatRelativeTime(dateString: string): string {
  if (stryMutAct_9fa48("15561")) {
    {}
  } else {
    stryCov_9fa48("15561");
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = stryMutAct_9fa48("15562") ? now.getTime() + date.getTime() : (stryCov_9fa48("15562"), now.getTime() - date.getTime());
    const diffMins = Math.floor(stryMutAct_9fa48("15563") ? diffMs * 60000 : (stryCov_9fa48("15563"), diffMs / 60000));
    const diffHours = Math.floor(stryMutAct_9fa48("15564") ? diffMs * 3600000 : (stryCov_9fa48("15564"), diffMs / 3600000));
    const diffDays = Math.floor(stryMutAct_9fa48("15565") ? diffMs * 86400000 : (stryCov_9fa48("15565"), diffMs / 86400000));
    if (stryMutAct_9fa48("15569") ? diffMins >= 1 : stryMutAct_9fa48("15568") ? diffMins <= 1 : stryMutAct_9fa48("15567") ? false : stryMutAct_9fa48("15566") ? true : (stryCov_9fa48("15566", "15567", "15568", "15569"), diffMins < 1)) return stryMutAct_9fa48("15570") ? "" : (stryCov_9fa48("15570"), 'hace unos momentos');
    if (stryMutAct_9fa48("15574") ? diffMins >= 60 : stryMutAct_9fa48("15573") ? diffMins <= 60 : stryMutAct_9fa48("15572") ? false : stryMutAct_9fa48("15571") ? true : (stryCov_9fa48("15571", "15572", "15573", "15574"), diffMins < 60)) return stryMutAct_9fa48("15575") ? `` : (stryCov_9fa48("15575"), `hace ${diffMins} minuto${(stryMutAct_9fa48("15578") ? diffMins === 1 : stryMutAct_9fa48("15577") ? false : stryMutAct_9fa48("15576") ? true : (stryCov_9fa48("15576", "15577", "15578"), diffMins !== 1)) ? stryMutAct_9fa48("15579") ? "" : (stryCov_9fa48("15579"), 's') : stryMutAct_9fa48("15580") ? "Stryker was here!" : (stryCov_9fa48("15580"), '')}`);
    if (stryMutAct_9fa48("15584") ? diffHours >= 24 : stryMutAct_9fa48("15583") ? diffHours <= 24 : stryMutAct_9fa48("15582") ? false : stryMutAct_9fa48("15581") ? true : (stryCov_9fa48("15581", "15582", "15583", "15584"), diffHours < 24)) return stryMutAct_9fa48("15585") ? `` : (stryCov_9fa48("15585"), `hace ${diffHours} hora${(stryMutAct_9fa48("15588") ? diffHours === 1 : stryMutAct_9fa48("15587") ? false : stryMutAct_9fa48("15586") ? true : (stryCov_9fa48("15586", "15587", "15588"), diffHours !== 1)) ? stryMutAct_9fa48("15589") ? "" : (stryCov_9fa48("15589"), 's') : stryMutAct_9fa48("15590") ? "Stryker was here!" : (stryCov_9fa48("15590"), '')}`);
    if (stryMutAct_9fa48("15594") ? diffDays >= 7 : stryMutAct_9fa48("15593") ? diffDays <= 7 : stryMutAct_9fa48("15592") ? false : stryMutAct_9fa48("15591") ? true : (stryCov_9fa48("15591", "15592", "15593", "15594"), diffDays < 7)) return stryMutAct_9fa48("15595") ? `` : (stryCov_9fa48("15595"), `hace ${diffDays} día${(stryMutAct_9fa48("15598") ? diffDays === 1 : stryMutAct_9fa48("15597") ? false : stryMutAct_9fa48("15596") ? true : (stryCov_9fa48("15596", "15597", "15598"), diffDays !== 1)) ? stryMutAct_9fa48("15599") ? "" : (stryCov_9fa48("15599"), 's') : stryMutAct_9fa48("15600") ? "Stryker was here!" : (stryCov_9fa48("15600"), '')}`);
    return date.toLocaleDateString(stryMutAct_9fa48("15601") ? "" : (stryCov_9fa48("15601"), 'es-CL'), stryMutAct_9fa48("15602") ? {} : (stryCov_9fa48("15602"), {
      year: stryMutAct_9fa48("15603") ? "" : (stryCov_9fa48("15603"), 'numeric'),
      month: stryMutAct_9fa48("15604") ? "" : (stryCov_9fa48("15604"), 'short'),
      day: stryMutAct_9fa48("15605") ? "" : (stryCov_9fa48("15605"), 'numeric')
    }));
  }
}
interface SharedExam {
  id: string;
  examId: string;
  message: string | null;
  viewed: boolean;
  viewedAt: string | null;
  createdAt: string;
  exam: {
    id: string;
    titulo: string;
    descripcion: string | null;
    tipo: string;
    tiempoLimiteMin: number | null;
    totalPreguntas: number;
    subject: {
      id: string;
      nombre: string;
      codigo: string;
    };
  };
  sharedBy?: {
    id: string;
    nombre: string;
    user: {
      email: string | null;
    };
  };
  sharedWith?: {
    id: string;
    nombre: string;
    user: {
      email: string | null;
    };
  };
}
export default function SharedExamsPage() {
  if (stryMutAct_9fa48("15606")) {
    {}
  } else {
    stryCov_9fa48("15606");
    const [receivedExams, setReceivedExams] = useState<SharedExam[]>(stryMutAct_9fa48("15607") ? ["Stryker was here"] : (stryCov_9fa48("15607"), []));
    const [sentExams, setSentExams] = useState<SharedExam[]>(stryMutAct_9fa48("15608") ? ["Stryker was here"] : (stryCov_9fa48("15608"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("15609") ? false : (stryCov_9fa48("15609"), true));
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>(stryMutAct_9fa48("15610") ? "" : (stryCov_9fa48("15610"), 'received'));
    useEffect(() => {
      if (stryMutAct_9fa48("15611")) {
        {}
      } else {
        stryCov_9fa48("15611");
        loadSharedExams();
      }
    }, stryMutAct_9fa48("15612") ? ["Stryker was here"] : (stryCov_9fa48("15612"), []));
    async function loadSharedExams() {
      if (stryMutAct_9fa48("15613")) {
        {}
      } else {
        stryCov_9fa48("15613");
        try {
          if (stryMutAct_9fa48("15614")) {
            {}
          } else {
            stryCov_9fa48("15614");
            setLoading(stryMutAct_9fa48("15615") ? false : (stryCov_9fa48("15615"), true));
            const [receivedRes, sentRes] = await Promise.all(stryMutAct_9fa48("15616") ? [] : (stryCov_9fa48("15616"), [fetch(stryMutAct_9fa48("15617") ? "" : (stryCov_9fa48("15617"), '/api/shared-exams?type=received')), fetch(stryMutAct_9fa48("15618") ? "" : (stryCov_9fa48("15618"), '/api/shared-exams?type=sent'))]));
            if (stryMutAct_9fa48("15621") ? !receivedRes.ok && !sentRes.ok : stryMutAct_9fa48("15620") ? false : stryMutAct_9fa48("15619") ? true : (stryCov_9fa48("15619", "15620", "15621"), (stryMutAct_9fa48("15622") ? receivedRes.ok : (stryCov_9fa48("15622"), !receivedRes.ok)) || (stryMutAct_9fa48("15623") ? sentRes.ok : (stryCov_9fa48("15623"), !sentRes.ok)))) {
              if (stryMutAct_9fa48("15624")) {
                {}
              } else {
                stryCov_9fa48("15624");
                throw new Error(stryMutAct_9fa48("15625") ? "" : (stryCov_9fa48("15625"), 'Error al cargar exámenes compartidos'));
              }
            }
            const receivedData = await receivedRes.json();
            const sentData = await sentRes.json();
            setReceivedExams(stryMutAct_9fa48("15628") ? receivedData.sharedExams && [] : stryMutAct_9fa48("15627") ? false : stryMutAct_9fa48("15626") ? true : (stryCov_9fa48("15626", "15627", "15628"), receivedData.sharedExams || (stryMutAct_9fa48("15629") ? ["Stryker was here"] : (stryCov_9fa48("15629"), []))));
            setSentExams(stryMutAct_9fa48("15632") ? sentData.sharedExams && [] : stryMutAct_9fa48("15631") ? false : stryMutAct_9fa48("15630") ? true : (stryCov_9fa48("15630", "15631", "15632"), sentData.sharedExams || (stryMutAct_9fa48("15633") ? ["Stryker was here"] : (stryCov_9fa48("15633"), []))));
          }
        } catch (error) {
          if (stryMutAct_9fa48("15634")) {
            {}
          } else {
            stryCov_9fa48("15634");
            toast.error(error instanceof Error ? error.message : stryMutAct_9fa48("15635") ? "" : (stryCov_9fa48("15635"), 'Error al cargar exámenes compartidos'));
          }
        } finally {
          if (stryMutAct_9fa48("15636")) {
            {}
          } else {
            stryCov_9fa48("15636");
            setLoading(stryMutAct_9fa48("15637") ? true : (stryCov_9fa48("15637"), false));
          }
        }
      }
    }
    async function markAsViewed(sharedExamId: string) {
      if (stryMutAct_9fa48("15638")) {
        {}
      } else {
        stryCov_9fa48("15638");
        try {
          if (stryMutAct_9fa48("15639")) {
            {}
          } else {
            stryCov_9fa48("15639");
            const res = await fetch(stryMutAct_9fa48("15640") ? `` : (stryCov_9fa48("15640"), `/api/shared-exams/${sharedExamId}`), stryMutAct_9fa48("15641") ? {} : (stryCov_9fa48("15641"), {
              method: stryMutAct_9fa48("15642") ? "" : (stryCov_9fa48("15642"), 'PATCH')
            }));
            if (stryMutAct_9fa48("15645") ? false : stryMutAct_9fa48("15644") ? true : stryMutAct_9fa48("15643") ? res.ok : (stryCov_9fa48("15643", "15644", "15645"), !res.ok)) {
              if (stryMutAct_9fa48("15646")) {
                {}
              } else {
                stryCov_9fa48("15646");
                throw new Error(stryMutAct_9fa48("15647") ? "" : (stryCov_9fa48("15647"), 'Error al marcar como visto'));
              }
            }

            // Actualizar estado local
            setReceivedExams(stryMutAct_9fa48("15648") ? () => undefined : (stryCov_9fa48("15648"), prev => prev.map(stryMutAct_9fa48("15649") ? () => undefined : (stryCov_9fa48("15649"), exam => (stryMutAct_9fa48("15652") ? exam.id !== sharedExamId : stryMutAct_9fa48("15651") ? false : stryMutAct_9fa48("15650") ? true : (stryCov_9fa48("15650", "15651", "15652"), exam.id === sharedExamId)) ? stryMutAct_9fa48("15653") ? {} : (stryCov_9fa48("15653"), {
              ...exam,
              viewed: stryMutAct_9fa48("15654") ? false : (stryCov_9fa48("15654"), true),
              viewedAt: new Date().toISOString()
            }) : exam))));
            toast.success(stryMutAct_9fa48("15655") ? "" : (stryCov_9fa48("15655"), 'Marcado como visto'));
          }
        } catch (error) {
          if (stryMutAct_9fa48("15656")) {
            {}
          } else {
            stryCov_9fa48("15656");
            toast.error(error instanceof Error ? error.message : stryMutAct_9fa48("15657") ? "" : (stryCov_9fa48("15657"), 'Error al marcar como visto'));
          }
        }
      }
    }
    const formatDate = formatRelativeTime;
    if (stryMutAct_9fa48("15659") ? false : stryMutAct_9fa48("15658") ? true : (stryCov_9fa48("15658", "15659"), loading)) {
      if (stryMutAct_9fa48("15660")) {
        {}
      } else {
        stryCov_9fa48("15660");
        return <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>;
      }
    }
    return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exámenes Compartidos</h1>
          <p className="text-muted-foreground mt-2">
            Exámenes que has compartido o que te han compartido
          </p>
        </div>
        <BackButton />
      </div>

      <Tabs value={activeTab} onValueChange={stryMutAct_9fa48("15661") ? () => undefined : (stryCov_9fa48("15661"), v => setActiveTab(v as 'received' | 'sent'))}>
        <TabsList>
          <TabsTrigger value="received">
            Recibidos ({receivedExams.length})
            {stryMutAct_9fa48("15664") ? receivedExams.filter(e => !e.viewed).length > 0 || <Badge variant="destructive" className="ml-2">
                {receivedExams.filter(e => !e.viewed).length}
              </Badge> : stryMutAct_9fa48("15663") ? false : stryMutAct_9fa48("15662") ? true : (stryCov_9fa48("15662", "15663", "15664"), (stryMutAct_9fa48("15667") ? receivedExams.filter(e => !e.viewed).length <= 0 : stryMutAct_9fa48("15666") ? receivedExams.filter(e => !e.viewed).length >= 0 : stryMutAct_9fa48("15665") ? true : (stryCov_9fa48("15665", "15666", "15667"), (stryMutAct_9fa48("15668") ? receivedExams.length : (stryCov_9fa48("15668"), receivedExams.filter(stryMutAct_9fa48("15669") ? () => undefined : (stryCov_9fa48("15669"), e => stryMutAct_9fa48("15670") ? e.viewed : (stryCov_9fa48("15670"), !e.viewed))).length)) > 0)) && <Badge variant="destructive" className="ml-2">
                {stryMutAct_9fa48("15671") ? receivedExams.length : (stryCov_9fa48("15671"), receivedExams.filter(stryMutAct_9fa48("15672") ? () => undefined : (stryCov_9fa48("15672"), e => stryMutAct_9fa48("15673") ? e.viewed : (stryCov_9fa48("15673"), !e.viewed))).length)}
              </Badge>)}
          </TabsTrigger>
          <TabsTrigger value="sent">Enviados ({sentExams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {(stryMutAct_9fa48("15676") ? receivedExams.length !== 0 : stryMutAct_9fa48("15675") ? false : stryMutAct_9fa48("15674") ? true : (stryCov_9fa48("15674", "15675", "15676"), receivedExams.length === 0)) ? <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No has recibido ningún examen compartido aún.
                </p>
              </CardContent>
            </Card> : receivedExams.map(stryMutAct_9fa48("15677") ? () => undefined : (stryCov_9fa48("15677"), sharedExam => <Card key={sharedExam.id} className={(stryMutAct_9fa48("15678") ? sharedExam.viewed : (stryCov_9fa48("15678"), !sharedExam.viewed)) ? stryMutAct_9fa48("15679") ? "" : (stryCov_9fa48("15679"), 'border-primary') : stryMutAct_9fa48("15680") ? "Stryker was here!" : (stryCov_9fa48("15680"), '')}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {sharedExam.exam.titulo}
                        {stryMutAct_9fa48("15683") ? !sharedExam.viewed || <Badge variant="default" className="ml-2">
                            Nuevo
                          </Badge> : stryMutAct_9fa48("15682") ? false : stryMutAct_9fa48("15681") ? true : (stryCov_9fa48("15681", "15682", "15683"), (stryMutAct_9fa48("15684") ? sharedExam.viewed : (stryCov_9fa48("15684"), !sharedExam.viewed)) && <Badge variant="default" className="ml-2">
                            Nuevo
                          </Badge>)}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Compartido por {stryMutAct_9fa48("15687") ? sharedExam.sharedBy?.nombre && 'otro estudiante' : stryMutAct_9fa48("15686") ? false : stryMutAct_9fa48("15685") ? true : (stryCov_9fa48("15685", "15686", "15687"), (stryMutAct_9fa48("15688") ? sharedExam.sharedBy.nombre : (stryCov_9fa48("15688"), sharedExam.sharedBy?.nombre)) || (stryMutAct_9fa48("15689") ? "" : (stryCov_9fa48("15689"), 'otro estudiante')))}
                        {stryMutAct_9fa48("15690") ? "" : (stryCov_9fa48("15690"), ' • ')}
                        {formatDate(sharedExam.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{sharedExam.exam.subject.codigo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stryMutAct_9fa48("15693") ? sharedExam.message || <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedExam.message}</p>
                      </div>
                    </div> : stryMutAct_9fa48("15692") ? false : stryMutAct_9fa48("15691") ? true : (stryCov_9fa48("15691", "15692", "15693"), sharedExam.message && <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedExam.message}</p>
                      </div>
                    </div>)}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Asignatura:</span>
                      <span className="font-medium">{sharedExam.exam.subject.nombre}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="secondary">{sharedExam.exam.tipo}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Preguntas:</span>
                      <span className="font-medium">{sharedExam.exam.totalPreguntas}</span>
                    </div>
                    {stryMutAct_9fa48("15696") ? sharedExam.exam.tiempoLimiteMin || <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Tiempo límite: {sharedExam.exam.tiempoLimiteMin} minutos
                        </span>
                      </div> : stryMutAct_9fa48("15695") ? false : stryMutAct_9fa48("15694") ? true : (stryCov_9fa48("15694", "15695", "15696"), sharedExam.exam.tiempoLimiteMin && <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Tiempo límite: {sharedExam.exam.tiempoLimiteMin} minutos
                        </span>
                      </div>)}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={stryMutAct_9fa48("15697") ? `` : (stryCov_9fa48("15697"), `/exams/${sharedExam.exam.id}/take`)}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Realizar Examen
                      </Link>
                    </Button>
                    {stryMutAct_9fa48("15700") ? !sharedExam.viewed || <Button variant="outline" onClick={() => markAsViewed(sharedExam.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Marcar como visto
                      </Button> : stryMutAct_9fa48("15699") ? false : stryMutAct_9fa48("15698") ? true : (stryCov_9fa48("15698", "15699", "15700"), (stryMutAct_9fa48("15701") ? sharedExam.viewed : (stryCov_9fa48("15701"), !sharedExam.viewed)) && <Button variant="outline" onClick={stryMutAct_9fa48("15702") ? () => undefined : (stryCov_9fa48("15702"), () => markAsViewed(sharedExam.id))}>
                        <Eye className="h-4 w-4 mr-2" />
                        Marcar como visto
                      </Button>)}
                    {stryMutAct_9fa48("15705") ? sharedExam.viewed || <Button variant="outline" disabled>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Visto
                      </Button> : stryMutAct_9fa48("15704") ? false : stryMutAct_9fa48("15703") ? true : (stryCov_9fa48("15703", "15704", "15705"), sharedExam.viewed && <Button variant="outline" disabled>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Visto
                      </Button>)}
                  </div>
                </CardContent>
              </Card>))}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {(stryMutAct_9fa48("15708") ? sentExams.length !== 0 : stryMutAct_9fa48("15707") ? false : stryMutAct_9fa48("15706") ? true : (stryCov_9fa48("15706", "15707", "15708"), sentExams.length === 0)) ? <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No has compartido ningún examen aún.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Usa el botón "Compartir" en cualquier examen para compartirlo.
                </p>
              </CardContent>
            </Card> : sentExams.map(stryMutAct_9fa48("15709") ? () => undefined : (stryCov_9fa48("15709"), sharedExam => <Card key={sharedExam.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{sharedExam.exam.titulo}</CardTitle>
                      <CardDescription className="mt-2">
                        Compartido con {stryMutAct_9fa48("15712") ? sharedExam.sharedWith?.nombre && 'otro estudiante' : stryMutAct_9fa48("15711") ? false : stryMutAct_9fa48("15710") ? true : (stryCov_9fa48("15710", "15711", "15712"), (stryMutAct_9fa48("15713") ? sharedExam.sharedWith.nombre : (stryCov_9fa48("15713"), sharedExam.sharedWith?.nombre)) || (stryMutAct_9fa48("15714") ? "" : (stryCov_9fa48("15714"), 'otro estudiante')))}
                        {stryMutAct_9fa48("15715") ? "" : (stryCov_9fa48("15715"), ' • ')}
                        {formatDate(sharedExam.createdAt)}
                        {stryMutAct_9fa48("15718") ? sharedExam.viewed || <>
                            {' • '}
                            <span className="text-green-600">Visto</span>
                          </> : stryMutAct_9fa48("15717") ? false : stryMutAct_9fa48("15716") ? true : (stryCov_9fa48("15716", "15717", "15718"), sharedExam.viewed && <>
                            {stryMutAct_9fa48("15719") ? "" : (stryCov_9fa48("15719"), ' • ')}
                            <span className="text-green-600">Visto</span>
                          </>)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{sharedExam.exam.subject.codigo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stryMutAct_9fa48("15722") ? sharedExam.message || <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedExam.message}</p>
                      </div>
                    </div> : stryMutAct_9fa48("15721") ? false : stryMutAct_9fa48("15720") ? true : (stryCov_9fa48("15720", "15721", "15722"), sharedExam.message && <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedExam.message}</p>
                      </div>
                    </div>)}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Asignatura:</span>
                      <span className="font-medium">{sharedExam.exam.subject.nombre}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="secondary">{sharedExam.exam.tipo}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Preguntas:</span>
                      <span className="font-medium">{sharedExam.exam.totalPreguntas}</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href={stryMutAct_9fa48("15723") ? `` : (stryCov_9fa48("15723"), `/exams/${sharedExam.exam.id}/take`)}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ver Examen
                    </Link>
                  </Button>
                </CardContent>
              </Card>))}
        </TabsContent>
      </Tabs>
    </div>;
  }
}