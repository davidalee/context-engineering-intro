import { z } from 'zod'

export const triggerCategories = [
  'diagnoses',
  'criminal_allegations',
  'character_attacks',
  'mind_reading',
  'rumor_amplification',
  'absolute_claims',
  'doxxing',
  'calls_to_action',
  'threats',
  'relationship_accusations',
] as const

export type TriggerCategory = (typeof triggerCategories)[number]

export const createPostSchema = z.object({
  text: z
    .string()
    .min(50, 'Posts must be at least 50 characters')
    .max(5000, 'Posts cannot exceed 5000 characters')
    .refine(
      (text) => /\b(I|my|me)\b/i.test(text),
      'Posts should use first-person language (I, my, me)'
    ),
  confirmations: z.object({
    firstPerson: z.literal(true, {
      errorMap: () => ({
        message: 'Please confirm this reflects your personal experience',
      }),
    }),
    noHarassment: z.literal(true, {
      errorMap: () => ({
        message: 'Please agree not to harass or threaten',
      }),
    }),
    understandsPublic: z.literal(true, {
      errorMap: () => ({
        message: 'Please acknowledge this may be read by the subject',
      }),
    }),
  }),
})

export type CreatePostInput = z.infer<typeof createPostSchema>

export const rewriteRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  triggerCategory: z.enum(triggerCategories),
})

export type RewriteRequestInput = z.infer<typeof rewriteRequestSchema>

export const postResponseSchema = z.object({
  id: z.number(),
  userId: z.string().uuid(),
  originalText: z.string(),
  rewrittenText: z.string().nullable(),
  status: z.enum(['draft', 'pending_review', 'published', 'rejected']),
  triggerMatches: z
    .array(
      z.object({
        category: z.string(),
        matched_text: z.string(),
        position: z.number(),
        severity: z.enum(['warn', 'block']),
      })
    )
    .nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type PostResponse = z.infer<typeof postResponseSchema>

export const analyzeContentSchema = z.object({
  text: z.string().min(1, 'Text is required'),
})

export type AnalyzeContentInput = z.infer<typeof analyzeContentSchema>
