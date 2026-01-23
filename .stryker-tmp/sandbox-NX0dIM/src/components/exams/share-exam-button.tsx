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
import { Share2, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
interface ShareExamButtonProps {
  examId: string;
  examTitle: string;
  onShared?: () => void;
}
export function ShareExamButton({
  examId,
  examTitle,
  onShared
}: ShareExamButtonProps) {
  if (stryMutAct_9fa48("17279")) {
    {}
  } else {
    stryCov_9fa48("17279");
    const [open, setOpen] = useState(stryMutAct_9fa48("17280") ? true : (stryCov_9fa48("17280"), false));
    const [message, setMessage] = useState(stryMutAct_9fa48("17281") ? "Stryker was here!" : (stryCov_9fa48("17281"), ''));
    const [loading, setLoading] = useState(stryMutAct_9fa48("17282") ? true : (stryCov_9fa48("17282"), false));
    const [shared, setShared] = useState(stryMutAct_9fa48("17283") ? true : (stryCov_9fa48("17283"), false));
    const handleShare = async () => {
      if (stryMutAct_9fa48("17284")) {
        {}
      } else {
        stryCov_9fa48("17284");
        try {
          if (stryMutAct_9fa48("17285")) {
            {}
          } else {
            stryCov_9fa48("17285");
            setLoading(stryMutAct_9fa48("17286") ? false : (stryCov_9fa48("17286"), true));
            const res = await fetch(stryMutAct_9fa48("17287") ? "" : (stryCov_9fa48("17287"), '/api/shared-exams'), stryMutAct_9fa48("17288") ? {} : (stryCov_9fa48("17288"), {
              method: stryMutAct_9fa48("17289") ? "" : (stryCov_9fa48("17289"), 'POST'),
              headers: stryMutAct_9fa48("17290") ? {} : (stryCov_9fa48("17290"), {
                'Content-Type': stryMutAct_9fa48("17291") ? "" : (stryCov_9fa48("17291"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("17292") ? {} : (stryCov_9fa48("17292"), {
                examId,
                message: stryMutAct_9fa48("17295") ? message.trim() && undefined : stryMutAct_9fa48("17294") ? false : stryMutAct_9fa48("17293") ? true : (stryCov_9fa48("17293", "17294", "17295"), (stryMutAct_9fa48("17296") ? message : (stryCov_9fa48("17296"), message.trim())) || undefined)
              }))
            }));
            if (stryMutAct_9fa48("17299") ? false : stryMutAct_9fa48("17298") ? true : stryMutAct_9fa48("17297") ? res.ok : (stryCov_9fa48("17297", "17298", "17299"), !res.ok)) {
              if (stryMutAct_9fa48("17300")) {
                {}
              } else {
                stryCov_9fa48("17300");
                const data = await res.json();
                throw new Error(stryMutAct_9fa48("17303") ? data.error && 'Error al compartir examen' : stryMutAct_9fa48("17302") ? false : stryMutAct_9fa48("17301") ? true : (stryCov_9fa48("17301", "17302", "17303"), data.error || (stryMutAct_9fa48("17304") ? "" : (stryCov_9fa48("17304"), 'Error al compartir examen'))));
              }
            }
            setShared(stryMutAct_9fa48("17305") ? false : (stryCov_9fa48("17305"), true));
            toast.success(stryMutAct_9fa48("17306") ? "" : (stryCov_9fa48("17306"), 'Examen compartido exitosamente'));
            setOpen(stryMutAct_9fa48("17307") ? true : (stryCov_9fa48("17307"), false));
            setMessage(stryMutAct_9fa48("17308") ? "Stryker was here!" : (stryCov_9fa48("17308"), ''));
            stryMutAct_9fa48("17309") ? onShared() : (stryCov_9fa48("17309"), onShared?.());
          }
        } catch (error) {
          if (stryMutAct_9fa48("17310")) {
            {}
          } else {
            stryCov_9fa48("17310");
            toast.error(error instanceof Error ? error.message : stryMutAct_9fa48("17311") ? "" : (stryCov_9fa48("17311"), 'Error al compartir examen'));
          }
        } finally {
          if (stryMutAct_9fa48("17312")) {
            {}
          } else {
            stryCov_9fa48("17312");
            setLoading(stryMutAct_9fa48("17313") ? true : (stryCov_9fa48("17313"), false));
          }
        }
      }
    };
    return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartir Examen</DialogTitle>
          <DialogDescription>
            Comparte "{examTitle}" con el otro estudiante. Podrá verlo en su lista de exámenes
            compartidos.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea id="message" placeholder="Agrega un mensaje personalizado..." value={message} onChange={stryMutAct_9fa48("17314") ? () => undefined : (stryCov_9fa48("17314"), e => setMessage(e.target.value))} rows={3} className="mt-2" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={stryMutAct_9fa48("17315") ? () => undefined : (stryCov_9fa48("17315"), () => setOpen(stryMutAct_9fa48("17316") ? true : (stryCov_9fa48("17316"), false)))} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleShare} disabled={stryMutAct_9fa48("17319") ? loading && shared : stryMutAct_9fa48("17318") ? false : stryMutAct_9fa48("17317") ? true : (stryCov_9fa48("17317", "17318", "17319"), loading || shared)}>
            {loading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Compartiendo...
              </> : shared ? <>
                <Check className="h-4 w-4 mr-2" />
                Compartido
              </> : <>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
  }
}