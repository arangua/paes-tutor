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
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { History, RotateCcw, Eye, CheckCircle2 } from 'lucide-react';
import { captureError } from '@/lib/monitoring';

// Función para formatear tiempo relativo
function formatTimeAgo(date: Date): string {
  if (stryMutAct_9fa48("18240")) {
    {}
  } else {
    stryCov_9fa48("18240");
    const now = new Date();
    const diffInSeconds = Math.floor(stryMutAct_9fa48("18241") ? (now.getTime() - date.getTime()) * 1000 : (stryCov_9fa48("18241"), (stryMutAct_9fa48("18242") ? now.getTime() + date.getTime() : (stryCov_9fa48("18242"), now.getTime() - date.getTime())) / 1000));
    if (stryMutAct_9fa48("18246") ? diffInSeconds >= 60 : stryMutAct_9fa48("18245") ? diffInSeconds <= 60 : stryMutAct_9fa48("18244") ? false : stryMutAct_9fa48("18243") ? true : (stryCov_9fa48("18243", "18244", "18245", "18246"), diffInSeconds < 60)) return stryMutAct_9fa48("18247") ? "" : (stryCov_9fa48("18247"), 'hace unos segundos');
    if (stryMutAct_9fa48("18251") ? diffInSeconds >= 3600 : stryMutAct_9fa48("18250") ? diffInSeconds <= 3600 : stryMutAct_9fa48("18249") ? false : stryMutAct_9fa48("18248") ? true : (stryCov_9fa48("18248", "18249", "18250", "18251"), diffInSeconds < 3600)) {
      if (stryMutAct_9fa48("18252")) {
        {}
      } else {
        stryCov_9fa48("18252");
        const minutes = Math.floor(stryMutAct_9fa48("18253") ? diffInSeconds * 60 : (stryCov_9fa48("18253"), diffInSeconds / 60));
        return stryMutAct_9fa48("18254") ? `` : (stryCov_9fa48("18254"), `hace ${minutes} minuto${(stryMutAct_9fa48("18257") ? minutes === 1 : stryMutAct_9fa48("18256") ? false : stryMutAct_9fa48("18255") ? true : (stryCov_9fa48("18255", "18256", "18257"), minutes !== 1)) ? stryMutAct_9fa48("18258") ? "" : (stryCov_9fa48("18258"), 's') : stryMutAct_9fa48("18259") ? "Stryker was here!" : (stryCov_9fa48("18259"), '')}`);
      }
    }
    if (stryMutAct_9fa48("18263") ? diffInSeconds >= 86400 : stryMutAct_9fa48("18262") ? diffInSeconds <= 86400 : stryMutAct_9fa48("18261") ? false : stryMutAct_9fa48("18260") ? true : (stryCov_9fa48("18260", "18261", "18262", "18263"), diffInSeconds < 86400)) {
      if (stryMutAct_9fa48("18264")) {
        {}
      } else {
        stryCov_9fa48("18264");
        const hours = Math.floor(stryMutAct_9fa48("18265") ? diffInSeconds * 3600 : (stryCov_9fa48("18265"), diffInSeconds / 3600));
        return stryMutAct_9fa48("18266") ? `` : (stryCov_9fa48("18266"), `hace ${hours} hora${(stryMutAct_9fa48("18269") ? hours === 1 : stryMutAct_9fa48("18268") ? false : stryMutAct_9fa48("18267") ? true : (stryCov_9fa48("18267", "18268", "18269"), hours !== 1)) ? stryMutAct_9fa48("18270") ? "" : (stryCov_9fa48("18270"), 's') : stryMutAct_9fa48("18271") ? "Stryker was here!" : (stryCov_9fa48("18271"), '')}`);
      }
    }
    const days = Math.floor(stryMutAct_9fa48("18272") ? diffInSeconds * 86400 : (stryCov_9fa48("18272"), diffInSeconds / 86400));
    if (stryMutAct_9fa48("18276") ? days >= 30 : stryMutAct_9fa48("18275") ? days <= 30 : stryMutAct_9fa48("18274") ? false : stryMutAct_9fa48("18273") ? true : (stryCov_9fa48("18273", "18274", "18275", "18276"), days < 30)) {
      if (stryMutAct_9fa48("18277")) {
        {}
      } else {
        stryCov_9fa48("18277");
        return stryMutAct_9fa48("18278") ? `` : (stryCov_9fa48("18278"), `hace ${days} día${(stryMutAct_9fa48("18281") ? days === 1 : stryMutAct_9fa48("18280") ? false : stryMutAct_9fa48("18279") ? true : (stryCov_9fa48("18279", "18280", "18281"), days !== 1)) ? stryMutAct_9fa48("18282") ? "" : (stryCov_9fa48("18282"), 's') : stryMutAct_9fa48("18283") ? "Stryker was here!" : (stryCov_9fa48("18283"), '')}`);
      }
    }
    const months = Math.floor(stryMutAct_9fa48("18284") ? days * 30 : (stryCov_9fa48("18284"), days / 30));
    if (stryMutAct_9fa48("18288") ? months >= 12 : stryMutAct_9fa48("18287") ? months <= 12 : stryMutAct_9fa48("18286") ? false : stryMutAct_9fa48("18285") ? true : (stryCov_9fa48("18285", "18286", "18287", "18288"), months < 12)) {
      if (stryMutAct_9fa48("18289")) {
        {}
      } else {
        stryCov_9fa48("18289");
        return stryMutAct_9fa48("18290") ? `` : (stryCov_9fa48("18290"), `hace ${months} mes${(stryMutAct_9fa48("18293") ? months === 1 : stryMutAct_9fa48("18292") ? false : stryMutAct_9fa48("18291") ? true : (stryCov_9fa48("18291", "18292", "18293"), months !== 1)) ? stryMutAct_9fa48("18294") ? "" : (stryCov_9fa48("18294"), 'es') : stryMutAct_9fa48("18295") ? "Stryker was here!" : (stryCov_9fa48("18295"), '')}`);
      }
    }
    const years = Math.floor(stryMutAct_9fa48("18296") ? months * 12 : (stryCov_9fa48("18296"), months / 12));
    return stryMutAct_9fa48("18297") ? `` : (stryCov_9fa48("18297"), `hace ${years} año${(stryMutAct_9fa48("18300") ? years === 1 : stryMutAct_9fa48("18299") ? false : stryMutAct_9fa48("18298") ? true : (stryCov_9fa48("18298", "18299", "18300"), years !== 1)) ? stryMutAct_9fa48("18301") ? "" : (stryCov_9fa48("18301"), 's') : stryMutAct_9fa48("18302") ? "Stryker was here!" : (stryCov_9fa48("18302"), '')}`);
  }
}
export interface NoteVersion {
  id: string;
  title: string;
  content: string;
  tags: string | null;
  createdAt: Date;
  createdBy: string;
}
interface NoteVersionsProps {
  noteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore?: (version: NoteVersion) => void;
}

