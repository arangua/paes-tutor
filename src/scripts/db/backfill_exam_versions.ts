import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

import { prisma } from '@/lib/prisma'

async function main() {
  const exams = await prisma.exam.findMany({ select: { id: true } })

  for (const exam of exams) {
    // Obtener versión existente o crear v1 activa
    let v1 = await prisma.examVersion.findFirst({
      where: { examId: exam.id },
      select: { id: true },
    })
    if (!v1) {
      v1 = await prisma.examVersion.create({
        data: {
          examId: exam.id,
          status: 'ACTIVE',
          source: 'backfill',
          notes: 'Versión inicial creada por backfill (pre-versionado)',
        },
        select: { id: true },
      })
    }

    // Conectar ExamQuestions existentes a v1 (raw: schema actual tiene examVersionId obligatorio en tipos)
    await prisma.$executeRaw`
      UPDATE "ExamQuestion" SET "examVersionId" = ${v1.id}
      WHERE "examId" = ${exam.id} AND "examVersionId" IS NULL
    `

    // Conectar Attempts existentes a v1
    await prisma.$executeRaw`
      UPDATE "Attempt" SET "examVersionId" = ${v1.id}
      WHERE "examId" = ${exam.id} AND "examVersionId" IS NULL
    `
  }

  console.warn('OK backfill_exam_versions')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
