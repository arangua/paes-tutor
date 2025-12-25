'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useTrash, TrashItem } from '@/hooks/useTrash'
import {
  Trash2,
  RotateCcw,
  X,
  Clock,
  FileText,
  Bookmark,
  BookOpen,
  ClipboardList,
} from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  return `hace ${days} día${days !== 1 ? 's' : ''}`
}

interface TrashDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRestore?: (item: TrashItem) => void
}

const TYPE_ICONS = {
  note: FileText,
  flashcard: BookOpen,
  bookmark: Bookmark,
  attempt: ClipboardList,
}

const TYPE_LABELS = {
  note: 'Nota',
  flashcard: 'Flashcard',
  bookmark: 'Marcador',
  attempt: 'Intento',
}

const TYPE_COLORS = {
  note: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  flashcard: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  bookmark: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  attempt: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

/**
 * Diálogo de papelera de reciclaje
 * Basado en estándares de Gmail, Notion, Linear
 */
export function TrashDialog({ open, onOpenChange, onRestore }: TrashDialogProps) {
  const { trashItems, restoreItem, deletePermanently, emptyTrash, getDaysRemaining } = useTrash()
  const [selectedType, setSelectedType] = useState<string>('all')

  const handleRestore = (item: TrashItem) => {
    const restored = restoreItem(item.id)
    if (restored) {
      toast.success(`${TYPE_LABELS[item.type]} restaurado correctamente`)
      if (onRestore) {
        onRestore(restored)
      }
    }
  }

  const handleDeletePermanently = (item: TrashItem) => {
    deletePermanently(item.id)
    toast.success(`${TYPE_LABELS[item.type]} eliminado permanentemente`)
  }

  const handleEmptyTrash = () => {
    if (
      confirm('¿Estás seguro de que deseas vaciar la papelera? Esta acción no se puede deshacer.')
    ) {
      emptyTrash()
      toast.success('Papelera vaciada')
    }
  }

  // Agrupar por tipo
  const groupedItems = trashItems.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = []
      }
      acc[item.type].push(item)
      return acc
    },
    {} as Record<TrashItem['type'], TrashItem[]>
  )

  const allTypes = ['all', ...Object.keys(groupedItems)] as string[]

  const displayItems =
    selectedType === 'all' ? trashItems : groupedItems[selectedType as TrashItem['type']] || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {trashItems.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleEmptyTrash}>
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar Papelera
              </Button>
            )}
          </div>
        </DialogHeader>

        {trashItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Trash2 className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">La papelera está vacía</p>
            <p className="text-sm text-muted-foreground">
              Los elementos que elimines aparecerán aquí y podrás restaurarlos.
            </p>
          </div>
        ) : (
          <Tabs
            value={selectedType}
            onValueChange={setSelectedType}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos ({trashItems.length})</TabsTrigger>
              {Object.entries(groupedItems).map(([type, items]) => (
                <TabsTrigger key={type} value={type}>
                  {TYPE_LABELS[type as TrashItem['type']]} ({items.length})
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value={selectedType} className="mt-0 space-y-2">
                {displayItems.map(item => {
                  const Icon = TYPE_ICONS[item.type]
                  const daysRemaining = getDaysRemaining(item.deletedAt)

                  return (
                    <Card key={item.id} className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg ${TYPE_COLORS[item.type]}`}>
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
                                {daysRemaining > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className={daysRemaining <= 7 ? 'text-destructive' : ''}>
                                      {daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restante
                                      {daysRemaining !== 1 ? 's' : ''}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestore(item)}
                              title="Restaurar"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePermanently(item)}
                              title="Eliminar permanentemente"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
