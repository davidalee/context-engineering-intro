import { Router } from 'express'
import crypto from 'crypto'
import { updateVerificationStatus } from '../services/verification.service.js'
import { logger } from '../utils/logger.js'
import type { VerificationStatus } from '@betweenus/shared'

const router = Router()

function verifyJumioSignature(
  payload: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

interface JumioWebhookPayload {
  accountId: string
  workflowExecution: {
    id: string
    status: string
  }
  decision: {
    type: string
    details?: {
      label?: string
    }
  }
  capabilities?: {
    idVerification?: {
      decision?: {
        type: string
        details?: { label?: string }
      }
      data?: {
        type?: string
        issuingCountry?: string
      }
    }
  }
}

function mapJumioStatusToVerificationStatus(
  decision: string
): VerificationStatus {
  switch (decision.toUpperCase()) {
    case 'PASSED':
    case 'OK':
      return 'approved'
    case 'REJECTED':
    case 'FAILED':
      return 'denied'
    case 'PENDING':
    case 'MANUAL_REVIEW':
      return 'processing'
    default:
      return 'error'
  }
}

router.post('/jumio', async (req, res, next) => {
  try {
    const signature = req.headers['x-jumio-signature'] as string | undefined
    const webhookSecret = process.env.JUMIO_WEBHOOK_SECRET

    if (webhookSecret) {
      const payload = JSON.stringify(req.body)
      if (!verifyJumioSignature(payload, signature, webhookSecret)) {
        logger.warn('Invalid Jumio webhook signature')
        res.status(401).json({ error: 'Invalid signature' })
        return
      }
    }

    const body = req.body as JumioWebhookPayload

    const transactionReference = body.accountId
    const decisionType = body.decision?.type || 'UNKNOWN'
    const idVerification = body.capabilities?.idVerification

    const status = mapJumioStatusToVerificationStatus(decisionType)
    const idType = idVerification?.data?.type
    const idCountry = idVerification?.data?.issuingCountry
    const rejectReason =
      status === 'denied'
        ? body.decision?.details?.label || 'Verification failed'
        : undefined

    logger.info('Jumio webhook received', {
      transactionReference,
      decisionType,
      status,
    })

    await updateVerificationStatus(transactionReference, {
      status,
      idType,
      idCountry,
      rejectReason,
    })

    res.status(200).json({ received: true })
  } catch (error) {
    logger.error('Jumio webhook error', { error })
    next(error)
  }
})

export default router
