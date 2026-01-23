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
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// Usar input type="checkbox" nativo si no existe el componente Checkbox
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Trash2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
const SUBJECTS = stryMutAct_9fa48("0") ? [] : (stryCov_9fa48("0"), [stryMutAct_9fa48("1") ? {} : (stryCov_9fa48("1"), {
  code: stryMutAct_9fa48("2") ? "" : (stryCov_9fa48("2"), 'LECTORA'),
  name: stryMutAct_9fa48("3") ? "" : (stryCov_9fa48("3"), 'Competencia Lectora')
}), stryMutAct_9fa48("4") ? {} : (stryCov_9fa48("4"), {
  code: stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), 'M1'),
  name: stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), 'Matemática M1')
}), stryMutAct_9fa48("7") ? {} : (stryCov_9fa48("7"), {
  code: stryMutAct_9fa48("8") ? "" : (stryCov_9fa48("8"), 'M2'),
  name: stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), 'Matemática M2')
}), stryMutAct_9fa48("10") ? {} : (stryCov_9fa48("10"), {
  code: stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), 'BIO'),
  name: stryMutAct_9fa48("12") ? "" : (stryCov_9fa48("12"), 'Ciencias - Biología')
}), stryMutAct_9fa48("13") ? {} : (stryCov_9fa48("13"), {
  code: stryMutAct_9fa48("14") ? "" : (stryCov_9fa48("14"), 'FIS'),
  name: stryMutAct_9fa48("15") ? "" : (stryCov_9fa48("15"), 'Ciencias - Física')
}), stryMutAct_9fa48("16") ? {} : (stryCov_9fa48("16"), {
  code: stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), 'QUI'),
  name: stryMutAct_9fa48("18") ? "" : (stryCov_9fa48("18"), 'Ciencias - Química')
}), stryMutAct_9fa48("19") ? {} : (stryCov_9fa48("19"), {
  code: stryMutAct_9fa48("20") ? "" : (stryCov_9fa48("20"), 'HIST'),
  name: stryMutAct_9fa48("21") ? "" : (stryCov_9fa48("21"), 'Historia y Ciencias Sociales')
})]);
export default function CleanupTestDataPage() {
  if (stryMutAct_9fa48("22")) {
    {}
  } else {
    stryCov_9fa48("22");
    const [deleteExams, setDeleteExams] = useState(stryMutAct_9fa48("23") ? true : (stryCov_9fa48("23"), false));
    const [deleteTopics, setDeleteTopics] = useState(stryMutAct_9fa48("24") ? true : (stryCov_9fa48("24"), false));
    const [deleteQuestions, setDeleteQuestions] = useState(stryMutAct_9fa48("25") ? true : (stryCov_9fa48("25"), false));
    const [deleteAttempts, setDeleteAttempts] = useState(stryMutAct_9fa48("26") ? true : (stryCov_9fa48("26"), false));
    const [deleteTestUsers, setDeleteTestUsers] = useState(stryMutAct_9fa48("27") ? true : (stryCov_9fa48("27"), false));
    const [onlyTestData, setOnlyTestData] = useState(stryMutAct_9fa48("28") ? false : (stryCov_9fa48("28"), true));
    const [yearFilter, setYearFilter] = useState(stryMutAct_9fa48("29") ? "Stryker was here!" : (stryCov_9fa48("29"), ''));
    const [subjectFilter, setSubjectFilter] = useState(stryMutAct_9fa48("30") ? "Stryker was here!" : (stryCov_9fa48("30"), ''));
    const [loading, setLoading] = useState(stryMutAct_9fa48("31") ? true : (stryCov_9fa48("31"), false));
    const [showConfirmDialog, setShowConfirmDialog] = useState(stryMutAct_9fa48("32") ? true : (stryCov_9fa48("32"), false));
    const [result, setResult] = useState<{
      success: boolean;
      message: string;
      details?: string;
      result?: {
        exams: {
          deleted: number;
          total: number;
        };
        topics: {
          deleted: number;
          total: number;
        };
        questions: {
          deleted: number;
          total: number;
        };
        attempts: {
          deleted: number;
          total: number;
        };
        users: {
          deleted: number;
          total: number;
        };
        errors: Array<{
          type: string;
          error: string;
        }>;
      };
    } | null>(null);
    const handleCleanup = async () => {
      if (stryMutAct_9fa48("33")) {
        {}
      } else {
        stryCov_9fa48("33");
        setLoading(stryMutAct_9fa48("34") ? false : (stryCov_9fa48("34"), true));
        setResult(null);
        try {
          if (stryMutAct_9fa48("35")) {
            {}
          } else {
            stryCov_9fa48("35");
            const response = await fetch(stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), '/api/admin/cleanup-test-data'), stryMutAct_9fa48("37") ? {} : (stryCov_9fa48("37"), {
              method: stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), 'POST'),
              headers: stryMutAct_9fa48("39") ? {} : (stryCov_9fa48("39"), {
                'Content-Type': stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("41") ? {} : (stryCov_9fa48("41"), {
                deleteExams,
                deleteTopics,
                deleteQuestions,
                deleteAttempts,
                deleteTestUsers,
                onlyTestData,
                yearFilter: stryMutAct_9fa48("44") ? yearFilter.trim() && undefined : stryMutAct_9fa48("43") ? false : stryMutAct_9fa48("42") ? true : (stryCov_9fa48("42", "43", "44"), (stryMutAct_9fa48("45") ? yearFilter : (stryCov_9fa48("45"), yearFilter.trim())) || undefined),
                subjectFilter: stryMutAct_9fa48("48") ? subjectFilter.trim() && undefined : stryMutAct_9fa48("47") ? false : stryMutAct_9fa48("46") ? true : (stryCov_9fa48("46", "47", "48"), (stryMutAct_9fa48("49") ? subjectFilter : (stryCov_9fa48("49"), subjectFilter.trim())) || undefined)
              }))
            }));
            const data = await response.json();
            if (stryMutAct_9fa48("52") ? false : stryMutAct_9fa48("51") ? true : stryMutAct_9fa48("50") ? response.ok : (stryCov_9fa48("50", "51", "52"), !response.ok)) {
              if (stryMutAct_9fa48("53")) {
                {}
              } else {
                stryCov_9fa48("53");
                throw new Error(stryMutAct_9fa48("56") ? data.error && 'Error al limpiar datos' : stryMutAct_9fa48("55") ? false : stryMutAct_9fa48("54") ? true : (stryCov_9fa48("54", "55", "56"), data.error || (stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), 'Error al limpiar datos'))));
              }
            }
            setResult(stryMutAct_9fa48("58") ? {} : (stryCov_9fa48("58"), {
              success: stryMutAct_9fa48("59") ? false : (stryCov_9fa48("59"), true),
              message: data.message,
              details: data.details,
              result: data.result
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("60")) {
            {}
          } else {
            stryCov_9fa48("60");
            setResult(stryMutAct_9fa48("61") ? {} : (stryCov_9fa48("61"), {
              success: stryMutAct_9fa48("62") ? true : (stryCov_9fa48("62"), false),
              message: stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), 'Error al limpiar datos'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), 'Error desconocido')
            }));
          }
        } finally {
          if (stryMutAct_9fa48("65")) {
            {}
          } else {
            stryCov_9fa48("65");
            setLoading(stryMutAct_9fa48("66") ? true : (stryCov_9fa48("66"), false));
            setShowConfirmDialog(stryMutAct_9fa48("67") ? true : (stryCov_9fa48("67"), false));
          }
        }
      }
    };
    const handleCleanupClick = () => {
      if (stryMutAct_9fa48("68")) {
        {}
      } else {
        stryCov_9fa48("68");
        // Validar que al menos una opción esté seleccionada
        if (stryMutAct_9fa48("71") ? !deleteExams && !deleteTopics && !deleteQuestions && !deleteAttempts || !deleteTestUsers : stryMutAct_9fa48("70") ? false : stryMutAct_9fa48("69") ? true : (stryCov_9fa48("69", "70", "71"), (stryMutAct_9fa48("73") ? !deleteExams && !deleteTopics && !deleteQuestions || !deleteAttempts : stryMutAct_9fa48("72") ? true : (stryCov_9fa48("72", "73"), (stryMutAct_9fa48("75") ? !deleteExams && !deleteTopics || !deleteQuestions : stryMutAct_9fa48("74") ? true : (stryCov_9fa48("74", "75"), (stryMutAct_9fa48("77") ? !deleteExams || !deleteTopics : stryMutAct_9fa48("76") ? true : (stryCov_9fa48("76", "77"), (stryMutAct_9fa48("78") ? deleteExams : (stryCov_9fa48("78"), !deleteExams)) && (stryMutAct_9fa48("79") ? deleteTopics : (stryCov_9fa48("79"), !deleteTopics)))) && (stryMutAct_9fa48("80") ? deleteQuestions : (stryCov_9fa48("80"), !deleteQuestions)))) && (stryMutAct_9fa48("81") ? deleteAttempts : (stryCov_9fa48("81"), !deleteAttempts)))) && (stryMutAct_9fa48("82") ? deleteTestUsers : (stryCov_9fa48("82"), !deleteTestUsers)))) {
          if (stryMutAct_9fa48("83")) {
            {}
          } else {
            stryCov_9fa48("83");
            setResult(stryMutAct_9fa48("84") ? {} : (stryCov_9fa48("84"), {
              success: stryMutAct_9fa48("85") ? true : (stryCov_9fa48("85"), false),
              message: stryMutAct_9fa48("86") ? "" : (stryCov_9fa48("86"), 'Debe seleccionar al menos un tipo de dato para eliminar')
            }));
            return;
          }
        }
        setShowConfirmDialog(stryMutAct_9fa48("87") ? false : (stryCov_9fa48("87"), true));
      }
    };

    // Calcular totales para mostrar en el resumen
    const totalDeleted = (stryMutAct_9fa48("88") ? result.result : (stryCov_9fa48("88"), result?.result)) ? stryMutAct_9fa48("89") ? result.result.exams.deleted + result.result.topics.deleted + result.result.questions.deleted + result.result.attempts.deleted - result.result.users.deleted : (stryCov_9fa48("89"), (stryMutAct_9fa48("90") ? result.result.exams.deleted + result.result.topics.deleted + result.result.questions.deleted - result.result.attempts.deleted : (stryCov_9fa48("90"), (stryMutAct_9fa48("91") ? result.result.exams.deleted + result.result.topics.deleted - result.result.questions.deleted : (stryCov_9fa48("91"), (stryMutAct_9fa48("92") ? result.result.exams.deleted - result.result.topics.deleted : (stryCov_9fa48("92"), result.result.exams.deleted + result.result.topics.deleted)) + result.result.questions.deleted)) + result.result.attempts.deleted)) + result.result.users.deleted) : 0;
    if (stryMutAct_9fa48("95") ? loading || !result : stryMutAct_9fa48("94") ? false : stryMutAct_9fa48("93") ? true : (stryCov_9fa48("93", "94", "95"), loading && (stryMutAct_9fa48("96") ? result : (stryCov_9fa48("96"), !result)))) {
      if (stryMutAct_9fa48("97")) {
        {}
      } else {
        stryCov_9fa48("97");
        return <div className="container mx-auto py-8 px-4 max-w-4xl">
        <SkeletonLoader variant="form" />
      </div>;
      }
    }
    return <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold">Limpiar Datos Ficticios</h1>
        <p className="text-muted-foreground mt-2">
          Elimina datos de prueba, simulacros y contenido ficticio de la base de datos.
        </p>
      </div>

      <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-200">⚠️ Advertencia</AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-300 mt-2">
          Esta acción es <strong>irreversible</strong>. Los datos eliminados no se pueden recuperar.
          Asegúrate de haber hecho un respaldo si es necesario.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Datos a Eliminar</CardTitle>
          <CardDescription>
            Marca los tipos de datos que deseas eliminar. Por defecto, solo se eliminan datos
            marcados como prueba/test.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Opciones de eliminación */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="deleteExams" checked={deleteExams} onChange={stryMutAct_9fa48("98") ? () => undefined : (stryCov_9fa48("98"), e => setDeleteExams(e.target.checked))} className="h-4 w-4 rounded border-gray-300 cursor-pointer" disabled={loading} />
              <Label htmlFor="deleteExams" className="cursor-pointer">
                Eliminar exámenes de prueba
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="deleteTopics" checked={deleteTopics} onChange={stryMutAct_9fa48("99") ? () => undefined : (stryCov_9fa48("99"), e => setDeleteTopics(e.target.checked))} className="h-4 w-4 rounded border-gray-300 cursor-pointer" disabled={loading} />
              <Label htmlFor="deleteTopics" className="cursor-pointer">
                Eliminar temas de prueba
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="deleteQuestions" checked={deleteQuestions} onChange={stryMutAct_9fa48("100") ? () => undefined : (stryCov_9fa48("100"), e => setDeleteQuestions(e.target.checked))} className="h-4 w-4 rounded border-gray-300 cursor-pointer" disabled={loading} />
              <Label htmlFor="deleteQuestions" className="cursor-pointer">
                Eliminar preguntas de prueba
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="deleteAttempts" checked={deleteAttempts} onChange={stryMutAct_9fa48("101") ? () => undefined : (stryCov_9fa48("101"), e => setDeleteAttempts(e.target.checked))} className="h-4 w-4 rounded border-gray-300 cursor-pointer" disabled={loading} />
              <Label htmlFor="deleteAttempts" className="cursor-pointer">
                Eliminar intentos de exámenes de prueba
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="deleteTestUsers" checked={deleteTestUsers} onChange={stryMutAct_9fa48("102") ? () => undefined : (stryCov_9fa48("102"), e => setDeleteTestUsers(e.target.checked))} className="h-4 w-4 rounded border-gray-300 cursor-pointer" disabled={loading} />
              <Label htmlFor="deleteTestUsers" className="cursor-pointer">
                Eliminar usuarios de prueba
              </Label>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="onlyTestData" checked={onlyTestData} onChange={stryMutAct_9fa48("103") ? () => undefined : (stryCov_9fa48("103"), e => setOnlyTestData(e.target.checked))} className="h-4 w-4 rounded border-gray-300 cursor-pointer" disabled={loading} />
              <Label htmlFor="onlyTestData" className="cursor-pointer">
                Solo eliminar datos marcados como prueba/test
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Si está desmarcado, se eliminarán todos los datos seleccionados sin importar si son de
              prueba o no.
            </p>

            <div className="space-y-2">
              <Label htmlFor="yearFilter">Filtrar por año (opcional)</Label>
              <input id="yearFilter" type="text" value={yearFilter} onChange={stryMutAct_9fa48("104") ? () => undefined : (stryCov_9fa48("104"), e => setYearFilter(e.target.value))} placeholder="Ej: 2024" className="w-full px-3 py-2 border rounded-md" disabled={loading} />
              <p className="text-sm text-muted-foreground">
                Solo eliminar datos del año especificado (busca en el campo "fuente" de los
                exámenes).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectFilter">Filtrar por asignatura (opcional)</Label>
              <select id="subjectFilter" value={subjectFilter} onChange={stryMutAct_9fa48("105") ? () => undefined : (stryCov_9fa48("105"), e => setSubjectFilter(e.target.value))} className="w-full px-3 py-2 border rounded-md" disabled={loading}>
                <option value="">Todas las asignaturas</option>
                {SUBJECTS.map(stryMutAct_9fa48("106") ? () => undefined : (stryCov_9fa48("106"), subject => <option key={subject.code} value={subject.code}>
                    {subject.name}
                  </option>))}
              </select>
              <p className="text-sm text-muted-foreground">
                Solo eliminar datos de la asignatura seleccionada.
              </p>
            </div>
          </div>

          {/* Botón de limpieza */}
          <Button onClick={handleCleanupClick} disabled={stryMutAct_9fa48("109") ? loading && !deleteExams && !deleteTopics && !deleteQuestions && !deleteAttempts && !deleteTestUsers : stryMutAct_9fa48("108") ? false : stryMutAct_9fa48("107") ? true : (stryCov_9fa48("107", "108", "109"), loading || (stryMutAct_9fa48("111") ? !deleteExams && !deleteTopics && !deleteQuestions && !deleteAttempts || !deleteTestUsers : stryMutAct_9fa48("110") ? false : (stryCov_9fa48("110", "111"), (stryMutAct_9fa48("113") ? !deleteExams && !deleteTopics && !deleteQuestions || !deleteAttempts : stryMutAct_9fa48("112") ? true : (stryCov_9fa48("112", "113"), (stryMutAct_9fa48("115") ? !deleteExams && !deleteTopics || !deleteQuestions : stryMutAct_9fa48("114") ? true : (stryCov_9fa48("114", "115"), (stryMutAct_9fa48("117") ? !deleteExams || !deleteTopics : stryMutAct_9fa48("116") ? true : (stryCov_9fa48("116", "117"), (stryMutAct_9fa48("118") ? deleteExams : (stryCov_9fa48("118"), !deleteExams)) && (stryMutAct_9fa48("119") ? deleteTopics : (stryCov_9fa48("119"), !deleteTopics)))) && (stryMutAct_9fa48("120") ? deleteQuestions : (stryCov_9fa48("120"), !deleteQuestions)))) && (stryMutAct_9fa48("121") ? deleteAttempts : (stryCov_9fa48("121"), !deleteAttempts)))) && (stryMutAct_9fa48("122") ? deleteTestUsers : (stryCov_9fa48("122"), !deleteTestUsers)))))} className="w-full" size="lg" variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Limpiar Datos Ficticios
          </Button>

          {/* Dialog de confirmación */}
          <ConfirmDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog} onConfirm={handleCleanup} title="Confirmar Limpieza de Datos" description="Esta acción es irreversible. ¿Estás seguro de que deseas eliminar los datos seleccionados? Esta operación no se puede deshacer." confirmText="Sí, eliminar datos" cancelText="Cancelar" variant="destructive" loading={loading} />

          {/* Resultados */}
          {stryMutAct_9fa48("125") ? result || <Alert variant={result.success ? 'default' : 'destructive'} className={result.success ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? 'Limpieza Completada' : 'Error'}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="font-medium">{result.message}</div>
                {result.details && <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div>}
                {result.result && totalDeleted > 0 && <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="font-semibold mb-2">Resumen:</div>
                    <div className="text-sm space-y-1">
                      <div>Exámenes: {result.result.exams.deleted} eliminados</div>
                      <div>Temas: {result.result.topics.deleted} eliminados</div>
                      <div>Preguntas: {result.result.questions.deleted} eliminadas</div>
                      <div>Intentos: {result.result.attempts.deleted} eliminados</div>
                      <div>Usuarios: {result.result.users.deleted} eliminados</div>
                    </div>
                  </div>}
              </AlertDescription>
            </Alert> : stryMutAct_9fa48("124") ? false : stryMutAct_9fa48("123") ? true : (stryCov_9fa48("123", "124", "125"), result && <Alert variant={result.success ? stryMutAct_9fa48("126") ? "" : (stryCov_9fa48("126"), 'default') : stryMutAct_9fa48("127") ? "" : (stryCov_9fa48("127"), 'destructive')} className={result.success ? stryMutAct_9fa48("128") ? "" : (stryCov_9fa48("128"), 'border-green-500 bg-green-50 dark:bg-green-950/20') : stryMutAct_9fa48("129") ? "Stryker was here!" : (stryCov_9fa48("129"), '')}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? stryMutAct_9fa48("130") ? "" : (stryCov_9fa48("130"), 'Limpieza Completada') : stryMutAct_9fa48("131") ? "" : (stryCov_9fa48("131"), 'Error')}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="font-medium">{result.message}</div>
                {stryMutAct_9fa48("134") ? result.details || <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div> : stryMutAct_9fa48("133") ? false : stryMutAct_9fa48("132") ? true : (stryCov_9fa48("132", "133", "134"), result.details && <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div>)}
                {stryMutAct_9fa48("137") ? result.result && totalDeleted > 0 || <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="font-semibold mb-2">Resumen:</div>
                    <div className="text-sm space-y-1">
                      <div>Exámenes: {result.result.exams.deleted} eliminados</div>
                      <div>Temas: {result.result.topics.deleted} eliminados</div>
                      <div>Preguntas: {result.result.questions.deleted} eliminadas</div>
                      <div>Intentos: {result.result.attempts.deleted} eliminados</div>
                      <div>Usuarios: {result.result.users.deleted} eliminados</div>
                    </div>
                  </div> : stryMutAct_9fa48("136") ? false : stryMutAct_9fa48("135") ? true : (stryCov_9fa48("135", "136", "137"), (stryMutAct_9fa48("139") ? result.result || totalDeleted > 0 : stryMutAct_9fa48("138") ? true : (stryCov_9fa48("138", "139"), result.result && (stryMutAct_9fa48("142") ? totalDeleted <= 0 : stryMutAct_9fa48("141") ? totalDeleted >= 0 : stryMutAct_9fa48("140") ? true : (stryCov_9fa48("140", "141", "142"), totalDeleted > 0)))) && <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="font-semibold mb-2">Resumen:</div>
                    <div className="text-sm space-y-1">
                      <div>Exámenes: {result.result.exams.deleted} eliminados</div>
                      <div>Temas: {result.result.topics.deleted} eliminados</div>
                      <div>Preguntas: {result.result.questions.deleted} eliminadas</div>
                      <div>Intentos: {result.result.attempts.deleted} eliminados</div>
                      <div>Usuarios: {result.result.users.deleted} eliminados</div>
                    </div>
                  </div>)}
              </AlertDescription>
            </Alert>)}

          {/* Información adicional */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Información importante</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Los datos se identifican como "de prueba" si contienen palabras como: test,
                  prueba, demo, ejemplo, simulacro, etc.
                </li>
                <li>Los exámenes de tipo "simulacro" se consideran datos de prueba.</li>
                <li>
                  Los usuarios con emails que contengan "test", "demo", "prueba" o "example" se
                  consideran usuarios de prueba.
                </li>
                <li>La eliminación se realiza en transacción: si falla algo, se revierte todo.</li>
                <li>Se respetan las relaciones de la base de datos (eliminación en cascada).</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>;
  }
}