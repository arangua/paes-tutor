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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTrash, TrashItem } from '@/hooks/useTrash';
import { Trash2, RotateCcw, X, Clock, FileText, Bookmark, BookOpen, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Función para formatear tiempo relativo
function formatTimeAgo(date: Date): string {
  if (stryMutAct_9fa48("19735")) {
    {}
  } else {
    stryCov_9fa48("19735");
    const now = new Date();
    const diffInSeconds = Math.floor(stryMutAct_9fa48("19736") ? (now.getTime() - date.getTime()) * 1000 : (stryCov_9fa48("19736"), (stryMutAct_9fa48("19737") ? now.getTime() + date.getTime() : (stryCov_9fa48("19737"), now.getTime() - date.getTime())) / 1000));
    if (stryMutAct_9fa48("19741") ? diffInSeconds >= 60 : stryMutAct_9fa48("19740") ? diffInSeconds <= 60 : stryMutAct_9fa48("19739") ? false : stryMutAct_9fa48("19738") ? true : (stryCov_9fa48("19738", "19739", "19740", "19741"), diffInSeconds < 60)) return stryMutAct_9fa48("19742") ? "" : (stryCov_9fa48("19742"), 'hace unos segundos');
    if (stryMutAct_9fa48("19746") ? diffInSeconds >= 3600 : stryMutAct_9fa48("19745") ? diffInSeconds <= 3600 : stryMutAct_9fa48("19744") ? false : stryMutAct_9fa48("19743") ? true : (stryCov_9fa48("19743", "19744", "19745", "19746"), diffInSeconds < 3600)) {
      if (stryMutAct_9fa48("19747")) {
        {}
      } else {
        stryCov_9fa48("19747");
        const minutes = Math.floor(stryMutAct_9fa48("19748") ? diffInSeconds * 60 : (stryCov_9fa48("19748"), diffInSeconds / 60));
        return stryMutAct_9fa48("19749") ? `` : (stryCov_9fa48("19749"), `hace ${minutes} minuto${(stryMutAct_9fa48("19752") ? minutes === 1 : stryMutAct_9fa48("19751") ? false : stryMutAct_9fa48("19750") ? true : (stryCov_9fa48("19750", "19751", "19752"), minutes !== 1)) ? stryMutAct_9fa48("19753") ? "" : (stryCov_9fa48("19753"), 's') : stryMutAct_9fa48("19754") ? "Stryker was here!" : (stryCov_9fa48("19754"), '')}`);
      }
    }
    if (stryMutAct_9fa48("19758") ? diffInSeconds >= 86400 : stryMutAct_9fa48("19757") ? diffInSeconds <= 86400 : stryMutAct_9fa48("19756") ? false : stryMutAct_9fa48("19755") ? true : (stryCov_9fa48("19755", "19756", "19757", "19758"), diffInSeconds < 86400)) {
      if (stryMutAct_9fa48("19759")) {
        {}
      } else {
        stryCov_9fa48("19759");
        const hours = Math.floor(stryMutAct_9fa48("19760") ? diffInSeconds * 3600 : (stryCov_9fa48("19760"), diffInSeconds / 3600));
        return stryMutAct_9fa48("19761") ? `` : (stryCov_9fa48("19761"), `hace ${hours} hora${(stryMutAct_9fa48("19764") ? hours === 1 : stryMutAct_9fa48("19763") ? false : stryMutAct_9fa48("19762") ? true : (stryCov_9fa48("19762", "19763", "19764"), hours !== 1)) ? stryMutAct_9fa48("19765") ? "" : (stryCov_9fa48("19765"), 's') : stryMutAct_9fa48("19766") ? "Stryker was here!" : (stryCov_9fa48("19766"), '')}`);
      }
    }
    const days = Math.floor(stryMutAct_9fa48("19767") ? diffInSeconds * 86400 : (stryCov_9fa48("19767"), diffInSeconds / 86400));
    return stryMutAct_9fa48("19768") ? `` : (stryCov_9fa48("19768"), `hace ${days} día${(stryMutAct_9fa48("19771") ? days === 1 : stryMutAct_9fa48("19770") ? false : stryMutAct_9fa48("19769") ? true : (stryCov_9fa48("19769", "19770", "19771"), days !== 1)) ? stryMutAct_9fa48("19772") ? "" : (stryCov_9fa48("19772"), 's') : stryMutAct_9fa48("19773") ? "Stryker was here!" : (stryCov_9fa48("19773"), '')}`);
  }
}
interface TrashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore?: (item: TrashItem) => void;
}
const TYPE_ICONS = stryMutAct_9fa48("19774") ? {} : (stryCov_9fa48("19774"), {
  note: FileText,
  flashcard: BookOpen,
  bookmark: Bookmark,
  attempt: ClipboardList
});
const TYPE_LABELS = stryMutAct_9fa48("19775") ? {} : (stryCov_9fa48("19775"), {
  note: stryMutAct_9fa48("19776") ? "" : (stryCov_9fa48("19776"), 'Nota'),
  flashcard: stryMutAct_9fa48("19777") ? "" : (stryCov_9fa48("19777"), 'Flashcard'),
  bookmark: stryMutAct_9fa48("19778") ? "" : (stryCov_9fa48("19778"), 'Marcador'),
  attempt: stryMutAct_9fa48("19779") ? "" : (stryCov_9fa48("19779"), 'Intento')
});
const TYPE_COLORS = stryMutAct_9fa48("19780") ? {} : (stryCov_9fa48("19780"), {
  note: stryMutAct_9fa48("19781") ? "" : (stryCov_9fa48("19781"), 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'),
  flashcard: stryMutAct_9fa48("19782") ? "" : (stryCov_9fa48("19782"), 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'),
  bookmark: stryMutAct_9fa48("19783") ? "" : (stryCov_9fa48("19783"), 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'),
  attempt: stryMutAct_9fa48("19784") ? "" : (stryCov_9fa48("19784"), 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300')
});

/**
 * Diálogo de papelera de reciclaje
 * Basado en estándares de Gmail, Notion, Linear
 */
export function TrashDialog({
  open,
  onOpenChange,
  onRestore
}: TrashDialogProps) {
  if (stryMutAct_9fa48("19785")) {
    {}
  } else {
    stryCov_9fa48("19785");
    const {
      trashItems,
      restoreItem,
      deletePermanently,
      emptyTrash,
      getDaysRemaining
    } = useTrash();
    const [selectedType, setSelectedType] = useState<string>(stryMutAct_9fa48("19786") ? "" : (stryCov_9fa48("19786"), 'all'));
    const handleRestore = (item: TrashItem) => {
      if (stryMutAct_9fa48("19787")) {
        {}
      } else {
        stryCov_9fa48("19787");
        const restored = restoreItem(item.id);
        if (stryMutAct_9fa48("19789") ? false : stryMutAct_9fa48("19788") ? true : (stryCov_9fa48("19788", "19789"), restored)) {
          if (stryMutAct_9fa48("19790")) {
            {}
          } else {
            stryCov_9fa48("19790");
            toast.success(stryMutAct_9fa48("19791") ? `` : (stryCov_9fa48("19791"), `${TYPE_LABELS[item.type]} restaurado correctamente`));
            if (stryMutAct_9fa48("19793") ? false : stryMutAct_9fa48("19792") ? true : (stryCov_9fa48("19792", "19793"), onRestore)) {
              if (stryMutAct_9fa48("19794")) {
                {}
              } else {
                stryCov_9fa48("19794");
                onRestore(restored);
              }
            }
          }
        }
      }
    };
    const handleDeletePermanently = (item: TrashItem) => {
      if (stryMutAct_9fa48("19795")) {
        {}
      } else {
        stryCov_9fa48("19795");
        deletePermanently(item.id);
        toast.success(stryMutAct_9fa48("19796") ? `` : (stryCov_9fa48("19796"), `${TYPE_LABELS[item.type]} eliminado permanentemente`));
      }
    };
    const handleEmptyTrash = () => {
      if (stryMutAct_9fa48("19797")) {
        {}
      } else {
        stryCov_9fa48("19797");
        if (stryMutAct_9fa48("19799") ? false : stryMutAct_9fa48("19798") ? true : (stryCov_9fa48("19798", "19799"), confirm(stryMutAct_9fa48("19800") ? "" : (stryCov_9fa48("19800"), '¿Estás seguro de que deseas vaciar la papelera? Esta acción no se puede deshacer.')))) {
          if (stryMutAct_9fa48("19801")) {
            {}
          } else {
            stryCov_9fa48("19801");
            emptyTrash();
            toast.success(stryMutAct_9fa48("19802") ? "" : (stryCov_9fa48("19802"), 'Papelera vaciada'));
          }
        }
      }
    };

    // Agrupar por tipo
    const groupedItems = trashItems.reduce((acc, item) => {
      if (stryMutAct_9fa48("19803")) {
        {}
      } else {
        stryCov_9fa48("19803");
        if (stryMutAct_9fa48("19806") ? false : stryMutAct_9fa48("19805") ? true : stryMutAct_9fa48("19804") ? acc[item.type] : (stryCov_9fa48("19804", "19805", "19806"), !acc[item.type])) {
          if (stryMutAct_9fa48("19807")) {
            {}
          } else {
            stryCov_9fa48("19807");
            acc[item.type] = stryMutAct_9fa48("19808") ? ["Stryker was here"] : (stryCov_9fa48("19808"), []);
          }
        }
        acc[item.type].push(item);
        return acc;
      }
    }, {} as Record<TrashItem['type'], TrashItem[]>);
    const allTypes = ['all', ...Object.keys(groupedItems)] as string[];
    const displayItems = (stryMutAct_9fa48("19811") ? selectedType !== 'all' : stryMutAct_9fa48("19810") ? false : stryMutAct_9fa48("19809") ? true : (stryCov_9fa48("19809", "19810", "19811"), selectedType === (stryMutAct_9fa48("19812") ? "" : (stryCov_9fa48("19812"), 'all')))) ? trashItems : stryMutAct_9fa48("19815") ? groupedItems[selectedType as TrashItem['type']] && [] : stryMutAct_9fa48("19814") ? false : stryMutAct_9fa48("19813") ? true : (stryCov_9fa48("19813", "19814", "19815"), groupedItems[selectedType as TrashItem['type']] || (stryMutAct_9fa48("19816") ? ["Stryker was here"] : (stryCov_9fa48("19816"), [])));
    return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Papelera de Reciclaje
              </DialogTitle>
              <DialogDescription className="mt-2">
                Los elementos eliminados se conservan por 30 días antes de ser eliminados
                permanentemente.
              </DialogDescription>
            </div>
            {stryMutAct_9fa48("19819") ? trashItems.length > 0 || <Button variant="destructive" size="sm" onClick={handleEmptyTrash}>
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar Papelera
              </Button> : stryMutAct_9fa48("19818") ? false : stryMutAct_9fa48("19817") ? true : (stryCov_9fa48("19817", "19818", "19819"), (stryMutAct_9fa48("19822") ? trashItems.length <= 0 : stryMutAct_9fa48("19821") ? trashItems.length >= 0 : stryMutAct_9fa48("19820") ? true : (stryCov_9fa48("19820", "19821", "19822"), trashItems.length > 0)) && <Button variant="destructive" size="sm" onClick={handleEmptyTrash}>
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar Papelera
              </Button>)}
          </div>
        </DialogHeader>

        {(stryMutAct_9fa48("19825") ? trashItems.length !== 0 : stryMutAct_9fa48("19824") ? false : stryMutAct_9fa48("19823") ? true : (stryCov_9fa48("19823", "19824", "19825"), trashItems.length === 0)) ? <div className="flex flex-col items-center justify-center py-12 text-center">
            <Trash2 className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">La papelera está vacía</p>
            <p className="text-sm text-muted-foreground">
              Los elementos que elimines aparecerán aquí y podrás restaurarlos.
            </p>
          </div> : <Tabs value={selectedType} onValueChange={setSelectedType} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos ({trashItems.length})</TabsTrigger>
              {Object.entries(groupedItems).map(stryMutAct_9fa48("19826") ? () => undefined : (stryCov_9fa48("19826"), ([type, items]) => <TabsTrigger key={type} value={type}>
                  {TYPE_LABELS[type as TrashItem['type']]} ({items.length})
                </TabsTrigger>))}
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value={selectedType} className="mt-0 space-y-2">
                {displayItems.map(item => {
                if (stryMutAct_9fa48("19827")) {
                  {}
                } else {
                  stryCov_9fa48("19827");
                  const Icon = TYPE_ICONS[item.type];
                  const daysRemaining = getDaysRemaining(item.deletedAt);
                  return <Card key={item.id} className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={stryMutAct_9fa48("19828") ? `` : (stryCov_9fa48("19828"), `p-2 rounded-lg ${TYPE_COLORS[item.type]}`)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {TYPE_LABELS[item.type]}
                                </Badge>
                                <span className="font-semibold truncate">{item.title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>Eliminado {formatTimeAgo(new Date(item.deletedAt))}</span>
                                {stryMutAct_9fa48("19831") ? daysRemaining > 0 || <>
                                    <span>•</span>
                                    <span className={daysRemaining <= 7 ? 'text-destructive' : ''}>
                                      {daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restante
                                      {daysRemaining !== 1 ? 's' : ''}
                                    </span>
                                  </> : stryMutAct_9fa48("19830") ? false : stryMutAct_9fa48("19829") ? true : (stryCov_9fa48("19829", "19830", "19831"), (stryMutAct_9fa48("19834") ? daysRemaining <= 0 : stryMutAct_9fa48("19833") ? daysRemaining >= 0 : stryMutAct_9fa48("19832") ? true : (stryCov_9fa48("19832", "19833", "19834"), daysRemaining > 0)) && <>
                                    <span>•</span>
                                    <span className={(stryMutAct_9fa48("19838") ? daysRemaining > 7 : stryMutAct_9fa48("19837") ? daysRemaining < 7 : stryMutAct_9fa48("19836") ? false : stryMutAct_9fa48("19835") ? true : (stryCov_9fa48("19835", "19836", "19837", "19838"), daysRemaining <= 7)) ? stryMutAct_9fa48("19839") ? "" : (stryCov_9fa48("19839"), 'text-destructive') : stryMutAct_9fa48("19840") ? "Stryker was here!" : (stryCov_9fa48("19840"), '')}>
                                      {daysRemaining} día{(stryMutAct_9fa48("19843") ? daysRemaining === 1 : stryMutAct_9fa48("19842") ? false : stryMutAct_9fa48("19841") ? true : (stryCov_9fa48("19841", "19842", "19843"), daysRemaining !== 1)) ? stryMutAct_9fa48("19844") ? "" : (stryCov_9fa48("19844"), 's') : stryMutAct_9fa48("19845") ? "Stryker was here!" : (stryCov_9fa48("19845"), '')} restante
                                      {(stryMutAct_9fa48("19848") ? daysRemaining === 1 : stryMutAct_9fa48("19847") ? false : stryMutAct_9fa48("19846") ? true : (stryCov_9fa48("19846", "19847", "19848"), daysRemaining !== 1)) ? stryMutAct_9fa48("19849") ? "" : (stryCov_9fa48("19849"), 's') : stryMutAct_9fa48("19850") ? "Stryker was here!" : (stryCov_9fa48("19850"), '')}
                                    </span>
                                  </>)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={stryMutAct_9fa48("19851") ? () => undefined : (stryCov_9fa48("19851"), () => handleRestore(item))} title="Restaurar">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("19852") ? () => undefined : (stryCov_9fa48("19852"), () => handleDeletePermanently(item))} title="Eliminar permanentemente">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>;
                }
              })}
              </TabsContent>
            </div>
          </Tabs>}
      </DialogContent>
    </Dialog>;
  }
}