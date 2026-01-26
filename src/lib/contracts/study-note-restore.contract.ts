import { z } from 'zod'

const base = z.object({
  ok: z.literal(true),
  kind: z.enum(['NOOP', 'APPLIED']),
  fromVersion: z.number(),
  toVersion: z.number(),
})

export const restoreNoopSchema = base.extend({
  kind: z.literal('NOOP'),
})

export const restoreAppliedSchema = base.extend({
  kind: z.literal('APPLIED'),
  restoredNote: z.record(z.string(), z.unknown()).optional(),
})

export const restoreResponseSchema = z.union([
  restoreNoopSchema,
  restoreAppliedSchema,
])

export type RestoreResponse = z.infer<typeof restoreResponseSchema>
