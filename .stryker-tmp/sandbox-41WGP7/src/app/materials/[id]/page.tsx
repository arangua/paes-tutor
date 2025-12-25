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
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BookOpen, ArrowLeft, Loader2, AlertCircle, Clock, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ShareMaterialButton } from '@/components/materials/share-material-button';
interface Material {
  id: string;
  titulo: string;
  contenido: string;
  fuente: string | null;
  tipo: string;
  createdAt: string;
  subject: {
    id: string;
    nombre: string;
    codigo: string;
  };
  topic: {
    id: string;
    nombre: string;
    ejeTematico: string;
    descripcion: string | null;
  } | null;
}
export default function MaterialDetailPage() {
  if (stryMutAct_9fa48("14223")) {
    {}
  } else {
    stryCov_9fa48("14223");
    const params = useParams();
    const router = useRouter();
    const [material, setMaterial] = useState<Material | null>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("14224") ? false : (stryCov_9fa48("14224"), true));
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(stryMutAct_9fa48("14225") ? true : (stryCov_9fa48("14225"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("14226")) {
        {}
      } else {
        stryCov_9fa48("14226");
        async function loadMaterial() {
          if (stryMutAct_9fa48("14227")) {
            {}
          } else {
            stryCov_9fa48("14227");
            try {
              if (stryMutAct_9fa48("14228")) {
                {}
              } else {
                stryCov_9fa48("14228");
                setIsLoading(stryMutAct_9fa48("14229") ? false : (stryCov_9fa48("14229"), true));
                setError(null);
                const id = params.id as string;

                // Validar formato del ID
                if (stryMutAct_9fa48("14232") ? !id && !/^c[a-z0-9]{24}$/.test(id) : stryMutAct_9fa48("14231") ? false : stryMutAct_9fa48("14230") ? true : (stryCov_9fa48("14230", "14231", "14232"), (stryMutAct_9fa48("14233") ? id : (stryCov_9fa48("14233"), !id)) || (stryMutAct_9fa48("14234") ? /^c[a-z0-9]{24}$/.test(id) : (stryCov_9fa48("14234"), !(stryMutAct_9fa48("14238") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("14237") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("14236") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("14235") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("14235", "14236", "14237", "14238"), /^c[a-z0-9]{24}$/)).test(id))))) {
                  if (stryMutAct_9fa48("14239")) {
                    {}
                  } else {
                    stryCov_9fa48("14239");
                    setError(stryMutAct_9fa48("14240") ? "" : (stryCov_9fa48("14240"), 'ID de material inválido'));
                    setIsLoading(stryMutAct_9fa48("14241") ? true : (stryCov_9fa48("14241"), false));
                    return;
                  }
                }
                const res = await fetch(stryMutAct_9fa48("14242") ? `` : (stryCov_9fa48("14242"), `/api/materials/${id}`));
                if (stryMutAct_9fa48("14245") ? res.status !== 401 : stryMutAct_9fa48("14244") ? false : stryMutAct_9fa48("14243") ? true : (stryCov_9fa48("14243", "14244", "14245"), res.status === 401)) {
                  if (stryMutAct_9fa48("14246")) {
                    {}
                  } else {
                    stryCov_9fa48("14246");
                    router.push(stryMutAct_9fa48("14247") ? "" : (stryCov_9fa48("14247"), '/auth/signin?callbackUrl=/materials'));
                    return;
                  }
                }
                if (stryMutAct_9fa48("14250") ? false : stryMutAct_9fa48("14249") ? true : stryMutAct_9fa48("14248") ? res.ok : (stryCov_9fa48("14248", "14249", "14250"), !res.ok)) {
                  if (stryMutAct_9fa48("14251")) {
                    {}
                  } else {
                    stryCov_9fa48("14251");
                    if (stryMutAct_9fa48("14254") ? res.status !== 404 : stryMutAct_9fa48("14253") ? false : stryMutAct_9fa48("14252") ? true : (stryCov_9fa48("14252", "14253", "14254"), res.status === 404)) {
                      if (stryMutAct_9fa48("14255")) {
                        {}
                      } else {
                        stryCov_9fa48("14255");
                        throw new Error(stryMutAct_9fa48("14256") ? "" : (stryCov_9fa48("14256"), 'Material no encontrado'));
                      }
                    }
                    throw new Error(stryMutAct_9fa48("14257") ? "" : (stryCov_9fa48("14257"), 'Error al cargar material'));
                  }
                }
                const data = await res.json();
                setMaterial(data);

                // Verificar si está marcado como completado (localStorage por ahora)
                const completed = localStorage.getItem(stryMutAct_9fa48("14258") ? `` : (stryCov_9fa48("14258"), `material_completed_${id}`));
                setIsCompleted(stryMutAct_9fa48("14261") ? completed !== 'true' : stryMutAct_9fa48("14260") ? false : stryMutAct_9fa48("14259") ? true : (stryCov_9fa48("14259", "14260", "14261"), completed === (stryMutAct_9fa48("14262") ? "" : (stryCov_9fa48("14262"), 'true'))));
              }
            } catch (err) {
              if (stryMutAct_9fa48("14263")) {
                {}
              } else {
                stryCov_9fa48("14263");
                setError(err instanceof Error ? err.message : stryMutAct_9fa48("14264") ? "" : (stryCov_9fa48("14264"), 'Error desconocido'));
              }
            } finally {
              if (stryMutAct_9fa48("14265")) {
                {}
              } else {
                stryCov_9fa48("14265");
                setIsLoading(stryMutAct_9fa48("14266") ? true : (stryCov_9fa48("14266"), false));
              }
            }
          }
        }
        if (stryMutAct_9fa48("14268") ? false : stryMutAct_9fa48("14267") ? true : (stryCov_9fa48("14267", "14268"), params.id)) {
          if (stryMutAct_9fa48("14269")) {
            {}
          } else {
            stryCov_9fa48("14269");
            loadMaterial();
          }
        }
      }
    }, stryMutAct_9fa48("14270") ? [] : (stryCov_9fa48("14270"), [params.id, router]));
    const handleMarkComplete = () => {
      if (stryMutAct_9fa48("14271")) {
        {}
      } else {
        stryCov_9fa48("14271");
        if (stryMutAct_9fa48("14274") ? false : stryMutAct_9fa48("14273") ? true : stryMutAct_9fa48("14272") ? material : (stryCov_9fa48("14272", "14273", "14274"), !material)) return;
        const newStatus = stryMutAct_9fa48("14275") ? isCompleted : (stryCov_9fa48("14275"), !isCompleted);
        setIsCompleted(newStatus);
        localStorage.setItem(stryMutAct_9fa48("14276") ? `` : (stryCov_9fa48("14276"), `material_completed_${material.id}`), String(newStatus));
      }
    };
    if (stryMutAct_9fa48("14278") ? false : stryMutAct_9fa48("14277") ? true : (stryCov_9fa48("14277", "14278"), isLoading)) {
      if (stryMutAct_9fa48("14279")) {
        {}
      } else {
        stryCov_9fa48("14279");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando material...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("14282") ? error && !material : stryMutAct_9fa48("14281") ? false : stryMutAct_9fa48("14280") ? true : (stryCov_9fa48("14280", "14281", "14282"), error || (stryMutAct_9fa48("14283") ? material : (stryCov_9fa48("14283"), !material)))) {
      if (stryMutAct_9fa48("14284")) {
        {}
      } else {
        stryCov_9fa48("14284");
        return <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{stryMutAct_9fa48("14287") ? error && 'No se pudo cargar el material' : stryMutAct_9fa48("14286") ? false : stryMutAct_9fa48("14285") ? true : (stryCov_9fa48("14285", "14286", "14287"), error || (stryMutAct_9fa48("14288") ? "" : (stryCov_9fa48("14288"), 'No se pudo cargar el material')))}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={stryMutAct_9fa48("14289") ? () => undefined : (stryCov_9fa48("14289"), () => router.push(stryMutAct_9fa48("14290") ? "" : (stryCov_9fa48("14290"), '/materials')))}>Volver a Materiales</Button>
          </CardContent>
        </Card>
      </div>;
      }
    }
    return <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={stryMutAct_9fa48("14291") ? [] : (stryCov_9fa48("14291"), [stryMutAct_9fa48("14292") ? {} : (stryCov_9fa48("14292"), {
          label: stryMutAct_9fa48("14293") ? "" : (stryCov_9fa48("14293"), 'Inicio'),
          href: stryMutAct_9fa48("14294") ? "" : (stryCov_9fa48("14294"), '/')
        }), stryMutAct_9fa48("14295") ? {} : (stryCov_9fa48("14295"), {
          label: stryMutAct_9fa48("14296") ? "" : (stryCov_9fa48("14296"), 'Materiales de Estudio'),
          href: stryMutAct_9fa48("14297") ? "" : (stryCov_9fa48("14297"), '/materials')
        }), stryMutAct_9fa48("14298") ? {} : (stryCov_9fa48("14298"), {
          label: material.titulo
        })])} />
      </div>

      {/* Botón Volver */}
      <div className="mb-6">
        <Button variant="ghost" onClick={stryMutAct_9fa48("14299") ? () => undefined : (stryCov_9fa48("14299"), () => router.back())}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Contenido del Material */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{material.titulo}</CardTitle>
                {stryMutAct_9fa48("14302") ? isCompleted || <CheckCircle2 className="h-6 w-6 text-green-600" /> : stryMutAct_9fa48("14301") ? false : stryMutAct_9fa48("14300") ? true : (stryCov_9fa48("14300", "14301", "14302"), isCompleted && <CheckCircle2 className="h-6 w-6 text-green-600" />)}
              </div>
              <CardDescription>
                {material.subject.nombre}
                {stryMutAct_9fa48("14305") ? material.topic || ` • ${material.topic.nombre}` : stryMutAct_9fa48("14304") ? false : stryMutAct_9fa48("14303") ? true : (stryCov_9fa48("14303", "14304", "14305"), material.topic && (stryMutAct_9fa48("14306") ? `` : (stryCov_9fa48("14306"), ` • ${material.topic.nombre}`)))}
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {material.tipo}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información adicional */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(material.createdAt).toLocaleDateString(stryMutAct_9fa48("14307") ? "" : (stryCov_9fa48("14307"), 'es-CL'), stryMutAct_9fa48("14308") ? {} : (stryCov_9fa48("14308"), {
                  year: stryMutAct_9fa48("14309") ? "" : (stryCov_9fa48("14309"), 'numeric'),
                  month: stryMutAct_9fa48("14310") ? "" : (stryCov_9fa48("14310"), 'long'),
                  day: stryMutAct_9fa48("14311") ? "" : (stryCov_9fa48("14311"), 'numeric')
                }))}
              </span>
            </div>
            {stryMutAct_9fa48("14314") ? material.fuente || <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>{material.fuente}</span>
              </div> : stryMutAct_9fa48("14313") ? false : stryMutAct_9fa48("14312") ? true : (stryCov_9fa48("14312", "14313", "14314"), material.fuente && <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>{material.fuente}</span>
              </div>)}
          </div>

          {/* Información del tema */}
          {stryMutAct_9fa48("14317") ? material.topic || <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Tema: {material.topic.nombre}</p>
              <p className="text-sm text-muted-foreground">
                Eje Temático: {material.topic.ejeTematico}
              </p>
              {material.topic.descripcion && <p className="text-sm text-muted-foreground mt-2">{material.topic.descripcion}</p>}
            </div> : stryMutAct_9fa48("14316") ? false : stryMutAct_9fa48("14315") ? true : (stryCov_9fa48("14315", "14316", "14317"), material.topic && <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Tema: {material.topic.nombre}</p>
              <p className="text-sm text-muted-foreground">
                Eje Temático: {material.topic.ejeTematico}
              </p>
              {stryMutAct_9fa48("14320") ? material.topic.descripcion || <p className="text-sm text-muted-foreground mt-2">{material.topic.descripcion}</p> : stryMutAct_9fa48("14319") ? false : stryMutAct_9fa48("14318") ? true : (stryCov_9fa48("14318", "14319", "14320"), material.topic.descripcion && <p className="text-sm text-muted-foreground mt-2">{material.topic.descripcion}</p>)}
            </div>)}

          {/* Contenido */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{material.contenido}</div>
          </div>

          {/* Acciones */}
          <div className="flex gap-4 pt-4 border-t">
            <Button variant={isCompleted ? stryMutAct_9fa48("14321") ? "" : (stryCov_9fa48("14321"), 'outline') : stryMutAct_9fa48("14322") ? "" : (stryCov_9fa48("14322"), 'default')} onClick={handleMarkComplete} className="flex-1">
              {isCompleted ? <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Completado
                </> : <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marcar como Completado
                </>}
            </Button>
            <ShareMaterialButton materialId={material.id} materialTitle={material.titulo} />
            <Button variant="outline" asChild>
              <Link href="/materials">Ver Más Materiales</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
  }
}