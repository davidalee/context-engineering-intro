import { z } from 'zod'

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(),
  database: z.enum(['connected', 'disconnected']).optional(),
})

export type HealthResponse = z.infer<typeof healthResponseSchema>
