import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { listStudyNoteVersions } from '@/lib/study-notes/study-note-versioning'
import { paramsSchema, requireStudyNoteAccess } from '@/app/api/study-notes/_shared/study-note-guard'

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const parsed = paramsSchema.safeParse(ctx.params)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const { id } = parsed.data

  const access = await requireStudyNoteAccess(prisma, id)
  if (!access.ok) {
    return NextResponse.json({ error: access.message }, { status: access.status })
  }

  const versions = await listStudyNoteVersions(prisma, id)

  // Enterprise: no devolver snapshot completo en listado (peso + seguridad).
  // Devuelve metadata; snapshot solo por endpoint de detalle.
  const result = versions.map((v) => ({
    id: v.id,
    studyNoteId: v.studyNoteId,
    version: v.version,
    changeType: v.changeType,
    source: v.source,
    changeSummary: v.changeSummary,
    createdAt: v.createdAt,
    createdByUserId: v.createdByUserId,
  }))

  return NextResponse.json({ versions: result }, { status: 200 })
}
