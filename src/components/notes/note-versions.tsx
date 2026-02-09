'use client'

import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react'
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
import {
  History,
  RotateCcw,
  Eye,
  CheckCircle2,
  Loader2,
  Download,
  Edit2,
  GitCompare,
  BarChart3,
  X,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Trash2,
  FileText,
  FileJson,
  Archive,
  CheckSquare,
  Square,
  Clock,
  TrendingUp,
  Copy,
  File,
  Share2,
  MessageSquare,
  GitMerge,
} from 'lucide-react'
import { trackError } from '@/lib/monitoring'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import JSZip from 'jszip'
import { safeToISODate } from '@/app/api/notes/versions/validation-utils'

// ✅ Enterprise: Usar función segura centralizada para formateo de tiempo
import { formatTimeAgo as formatTimeAgoSafe } from '@/lib/utils'
const formatTimeAgo = formatTimeAgoSafe

export interface NoteVersion {
  id: string
  title: string
  content: string
  tags: string | null
  name?: string | null
  color?: string | null
  isImportant?: boolean
  isCompressed?: boolean
  createdAt: Date
  createdBy: string
}

interface VersionStatistics {
  totalVersions: number
  averageDaysBetweenVersions: number | null
  daysSinceLastUpdate: number
  lastUpdated: string
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
}: Readonly<NoteVersionsProps>) {
  const [versions, setVersions] = useState<NoteVersion[]>([])
  const [allVersions, setAllVersions] = useState<NoteVersion[]>([]) // Todas las versiones sin filtrar
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMoreVersions, setHasMoreVersions] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(null)
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [versionToRestore, setVersionToRestore] = useState<NoteVersion | null>(null)
  const [statistics, setStatistics] = useState<VersionStatistics | null>(null)
  const [showNameEdit, setShowNameEdit] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [comparingVersions, setComparingVersions] = useState(false)
  const [version1ToCompare, setVersion1ToCompare] = useState<NoteVersion | null>(null)
  const [version2ToCompare, setVersion2ToCompare] = useState<NoteVersion | null>(null)
  type TextDiffChunk = { type: 'equal' | 'removed' | 'added'; text: string }
  type DiffResult = {
    hasChanges: boolean
    title: { changed: boolean; old: string; new: string }
    content: { changed: boolean; diff: TextDiffChunk[] }
    tags: { changed: boolean; old: string; new: string }
  }
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null)

  // Estados para búsqueda, filtros y ordenamiento
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc'>('date-desc')
  const [filterNamed, setFilterNamed] = useState<'all' | 'named' | 'unnamed'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Selección múltiple para operaciones en lote
  const [selectedVersions, setSelectedVersions] = useState<Set<string>>(new Set())

  // Estados adicionales para nuevas funcionalidades
  const [versionsToCompare, setVersionsToCompare] = useState<NoteVersion[]>([])
  const [showTimeline, setShowTimeline] = useState(false)
  const [showCharts, setShowCharts] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  type RestoreHistoryItem = { id: string; restoredAt: string | Date }
  const [restoreHistory, setRestoreHistory] = useState<RestoreHistoryItem[]>([])
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState('#3b82f6')
  // savedFilters y maxVersionsLimit no se usan actualmente pero se mantienen para futuras funcionalidades
  // const [_savedFilters, _setSavedFilters] = useState<Array<{ name: string; filters: any }>>([])
  // const [_maxVersionsLimit, _setMaxVersionsLimit] = useState(10)
  const [advancedSearch, setAdvancedSearch] = useState(false)
  const [searchOperator, setSearchOperator] = useState<'AND' | 'OR' | 'NOT'>('AND')
  const [filterImportant, setFilterImportant] = useState<'all' | 'important' | 'not-important'>('all')
  const [previewFontSize, setPreviewFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark' | 'auto'>('auto')
  const [sideBySideView, setSideBySideView] = useState(false)
  const scrollSyncRef1 = useRef<HTMLDivElement>(null)
  const scrollSyncRef2 = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)
  const [showShareDialog, setShowShareDialog] = useState<string | null>(null)
  const [shareMessage, setShareMessage] = useState('')

  // Debounce para búsqueda
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Cargar versiones
  useEffect(() => {
    if (!open || !noteId) return

     
    const loadVersions = async (reset = true) => {
      if (reset) {
        setLoading(true)
        setNextCursor(null)
        setHasMoreVersions(false)
      } else {
        setLoadingMore(true)
      }
      
      try {
        let url = `/api/notes/versions?noteId=${noteId}&limit=20`
        if (nextCursor && !reset) {
          url = `/api/notes/versions?noteId=${noteId}&limit=20&cursor=${nextCursor}`
        }
        
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          const loadedVersions = data.versions || []
          
          if (reset) {
            setAllVersions(loadedVersions)
            setVersions(loadedVersions)
          } else {
            // Agregar nuevas versiones a las existentes
            setAllVersions(prev => [...prev, ...loadedVersions])
            setVersions(prev => [...prev, ...loadedVersions])
          }
          
          setCurrentVersionId(data.currentVersionId || null)
          if (data.statistics) {
            setStatistics(data.statistics)
          }

          // Actualizar información de paginación
          if (data.pagination) {
            setHasMoreVersions(data.pagination.hasMore || false)
            setNextCursor(data.pagination.nextCursor || null)
          }
          
          // Cargar historial de restauraciones (solo en primera carga)
          if (reset) {
            try {
              const historyRes = await fetch(`/api/notes/versions/history?noteId=${noteId}`)
              if (historyRes.ok) {
                const historyData = await historyRes.json()
                setRestoreHistory(historyData.history || [])
              }
            } catch {
              // Silenciar error de historial
            }
          }
        }
      } catch (error) {
        toast.error('Error al cargar versiones')
        trackError(error instanceof Error ? error : new Error(String(error)), {
          type: 'note_versions_load_error',
          noteId: noteId || 'unknown',
        })
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }

    loadVersions(true)
    // nextCursor se actualiza dentro de loadVersions, no debe estar en deps para evitar loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, noteId])

  // Resetear página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, sortBy, filterNamed, dateFilter])

  // Filtrar, ordenar y paginar versiones
   
  const filteredAndSortedVersions = useMemo(() => {
    let filtered = [...allVersions]

    // Filtro por búsqueda (con soporte para búsqueda exacta entre comillas y búsqueda por contenido)
    if (debouncedSearchQuery.trim() && !advancedSearch) {
      const query = debouncedSearchQuery.trim()
      
      // Detectar búsqueda por contenido específico: contenido:"texto"
      const contentSearchMatch = /^contenido:"(.+)"$/i.exec(query)
      if (contentSearchMatch) {
        const contentQuery = contentSearchMatch[1].toLowerCase()
        filtered = filtered.filter(v =>
          v.content.toLowerCase().includes(contentQuery)
        )
      }
      // Detectar búsqueda exacta (entre comillas)
      else {
        const exactMatch = /^"(.+)"$/.exec(query)
        if (exactMatch) {
          const exactQuery = exactMatch[1].toLowerCase()
          filtered = filtered.filter(
            v =>
              v.title.toLowerCase().includes(exactQuery) ||
              v.content.toLowerCase().includes(exactQuery) ||
              (v.name && v.name.toLowerCase().includes(exactQuery)) ||
              (v.tags && v.tags.toLowerCase().includes(exactQuery))
          )
        } else {
          // Búsqueda normal
          const lowerQuery = query.toLowerCase()
          filtered = filtered.filter(
            v =>
              v.title.toLowerCase().includes(lowerQuery) ||
              v.content.toLowerCase().includes(lowerQuery) ||
              (v.name && v.name.toLowerCase().includes(lowerQuery)) ||
              (v.tags && v.tags.toLowerCase().includes(lowerQuery))
          )
        }
      }
    }

    // Filtro por nombre personalizado
    if (filterNamed === 'named') {
      filtered = filtered.filter(v => v.name && v.name.trim() !== '')
    } else if (filterNamed === 'unnamed') {
      filtered = filtered.filter(v => !v.name || v.name.trim() === '')
    }

    // Filtro por importancia
    if (filterImportant === 'important') {
      filtered = filtered.filter(v => v.isImportant)
    } else if (filterImportant === 'not-important') {
      filtered = filtered.filter(v => !v.isImportant)
    }

    // Búsqueda avanzada con operadores
    if (debouncedSearchQuery.trim() && advancedSearch) {
      const query = debouncedSearchQuery.toLowerCase()
      const words = query.split(/\s+/).filter(w => w.length > 0)
      
      if (searchOperator === 'AND') {
        filtered = filtered.filter(v => {
          return words.every(word => {
            const searchIn = `${v.title} ${v.content} ${v.name || ''} ${v.tags || ''}`.toLowerCase()
            return searchIn.includes(word)
          })
        })
      } else if (searchOperator === 'OR') {
        filtered = filtered.filter(v => {
          const searchIn = `${v.title} ${v.content} ${v.name || ''} ${v.tags || ''}`.toLowerCase()
          return words.some(word => searchIn.includes(word))
        })
      } else if (searchOperator === 'NOT') {
        filtered = filtered.filter(v => {
          const searchIn = `${v.title} ${v.content} ${v.name || ''} ${v.tags || ''}`.toLowerCase()
          return !words.some(word => searchIn.includes(word))
        })
      }
    }

    // Filtro por fecha
    if (dateFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(v => {
        const versionDate = new Date(v.createdAt)
        switch (dateFilter) {
          case 'today':
            return versionDate.toDateString() === now.toDateString()
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return versionDate >= weekAgo
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return versionDate >= monthAgo
          }
          case 'year': {
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            return versionDate >= yearAgo
          }
          default:
            return true
        }
      })
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'name-asc': {
          const nameA = (a.name || a.title || '').toLowerCase()
          const nameB = (b.name || b.title || '').toLowerCase()
          return nameA.localeCompare(nameB)
        }
        case 'name-desc': {
          const nameA2 = (a.name || a.title || '').toLowerCase()
          const nameB2 = (b.name || b.title || '').toLowerCase()
          return nameB2.localeCompare(nameA2)
        }
        case 'size-desc':
          return b.content.length - a.content.length
        case 'size-asc':
          return a.content.length - b.content.length
        default:
          return 0
      }
    })

    return filtered
  }, [allVersions, debouncedSearchQuery, sortBy, filterNamed, filterImportant, dateFilter, advancedSearch, searchOperator])

  // Paginación
  const paginatedVersions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedVersions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedVersions, currentPage])

  const totalPages = Math.ceil(filteredAndSortedVersions.length / itemsPerPage)

  // Atajos de teclado
  useKeyboardShortcuts([
    {
      key: 'f',
      ctrl: true,
      description: 'Buscar versiones',
      action: () => {
        const searchInput = document.querySelector('[aria-label="Buscar versiones"]') as HTMLInputElement
        searchInput?.focus()
      },
    },
    {
      key: 'Escape',
      description: 'Cerrar diálogos',
      action: () => {
        if (showRestoreDialog) setShowRestoreDialog(false)
        if (comparingVersions) resetComparison()
        if (showNameEdit) {
          setShowNameEdit(null)
          setEditingName('')
        }
        if (showColorPicker) {
          setShowColorPicker(null)
        }
        if (selectedVersion) setSelectedVersion(null)
      },
    },
    {
      key: 'r',
      ctrl: true,
      shift: true,
      description: 'Restaurar versión seleccionada',
      action: () => {
        if (selectedVersion && selectedVersion.id !== currentVersionId && open) {
          handleRestoreClick(selectedVersion)
        }
      },
    },
    {
      key: 'd',
      ctrl: true,
      description: 'Duplicar versión seleccionada',
      action: () => {
        if (selectedVersion && open) {
          handleDuplicateVersion(selectedVersion)
        }
      },
    },
    {
      key: 'ArrowDown',
      description: 'Siguiente versión',
      action: () => {
        if (paginatedVersions.length > 0 && open) {
          const currentIndex = selectedVersion
            ? paginatedVersions.findIndex(v => v.id === selectedVersion.id)
            : -1
          const nextIndex = currentIndex < paginatedVersions.length - 1 ? currentIndex + 1 : 0
          const next = paginatedVersions.at(nextIndex)
          if (next) setSelectedVersion(next)
        }
      },
    },
    {
      key: 'ArrowUp',
      description: 'Versión anterior',
      action: () => {
        if (paginatedVersions.length > 0 && open) {
          const currentIndex = selectedVersion
            ? paginatedVersions.findIndex(v => v.id === selectedVersion.id)
            : -1
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : paginatedVersions.length - 1
          const prev = paginatedVersions.at(prevIndex)
          if (prev) setSelectedVersion(prev)
        }
      },
    },
    {
      key: 'c',
      ctrl: true,
      description: 'Copiar versión al portapapeles',
      action: () => {
        if (selectedVersion && open) {
          handleCopyToClipboard(selectedVersion)
        }
      },
    },
    {
      key: 'e',
      ctrl: true,
      description: 'Exportar versión seleccionada',
      action: () => {
        if (selectedVersion && open) {
          handleExport(selectedVersion, 'txt')
        }
      },
    },
  ])

  const handleRestoreClick = (version: NoteVersion) => {
    setVersionToRestore(version)
    setShowRestoreDialog(true)
  }

  const handleRestore = async () => {
    if (!versionToRestore) return

    setRestoring(true)
    try {
      const res = await fetch(`/api/notes/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId,
          versionId: versionToRestore.id,
        }),
      })

      if (res.ok) {
        await res.json()
        toast.success('Versión restaurada correctamente', {
          description: 'La nota ha sido restaurada a esta versión',
        })
        if (onRestore) {
          onRestore(versionToRestore)
        }
        setShowRestoreDialog(false)
        setVersionToRestore(null)
        onOpenChange(false)
        // Recargar versiones para mostrar la nueva versión actual
        const loadVersions = async () => {
          try {
            const versionsRes = await fetch(`/api/notes/versions?noteId=${noteId}`)
            if (versionsRes.ok) {
              const versionsData = await versionsRes.json()
              setVersions(versionsData.versions || [])
              setCurrentVersionId(versionsData.currentVersionId || null)
              if (versionsData.statistics) {
                setStatistics(versionsData.statistics)
              }
            }
          } catch {
            // Silenciar error de recarga
          }
        }
        loadVersions()
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }))
        toast.error('Error al restaurar versión', {
          description: errorData.error || 'No se pudo restaurar la versión',
        })
        trackError(new Error(errorData.error || 'Error al restaurar versión'), {
          type: 'note_version_restore_error',
          noteId: noteId || 'unknown',
          versionId: versionToRestore.id,
          status: res.status,
        })
      }
    } catch (error) {
      toast.error('Error al restaurar versión', {
        description: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
      })
      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'note_version_restore_error',
        noteId: noteId || 'unknown',
        versionId: versionToRestore.id,
      })
    } finally {
      setRestoring(false)
    }
  }

  const handleExport = async (version: NoteVersion, format: 'txt' | 'md' | 'pdf') => {
    try {
      const url = `/api/notes/versions/export?noteId=${noteId}&versionId=${version.id}&format=${format}`
      
      if (format === 'pdf') {
        // Para PDF, necesitamos hacer fetch y crear blob
        const res = await fetch(url)
        if (!res.ok) throw new Error('Error al exportar')
        const blob = await res.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${version.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${safeToISODate(new Date(version.createdAt))}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      } else {
        const link = document.createElement('a')
        link.href = url
        link.download = ''
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      toast.success('Versión exportada', {
        description: `La versión se ha descargado como ${format.toUpperCase()}`,
      })
    } catch (error) {
      toast.error('Error al exportar versión', {
        description: 'No se pudo descargar la versión',
      })
      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'note_version_export_error',
        noteId: noteId || 'unknown',
        versionId: version.id,
      })
    }
  }

  const handleCopyToClipboard = async (version: NoteVersion) => {
    try {
      const tagsSuffix = version.tags ? `\n\nTags: ${version.tags}` : ''
      const textToCopy = `${version.title}\n\n${version.content}${tagsSuffix}`
      await navigator.clipboard.writeText(textToCopy)
      toast.success('Copiado al portapapeles', {
        description: 'El contenido de la versión se ha copiado',
      })
    } catch (error) {
      toast.error('Error al copiar', {
        description: 'No se pudo copiar al portapapeles',
      })
      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'note_version_copy_error',
        noteId: noteId || 'unknown',
        versionId: version.id,
      })
    }
  }

  const handleDeleteVersion = async (version: NoteVersion) => {
    if (version.id === currentVersionId) {
      toast.error('No se puede eliminar la versión actual')
      return
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar esta versión?\n\n"${version.name || version.title}"\n\nEsta acción no se puede deshacer.`)) {
      return
    }

    try {
      const res = await fetch(`/api/notes/versions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId,
          versionId: version.id,
        }),
      })

      if (res.ok) {
        toast.success('Versión eliminada', {
          description: 'La versión se ha eliminado correctamente',
        })
        // Recargar versiones
        const versionsRes = await fetch(`/api/notes/versions?noteId=${noteId}`)
        if (versionsRes.ok) {
          const versionsData = await versionsRes.json()
          setAllVersions(versionsData.versions || [])
          setVersions(versionsData.versions || [])
          if (versionsData.statistics) {
            setStatistics(versionsData.statistics)
          }
        }
        // Limpiar selección si estaba seleccionada
        if (selectedVersions.has(version.id)) {
          setSelectedVersions(prev => {
            const newSet = new Set(prev)
            newSet.delete(version.id)
            return newSet
          })
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }))
        toast.error('Error al eliminar versión', {
          description: errorData.error || 'No se pudo eliminar la versión',
        })
      }
    } catch (error) {
      toast.error('Error al eliminar versión', {
        description: 'Ocurrió un error inesperado',
      })
      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'note_version_delete_error',
        noteId: noteId || 'unknown',
        versionId: version.id,
      })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedVersions.size === 0) {
      toast.error('No hay versiones seleccionadas')
      return
    }

    const selected = allVersions.filter(v => selectedVersions.has(v.id))
    const hasCurrent = selected.some(v => v.id === currentVersionId)
    
    if (hasCurrent) {
      toast.error('No se puede eliminar la versión actual')
      return
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar ${selectedVersions.size} versión(es)?\n\nEsta acción no se puede deshacer.`)) {
      return
    }

    try {
      const res = await fetch(`/api/notes/versions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId,
          versionIds: Array.from(selectedVersions),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success('Versiones eliminadas', {
          description: `${data.deletedCount || selectedVersions.size} versión(es) eliminada(s)`,
        })
        // Recargar versiones
        const versionsRes = await fetch(`/api/notes/versions?noteId=${noteId}`)
        if (versionsRes.ok) {
          const versionsData = await versionsRes.json()
          setAllVersions(versionsData.versions || [])
          setVersions(versionsData.versions || [])
          if (versionsData.statistics) {
            setStatistics(versionsData.statistics)
          }
        }
        setSelectedVersions(new Set())
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }))
        toast.error('Error al eliminar versiones', {
          description: errorData.error || 'No se pudieron eliminar las versiones',
        })
      }
    } catch (error) {
      toast.error('Error al eliminar versiones', {
        description: 'Ocurrió un error inesperado',
      })
      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'note_version_bulk_delete_error',
        noteId: noteId || 'unknown',
      })
    }
  }

  const handleEditName = (version: NoteVersion) => {
    setShowNameEdit(version.id)
    setEditingName(version.name || '')
  }

  const handleSaveName = async (version: NoteVersion) => {
    if (version.id === currentVersionId) {
      toast.error('No se puede nombrar la versión actual')
      return
    }

    setSavingName(true)
    try {
      const res = await fetch(`/api/notes/versions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId,
          versionId: version.id,
          name: editingName.trim() || undefined,
        }),
      })

      if (res.ok) {
        toast.success('Nombre actualizado', {
          description: 'El nombre de la versión se ha actualizado correctamente',
        })
        setShowNameEdit(null)
        // Recargar versiones
        const versionsRes = await fetch(`/api/notes/versions?noteId=${noteId}`)
        if (versionsRes.ok) {
          const versionsData = await versionsRes.json()
          setVersions(versionsData.versions || [])
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }))
        toast.error('Error al actualizar nombre', {
          description: errorData.error || 'No se pudo actualizar el nombre',
        })
      }
    } catch (error) {
      toast.error('Error al actualizar nombre', {
        description: 'Ocurrió un error inesperado',
      })
      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'note_version_name_update_error',
        noteId: noteId || 'unknown',
        versionId: version.id,
      })
    } finally {
      setSavingName(false)
    }
  }

  const handleCompareClick = (version: NoteVersion) => {
    if (!version1ToCompare) {
      setVersion1ToCompare(version)
      toast.info('Versión seleccionada', {
        description: 'Selecciona otra versión para comparar',
      })
    } else if (version1ToCompare.id === version.id) {
      toast.error('No puedes comparar una versión consigo misma')
    } else {
      setVersion2ToCompare(version)
      setComparingVersions(true)
      // Cargar comparación
      const loadComparison = async () => {
        try {
          const res = await fetch(`/api/notes/versions/compare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              noteId,
              versionId1: version1ToCompare.id,
              versionId2: version.id,
            }),
          })
          if (res.ok) {
            const data = await res.json()
            setDiffResult(data.diff)
          } else {
            toast.error('Error al comparar versiones')
          }
        } catch (error) {
          toast.error('Error al comparar versiones')
          trackError(error instanceof Error ? error : new Error(String(error)), {
            type: 'note_version_compare_error',
            noteId: noteId || 'unknown',
          })
        }
      }
      loadComparison()
    }
  }

  const resetComparison = () => {
    setVersion1ToCompare(null)
    setVersion2ToCompare(null)
    setComparingVersions(false)
    setDiffResult(null)
  }

  // Operaciones en lote
  const toggleVersionSelection = (versionId: string) => {
    setSelectedVersions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(versionId)) {
        newSet.delete(versionId)
      } else {
        newSet.add(versionId)
      }
      return newSet
    })
  }

  const selectAllVersions = () => {
    if (selectedVersions.size === paginatedVersions.length) {
      setSelectedVersions(new Set())
    } else {
      setSelectedVersions(new Set(paginatedVersions.map(v => v.id)))
    }
  }

   
  const handleBulkExport = async (format: 'txt' | 'md' | 'pdf' | 'json' | 'zip' | 'docx' | 'odt' | 'rtf') => {
    if (selectedVersions.size === 0) {
      toast.error('No hay versiones seleccionadas')
      return
    }

    try {
      const selected = allVersions.filter(v => selectedVersions.has(v.id))
      
      if (format === 'json') {
        const data = JSON.stringify(selected, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `versiones_${safeToISODate(new Date())}.json`
        link.click()
        URL.revokeObjectURL(url)
        toast.success('Versiones exportadas', {
          description: `${selected.length} versiones exportadas como JSON`,
        })
      } else if (format === 'zip') {
        // Exportar como ZIP
        const zip = new JSZip()
        const dateStr = safeToISODate(new Date()) || 'unknown'

        for (const version of selected) {
          const safeTitle = version.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
          const dateVersion = safeToISODate(new Date(version.createdAt))
          
          let content = `${version.title}\n`
          content += `${'='.repeat(version.title.length)}\n\n`
          if (version.tags) {
            content += `Tags: ${version.tags}\n`
          }
          if (version.name) {
            content += `Nombre: ${version.name}\n`
          }
          content += `Fecha: ${new Date(version.createdAt).toLocaleString('es-CL')}\n\n`
          content += `${'-'.repeat(50)}\n\n`
          content += version.content
          zip.file(`${safeTitle}_${dateVersion}.txt`, content)
        }

        // Generar y descargar ZIP
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(zipBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `versiones_${dateStr}.zip`
        link.click()
        URL.revokeObjectURL(url)
        toast.success('Versiones exportadas', {
          description: `${selected.length} versiones exportadas como ZIP`,
        })
      } else if (format === 'docx' || format === 'odt' || format === 'rtf') {
        // Exportación a formatos de documentos (requiere backend)
        try {
          const res = await fetch('/api/notes/versions/export-bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              noteId,
              versionIds: selected.map(v => v.id),
              format,
            }),
          })

          if (res.ok) {
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            const dateStr = safeToISODate(new Date())
            link.href = url
            link.download = `versiones_${dateStr}.${format}`
            link.click()
            URL.revokeObjectURL(url)
            toast.success('Versiones exportadas', {
              description: `${selected.length} versiones exportadas como ${format.toUpperCase()}`,
            })
          } else {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }))
            toast.error('Error al exportar', {
              description: errorData.error || 'No se pudo generar el documento',
            })
          }
        } catch (error) {
          toast.error('Error al exportar', {
            description: 'Ocurrió un error inesperado',
          })
          trackError(error instanceof Error ? error : new Error(String(error)), {
            type: 'note_version_bulk_export_error',
          })
        }
      } else {
        // Exportar múltiples archivos (el navegador descargará cada uno)
        for (const version of selected) {
          await handleExport(version, format)
          // Pequeño delay para evitar bloqueos del navegador
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        toast.success('Versiones exportadas', {
          description: `${selected.length} versiones exportadas`,
        })
      }
      setSelectedVersions(new Set())
    } catch (error) {
      toast.error('Error al exportar versiones')
      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'note_version_bulk_export_error',
      })
    }
  }

  // Mejorar diff visual - función auxiliar para resaltar cambios palabra por palabra
   
  const highlightWordDiff = (oldText: string, newText: string) => {
    const oldWords = oldText.split(/(\s+)/)
    const newWords = newText.split(/(\s+)/)
    const result: Array<{ type: 'removed' | 'added' | 'equal'; text: string }> = []

    // Algoritmo simple de comparación palabra por palabra
    let oldIdx = 0
    let newIdx = 0

    while (oldIdx < oldWords.length || newIdx < newWords.length) {
      if (oldIdx >= oldWords.length) {
        const w = newWords.at(newIdx)
        if (typeof w === 'string') result.push({ type: 'added', text: w })
        newIdx++
      } else if (newIdx >= newWords.length) {
        const w = oldWords.at(oldIdx)
        if (typeof w === 'string') result.push({ type: 'removed', text: w })
        oldIdx++
      } else if (oldWords.at(oldIdx) === newWords.at(newIdx)) {
        const w = oldWords.at(oldIdx)
        if (typeof w === 'string') result.push({ type: 'equal', text: w })
        oldIdx++
        newIdx++
      } else {
        // Buscar la siguiente palabra igual
        let found = false
        for (let i = newIdx + 1; i < Math.min(newIdx + 10, newWords.length); i++) {
          const oldWord = oldWords.at(oldIdx)
          const newWord = newWords.at(i)
          if (typeof oldWord === 'string' && oldWord === newWord) {
            for (let j = newIdx; j < i; j++) {
              const w = newWords.at(j)
              if (typeof w === 'string') result.push({ type: 'added', text: w })
            }
            const w = newWords.at(i)
            if (typeof w === 'string') result.push({ type: 'equal', text: w })
            newIdx = i + 1
            oldIdx++
            found = true
            break
          }
        }
        if (!found) {
          const oldWord = oldWords.at(oldIdx)
          const newWord = newWords.at(newIdx)
          if (typeof oldWord === 'string') result.push({ type: 'removed', text: oldWord })
          if (typeof newWord === 'string') result.push({ type: 'added', text: newWord })
          oldIdx++
          newIdx++
        }
      }
    }

    return result
  }

  const pulseVersionCard = (versionId: string) => {
    const card = document.querySelector(`[data-version-id="${versionId}"]`)
    if (!card) return
    card.classList.add('animate-pulse')
    window.setTimeout(() => {
      card.classList.remove('animate-pulse')
    }, 500)
  }

  const handleVersionCardClick = (version: NoteVersion) => {
    setSelectedVersion(version)
    pulseVersionCard(version.id)
  }

  const handleVersionMouseEnter = (versionId: string) => {
    setHoveredVersion(versionId)
    const el = document.querySelector(`[data-version-id="${versionId}"]`) as HTMLElement | null
    const rect = el?.getBoundingClientRect()
    if (rect) {
      setPreviewPosition({ x: rect.right + 10, y: rect.top })
    }
  }

  const handleVersionMouseLeave = () => {
    window.setTimeout(() => {
      if (!document.querySelector('[data-preview-tooltip]')?.matches(':hover')) {
        setHoveredVersion(null)
      }
    }, 100)
  }

  const focusVersionCardAtIndex = (index: number) => {
    const id = paginatedVersions.at(index)?.id
    if (!id) return
    const el = document.querySelector(`[data-version-id="${id}"]`) as HTMLElement | null
    el?.focus()
  }

  return (
    <>
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

        {/* Estadísticas */}
        {statistics && versions.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold">{statistics.totalVersions}</div>
                <div className="text-xs text-muted-foreground">Versiones</div>
              </div>
              {statistics.averageDaysBetweenVersions !== null && (
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {statistics.averageDaysBetweenVersions.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Días promedio</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-lg font-bold">
                  {statistics.daysSinceLastUpdate.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Días desde actualización</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold">
                  {new Date(statistics.lastUpdated).toLocaleDateString('es-CL')}
                </div>
                <div className="text-xs text-muted-foreground">Última actualización</div>
              </div>
            </div>

            {/* Gráficos de estadísticas */}
            {showCharts && allVersions.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <Tabs defaultValue="frequency">
                    <TabsList>
                      <TabsTrigger value="frequency">Frecuencia</TabsTrigger>
                      <TabsTrigger value="size">Tamaño</TabsTrigger>
                    </TabsList>
                    <TabsContent value="frequency" className="mt-4">
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={allVersions.slice().reverse().map((v, idx) => ({
                          fecha: new Date(v.createdAt).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
                          version: idx + 1,
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="fecha" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="version" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="size" className="mt-4">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={allVersions.slice().reverse().map((v, idx) => ({
                          version: `V${idx + 1}`,
                          tamaño: v.content.length,
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="version" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="tamaño" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Timeline visual */}
            {showTimeline && allVersions.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-4">Timeline de Versiones</h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-4">
                      {allVersions.slice().reverse().map((version) => {
                        const isCurrent = version.id === currentVersionId
                        return (
                          <div key={version.id} className="relative flex items-start gap-4">
                            <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                              isCurrent ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border'
                            }`}>
                              {isCurrent ? <CheckCircle2 className="h-4 w-4" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground" />}
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{version.name || version.title}</span>
                                {version.color && (
                                  <div
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: version.color }}
                                  />
                                )}
                                {version.isImportant && (
                                  <Badge variant="default" className="text-xs">Importante</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatTimeAgo(new Date(version.createdAt))}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Historial de restauraciones */}
            {showHistory && restoreHistory.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-4">Historial de Restauraciones</h4>
                  <div className="space-y-2">
                    {restoreHistory.map((restore) => (
                      <div key={restore.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">Versión restaurada</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(restore.restoredAt))}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {new Date(restore.restoredAt).toLocaleString('es-CL')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {(() => {
          if (loading) {
            return (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Cargando versiones...</div>
              </div>
            )
          }

          if (allVersions.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <History className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg font-semibold mb-2">No hay versiones guardadas</p>
                <p className="text-sm text-muted-foreground">
                  Las versiones se guardan automáticamente cuando realizas cambios importantes.
                </p>
              </div>
            )
          }

          return (
            <div key="versions-list">
            {/* Controles de búsqueda, filtros y ordenamiento */}
            <div className="space-y-3 border-b pb-3">
              {/* Búsqueda */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar versiones por título, contenido, nombre o tags..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Buscar versiones"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setSearchQuery('')}
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span>💡 Tip: Usa comillas para buscar texto exacto, ej: &quot;texto específico&quot;</span>
                  <span>•</span>
                  <span>Busca dentro del contenido con: contenido:&quot;texto&quot;</span>
                </div>
                {advancedSearch && (
                  <div className="flex items-center gap-2">
                    <Select value={searchOperator} onValueChange={setSearchOperator as (value: string) => void}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">Y (AND)</SelectItem>
                        <SelectItem value="OR">O (OR)</SelectItem>
                        <SelectItem value="NOT">NO (NOT)</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">
                      {searchOperator === 'AND' && 'Todas las palabras'}
                      {searchOperator === 'OR' && 'Cualquier palabra'}
                      {searchOperator === 'NOT' && 'Excluir palabras'}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAdvancedSearch(!advancedSearch)}
                  >
                    {advancedSearch ? 'Búsqueda simple' : 'Búsqueda avanzada'}
                  </Button>
                  {savedFilters.length > 0 && (
                    <Select onValueChange={(value) => {
                      const filter = savedFilters.find(f => f.name === value)
                      if (filter) handleLoadFilter(filter)
                    }}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtros guardados" />
                      </SelectTrigger>
                      <SelectContent>
                        {savedFilters.map((filter, idx) => (
                          <SelectItem key={idx} value={filter.name}>
                            {filter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveFilter}
                  >
                    Guardar filtros
                  </Button>
                </div>
              </div>

              {/* Filtros y ordenamiento */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Select value={sortBy} onValueChange={setSortBy as (value: string) => void}>
                  <SelectTrigger>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ordenar por..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Fecha (más reciente)</SelectItem>
                    <SelectItem value="date-asc">Fecha (más antigua)</SelectItem>
                    <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
                    <SelectItem value="size-desc">Tamaño (mayor)</SelectItem>
                    <SelectItem value="size-asc">Tamaño (menor)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterNamed} onValueChange={setFilterNamed as (value: string) => void}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por nombre..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las versiones</SelectItem>
                    <SelectItem value="named">Con nombre personalizado</SelectItem>
                    <SelectItem value="unnamed">Sin nombre personalizado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter as (value: string) => void}>
                  <SelectTrigger>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por fecha..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las fechas</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mes</SelectItem>
                    <SelectItem value="year">Último año</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterImportant} onValueChange={setFilterImportant as (value: string) => void}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Importancia..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="important">Importantes</SelectItem>
                    <SelectItem value="not-important">No importantes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botones de vista adicionales */}
              <div className="flex items-center gap-2">
                <Button
                  variant={showTimeline ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowTimeline(!showTimeline)}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Timeline
                </Button>
                <Button
                  variant={showCharts ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowCharts(!showCharts)}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Gráficos
                </Button>
                <Button
                  variant={showHistory ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="h-4 w-4 mr-1" />
                  Historial
                </Button>
                {versionsToCompare.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCompareMultiple}
                    >
                      <GitCompare className="h-4 w-4 mr-1" />
                      Comparar {versionsToCompare.length}
                    </Button>
                    {versionsToCompare.length >= 2 && versionsToCompare.length <= 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMergeDialog(true)}
                      >
                        <GitMerge className="h-4 w-4 mr-1" />
                        Fusionar {versionsToCompare.length}
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Información de resultados */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Mostrando {paginatedVersions.length} de {filteredAndSortedVersions.length} versiones
                  {filteredAndSortedVersions.length !== allVersions.length && ` (${allVersions.length} total)`}
                </span>
                {selectedVersions.size > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{selectedVersions.size} seleccionadas</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVersions(new Set())}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Operaciones en lote */}
            {selectedVersions.size > 0 && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                <span className="text-sm font-medium">{selectedVersions.size} versiones seleccionadas</span>
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkExport('txt')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    TXT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkExport('md')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    MD
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkExport('pdf')}
                  >
                    <File className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkExport('json')}
                  >
                    <FileJson className="h-4 w-4 mr-1" />
                    JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkExport('zip')}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    ZIP
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkExport('docx')}
                    title="Exportar como DOCX (Word)"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    DOCX
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkExport('rtf')}
                    title="Exportar como RTF"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    RTF
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            )}

            {/* Lista de versiones */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {paginatedVersions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">No se encontraron versiones</p>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                  {(searchQuery || filterNamed !== 'all' || dateFilter !== 'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('')
                        setFilterNamed('all')
                        setDateFilter('all')
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {/* Checkbox para seleccionar todas */}
                  {paginatedVersions.length > 0 && (
                    <div className="flex items-center gap-2 p-2 border-b">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={selectAllVersions}
                        aria-label="Seleccionar todas las versiones"
                      >
                        {selectedVersions.size === paginatedVersions.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Seleccionar todas en esta página
                      </span>
                    </div>
                  )}

                  {paginatedVersions.map((version, idx) => {
              const isCurrent = version.id === currentVersionId
              const isSelected = selectedVersion?.id === version.id
              let versionBadgeContent: React.ReactNode = <>Versión {paginatedVersions.length - idx}</>
              if (isCurrent) {
                versionBadgeContent = (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Versión actual
                  </>
                )
              } else if (version.name) {
                versionBadgeContent = <>{version.name}</>
              }

              return (
                <Card
                  key={version.id}
                  className={`cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent/50 hover:shadow-md hover:scale-[1.01] ${
                    isSelected ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''
                  } ${isCurrent ? 'border-primary/50 bg-primary/5' : ''} ${
                    selectedVersions.has(version.id) ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20 animate-pulse' : ''
                  } animate-in fade-in slide-in-from-bottom-2`}
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                  onClick={() => handleVersionCardClick(version)}
                  onMouseEnter={() => handleVersionMouseEnter(version.id)}
                  onMouseLeave={handleVersionMouseLeave}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    version.name
                      ? `Versión ${version.name}`
                      : `Versión del ${formatTimeAgo(new Date(version.createdAt))}`
                  }
                  aria-describedby={`version-${version.id}-description`}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedVersion(version)
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      if (idx < paginatedVersions.length - 1) focusVersionCardAtIndex(idx + 1)
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      if (idx > 0) focusVersionCardAtIndex(idx - 1)
                    }
                  }}
                  data-version-id={version.id}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Checkbox de selección */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1"
                        onClick={e => {
                          e.stopPropagation()
                          toggleVersionSelection(version.id)
                        }}
                        aria-label={`Seleccionar versión ${version.name || version.title}`}
                      >
                        {selectedVersions.has(version.id) ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge
                            variant={isCurrent ? 'default' : 'outline'}
                            style={
                              version.color && !isCurrent
                                ? { borderColor: version.color, color: version.color }
                                : undefined
                            }
                          >
                            {versionBadgeContent}
                          </Badge>
                          {version.color && (
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: version.color }}
                              title="Color de etiqueta"
                            />
                          )}
                          {version.isImportant && (
                            <Badge variant="default" className="text-xs bg-yellow-500">
                              ⭐ Importante
                            </Badge>
                          )}
                          {version.isCompressed && (
                            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 dark:text-blue-400 dark:border-blue-600">
                              <Archive className="h-3 w-3 mr-1" />
                              Comprimida
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(version.createdAt))}
                          </span>
                          {version.name && !isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Nombre personalizado
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold mb-1 truncate">{version.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {version.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {version.content.length} caracteres
                            {version.isCompressed && (
                              <span className="text-blue-600 dark:text-blue-400" title="Versión comprimida - se descomprime automáticamente al acceder">
                                (comprimida)
                              </span>
                            )}
                          </span>
                          {idx > 0 && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {Math.abs(version.content.length - (paginatedVersions[idx - 1]?.content.length || 0))} cambios
                            </span>
                          )}
                        </div>
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
                      <div className="flex items-center gap-1 flex-shrink-0 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation()
                            setSelectedVersion(version)
                          }}
                          title="Ver versión"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!isCurrent && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation()
                                handleEditName(version)
                              }}
                              title="Editar nombre"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation()
                                handleCompareClick(version)
                              }}
                              title="Comparar versión"
                              className={
                                version1ToCompare?.id === version.id
                                  ? 'bg-primary/20'
                                  : ''
                              }
                            >
                              <GitCompare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation()
                                handleCopyToClipboard(version)
                              }}
                              title="Copiar al portapapeles"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation()
                                setShowShareDialog(version.id)
                                setShareMessage('')
                              }}
                              title="Compartir versión"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation()
                                if (showComments === version.id) {
                                  setShowComments(null)
                                } else {
                                  setShowComments(version.id)
                                  loadComments(version.id)
                                }
                              }}
                              title="Ver comentarios"
                              className={showComments === version.id ? 'bg-primary/20' : ''}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation()
                                handleExport(version, 'txt')
                              }}
                              title="Exportar como TXT"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation()
                                handleExport(version, 'pdf')
                              }}
                              title="Exportar como PDF"
                            >
                              <File className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation()
                                handleDuplicateVersion(version)
                              }}
                              title="Duplicar versión"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation()
                                handleDeleteVersion(version)
                              }}
                              title="Eliminar versión"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

                </div>
              )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="border-t pt-4 mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {/* Botón para cargar más versiones (lazy loading) */}
            {hasMoreVersions && (
              <div className="border-t pt-4 mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!loadingMore && nextCursor) {
                      const url = `/api/notes/versions?noteId=${noteId}&limit=20&cursor=${nextCursor}`
                      try {
                        setLoadingMore(true)
                        const res = await fetch(url)
                        if (res.ok) {
                          const data = await res.json()
                          const loadedVersions = data.versions || []
                          setVersions(prev => [...prev, ...loadedVersions])
                          setAllVersions(prev => [...prev, ...loadedVersions])
                          
                          if (data.pagination) {
                            setHasMoreVersions(data.pagination.hasMore || false)
                            setNextCursor(data.pagination.nextCursor || null)
                          }
                        }
                      } catch {
                        toast.error('Error al cargar más versiones')
                      } finally {
                        setLoadingMore(false)
                      }
                    }
                  }}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Cargar más versiones
                    </>
                  )}
                </Button>
              </div>
            )}
            </div>
            </div>
          )
        })()}

        {/* Editar nombre */}
        {showNameEdit && (
          <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <Label>Nombre de la versión</Label>
              <div className="flex gap-2">
                <Input
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  placeholder="Ej: Versión final antes del examen"
                  maxLength={100}
                />
                <Button
                  onClick={() => {
                    const version = allVersions.find(v => v.id === showNameEdit)
                    if (version) handleSaveName(version)
                  }}
                  disabled={savingName}
                  size="sm"
                >
                  {savingName ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Guardar'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNameEdit(null)
                    setEditingName('')
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {editingName.length}/100 caracteres
              </p>
            </div>
          </div>
        )}

        {/* Comparación de versiones */}
        {comparingVersions && version1ToCompare && version2ToCompare && diffResult && (
          <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2">
                  <GitCompare className="h-4 w-4" />
                  Comparación de Versiones
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant={sideBySideView ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSideBySideView(!sideBySideView)}
                    title="Alternar vista lado a lado"
                  >
                    <GitCompare className="h-4 w-4 mr-1" />
                    {sideBySideView ? 'Vista vertical' : 'Vista lado a lado'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={resetComparison}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Card>
                <CardContent className="p-4 space-y-4">
                  {sideBySideView ? (
                    // Vista lado a lado
                    <div className="grid grid-cols-2 gap-4">
                      {/* Versión 1 - Izquierda */}
                      <div className="border-r pr-4">
                        <div className="sticky top-0 bg-background pb-2 mb-2 border-b">
                          <h5 className="font-semibold mb-1">Versión 1</h5>
                          <p className="text-sm text-muted-foreground">
                            {version1ToCompare.name || version1ToCompare.title || 'Versión anterior'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(version1ToCompare.createdAt))}
                          </p>
                        </div>
                        <div
                          ref={scrollSyncRef1}
                          className="space-y-2 max-h-[500px] overflow-y-auto"
                          onScroll={(e) => {
                            if (!isScrollingRef.current && scrollSyncRef2.current) {
                              isScrollingRef.current = true
                              scrollSyncRef2.current.scrollTop = e.currentTarget.scrollTop
                              requestAnimationFrame(() => {
                                isScrollingRef.current = false
                              })
                            }
                          }}
                        >
                          <div>
                            <h6 className="font-semibold text-sm mb-2">Título:</h6>
                            <div className="p-3 bg-muted/30 rounded border">
                              <p className="text-sm">{version1ToCompare.title}</p>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-semibold text-sm mb-2">Contenido:</h6>
                            <div className="p-3 bg-muted/30 rounded border max-h-[400px] overflow-y-auto">
                              <pre className="text-sm whitespace-pre-wrap font-mono">
                                {version1ToCompare.content}
                              </pre>
                            </div>
                          </div>
                          {version1ToCompare.tags && (
                            <div>
                              <h6 className="font-semibold text-sm mb-2">Tags:</h6>
                              <div className="flex flex-wrap gap-1">
                                {version1ToCompare.tags.split(',').map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Versión 2 - Derecha */}
                      <div className="pl-4">
                        <div className="sticky top-0 bg-background pb-2 mb-2 border-b">
                          <h5 className="font-semibold mb-1">Versión 2</h5>
                          <p className="text-sm text-muted-foreground">
                            {version2ToCompare.name || version2ToCompare.title || 'Versión posterior'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(version2ToCompare.createdAt))}
                          </p>
                        </div>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                          <div>
                            <h6 className="font-semibold text-sm mb-2">Título:</h6>
                            <div className={`p-3 rounded border ${
                              diffResult.title.changed 
                                ? 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800' 
                                : 'bg-muted/30'
                            }`}>
                              <p className="text-sm">{version2ToCompare.title}</p>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-semibold text-sm mb-2">Contenido:</h6>
                            <div className={`p-3 rounded border max-h-[400px] overflow-y-auto ${
                              diffResult.content.changed 
                                ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800' 
                                : 'bg-muted/30'
                            }`}>
                              <pre className="text-sm whitespace-pre-wrap font-mono">
                                {version2ToCompare.content}
                              </pre>
                            </div>
                          </div>
                          {version2ToCompare.tags && (
                            <div>
                              <h6 className="font-semibold text-sm mb-2">Tags:</h6>
                              <div className="flex flex-wrap gap-1">
                                {version2ToCompare.tags.split(',').map((tag, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant={diffResult.tags?.changed ? 'default' : 'outline'} 
                                    className={`text-xs ${
                                      diffResult.tags?.changed ? 'bg-green-500' : ''
                                    }`}
                                  >
                                    {tag.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Vista vertical (original)
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold mb-2">Versión 1</h5>
                          <p className="text-sm text-muted-foreground">
                            {version1ToCompare.name || 'Versión anterior'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(version1ToCompare.createdAt))}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2">Versión 2</h5>
                          <p className="text-sm text-muted-foreground">
                            {version2ToCompare.name || 'Versión posterior'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(version2ToCompare.createdAt))}
                          </p>
                        </div>
                      </div>
                      {diffResult.hasChanges && (
                        <div className="space-y-3">
                          {diffResult.title.changed && (
                            <div>
                              <h6 className="font-semibold text-sm mb-1">Título:</h6>
                              <div className="text-sm space-y-1">
                                <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded">
                                  <span className="text-red-600 dark:text-red-400">- </span>
                                  {diffResult.title.old}
                                </div>
                                <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded">
                                  <span className="text-green-600 dark:text-green-400">+ </span>
                                  {diffResult.title.new}
                                </div>
                              </div>
                            </div>
                          )}
                          {diffResult.content.changed && (
                            <div>
                              <h6 className="font-semibold text-sm mb-1">Contenido:</h6>
                              <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
                                {diffResult.content.diff.map((diff, idx: number) => {
                                  if (diff.type === 'equal') {
                                    return (
                                      <div key={idx} className="p-2 rounded bg-muted/30">
                                        <span className="text-muted-foreground">  {diff.text}</span>
                                      </div>
                                    )
                                  }
                                  
                                  const wordDiff = diff.type === 'removed' 
                                    ? highlightWordDiff(diff.text, '')
                                    : highlightWordDiff('', diff.text)
                                  
                                  return (
                                    <div
                                      key={idx}
                                      className={`p-2 rounded ${
                                        diff.type === 'removed'
                                          ? 'bg-red-50 dark:bg-red-950/20'
                                          : 'bg-green-50 dark:bg-green-950/20'
                                      }`}
                                    >
                                      <span
                                        className={
                                          diff.type === 'removed'
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-green-600 dark:text-green-400'
                                        }
                                      >
                                        {diff.type === 'removed' ? '- ' : '+ '}
                                      </span>
                                      {wordDiff.map((word, wordIdx: number) => (
                                        <span
                                          key={wordIdx}
                                          className={(() => {
                                            if (word.type === 'removed') {
                                              return 'bg-red-200 dark:bg-red-900/40 line-through'
                                            }
                                            if (word.type === 'added') {
                                              return 'bg-green-200 dark:bg-green-900/40 font-semibold'
                                            }
                                            return ''
                                          })()}
                                        >
                                          {word.text}
                                        </span>
                                      ))}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                          {diffResult.tags.changed && (
                            <div>
                              <h6 className="font-semibold text-sm mb-1">Tags:</h6>
                              <div className="text-sm space-y-1">
                                <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded">
                                  <span className="text-red-600 dark:text-red-400">- </span>
                                  {diffResult.tags.old || '(sin tags)'}
                                </div>
                                <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded">
                                  <span className="text-green-600 dark:text-green-400">+ </span>
                                  {diffResult.tags.new || '(sin tags)'}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {!diffResult.hasChanges && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No hay diferencias entre estas versiones
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Selector de color */}
        {showColorPicker && (
          <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <Label>Color de etiqueta</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={e => {
                    const value = e.target.value
                    // Validar formato hex mientras se escribe
                    if (value === '' || /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                      setSelectedColor(value)
                    }
                  }}
                  placeholder="#3b82f6"
                  maxLength={7}
                  className={selectedColor && !/^#[0-9A-Fa-f]{6}$/.test(selectedColor) ? 'border-red-500' : ''}
                />
                {selectedColor && !/^#[0-9A-Fa-f]{6}$/.test(selectedColor) && (
                  <span className="text-xs text-red-500">Formato inválido (debe ser #RRGGBB)</span>
                )}
                <Button
                  onClick={() => {
                    // Validar formato hex antes de guardar
                    if (!/^#[0-9A-Fa-f]{6}$/.test(selectedColor)) {
                      toast.error('Color inválido', {
                        description: 'El color debe estar en formato hexadecimal (#RRGGBB)',
                      })
                      return
                    }
                    const version = allVersions.find(v => v.id === showColorPicker)
                    if (version) {
                      handleUpdateVersionMetadata(version, { color: selectedColor })
                      setShowColorPicker(null)
                    }
                  }}
                  size="sm"
                  disabled={!selectedColor || !/^#[0-9A-Fa-f]{6}$/.test(selectedColor)}
                >
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const version = allVersions.find(v => v.id === showColorPicker)
                    if (version) {
                      handleUpdateVersionMetadata(version, { color: null })
                      setShowColorPicker(null)
                    }
                  }}
                >
                  Quitar color
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColorPicker(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Vista previa de versión seleccionada */}
        {selectedVersion && !comparingVersions && !showNameEdit && !showColorPicker && (
          <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Vista previa</h4>
                <div className="flex gap-2 flex-wrap">
                  <Select value={previewFontSize} onValueChange={setPreviewFontSize as (value: string) => void}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Pequeño</SelectItem>
                      <SelectItem value="md">Mediano</SelectItem>
                      <SelectItem value="lg">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={previewTheme} onValueChange={setPreviewTheme as (value: string) => void}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(selectedVersion)}
                    title="Copiar al portapapeles"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExport(selectedVersion, 'txt')}
                    title="Exportar como TXT"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    TXT
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExport(selectedVersion, 'md')}
                    title="Exportar como Markdown"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    MD
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExport(selectedVersion, 'pdf')}
                    title="Exportar como PDF"
                  >
                    <File className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedVersion(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
              <Card>
                <CardContent
                  className={cn(
                    'p-4 space-y-3',
                    previewTheme === 'dark' && 'bg-gray-900 text-white',
                    previewTheme === 'light' && 'bg-white'
                  )}
                >
                  <div>
                    <h5
                      className={cn(
                        'font-semibold mb-1',
                        previewFontSize === 'sm' && 'text-sm',
                        previewFontSize === 'md' && 'text-base',
                        previewFontSize === 'lg' && 'text-xl'
                      )}
                    >
                      {selectedVersion.title}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {formatTimeAgo(new Date(selectedVersion.createdAt))}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'prose max-w-none',
                      previewFontSize === 'sm' && 'prose-sm',
                      previewFontSize === 'md' && 'prose-base',
                      previewFontSize === 'lg' && 'prose-lg'
                    )}
                  >
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
      </Dialog>

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
            <Button onClick={handleRestore} variant="default" disabled={restoring}>
              {restoring ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Restaurando...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para compartir versión */}
      {showShareDialog && (
        <Dialog open={!!showShareDialog} onOpenChange={(open) => !open && setShowShareDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compartir Versión</DialogTitle>
              <DialogDescription>
                Comparte esta versión específica de la nota con otro estudiante
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Mensaje opcional</Label>
                <Textarea
                  value={shareMessage}
                  onChange={e => {
                    const value = e.target.value
                    if (value.length <= 500) {
                      setShareMessage(value)
                    }
                  }}
                  placeholder="Agrega un mensaje personalizado (opcional)..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {shareMessage.length}/500 caracteres
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowShareDialog(null)
                  setShareMessage('')
                }}
                disabled={sharing}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  const version = allVersions.find(v => v.id === showShareDialog)
                  if (version) {
                    handleShareVersion(version)
                  }
                }}
                disabled={sharing}
              >
                {sharing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Compartiendo...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    {/* Panel de comentarios lateral */}
    {showComments && (
      <div className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-lg z-50 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comentarios
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Formulario para agregar comentario */}
          <div className="space-y-2">
            <Label>Nuevo comentario</Label>
            <Textarea
              value={newComment}
              onChange={e => {
                const value = e.target.value
                if (value.length <= 1000) {
                  setNewComment(value)
                }
              }}
              placeholder="Escribe un comentario sobre esta versión..."
              rows={3}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {newComment.length}/1000 caracteres
            </p>
            <Button
              onClick={() => handleAddComment(showComments)}
              disabled={!newComment.trim() || addingComment}
              size="sm"
              className="w-full"
            >
              {addingComment ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Agregando...
                </>
              ) : (
                'Agregar comentario'
              )}
            </Button>
          </div>

          {/* Lista de comentarios */}
          <div className="space-y-3">
            {versionComments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay comentarios aún
              </p>
            ) : (
              versionComments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(new Date(comment.createdAt))}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id, showComments)}
                        className="text-destructive hover:text-destructive h-6 px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    )}

    {/* Diálogo para fusionar versiones */}
    {showMergeDialog && (
      <Dialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fusionar Versiones</DialogTitle>
            <DialogDescription>
              Combina el contenido de {versionsToCompare.length} versiones seleccionadas en una nueva nota
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título de la nota fusionada</Label>
              <Input
                value={mergeTitle}
                onChange={e => setMergeTitle(e.target.value)}
                placeholder="Ej: Nota fusionada - Versiones importantes"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {mergeTitle.length}/200 caracteres
              </p>
            </div>
            <div>
              <Label>Estrategia de fusión</Label>
              <Select
                value={mergeStrategy}
                onValueChange={(value: 'append' | 'interleave' | 'smart') => setMergeStrategy(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="append">
                    <div>
                      <div className="font-semibold">Concatenar</div>
                      <div className="text-xs text-muted-foreground">
                        Une todas las versiones una tras otra
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="interleave">
                    <div>
                      <div className="font-semibold">Intercalar</div>
                      <div className="text-xs text-muted-foreground">
                        Alterna párrafos de cada versión
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="smart">
                    <div>
                      <div className="font-semibold">Inteligente</div>
                      <div className="text-xs text-muted-foreground">
                        Usa la más reciente y agrega contenido único
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-semibold mb-2">Versiones a fusionar:</p>
              <ul className="text-sm space-y-1">
                {versionsToCompare.map((v, idx) => (
                  <li key={v.id} className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-background px-2 py-1 rounded">
                      {idx + 1}
                    </span>
                    <span className="truncate">{v.name || v.title}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatTimeAgo(new Date(v.createdAt))})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMergeDialog(false)
                setMergeTitle('')
              }}
              disabled={merging}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                try {
                  setMerging(true)
                  const res = await fetch('/api/notes/versions/merge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      noteId,
                      versionIds: versionsToCompare.map(v => v.id),
                      mergeStrategy,
                      title: mergeTitle.trim() || undefined,
                    }),
                  })

                  if (res.ok) {
                    const data = await res.json()
                    toast.success('Versiones fusionadas', {
                      description: `Se ha creado una nueva nota: "${data.mergedNote.title}"`,
                    })
                    setShowMergeDialog(false)
                    setMergeTitle('')
                    setVersionsToCompare([])
                  } else {
                    const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }))
                    toast.error('Error al fusionar versiones', {
                      description: errorData.error || 'No se pudieron fusionar las versiones',
                    })
                  }
                } catch (error) {
                  toast.error('Error al fusionar versiones', {
                    description: 'Ocurrió un error inesperado',
                  })
                  trackError(error instanceof Error ? error : new Error(String(error)), {
                    type: 'note_version_merge_error',
                    noteId: noteId || 'unknown',
                  })
                } finally {
                  setMerging(false)
                }
              }}
              disabled={merging}
            >
              {merging ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fusionando...
                </>
              ) : (
                <>
                  <GitMerge className="h-4 w-4 mr-2" />
                  Fusionar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}

    {/* Preview en tiempo real al pasar el mouse */}
    {hoveredVersion && (
      <div
        data-preview-tooltip
        className="fixed z-[100] w-80 bg-popover border rounded-lg shadow-lg p-3 max-h-96 overflow-y-auto pointer-events-auto"
        style={{
          left: `${previewPosition.x}px`,
          top: `${previewPosition.y}px`,
          transform: (() => {
            const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0
            if (previewPosition.x + 320 > viewportWidth) return 'translateX(-100%)'
            return 'none'
          })(),
        }}
        onMouseEnter={() => setHoveredVersion(hoveredVersion)}
        onMouseLeave={() => setHoveredVersion(null)}
      >
        {(() => {
          const version = allVersions.find(v => v.id === hoveredVersion)
          if (!version) {
            const skip: ReactNode = null
            return skip
          }
          return (
            <>
              <h4 className="font-semibold text-sm mb-2 truncate">{version.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">
                {formatTimeAgo(new Date(version.createdAt))}
              </p>
              <p className="text-xs whitespace-pre-wrap line-clamp-6">
                {version.content}
              </p>
              {version.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {version.tags.split(',').slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </>
          )
        })()}
      </div>
    )}
  </>
  )
}


