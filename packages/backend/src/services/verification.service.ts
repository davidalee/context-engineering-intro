import { eq } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { userVerificationStatus, profiles } from '../db/schema.js'
import { logger } from '../utils/logger.js'
import type { VerificationStatus } from '@betweenus/shared'

export interface VerificationUpdateData {
  status: VerificationStatus
  idType?: string
  idCountry?: string
  rejectReason?: string
}

export async function updateVerificationStatus(
  transactionReference: string,
  data: VerificationUpdateData
): Promise<void> {
  const db = getDatabase()

  const [existingStatus] = await db
    .select()
    .from(userVerificationStatus)
    .where(eq(userVerificationStatus.transactionReference, transactionReference))
    .limit(1)

  if (!existingStatus) {
    logger.warn('Verification status not found', { transactionReference })
    return
  }

  const userId = existingStatus.userId

  await db
    .update(userVerificationStatus)
    .set({
      status: data.status,
      idType: data.idType,
      idCountry: data.idCountry,
      rejectReason: data.rejectReason,
      verifiedAt: data.status === 'approved' ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(userVerificationStatus.transactionReference, transactionReference))

  if (data.status === 'approved') {
    await db
      .update(profiles)
      .set({
        isVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, userId))

    logger.info('User verified successfully', { userId, transactionReference })
  } else if (data.status === 'denied') {
    logger.info('User verification denied', {
      userId,
      transactionReference,
      reason: data.rejectReason,
    })
  }
}

export async function getVerificationByTransaction(transactionReference: string) {
  const db = getDatabase()

  const [status] = await db
    .select()
    .from(userVerificationStatus)
    .where(eq(userVerificationStatus.transactionReference, transactionReference))
    .limit(1)

  return status || null
}

export const verificationService = {
  updateVerificationStatus,
  getVerificationByTransaction,
}