/**
 * Componente para ver y restaurar versiones de notas
 * Basado en estándares de Google Docs, Notion, Linear
 */
export function NoteVersions({
  noteId,
  open,
  onOpenChange,
  onRestore
}: NoteVersionsProps) {
  if (stryMutAct_9fa48("18303")) {
    {}
  } else {
    stryCov_9fa48("18303");
    const [versions, setVersions] = useState<NoteVersion[]>(stryMutAct_9fa48("18304") ? ["Stryker was here"] : (stryCov_9fa48("18304"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("18305") ? true : (stryCov_9fa48("18305"), false));
    const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(null);
    const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
    const [showRestoreDialog, setShowRestoreDialog] = useState(stryMutAct_9fa48("18306") ? true : (stryCov_9fa48("18306"), false));
    const [versionToRestore, setVersionToRestore] = useState<NoteVersion | null>(null);

    // Cargar versiones
    useEffect(() => {
      if (stryMutAct_9fa48("18307")) {
        {}
      } else {
        stryCov_9fa48("18307");
        if (stryMutAct_9fa48("18310") ? !open && !noteId : stryMutAct_9fa48("18309") ? false : stryMutAct_9fa48("18308") ? true : (stryCov_9fa48("18308", "18309", "18310"), (stryMutAct_9fa48("18311") ? open : (stryCov_9fa48("18311"), !open)) || (stryMutAct_9fa48("18312") ? noteId : (stryCov_9fa48("18312"), !noteId)))) return;
        const loadVersions = async () => {
          if (stryMutAct_9fa48("18313")) {
            {}
          } else {
            stryCov_9fa48("18313");
            setLoading(stryMutAct_9fa48("18314") ? false : (stryCov_9fa48("18314"), true));
            try {
              if (stryMutAct_9fa48("18315")) {
                {}
              } else {
                stryCov_9fa48("18315");
                const res = await fetch(stryMutAct_9fa48("18316") ? `` : (stryCov_9fa48("18316"), `/api/notes/versions?noteId=${noteId}`));
                if (stryMutAct_9fa48("18318") ? false : stryMutAct_9fa48("18317") ? true : (stryCov_9fa48("18317", "18318"), res.ok)) {
                  if (stryMutAct_9fa48("18319")) {
                    {}
                  } else {
                    stryCov_9fa48("18319");
                    const data = await res.json();
                    setVersions(stryMutAct_9fa48("18322") ? data.versions && [] : stryMutAct_9fa48("18321") ? false : stryMutAct_9fa48("18320") ? true : (stryCov_9fa48("18320", "18321", "18322"), data.versions || (stryMutAct_9fa48("18323") ? ["Stryker was here"] : (stryCov_9fa48("18323"), []))));
                    setCurrentVersionId(stryMutAct_9fa48("18326") ? data.currentVersionId && null : stryMutAct_9fa48("18325") ? false : stryMutAct_9fa48("18324") ? true : (stryCov_9fa48("18324", "18325", "18326"), data.currentVersionId || null));
                  }
                }
              }
            } catch (error) {
              if (stryMutAct_9fa48("18327")) {
                {}
              } else {
                stryCov_9fa48("18327");
                captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("18328") ? {} : (stryCov_9fa48("18328"), {
                  type: stryMutAct_9fa48("18329") ? "" : (stryCov_9fa48("18329"), 'note_versions_load_error'),
                  noteId: stryMutAct_9fa48("18332") ? noteId && 'unknown' : stryMutAct_9fa48("18331") ? false : stryMutAct_9fa48("18330") ? true : (stryCov_9fa48("18330", "18331", "18332"), noteId || (stryMutAct_9fa48("18333") ? "" : (stryCov_9fa48("18333"), 'unknown')))
                }));
              }
            } finally {
              if (stryMutAct_9fa48("18334")) {
                {}
              } else {
                stryCov_9fa48("18334");
                setLoading(stryMutAct_9fa48("18335") ? true : (stryCov_9fa48("18335"), false));
              }
            }
          }
        };
        loadVersions();
      }
    }, stryMutAct_9fa48("18336") ? [] : (stryCov_9fa48("18336"), [open, noteId]));
    const handleRestoreClick = (version: NoteVersion) => {
      if (stryMutAct_9fa48("18337")) {
        {}
      } else {
        stryCov_9fa48("18337");
        setVersionToRestore(version);
        setShowRestoreDialog(stryMutAct_9fa48("18338") ? false : (stryCov_9fa48("18338"), true));
      }
    };
    const handleRestore = async () => {
      if (stryMutAct_9fa48("18339")) {
        {}
      } else {
        stryCov_9fa48("18339");
        if (stryMutAct_9fa48("18342") ? false : stryMutAct_9fa48("18341") ? true : stryMutAct_9fa48("18340") ? versionToRestore : (stryCov_9fa48("18340", "18341", "18342"), !versionToRestore)) return;
        try {
          if (stryMutAct_9fa48("18343")) {
            {}
          } else {
            stryCov_9fa48("18343");
            const res = await fetch(stryMutAct_9fa48("18344") ? `` : (stryCov_9fa48("18344"), `/api/notes/restore`), stryMutAct_9fa48("18345") ? {} : (stryCov_9fa48("18345"), {
              method: stryMutAct_9fa48("18346") ? "" : (stryCov_9fa48("18346"), 'POST'),
              headers: stryMutAct_9fa48("18347") ? {} : (stryCov_9fa48("18347"), {
                'Content-Type': stryMutAct_9fa48("18348") ? "" : (stryCov_9fa48("18348"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("18349") ? {} : (stryCov_9fa48("18349"), {
                noteId,
                versionId: versionToRestore.id
              }))
            }));
            if (stryMutAct_9fa48("18351") ? false : stryMutAct_9fa48("18350") ? true : (stryCov_9fa48("18350", "18351"), res.ok)) {
              if (stryMutAct_9fa48("18352")) {
                {}
              } else {
                stryCov_9fa48("18352");
                if (stryMutAct_9fa48("18354") ? false : stryMutAct_9fa48("18353") ? true : (stryCov_9fa48("18353", "18354"), onRestore)) {
                  if (stryMutAct_9fa48("18355")) {
                    {}
                  } else {
                    stryCov_9fa48("18355");
                    onRestore(versionToRestore);
                  }
                }
                setShowRestoreDialog(stryMutAct_9fa48("18356") ? true : (stryCov_9fa48("18356"), false));
                setVersionToRestore(null);
                onOpenChange(stryMutAct_9fa48("18357") ? true : (stryCov_9fa48("18357"), false));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("18358")) {
            {}
          } else {
            stryCov_9fa48("18358");
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("18359") ? {} : (stryCov_9fa48("18359"), {
              type: stryMutAct_9fa48("18360") ? "" : (stryCov_9fa48("18360"), 'note_version_restore_error'),
              noteId: stryMutAct_9fa48("18363") ? noteId && 'unknown' : stryMutAct_9fa48("18362") ? false : stryMutAct_9fa48("18361") ? true : (stryCov_9fa48("18361", "18362", "18363"), noteId || (stryMutAct_9fa48("18364") ? "" : (stryCov_9fa48("18364"), 'unknown'))),
              versionId: versionToRestore.id
            }));
          }
        }
      }
    };
    return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Versiones
          </DialogTitle>
          <DialogDescription>
            Visualiza y restaura versiones anteriores de esta nota. Se guarda una versión cada vez
            que realizas cambios importantes.
          </DialogDescription>
        </DialogHeader>

        {loading ? <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Cargando versiones...</div>
          </div> : (stryMutAct_9fa48("18367") ? versions.length !== 0 : stryMutAct_9fa48("18366") ? false : stryMutAct_9fa48("18365") ? true : (stryCov_9fa48("18365", "18366", "18367"), versions.length === 0)) ? <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">No hay versiones guardadas</p>
            <p className="text-sm text-muted-foreground">
              Las versiones se guardan automáticamente cuando realizas cambios importantes.
            </p>
          </div> : <div className="flex-1 overflow-y-auto space-y-3">
            {versions.map((version, idx) => {
            if (stryMutAct_9fa48("18368")) {
              {}
            } else {
              stryCov_9fa48("18368");
              const isCurrent = stryMutAct_9fa48("18371") ? version.id !== currentVersionId : stryMutAct_9fa48("18370") ? false : stryMutAct_9fa48("18369") ? true : (stryCov_9fa48("18369", "18370", "18371"), version.id === currentVersionId);
              const isSelected = stryMutAct_9fa48("18374") ? selectedVersion?.id !== version.id : stryMutAct_9fa48("18373") ? false : stryMutAct_9fa48("18372") ? true : (stryCov_9fa48("18372", "18373", "18374"), (stryMutAct_9fa48("18375") ? selectedVersion.id : (stryCov_9fa48("18375"), selectedVersion?.id)) === version.id);
              return <Card key={version.id} className={stryMutAct_9fa48("18376") ? `` : (stryCov_9fa48("18376"), `cursor-pointer transition-all hover:bg-accent/50 ${isSelected ? stryMutAct_9fa48("18377") ? "" : (stryCov_9fa48("18377"), 'ring-2 ring-primary') : stryMutAct_9fa48("18378") ? "Stryker was here!" : (stryCov_9fa48("18378"), '')} ${isCurrent ? stryMutAct_9fa48("18379") ? "" : (stryCov_9fa48("18379"), 'border-primary/50') : stryMutAct_9fa48("18380") ? "Stryker was here!" : (stryCov_9fa48("18380"), '')}`)} onClick={stryMutAct_9fa48("18381") ? () => undefined : (stryCov_9fa48("18381"), () => setSelectedVersion(version))}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={isCurrent ? stryMutAct_9fa48("18382") ? "" : (stryCov_9fa48("18382"), 'default') : stryMutAct_9fa48("18383") ? "" : (stryCov_9fa48("18383"), 'outline')}>
                            {isCurrent ? <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Versión actual
                              </> : stryMutAct_9fa48("18384") ? `` : (stryCov_9fa48("18384"), `Versión ${stryMutAct_9fa48("18385") ? versions.length + idx : (stryCov_9fa48("18385"), versions.length - idx)}`)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(version.createdAt))}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1 truncate">{version.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {version.content}
                        </p>
                        {stryMutAct_9fa48("18388") ? version.tags || <div className="flex flex-wrap gap-1 mt-2">
                            {version.tags.split(',').map((tag, tagIdx) => <Badge key={tagIdx} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>)}
                          </div> : stryMutAct_9fa48("18387") ? false : stryMutAct_9fa48("18386") ? true : (stryCov_9fa48("18386", "18387", "18388"), version.tags && <div className="flex flex-wrap gap-1 mt-2">
                            {version.tags.split(stryMutAct_9fa48("18389") ? "" : (stryCov_9fa48("18389"), ',')).map(stryMutAct_9fa48("18390") ? () => undefined : (stryCov_9fa48("18390"), (tag, tagIdx) => <Badge key={tagIdx} variant="outline" className="text-xs">
                                {stryMutAct_9fa48("18391") ? tag : (stryCov_9fa48("18391"), tag.trim())}
                              </Badge>))}
                          </div>)}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={e => {
                        if (stryMutAct_9fa48("18392")) {
                          {}
                        } else {
                          stryCov_9fa48("18392");
                          e.stopPropagation();
                          setSelectedVersion(version);
                        }
                      }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {stryMutAct_9fa48("18395") ? !isCurrent || <Button variant="outline" size="sm" onClick={e => {
                        e.stopPropagation();
                        handleRestoreClick(version);
                      }}>
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restaurar
                          </Button> : stryMutAct_9fa48("18394") ? false : stryMutAct_9fa48("18393") ? true : (stryCov_9fa48("18393", "18394", "18395"), (stryMutAct_9fa48("18396") ? isCurrent : (stryCov_9fa48("18396"), !isCurrent)) && <Button variant="outline" size="sm" onClick={e => {
                        if (stryMutAct_9fa48("18397")) {
                          {}
                        } else {
                          stryCov_9fa48("18397");
                          e.stopPropagation();
                          handleRestoreClick(version);
                        }
                      }}>
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restaurar
                          </Button>)}
                      </div>
                    </div>
                  </CardContent>
                </Card>;
            }
          })}
          </div>}

        {/* Vista previa de versión seleccionada */}
        {stryMutAct_9fa48("18400") ? selectedVersion || <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Vista previa</h4>
                <Button variant="ghost" size="sm" onClick={() => setSelectedVersion(null)}>
                  Cerrar
                </Button>
              </div>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h5 className="font-semibold mb-1">{selectedVersion.title}</h5>
                    <p className="text-sm text-muted-foreground">
                      {formatTimeAgo(new Date(selectedVersion.createdAt))}
                    </p>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedVersion.content}</p>
                  </div>
                  {selectedVersion.tags && <div className="flex flex-wrap gap-1 pt-2 border-t">
                      {selectedVersion.tags.split(',').map((tag, idx) => <Badge key={idx} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>)}
                    </div>}
                </CardContent>
              </Card>
            </div>
          </div> : stryMutAct_9fa48("18399") ? false : stryMutAct_9fa48("18398") ? true : (stryCov_9fa48("18398", "18399", "18400"), selectedVersion && <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Vista previa</h4>
                <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("18401") ? () => undefined : (stryCov_9fa48("18401"), () => setSelectedVersion(null))}>
                  Cerrar
                </Button>
              </div>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h5 className="font-semibold mb-1">{selectedVersion.title}</h5>
                    <p className="text-sm text-muted-foreground">
                      {formatTimeAgo(new Date(selectedVersion.createdAt))}
                    </p>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedVersion.content}</p>
                  </div>
                  {stryMutAct_9fa48("18404") ? selectedVersion.tags || <div className="flex flex-wrap gap-1 pt-2 border-t">
                      {selectedVersion.tags.split(',').map((tag, idx) => <Badge key={idx} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>)}
                    </div> : stryMutAct_9fa48("18403") ? false : stryMutAct_9fa48("18402") ? true : (stryCov_9fa48("18402", "18403", "18404"), selectedVersion.tags && <div className="flex flex-wrap gap-1 pt-2 border-t">
                      {selectedVersion.tags.split(stryMutAct_9fa48("18405") ? "" : (stryCov_9fa48("18405"), ',')).map(stryMutAct_9fa48("18406") ? () => undefined : (stryCov_9fa48("18406"), (tag, idx) => <Badge key={idx} variant="outline" className="text-xs">
                          {stryMutAct_9fa48("18407") ? tag : (stryCov_9fa48("18407"), tag.trim())}
                        </Badge>))}
                    </div>)}
                </CardContent>
              </Card>
            </div>
          </div>)}
      </DialogContent>

      {/* Dialog de confirmación de restauración */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Restaurar esta versión?</DialogTitle>
            <DialogDescription>
              Se creará una nueva versión con el contenido actual antes de restaurar esta versión.
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={stryMutAct_9fa48("18408") ? () => undefined : (stryCov_9fa48("18408"), () => setShowRestoreDialog(stryMutAct_9fa48("18409") ? true : (stryCov_9fa48("18409"), false)))}>
              Cancelar
            </Button>
            <Button onClick={handleRestore} variant="default">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>;
  }
}