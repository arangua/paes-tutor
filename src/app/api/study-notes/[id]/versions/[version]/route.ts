import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getStudyNoteVersion } from '@/lib/study-notes/study-note-versioning'
import {
  versionParamsSchema,
  requireStudyNoteAccess,
} from '@/app/api/study-notes/_shared/study-note-guard'

export async function GET(
  _: Request,
  ctx: { params: { id: string; version: string } },
) {
  const parsed = versionParamsSchema.safeParse(ctx.params)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const { id, version } = parsed.data

  const access = await requireStudyNoteAccess(prisma, id)
  if (!access.ok) {
    return NextResponse.json({ error: access.message }, { status: access.status })
  }

  const studyNoteVersion = await getStudyNoteVersion(prisma, id, version)

  if (!studyNoteVersion) {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 })
  }

  return NextResponse.json(
    {
      id: studyNoteVersion.id,
      studyNoteId: studyNoteVersion.studyNoteId,
      version: studyNoteVersion.version,
      changeType: studyNoteVersion.changeType,
      source: studyNoteVersion.source,
      changeSummary: studyNoteVersion.changeSummary,
      createdAt: studyNoteVersion.createdAt,
      createdByUserId: studyNoteVersion.createdByUserId,
      snapshot: studyNoteVersion.snapshot,
    },
    { status: 200 },
  )
}
