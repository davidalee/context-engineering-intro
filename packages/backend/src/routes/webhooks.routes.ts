import { Router } from 'express'
import crypto from 'crypto'
import { updateVerificationStatus } from '../services/verification.service.js'
import { mapDiditStatus } from '../services/didit.service.js'
import { getDiditConfig } from '../config/didit.js'
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
      return 'declined'
    case 'PENDING':
    case 'MANUAL_REVIEW':
      return 'in_review'
    default:
      return 'not_started'
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
      status === 'declined'
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

interface DiditWebhookPayload {
  session_id: string
  status: string
  webhook_type: 'status.updated' | 'data.updated'
  vendor_data?: string
  decision?: {
    id_verification?: {
      status: string
      document_type?: string
      issuing_country?: string
      decline_reasons?: string[]
    }
  }
}

function verifyDiditSignature(
  rawBody: string,
  signature: string | undefined,
  timestamp: string | undefined,
  secret: string
): boolean {
  if (!signature || !secret) return false

  if (timestamp) {
    const webhookTime = parseInt(timestamp, 10) * 1000
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    if (Math.abs(now - webhookTime) > fiveMinutes) {
      logger.warn('Didit webhook timestamp too old', { timestamp, now })
      return false
    }
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

router.post('/didit', async (req, res, next) => {
  try {
    const signature = req.headers['x-signature'] as string | undefined
    const timestamp = req.headers['x-timestamp'] as string | undefined
    const webhookSecret = getDiditConfig().webhookSecret

    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)

    if (webhookSecret && !verifyDiditSignature(rawBody, signature, timestamp, webhookSecret)) {
      logger.warn('Invalid Didit webhook signature')
      res.status(401).json({ error: 'Invalid signature' })
      return
    }

    const body: DiditWebhookPayload = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body

    const sessionId = body.session_id
    const diditStatus = body.status
    const decision = body.decision?.id_verification

    const status = mapDiditStatus(diditStatus)
    const idType = decision?.document_type
    const idCountry = decision?.issuing_country
    const declineReason = status === 'declined'
      ? decision?.decline_reasons?.join(', ') || 'Verification failed'
      : undefined

    logger.info('Didit webhook received', {
      sessionId,
      diditStatus,
      mappedStatus: status,
      webhookType: body.webhook_type,
    })

    await updateVerificationStatus(sessionId, {
      status,
      idType,
      idCountry,
      rejectReason: declineReason,
    })

    res.status(200).json({ received: true })
  } catch (error) {
    logger.error('Didit webhook error', { error })
    next(error)
  }
})

export default router
