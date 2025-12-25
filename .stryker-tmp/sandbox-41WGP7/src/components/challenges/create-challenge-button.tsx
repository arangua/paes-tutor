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
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
import { captureError } from '@/lib/monitoring';
import { TIME_CONSTANTS } from '@/lib/constants';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface CreateChallengeButtonProps {
  examId?: string;
  examTitle?: string;
  onChallengeCreated?: () => void;
}
export function CreateChallengeButton({
  examId,
  examTitle,
  onChallengeCreated
}: CreateChallengeButtonProps) {
  if (stryMutAct_9fa48("16069")) {
    {}
  } else {
    stryCov_9fa48("16069");
    const [open, setOpen] = useState(stryMutAct_9fa48("16070") ? true : (stryCov_9fa48("16070"), false));
    const [message, setMessage] = useState(stryMutAct_9fa48("16071") ? "Stryker was here!" : (stryCov_9fa48("16071"), ''));
    const [selectedExamId, setSelectedExamId] = useState<string>(stryMutAct_9fa48("16074") ? examId && '' : stryMutAct_9fa48("16073") ? false : stryMutAct_9fa48("16072") ? true : (stryCov_9fa48("16072", "16073", "16074"), examId || (stryMutAct_9fa48("16075") ? "Stryker was here!" : (stryCov_9fa48("16075"), ''))));
    const [exams, setExams] = useState<Array<{
      id: string;
      titulo: string;
    }>>(stryMutAct_9fa48("16076") ? ["Stryker was here"] : (stryCov_9fa48("16076"), []));
    const [loadingExams, setLoadingExams] = useState(stryMutAct_9fa48("16077") ? true : (stryCov_9fa48("16077"), false));
    const [loading, setLoading] = useState(stryMutAct_9fa48("16078") ? true : (stryCov_9fa48("16078"), false));
    const [created, setCreated] = useState(stryMutAct_9fa48("16079") ? true : (stryCov_9fa48("16079"), false));
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Limpiar timeout al desmontar
    useEffect(() => {
      if (stryMutAct_9fa48("16080")) {
        {}
      } else {
        stryCov_9fa48("16080");
        return () => {
          if (stryMutAct_9fa48("16081")) {
            {}
          } else {
            stryCov_9fa48("16081");
            if (stryMutAct_9fa48("16083") ? false : stryMutAct_9fa48("16082") ? true : (stryCov_9fa48("16082", "16083"), closeTimeoutRef.current)) {
              if (stryMutAct_9fa48("16084")) {
                {}
              } else {
                stryCov_9fa48("16084");
                clearTimeout(closeTimeoutRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("16085") ? ["Stryker was here"] : (stryCov_9fa48("16085"), []));

    // Cargar exámenes cuando se abre el diálogo
    const loadExams = async () => {
      if (stryMutAct_9fa48("16086")) {
        {}
      } else {
        stryCov_9fa48("16086");
        if (stryMutAct_9fa48("16090") ? exams.length <= 0 : stryMutAct_9fa48("16089") ? exams.length >= 0 : stryMutAct_9fa48("16088") ? false : stryMutAct_9fa48("16087") ? true : (stryCov_9fa48("16087", "16088", "16089", "16090"), exams.length > 0)) return; // Ya están cargados

        try {
          if (stryMutAct_9fa48("16091")) {
            {}
          } else {
            stryCov_9fa48("16091");
            setLoadingExams(stryMutAct_9fa48("16092") ? false : (stryCov_9fa48("16092"), true));
            const res = await fetch(stryMutAct_9fa48("16093") ? "" : (stryCov_9fa48("16093"), '/api/exams?limit=50'));
            if (stryMutAct_9fa48("16096") ? false : stryMutAct_9fa48("16095") ? true : stryMutAct_9fa48("16094") ? res.ok : (stryCov_9fa48("16094", "16095", "16096"), !res.ok)) throw new Error(stryMutAct_9fa48("16097") ? "" : (stryCov_9fa48("16097"), 'Error al cargar exámenes'));
            const data = await res.json();
            setExams(stryMutAct_9fa48("16100") ? data.exams && [] : stryMutAct_9fa48("16099") ? false : stryMutAct_9fa48("16098") ? true : (stryCov_9fa48("16098", "16099", "16100"), data.exams || (stryMutAct_9fa48("16101") ? ["Stryker was here"] : (stryCov_9fa48("16101"), []))));
          }
        } catch (error) {
          if (stryMutAct_9fa48("16102")) {
            {}
          } else {
            stryCov_9fa48("16102");
            toast.error(stryMutAct_9fa48("16103") ? "" : (stryCov_9fa48("16103"), 'Error al cargar exámenes'));
          }
        } finally {
          if (stryMutAct_9fa48("16104")) {
            {}
          } else {
            stryCov_9fa48("16104");
            setLoadingExams(stryMutAct_9fa48("16105") ? true : (stryCov_9fa48("16105"), false));
          }
        }
      }
    };
    const handleOpenChange = (isOpen: boolean) => {
      if (stryMutAct_9fa48("16106")) {
        {}
      } else {
        stryCov_9fa48("16106");
        setOpen(isOpen);
        if (stryMutAct_9fa48("16109") ? isOpen || !examId : stryMutAct_9fa48("16108") ? false : stryMutAct_9fa48("16107") ? true : (stryCov_9fa48("16107", "16108", "16109"), isOpen && (stryMutAct_9fa48("16110") ? examId : (stryCov_9fa48("16110"), !examId)))) {
          if (stryMutAct_9fa48("16111")) {
            {}
          } else {
            stryCov_9fa48("16111");
            loadExams();
          }
        }
      }
    };
    const handleCreate = async () => {
      if (stryMutAct_9fa48("16112")) {
        {}
      } else {
        stryCov_9fa48("16112");
        if (stryMutAct_9fa48("16115") ? !selectedExamId || !examId : stryMutAct_9fa48("16114") ? false : stryMutAct_9fa48("16113") ? true : (stryCov_9fa48("16113", "16114", "16115"), (stryMutAct_9fa48("16116") ? selectedExamId : (stryCov_9fa48("16116"), !selectedExamId)) && (stryMutAct_9fa48("16117") ? examId : (stryCov_9fa48("16117"), !examId)))) {
          if (stryMutAct_9fa48("16118")) {
            {}
          } else {
            stryCov_9fa48("16118");
            toast.error(stryMutAct_9fa48("16119") ? "" : (stryCov_9fa48("16119"), 'Debes seleccionar un examen'));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("16120")) {
            {}
          } else {
            stryCov_9fa48("16120");
            setLoading(stryMutAct_9fa48("16121") ? false : (stryCov_9fa48("16121"), true));
            const res = await fetch(stryMutAct_9fa48("16122") ? "" : (stryCov_9fa48("16122"), '/api/challenges'), stryMutAct_9fa48("16123") ? {} : (stryCov_9fa48("16123"), {
              method: stryMutAct_9fa48("16124") ? "" : (stryCov_9fa48("16124"), 'POST'),
              headers: stryMutAct_9fa48("16125") ? {} : (stryCov_9fa48("16125"), {
                'Content-Type': stryMutAct_9fa48("16126") ? "" : (stryCov_9fa48("16126"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("16127") ? {} : (stryCov_9fa48("16127"), {
                examId: stryMutAct_9fa48("16130") ? selectedExamId && examId : stryMutAct_9fa48("16129") ? false : stryMutAct_9fa48("16128") ? true : (stryCov_9fa48("16128", "16129", "16130"), selectedExamId || examId),
                message: stryMutAct_9fa48("16133") ? message.trim() && undefined : stryMutAct_9fa48("16132") ? false : stryMutAct_9fa48("16131") ? true : (stryCov_9fa48("16131", "16132", "16133"), (stryMutAct_9fa48("16134") ? message : (stryCov_9fa48("16134"), message.trim())) || undefined)
              }))
            }));
            if (stryMutAct_9fa48("16137") ? false : stryMutAct_9fa48("16136") ? true : stryMutAct_9fa48("16135") ? res.ok : (stryCov_9fa48("16135", "16136", "16137"), !res.ok)) {
              if (stryMutAct_9fa48("16138")) {
                {}
              } else {
                stryCov_9fa48("16138");
                const data = await res.json();
                throw new Error(stryMutAct_9fa48("16141") ? data.error && 'Error al crear desafío' : stryMutAct_9fa48("16140") ? false : stryMutAct_9fa48("16139") ? true : (stryCov_9fa48("16139", "16140", "16141"), data.error || (stryMutAct_9fa48("16142") ? "" : (stryCov_9fa48("16142"), 'Error al crear desafío'))));
              }
            }
            setCreated(stryMutAct_9fa48("16143") ? false : (stryCov_9fa48("16143"), true));
            toast.success(stryMutAct_9fa48("16144") ? "" : (stryCov_9fa48("16144"), 'Desafío creado exitosamente'), stryMutAct_9fa48("16145") ? {} : (stryCov_9fa48("16145"), {
              description: stryMutAct_9fa48("16146") ? "" : (stryCov_9fa48("16146"), 'El otro estudiante recibirá una notificación y podrá aceptar o rechazar el desafío.')
            }));
            // Limpiar timeout anterior si existe
            if (stryMutAct_9fa48("16148") ? false : stryMutAct_9fa48("16147") ? true : (stryCov_9fa48("16147", "16148"), closeTimeoutRef.current)) {
              if (stryMutAct_9fa48("16149")) {
                {}
              } else {
                stryCov_9fa48("16149");
                clearTimeout(closeTimeoutRef.current);
              }
            }
            closeTimeoutRef.current = setTimeout(() => {
              if (stryMutAct_9fa48("16150")) {
                {}
              } else {
                stryCov_9fa48("16150");
                setOpen(stryMutAct_9fa48("16151") ? true : (stryCov_9fa48("16151"), false));
                setMessage(stryMutAct_9fa48("16152") ? "Stryker was here!" : (stryCov_9fa48("16152"), ''));
                setCreated(stryMutAct_9fa48("16153") ? true : (stryCov_9fa48("16153"), false));
                stryMutAct_9fa48("16154") ? onChallengeCreated() : (stryCov_9fa48("16154"), onChallengeCreated?.());
              }
            }, TIME_CONSTANTS.ONE_SECOND_MS);
          }
        } catch (error) {
          if (stryMutAct_9fa48("16155")) {
            {}
          } else {
            stryCov_9fa48("16155");
            const errorInfo = extractErrorInfo(error);
            const structuredError = getErrorMessage(ERROR_CODES.DATA_CREATE_FAILED, stryMutAct_9fa48("16156") ? {} : (stryCov_9fa48("16156"), {
              item: stryMutAct_9fa48("16157") ? "" : (stryCov_9fa48("16157"), 'el desafío'),
              reason: errorInfo.message
            }));
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("16158") ? {} : (stryCov_9fa48("16158"), {
              type: stryMutAct_9fa48("16159") ? "" : (stryCov_9fa48("16159"), 'challenge_error'),
              action: stryMutAct_9fa48("16160") ? "" : (stryCov_9fa48("16160"), 'create'),
              examId: stryMutAct_9fa48("16163") ? selectedExamId && examId : stryMutAct_9fa48("16162") ? false : stryMutAct_9fa48("16161") ? true : (stryCov_9fa48("16161", "16162", "16163"), selectedExamId || examId)
            }));
            toast.error(structuredError.title, stryMutAct_9fa48("16164") ? {} : (stryCov_9fa48("16164"), {
              description: stryMutAct_9fa48("16165") ? `` : (stryCov_9fa48("16165"), `${structuredError.description} ${structuredError.solution}`),
              duration: 6000
            }));
          }
        } finally {
          if (stryMutAct_9fa48("16166")) {
            {}
          } else {
            stryCov_9fa48("16166");
            setLoading(stryMutAct_9fa48("16167") ? true : (stryCov_9fa48("16167"), false));
          }
        }
      }
    };
    return <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Trophy className="h-4 w-4" />
          Desafiar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Desafío</DialogTitle>
          <DialogDescription>
            Desafía al otro estudiante a realizar {examTitle ? stryMutAct_9fa48("16168") ? `` : (stryCov_9fa48("16168"), `"${examTitle}"`) : stryMutAct_9fa48("16169") ? "" : (stryCov_9fa48("16169"), 'un examen')}.
            Ambos realizarán el mismo examen y se compararán los resultados.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {stryMutAct_9fa48("16172") ? !examId || <div>
              <Label htmlFor="exam">Examen *</Label>
              {loadingExams ? <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div> : <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecciona un examen" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map(exam => <SelectItem key={exam.id} value={exam.id}>
                        {exam.titulo}
                      </SelectItem>)}
                  </SelectContent>
                </Select>}
            </div> : stryMutAct_9fa48("16171") ? false : stryMutAct_9fa48("16170") ? true : (stryCov_9fa48("16170", "16171", "16172"), (stryMutAct_9fa48("16173") ? examId : (stryCov_9fa48("16173"), !examId)) && <div>
              <Label htmlFor="exam">Examen *</Label>
              {loadingExams ? <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div> : <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecciona un examen" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map(stryMutAct_9fa48("16174") ? () => undefined : (stryCov_9fa48("16174"), exam => <SelectItem key={exam.id} value={exam.id}>
                        {exam.titulo}
                      </SelectItem>))}
                  </SelectContent>
                </Select>}
            </div>)}
          <div>
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea id="message" placeholder="Agrega un mensaje motivador..." value={message} onChange={stryMutAct_9fa48("16175") ? () => undefined : (stryCov_9fa48("16175"), e => setMessage(e.target.value))} rows={3} className="mt-2" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={stryMutAct_9fa48("16176") ? () => undefined : (stryCov_9fa48("16176"), () => setOpen(stryMutAct_9fa48("16177") ? true : (stryCov_9fa48("16177"), false)))} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={stryMutAct_9fa48("16180") ? (loading || created) && !selectedExamId && !examId : stryMutAct_9fa48("16179") ? false : stryMutAct_9fa48("16178") ? true : (stryCov_9fa48("16178", "16179", "16180"), (stryMutAct_9fa48("16182") ? loading && created : stryMutAct_9fa48("16181") ? false : (stryCov_9fa48("16181", "16182"), loading || created)) || (stryMutAct_9fa48("16184") ? !selectedExamId || !examId : stryMutAct_9fa48("16183") ? false : (stryCov_9fa48("16183", "16184"), (stryMutAct_9fa48("16185") ? selectedExamId : (stryCov_9fa48("16185"), !selectedExamId)) && (stryMutAct_9fa48("16186") ? examId : (stryCov_9fa48("16186"), !examId)))))}>
            {loading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </> : created ? <>
                <Check className="h-4 w-4 mr-2" />
                Creado
              </> : <>
                <Trophy className="h-4 w-4 mr-2" />
                Crear Desafío
              </>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
  }
}