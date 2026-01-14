'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  RotateCcw,
  Trash2,
  Calendar,
  Search,
  PlayCircle,
  BookOpen,
} from 'lucide-react'
import { safeRound } from '@/app/api/notes/versions/validation-utils'
import { toast } from 'sonner'
import { CreateFlashcardButton } from '@/components/flashcards/create-flashcard-button'
import { ShareFlashcardButton } from '@/components/flashcards/share-flashcard-button'
import { HelpIcon } from '@/components/help/help-icon'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: number
  reviewCount: number
  nextReview: string
  lastReview: string
  easeFactor: number
  interval: number
  question?: {
    subject: {
      nombre: string
      codigo: string
    }
    topic: {
      nombre: string
    } | null
  } | null
}

interface FlashcardStats {
  total: number
  due: number
  mastered: number
  new: number
  avgAccuracy: number
  totalReviews: number
}

export default function FlashcardsPage() {
  const router = useRouter()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [stats, setStats] = useState<FlashcardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'due' | 'new' | 'mastered'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'nextReview' | 'reviewCount' | 'difficulty'>('nextReview')

  const loadFlashcards = useCallback(async () => {
    try {
      setLoading(true)
      const dueOnly = activeTab === 'due'
      const res = await fetch(`/api/flashcards?dueOnly=${dueOnly}&limit=200`)
      if (!res.ok) throw new Error('Error al cargar flashcards')
      const data = await res.json()
      const allFlashcards = data.flashcards || []

      // Calcular estadísticas
      const now = new Date()
      const due = allFlashcards.filter((f: Flashcard) => new Date(f.nextReview) <= now).length
      const mastered = allFlashcards.filter(
        (f: Flashcard) => f.reviewCount >= 5 && f.easeFactor >= 2.5
      ).length
      const newCards = allFlashcards.filter((f: Flashcard) => f.reviewCount === 0).length
      const totalReviews = allFlashcards.reduce(
        (sum: number, f: Flashcard) => sum + f.reviewCount,
        0
      )
      const avgAccuracy =
        allFlashcards.length > 0
          ? allFlashcards.reduce((sum: number, f: Flashcard) => {
              // Estimar precisión basado en easeFactor (mayor = mejor)
              const estimatedAccuracy = Math.min(100, (f.easeFactor / 2.5) * 100)
              return sum + estimatedAccuracy
            }, 0) / allFlashcards.length
          : 0

      setStats({
        total: allFlashcards.length,
        due,
        mastered,
        new: newCards,
        avgAccuracy: safeRound(avgAccuracy, 0),
        totalReviews,
      })

      setFlashcards(allFlashcards)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar flashcards')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    loadFlashcards()
  }, [activeTab, loadFlashcards])

  const handleDelete = async (flashcardId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta flashcard?')) return

    try {
      const res = await fetch(`/api/flashcards?flashcardId=${flashcardId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Error al eliminar flashcard')

      toast.success('Flashcard eliminada')
      loadFlashcards()
    } catch {
      toast.error('Error al eliminar flashcard')
    }
  }

  // Filtrar y ordenar flashcards
  const filteredFlashcards = useMemo(() => {
    let filtered = flashcards

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        f =>
          f.front.toLowerCase().includes(query) ||
          f.back.toLowerCase().includes(query) ||
          f.question?.subject.nombre.toLowerCase().includes(query) ||
          f.question?.topic?.nombre.toLowerCase().includes(query)
      )
    }

    // Filtrar por asignatura
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(f => f.question?.subject.codigo === subjectFilter)
    }

    // Filtrar por tab
    if (activeTab === 'due') {
      const now = new Date()
      filtered = filtered.filter(f => new Date(f.nextReview) <= now)
    } else if (activeTab === 'new') {
      filtered = filtered.filter(f => f.reviewCount === 0)
    } else if (activeTab === 'mastered') {
      filtered = filtered.filter(f => f.reviewCount >= 5 && f.easeFactor >= 2.5)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nextReview':
          return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
        case 'reviewCount':
          return b.reviewCount - a.reviewCount
        case 'difficulty':
          return b.difficulty - a.difficulty
        default:
          return 0
      }
    })

    return filtered
  }, [flashcards, searchQuery, subjectFilter, activeTab, sortBy])

  // Obtener asignaturas únicas
  const subjects = useMemo(() => {
    const subjectMap = new Map<string, string>()
    flashcards.forEach(f => {
      if (f.question?.subject) {
        subjectMap.set(f.question.subject.codigo, f.question.subject.nombre)
      }
    })
    return Array.from(subjectMap.entries()).map(([codigo, nombre]) => ({ codigo, nombre }))
  }, [flashcards])

  // Verificar si una flashcard está vencida
  const isDue = (nextReview: string) => {
    return new Date(nextReview) <= new Date()
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Flashcards' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              Flashcards
            </h1>
            <HelpIcon
              content="Las flashcards usan el algoritmo SM-2 para optimizar tu aprendizaje. Repasa las tarjetas pendientes regularmente para mejorar la retención. El sistema calcula automáticamente cuándo es mejor repasar cada tarjeta."
              side="right"
            />
          </div>
          <p className="text-muted-foreground">
            Estudia con tarjetas de memoria usando repaso espaciado científico
          </p>
        </div>
        <div className="flex items-center gap-2">
          {stats && stats.due > 0 && (
            <Button asChild variant="default">
              <Link href="/flashcards/study">
                <PlayCircle className="h-4 w-4 mr-2" />
                Estudiar Pendientes ({stats.due})
              </Link>
            </Button>
          )}
          <CreateFlashcardButton />
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Flashcards creadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.due}</div>
              <p className="text-xs text-muted-foreground mt-1">Listas para repasar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Dominadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.mastered}</div>
              <p className="text-xs text-muted-foreground mt-1">Bien aprendidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Precisión Promedio</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${stats.avgAccuracy >= 70 ? 'text-green-600' : stats.avgAccuracy >= 50 ? 'text-yellow-600' : 'text-red-600'}`}
              >
                {stats.avgAccuracy}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rendimiento estimado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Repasos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground mt-1">Sesiones completadas</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs y Filtros */}
      <Tabs
        value={activeTab}
        onValueChange={v => setActiveTab(v as typeof activeTab)}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">Todas ({stats?.total || 0})</TabsTrigger>
            <TabsTrigger value="due">Pendientes ({stats?.due || 0})</TabsTrigger>
            <TabsTrigger value="new">Nuevas ({stats?.new || 0})</TabsTrigger>
            <TabsTrigger value="mastered">Dominadas ({stats?.mastered || 0})</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar flashcards..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 w-[250px]"
              />
            </div>
            {subjects.length > 0 && (
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas las asignaturas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las asignaturas</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.codigo} value={subject.codigo}>
                      {subject.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nextReview">Próximo repaso</SelectItem>
                <SelectItem value="reviewCount">Más repasadas</SelectItem>
                <SelectItem value="difficulty">Dificultad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredFlashcards.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">
                  {searchQuery || subjectFilter !== 'all'
                    ? 'No se encontraron flashcards con los filtros seleccionados'
                    : activeTab === 'due'
                      ? 'No hay flashcards pendientes'
                      : activeTab === 'new'
                        ? 'No hay flashcards nuevas'
                        : activeTab === 'mastered'
                          ? 'No hay flashcards dominadas aún'
                          : 'No tienes flashcards aún'}
                </p>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || subjectFilter !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Crea tu primera flashcard para comenzar a estudiar'}
                </p>
                {(searchQuery || subjectFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setSubjectFilter('all')
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
                {!searchQuery && subjectFilter === 'all' && (
                  <CreateFlashcardButton variant="default" />
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFlashcards.map(flashcard => (
                <Card
                  key={flashcard.id}
                  className={cn(
                    'hover:border-primary transition-all cursor-pointer',
                    isDue(flashcard.nextReview) &&
                      'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
                  )}
                  onClick={() => router.push(`/flashcards/${flashcard.id}/study`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-2 flex-1">
                        {flashcard.front}
                      </CardTitle>
                      {isDue(flashcard.nextReview) && (
                        <Badge variant="destructive" className="ml-2 flex-shrink-0">
                          Pendiente
                        </Badge>
                      )}
                    </div>
                    {flashcard.question && (
                      <CardDescription className="text-xs">
                        {flashcard.question.subject.nombre}
                        {flashcard.question.topic && ` • ${flashcard.question.topic.nombre}`}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <RotateCcw className="h-3 w-3" />
                          {flashcard.reviewCount} repasos
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(flashcard.nextReview).toLocaleDateString('es-CL', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(100, (flashcard.easeFactor / 2.5) * 100)}
                          className="h-2 flex-1"
                        />
                        <span className="text-xs text-muted-foreground">
                          {safeRound((flashcard.easeFactor / 2.5) * 100, 0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={e => {
                            e.stopPropagation()
                            router.push(`/flashcards/${flashcard.id}/study`)
                          }}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Estudiar
                        </Button>
                        <ShareFlashcardButton
                          flashcardId={flashcard.id}
                          flashcardFront={flashcard.front}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation()
                            handleDelete(flashcard.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
