import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  paramsSchema,
  restoreBodySchema,
  requireStudyNoteAccess,
  getCurrentUserOrNull,
} from '@/app/api/study-notes/_shared/study-note-guard'

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const parsedParams = paramsSchema.safeParse(ctx.params)
  if (!parsedParams.success) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const bodyJson = await req.json().catch(() => null)
  const parsedBody = restoreBodySchema.safeParse(bodyJson)
  if (!parsedBody.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { id: noteId } = parsedParams.data
  const body = parsedBody.data

  const access = await requireStudyNoteAccess(prisma, noteId)
  if (!access.ok) {
    return NextResponse.json({ error: access.message }, { status: access.status })
  }

  const user = await getCurrentUserOrNull()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const toVersion = body.version

  const result = await prisma.$transaction(async (tx) => {
    // 1) cargar nota + currentVersion (con guard ya aplicado)
    const note = await tx.studyNote.findUnique({
      where: { id: noteId },
      select: { id: true, currentVersion: true },
    })
    if (!note) return { kind: 'NOT_FOUND' as const }

    const fromVersion = note.currentVersion

    // 2) validar que exista la versión destino (opcional, pero da 404 claro)
    const targetExists = await tx.studyNoteVersion.findUnique({
      where: { studyNoteId_version: { studyNoteId: note.id, version: toVersion } },
      select: { id: true },
    })
    if (!targetExists) return { kind: 'VERSION_NOT_FOUND' as const }

    // 3) idempotencia
    if (toVersion === fromVersion) {
      await tx.versionRestoreHistory.create({
        data: {
          studyNoteId: note.id,
          fromVersion,
          toVersion,
          actorUserId: user.userId,
          reason: body.reason ?? null,
          status: 'NOOP',
        },
      })
      return { kind: 'NOOP' as const, fromVersion, toVersion }
    }

    // 4) aplicar restore: NO crear versión nueva, solo mover el puntero
    await tx.studyNote.update({
      where: { id: note.id },
      data: { currentVersion: toVersion },
    })

    await tx.versionRestoreHistory.create({
      data: {
        studyNoteId: note.id,
        fromVersion,
        toVersion,
        actorUserId: user.userId,
        reason: (body as { reason?: string }).reason ?? null,
        status: 'APPLIED',
      },
    })

    return { kind: 'APPLIED' as const, fromVersion, toVersion }
  })

  if (result.kind === 'NOT_FOUND') {
    return NextResponse.json({ error: 'StudyNote not found' }, { status: 404 })
  }

  if (result.kind === 'VERSION_NOT_FOUND') {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 })
  }

  return NextResponse.json(
    {
      ok: true,
      kind: result.kind,
      fromVersion: result.fromVersion,
      toVersion: result.toVersion,
    },
    { status: 200 },
  )
}
