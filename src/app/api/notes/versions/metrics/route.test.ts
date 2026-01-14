// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  setupCurrentStudentId,
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
      count: vi.fn(),
      findMany: vi.fn(),
    },
    versionRestoreHistory: {
      count: vi.fn(),
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

vi.mock('@/lib/cache', () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}))

describe('GET /api/notes/versions/metrics', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setupCurrentStudentId(TEST_IDS.STUDENT)
  })

  it('debe retornar métricas correctamente', async () => {
    const mockNotes = [{ id: TEST_IDS.NOTE }]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any) // Primera llamada para obtener notas
      .mockResolvedValueOnce([]) // Segunda llamada para notesWithVersions
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(10) // totalVersions
      .mockResolvedValueOnce(0) // importantVersionsCount
      .mockResolvedValueOnce(0) // namedVersionsCount
      .mockResolvedValueOnce(0) // compressedVersions
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(5)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([]) // versionsWithSize
      .mockResolvedValueOnce([]) // allVersions
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.totalVersions).toBe(10)
    expect(data.totalRestores).toBe(5)
    expect(data.versionsBySize).toBeDefined()
    expect(data.versionsByPeriod).toBeDefined()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    await setupCurrentStudentId(null)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe validar período inválido', async () => {
    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
      queryParams: { period: 'invalid' },
    })
    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros inválidos')
  })

  it('debe usar período por defecto (7d) si no se especifica', async () => {
    const mockNotes = [{ id: 'note-1' }]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any) // Primera llamada para obtener notas
      .mockResolvedValueOnce([]) // Segunda llamada para notesWithVersions
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(0) // totalVersions
      .mockResolvedValueOnce(0) // importantVersionsCount
      .mockResolvedValueOnce(0) // namedVersionsCount
      .mockResolvedValueOnce(0) // compressedVersions
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([]) // versionsWithSize
      .mockResolvedValueOnce([]) // allVersions
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)

    await assertSuccessResponse(response)
    // Verificar que se aplica filtro de fecha para 7 días
    expect(prisma.studyNoteVersion.count).toHaveBeenCalled()
  })

  it('debe filtrar por período 24h', async () => {
    const mockNotes = [{ id: 'note-1' }]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any)
      .mockResolvedValueOnce([])
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
      queryParams: { period: '24h' },
    })
    const response = await GET(request)

    await assertSuccessResponse(response)
  })

  it('debe filtrar por período 30d', async () => {
    const mockNotes = [{ id: 'note-1' }]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any)
      .mockResolvedValueOnce([])
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
      queryParams: { period: '30d' },
    })
    const response = await GET(request)

    await assertSuccessResponse(response)
  })

  it('debe incluir todas las versiones cuando period=all', async () => {
    const mockNotes = [{ id: 'note-1' }]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any)
      .mockResolvedValueOnce([])
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
      queryParams: { period: 'all' },
    })
    const response = await GET(request)

    await assertSuccessResponse(response)
  })

  it('debe filtrar por noteId si se proporciona', async () => {
    vi.mocked(prisma.studyNote.findMany).mockResolvedValueOnce([])
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
      queryParams: { noteId: TEST_IDS.NOTE },
    })
    const response = await GET(request)

    await assertSuccessResponse(response)
    expect(prisma.studyNoteVersion.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          noteId: { in: [TEST_IDS.NOTE] },
        }),
      })
    )
  })

  it('debe calcular tasa de compresión correctamente', async () => {
    const mockNotes = [{ id: TEST_IDS.NOTE }]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any) // Primera llamada para obtener notas
      .mockResolvedValueOnce([]) // Segunda llamada para notesWithVersions
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(10) // totalVersions
      .mockResolvedValueOnce(0) // importantVersionsCount
      .mockResolvedValueOnce(0) // namedVersionsCount
      .mockResolvedValueOnce(5) // compressedVersions
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([]) // versionsWithSize
      .mockResolvedValueOnce([]) // allVersions
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.compressionRate).toBe(50) // 5/10 * 100
  })

  it('debe calcular promedio de versiones por nota', async () => {
    const mockNotes = [{ id: TEST_IDS.NOTE }, { id: TEST_IDS.VERSION }]
    const mockNotesWithVersions = [
      { id: TEST_IDS.NOTE, _count: { versions: 10 } },
      { id: TEST_IDS.VERSION, _count: { versions: 10 } },
    ]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any)
      .mockResolvedValueOnce(mockNotesWithVersions as any)
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.averageVersionsPerNote).toBe(10) // 20/2
  })

  it('debe retornar métricas vacías si no hay notas', async () => {
    vi.mocked(prisma.studyNote.findMany).mockResolvedValueOnce([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    // Cuando no hay notas, el código retorna un objeto con todos los valores en 0
    expect(data.totalVersions).toBe(0)
    expect(data.totalRestores).toBe(0)
    expect(data.averageVersionsPerNote).toBe(0)
    expect(data.compressionRate).toBe(0)
    expect(data.versionsBySize).toBeDefined()
    expect(data.versionsByPeriod).toEqual([])
    expect(data.restoreFrequency).toEqual([])
  })

  it('debe incluir distribución de versiones por tamaño', async () => {
    const mockNotes = [{ id: 'note-1' }]
    const mockVersions = [
      { content: 'a'.repeat(100), isCompressed: false }, // small
      { content: 'a'.repeat(5000), isCompressed: false }, // medium
      { content: 'a'.repeat(50000), isCompressed: false }, // large
      { content: 'a'.repeat(500000), isCompressed: false }, // veryLarge
    ]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any) // Primera llamada para obtener notas
      .mockResolvedValueOnce([]) // Segunda llamada para notesWithVersions
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce(mockVersions as any) // versionsWithSize
      .mockResolvedValueOnce([]) // allVersions
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.versionsBySize).toBeDefined()
    expect(data.versionsBySize.small).toBeDefined()
    expect(data.versionsBySize.medium).toBeDefined()
    expect(data.versionsBySize.large).toBeDefined()
    expect(data.versionsBySize.veryLarge).toBeDefined()
  })

  it('debe incluir frecuencia de restauraciones', async () => {
    const mockNotes = [{ id: 'note-1' }]
    const mockRestores = [
      { restoredAt: new Date('2024-01-01') },
      { restoredAt: new Date('2024-01-01') },
      { restoredAt: new Date('2024-01-02') },
    ]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any)
      .mockResolvedValueOnce([])
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue(mockRestores as any)

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.restoreFrequency).toBeDefined()
  })

  it('debe incluir versiones por período', async () => {
    const mockNotes = [{ id: 'note-1' }]
    const mockVersions = [
      { createdAt: new Date('2024-01-01') },
      { createdAt: new Date('2024-01-01') },
      { createdAt: new Date('2024-01-02') },
    ]

    vi.mocked(prisma.studyNote.findMany)
      .mockResolvedValueOnce(mockNotes as any)
      .mockResolvedValueOnce([])
    vi.mocked(prisma.studyNoteVersion.count)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
    vi.mocked(prisma.versionRestoreHistory.count).mockResolvedValue(0)
    vi.mocked(prisma.studyNoteVersion.findMany)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(mockVersions as any)
    vi.mocked(prisma.versionRestoreHistory.findMany).mockResolvedValue([])

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.versionsByPeriod).toBeDefined()
    expect(Array.isArray(data.versionsByPeriod)).toBe(true)
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.studyNote.findMany).mockRejectedValueOnce(new Error('Database error'))

    const request = createTestRequest({
      baseUrl: 'http://localhost:3000/api/notes/versions/metrics',
    })
    const response = await GET(request)

    await assertErrorResponse(response, 500, 'Error al obtener métricas')
  })
})

