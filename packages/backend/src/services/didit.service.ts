import { eq } from 'drizzle-orm'
import { diditConfig, getDiditConfig, getDiditHeaders } from '../config/didit.js'
import { getDatabase } from '../config/database.js'
import { userVerificationStatus } from '../db/schema.js'
import { logger } from '../utils/logger.js'
import type { VerificationStatus } from '@betweenus/shared'

export interface CreateSessionResult {
  sessionId: string
  verificationUrl: string
}

export interface DiditSessionResponse {
  session_id: string
  session_token: string
  url: string
}

const VALID_STATUSES: Set<VerificationStatus> = new Set([
  'not_started',
  'in_progress',
  'approved',
  'declined',
  'kyc_expired',
  'in_review',
  'expired',
  'abandoned',
])

export function mapDiditStatus(diditStatus: string): VerificationStatus {
  const normalizedStatus = diditStatus.toLowerCase().replace(/\s+/g, '_') as VerificationStatus
  if (VALID_STATUSES.has(normalizedStatus)) {
    return normalizedStatus
  }
  logger.warn('Unknown Didit status', { diditStatus })
  return 'not_started'
}

export async function createSession(
  userId: string,
  email: string
): Promise<CreateSessionResult> {
  if (!diditConfig.isConfigured) {
    throw new Error('Identity verification is not configured')
  }

  const config = getDiditConfig()
  const callbackUrl = `${process.env.API_URL}/api/webhooks/didit`

  const response = await fetch(`${config.baseUrl}/session/`, {
    method: 'POST',
    headers: getDiditHeaders(),
    body: JSON.stringify({
      workflow_id: config.workflowId,
      vendor_data: userId,
      callback: callbackUrl,
      contact_details: { email },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    logger.error('Didit API error', { status: response.status, error: errorText })

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.')
    }
    throw new Error('Failed to initiate identity verification')
  }

  const data = await response.json() as DiditSessionResponse

  const sessionId = data.session_id
  const verificationUrl = data.url

  const db = getDatabase()
  await db
    .insert(userVerificationStatus)
    .values({
      userId,
      status: 'not_started',
      provider: 'didit',
      transactionReference: sessionId,
    })
    .onConflictDoUpdate({
      target: userVerificationStatus.userId,
      set: {
        status: 'not_started',
        provider: 'didit',
        transactionReference: sessionId,
        updatedAt: new Date(),
      },
    })

  logger.info('Didit session created', { userId, sessionId })

  return { sessionId, verificationUrl }
}

export async function getVerificationStatusByUserId(userId: string) {
  const db = getDatabase()

  const [status] = await db
    .select()
    .from(userVerificationStatus)
    .where(eq(userVerificationStatus.userId, userId))
    .limit(1)

  return status || null
}

export async function getSessionDecision(sessionId: string) {
  const config = getDiditConfig()

  const response = await fetch(`${config.baseUrl}/session/${sessionId}/decision/`, {
    method: 'GET',
    headers: getDiditHeaders(),
  })

  if (!response.ok) {
    logger.error('Failed to get Didit decision', { sessionId, status: response.status })
    return null
  }

  return response.json()
}

export const diditService = {
  createSession,
  getVerificationStatusByUserId,
  getSessionDecision,
  mapDiditStatus,
}
