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
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Upload, Key, BookOpen, Trash2, FileText, Settings, Database, Users, BarChart3, Sparkles } from 'lucide-react';
const adminSections = stryMutAct_9fa48("1488") ? [] : (stryCov_9fa48("1488"), [stryMutAct_9fa48("1489") ? {} : (stryCov_9fa48("1489"), {
  title: stryMutAct_9fa48("1490") ? "" : (stryCov_9fa48("1490"), 'Importación'),
  description: stryMutAct_9fa48("1491") ? "" : (stryCov_9fa48("1491"), 'Importar contenido al sistema'),
  items: stryMutAct_9fa48("1492") ? [] : (stryCov_9fa48("1492"), [stryMutAct_9fa48("1493") ? {} : (stryCov_9fa48("1493"), {
    title: stryMutAct_9fa48("1494") ? "" : (stryCov_9fa48("1494"), 'Importar Exámenes'),
    description: stryMutAct_9fa48("1495") ? "" : (stryCov_9fa48("1495"), 'Importa exámenes desde PDF o URL de DEMRE'),
    href: stryMutAct_9fa48("1496") ? "" : (stryCov_9fa48("1496"), '/admin/import-exams'),
    icon: Upload,
    color: stryMutAct_9fa48("1497") ? "" : (stryCov_9fa48("1497"), 'text-blue-600')
  }), stryMutAct_9fa48("1498") ? {} : (stryCov_9fa48("1498"), {
    title: stryMutAct_9fa48("1499") ? "" : (stryCov_9fa48("1499"), 'Importar Clavijeros'),
    description: stryMutAct_9fa48("1500") ? "" : (stryCov_9fa48("1500"), 'Importa respuestas correctas desde PDF'),
    href: stryMutAct_9fa48("1501") ? "" : (stryCov_9fa48("1501"), '/admin/import-answer-key'),
    icon: Key,
    color: stryMutAct_9fa48("1502") ? "" : (stryCov_9fa48("1502"), 'text-green-600')
  }), stryMutAct_9fa48("1503") ? {} : (stryCov_9fa48("1503"), {
    title: stryMutAct_9fa48("1504") ? "" : (stryCov_9fa48("1504"), 'Importar Temarios'),
    description: stryMutAct_9fa48("1505") ? "" : (stryCov_9fa48("1505"), 'Importa temarios completos desde PDF, CSV o JSON'),
    href: stryMutAct_9fa48("1506") ? "" : (stryCov_9fa48("1506"), '/admin/import-topics'),
    icon: BookOpen,
    color: stryMutAct_9fa48("1507") ? "" : (stryCov_9fa48("1507"), 'text-purple-600')
  }), stryMutAct_9fa48("1508") ? {} : (stryCov_9fa48("1508"), {
    title: stryMutAct_9fa48("1509") ? "" : (stryCov_9fa48("1509"), 'Generar Examen con IA'),
    description: stryMutAct_9fa48("1510") ? "" : (stryCov_9fa48("1510"), 'Genera exámenes automáticamente basados en temarios'),
    href: stryMutAct_9fa48("1511") ? "" : (stryCov_9fa48("1511"), '/admin/generate-exam'),
    icon: Sparkles,
    color: stryMutAct_9fa48("1512") ? "" : (stryCov_9fa48("1512"), 'text-indigo-600')
  })])
}), stryMutAct_9fa48("1513") ? {} : (stryCov_9fa48("1513"), {
  title: stryMutAct_9fa48("1514") ? "" : (stryCov_9fa48("1514"), 'Mantenimiento'),
  description: stryMutAct_9fa48("1515") ? "" : (stryCov_9fa48("1515"), 'Gestionar y limpiar datos del sistema'),
  items: stryMutAct_9fa48("1516") ? [] : (stryCov_9fa48("1516"), [stryMutAct_9fa48("1517") ? {} : (stryCov_9fa48("1517"), {
    title: stryMutAct_9fa48("1518") ? "" : (stryCov_9fa48("1518"), 'Limpiar Datos Ficticios'),
    description: stryMutAct_9fa48("1519") ? "" : (stryCov_9fa48("1519"), 'Elimina datos de prueba, simulacros y contenido ficticio'),
    href: stryMutAct_9fa48("1520") ? "" : (stryCov_9fa48("1520"), '/admin/cleanup-test-data'),
    icon: Trash2,
    color: stryMutAct_9fa48("1521") ? "" : (stryCov_9fa48("1521"), 'text-red-600')
  })])
})]);
export default function AdminPage() {
  if (stryMutAct_9fa48("1522")) {
    {}
  } else {
    stryCov_9fa48("1522");
    return <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona el contenido y configuración del sistema PAES Tutor
        </p>
      </div>

      <div className="space-y-8">
        {adminSections.map(stryMutAct_9fa48("1523") ? () => undefined : (stryCov_9fa48("1523"), section => <div key={section.title}>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground text-sm">{section.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map(item => {
              if (stryMutAct_9fa48("1524")) {
                {}
              } else {
                stryCov_9fa48("1524");
                const Icon = item.icon;
                return <Card key={item.href} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={stryMutAct_9fa48("1525") ? `` : (stryCov_9fa48("1525"), `p-2 rounded-lg bg-muted ${item.color}`)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full" variant="outline">
                        <Link href={item.href}>Acceder</Link>
                      </Button>
                    </CardContent>
                  </Card>;
              }
            })}
            </div>
          </div>))}

        {/* Información adicional */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-1">Flujo de Importación</div>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Importar Exámenes</li>
                  <li>Importar Clavijeros</li>
                  <li>Importar Temarios (opcional)</li>
                </ol>
              </div>
              <div>
                <div className="font-semibold mb-1">Mantenimiento</div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Limpiar datos de prueba periódicamente</li>
                  <li>Verificar integridad de datos</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1">Recomendaciones</div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Hacer respaldos antes de limpiar datos</li>
                  <li>Verificar exámenes después de importar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
  }
}