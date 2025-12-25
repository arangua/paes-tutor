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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressStep } from '@/hooks/useProgressTracker';
interface ProgressDialogProps {
  open: boolean;
  title: string;
  description?: string;
  progress: number;
  current: number;
  total: number;
  message: string;
  steps?: ProgressStep[];
  estimatedTimeRemaining?: number | null;
  onCancel?: () => void;
}
function formatTime(seconds: number): string {
  if (stryMutAct_9fa48("20926")) {
    {}
  } else {
    stryCov_9fa48("20926");
    if (stryMutAct_9fa48("20930") ? seconds >= 60 : stryMutAct_9fa48("20929") ? seconds <= 60 : stryMutAct_9fa48("20928") ? false : stryMutAct_9fa48("20927") ? true : (stryCov_9fa48("20927", "20928", "20929", "20930"), seconds < 60)) return stryMutAct_9fa48("20931") ? `` : (stryCov_9fa48("20931"), `${seconds}s`);
    const mins = Math.floor(stryMutAct_9fa48("20932") ? seconds * 60 : (stryCov_9fa48("20932"), seconds / 60));
    const secs = stryMutAct_9fa48("20933") ? seconds * 60 : (stryCov_9fa48("20933"), seconds % 60);
    return stryMutAct_9fa48("20934") ? `` : (stryCov_9fa48("20934"), `${mins}m ${secs}s`);
  }
}
export function ProgressDialog({
  open,
  title,
  description,
  progress,
  current,
  total,
  message,
  steps = stryMutAct_9fa48("20935") ? ["Stryker was here"] : (stryCov_9fa48("20935"), []),
  estimatedTimeRemaining,
  onCancel
}: ProgressDialogProps) {
  if (stryMutAct_9fa48("20936")) {
    {}
  } else {
    stryCov_9fa48("20936");
    return <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {stryMutAct_9fa48("20939") ? description || <DialogDescription>{description}</DialogDescription> : stryMutAct_9fa48("20938") ? false : stryMutAct_9fa48("20937") ? true : (stryCov_9fa48("20937", "20938", "20939"), description && <DialogDescription>{description}</DialogDescription>)}
        </DialogHeader>

        <div className="space-y-4">
          {/* Barra de progreso principal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">{message}</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2.5" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {current} de {total} {(stryMutAct_9fa48("20942") ? total !== 1 : stryMutAct_9fa48("20941") ? false : stryMutAct_9fa48("20940") ? true : (stryCov_9fa48("20940", "20941", "20942"), total === 1)) ? stryMutAct_9fa48("20943") ? "" : (stryCov_9fa48("20943"), 'elemento') : stryMutAct_9fa48("20944") ? "" : (stryCov_9fa48("20944"), 'elementos')}
              </span>
              {stryMutAct_9fa48("20947") ? estimatedTimeRemaining !== null && estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 || <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Tiempo estimado: {formatTime(estimatedTimeRemaining)}
                </span> : stryMutAct_9fa48("20946") ? false : stryMutAct_9fa48("20945") ? true : (stryCov_9fa48("20945", "20946", "20947"), (stryMutAct_9fa48("20949") ? estimatedTimeRemaining !== null && estimatedTimeRemaining !== undefined || estimatedTimeRemaining > 0 : stryMutAct_9fa48("20948") ? true : (stryCov_9fa48("20948", "20949"), (stryMutAct_9fa48("20951") ? estimatedTimeRemaining !== null || estimatedTimeRemaining !== undefined : stryMutAct_9fa48("20950") ? true : (stryCov_9fa48("20950", "20951"), (stryMutAct_9fa48("20953") ? estimatedTimeRemaining === null : stryMutAct_9fa48("20952") ? true : (stryCov_9fa48("20952", "20953"), estimatedTimeRemaining !== null)) && (stryMutAct_9fa48("20955") ? estimatedTimeRemaining === undefined : stryMutAct_9fa48("20954") ? true : (stryCov_9fa48("20954", "20955"), estimatedTimeRemaining !== undefined)))) && (stryMutAct_9fa48("20958") ? estimatedTimeRemaining <= 0 : stryMutAct_9fa48("20957") ? estimatedTimeRemaining >= 0 : stryMutAct_9fa48("20956") ? true : (stryCov_9fa48("20956", "20957", "20958"), estimatedTimeRemaining > 0)))) && <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Tiempo estimado: {formatTime(estimatedTimeRemaining)}
                </span>)}
            </div>
          </div>

          {/* Pasos detallados */}
          {stryMutAct_9fa48("20961") ? steps.length > 0 || <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3 bg-muted/30">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Progreso detallado:</div>
              {steps.map((step, idx) => <div key={step.id} className={cn('flex items-center gap-2 text-sm', step.status === 'completed' && 'text-green-600 dark:text-green-400', step.status === 'error' && 'text-destructive', step.status === 'processing' && 'text-primary font-medium', step.status === 'pending' && 'text-muted-foreground')}>
                  {step.status === 'completed' && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
                  {step.status === 'processing' && <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />}
                  {step.status === 'error' && <XCircle className="h-4 w-4 flex-shrink-0" />}
                  {step.status === 'pending' && <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground" />}
                  <span className="flex-1 truncate">{step.label}</span>
                  {step.error && <span className="text-xs text-destructive ml-2 truncate max-w-[200px]">{step.error}</span>}
                </div>)}
            </div> : stryMutAct_9fa48("20960") ? false : stryMutAct_9fa48("20959") ? true : (stryCov_9fa48("20959", "20960", "20961"), (stryMutAct_9fa48("20964") ? steps.length <= 0 : stryMutAct_9fa48("20963") ? steps.length >= 0 : stryMutAct_9fa48("20962") ? true : (stryCov_9fa48("20962", "20963", "20964"), steps.length > 0)) && <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3 bg-muted/30">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Progreso detallado:</div>
              {steps.map(stryMutAct_9fa48("20965") ? () => undefined : (stryCov_9fa48("20965"), (step, idx) => <div key={step.id} className={cn(stryMutAct_9fa48("20966") ? "" : (stryCov_9fa48("20966"), 'flex items-center gap-2 text-sm'), stryMutAct_9fa48("20969") ? step.status === 'completed' || 'text-green-600 dark:text-green-400' : stryMutAct_9fa48("20968") ? false : stryMutAct_9fa48("20967") ? true : (stryCov_9fa48("20967", "20968", "20969"), (stryMutAct_9fa48("20971") ? step.status !== 'completed' : stryMutAct_9fa48("20970") ? true : (stryCov_9fa48("20970", "20971"), step.status === (stryMutAct_9fa48("20972") ? "" : (stryCov_9fa48("20972"), 'completed')))) && (stryMutAct_9fa48("20973") ? "" : (stryCov_9fa48("20973"), 'text-green-600 dark:text-green-400'))), stryMutAct_9fa48("20976") ? step.status === 'error' || 'text-destructive' : stryMutAct_9fa48("20975") ? false : stryMutAct_9fa48("20974") ? true : (stryCov_9fa48("20974", "20975", "20976"), (stryMutAct_9fa48("20978") ? step.status !== 'error' : stryMutAct_9fa48("20977") ? true : (stryCov_9fa48("20977", "20978"), step.status === (stryMutAct_9fa48("20979") ? "" : (stryCov_9fa48("20979"), 'error')))) && (stryMutAct_9fa48("20980") ? "" : (stryCov_9fa48("20980"), 'text-destructive'))), stryMutAct_9fa48("20983") ? step.status === 'processing' || 'text-primary font-medium' : stryMutAct_9fa48("20982") ? false : stryMutAct_9fa48("20981") ? true : (stryCov_9fa48("20981", "20982", "20983"), (stryMutAct_9fa48("20985") ? step.status !== 'processing' : stryMutAct_9fa48("20984") ? true : (stryCov_9fa48("20984", "20985"), step.status === (stryMutAct_9fa48("20986") ? "" : (stryCov_9fa48("20986"), 'processing')))) && (stryMutAct_9fa48("20987") ? "" : (stryCov_9fa48("20987"), 'text-primary font-medium'))), stryMutAct_9fa48("20990") ? step.status === 'pending' || 'text-muted-foreground' : stryMutAct_9fa48("20989") ? false : stryMutAct_9fa48("20988") ? true : (stryCov_9fa48("20988", "20989", "20990"), (stryMutAct_9fa48("20992") ? step.status !== 'pending' : stryMutAct_9fa48("20991") ? true : (stryCov_9fa48("20991", "20992"), step.status === (stryMutAct_9fa48("20993") ? "" : (stryCov_9fa48("20993"), 'pending')))) && (stryMutAct_9fa48("20994") ? "" : (stryCov_9fa48("20994"), 'text-muted-foreground'))))}>
                  {stryMutAct_9fa48("20997") ? step.status === 'completed' || <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : stryMutAct_9fa48("20996") ? false : stryMutAct_9fa48("20995") ? true : (stryCov_9fa48("20995", "20996", "20997"), (stryMutAct_9fa48("20999") ? step.status !== 'completed' : stryMutAct_9fa48("20998") ? true : (stryCov_9fa48("20998", "20999"), step.status === (stryMutAct_9fa48("21000") ? "" : (stryCov_9fa48("21000"), 'completed')))) && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />)}
                  {stryMutAct_9fa48("21003") ? step.status === 'processing' || <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" /> : stryMutAct_9fa48("21002") ? false : stryMutAct_9fa48("21001") ? true : (stryCov_9fa48("21001", "21002", "21003"), (stryMutAct_9fa48("21005") ? step.status !== 'processing' : stryMutAct_9fa48("21004") ? true : (stryCov_9fa48("21004", "21005"), step.status === (stryMutAct_9fa48("21006") ? "" : (stryCov_9fa48("21006"), 'processing')))) && <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />)}
                  {stryMutAct_9fa48("21009") ? step.status === 'error' || <XCircle className="h-4 w-4 flex-shrink-0" /> : stryMutAct_9fa48("21008") ? false : stryMutAct_9fa48("21007") ? true : (stryCov_9fa48("21007", "21008", "21009"), (stryMutAct_9fa48("21011") ? step.status !== 'error' : stryMutAct_9fa48("21010") ? true : (stryCov_9fa48("21010", "21011"), step.status === (stryMutAct_9fa48("21012") ? "" : (stryCov_9fa48("21012"), 'error')))) && <XCircle className="h-4 w-4 flex-shrink-0" />)}
                  {stryMutAct_9fa48("21015") ? step.status === 'pending' || <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground" /> : stryMutAct_9fa48("21014") ? false : stryMutAct_9fa48("21013") ? true : (stryCov_9fa48("21013", "21014", "21015"), (stryMutAct_9fa48("21017") ? step.status !== 'pending' : stryMutAct_9fa48("21016") ? true : (stryCov_9fa48("21016", "21017"), step.status === (stryMutAct_9fa48("21018") ? "" : (stryCov_9fa48("21018"), 'pending')))) && <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground" />)}
                  <span className="flex-1 truncate">{step.label}</span>
                  {stryMutAct_9fa48("21021") ? step.error || <span className="text-xs text-destructive ml-2 truncate max-w-[200px]">{step.error}</span> : stryMutAct_9fa48("21020") ? false : stryMutAct_9fa48("21019") ? true : (stryCov_9fa48("21019", "21020", "21021"), step.error && <span className="text-xs text-destructive ml-2 truncate max-w-[200px]">{step.error}</span>)}
                </div>))}
            </div>)}
        </div>

        {stryMutAct_9fa48("21024") ? onCancel || <div className="flex justify-end pt-2 border-t">
            <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Cancelar operación">
              Cancelar
            </button>
          </div> : stryMutAct_9fa48("21023") ? false : stryMutAct_9fa48("21022") ? true : (stryCov_9fa48("21022", "21023", "21024"), onCancel && <div className="flex justify-end pt-2 border-t">
            <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Cancelar operación">
              Cancelar
            </button>
          </div>)}
      </DialogContent>
    </Dialog>;
  }
}