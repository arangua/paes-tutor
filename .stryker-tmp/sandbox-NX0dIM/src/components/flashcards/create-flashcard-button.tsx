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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
import { captureError } from '@/lib/monitoring';
interface CreateFlashcardButtonProps {
  questionId?: string;
  defaultFront?: string;
  defaultBack?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}
export function CreateFlashcardButton({
  questionId,
  defaultFront = stryMutAct_9fa48("17401") ? "Stryker was here!" : (stryCov_9fa48("17401"), ''),
  defaultBack = stryMutAct_9fa48("17402") ? "Stryker was here!" : (stryCov_9fa48("17402"), ''),
  variant = stryMutAct_9fa48("17403") ? "" : (stryCov_9fa48("17403"), 'ghost'),
  size = stryMutAct_9fa48("17404") ? "" : (stryCov_9fa48("17404"), 'sm')
}: CreateFlashcardButtonProps) {
  if (stryMutAct_9fa48("17405")) {
    {}
  } else {
    stryCov_9fa48("17405");
    const [open, setOpen] = useState(stryMutAct_9fa48("17406") ? true : (stryCov_9fa48("17406"), false));
    const [front, setFront] = useState(defaultFront);
    const [back, setBack] = useState(defaultBack);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("17407") ? true : (stryCov_9fa48("17407"), false));
    const handleCreate = async () => {
      if (stryMutAct_9fa48("17408")) {
        {}
      } else {
        stryCov_9fa48("17408");
        if (stryMutAct_9fa48("17411") ? !front.trim() && !back.trim() : stryMutAct_9fa48("17410") ? false : stryMutAct_9fa48("17409") ? true : (stryCov_9fa48("17409", "17410", "17411"), (stryMutAct_9fa48("17412") ? front.trim() : (stryCov_9fa48("17412"), !(stryMutAct_9fa48("17413") ? front : (stryCov_9fa48("17413"), front.trim())))) || (stryMutAct_9fa48("17414") ? back.trim() : (stryCov_9fa48("17414"), !(stryMutAct_9fa48("17415") ? back : (stryCov_9fa48("17415"), back.trim())))))) {
          if (stryMutAct_9fa48("17416")) {
            {}
          } else {
            stryCov_9fa48("17416");
            toast.error(stryMutAct_9fa48("17417") ? "" : (stryCov_9fa48("17417"), 'Por favor completa ambos campos'));
            return;
          }
        }
        setIsLoading(stryMutAct_9fa48("17418") ? false : (stryCov_9fa48("17418"), true));
        try {
          if (stryMutAct_9fa48("17419")) {
            {}
          } else {
            stryCov_9fa48("17419");
            const res = await fetch(stryMutAct_9fa48("17420") ? "" : (stryCov_9fa48("17420"), '/api/flashcards'), stryMutAct_9fa48("17421") ? {} : (stryCov_9fa48("17421"), {
              method: stryMutAct_9fa48("17422") ? "" : (stryCov_9fa48("17422"), 'POST'),
              headers: stryMutAct_9fa48("17423") ? {} : (stryCov_9fa48("17423"), {
                'Content-Type': stryMutAct_9fa48("17424") ? "" : (stryCov_9fa48("17424"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("17425") ? {} : (stryCov_9fa48("17425"), {
                questionId: stryMutAct_9fa48("17428") ? questionId && undefined : stryMutAct_9fa48("17427") ? false : stryMutAct_9fa48("17426") ? true : (stryCov_9fa48("17426", "17427", "17428"), questionId || undefined),
                front: stryMutAct_9fa48("17429") ? front : (stryCov_9fa48("17429"), front.trim()),
                back: stryMutAct_9fa48("17430") ? back : (stryCov_9fa48("17430"), back.trim())
              }))
            }));
            if (stryMutAct_9fa48("17433") ? false : stryMutAct_9fa48("17432") ? true : stryMutAct_9fa48("17431") ? res.ok : (stryCov_9fa48("17431", "17432", "17433"), !res.ok)) {
              if (stryMutAct_9fa48("17434")) {
                {}
              } else {
                stryCov_9fa48("17434");
                const {
                  safeJsonParse
                } = await import(stryMutAct_9fa48("17435") ? "" : (stryCov_9fa48("17435"), '@/lib/api-helpers'));
                const errorData = await safeJsonParse<{
                  error?: string;
                }>(res, stryMutAct_9fa48("17436") ? {} : (stryCov_9fa48("17436"), {
                  path: (stryMutAct_9fa48("17439") ? typeof window === 'undefined' : stryMutAct_9fa48("17438") ? false : stryMutAct_9fa48("17437") ? true : (stryCov_9fa48("17437", "17438", "17439"), typeof window !== (stryMutAct_9fa48("17440") ? "" : (stryCov_9fa48("17440"), 'undefined')))) ? window.location.pathname : stryMutAct_9fa48("17441") ? "" : (stryCov_9fa48("17441"), '/flashcards'),
                  operation: stryMutAct_9fa48("17442") ? "" : (stryCov_9fa48("17442"), 'crear flashcard')
                }));
                throw new Error(stryMutAct_9fa48("17445") ? errorData.error && 'Error al crear flashcard' : stryMutAct_9fa48("17444") ? false : stryMutAct_9fa48("17443") ? true : (stryCov_9fa48("17443", "17444", "17445"), errorData.error || (stryMutAct_9fa48("17446") ? "" : (stryCov_9fa48("17446"), 'Error al crear flashcard'))));
              }
            }
            toast.success(stryMutAct_9fa48("17447") ? "" : (stryCov_9fa48("17447"), 'Flashcard creada correctamente'));
            setOpen(stryMutAct_9fa48("17448") ? true : (stryCov_9fa48("17448"), false));
            setFront(stryMutAct_9fa48("17449") ? "Stryker was here!" : (stryCov_9fa48("17449"), ''));
            setBack(stryMutAct_9fa48("17450") ? "Stryker was here!" : (stryCov_9fa48("17450"), ''));
          }
        } catch (error) {
          if (stryMutAct_9fa48("17451")) {
            {}
          } else {
            stryCov_9fa48("17451");
            const errorInfo = extractErrorInfo(error);
            const structuredError = getErrorMessage(ERROR_CODES.DATA_CREATE_FAILED, stryMutAct_9fa48("17452") ? {} : (stryCov_9fa48("17452"), {
              item: stryMutAct_9fa48("17453") ? "" : (stryCov_9fa48("17453"), 'la flashcard'),
              reason: errorInfo.message
            }));
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("17454") ? {} : (stryCov_9fa48("17454"), {
              type: stryMutAct_9fa48("17455") ? "" : (stryCov_9fa48("17455"), 'flashcard_error'),
              action: stryMutAct_9fa48("17456") ? "" : (stryCov_9fa48("17456"), 'create'),
              questionId
            }));
            toast.error(structuredError.title, stryMutAct_9fa48("17457") ? {} : (stryCov_9fa48("17457"), {
              description: stryMutAct_9fa48("17458") ? `` : (stryCov_9fa48("17458"), `${structuredError.description} ${structuredError.solution}`),
              duration: 6000
            }));
          }
        } finally {
          if (stryMutAct_9fa48("17459")) {
            {}
          } else {
            stryCov_9fa48("17459");
            setIsLoading(stryMutAct_9fa48("17460") ? true : (stryCov_9fa48("17460"), false));
          }
        }
      }
    };
    return <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} size={size} onClick={stryMutAct_9fa48("17461") ? () => undefined : (stryCov_9fa48("17461"), () => setOpen(stryMutAct_9fa48("17462") ? false : (stryCov_9fa48("17462"), true)))} aria-label="Crear flashcard">
            <Plus className="h-4 w-4 mr-2" />
            Crear Flashcard
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Crear flashcard</strong>
            <br />
            <span className="text-muted-foreground text-xs">
              Como las tarjetas de estudio físicas. Crea preguntas y respuestas para memorizar
              mejor, igual que Anki o Quizlet.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Flashcard</DialogTitle>
            <DialogDescription>
              Crea una tarjeta de estudio para memorizar conceptos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="front">Anverso (Pregunta/Concepto)</Label>
              <Textarea id="front" value={front} onChange={stryMutAct_9fa48("17463") ? () => undefined : (stryCov_9fa48("17463"), e => setFront(e.target.value))} placeholder="Escribe la pregunta o concepto aquí..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="back">Reverso (Respuesta/Explicación)</Label>
              <Textarea id="back" value={back} onChange={stryMutAct_9fa48("17464") ? () => undefined : (stryCov_9fa48("17464"), e => setBack(e.target.value))} placeholder="Escribe la respuesta o explicación aquí..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={stryMutAct_9fa48("17465") ? () => undefined : (stryCov_9fa48("17465"), () => setOpen(stryMutAct_9fa48("17466") ? true : (stryCov_9fa48("17466"), false)))}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </> : stryMutAct_9fa48("17467") ? "" : (stryCov_9fa48("17467"), 'Crear')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
  }
}