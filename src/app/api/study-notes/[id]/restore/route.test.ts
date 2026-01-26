// @vitest-environment node
import { describe, expect, it, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { POST } from './route'
import {
  createStudyNoteWithVersioning,
  updateStudyNoteWithVersioning,
} from '@/lib/study-notes/study-note-versioning'
import { restoreResponseSchema } from '@/lib/contracts/study-note-restore.contract'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'

// Crear cliente Prisma real directamente
const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  throw new Error('DATABASE_URL no está configurada en .env.test')
}

const pool = new Pool({ connectionString: dbUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
})

// Mock de getAuthenticatedUserWithStudent
vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: vi.fn(),
}))

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
  await pool.end()
})

describe('POST /api/study-notes/[id]/restore', () => {
  let testUser: { id: string; email: string }
  let testStudentId: string
  let testNoteId: string

  beforeEach(async () => {
    // Limpiar datos de test anteriores
    await prisma.versionRestoreHistory.deleteMany({})
    await prisma.studyNoteVersion.deleteMany({})
    await prisma.studyNote.deleteMany({})

    // Crear usuario y estudiante de test
    testUser = await prisma.user.upsert({
      where: { email: `restore_test_${Date.now()}@example.com` },
      update: {},
      create: {
        email: `restore_test_${Date.now()}@example.com`,
        name: 'Restore Test User',
      },
    })

    const student = await prisma.student.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        userId: testUser.id,
        nombre: 'Restore Test Student',
      },
    })
    testStudentId = student.id

    // Mock de autenticación
    vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue({
      id: testUser.id,
      email: testUser.email,
      name: 'Restore Test User',
      role: 'student',
      student: {
        id: student.id,
        userId: testUser.id,
        nombre: 'Restore Test Student',
        createdAt: new Date(),
      },
    })

    // Crear nota de test con versiones
    const note = await createStudyNoteWithVersioning(prisma, {
      studentId: testStudentId,
      title: 'Test Note',
      content: 'Version 1',
      createdByUserId: testUser.id,
    })

    await updateStudyNoteWithVersioning(prisma, note.id, {
      title: 'Test Note',
      content: 'Version 2',
      updatedByUserId: testUser.id,
    })

    await updateStudyNoteWithVersioning(prisma, note.id, {
      title: 'Test Note',
      content: 'Version 3',
      updatedByUserId: testUser.id,
    })

    testNoteId = note.id
  })

  it('Test A - Idempotencia (NOOP): currentVersion = 3, restore a version = 3', async () => {
    // Verificar estado inicial: currentVersion = 3
    const noteBefore = await prisma.studyNote.findUnique({
      where: { id: testNoteId },
      select: { id: true, currentVersion: true },
    })
    expect(noteBefore?.currentVersion).toBe(3)

    // Contar historial antes
    const historyCountBefore = await prisma.versionRestoreHistory.count({
      where: { studyNoteId: testNoteId },
    })

    // Act: restaurar a la versión actual (3)
    const request = new Request('http://localhost/api/study-notes/123/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 3 }),
    })

    const ctx = { params: { id: testNoteId } }
    const response = await POST(request, ctx)
    const data = await response.json()
    restoreResponseSchema.parse(data)

    // Assert: respuesta exitosa con kind = NOOP
    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.kind).toBe('NOOP')
    expect(data.fromVersion).toBe(3)
    expect(data.toVersion).toBe(3)

    // Assert: currentVersion se mantiene en 3
    const noteAfter = await prisma.studyNote.findUnique({
      where: { id: testNoteId },
      select: { id: true, currentVersion: true },
    })
    expect(noteAfter?.currentVersion).toBe(3)

    // Assert: se crea VersionRestoreHistory con status = "NOOP"
    const historyCountAfter = await prisma.versionRestoreHistory.count({
      where: { studyNoteId: testNoteId },
    })
    expect(historyCountAfter).toBe(historyCountBefore + 1)

    const restoreHistory = await prisma.versionRestoreHistory.findFirst({
      where: {
        studyNoteId: testNoteId,
        fromVersion: 3,
        toVersion: 3,
        status: 'NOOP',
      },
      orderBy: { createdAt: 'desc' },
    })

    expect(restoreHistory).not.toBeNull()
    expect(restoreHistory?.status).toBe('NOOP')
    expect(restoreHistory?.fromVersion).toBe(3)
    expect(restoreHistory?.toVersion).toBe(3)
    expect(restoreHistory?.actorUserId).toBe(testUser.id)
  })

  it('Test B - Aplicación (APPLIED): currentVersion = 3, restore a version = 2', async () => {
    // Verificar estado inicial: currentVersion = 3
    const noteBefore = await prisma.studyNote.findUnique({
      where: { id: testNoteId },
      select: { id: true, currentVersion: true },
    })
    expect(noteBefore?.currentVersion).toBe(3)

    // Contar historial antes
    const historyCountBefore = await prisma.versionRestoreHistory.count({
      where: { studyNoteId: testNoteId },
    })

    // Act: restaurar a versión 2
    const request = new Request('http://localhost/api/study-notes/123/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 2 }),
    })

    const ctx = { params: { id: testNoteId } }
    const response = await POST(request, ctx)
    const data = await response.json()
    restoreResponseSchema.parse(data)

    // Assert: respuesta exitosa con kind = APPLIED
    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.kind).toBe('APPLIED')
    expect(data.fromVersion).toBe(3)
    expect(data.toVersion).toBe(2)

    // Assert: currentVersion crece (nueva versión RESTORE: 3+1=4), contenido viene de v2
    const noteAfter = await prisma.studyNote.findUnique({
      where: { id: testNoteId },
      select: { id: true, currentVersion: true },
    })
    expect(noteAfter?.currentVersion).toBe(4)

    // Assert: se crea VersionRestoreHistory con status = "APPLIED"
    const historyCountAfter = await prisma.versionRestoreHistory.count({
      where: { studyNoteId: testNoteId },
    })
    expect(historyCountAfter).toBe(historyCountBefore + 1)

    const restoreHistory = await prisma.versionRestoreHistory.findFirst({
      where: {
        studyNoteId: testNoteId,
        fromVersion: 3,
        toVersion: 2,
        status: 'APPLIED',
      },
      orderBy: { createdAt: 'desc' },
    })

    expect(restoreHistory).not.toBeNull()
    expect(restoreHistory?.status).toBe('APPLIED')
    expect(restoreHistory?.fromVersion).toBe(3)
    expect(restoreHistory?.toVersion).toBe(2)
    expect(restoreHistory?.actorUserId).toBe(testUser.id)
  })
})
