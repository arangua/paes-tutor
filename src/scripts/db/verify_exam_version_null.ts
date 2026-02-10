import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

import { prisma } from '@/lib/prisma'

async function main() {
  const [eq] = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*)::bigint as count FROM "ExamQuestion" WHERE "examVersionId" IS NULL
  `
  const [at] = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*)::bigint as count FROM "Attempt" WHERE "examVersionId" IS NULL
  `
  console.warn('ExamQuestion examVersionId NULL:', Number(eq?.count ?? 0))
  console.warn('Attempt examVersionId NULL:', Number(at?.count ?? 0))
}

main()
  .finally(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
