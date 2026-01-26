import { z } from 'zod'

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded', 'unhealthy']),
  timestamp: z.string(),
  uptime: z.number(),
  checks: z.object({
    database: z.enum(['ok', 'degraded', 'error']),
    memory: z
      .object({
        rssMB: z.number(),
        heapUsedMB: z.number(),
        heapTotalMB: z.number(),
        status: z.enum(['ok', 'high']),
      })
      .optional(),
  }),
  version: z.string(),
})

export type HealthResponse = z.infer<typeof healthResponseSchema>
