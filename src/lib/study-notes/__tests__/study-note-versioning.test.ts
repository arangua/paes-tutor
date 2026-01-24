import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import {
  createStudyNoteWithVersioning,
  getStudyNoteVersion,
  listStudyNoteVersions,
  updateStudyNoteWithVersioning,
  restoreStudyNoteToVersion,
} from '@/lib/study-notes/study-note-versioning'

// Crear cliente Prisma real directamente (bypass del alias de mock)
// Usar la misma lógica que @/lib/prisma pero sin pasar por el alias
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

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
  await pool.end()
})

describe('StudyNote versioning', () => {
  let testStudentId: string

  beforeAll(async () => {
    // Crear o obtener un User y Student de test
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })
    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        nombre: 'Test Student',
      },
    })
    testStudentId = student.id
  })

  afterAll(async () => {
    // Limpiar datos de test (en orden inverso de dependencias)
    await prisma.studyNoteVersion.deleteMany({})
    await prisma.studyNote.deleteMany({})
    // No eliminamos Student/User para evitar problemas con otras relaciones
    // La DB de test se puede limpiar manualmente si es necesario
  })

  it('crea StudyNote y versión 1 (CREATE)', async () => {
    const note = await createStudyNoteWithVersioning(prisma, {
      studentId: testStudentId,
      title: 'Nota 1',
      content: '# Hola\nContenido',
      createdByUserId: 'user_test',
      source: 'API',
      changeSummary: 'Creación inicial',
    })

    expect(note.currentVersion).toBe(1)

    const v1 = await getStudyNoteVersion(prisma, note.id, 1)
    expect(v1).not.toBeNull()
    expect(v1?.changeType).toBe('CREATE')
    expect((v1?.snapshot as any).title).toBe('Nota 1')
    expect((v1?.snapshot as any).content).toBe('# Hola\nContenido')
  })

  it('actualiza y crea nueva versión correlativa (UPDATE)', async () => {
    const note = await createStudyNoteWithVersioning(prisma, {
      studentId: testStudentId,
      title: 'Nota 2',
      content: 'A',
      createdByUserId: 'user_test',
    })

    const updated = await updateStudyNoteWithVersioning(prisma, note.id, {
      content: 'B',
      updatedByUserId: 'user_test2',
      changeSummary: 'Cambio de contenido',
    })

    expect(updated.currentVersion).toBe(2)

    const v2 = await getStudyNoteVersion(prisma, note.id, 2)
    expect(v2).not.toBeNull()
    expect(v2?.changeType).toBe('UPDATE')
    expect((v2?.snapshot as any).content).toBe('B')

    const versions = await listStudyNoteVersions(prisma, note.id)
    expect(versions.map((v) => v.version)).toEqual([2, 1])
  })

  it('no crea versión si no hay cambio relevante', async () => {
    const note = await createStudyNoteWithVersioning(prisma, {
      studentId: testStudentId,
      title: 'Nota 3',
      content: 'X',
      createdByUserId: 'user_test',
    })

    const before = await listStudyNoteVersions(prisma, note.id)
    expect(before).toHaveLength(1)

    await updateStudyNoteWithVersioning(prisma, note.id, {
      title: 'Nota 3',
      content: 'X',
      updatedByUserId: 'user_test2',
    })

    const after = await listStudyNoteVersions(prisma, note.id)
    expect(after).toHaveLength(1)
    expect(after[0].version).toBe(1)
  })
})

describe('StudyNote restore (RESTORE)', () => {
  it('restaura una nota a una versión anterior creando una nueva versión', async () => {
    // Arrange
    const user = await prisma.user.upsert({
      where: { email: `restore_${Date.now()}@example.com` },
      update: {},
      create: {
        email: `restore_${Date.now()}@example.com`,
        name: 'Restore User',
      },
    })
    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        nombre: 'Restore Student',
      },
    })

    const note = await createStudyNoteWithVersioning(prisma, {
      studentId: student.id,
      title: 'Original',
      content: 'v1',
      createdByUserId: 'user_test',
    })

    await updateStudyNoteWithVersioning(prisma, note.id, {
      title: 'Modified',
      content: 'v2',
      updatedByUserId: 'user_test',
    })

    // Pre-assert
    const versionsBefore = await listStudyNoteVersions(prisma, note.id)
    expect(versionsBefore.map((v) => v.version)).toEqual([2, 1])

    // Act: restore to version 1
    const restored = await restoreStudyNoteToVersion(prisma, note.id, 1, {
      restoredByUserId: 'admin_restore',
    })

    // Assert: state restored
    expect(restored.title).toBe('Original')
    expect(restored.content).toBe('v1')
    expect(restored.currentVersion).toBe(3)

    // Assert: versions history
    const versionsAfter = await listStudyNoteVersions(prisma, note.id)
    expect(versionsAfter.map((v) => v.version)).toEqual([3, 2, 1])

    const restoreVersion = versionsAfter[0]
    expect(restoreVersion.changeType).toBe('RESTORE')
    expect(restoreVersion.changeSummary).toContain('Restored from v1')
  })

  it('falla si se intenta restaurar una versión inexistente', async () => {
    const user = await prisma.user.upsert({
      where: { email: `restore_fail_${Date.now()}@example.com` },
      update: {},
      create: {
        email: `restore_fail_${Date.now()}@example.com`,
        name: 'Restore Fail User',
      },
    })
    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        nombre: 'Restore Fail Student',
      },
    })

    const note = await createStudyNoteWithVersioning(prisma, {
      studentId: student.id,
      title: 'Solo una',
      content: 'única',
    })

    await expect(
      restoreStudyNoteToVersion(prisma, note.id, 99),
    ).rejects.toThrow('StudyNote version not found')
  })
})
