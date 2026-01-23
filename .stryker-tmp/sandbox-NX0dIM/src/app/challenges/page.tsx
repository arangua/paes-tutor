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
import { Loader2, Trophy, Clock, CheckCircle2, XCircle, Users, Target, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { BackButton } from '@/components/navigation/back-button';
import Link from 'next/link';
import { CreateChallengeButton } from '@/components/challenges/create-challenge-button';

// Función simple para formatear fechas relativas
function formatRelativeTime(dateString: string): string {
  if (stryMutAct_9fa48("11887")) {
    {}
  } else {
    stryCov_9fa48("11887");
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = stryMutAct_9fa48("11888") ? now.getTime() + date.getTime() : (stryCov_9fa48("11888"), now.getTime() - date.getTime());
    const diffMins = Math.floor(stryMutAct_9fa48("11889") ? diffMs * 60000 : (stryCov_9fa48("11889"), diffMs / 60000));
    const diffHours = Math.floor(stryMutAct_9fa48("11890") ? diffMs * 3600000 : (stryCov_9fa48("11890"), diffMs / 3600000));
    const diffDays = Math.floor(stryMutAct_9fa48("11891") ? diffMs * 86400000 : (stryCov_9fa48("11891"), diffMs / 86400000));
    if (stryMutAct_9fa48("11895") ? diffMins >= 1 : stryMutAct_9fa48("11894") ? diffMins <= 1 : stryMutAct_9fa48("11893") ? false : stryMutAct_9fa48("11892") ? true : (stryCov_9fa48("11892", "11893", "11894", "11895"), diffMins < 1)) return stryMutAct_9fa48("11896") ? "" : (stryCov_9fa48("11896"), 'hace unos momentos');
    if (stryMutAct_9fa48("11900") ? diffMins >= 60 : stryMutAct_9fa48("11899") ? diffMins <= 60 : stryMutAct_9fa48("11898") ? false : stryMutAct_9fa48("11897") ? true : (stryCov_9fa48("11897", "11898", "11899", "11900"), diffMins < 60)) return stryMutAct_9fa48("11901") ? `` : (stryCov_9fa48("11901"), `hace ${diffMins} minuto${(stryMutAct_9fa48("11904") ? diffMins === 1 : stryMutAct_9fa48("11903") ? false : stryMutAct_9fa48("11902") ? true : (stryCov_9fa48("11902", "11903", "11904"), diffMins !== 1)) ? stryMutAct_9fa48("11905") ? "" : (stryCov_9fa48("11905"), 's') : stryMutAct_9fa48("11906") ? "Stryker was here!" : (stryCov_9fa48("11906"), '')}`);
    if (stryMutAct_9fa48("11910") ? diffHours >= 24 : stryMutAct_9fa48("11909") ? diffHours <= 24 : stryMutAct_9fa48("11908") ? false : stryMutAct_9fa48("11907") ? true : (stryCov_9fa48("11907", "11908", "11909", "11910"), diffHours < 24)) return stryMutAct_9fa48("11911") ? `` : (stryCov_9fa48("11911"), `hace ${diffHours} hora${(stryMutAct_9fa48("11914") ? diffHours === 1 : stryMutAct_9fa48("11913") ? false : stryMutAct_9fa48("11912") ? true : (stryCov_9fa48("11912", "11913", "11914"), diffHours !== 1)) ? stryMutAct_9fa48("11915") ? "" : (stryCov_9fa48("11915"), 's') : stryMutAct_9fa48("11916") ? "Stryker was here!" : (stryCov_9fa48("11916"), '')}`);
    if (stryMutAct_9fa48("11920") ? diffDays >= 7 : stryMutAct_9fa48("11919") ? diffDays <= 7 : stryMutAct_9fa48("11918") ? false : stryMutAct_9fa48("11917") ? true : (stryCov_9fa48("11917", "11918", "11919", "11920"), diffDays < 7)) return stryMutAct_9fa48("11921") ? `` : (stryCov_9fa48("11921"), `hace ${diffDays} día${(stryMutAct_9fa48("11924") ? diffDays === 1 : stryMutAct_9fa48("11923") ? false : stryMutAct_9fa48("11922") ? true : (stryCov_9fa48("11922", "11923", "11924"), diffDays !== 1)) ? stryMutAct_9fa48("11925") ? "" : (stryCov_9fa48("11925"), 's') : stryMutAct_9fa48("11926") ? "Stryker was here!" : (stryCov_9fa48("11926"), '')}`);
    return date.toLocaleDateString(stryMutAct_9fa48("11927") ? "" : (stryCov_9fa48("11927"), 'es-CL'), stryMutAct_9fa48("11928") ? {} : (stryCov_9fa48("11928"), {
      year: stryMutAct_9fa48("11929") ? "" : (stryCov_9fa48("11929"), 'numeric'),
      month: stryMutAct_9fa48("11930") ? "" : (stryCov_9fa48("11930"), 'short'),
      day: stryMutAct_9fa48("11931") ? "" : (stryCov_9fa48("11931"), 'numeric')
    }));
  }
}
interface Challenge {
  id: string;
  examId: string | null;
  status: string;
  message: string | null;
  deadline: string | null;
  createdAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
  exam: {
    id: string;
    titulo: string;
    subject: {
      id: string;
      nombre: string;
      codigo: string;
    };
  } | null;
  challenger: {
    id: string;
    nombre: string;
  };
  challenged: {
    id: string;
    nombre: string;
  };
  challengerAttempt: {
    id: string;
    porcentaje: number;
    puntajePaes: number | null;
    correctas: number;
    totalPreguntas: number;
    createdAt: string;
  } | null;
  challengedAttempt: {
    id: string;
    porcentaje: number;
    puntajePaes: number | null;
    correctas: number;
    totalPreguntas: number;
    createdAt: string;
  } | null;
  winner: {
    id: string;
    nombre: string;
  } | null;
}
export default function ChallengesPage() {
  if (stryMutAct_9fa48("11932")) {
    {}
  } else {
    stryCov_9fa48("11932");
    const [challenges, setChallenges] = useState<Challenge[]>(stryMutAct_9fa48("11933") ? ["Stryker was here"] : (stryCov_9fa48("11933"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("11934") ? false : (stryCov_9fa48("11934"), true));
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sent' | 'received'>(stryMutAct_9fa48("11935") ? "" : (stryCov_9fa48("11935"), 'active'));
    const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("11936")) {
        {}
      } else {
        stryCov_9fa48("11936");
        loadCurrentStudent();
        loadChallenges();
      }
    }, stryMutAct_9fa48("11937") ? [] : (stryCov_9fa48("11937"), [activeTab]));
    async function loadCurrentStudent() {
      if (stryMutAct_9fa48("11938")) {
        {}
      } else {
        stryCov_9fa48("11938");
        try {
          if (stryMutAct_9fa48("11939")) {
            {}
          } else {
            stryCov_9fa48("11939");
            const res = await fetch(stryMutAct_9fa48("11940") ? "" : (stryCov_9fa48("11940"), '/api/student'));
            if (stryMutAct_9fa48("11942") ? false : stryMutAct_9fa48("11941") ? true : (stryCov_9fa48("11941", "11942"), res.ok)) {
              if (stryMutAct_9fa48("11943")) {
                {}
              } else {
                stryCov_9fa48("11943");
                const data = await res.json();
                setCurrentStudentId(data.id);
              }
            }
          }
        } catch (error) {
          // Error ya manejado por el sistema de monitoreo
        }
      }
    }
    async function loadChallenges() {
      if (stryMutAct_9fa48("11944")) {
        {}
      } else {
        stryCov_9fa48("11944");
        try {
          if (stryMutAct_9fa48("11945")) {
            {}
          } else {
            stryCov_9fa48("11945");
            setLoading(stryMutAct_9fa48("11946") ? false : (stryCov_9fa48("11946"), true));
            const res = await fetch(stryMutAct_9fa48("11947") ? `` : (stryCov_9fa48("11947"), `/api/challenges?type=${activeTab}`));
            if (stryMutAct_9fa48("11950") ? false : stryMutAct_9fa48("11949") ? true : stryMutAct_9fa48("11948") ? res.ok : (stryCov_9fa48("11948", "11949", "11950"), !res.ok)) throw new Error(stryMutAct_9fa48("11951") ? "" : (stryCov_9fa48("11951"), 'Error al cargar desafíos'));
            const data = await res.json();
            setChallenges(stryMutAct_9fa48("11954") ? data.challenges && [] : stryMutAct_9fa48("11953") ? false : stryMutAct_9fa48("11952") ? true : (stryCov_9fa48("11952", "11953", "11954"), data.challenges || (stryMutAct_9fa48("11955") ? ["Stryker was here"] : (stryCov_9fa48("11955"), []))));
          }
        } catch (error) {
          if (stryMutAct_9fa48("11956")) {
            {}
          } else {
            stryCov_9fa48("11956");
            toast.error(error instanceof Error ? error.message : stryMutAct_9fa48("11957") ? "" : (stryCov_9fa48("11957"), 'Error al cargar desafíos'));
          }
        } finally {
          if (stryMutAct_9fa48("11958")) {
            {}
          } else {
            stryCov_9fa48("11958");
            setLoading(stryMutAct_9fa48("11959") ? true : (stryCov_9fa48("11959"), false));
          }
        }
      }
    }
    async function handleAccept(challengeId: string) {
      if (stryMutAct_9fa48("11960")) {
        {}
      } else {
        stryCov_9fa48("11960");
        try {
          if (stryMutAct_9fa48("11961")) {
            {}
          } else {
            stryCov_9fa48("11961");
            const res = await fetch(stryMutAct_9fa48("11962") ? `` : (stryCov_9fa48("11962"), `/api/challenges/${challengeId}`), stryMutAct_9fa48("11963") ? {} : (stryCov_9fa48("11963"), {
              method: stryMutAct_9fa48("11964") ? "" : (stryCov_9fa48("11964"), 'PATCH'),
              headers: stryMutAct_9fa48("11965") ? {} : (stryCov_9fa48("11965"), {
                'Content-Type': stryMutAct_9fa48("11966") ? "" : (stryCov_9fa48("11966"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("11967") ? {} : (stryCov_9fa48("11967"), {
                status: stryMutAct_9fa48("11968") ? "" : (stryCov_9fa48("11968"), 'accepted')
              }))
            }));
            if (stryMutAct_9fa48("11971") ? false : stryMutAct_9fa48("11970") ? true : stryMutAct_9fa48("11969") ? res.ok : (stryCov_9fa48("11969", "11970", "11971"), !res.ok)) {
              if (stryMutAct_9fa48("11972")) {
                {}
              } else {
                stryCov_9fa48("11972");
                const data = await res.json();
                throw new Error(stryMutAct_9fa48("11975") ? data.error && 'Error al aceptar desafío' : stryMutAct_9fa48("11974") ? false : stryMutAct_9fa48("11973") ? true : (stryCov_9fa48("11973", "11974", "11975"), data.error || (stryMutAct_9fa48("11976") ? "" : (stryCov_9fa48("11976"), 'Error al aceptar desafío'))));
              }
            }
            toast.success(stryMutAct_9fa48("11977") ? "" : (stryCov_9fa48("11977"), 'Desafío aceptado. ¡Buena suerte!'), stryMutAct_9fa48("11978") ? {} : (stryCov_9fa48("11978"), {
              description: stryMutAct_9fa48("11979") ? "" : (stryCov_9fa48("11979"), 'El desafío está activo. Realiza el examen cuando estés listo.')
            }));
            loadChallenges();
          }
        } catch (error) {
          if (stryMutAct_9fa48("11980")) {
            {}
          } else {
            stryCov_9fa48("11980");
            toast.error(error instanceof Error ? error.message : stryMutAct_9fa48("11981") ? "" : (stryCov_9fa48("11981"), 'Error al aceptar desafío'));
          }
        }
      }
    }
    async function handleDecline(challengeId: string) {
      if (stryMutAct_9fa48("11982")) {
        {}
      } else {
        stryCov_9fa48("11982");
        try {
          if (stryMutAct_9fa48("11983")) {
            {}
          } else {
            stryCov_9fa48("11983");
            const res = await fetch(stryMutAct_9fa48("11984") ? `` : (stryCov_9fa48("11984"), `/api/challenges/${challengeId}`), stryMutAct_9fa48("11985") ? {} : (stryCov_9fa48("11985"), {
              method: stryMutAct_9fa48("11986") ? "" : (stryCov_9fa48("11986"), 'PATCH'),
              headers: stryMutAct_9fa48("11987") ? {} : (stryCov_9fa48("11987"), {
                'Content-Type': stryMutAct_9fa48("11988") ? "" : (stryCov_9fa48("11988"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("11989") ? {} : (stryCov_9fa48("11989"), {
                status: stryMutAct_9fa48("11990") ? "" : (stryCov_9fa48("11990"), 'declined')
              }))
            }));
            if (stryMutAct_9fa48("11993") ? false : stryMutAct_9fa48("11992") ? true : stryMutAct_9fa48("11991") ? res.ok : (stryCov_9fa48("11991", "11992", "11993"), !res.ok)) {
              if (stryMutAct_9fa48("11994")) {
                {}
              } else {
                stryCov_9fa48("11994");
                const data = await res.json();
                throw new Error(stryMutAct_9fa48("11997") ? data.error && 'Error al rechazar desafío' : stryMutAct_9fa48("11996") ? false : stryMutAct_9fa48("11995") ? true : (stryCov_9fa48("11995", "11996", "11997"), data.error || (stryMutAct_9fa48("11998") ? "" : (stryCov_9fa48("11998"), 'Error al rechazar desafío'))));
              }
            }
            toast.info(stryMutAct_9fa48("11999") ? "" : (stryCov_9fa48("11999"), 'Desafío rechazado'));
            loadChallenges();
          }
        } catch (error) {
          if (stryMutAct_9fa48("12000")) {
            {}
          } else {
            stryCov_9fa48("12000");
            toast.error(error instanceof Error ? error.message : stryMutAct_9fa48("12001") ? "" : (stryCov_9fa48("12001"), 'Error al rechazar desafío'));
          }
        }
      }
    }
    const getStatusBadge = (status: string) => {
      if (stryMutAct_9fa48("12002")) {
        {}
      } else {
        stryCov_9fa48("12002");
        switch (status) {
          case stryMutAct_9fa48("12004") ? "" : (stryCov_9fa48("12004"), 'pending'):
            if (stryMutAct_9fa48("12003")) {} else {
              stryCov_9fa48("12003");
              return <Badge variant="outline">Pendiente</Badge>;
            }
          case stryMutAct_9fa48("12006") ? "" : (stryCov_9fa48("12006"), 'accepted'):
            if (stryMutAct_9fa48("12005")) {} else {
              stryCov_9fa48("12005");
              return <Badge className="bg-blue-600">Aceptado</Badge>;
            }
          case stryMutAct_9fa48("12008") ? "" : (stryCov_9fa48("12008"), 'completed'):
            if (stryMutAct_9fa48("12007")) {} else {
              stryCov_9fa48("12007");
              return <Badge className="bg-green-600">Completado</Badge>;
            }
          case stryMutAct_9fa48("12010") ? "" : (stryCov_9fa48("12010"), 'declined'):
            if (stryMutAct_9fa48("12009")) {} else {
              stryCov_9fa48("12009");
              return <Badge variant="destructive">Rechazado</Badge>;
            }
          case stryMutAct_9fa48("12012") ? "" : (stryCov_9fa48("12012"), 'cancelled'):
            if (stryMutAct_9fa48("12011")) {} else {
              stryCov_9fa48("12011");
              return <Badge variant="secondary">Cancelado</Badge>;
            }
          default:
            if (stryMutAct_9fa48("12013")) {} else {
              stryCov_9fa48("12013");
              return <Badge variant="outline">{status}</Badge>;
            }
        }
      }
    };
    const formatDate = formatRelativeTime;
    if (stryMutAct_9fa48("12015") ? false : stryMutAct_9fa48("12014") ? true : (stryCov_9fa48("12014", "12015"), loading)) {
      if (stryMutAct_9fa48("12016")) {
        {}
      } else {
        stryCov_9fa48("12016");
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
          <h1 className="text-3xl font-bold">Desafíos</h1>
          <p className="text-muted-foreground mt-2">
            Desafía al otro estudiante y compite en exámenes
          </p>
        </div>
        <div className="flex gap-2">
          <CreateChallengeButton onChallengeCreated={loadChallenges} />
          <BackButton />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={stryMutAct_9fa48("12017") ? () => undefined : (stryCov_9fa48("12017"), v => setActiveTab(v as typeof activeTab))}>
        <TabsList>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="sent">Enviados</TabsTrigger>
          <TabsTrigger value="received">Recibidos</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {(stryMutAct_9fa48("12020") ? challenges.length !== 0 : stryMutAct_9fa48("12019") ? false : stryMutAct_9fa48("12018") ? true : (stryCov_9fa48("12018", "12019", "12020"), challenges.length === 0)) ? <Card>
              <CardContent className="py-8 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {(stryMutAct_9fa48("12023") ? activeTab !== 'active' : stryMutAct_9fa48("12022") ? false : stryMutAct_9fa48("12021") ? true : (stryCov_9fa48("12021", "12022", "12023"), activeTab === (stryMutAct_9fa48("12024") ? "" : (stryCov_9fa48("12024"), 'active')))) ? stryMutAct_9fa48("12025") ? "" : (stryCov_9fa48("12025"), 'No hay desafíos activos. Crea uno nuevo para comenzar.') : (stryMutAct_9fa48("12028") ? activeTab !== 'sent' : stryMutAct_9fa48("12027") ? false : stryMutAct_9fa48("12026") ? true : (stryCov_9fa48("12026", "12027", "12028"), activeTab === (stryMutAct_9fa48("12029") ? "" : (stryCov_9fa48("12029"), 'sent')))) ? stryMutAct_9fa48("12030") ? "" : (stryCov_9fa48("12030"), 'No has enviado ningún desafío aún.') : (stryMutAct_9fa48("12033") ? activeTab !== 'received' : stryMutAct_9fa48("12032") ? false : stryMutAct_9fa48("12031") ? true : (stryCov_9fa48("12031", "12032", "12033"), activeTab === (stryMutAct_9fa48("12034") ? "" : (stryCov_9fa48("12034"), 'received')))) ? stryMutAct_9fa48("12035") ? "" : (stryCov_9fa48("12035"), 'No has recibido ningún desafío aún.') : stryMutAct_9fa48("12036") ? "" : (stryCov_9fa48("12036"), 'No hay desafíos.')}
                </p>
                {stryMutAct_9fa48("12039") ? activeTab === 'active' || <div className="mt-4">
                    <CreateChallengeButton onChallengeCreated={loadChallenges} />
                  </div> : stryMutAct_9fa48("12038") ? false : stryMutAct_9fa48("12037") ? true : (stryCov_9fa48("12037", "12038", "12039"), (stryMutAct_9fa48("12041") ? activeTab !== 'active' : stryMutAct_9fa48("12040") ? true : (stryCov_9fa48("12040", "12041"), activeTab === (stryMutAct_9fa48("12042") ? "" : (stryCov_9fa48("12042"), 'active')))) && <div className="mt-4">
                    <CreateChallengeButton onChallengeCreated={loadChallenges} />
                  </div>)}
              </CardContent>
            </Card> : challenges.map(challenge => {
            if (stryMutAct_9fa48("12043")) {
              {}
            } else {
              stryCov_9fa48("12043");
              const isChallenger = stryMutAct_9fa48("12046") ? currentStudentId !== challenge.challenger.id : stryMutAct_9fa48("12045") ? false : stryMutAct_9fa48("12044") ? true : (stryCov_9fa48("12044", "12045", "12046"), currentStudentId === challenge.challenger.id);
              const isChallenged = stryMutAct_9fa48("12049") ? currentStudentId !== challenge.challenged.id : stryMutAct_9fa48("12048") ? false : stryMutAct_9fa48("12047") ? true : (stryCov_9fa48("12047", "12048", "12049"), currentStudentId === challenge.challenged.id);
              const canAccept = stryMutAct_9fa48("12052") ? challenge.status === 'pending' || isChallenged : stryMutAct_9fa48("12051") ? false : stryMutAct_9fa48("12050") ? true : (stryCov_9fa48("12050", "12051", "12052"), (stryMutAct_9fa48("12054") ? challenge.status !== 'pending' : stryMutAct_9fa48("12053") ? true : (stryCov_9fa48("12053", "12054"), challenge.status === (stryMutAct_9fa48("12055") ? "" : (stryCov_9fa48("12055"), 'pending')))) && isChallenged);
              const canComplete = stryMutAct_9fa48("12058") ? challenge.status === 'accepted' && challenge.exam || !challenge.challengerAttempt || !challenge.challengedAttempt : stryMutAct_9fa48("12057") ? false : stryMutAct_9fa48("12056") ? true : (stryCov_9fa48("12056", "12057", "12058"), (stryMutAct_9fa48("12060") ? challenge.status === 'accepted' || challenge.exam : stryMutAct_9fa48("12059") ? true : (stryCov_9fa48("12059", "12060"), (stryMutAct_9fa48("12062") ? challenge.status !== 'accepted' : stryMutAct_9fa48("12061") ? true : (stryCov_9fa48("12061", "12062"), challenge.status === (stryMutAct_9fa48("12063") ? "" : (stryCov_9fa48("12063"), 'accepted')))) && challenge.exam)) && (stryMutAct_9fa48("12065") ? !challenge.challengerAttempt && !challenge.challengedAttempt : stryMutAct_9fa48("12064") ? true : (stryCov_9fa48("12064", "12065"), (stryMutAct_9fa48("12066") ? challenge.challengerAttempt : (stryCov_9fa48("12066"), !challenge.challengerAttempt)) || (stryMutAct_9fa48("12067") ? challenge.challengedAttempt : (stryCov_9fa48("12067"), !challenge.challengedAttempt)))));

              // Verificar si el desafío está próximo a expirar (menos de 2 días)
              const challengeDate = new Date(challenge.createdAt);
              const daysSinceCreation = Math.floor(stryMutAct_9fa48("12068") ? (Date.now() - challengeDate.getTime()) * (1000 * 60 * 60 * 24) : (stryCov_9fa48("12068"), (stryMutAct_9fa48("12069") ? Date.now() + challengeDate.getTime() : (stryCov_9fa48("12069"), Date.now() - challengeDate.getTime())) / (stryMutAct_9fa48("12070") ? 1000 * 60 * 60 / 24 : (stryCov_9fa48("12070"), (stryMutAct_9fa48("12071") ? 1000 * 60 / 60 : (stryCov_9fa48("12071"), (stryMutAct_9fa48("12072") ? 1000 / 60 : (stryCov_9fa48("12072"), 1000 * 60)) * 60)) * 24))));
              const isExpiringSoon = stryMutAct_9fa48("12075") ? challenge.status === 'pending' || daysSinceCreation >= 5 : stryMutAct_9fa48("12074") ? false : stryMutAct_9fa48("12073") ? true : (stryCov_9fa48("12073", "12074", "12075"), (stryMutAct_9fa48("12077") ? challenge.status !== 'pending' : stryMutAct_9fa48("12076") ? true : (stryCov_9fa48("12076", "12077"), challenge.status === (stryMutAct_9fa48("12078") ? "" : (stryCov_9fa48("12078"), 'pending')))) && (stryMutAct_9fa48("12081") ? daysSinceCreation < 5 : stryMutAct_9fa48("12080") ? daysSinceCreation > 5 : stryMutAct_9fa48("12079") ? true : (stryCov_9fa48("12079", "12080", "12081"), daysSinceCreation >= 5))); // 5 días o más

              return <Card key={challenge.id} className={(stryMutAct_9fa48("12084") ? challenge.status !== 'pending' : stryMutAct_9fa48("12083") ? false : stryMutAct_9fa48("12082") ? true : (stryCov_9fa48("12082", "12083", "12084"), challenge.status === (stryMutAct_9fa48("12085") ? "" : (stryCov_9fa48("12085"), 'pending')))) ? isExpiringSoon ? stryMutAct_9fa48("12086") ? "" : (stryCov_9fa48("12086"), 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20') : stryMutAct_9fa48("12087") ? "" : (stryCov_9fa48("12087"), 'border-primary') : stryMutAct_9fa48("12088") ? "Stryker was here!" : (stryCov_9fa48("12088"), '')}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          {challenge.exam ? challenge.exam.titulo : stryMutAct_9fa48("12089") ? "" : (stryCov_9fa48("12089"), 'Desafío General')}
                          {stryMutAct_9fa48("12092") ? challenge.status === 'pending' || <Badge variant="default" className="ml-2">
                              Nuevo
                            </Badge> : stryMutAct_9fa48("12091") ? false : stryMutAct_9fa48("12090") ? true : (stryCov_9fa48("12090", "12091", "12092"), (stryMutAct_9fa48("12094") ? challenge.status !== 'pending' : stryMutAct_9fa48("12093") ? true : (stryCov_9fa48("12093", "12094"), challenge.status === (stryMutAct_9fa48("12095") ? "" : (stryCov_9fa48("12095"), 'pending')))) && <Badge variant="default" className="ml-2">
                              Nuevo
                            </Badge>)}
                          {stryMutAct_9fa48("12098") ? isExpiringSoon || <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-700 dark:text-yellow-400">
                              <Clock className="h-3 w-3 mr-1" />
                              Expira pronto
                            </Badge> : stryMutAct_9fa48("12097") ? false : stryMutAct_9fa48("12096") ? true : (stryCov_9fa48("12096", "12097", "12098"), isExpiringSoon && <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-700 dark:text-yellow-400">
                              <Clock className="h-3 w-3 mr-1" />
                              Expira pronto
                            </Badge>)}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {challenge.challenger.nombre} desafió a {challenge.challenged.nombre}
                          {stryMutAct_9fa48("12099") ? "" : (stryCov_9fa48("12099"), ' • ')}
                          {formatDate(challenge.createdAt)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(challenge.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stryMutAct_9fa48("12102") ? isExpiringSoon && challenge.status === 'pending' || <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                              Este desafío expirará pronto
                            </p>
                            <p className="text-yellow-700 dark:text-yellow-300">
                              {isChallenged ? 'Acepta o rechaza el desafío antes de que expire.' : 'El desafío será cancelado automáticamente si no es aceptado pronto.'}
                            </p>
                          </div>
                        </div>
                      </div> : stryMutAct_9fa48("12101") ? false : stryMutAct_9fa48("12100") ? true : (stryCov_9fa48("12100", "12101", "12102"), (stryMutAct_9fa48("12104") ? isExpiringSoon || challenge.status === 'pending' : stryMutAct_9fa48("12103") ? true : (stryCov_9fa48("12103", "12104"), isExpiringSoon && (stryMutAct_9fa48("12106") ? challenge.status !== 'pending' : stryMutAct_9fa48("12105") ? true : (stryCov_9fa48("12105", "12106"), challenge.status === (stryMutAct_9fa48("12107") ? "" : (stryCov_9fa48("12107"), 'pending')))))) && <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                              Este desafío expirará pronto
                            </p>
                            <p className="text-yellow-700 dark:text-yellow-300">
                              {isChallenged ? stryMutAct_9fa48("12108") ? "" : (stryCov_9fa48("12108"), 'Acepta o rechaza el desafío antes de que expire.') : stryMutAct_9fa48("12109") ? "" : (stryCov_9fa48("12109"), 'El desafío será cancelado automáticamente si no es aceptado pronto.')}
                            </p>
                          </div>
                        </div>
                      </div>)}

                    {stryMutAct_9fa48("12112") ? challenge.message || <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{challenge.message}</p>
                      </div> : stryMutAct_9fa48("12111") ? false : stryMutAct_9fa48("12110") ? true : (stryCov_9fa48("12110", "12111", "12112"), challenge.message && <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{challenge.message}</p>
                      </div>)}

                    {stryMutAct_9fa48("12115") ? challenge.exam || <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Examen:</span>
                          <span className="font-medium">{challenge.exam.titulo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Asignatura:</span>
                          <Badge variant="outline">{challenge.exam.subject.codigo}</Badge>
                        </div>
                      </div> : stryMutAct_9fa48("12114") ? false : stryMutAct_9fa48("12113") ? true : (stryCov_9fa48("12113", "12114", "12115"), challenge.exam && <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Examen:</span>
                          <span className="font-medium">{challenge.exam.titulo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Asignatura:</span>
                          <Badge variant="outline">{challenge.exam.subject.codigo}</Badge>
                        </div>
                      </div>)}

                    {/* Resultados si está completado */}
                    {stryMutAct_9fa48("12118") ? challenge.status === 'completed' && challenge.challengerAttempt && challenge.challengedAttempt || <div className="p-4 bg-muted rounded-lg space-y-3">
                          <h4 className="font-semibold">Resultados</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium mb-2">
                                {challenge.challenger.nombre}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Resultado:</span>
                                  <span className="font-bold">
                                    {challenge.challengerAttempt.porcentaje.toFixed(1)}%
                                  </span>
                                </div>
                                {challenge.challengerAttempt.puntajePaes && <div className="flex justify-between">
                                    <span>PAES:</span>
                                    <span className="font-bold">
                                      {challenge.challengerAttempt.puntajePaes} pts
                                    </span>
                                  </div>}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-2">
                                {challenge.challenged.nombre}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Resultado:</span>
                                  <span className="font-bold">
                                    {challenge.challengedAttempt.porcentaje.toFixed(1)}%
                                  </span>
                                </div>
                                {challenge.challengedAttempt.puntajePaes && <div className="flex justify-between">
                                    <span>PAES:</span>
                                    <span className="font-bold">
                                      {challenge.challengedAttempt.puntajePaes} pts
                                    </span>
                                  </div>}
                              </div>
                            </div>
                          </div>
                          {challenge.winner && <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <Trophy className="h-4 w-4" />
                                Ganador: {challenge.winner.nombre}
                              </div>
                            </div>}
                          {!challenge.winner && <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                                <Target className="h-4 w-4" />
                                Empate
                              </div>
                            </div>}
                        </div> : stryMutAct_9fa48("12117") ? false : stryMutAct_9fa48("12116") ? true : (stryCov_9fa48("12116", "12117", "12118"), (stryMutAct_9fa48("12120") ? challenge.status === 'completed' && challenge.challengerAttempt || challenge.challengedAttempt : stryMutAct_9fa48("12119") ? true : (stryCov_9fa48("12119", "12120"), (stryMutAct_9fa48("12122") ? challenge.status === 'completed' || challenge.challengerAttempt : stryMutAct_9fa48("12121") ? true : (stryCov_9fa48("12121", "12122"), (stryMutAct_9fa48("12124") ? challenge.status !== 'completed' : stryMutAct_9fa48("12123") ? true : (stryCov_9fa48("12123", "12124"), challenge.status === (stryMutAct_9fa48("12125") ? "" : (stryCov_9fa48("12125"), 'completed')))) && challenge.challengerAttempt)) && challenge.challengedAttempt)) && <div className="p-4 bg-muted rounded-lg space-y-3">
                          <h4 className="font-semibold">Resultados</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium mb-2">
                                {challenge.challenger.nombre}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Resultado:</span>
                                  <span className="font-bold">
                                    {challenge.challengerAttempt.porcentaje.toFixed(1)}%
                                  </span>
                                </div>
                                {stryMutAct_9fa48("12128") ? challenge.challengerAttempt.puntajePaes || <div className="flex justify-between">
                                    <span>PAES:</span>
                                    <span className="font-bold">
                                      {challenge.challengerAttempt.puntajePaes} pts
                                    </span>
                                  </div> : stryMutAct_9fa48("12127") ? false : stryMutAct_9fa48("12126") ? true : (stryCov_9fa48("12126", "12127", "12128"), challenge.challengerAttempt.puntajePaes && <div className="flex justify-between">
                                    <span>PAES:</span>
                                    <span className="font-bold">
                                      {challenge.challengerAttempt.puntajePaes} pts
                                    </span>
                                  </div>)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-2">
                                {challenge.challenged.nombre}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Resultado:</span>
                                  <span className="font-bold">
                                    {challenge.challengedAttempt.porcentaje.toFixed(1)}%
                                  </span>
                                </div>
                                {stryMutAct_9fa48("12131") ? challenge.challengedAttempt.puntajePaes || <div className="flex justify-between">
                                    <span>PAES:</span>
                                    <span className="font-bold">
                                      {challenge.challengedAttempt.puntajePaes} pts
                                    </span>
                                  </div> : stryMutAct_9fa48("12130") ? false : stryMutAct_9fa48("12129") ? true : (stryCov_9fa48("12129", "12130", "12131"), challenge.challengedAttempt.puntajePaes && <div className="flex justify-between">
                                    <span>PAES:</span>
                                    <span className="font-bold">
                                      {challenge.challengedAttempt.puntajePaes} pts
                                    </span>
                                  </div>)}
                              </div>
                            </div>
                          </div>
                          {stryMutAct_9fa48("12134") ? challenge.winner || <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <Trophy className="h-4 w-4" />
                                Ganador: {challenge.winner.nombre}
                              </div>
                            </div> : stryMutAct_9fa48("12133") ? false : stryMutAct_9fa48("12132") ? true : (stryCov_9fa48("12132", "12133", "12134"), challenge.winner && <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <Trophy className="h-4 w-4" />
                                Ganador: {challenge.winner.nombre}
                              </div>
                            </div>)}
                          {stryMutAct_9fa48("12137") ? !challenge.winner || <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                                <Target className="h-4 w-4" />
                                Empate
                              </div>
                            </div> : stryMutAct_9fa48("12136") ? false : stryMutAct_9fa48("12135") ? true : (stryCov_9fa48("12135", "12136", "12137"), (stryMutAct_9fa48("12138") ? challenge.winner : (stryCov_9fa48("12138"), !challenge.winner)) && <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                                <Target className="h-4 w-4" />
                                Empate
                              </div>
                            </div>)}
                        </div>)}

                    {/* Acciones según el estado */}
                    <div className="flex gap-2">
                      {stryMutAct_9fa48("12141") ? canAccept || <>
                          <Button onClick={() => handleAccept(challenge.id)} className="flex-1">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Aceptar Desafío
                          </Button>
                          <Button variant="outline" onClick={() => handleDecline(challenge.id)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                        </> : stryMutAct_9fa48("12140") ? false : stryMutAct_9fa48("12139") ? true : (stryCov_9fa48("12139", "12140", "12141"), canAccept && <>
                          <Button onClick={stryMutAct_9fa48("12142") ? () => undefined : (stryCov_9fa48("12142"), () => handleAccept(challenge.id))} className="flex-1">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Aceptar Desafío
                          </Button>
                          <Button variant="outline" onClick={stryMutAct_9fa48("12143") ? () => undefined : (stryCov_9fa48("12143"), () => handleDecline(challenge.id))}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                        </>)}
                      {stryMutAct_9fa48("12146") ? challenge.status === 'accepted' && challenge.exam || <Button asChild className="flex-1">
                          <Link href={`/exams/${challenge.exam.id}/take`}>
                            Realizar Examen
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button> : stryMutAct_9fa48("12145") ? false : stryMutAct_9fa48("12144") ? true : (stryCov_9fa48("12144", "12145", "12146"), (stryMutAct_9fa48("12148") ? challenge.status === 'accepted' || challenge.exam : stryMutAct_9fa48("12147") ? true : (stryCov_9fa48("12147", "12148"), (stryMutAct_9fa48("12150") ? challenge.status !== 'accepted' : stryMutAct_9fa48("12149") ? true : (stryCov_9fa48("12149", "12150"), challenge.status === (stryMutAct_9fa48("12151") ? "" : (stryCov_9fa48("12151"), 'accepted')))) && challenge.exam)) && <Button asChild className="flex-1">
                          <Link href={stryMutAct_9fa48("12152") ? `` : (stryCov_9fa48("12152"), `/exams/${challenge.exam.id}/take`)}>
                            Realizar Examen
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>)}
                      {stryMutAct_9fa48("12155") ? challenge.status === 'completed' && challenge.challengerAttempt || <Button variant="outline" asChild className="flex-1">
                          <Link href={`/attempts/${challenge.challengerAttempt.id}`}>
                            Ver Resultados
                          </Link>
                        </Button> : stryMutAct_9fa48("12154") ? false : stryMutAct_9fa48("12153") ? true : (stryCov_9fa48("12153", "12154", "12155"), (stryMutAct_9fa48("12157") ? challenge.status === 'completed' || challenge.challengerAttempt : stryMutAct_9fa48("12156") ? true : (stryCov_9fa48("12156", "12157"), (stryMutAct_9fa48("12159") ? challenge.status !== 'completed' : stryMutAct_9fa48("12158") ? true : (stryCov_9fa48("12158", "12159"), challenge.status === (stryMutAct_9fa48("12160") ? "" : (stryCov_9fa48("12160"), 'completed')))) && challenge.challengerAttempt)) && <Button variant="outline" asChild className="flex-1">
                          <Link href={stryMutAct_9fa48("12161") ? `` : (stryCov_9fa48("12161"), `/attempts/${challenge.challengerAttempt.id}`)}>
                            Ver Resultados
                          </Link>
                        </Button>)}
                    </div>
                  </CardContent>
                </Card>;
            }
          })}
        </TabsContent>
      </Tabs>
    </div>;
  }
}