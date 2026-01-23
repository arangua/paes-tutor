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
import { Loader2, Share2, Eye, EyeOff, BookOpen, User, MessageSquare, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { BackButton } from '@/components/navigation/back-button';
import Link from 'next/link';

// Función simple para formatear fechas relativas
function formatRelativeTime(dateString: string): string {
  if (stryMutAct_9fa48("15724")) {
    {}
  } else {
    stryCov_9fa48("15724");
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = stryMutAct_9fa48("15725") ? now.getTime() + date.getTime() : (stryCov_9fa48("15725"), now.getTime() - date.getTime());
    const diffMins = Math.floor(stryMutAct_9fa48("15726") ? diffMs * 60000 : (stryCov_9fa48("15726"), diffMs / 60000));
    const diffHours = Math.floor(stryMutAct_9fa48("15727") ? diffMs * 3600000 : (stryCov_9fa48("15727"), diffMs / 3600000));
    const diffDays = Math.floor(stryMutAct_9fa48("15728") ? diffMs * 86400000 : (stryCov_9fa48("15728"), diffMs / 86400000));
    if (stryMutAct_9fa48("15732") ? diffMins >= 1 : stryMutAct_9fa48("15731") ? diffMins <= 1 : stryMutAct_9fa48("15730") ? false : stryMutAct_9fa48("15729") ? true : (stryCov_9fa48("15729", "15730", "15731", "15732"), diffMins < 1)) return stryMutAct_9fa48("15733") ? "" : (stryCov_9fa48("15733"), 'hace unos momentos');
    if (stryMutAct_9fa48("15737") ? diffMins >= 60 : stryMutAct_9fa48("15736") ? diffMins <= 60 : stryMutAct_9fa48("15735") ? false : stryMutAct_9fa48("15734") ? true : (stryCov_9fa48("15734", "15735", "15736", "15737"), diffMins < 60)) return stryMutAct_9fa48("15738") ? `` : (stryCov_9fa48("15738"), `hace ${diffMins} minuto${(stryMutAct_9fa48("15741") ? diffMins === 1 : stryMutAct_9fa48("15740") ? false : stryMutAct_9fa48("15739") ? true : (stryCov_9fa48("15739", "15740", "15741"), diffMins !== 1)) ? stryMutAct_9fa48("15742") ? "" : (stryCov_9fa48("15742"), 's') : stryMutAct_9fa48("15743") ? "Stryker was here!" : (stryCov_9fa48("15743"), '')}`);
    if (stryMutAct_9fa48("15747") ? diffHours >= 24 : stryMutAct_9fa48("15746") ? diffHours <= 24 : stryMutAct_9fa48("15745") ? false : stryMutAct_9fa48("15744") ? true : (stryCov_9fa48("15744", "15745", "15746", "15747"), diffHours < 24)) return stryMutAct_9fa48("15748") ? `` : (stryCov_9fa48("15748"), `hace ${diffHours} hora${(stryMutAct_9fa48("15751") ? diffHours === 1 : stryMutAct_9fa48("15750") ? false : stryMutAct_9fa48("15749") ? true : (stryCov_9fa48("15749", "15750", "15751"), diffHours !== 1)) ? stryMutAct_9fa48("15752") ? "" : (stryCov_9fa48("15752"), 's') : stryMutAct_9fa48("15753") ? "Stryker was here!" : (stryCov_9fa48("15753"), '')}`);
    if (stryMutAct_9fa48("15757") ? diffDays >= 7 : stryMutAct_9fa48("15756") ? diffDays <= 7 : stryMutAct_9fa48("15755") ? false : stryMutAct_9fa48("15754") ? true : (stryCov_9fa48("15754", "15755", "15756", "15757"), diffDays < 7)) return stryMutAct_9fa48("15758") ? `` : (stryCov_9fa48("15758"), `hace ${diffDays} día${(stryMutAct_9fa48("15761") ? diffDays === 1 : stryMutAct_9fa48("15760") ? false : stryMutAct_9fa48("15759") ? true : (stryCov_9fa48("15759", "15760", "15761"), diffDays !== 1)) ? stryMutAct_9fa48("15762") ? "" : (stryCov_9fa48("15762"), 's') : stryMutAct_9fa48("15763") ? "Stryker was here!" : (stryCov_9fa48("15763"), '')}`);
    return date.toLocaleDateString(stryMutAct_9fa48("15764") ? "" : (stryCov_9fa48("15764"), 'es-CL'), stryMutAct_9fa48("15765") ? {} : (stryCov_9fa48("15765"), {
      year: stryMutAct_9fa48("15766") ? "" : (stryCov_9fa48("15766"), 'numeric'),
      month: stryMutAct_9fa48("15767") ? "" : (stryCov_9fa48("15767"), 'short'),
      day: stryMutAct_9fa48("15768") ? "" : (stryCov_9fa48("15768"), 'numeric')
    }));
  }
}
interface SharedMaterial {
  id: string;
  materialId: string;
  message: string | null;
  viewed: boolean;
  viewedAt: string | null;
  createdAt: string;
  material: {
    id: string;
    titulo: string;
    contenido: string;
    tipo: string;
    fuente: string | null;
    subject: {
      id: string;
      nombre: string;
      codigo: string;
    };
    topic: {
      id: string;
      nombre: string;
      ejeTematico: string;
    } | null;
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
export default function SharedMaterialsPage() {
  if (stryMutAct_9fa48("15769")) {
    {}
  } else {
    stryCov_9fa48("15769");
    const [receivedMaterials, setReceivedMaterials] = useState<SharedMaterial[]>(stryMutAct_9fa48("15770") ? ["Stryker was here"] : (stryCov_9fa48("15770"), []));
    const [sentMaterials, setSentMaterials] = useState<SharedMaterial[]>(stryMutAct_9fa48("15771") ? ["Stryker was here"] : (stryCov_9fa48("15771"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("15772") ? false : (stryCov_9fa48("15772"), true));
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>(stryMutAct_9fa48("15773") ? "" : (stryCov_9fa48("15773"), 'received'));
    useEffect(() => {
      if (stryMutAct_9fa48("15774")) {
        {}
      } else {
        stryCov_9fa48("15774");
        loadSharedMaterials();
      }
    }, stryMutAct_9fa48("15775") ? ["Stryker was here"] : (stryCov_9fa48("15775"), []));
    async function loadSharedMaterials() {
      if (stryMutAct_9fa48("15776")) {
        {}
      } else {
        stryCov_9fa48("15776");
        try {
          if (stryMutAct_9fa48("15777")) {
            {}
          } else {
            stryCov_9fa48("15777");
            setLoading(stryMutAct_9fa48("15778") ? false : (stryCov_9fa48("15778"), true));
            const [receivedRes, sentRes] = await Promise.all(stryMutAct_9fa48("15779") ? [] : (stryCov_9fa48("15779"), [fetch(stryMutAct_9fa48("15780") ? "" : (stryCov_9fa48("15780"), '/api/shared-materials?type=received')), fetch(stryMutAct_9fa48("15781") ? "" : (stryCov_9fa48("15781"), '/api/shared-materials?type=sent'))]));
            if (stryMutAct_9fa48("15784") ? !receivedRes.ok && !sentRes.ok : stryMutAct_9fa48("15783") ? false : stryMutAct_9fa48("15782") ? true : (stryCov_9fa48("15782", "15783", "15784"), (stryMutAct_9fa48("15785") ? receivedRes.ok : (stryCov_9fa48("15785"), !receivedRes.ok)) || (stryMutAct_9fa48("15786") ? sentRes.ok : (stryCov_9fa48("15786"), !sentRes.ok)))) {
              if (stryMutAct_9fa48("15787")) {
                {}
              } else {
                stryCov_9fa48("15787");
                throw new Error(stryMutAct_9fa48("15788") ? "" : (stryCov_9fa48("15788"), 'Error al cargar materiales compartidos'));
              }
            }
            const receivedData = await receivedRes.json();
            const sentData = await sentRes.json();
            setReceivedMaterials(stryMutAct_9fa48("15791") ? receivedData.sharedMaterials && [] : stryMutAct_9fa48("15790") ? false : stryMutAct_9fa48("15789") ? true : (stryCov_9fa48("15789", "15790", "15791"), receivedData.sharedMaterials || (stryMutAct_9fa48("15792") ? ["Stryker was here"] : (stryCov_9fa48("15792"), []))));
            setSentMaterials(stryMutAct_9fa48("15795") ? sentData.sharedMaterials && [] : stryMutAct_9fa48("15794") ? false : stryMutAct_9fa48("15793") ? true : (stryCov_9fa48("15793", "15794", "15795"), sentData.sharedMaterials || (stryMutAct_9fa48("15796") ? ["Stryker was here"] : (stryCov_9fa48("15796"), []))));
          }
        } catch (error) {
          if (stryMutAct_9fa48("15797")) {
            {}
          } else {
            stryCov_9fa48("15797");
            toast.error(error instanceof Error ? error.message : stryMutAct_9fa48("15798") ? "" : (stryCov_9fa48("15798"), 'Error al cargar materiales compartidos'));
          }
        } finally {
          if (stryMutAct_9fa48("15799")) {
            {}
          } else {
            stryCov_9fa48("15799");
            setLoading(stryMutAct_9fa48("15800") ? true : (stryCov_9fa48("15800"), false));
          }
        }
      }
    }
    async function markAsViewed(sharedMaterialId: string) {
      if (stryMutAct_9fa48("15801")) {
        {}
      } else {
        stryCov_9fa48("15801");
        try {
          if (stryMutAct_9fa48("15802")) {
            {}
          } else {
            stryCov_9fa48("15802");
            const res = await fetch(stryMutAct_9fa48("15803") ? `` : (stryCov_9fa48("15803"), `/api/shared-materials/${sharedMaterialId}`), stryMutAct_9fa48("15804") ? {} : (stryCov_9fa48("15804"), {
              method: stryMutAct_9fa48("15805") ? "" : (stryCov_9fa48("15805"), 'PATCH')
            }));
            if (stryMutAct_9fa48("15808") ? false : stryMutAct_9fa48("15807") ? true : stryMutAct_9fa48("15806") ? res.ok : (stryCov_9fa48("15806", "15807", "15808"), !res.ok)) {
              if (stryMutAct_9fa48("15809")) {
                {}
              } else {
                stryCov_9fa48("15809");
                throw new Error(stryMutAct_9fa48("15810") ? "" : (stryCov_9fa48("15810"), 'Error al marcar como visto'));
              }
            }

            // Actualizar estado local
            setReceivedMaterials(stryMutAct_9fa48("15811") ? () => undefined : (stryCov_9fa48("15811"), prev => prev.map(stryMutAct_9fa48("15812") ? () => undefined : (stryCov_9fa48("15812"), material => (stryMutAct_9fa48("15815") ? material.id !== sharedMaterialId : stryMutAct_9fa48("15814") ? false : stryMutAct_9fa48("15813") ? true : (stryCov_9fa48("15813", "15814", "15815"), material.id === sharedMaterialId)) ? stryMutAct_9fa48("15816") ? {} : (stryCov_9fa48("15816"), {
              ...material,
              viewed: stryMutAct_9fa48("15817") ? false : (stryCov_9fa48("15817"), true),
              viewedAt: new Date().toISOString()
            }) : material))));
            toast.success(stryMutAct_9fa48("15818") ? "" : (stryCov_9fa48("15818"), 'Marcado como visto'));
          }
        } catch (error) {
          if (stryMutAct_9fa48("15819")) {
            {}
          } else {
            stryCov_9fa48("15819");
            toast.error(error instanceof Error ? error.message : stryMutAct_9fa48("15820") ? "" : (stryCov_9fa48("15820"), 'Error al marcar como visto'));
          }
        }
      }
    }
    const formatDate = formatRelativeTime;
    if (stryMutAct_9fa48("15822") ? false : stryMutAct_9fa48("15821") ? true : (stryCov_9fa48("15821", "15822"), loading)) {
      if (stryMutAct_9fa48("15823")) {
        {}
      } else {
        stryCov_9fa48("15823");
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
          <h1 className="text-3xl font-bold">Materiales Compartidos</h1>
          <p className="text-muted-foreground mt-2">
            Materiales de estudio que has compartido o que te han compartido
          </p>
        </div>
        <BackButton />
      </div>

      <Tabs value={activeTab} onValueChange={stryMutAct_9fa48("15824") ? () => undefined : (stryCov_9fa48("15824"), v => setActiveTab(v as 'received' | 'sent'))}>
        <TabsList>
          <TabsTrigger value="received">
            Recibidos ({receivedMaterials.length})
            {stryMutAct_9fa48("15827") ? receivedMaterials.filter(m => !m.viewed).length > 0 || <Badge variant="destructive" className="ml-2">
                {receivedMaterials.filter(m => !m.viewed).length}
              </Badge> : stryMutAct_9fa48("15826") ? false : stryMutAct_9fa48("15825") ? true : (stryCov_9fa48("15825", "15826", "15827"), (stryMutAct_9fa48("15830") ? receivedMaterials.filter(m => !m.viewed).length <= 0 : stryMutAct_9fa48("15829") ? receivedMaterials.filter(m => !m.viewed).length >= 0 : stryMutAct_9fa48("15828") ? true : (stryCov_9fa48("15828", "15829", "15830"), (stryMutAct_9fa48("15831") ? receivedMaterials.length : (stryCov_9fa48("15831"), receivedMaterials.filter(stryMutAct_9fa48("15832") ? () => undefined : (stryCov_9fa48("15832"), m => stryMutAct_9fa48("15833") ? m.viewed : (stryCov_9fa48("15833"), !m.viewed))).length)) > 0)) && <Badge variant="destructive" className="ml-2">
                {stryMutAct_9fa48("15834") ? receivedMaterials.length : (stryCov_9fa48("15834"), receivedMaterials.filter(stryMutAct_9fa48("15835") ? () => undefined : (stryCov_9fa48("15835"), m => stryMutAct_9fa48("15836") ? m.viewed : (stryCov_9fa48("15836"), !m.viewed))).length)}
              </Badge>)}
          </TabsTrigger>
          <TabsTrigger value="sent">Enviados ({sentMaterials.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {(stryMutAct_9fa48("15839") ? receivedMaterials.length !== 0 : stryMutAct_9fa48("15838") ? false : stryMutAct_9fa48("15837") ? true : (stryCov_9fa48("15837", "15838", "15839"), receivedMaterials.length === 0)) ? <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No has recibido ningún material compartido aún.
                </p>
              </CardContent>
            </Card> : receivedMaterials.map(stryMutAct_9fa48("15840") ? () => undefined : (stryCov_9fa48("15840"), sharedMaterial => <Card key={sharedMaterial.id} className={(stryMutAct_9fa48("15841") ? sharedMaterial.viewed : (stryCov_9fa48("15841"), !sharedMaterial.viewed)) ? stryMutAct_9fa48("15842") ? "" : (stryCov_9fa48("15842"), 'border-primary') : stryMutAct_9fa48("15843") ? "Stryker was here!" : (stryCov_9fa48("15843"), '')}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {sharedMaterial.material.titulo}
                        {stryMutAct_9fa48("15846") ? !sharedMaterial.viewed || <Badge variant="default" className="ml-2">
                            Nuevo
                          </Badge> : stryMutAct_9fa48("15845") ? false : stryMutAct_9fa48("15844") ? true : (stryCov_9fa48("15844", "15845", "15846"), (stryMutAct_9fa48("15847") ? sharedMaterial.viewed : (stryCov_9fa48("15847"), !sharedMaterial.viewed)) && <Badge variant="default" className="ml-2">
                            Nuevo
                          </Badge>)}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Compartido por {stryMutAct_9fa48("15850") ? sharedMaterial.sharedBy?.nombre && 'otro estudiante' : stryMutAct_9fa48("15849") ? false : stryMutAct_9fa48("15848") ? true : (stryCov_9fa48("15848", "15849", "15850"), (stryMutAct_9fa48("15851") ? sharedMaterial.sharedBy.nombre : (stryCov_9fa48("15851"), sharedMaterial.sharedBy?.nombre)) || (stryMutAct_9fa48("15852") ? "" : (stryCov_9fa48("15852"), 'otro estudiante')))}
                        {stryMutAct_9fa48("15853") ? "" : (stryCov_9fa48("15853"), ' • ')}
                        {formatDate(sharedMaterial.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{sharedMaterial.material.subject.codigo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stryMutAct_9fa48("15856") ? sharedMaterial.message || <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedMaterial.message}</p>
                      </div>
                    </div> : stryMutAct_9fa48("15855") ? false : stryMutAct_9fa48("15854") ? true : (stryCov_9fa48("15854", "15855", "15856"), sharedMaterial.message && <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedMaterial.message}</p>
                      </div>
                    </div>)}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Asignatura:</span>
                      <span className="font-medium">{sharedMaterial.material.subject.nombre}</span>
                    </div>
                    {stryMutAct_9fa48("15859") ? sharedMaterial.material.topic || <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tema:</span>
                        <span className="font-medium">{sharedMaterial.material.topic.nombre}</span>
                      </div> : stryMutAct_9fa48("15858") ? false : stryMutAct_9fa48("15857") ? true : (stryCov_9fa48("15857", "15858", "15859"), sharedMaterial.material.topic && <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tema:</span>
                        <span className="font-medium">{sharedMaterial.material.topic.nombre}</span>
                      </div>)}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="secondary">{sharedMaterial.material.tipo}</Badge>
                    </div>
                    {stryMutAct_9fa48("15862") ? sharedMaterial.material.fuente || <div className="text-xs text-muted-foreground">
                        Fuente: {sharedMaterial.material.fuente}
                      </div> : stryMutAct_9fa48("15861") ? false : stryMutAct_9fa48("15860") ? true : (stryCov_9fa48("15860", "15861", "15862"), sharedMaterial.material.fuente && <div className="text-xs text-muted-foreground">
                        Fuente: {sharedMaterial.material.fuente}
                      </div>)}
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm line-clamp-3">{sharedMaterial.material.contenido}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={stryMutAct_9fa48("15863") ? `` : (stryCov_9fa48("15863"), `/materials/${sharedMaterial.material.id}`)}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Ver Material
                      </Link>
                    </Button>
                    {stryMutAct_9fa48("15866") ? !sharedMaterial.viewed || <Button variant="outline" onClick={() => markAsViewed(sharedMaterial.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Marcar como visto
                      </Button> : stryMutAct_9fa48("15865") ? false : stryMutAct_9fa48("15864") ? true : (stryCov_9fa48("15864", "15865", "15866"), (stryMutAct_9fa48("15867") ? sharedMaterial.viewed : (stryCov_9fa48("15867"), !sharedMaterial.viewed)) && <Button variant="outline" onClick={stryMutAct_9fa48("15868") ? () => undefined : (stryCov_9fa48("15868"), () => markAsViewed(sharedMaterial.id))}>
                        <Eye className="h-4 w-4 mr-2" />
                        Marcar como visto
                      </Button>)}
                    {stryMutAct_9fa48("15871") ? sharedMaterial.viewed || <Button variant="outline" disabled>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Visto
                      </Button> : stryMutAct_9fa48("15870") ? false : stryMutAct_9fa48("15869") ? true : (stryCov_9fa48("15869", "15870", "15871"), sharedMaterial.viewed && <Button variant="outline" disabled>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Visto
                      </Button>)}
                  </div>
                </CardContent>
              </Card>))}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {(stryMutAct_9fa48("15874") ? sentMaterials.length !== 0 : stryMutAct_9fa48("15873") ? false : stryMutAct_9fa48("15872") ? true : (stryCov_9fa48("15872", "15873", "15874"), sentMaterials.length === 0)) ? <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No has compartido ningún material aún.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Usa el botón "Compartir" en cualquier material para compartirlo.
                </p>
              </CardContent>
            </Card> : sentMaterials.map(stryMutAct_9fa48("15875") ? () => undefined : (stryCov_9fa48("15875"), sharedMaterial => <Card key={sharedMaterial.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{sharedMaterial.material.titulo}</CardTitle>
                      <CardDescription className="mt-2">
                        Compartido con {stryMutAct_9fa48("15878") ? sharedMaterial.sharedWith?.nombre && 'otro estudiante' : stryMutAct_9fa48("15877") ? false : stryMutAct_9fa48("15876") ? true : (stryCov_9fa48("15876", "15877", "15878"), (stryMutAct_9fa48("15879") ? sharedMaterial.sharedWith.nombre : (stryCov_9fa48("15879"), sharedMaterial.sharedWith?.nombre)) || (stryMutAct_9fa48("15880") ? "" : (stryCov_9fa48("15880"), 'otro estudiante')))}
                        {stryMutAct_9fa48("15881") ? "" : (stryCov_9fa48("15881"), ' • ')}
                        {formatDate(sharedMaterial.createdAt)}
                        {stryMutAct_9fa48("15884") ? sharedMaterial.viewed || <>
                            {' • '}
                            <span className="text-green-600">Visto</span>
                          </> : stryMutAct_9fa48("15883") ? false : stryMutAct_9fa48("15882") ? true : (stryCov_9fa48("15882", "15883", "15884"), sharedMaterial.viewed && <>
                            {stryMutAct_9fa48("15885") ? "" : (stryCov_9fa48("15885"), ' • ')}
                            <span className="text-green-600">Visto</span>
                          </>)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{sharedMaterial.material.subject.codigo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stryMutAct_9fa48("15888") ? sharedMaterial.message || <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedMaterial.message}</p>
                      </div>
                    </div> : stryMutAct_9fa48("15887") ? false : stryMutAct_9fa48("15886") ? true : (stryCov_9fa48("15886", "15887", "15888"), sharedMaterial.message && <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedMaterial.message}</p>
                      </div>
                    </div>)}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Asignatura:</span>
                      <span className="font-medium">{sharedMaterial.material.subject.nombre}</span>
                    </div>
                    {stryMutAct_9fa48("15891") ? sharedMaterial.material.topic || <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tema:</span>
                        <span className="font-medium">{sharedMaterial.material.topic.nombre}</span>
                      </div> : stryMutAct_9fa48("15890") ? false : stryMutAct_9fa48("15889") ? true : (stryCov_9fa48("15889", "15890", "15891"), sharedMaterial.material.topic && <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tema:</span>
                        <span className="font-medium">{sharedMaterial.material.topic.nombre}</span>
                      </div>)}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="secondary">{sharedMaterial.material.tipo}</Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm line-clamp-3">{sharedMaterial.material.contenido}</p>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href={stryMutAct_9fa48("15892") ? `` : (stryCov_9fa48("15892"), `/materials/${sharedMaterial.material.id}`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Material
                    </Link>
                  </Button>
                </CardContent>
              </Card>))}
        </TabsContent>
      </Tabs>
    </div>;
  }
}