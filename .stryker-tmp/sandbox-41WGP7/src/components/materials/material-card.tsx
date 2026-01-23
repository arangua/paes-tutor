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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ShareMaterialButton } from './share-material-button';
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
  } | null;
}
interface MaterialCardProps {
  material: Material;
  isCompleted?: boolean;
  className?: string;
}
const tipoIcons: Record<string, typeof BookOpen> = stryMutAct_9fa48("17924") ? {} : (stryCov_9fa48("17924"), {
  articulo: FileText,
  video: ExternalLink,
  guia: BookOpen,
  resumen: FileText,
  ejercicios: FileText
});
const tipoColors: Record<string, string> = stryMutAct_9fa48("17925") ? {} : (stryCov_9fa48("17925"), {
  articulo: stryMutAct_9fa48("17926") ? "" : (stryCov_9fa48("17926"), 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'),
  video: stryMutAct_9fa48("17927") ? "" : (stryCov_9fa48("17927"), 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800'),
  guia: stryMutAct_9fa48("17928") ? "" : (stryCov_9fa48("17928"), 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'),
  resumen: stryMutAct_9fa48("17929") ? "" : (stryCov_9fa48("17929"), 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'),
  ejercicios: stryMutAct_9fa48("17930") ? "" : (stryCov_9fa48("17930"), 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800')
});
export function MaterialCard({
  material,
  isCompleted = stryMutAct_9fa48("17931") ? true : (stryCov_9fa48("17931"), false),
  className
}: MaterialCardProps) {
  if (stryMutAct_9fa48("17932")) {
    {}
  } else {
    stryCov_9fa48("17932");
    const Icon = stryMutAct_9fa48("17935") ? tipoIcons[material.tipo] && BookOpen : stryMutAct_9fa48("17934") ? false : stryMutAct_9fa48("17933") ? true : (stryCov_9fa48("17933", "17934", "17935"), tipoIcons[material.tipo] || BookOpen);
    const tipoColor = stryMutAct_9fa48("17938") ? tipoColors[material.tipo] && 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800' : stryMutAct_9fa48("17937") ? false : stryMutAct_9fa48("17936") ? true : (stryCov_9fa48("17936", "17937", "17938"), tipoColors[material.tipo] || (stryMutAct_9fa48("17939") ? "" : (stryCov_9fa48("17939"), 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800')));

    // Truncar contenido para preview
    const preview = (stryMutAct_9fa48("17943") ? material.contenido.length <= 150 : stryMutAct_9fa48("17942") ? material.contenido.length >= 150 : stryMutAct_9fa48("17941") ? false : stryMutAct_9fa48("17940") ? true : (stryCov_9fa48("17940", "17941", "17942", "17943"), material.contenido.length > 150)) ? (stryMutAct_9fa48("17944") ? material.contenido : (stryCov_9fa48("17944"), material.contenido.substring(0, 150))) + (stryMutAct_9fa48("17945") ? "" : (stryCov_9fa48("17945"), '...')) : material.contenido;
    return <Card className={cn(stryMutAct_9fa48("17946") ? "" : (stryCov_9fa48("17946"), 'transition-all hover:shadow-md'), tipoColor, stryMutAct_9fa48("17949") ? isCompleted || 'opacity-75' : stryMutAct_9fa48("17948") ? false : stryMutAct_9fa48("17947") ? true : (stryCov_9fa48("17947", "17948", "17949"), isCompleted && (stryMutAct_9fa48("17950") ? "" : (stryCov_9fa48("17950"), 'opacity-75'))), className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{material.titulo}</CardTitle>
              {stryMutAct_9fa48("17953") ? isCompleted || <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" /> : stryMutAct_9fa48("17952") ? false : stryMutAct_9fa48("17951") ? true : (stryCov_9fa48("17951", "17952", "17953"), isCompleted && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />)}
            </div>
            <CardDescription>
              {material.subject.nombre}
              {stryMutAct_9fa48("17956") ? material.topic || ` • ${material.topic.nombre}` : stryMutAct_9fa48("17955") ? false : stryMutAct_9fa48("17954") ? true : (stryCov_9fa48("17954", "17955", "17956"), material.topic && (stryMutAct_9fa48("17957") ? `` : (stryCov_9fa48("17957"), ` • ${material.topic.nombre}`)))}
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {material.tipo}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview del contenido */}
        <p className="text-sm text-muted-foreground line-clamp-3">{preview}</p>

        {/* Información adicional */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(material.createdAt).toLocaleDateString(stryMutAct_9fa48("17958") ? "" : (stryCov_9fa48("17958"), 'es-CL'), stryMutAct_9fa48("17959") ? {} : (stryCov_9fa48("17959"), {
                year: stryMutAct_9fa48("17960") ? "" : (stryCov_9fa48("17960"), 'numeric'),
                month: stryMutAct_9fa48("17961") ? "" : (stryCov_9fa48("17961"), 'short'),
                day: stryMutAct_9fa48("17962") ? "" : (stryCov_9fa48("17962"), 'numeric')
              }))}
            </span>
          </div>
          {stryMutAct_9fa48("17965") ? material.fuente || <span className="truncate max-w-[150px]" title={material.fuente}>
              {material.fuente}
            </span> : stryMutAct_9fa48("17964") ? false : stryMutAct_9fa48("17963") ? true : (stryCov_9fa48("17963", "17964", "17965"), material.fuente && <span className="truncate max-w-[150px]" title={material.fuente}>
              {material.fuente}
            </span>)}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button variant="default" className="flex-1" asChild>
            <Link href={stryMutAct_9fa48("17966") ? `` : (stryCov_9fa48("17966"), `/materials/${material.id}`)}>
              Ver Material
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <ShareMaterialButton materialId={material.id} materialTitle={material.titulo} />
        </div>
      </CardContent>
    </Card>;
  }
}