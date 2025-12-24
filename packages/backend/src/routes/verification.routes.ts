import { Router } from 'express'
import { authenticateUser, type AuthenticatedRequest } from '../middleware/auth.middleware.js'
import { createSession, getVerificationStatusByUserId } from '../services/didit.service.js'
import { logger } from '../utils/logger.js'

const router = Router()

router.post('/', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated',
        timestamp: new Date().toISOString(),
      })
      return
    }

    const email = req.user.email
    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email required for verification',
        timestamp: new Date().toISOString(),
      })
      return
    }

    const result = await createSession(req.user.id, email)

    res.json({
      success: true,
      data: {
        sessionId: result.sessionId,
        verificationUrl: result.verificationUrl,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Failed to initiate verification', { error })
    next(error)
  }
})

router.get('/status', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated',
        timestamp: new Date().toISOString(),
      })
      return
    }

    const status = await getVerificationStatusByUserId(req.user.id)

    res.json({
      success: true,
      data: status ? {
        status: status.status,
        provider: status.provider,
        idType: status.idType,
        idCountry: status.idCountry,
        verifiedAt: status.verifiedAt?.toISOString(),
        declineReason: status.rejectReason,
      } : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Failed to get verification status', { error })
    next(error)
  }
})

export default router
