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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
const SUBJECTS = stryMutAct_9fa48("309") ? [] : (stryCov_9fa48("309"), [stryMutAct_9fa48("310") ? "" : (stryCov_9fa48("310"), 'Competencia Lectora'), stryMutAct_9fa48("311") ? "" : (stryCov_9fa48("311"), 'Matemática M1'), stryMutAct_9fa48("312") ? "" : (stryCov_9fa48("312"), 'Matemática M2'), stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'Ciencias - Biología'), stryMutAct_9fa48("314") ? "" : (stryCov_9fa48("314"), 'Ciencias - Física'), stryMutAct_9fa48("315") ? "" : (stryCov_9fa48("315"), 'Ciencias - Química'), stryMutAct_9fa48("316") ? "" : (stryCov_9fa48("316"), 'Historia y Ciencias Sociales')]);
export default function ImportAnswerKeyPage() {
  if (stryMutAct_9fa48("317")) {
    {}
  } else {
    stryCov_9fa48("317");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [subjectName, setSubjectName] = useState<string | undefined>(undefined);
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(stryMutAct_9fa48("318") ? true : (stryCov_9fa48("318"), false));
    const [result, setResult] = useState<{
      success: boolean;
      message: string;
      details?: string;
      examId?: string;
    } | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (stryMutAct_9fa48("319")) {
        {}
      } else {
        stryCov_9fa48("319");
        const file = stryMutAct_9fa48("320") ? e.target.files[0] : (stryCov_9fa48("320"), e.target.files?.[0]);
        if (stryMutAct_9fa48("322") ? false : stryMutAct_9fa48("321") ? true : (stryCov_9fa48("321", "322"), file)) {
          if (stryMutAct_9fa48("323")) {
            {}
          } else {
            stryCov_9fa48("323");
            // Validar tipo de archivo
            if (stryMutAct_9fa48("326") ? file.type || file.type !== 'application/pdf' : stryMutAct_9fa48("325") ? false : stryMutAct_9fa48("324") ? true : (stryCov_9fa48("324", "325", "326"), file.type && (stryMutAct_9fa48("328") ? file.type === 'application/pdf' : stryMutAct_9fa48("327") ? true : (stryCov_9fa48("327", "328"), file.type !== (stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), 'application/pdf')))))) {
              if (stryMutAct_9fa48("330")) {
                {}
              } else {
                stryCov_9fa48("330");
                setResult(stryMutAct_9fa48("331") ? {} : (stryCov_9fa48("331"), {
                  success: stryMutAct_9fa48("332") ? true : (stryCov_9fa48("332"), false),
                  message: stryMutAct_9fa48("333") ? "" : (stryCov_9fa48("333"), 'El archivo debe ser un PDF'),
                  details: stryMutAct_9fa48("334") ? "" : (stryCov_9fa48("334"), 'Por favor, selecciona un archivo PDF válido.')
                }));
                return;
              }
            }

            // Validar extensión
            const fileName = stryMutAct_9fa48("335") ? file.name.toUpperCase() : (stryCov_9fa48("335"), file.name.toLowerCase());
            if (stryMutAct_9fa48("338") ? false : stryMutAct_9fa48("337") ? true : stryMutAct_9fa48("336") ? fileName.endsWith('.pdf') : (stryCov_9fa48("336", "337", "338"), !(stryMutAct_9fa48("339") ? fileName.startsWith('.pdf') : (stryCov_9fa48("339"), fileName.endsWith(stryMutAct_9fa48("340") ? "" : (stryCov_9fa48("340"), '.pdf')))))) {
              if (stryMutAct_9fa48("341")) {
                {}
              } else {
                stryCov_9fa48("341");
                setResult(stryMutAct_9fa48("342") ? {} : (stryCov_9fa48("342"), {
                  success: stryMutAct_9fa48("343") ? true : (stryCov_9fa48("343"), false),
                  message: stryMutAct_9fa48("344") ? "" : (stryCov_9fa48("344"), 'El archivo debe tener extensión .pdf'),
                  details: stryMutAct_9fa48("345") ? "" : (stryCov_9fa48("345"), 'Por favor, selecciona un archivo PDF válido.')
                }));
                return;
              }
            }

            // Validar tamaño (máximo 50 MB)
            const MAX_FILE_SIZE = stryMutAct_9fa48("346") ? 50 * 1024 / 1024 : (stryCov_9fa48("346"), (stryMutAct_9fa48("347") ? 50 / 1024 : (stryCov_9fa48("347"), 50 * 1024)) * 1024); // 50 MB
            if (stryMutAct_9fa48("351") ? file.size <= MAX_FILE_SIZE : stryMutAct_9fa48("350") ? file.size >= MAX_FILE_SIZE : stryMutAct_9fa48("349") ? false : stryMutAct_9fa48("348") ? true : (stryCov_9fa48("348", "349", "350", "351"), file.size > MAX_FILE_SIZE)) {
              if (stryMutAct_9fa48("352")) {
                {}
              } else {
                stryCov_9fa48("352");
                setResult(stryMutAct_9fa48("353") ? {} : (stryCov_9fa48("353"), {
                  success: stryMutAct_9fa48("354") ? true : (stryCov_9fa48("354"), false),
                  message: stryMutAct_9fa48("355") ? "" : (stryCov_9fa48("355"), 'El archivo es demasiado grande'),
                  details: stryMutAct_9fa48("356") ? `` : (stryCov_9fa48("356"), `El tamaño máximo permitido es ${stryMutAct_9fa48("357") ? MAX_FILE_SIZE / 1024 * 1024 : (stryCov_9fa48("357"), (stryMutAct_9fa48("358") ? MAX_FILE_SIZE * 1024 : (stryCov_9fa48("358"), MAX_FILE_SIZE / 1024)) / 1024)} MB. Tamaño actual: ${(stryMutAct_9fa48("359") ? file.size / 1024 * 1024 : (stryCov_9fa48("359"), (stryMutAct_9fa48("360") ? file.size * 1024 : (stryCov_9fa48("360"), file.size / 1024)) / 1024)).toFixed(2)} MB`)
                }));
                return;
              }
            }

            // Validar tamaño mínimo
            const MIN_FILE_SIZE = 100; // 100 bytes
            if (stryMutAct_9fa48("364") ? file.size >= MIN_FILE_SIZE : stryMutAct_9fa48("363") ? file.size <= MIN_FILE_SIZE : stryMutAct_9fa48("362") ? false : stryMutAct_9fa48("361") ? true : (stryCov_9fa48("361", "362", "363", "364"), file.size < MIN_FILE_SIZE)) {
              if (stryMutAct_9fa48("365")) {
                {}
              } else {
                stryCov_9fa48("365");
                setResult(stryMutAct_9fa48("366") ? {} : (stryCov_9fa48("366"), {
                  success: stryMutAct_9fa48("367") ? true : (stryCov_9fa48("367"), false),
                  message: stryMutAct_9fa48("368") ? "" : (stryCov_9fa48("368"), 'El archivo es demasiado pequeño'),
                  details: stryMutAct_9fa48("369") ? "" : (stryCov_9fa48("369"), 'El archivo parece estar vacío o corrupto.')
                }));
                return;
              }
            }
            setPdfFile(file);
            setResult(null);
          }
        }
      }
    };
    const handleImport = async () => {
      if (stryMutAct_9fa48("370")) {
        {}
      } else {
        stryCov_9fa48("370");
        // Validar
        if (stryMutAct_9fa48("373") ? false : stryMutAct_9fa48("372") ? true : stryMutAct_9fa48("371") ? pdfFile : (stryCov_9fa48("371", "372", "373"), !pdfFile)) {
          if (stryMutAct_9fa48("374")) {
            {}
          } else {
            stryCov_9fa48("374");
            setResult(stryMutAct_9fa48("375") ? {} : (stryCov_9fa48("375"), {
              success: stryMutAct_9fa48("376") ? true : (stryCov_9fa48("376"), false),
              message: stryMutAct_9fa48("377") ? "" : (stryCov_9fa48("377"), 'Archivo requerido'),
              details: stryMutAct_9fa48("378") ? "" : (stryCov_9fa48("378"), 'Por favor, selecciona un archivo PDF del clavijero.')
            }));
            return;
          }
        }
        if (stryMutAct_9fa48("381") ? false : stryMutAct_9fa48("380") ? true : stryMutAct_9fa48("379") ? subjectName : (stryCov_9fa48("379", "380", "381"), !subjectName)) {
          if (stryMutAct_9fa48("382")) {
            {}
          } else {
            stryCov_9fa48("382");
            setResult(stryMutAct_9fa48("383") ? {} : (stryCov_9fa48("383"), {
              success: stryMutAct_9fa48("384") ? true : (stryCov_9fa48("384"), false),
              message: stryMutAct_9fa48("385") ? "" : (stryCov_9fa48("385"), 'Asignatura requerida'),
              details: stryMutAct_9fa48("386") ? "" : (stryCov_9fa48("386"), 'Por favor, selecciona la asignatura del examen.')
            }));
            return;
          }
        }
        if (stryMutAct_9fa48("389") ? false : stryMutAct_9fa48("388") ? true : stryMutAct_9fa48("387") ? year : (stryCov_9fa48("387", "388", "389"), !year)) {
          if (stryMutAct_9fa48("390")) {
            {}
          } else {
            stryCov_9fa48("390");
            setResult(stryMutAct_9fa48("391") ? {} : (stryCov_9fa48("391"), {
              success: stryMutAct_9fa48("392") ? true : (stryCov_9fa48("392"), false),
              message: stryMutAct_9fa48("393") ? "" : (stryCov_9fa48("393"), 'Año requerido'),
              details: stryMutAct_9fa48("394") ? "" : (stryCov_9fa48("394"), 'Por favor, ingresa el año del examen.')
            }));
            return;
          }
        }

        // Validar año
        const yearNum = parseInt(year);
        if (stryMutAct_9fa48("397") ? (isNaN(yearNum) || yearNum < 2000) && yearNum > 2100 : stryMutAct_9fa48("396") ? false : stryMutAct_9fa48("395") ? true : (stryCov_9fa48("395", "396", "397"), (stryMutAct_9fa48("399") ? isNaN(yearNum) && yearNum < 2000 : stryMutAct_9fa48("398") ? false : (stryCov_9fa48("398", "399"), isNaN(yearNum) || (stryMutAct_9fa48("402") ? yearNum >= 2000 : stryMutAct_9fa48("401") ? yearNum <= 2000 : stryMutAct_9fa48("400") ? false : (stryCov_9fa48("400", "401", "402"), yearNum < 2000)))) || (stryMutAct_9fa48("405") ? yearNum <= 2100 : stryMutAct_9fa48("404") ? yearNum >= 2100 : stryMutAct_9fa48("403") ? false : (stryCov_9fa48("403", "404", "405"), yearNum > 2100)))) {
          if (stryMutAct_9fa48("406")) {
            {}
          } else {
            stryCov_9fa48("406");
            setResult(stryMutAct_9fa48("407") ? {} : (stryCov_9fa48("407"), {
              success: stryMutAct_9fa48("408") ? true : (stryCov_9fa48("408"), false),
              message: stryMutAct_9fa48("409") ? "" : (stryCov_9fa48("409"), 'Año inválido'),
              details: stryMutAct_9fa48("410") ? "" : (stryCov_9fa48("410"), 'El año debe ser un número entre 2000 y 2100.')
            }));
            return;
          }
        }
        setLoading(stryMutAct_9fa48("411") ? false : (stryCov_9fa48("411"), true));
        setResult(null);
        try {
          if (stryMutAct_9fa48("412")) {
            {}
          } else {
            stryCov_9fa48("412");
            const formData = new FormData();
            formData.append(stryMutAct_9fa48("413") ? "" : (stryCov_9fa48("413"), 'pdfFile'), pdfFile);
            formData.append(stryMutAct_9fa48("414") ? "" : (stryCov_9fa48("414"), 'subjectName'), subjectName);
            formData.append(stryMutAct_9fa48("415") ? "" : (stryCov_9fa48("415"), 'year'), year);
            const response = await fetch(stryMutAct_9fa48("416") ? "" : (stryCov_9fa48("416"), '/api/admin/import-answer-key'), stryMutAct_9fa48("417") ? {} : (stryCov_9fa48("417"), {
              method: stryMutAct_9fa48("418") ? "" : (stryCov_9fa48("418"), 'POST'),
              body: formData
            }));
            const data = await response.json();
            if (stryMutAct_9fa48("421") ? false : stryMutAct_9fa48("420") ? true : stryMutAct_9fa48("419") ? response.ok : (stryCov_9fa48("419", "420", "421"), !response.ok)) {
              if (stryMutAct_9fa48("422")) {
                {}
              } else {
                stryCov_9fa48("422");
                throw new Error(stryMutAct_9fa48("425") ? data.error && 'Error al importar clavijero' : stryMutAct_9fa48("424") ? false : stryMutAct_9fa48("423") ? true : (stryCov_9fa48("423", "424", "425"), data.error || (stryMutAct_9fa48("426") ? "" : (stryCov_9fa48("426"), 'Error al importar clavijero'))));
              }
            }
            setResult(stryMutAct_9fa48("427") ? {} : (stryCov_9fa48("427"), {
              success: stryMutAct_9fa48("428") ? false : (stryCov_9fa48("428"), true),
              message: data.message,
              details: data.details,
              examId: data.examId
            }));

            // Limpiar formulario si fue exitoso
            setPdfFile(null);
            const fileInput = document.getElementById('pdfFile') as HTMLInputElement;
            if (stryMutAct_9fa48("430") ? false : stryMutAct_9fa48("429") ? true : (stryCov_9fa48("429", "430"), fileInput)) {
              if (stryMutAct_9fa48("431")) {
                {}
              } else {
                stryCov_9fa48("431");
                fileInput.value = stryMutAct_9fa48("432") ? "Stryker was here!" : (stryCov_9fa48("432"), '');
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("433")) {
            {}
          } else {
            stryCov_9fa48("433");
            setResult(stryMutAct_9fa48("434") ? {} : (stryCov_9fa48("434"), {
              success: stryMutAct_9fa48("435") ? true : (stryCov_9fa48("435"), false),
              message: stryMutAct_9fa48("436") ? "" : (stryCov_9fa48("436"), 'Error al importar clavijero'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("437") ? "" : (stryCov_9fa48("437"), 'Error desconocido')
            }));
          }
        } finally {
          if (stryMutAct_9fa48("438")) {
            {}
          } else {
            stryCov_9fa48("438");
            setLoading(stryMutAct_9fa48("439") ? true : (stryCov_9fa48("439"), false));
          }
        }
      }
    };
    return <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold">Importar Clavijero</h1>
        <p className="text-muted-foreground mt-2">
          Importa el PDF del clavijero para marcar automáticamente las respuestas correctas del
          examen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subir Clavijero</CardTitle>
          <CardDescription>
            El sistema detectará automáticamente el examen correspondiente por año y asignatura.
            Asegúrate de haber importado el examen primero.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Asignatura */}
          <div className="space-y-2">
            <Label htmlFor="subjectName">Asignatura *</Label>
            <Select value={stryMutAct_9fa48("442") ? subjectName && undefined : stryMutAct_9fa48("441") ? false : stryMutAct_9fa48("440") ? true : (stryCov_9fa48("440", "441", "442"), subjectName || undefined)} onValueChange={setSubjectName}>
              <SelectTrigger id="subjectName">
                <SelectValue placeholder="Selecciona la asignatura" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map(stryMutAct_9fa48("443") ? () => undefined : (stryCov_9fa48("443"), subject => <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* Año */}
          <div className="space-y-2">
            <Label htmlFor="year">Año del Examen *</Label>
            <Input id="year" type="number" min="2000" max="2100" value={year} onChange={stryMutAct_9fa48("444") ? () => undefined : (stryCov_9fa48("444"), e => setYear(e.target.value))} placeholder="Ej: 2026" />
            <p className="text-sm text-muted-foreground">
              El sistema buscará automáticamente el examen de esta asignatura y año.
            </p>
          </div>

          {/* Archivo PDF */}
          <div className="space-y-2">
            <Label htmlFor="pdfFile">Archivo PDF del Clavijero *</Label>
            <div className="flex items-center gap-4">
              <Input id="pdfFile" type="file" accept=".pdf,application/pdf" onChange={handleFileChange} disabled={loading} className="cursor-pointer" />
            </div>
            {stryMutAct_9fa48("447") ? pdfFile || <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>
                  {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div> : stryMutAct_9fa48("446") ? false : stryMutAct_9fa48("445") ? true : (stryCov_9fa48("445", "446", "447"), pdfFile && <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>
                  {pdfFile.name} ({(stryMutAct_9fa48("448") ? pdfFile.size / 1024 * 1024 : (stryCov_9fa48("448"), (stryMutAct_9fa48("449") ? pdfFile.size * 1024 : (stryCov_9fa48("449"), pdfFile.size / 1024)) / 1024)).toFixed(2)} MB)
                </span>
              </div>)}
            <p className="text-sm text-muted-foreground">
              El PDF debe contener las respuestas correctas en formato como "1-A", "2-B", etc.
              Tamaño máximo: 50 MB.
            </p>
          </div>

          {/* Botón de importar */}
          <Button onClick={handleImport} disabled={stryMutAct_9fa48("452") ? (loading || !pdfFile || !subjectName) && !year : stryMutAct_9fa48("451") ? false : stryMutAct_9fa48("450") ? true : (stryCov_9fa48("450", "451", "452"), (stryMutAct_9fa48("454") ? (loading || !pdfFile) && !subjectName : stryMutAct_9fa48("453") ? false : (stryCov_9fa48("453", "454"), (stryMutAct_9fa48("456") ? loading && !pdfFile : stryMutAct_9fa48("455") ? false : (stryCov_9fa48("455", "456"), loading || (stryMutAct_9fa48("457") ? pdfFile : (stryCov_9fa48("457"), !pdfFile)))) || (stryMutAct_9fa48("458") ? subjectName : (stryCov_9fa48("458"), !subjectName)))) || (stryMutAct_9fa48("459") ? year : (stryCov_9fa48("459"), !year)))} className="w-full" size="lg">
            {loading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando clavijero...
              </> : <>
                <Upload className="mr-2 h-4 w-4" />
                Importar Clavijero
              </>}
          </Button>

          {/* Resultados */}
          {stryMutAct_9fa48("462") ? result || <Alert variant={result.success ? 'default' : 'destructive'} className={result.success ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? 'Éxito' : 'Error'}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="font-medium">{result.message}</div>
                {result.details && <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div>}
              </AlertDescription>
            </Alert> : stryMutAct_9fa48("461") ? false : stryMutAct_9fa48("460") ? true : (stryCov_9fa48("460", "461", "462"), result && <Alert variant={result.success ? stryMutAct_9fa48("463") ? "" : (stryCov_9fa48("463"), 'default') : stryMutAct_9fa48("464") ? "" : (stryCov_9fa48("464"), 'destructive')} className={result.success ? stryMutAct_9fa48("465") ? "" : (stryCov_9fa48("465"), 'border-green-500 bg-green-50 dark:bg-green-950/20') : stryMutAct_9fa48("466") ? "Stryker was here!" : (stryCov_9fa48("466"), '')}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? stryMutAct_9fa48("467") ? "" : (stryCov_9fa48("467"), 'Éxito') : stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), 'Error')}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="font-medium">{result.message}</div>
                {stryMutAct_9fa48("471") ? result.details || <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div> : stryMutAct_9fa48("470") ? false : stryMutAct_9fa48("469") ? true : (stryCov_9fa48("469", "470", "471"), result.details && <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div>)}
              </AlertDescription>
            </Alert>)}

          {/* Información adicional */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Información importante</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>El examen debe estar importado antes de importar el clavijero.</li>
                <li>El sistema buscará automáticamente el examen por año y asignatura.</li>
                <li>
                  Si hay múltiples exámenes del mismo año/asignatura, deberás especificar el ID del
                  examen.
                </li>
                <li>
                  El formato del clavijero debe ser similar a: "1-A, 2-B, 3-C..." o "Respuestas:
                  1-A, 2-B..."
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>;
  }
}