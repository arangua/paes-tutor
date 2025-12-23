'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookOpen, Search, Filter, Home, FileText, Loader2, AlertCircle } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { MaterialCard } from '@/components/materials/material-card'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Pagination } from '@/components/ui/pagination'

interface Material {
  id: string
  titulo: string
  contenido: string
  fuente: string | null
  tipo: string
  createdAt: string
  subject: {
    id: string
    nombre: string
    codigo: string
  }
  topic: {
    id: string
    nombre: string
    ejeTematico: string
  } | null
}

interface Subject {
  id: string
  nombre: string
  codigo: string
}

export default function MaterialsPage() {
  const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Array<{ id: string; nombre: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [selectedTipo, setSelectedTipo] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<{
    total: number
    limit: number
    offset: number
    hasMore: boolean
  } | null>(null)
  const itemsPerPage = 20

  // Debounce de búsqueda
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedSubject, selectedTopic, selectedTipo, searchQuery])

  // Cargar materiales
  useEffect(() => {
    async function loadMaterials() {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (selectedSubject && selectedSubject !== 'all') {
          params.append('subjectId', selectedSubject)
        }
        if (selectedTopic && selectedTopic !== 'all') {
          params.append('topicId', selectedTopic)
        }
        if (selectedTipo && selectedTipo !== 'all') {
          params.append('tipo', selectedTipo)
        }
        params.append('limit', itemsPerPage.toString())
        params.append('offset', ((currentPage - 1) * itemsPerPage).toString())

        const url = `/api/materials${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url)

        if (res.status === 401) {
          router.push('/auth/signin?callbackUrl=/materials')
          return
        }

        if (!res.ok) {
          throw new Error('Error al cargar materiales')
        }

        const data = await res.json()

        // Manejar nueva estructura con paginación o estructura antigua
        let materialsData: Material[]
        let paginationData: typeof pagination = null

        if (data.materials && data.pagination) {
          // Nueva estructura con paginación
          materialsData = data.materials
          paginationData = data.pagination
        } else if (Array.isArray(data)) {
          // Estructura antigua (sin paginación) - retrocompatibilidad
          materialsData = data
        } else {
          throw new Error('Formato de respuesta inválido')
        }

        setMaterials(materialsData)
        setPagination(paginationData)

        // Extraer asignaturas únicas
        const uniqueSubjects = new Map<string, Subject>()
        materialsData.forEach((material: Material) => {
          if (!uniqueSubjects.has(material.subject.id)) {
            uniqueSubjects.set(material.subject.id, material.subject)
          }
        })
        setSubjects(
          Array.from(uniqueSubjects.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))
        )

        // Extraer temas únicos (solo del subject seleccionado)
        if (selectedSubject && selectedSubject !== 'all') {
          const uniqueTopics = new Map<string, { id: string; nombre: string }>()
          materialsData.forEach((material: Material) => {
            if (material.topic && !uniqueTopics.has(material.topic.id)) {
              uniqueTopics.set(material.topic.id, {
                id: material.topic.id,
                nombre: material.topic.nombre,
              })
            }
          })
          setTopics(
            Array.from(uniqueTopics.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))
          )
        } else {
          setTopics([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadMaterials()
  }, [selectedSubject, selectedTopic, selectedTipo, currentPage, router])

  // Filtrar materiales por búsqueda (mejorado para malla curricular chilena)
  const filteredMaterials = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return materials
    }

    const query = debouncedSearchQuery.toLowerCase().trim()
    const queryWords = query.split(/\s+/).filter(w => w.length > 0)

    return materials
      .map(material => {
        // Calcular relevancia basada en malla curricular
        let relevance = 0

        // Búsqueda en título (mayor peso)
        const titleMatch = material.titulo.toLowerCase()
        queryWords.forEach(word => {
          if (titleMatch.includes(word)) relevance += 10
        })

        // Búsqueda en contenido
        const contentMatch = material.contenido.toLowerCase()
        queryWords.forEach(word => {
          if (contentMatch.includes(word)) relevance += 2
        })

        // Búsqueda en asignatura (según malla curricular)
        const subjectMatch = material.subject.nombre.toLowerCase()
        queryWords.forEach(word => {
          if (subjectMatch.includes(word)) relevance += 5
        })

        // Búsqueda en tema y eje temático (alta relevancia curricular)
        if (material.topic) {
          const topicMatch = material.topic.nombre.toLowerCase()
          const ejeMatch = material.topic.ejeTematico.toLowerCase()
          queryWords.forEach(word => {
            if (topicMatch.includes(word)) relevance += 8
            if (ejeMatch.includes(word)) relevance += 7
          })
        }

        // Búsqueda en tipo
        const tipoMatch = material.tipo.toLowerCase()
        queryWords.forEach(word => {
          if (tipoMatch.includes(word)) relevance += 1
        })

        return { material, relevance }
      })
      .filter(({ relevance }) => relevance > 0)
      .sort((a, b) => b.relevance - a.relevance) // Ordenar por relevancia
      .map(({ material }) => material)
  }, [materials, debouncedSearchQuery])

  // Obtener tipos únicos
  const tipos = useMemo(() => {
    const uniqueTipos = new Set<string>()
    materials.forEach(material => {
      if (material.tipo) {
        uniqueTipos.add(material.tipo)
      }
    })
    return Array.from(uniqueTipos).sort()
  }, [materials])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando materiales...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Materiales de Estudio' }]} />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Materiales de Estudio</h1>
            <p className="text-muted-foreground">
              Recursos educativos para reforzar tus conocimientos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <FileText className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar materiales..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                  role="search"
                  aria-label="Buscar materiales por título, contenido, asignatura o tema"
                />
              </div>
            </div>

            {/* Filtro por Asignatura */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las asignaturas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las asignaturas</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Tipo */}
            <Select value={selectedTipo} onValueChange={setSelectedTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {tipos.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Tema (solo si hay asignatura seleccionada) */}
          {selectedSubject && selectedSubject !== 'all' && topics.length > 0 && (
            <div className="mt-4">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Todos los temas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los temas</SelectItem>
                  {topics.map(topic => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Materiales */}
      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {searchQuery ||
              selectedSubject !== 'all' ||
              selectedTopic !== 'all' ||
              selectedTipo !== 'all'
                ? 'No se encontraron materiales con los filtros seleccionados'
                : 'No hay materiales disponibles en este momento'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      )}

      {/* Contador de resultados y paginación */}
      {filteredMaterials.length > 0 && (
        <>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {pagination ? (
              <>
                Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, pagination.total)} -{' '}
                {Math.min(currentPage * itemsPerPage, pagination.total)} de {pagination.total}{' '}
                materiales
              </>
            ) : (
              <>
                Mostrando {filteredMaterials.length} de {materials.length} materiales
              </>
            )}
          </div>

          {/* Paginación */}
          {pagination && pagination.total > itemsPerPage && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(pagination.total / itemsPerPage)}
                onPageChange={page => {
                  setCurrentPage(page)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
