// @vitest-environment node
// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

// Mock completo de next/server para evitar problemas con next-auth
// No intentamos importActual porque el módulo no existe en el entorno de pruebas
vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams }
      headers: Headers
      constructor(url: string) {
        this.url = url
        const urlObj = new URL(url)
        this.nextUrl = { searchParams: urlObj.searchParams }
        this.headers = new Headers()
      }
    },
    NextResponse: {
      json: (body: any, init?: { status?: number }) => {
        const status = init?.status || 200
        const response = new Response(JSON.stringify(body), {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
        // Asegurar que la propiedad status esté disponible
        Object.defineProperty(response, 'status', {
          value: status,
          writable: false,
          enumerable: true,
          configurable: true,
        })
        // Sobrescribir el método json() para que devuelva el body directamente
        response.json = async () => body
        return response
      },
    },
  }
})

import { describe, it, expect, beforeEach } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  setupCurrentStudentId,
  createStudyNote,
  createStudyNoteVersion,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '../__tests__/test-helpers'

// Mock de Prisma y autenticación
vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyNote: {
      findMany: vi.fn(),
    },
    studyNoteVersion: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: NextRequest, handler: () => Promise<Response>) => handler()),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}))

describe('GET /api/notes/versions/timeline', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setupCurrentStudentId(TEST_IDS.STUDENT)
  })

  it('debe retornar timeline agrupado por mes por defecto', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    const mockVersion = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      noteId: TEST_IDS.NOTE,
      title: 'Versión 1',
      content: 'Contenido',
      createdAt: new Date('2024-01-10'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([mockVersion] as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.view).toBe('month')
    expect(data.groups).toBeDefined()
    expect(data.totalVersions).toBeDefined()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    await setupCurrentStudentId(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
    })
    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe validar vista inválida', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
      queryParams: { view: 'invalid' },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe agrupar por día cuando view=day', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    const mockVersion = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      noteId: TEST_IDS.NOTE,
      title: 'Versión 1',
      content: 'Contenido',
      createdAt: new Date('2024-01-15T10:00:00'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([mockVersion] as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
      queryParams: { view: 'day' },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.view).toBe('day')
  })

  it('debe agrupar por semana cuando view=week', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
      queryParams: { view: 'week' },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.view).toBe('week')
  })

  it('debe agrupar por año cuando view=year', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
      queryParams: { view: 'year' },
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.view).toBe('year')
  })

  it('debe filtrar por noteId si se proporciona', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(prisma.studyNote.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: TEST_IDS.NOTE,
          studentId: TEST_IDS.STUDENT,
        }),
        select: expect.objectContaining({
          id: true,
          title: true,
          updatedAt: true,
          content: true,
        }),
      })
    )
  })

  it('debe filtrar por rango de fechas', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
      queryParams: {
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
      },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
  })

  it('debe incluir versión actual por defecto', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    // Debe incluir estadísticas
    expect(data.stats).toBeDefined()
  })

  it('debe excluir versión actual si includeCurrent=false', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
      queryParams: { includeCurrent: 'false' },
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
  })

  it('debe retornar grupos vacíos si no hay versiones', async () => {
    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.groups).toEqual([])
    expect(data.totalVersions).toBe(0)
  })

  it('debe incluir estadísticas en la respuesta', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    const mockVersion = createStudyNoteVersion({
      id: TEST_IDS.VERSION,
      noteId: TEST_IDS.NOTE,
      title: 'Versión 1',
      content: 'Contenido',
      name: 'Versión importante',
      isImportant: true,
      createdAt: new Date('2024-01-10'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([mockVersion] as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.stats).toBeDefined()
    expect(data.stats.totalNotes).toBeDefined()
    expect(data.stats.versionsWithNames).toBeDefined()
    expect(data.stats.importantVersions).toBeDefined()
  })

  it('debe incluir rango de fechas en la respuesta', async () => {
    const mockNote = createStudyNote({
      id: TEST_IDS.NOTE,
      title: 'Nota 1',
      content: 'Contenido',
      updatedAt: new Date('2024-01-15'),
    })

    vi.mocked(prisma.studyNote.findMany).mockResolvedValue([mockNote] as any)
    vi.mocked(prisma.studyNoteVersion.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.dateRange).toBeDefined()
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.studyNote.findMany).mockRejectedValue(new Error('Database error'))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/timeline',
    })
    const response = await GET(request)

    await assertErrorResponse(response, 500, 'Error al obtener timeline')
  })
})

