import type { PrismaClient, StudyNoteChangeSource } from '@prisma/client'
import crypto from 'crypto'

export type StudyNoteSnapshot = {
  id: string
  title: string
  content: string
  currentVersion: number
  createdAt: Date
  updatedAt: Date
  createdByUserId: string | null
  updatedByUserId: string | null
  tags?: string | null
  topicId?: string | null
  questionId?: string | null
}

function hashSnapshot(snapshot: Omit<StudyNoteSnapshot, 'updatedAt'>): string {
  const json = JSON.stringify(snapshot)
  return crypto.createHash('sha256').update(json).digest('hex')
}

function buildSnapshot(note: {
  id: string
  title: string
  content: string
  currentVersion: number
  createdAt: Date
  updatedAt: Date
  createdByUserId: string | null
  updatedByUserId: string | null
}): StudyNoteSnapshot {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    currentVersion: note.currentVersion,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    createdByUserId: note.createdByUserId ?? null,
    updatedByUserId: note.updatedByUserId ?? null,
  }
}

export async function createStudyNoteWithVersioning(
  prisma: PrismaClient,
  input: {
    studentId: string
    title: string
    content: string
    createdByUserId?: string | null
    source?: StudyNoteChangeSource
    changeSummary?: string
  },
) {
  const source = input.source ?? 'API'

  return prisma.$transaction(async (tx) => {
    const note = await tx.studyNote.create({
      data: {
        studentId: input.studentId,
        title: input.title,
        content: input.content,
        currentVersion: 1,
        createdByUserId: input.createdByUserId ?? null,
        updatedByUserId: input.createdByUserId ?? null,
      },
    })

    const snapshot = buildSnapshot(note)
    const snapshotHash = hashSnapshot({
      ...snapshot,
      updatedAt: undefined as never,
    })

    await tx.studyNoteVersion.create({
      data: {
        studyNoteId: note.id,
        version: 1,
        snapshot,
        changeType: 'CREATE',
        source,
        changeSummary: input.changeSummary ?? null,
        createdByUserId: input.createdByUserId ?? null,
        snapshotHash,
      },
    })

    return note
  })
}

export async function updateStudyNoteWithVersioning(
  prisma: PrismaClient,
  studyNoteId: string,
  input: {
    title?: string
    content?: string
    updatedByUserId?: string | null
    source?: StudyNoteChangeSource
    changeSummary?: string
  },
) {
  const source = input.source ?? 'API'

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studyNote.findUnique({
      where: { id: studyNoteId },
      select: {
        id: true,
        title: true,
        content: true,
        currentVersion: true,
        createdAt: true,
        updatedAt: true,
        createdByUserId: true,
        updatedByUserId: true,
      },
    })

    if (!existing) {
      throw new Error(`StudyNote not found: ${studyNoteId}`)
    }

    const nextTitle = input.title ?? existing.title
    const nextContent = input.content ?? existing.content

    const hasRelevantChange = nextTitle !== existing.title || nextContent !== existing.content

    // No crear versión si no cambia nada relevante.
    if (!hasRelevantChange) {
      if (
        input.updatedByUserId !== undefined &&
        input.updatedByUserId !== (existing.updatedByUserId ?? null)
      ) {
        await tx.studyNote.update({
          where: { id: studyNoteId },
          data: { updatedByUserId: input.updatedByUserId ?? null },
        })
      }
      return existing
    }

    const nextVersion = existing.currentVersion + 1

    const updated = await tx.studyNote.update({
      where: { id: studyNoteId },
      data: {
        title: nextTitle,
        content: nextContent,
        currentVersion: nextVersion,
        updatedByUserId: input.updatedByUserId ?? (existing.updatedByUserId ?? null),
      },
      select: {
        id: true,
        title: true,
        content: true,
        currentVersion: true,
        createdAt: true,
        updatedAt: true,
        createdByUserId: true,
        updatedByUserId: true,
      },
    })

    const snapshot = buildSnapshot(updated)
    const snapshotHash = hashSnapshot({
      ...snapshot,
      updatedAt: undefined as never,
    })

    await tx.studyNoteVersion.create({
      data: {
        studyNoteId: updated.id,
        version: nextVersion,
        snapshot,
        changeType: 'UPDATE',
        source,
        changeSummary: input.changeSummary ?? null,
        createdByUserId: input.updatedByUserId ?? null,
        snapshotHash,
      },
    })

    return updated
  })
}

export async function listStudyNoteVersions(prisma: PrismaClient, studyNoteId: string) {
  return prisma.studyNoteVersion.findMany({
    where: { studyNoteId },
    orderBy: [{ version: 'desc' }],
  })
}

export async function getStudyNoteVersion(prisma: PrismaClient, studyNoteId: string, version: number) {
  return prisma.studyNoteVersion.findUnique({
    where: {
      studyNoteId_version: { studyNoteId, version },
    },
  })
}

/**
 * Restaura una StudyNote a una versión anterior CREANDO una nueva versión (RESTORE).
 * Reglas enterprise:
 * - No rebobina currentVersion (siempre crece)
 * - Snapshot completo
 * - Transaccional
 */
export async function restoreStudyNoteToVersion(
  prisma: PrismaClient,
  studyNoteId: string,
  targetVersion: number,
  input?: {
    restoredByUserId?: string | null
    source?: StudyNoteChangeSource
    changeSummary?: string
  },
) {
  const source = input?.source ?? 'API'

  return prisma.$transaction(async (tx) => {
    // 1) Obtener nota actual
    const current = await tx.studyNote.findUnique({
      where: { id: studyNoteId },
      select: {
        id: true,
        currentVersion: true,
      },
    })

    if (!current) {
      throw new Error(`StudyNote not found: ${studyNoteId}`)
    }

    // 2) Obtener versión objetivo
    const target = await tx.studyNoteVersion.findUnique({
      where: {
        studyNoteId_version: {
          studyNoteId,
          version: targetVersion,
        },
      },
    })

    if (!target) {
      throw new Error(`StudyNote version not found: ${studyNoteId} v${targetVersion}`)
    }

    const snapshot = target.snapshot as StudyNoteSnapshot & {
      tags?: string | null
      topicId?: string | null
      questionId?: string | null
    }

    // 3) Calcular nueva versión
    const nextVersion = current.currentVersion + 1

    // 4) Restaurar campos desde snapshot
    const restored = await tx.studyNote.update({
      where: { id: studyNoteId },
      data: {
        title: snapshot.title,
        content: snapshot.content,
        tags: snapshot.tags ?? null,
        topicId: snapshot.topicId ?? null,
        questionId: snapshot.questionId ?? null,
        currentVersion: nextVersion,
        updatedByUserId: input?.restoredByUserId ?? null,
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        topicId: true,
        questionId: true,
        currentVersion: true,
        createdAt: true,
        updatedAt: true,
        createdByUserId: true,
        updatedByUserId: true,
      },
    })

    // 5) Crear nueva versión RESTORE
    const restoreSnapshot = buildSnapshot(restored)
    const snapshotHash = hashSnapshot({
      ...restoreSnapshot,
      updatedAt: undefined as never,
    })

    await tx.studyNoteVersion.create({
      data: {
        studyNoteId,
        version: nextVersion,
        snapshot: restoreSnapshot,
        changeType: 'RESTORE',
        source,
        changeSummary:
          input?.changeSummary ?? `Restored from v${targetVersion}`,
        createdByUserId: input?.restoredByUserId ?? null,
        snapshotHash,
      },
    })

    return restored
  })
}
