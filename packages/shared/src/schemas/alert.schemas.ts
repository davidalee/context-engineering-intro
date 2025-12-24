import { z } from 'zod'

export const createAlertSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  location: z.string().optional(),
})

export const deleteAlertSchema = z.object({
  id: z.coerce.number().positive(),
})

export type CreateAlertInput = z.infer<typeof createAlertSchema>
export type DeleteAlertInput = z.infer<typeof deleteAlertSchema>
