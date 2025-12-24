import { eq } from 'drizzle-orm'
import { jumioConfig, getJumioConfig, getJumioAuthHeader } from '../config/jumio.js'
import { getDatabase } from '../config/database.js'
import { userVerificationStatus } from '../db/schema.js'
import { logger } from '../utils/logger.js'

export interface InitiateVerificationResult {
  authorizationToken: string
  transactionReference: string
}

export async function initiateVerification(
  userId: string,
  email: string
): Promise<InitiateVerificationResult> {
  if (!jumioConfig.isConfigured) {
    throw new Error('Identity verification is not configured')
  }

  const config = getJumioConfig()

  const workflowPayload = {
    customerInternalReference: userId,
    userReference: email,
    workflowDefinition: {
      key: 'ID_VERIFICATION',
    },
  }

  const response = await fetch(`${config.baseUrl}/api/v1/accounts`, {
    method: 'POST',
    headers: {
      Authorization: getJumioAuthHeader(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'BetweenUs/1.0',
    },
    body: JSON.stringify(workflowPayload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    logger.error('Jumio API error', { status: response.status, error: errorText })
    throw new Error('Failed to initiate identity verification')
  }

  const data = await response.json() as {
    account: { id: string }
    web: { href: string; authorizationToken: string }
  }

  const transactionReference = data.account.id
  const authorizationToken = data.web.authorizationToken

  const db = getDatabase()
  await db
    .insert(userVerificationStatus)
    .values({
      userId,
      status: 'processing',
      provider: 'jumio',
      transactionReference,
    })
    .onConflictDoUpdate({
      target: userVerificationStatus.userId,
      set: {
        status: 'processing',
        provider: 'jumio',
        transactionReference,
        updatedAt: new Date(),
      },
    })

  logger.info('Verification initiated', { userId, transactionReference })

  return {
    authorizationToken,
    transactionReference,
  }
}

export async function getVerificationStatus(userId: string) {
  const db = getDatabase()

  const [status] = await db
    .select()
    .from(userVerificationStatus)
    .where(eq(userVerificationStatus.userId, userId))
    .limit(1)

  return status || null
}

export const jumioService = {
  initiateVerification,
  getVerificationStatus,
}
