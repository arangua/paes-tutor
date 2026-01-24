import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { restoreStudyNoteToVersion } from '@/lib/study-notes/study-note-versioning'
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

  const { id } = parsedParams.data
  const { version } = parsedBody.data

  const access = await requireStudyNoteAccess(prisma, id)
  if (!access.ok) {
    return NextResponse.json({ error: access.message }, { status: access.status })
  }

  const user = await getCurrentUserOrNull()
  const restoredByUserId = user?.userId ?? null

  const restored = await restoreStudyNoteToVersion(prisma, id, version, {
    restoredByUserId,
    source: 'API',
    changeSummary: `Restored from v${version} via API`,
  })

  return NextResponse.json(
    {
      restoredNote: restored,
      restoredToVersion: version,
      newCurrentVersion: restored.currentVersion,
    },
    { status: 200 },
  )
}
