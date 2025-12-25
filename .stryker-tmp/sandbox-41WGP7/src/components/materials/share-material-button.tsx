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
interface ShareMaterialButtonProps {
  materialId: string;
  materialTitle: string;
  onShared?: () => void;
}
export function ShareMaterialButton({
  materialId,
  materialTitle,
  onShared
}: ShareMaterialButtonProps) {
  if (stryMutAct_9fa48("17967")) {
    {}
  } else {
    stryCov_9fa48("17967");
    const [open, setOpen] = useState(stryMutAct_9fa48("17968") ? true : (stryCov_9fa48("17968"), false));
    const [message, setMessage] = useState(stryMutAct_9fa48("17969") ? "Stryker was here!" : (stryCov_9fa48("17969"), ''));
    const [loading, setLoading] = useState(stryMutAct_9fa48("17970") ? true : (stryCov_9fa48("17970"), false));
    const [shared, setShared] = useState(stryMutAct_9fa48("17971") ? true : (stryCov_9fa48("17971"), false));
    const handleShare = async () => {
      if (stryMutAct_9fa48("17972")) {
        {}
      } else {
        stryCov_9fa48("17972");
        try {
          if (stryMutAct_9fa48("17973")) {
            {}
          } else {
            stryCov_9fa48("17973");
            setLoading(stryMutAct_9fa48("17974") ? false : (stryCov_9fa48("17974"), true));
            const res = await fetch(stryMutAct_9fa48("17975") ? "" : (stryCov_9fa48("17975"), '/api/shared-materials'), stryMutAct_9fa48("17976") ? {} : (stryCov_9fa48("17976"), {
              method: stryMutAct_9fa48("17977") ? "" : (stryCov_9fa48("17977"), 'POST'),
              headers: stryMutAct_9fa48("17978") ? {} : (stryCov_9fa48("17978"), {
                'Content-Type': stryMutAct_9fa48("17979") ? "" : (stryCov_9fa48("17979"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("17980") ? {} : (stryCov_9fa48("17980"), {
                materialId,
                message: stryMutAct_9fa48("17983") ? message.trim() && undefined : stryMutAct_9fa48("17982") ? false : stryMutAct_9fa48("17981") ? true : (stryCov_9fa48("17981", "17982", "17983"), (stryMutAct_9fa48("17984") ? message : (stryCov_9fa48("17984"), message.trim())) || undefined)
              }))
            }));
            if (stryMutAct_9fa48("17987") ? false : stryMutAct_9fa48("17986") ? true : stryMutAct_9fa48("17985") ? res.ok : (stryCov_9fa48("17985", "17986", "17987"), !res.ok)) {
              if (stryMutAct_9fa48("17988")) {
                {}
              } else {
                stryCov_9fa48("17988");
                const data = await res.json();
                throw new Error(stryMutAct_9fa48("17991") ? data.error && 'Error al compartir material' : stryMutAct_9fa48("17990") ? false : stryMutAct_9fa48("17989") ? true : (stryCov_9fa48("17989", "17990", "17991"), data.error || (stryMutAct_9fa48("17992") ? "" : (stryCov_9fa48("17992"), 'Error al compartir material'))));
              }
            }
            setShared(stryMutAct_9fa48("17993") ? false : (stryCov_9fa48("17993"), true));
            toast.success(stryMutAct_9fa48("17994") ? "" : (stryCov_9fa48("17994"), 'Material compartido exitosamente'));
            setOpen(stryMutAct_9fa48("17995") ? true : (stryCov_9fa48("17995"), false));
            setMessage(stryMutAct_9fa48("17996") ? "Stryker was here!" : (stryCov_9fa48("17996"), ''));
            stryMutAct_9fa48("17997") ? onShared() : (stryCov_9fa48("17997"), onShared?.());
          }
        } catch (error) {
          if (stryMutAct_9fa48("17998")) {
            {}
          } else {
            stryCov_9fa48("17998");
            toast.error(error instanceof Error ? error.message : stryMutAct_9fa48("17999") ? "" : (stryCov_9fa48("17999"), 'Error al compartir material'));
          }
        } finally {
          if (stryMutAct_9fa48("18000")) {
            {}
          } else {
            stryCov_9fa48("18000");
            setLoading(stryMutAct_9fa48("18001") ? true : (stryCov_9fa48("18001"), false));
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
          <DialogTitle>Compartir Material</DialogTitle>
          <DialogDescription>
            Comparte "{materialTitle}" con el otro estudiante. Podrá verlo en su lista de materiales
            compartidos.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea id="message" placeholder="Agrega un mensaje personalizado..." value={message} onChange={stryMutAct_9fa48("18002") ? () => undefined : (stryCov_9fa48("18002"), e => setMessage(e.target.value))} rows={3} className="mt-2" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={stryMutAct_9fa48("18003") ? () => undefined : (stryCov_9fa48("18003"), () => setOpen(stryMutAct_9fa48("18004") ? true : (stryCov_9fa48("18004"), false)))} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleShare} disabled={stryMutAct_9fa48("18007") ? loading && shared : stryMutAct_9fa48("18006") ? false : stryMutAct_9fa48("18005") ? true : (stryCov_9fa48("18005", "18006", "18007"), loading || shared)}>
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