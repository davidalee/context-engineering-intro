import { z } from 'zod'

export const verificationStatusEnum = z.enum([
  'pending',
  'processing',
  'approved',
  'denied',
  'error',
])

export const initiateVerificationResponseSchema = z.object({
  sessionId: z.string(),
  verificationUrl: z.string().url(),
})

export const verificationStatusResponseSchema = z.object({
  status: verificationStatusEnum,
  provider: z.string().optional(),
  idType: z.string().optional(),
  idCountry: z.string().optional(),
  verifiedAt: z.string().optional(),
  declineReason: z.string().optional(),
})

export const diditWebhookPayloadSchema = z.object({
  session_id: z.string(),
  status: z.string(),
  webhook_type: z.enum(['status.updated', 'data.updated']),
  created_at: z.number().optional(),
  workflow_id: z.string().optional(),
  vendor_data: z.string().optional(),
  decision: z.object({
    id_verification: z.object({
      status: z.string(),
      document_type: z.string().optional(),
      issuing_country: z.string().optional(),
      decline_reasons: z.array(z.string()).optional(),
    }).optional(),
  }).optional(),
})

export type InitiateVerificationResponse = z.infer<typeof initiateVerificationResponseSchema>
export type VerificationStatusResponse = z.infer<typeof verificationStatusResponseSchema>
export type DiditWebhookPayload = z.infer<typeof diditWebhookPayloadSchema>
