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
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, Filter, Home, FileText, Loader2, AlertCircle } from 'lucide-react';
import { ExportButton } from '@/components/export/export-button';
import { exportExamsListToExcel } from '@/lib/export-utils';
import { toast } from 'sonner';
import { useProgressTracker } from '@/hooks/useProgressTracker';
import { ProgressDialog } from '@/components/ui/progress-dialog';
import { useExams } from '@/hooks/useExams';
import { useDebounce } from '@/hooks/useDebounce';
import { ExamCard } from '@/components/ExamCard';
import { Pagination } from '@/components/ui/pagination';
import { HelpIcon } from '@/components/help/help-icon';
import { BackButton } from '@/components/navigation/back-button';
export default function ExamsPage() {
  if (stryMutAct_9fa48("12728")) {
    {}
  } else {
    stryCov_9fa48("12728");
    const router = useRouter();
    const exportProgress = useProgressTracker();
    const [searchQuery, setSearchQuery] = useState(stryMutAct_9fa48("12729") ? "Stryker was here!" : (stryCov_9fa48("12729"), ''));
    const [selectedSubject, setSelectedSubject] = useState<string>(stryMutAct_9fa48("12730") ? "" : (stryCov_9fa48("12730"), 'all'));
    const [selectedTipo, setSelectedTipo] = useState<string>(stryMutAct_9fa48("12731") ? "" : (stryCov_9fa48("12731"), 'all'));
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Usar custom hooks para lógica compleja
    const {
      exams,
      pagination,
      isLoading,
      error,
      filterExams,
      subjects,
      tipos
    } = useExams(stryMutAct_9fa48("12732") ? {} : (stryCov_9fa48("12732"), {
      subjectId: selectedSubject,
      tipo: selectedTipo,
      limit: itemsPerPage,
      offset: stryMutAct_9fa48("12733") ? (currentPage - 1) / itemsPerPage : (stryCov_9fa48("12733"), (stryMutAct_9fa48("12734") ? currentPage + 1 : (stryCov_9fa48("12734"), currentPage - 1)) * itemsPerPage)
    }));

    // Debounce de búsqueda
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Filtrar exámenes por búsqueda (solo en la página actual)
    const filteredExams = filterExams(debouncedSearchQuery);

    // Resetear página cuando cambian los filtros
    useEffect(() => {
      if (stryMutAct_9fa48("12735")) {
        {}
      } else {
        stryCov_9fa48("12735");
        setCurrentPage(1);
      }
    }, stryMutAct_9fa48("12736") ? [] : (stryCov_9fa48("12736"), [selectedSubject, selectedTipo, searchQuery]));
    const handleStartExam = useCallback((examId: string) => {
      if (stryMutAct_9fa48("12737")) {
        {}
      } else {
        stryCov_9fa48("12737");
        // Validar formato del ID antes de navegar
        if (stryMutAct_9fa48("12740") ? !examId && !/^c[a-z0-9]{24}$/.test(examId) : stryMutAct_9fa48("12739") ? false : stryMutAct_9fa48("12738") ? true : (stryCov_9fa48("12738", "12739", "12740"), (stryMutAct_9fa48("12741") ? examId : (stryCov_9fa48("12741"), !examId)) || (stryMutAct_9fa48("12742") ? /^c[a-z0-9]{24}$/.test(examId) : (stryCov_9fa48("12742"), !(stryMutAct_9fa48("12746") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("12745") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("12744") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("12743") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("12743", "12744", "12745", "12746"), /^c[a-z0-9]{24}$/)).test(examId))))) {
          if (stryMutAct_9fa48("12747")) {
            {}
          } else {
            stryCov_9fa48("12747");
            toast.error(stryMutAct_9fa48("12748") ? "" : (stryCov_9fa48("12748"), 'ID de examen inválido'), stryMutAct_9fa48("12749") ? {} : (stryCov_9fa48("12749"), {
              description: stryMutAct_9fa48("12750") ? "" : (stryCov_9fa48("12750"), 'El ID del examen no es válido. Por favor, selecciona otro examen.')
            }));
            return;
          }
        }
        router.push(stryMutAct_9fa48("12751") ? `` : (stryCov_9fa48("12751"), `/exams/${examId}/take`));
      }
    }, stryMutAct_9fa48("12752") ? [] : (stryCov_9fa48("12752"), [router]));
    const handleExportExcel = useCallback(async () => {
      if (stryMutAct_9fa48("12753")) {
        {}
      } else {
        stryCov_9fa48("12753");
        if (stryMutAct_9fa48("12756") ? filteredExams.length !== 0 : stryMutAct_9fa48("12755") ? false : stryMutAct_9fa48("12754") ? true : (stryCov_9fa48("12754", "12755", "12756"), filteredExams.length === 0)) {
          if (stryMutAct_9fa48("12757")) {
            {}
          } else {
            stryCov_9fa48("12757");
            toast.error(stryMutAct_9fa48("12758") ? "" : (stryCov_9fa48("12758"), 'No hay exámenes para exportar'), stryMutAct_9fa48("12759") ? {} : (stryCov_9fa48("12759"), {
              description: stryMutAct_9fa48("12760") ? "" : (stryCov_9fa48("12760"), 'No hay exámenes en la lista actual. Ajusta los filtros o espera a que se agreguen más exámenes.')
            }));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("12761")) {
            {}
          } else {
            stryCov_9fa48("12761");
            exportProgress.start(3, stryMutAct_9fa48("12762") ? `` : (stryCov_9fa48("12762"), `Exportando ${filteredExams.length} examen(es)...`));
            const examsData = filteredExams.map(stryMutAct_9fa48("12763") ? () => undefined : (stryCov_9fa48("12763"), exam => stryMutAct_9fa48("12764") ? {} : (stryCov_9fa48("12764"), {
              id: exam.id,
              titulo: exam.titulo,
              descripcion: exam.descripcion,
              tipo: exam.tipo,
              totalPreguntas: exam.totalPreguntas,
              tiempoLimiteMin: exam.tiempoLimiteMin,
              subject: stryMutAct_9fa48("12765") ? {} : (stryCov_9fa48("12765"), {
                nombre: exam.subject.nombre,
                codigo: exam.subject.codigo
              }),
              createdAt: exam.createdAt
            })));
            await exportExamsListToExcel(examsData, (progress, current, total, message) => {
              if (stryMutAct_9fa48("12766")) {
                {}
              } else {
                stryCov_9fa48("12766");
                exportProgress.updateProgress(current, total, message);
              }
            });
            exportProgress.complete();
            toast.success(stryMutAct_9fa48("12767") ? "" : (stryCov_9fa48("12767"), 'Exportación exitosa'), stryMutAct_9fa48("12768") ? {} : (stryCov_9fa48("12768"), {
              description: stryMutAct_9fa48("12769") ? `` : (stryCov_9fa48("12769"), `Se exportaron ${filteredExams.length} examen(es) correctamente.`)
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("12770")) {
            {}
          } else {
            stryCov_9fa48("12770");
            exportProgress.fail(error instanceof Error ? error : new Error(stryMutAct_9fa48("12771") ? "" : (stryCov_9fa48("12771"), 'Error desconocido')));
            const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("12772") ? "" : (stryCov_9fa48("12772"), 'No se pudo exportar la lista de exámenes. Por favor, intenta nuevamente.');
            toast.error(stryMutAct_9fa48("12773") ? "" : (stryCov_9fa48("12773"), 'Error al exportar'), stryMutAct_9fa48("12774") ? {} : (stryCov_9fa48("12774"), {
              description: errorMessage
            }));

            // Log del error para debugging
            if (stryMutAct_9fa48("12777") ? typeof window !== 'undefined' || (window as any).captureError : stryMutAct_9fa48("12776") ? false : stryMutAct_9fa48("12775") ? true : (stryCov_9fa48("12775", "12776", "12777"), (stryMutAct_9fa48("12779") ? typeof window === 'undefined' : stryMutAct_9fa48("12778") ? true : (stryCov_9fa48("12778", "12779"), typeof window !== (stryMutAct_9fa48("12780") ? "" : (stryCov_9fa48("12780"), 'undefined')))) && (window as any).captureError)) {
              if (stryMutAct_9fa48("12781")) {
                {}
              } else {
                stryCov_9fa48("12781");
                ;
                (window as any).captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("12782") ? {} : (stryCov_9fa48("12782"), {
                  type: stryMutAct_9fa48("12783") ? "" : (stryCov_9fa48("12783"), 'export_error'),
                  action: stryMutAct_9fa48("12784") ? "" : (stryCov_9fa48("12784"), 'export_exams_list'),
                  context: stryMutAct_9fa48("12785") ? {} : (stryCov_9fa48("12785"), {
                    examCount: filteredExams.length
                  })
                }));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("12786") ? [] : (stryCov_9fa48("12786"), [filteredExams]));
    if (stryMutAct_9fa48("12788") ? false : stryMutAct_9fa48("12787") ? true : (stryCov_9fa48("12787", "12788"), isLoading)) {
      if (stryMutAct_9fa48("12789")) {
        {}
      } else {
        stryCov_9fa48("12789");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando exámenes...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("12791") ? false : stryMutAct_9fa48("12790") ? true : (stryCov_9fa48("12790", "12791"), error)) {
      if (stryMutAct_9fa48("12792")) {
        {}
      } else {
        stryCov_9fa48("12792");
        return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={stryMutAct_9fa48("12793") ? () => undefined : (stryCov_9fa48("12793"), () => window.location.reload())}>Reintentar</Button>
        </div>
      </div>;
      }
    }
    return <>
      <ProgressDialog open={exportProgress.isActive} title="Exportando lista de exámenes" description="Por favor espera mientras se genera el archivo..." progress={exportProgress.progress} current={exportProgress.current} total={exportProgress.total} message={exportProgress.message} estimatedTimeRemaining={exportProgress.estimatedTimeRemaining} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="mb-4">
                <BackButton href="/dashboard" label="Volver al Dashboard" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Exámenes Disponibles
                </h1>
                <HelpIcon content="Aquí puedes ver todos los exámenes disponibles. Usa los filtros para encontrar exámenes por asignatura o tipo. Tu progreso se guarda automáticamente durante cada examen." side="right" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona un examen para comenzar a practicar
              </p>
            </div>
            <div className="flex gap-2">
              {stryMutAct_9fa48("12796") ? filteredExams.length > 0 || <ExportButton onExportExcel={handleExportExcel} variant="outline" /> : stryMutAct_9fa48("12795") ? false : stryMutAct_9fa48("12794") ? true : (stryCov_9fa48("12794", "12795", "12796"), (stryMutAct_9fa48("12799") ? filteredExams.length <= 0 : stryMutAct_9fa48("12798") ? filteredExams.length >= 0 : stryMutAct_9fa48("12797") ? true : (stryCov_9fa48("12797", "12798", "12799"), filteredExams.length > 0)) && <ExportButton onExportExcel={handleExportExcel} variant="outline" />)}
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Inicio
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <FileText className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input type="text" placeholder="Buscar exámenes..." value={searchQuery} onChange={stryMutAct_9fa48("12800") ? () => undefined : (stryCov_9fa48("12800"), e => setSearchQuery(e.target.value))} className="pl-10" role="search" aria-label="Buscar exámenes por título, descripción o asignatura" />
              </div>

              {/* Filtro por Asignatura */}
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las asignaturas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las asignaturas</SelectItem>
                  {subjects.map(stryMutAct_9fa48("12801") ? () => undefined : (stryCov_9fa48("12801"), subject => <SelectItem key={subject.id} value={subject.id}>
                      {subject.nombre} ({subject.codigo})
                    </SelectItem>))}
                </SelectContent>
              </Select>

              {/* Filtro por Tipo */}
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {tipos.map(stryMutAct_9fa48("12802") ? () => undefined : (stryCov_9fa48("12802"), tipo => <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            {/* Resultados del filtro */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {pagination ? <>
                  Mostrando {stryMutAct_9fa48("12803") ? Math.max((currentPage - 1) * itemsPerPage + 1, pagination.total) : (stryCov_9fa48("12803"), Math.min(stryMutAct_9fa48("12804") ? (currentPage - 1) * itemsPerPage - 1 : (stryCov_9fa48("12804"), (stryMutAct_9fa48("12805") ? (currentPage - 1) / itemsPerPage : (stryCov_9fa48("12805"), (stryMutAct_9fa48("12806") ? currentPage + 1 : (stryCov_9fa48("12806"), currentPage - 1)) * itemsPerPage)) + 1), pagination.total))} -{stryMutAct_9fa48("12807") ? "" : (stryCov_9fa48("12807"), ' ')}
                  {stryMutAct_9fa48("12808") ? Math.max(currentPage * itemsPerPage, pagination.total) : (stryCov_9fa48("12808"), Math.min(stryMutAct_9fa48("12809") ? currentPage / itemsPerPage : (stryCov_9fa48("12809"), currentPage * itemsPerPage), pagination.total))} de {pagination.total}{stryMutAct_9fa48("12810") ? "" : (stryCov_9fa48("12810"), ' ')}
                  exámenes
                </> : <>
                  Mostrando {filteredExams.length}{stryMutAct_9fa48("12811") ? "" : (stryCov_9fa48("12811"), ' ')}
                  {(stryMutAct_9fa48("12814") ? filteredExams.length !== 1 : stryMutAct_9fa48("12813") ? false : stryMutAct_9fa48("12812") ? true : (stryCov_9fa48("12812", "12813", "12814"), filteredExams.length === 1)) ? stryMutAct_9fa48("12815") ? "" : (stryCov_9fa48("12815"), 'examen') : stryMutAct_9fa48("12816") ? "" : (stryCov_9fa48("12816"), 'exámenes')}
                </>}
            </div>
          </CardContent>
        </Card>

        {/* Listado de Exámenes */}
        {(stryMutAct_9fa48("12819") ? filteredExams.length !== 0 : stryMutAct_9fa48("12818") ? false : stryMutAct_9fa48("12817") ? true : (stryCov_9fa48("12817", "12818", "12819"), filteredExams.length === 0)) ? <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No se encontraron exámenes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {(stryMutAct_9fa48("12822") ? (searchQuery || selectedSubject !== 'all') && selectedTipo !== 'all' : stryMutAct_9fa48("12821") ? false : stryMutAct_9fa48("12820") ? true : (stryCov_9fa48("12820", "12821", "12822"), (stryMutAct_9fa48("12824") ? searchQuery && selectedSubject !== 'all' : stryMutAct_9fa48("12823") ? false : (stryCov_9fa48("12823", "12824"), searchQuery || (stryMutAct_9fa48("12826") ? selectedSubject === 'all' : stryMutAct_9fa48("12825") ? false : (stryCov_9fa48("12825", "12826"), selectedSubject !== (stryMutAct_9fa48("12827") ? "" : (stryCov_9fa48("12827"), 'all')))))) || (stryMutAct_9fa48("12829") ? selectedTipo === 'all' : stryMutAct_9fa48("12828") ? false : (stryCov_9fa48("12828", "12829"), selectedTipo !== (stryMutAct_9fa48("12830") ? "" : (stryCov_9fa48("12830"), 'all')))))) ? stryMutAct_9fa48("12831") ? "" : (stryCov_9fa48("12831"), 'Intenta ajustar los filtros de búsqueda') : stryMutAct_9fa48("12832") ? "" : (stryCov_9fa48("12832"), 'No hay exámenes disponibles en este momento')}
              </p>
              {stryMutAct_9fa48("12835") ? searchQuery || selectedSubject !== 'all' || selectedTipo !== 'all' || <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setSelectedTipo('all');
              }}>
                  Limpiar filtros
                </Button> : stryMutAct_9fa48("12834") ? false : stryMutAct_9fa48("12833") ? true : (stryCov_9fa48("12833", "12834", "12835"), (stryMutAct_9fa48("12837") ? (searchQuery || selectedSubject !== 'all') && selectedTipo !== 'all' : stryMutAct_9fa48("12836") ? true : (stryCov_9fa48("12836", "12837"), (stryMutAct_9fa48("12839") ? searchQuery && selectedSubject !== 'all' : stryMutAct_9fa48("12838") ? false : (stryCov_9fa48("12838", "12839"), searchQuery || (stryMutAct_9fa48("12841") ? selectedSubject === 'all' : stryMutAct_9fa48("12840") ? false : (stryCov_9fa48("12840", "12841"), selectedSubject !== (stryMutAct_9fa48("12842") ? "" : (stryCov_9fa48("12842"), 'all')))))) || (stryMutAct_9fa48("12844") ? selectedTipo === 'all' : stryMutAct_9fa48("12843") ? false : (stryCov_9fa48("12843", "12844"), selectedTipo !== (stryMutAct_9fa48("12845") ? "" : (stryCov_9fa48("12845"), 'all')))))) && <Button variant="outline" onClick={() => {
                if (stryMutAct_9fa48("12846")) {
                  {}
                } else {
                  stryCov_9fa48("12846");
                  setSearchQuery(stryMutAct_9fa48("12847") ? "Stryker was here!" : (stryCov_9fa48("12847"), ''));
                  setSelectedSubject(stryMutAct_9fa48("12848") ? "" : (stryCov_9fa48("12848"), 'all'));
                  setSelectedTipo(stryMutAct_9fa48("12849") ? "" : (stryCov_9fa48("12849"), 'all'));
                }
              }}>
                  Limpiar filtros
                </Button>)}
            </CardContent>
          </Card> : <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map(stryMutAct_9fa48("12850") ? () => undefined : (stryCov_9fa48("12850"), exam => <ExamCard key={exam.id} exam={exam} onStartExam={handleStartExam} />))}
            </div>

            {/* Paginación */}
            {stryMutAct_9fa48("12853") ? pagination && pagination.total > itemsPerPage || <div className="mt-6">
                <Pagination currentPage={currentPage} totalPages={Math.ceil(pagination.total / itemsPerPage)} onPageChange={page => {
                setCurrentPage(page);
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }} />
              </div> : stryMutAct_9fa48("12852") ? false : stryMutAct_9fa48("12851") ? true : (stryCov_9fa48("12851", "12852", "12853"), (stryMutAct_9fa48("12855") ? pagination || pagination.total > itemsPerPage : stryMutAct_9fa48("12854") ? true : (stryCov_9fa48("12854", "12855"), pagination && (stryMutAct_9fa48("12858") ? pagination.total <= itemsPerPage : stryMutAct_9fa48("12857") ? pagination.total >= itemsPerPage : stryMutAct_9fa48("12856") ? true : (stryCov_9fa48("12856", "12857", "12858"), pagination.total > itemsPerPage)))) && <div className="mt-6">
                <Pagination currentPage={currentPage} totalPages={Math.ceil(stryMutAct_9fa48("12859") ? pagination.total * itemsPerPage : (stryCov_9fa48("12859"), pagination.total / itemsPerPage))} onPageChange={page => {
                if (stryMutAct_9fa48("12860")) {
                  {}
                } else {
                  stryCov_9fa48("12860");
                  setCurrentPage(page);
                  window.scrollTo(stryMutAct_9fa48("12861") ? {} : (stryCov_9fa48("12861"), {
                    top: 0,
                    behavior: stryMutAct_9fa48("12862") ? "" : (stryCov_9fa48("12862"), 'smooth')
                  }));
                }
              }} />
              </div>)}
          </>}
        </div>
      </div>
    </>;
  }
}