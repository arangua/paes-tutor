'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { History, RotateCcw, Eye, CheckCircle2 } from 'lucide-react'
import { captureError } from '@/lib/monitoring'

// Función para formatear tiempo relativo
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'hace unos segundos'
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `hace ${hours} hora${hours !== 1 ? 's' : ''}`
  }
  const days = Math.floor(diffInSeconds / 86400)
  if (days < 30) {
    return `hace ${days} día${days !== 1 ? 's' : ''}`
  }
  const months = Math.floor(days / 30)
  if (months < 12) {
    return `hace ${months} mes${months !== 1 ? 'es' : ''}`
  }
  const years = Math.floor(months / 12)
  return `hace ${years} año${years !== 1 ? 's' : ''}`
}

export interface NoteVersion {
  id: string
  title: string
  content: string
  tags: string | null
  createdAt: Date
  createdBy: string
}

interface NoteVersionsProps {
  noteId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRestore?: (version: NoteVersion) => void
}

/**
 * Componente para ver y restaurar versiones de notas
 * Basado en estándares de Google Docs, Notion, Linear
 */
export function NoteVersions({
  noteId,
  open,
  onOpenChange,
  onRestore,
}: NoteVersionsProps) {
  const [versions, setVersions] = useState<NoteVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(null)
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [versionToRestore, setVersionToRestore] = useState<NoteVersion | null>(null)

  // Cargar versiones
  useEffect(() => {
    if (!open || !noteId) return

    const loadVersions = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/notes/versions?noteId=${noteId}`)
        if (res.ok) {
          const data = await res.json()
          setVersions(data.versions || [])
          setCurrentVersionId(data.currentVersionId || null)
        }
      } catch (error) {
        captureError(error instanceof Error ? error : new Error(String(error)), {
          type: 'note_versions_load_error',
          noteId: noteId || 'unknown',
        })
      } finally {
        setLoading(false)
      }
    }

    loadVersions()
  }, [open, noteId])

  const handleRestoreClick = (version: NoteVersion) => {
    setVersionToRestore(version)
    setShowRestoreDialog(true)
  }

  const handleRestore = async () => {
    if (!versionToRestore) return

    try {
      const res = await fetch(`/api/notes/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId,
          versionId: versionToRestore.id,
        }),
      })

      if (res.ok) {
        if (onRestore) {
          onRestore(versionToRestore)
        }
        setShowRestoreDialog(false)
        setVersionToRestore(null)
        onOpenChange(false)
      }
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        type: 'note_version_restore_error',
        noteId: noteId || 'unknown',
        versionId: versionToRestore.id,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Cargando versiones...</div>
          </div>
        ) : versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">No hay versiones guardadas</p>
            <p className="text-sm text-muted-foreground">
              Las versiones se guardan automáticamente cuando realizas cambios importantes.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            {versions.map((version, idx) => {
              const isCurrent = version.id === currentVersionId
              const isSelected = selectedVersion?.id === version.id

              return (
                <Card
                  key={version.id}
                  className={`cursor-pointer transition-all hover:bg-accent/50 ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  } ${isCurrent ? 'border-primary/50' : ''}`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={isCurrent ? 'default' : 'outline'}>
                            {isCurrent ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Versión actual
                              </>
                            ) : (
                              `Versión ${versions.length - idx}`
                            )}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(version.createdAt))}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1 truncate">{version.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {version.content}
                        </p>
                        {version.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {version.tags.split(',').map((tag, tagIdx) => (
                              <Badge key={tagIdx} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation()
                            setSelectedVersion(version)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation()
                              handleRestoreClick(version)
                            }}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restaurar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Vista previa de versión seleccionada */}
        {selectedVersion && (
          <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Vista previa</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedVersion(null)}
                >
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
                  {selectedVersion.tags && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t">
                      {selectedVersion.tags.split(',').map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
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
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRestore} variant="default">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

