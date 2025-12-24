import { Router } from 'express'
import { getSupabaseClient } from '../config/supabase.js'
import { getDatabase } from '../config/database.js'
import { authenticateUser, type AuthenticatedRequest } from '../middleware/auth.middleware.js'
import { profiles, userRoles } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { logger } from '../utils/logger.js'

const router = Router()

router.post('/verify-token', authenticateUser, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    data: {
      valid: true,
      userId: req.user?.id,
      email: req.user?.email,
    },
    timestamp: new Date().toISOString(),
  })
})

router.get('/me', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
        timestamp: new Date().toISOString(),
      })
      return
    }

    const db = getDatabase()

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1)

    const [role] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId))
      .limit(1)

    res.json({
      success: true,
      data: {
        user: req.user,
        profile: profile || null,
        role: role?.role || 'member',
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

router.get('/mfa/factors', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const supabase = getSupabaseClient()
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
        timestamp: new Date().toISOString(),
      })
      return
    }

    const { data, error } = await supabase.auth.mfa.listFactors()

    if (error) {
      logger.error('Failed to list MFA factors', { error: error.message })
      res.status(400).json({
        success: false,
        error: 'Failed to retrieve MFA factors',
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.json({
      success: true,
      data: {
        factors: data.totp || [],
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

router.post('/mfa/enroll', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { friendlyName } = req.body
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: friendlyName || 'Authenticator App',
    })

    if (error) {
      logger.error('MFA enrollment failed', { error: error.message })
      res.status(400).json({
        success: false,
        error: 'Failed to enroll MFA. Please try again.',
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.json({
      success: true,
      data: {
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

router.post('/mfa/verify', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { factorId, code } = req.body
    const supabase = getSupabaseClient()

    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    })

    if (challengeError) {
      res.status(400).json({
        success: false,
        error: 'Failed to create MFA challenge',
        timestamp: new Date().toISOString(),
      })
      return
    }

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    })

    if (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid verification code. Please try again.',
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.json({
      success: true,
      data: {
        verified: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/mfa/unenroll/:factorId', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { factorId } = req.params
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.mfa.unenroll({ factorId })

    if (error) {
      res.status(400).json({
        success: false,
        error: 'Failed to remove MFA factor',
        timestamp: new Date().toISOString(),
      })
      return
    }

    res.json({
      success: true,
      data: { unenrolled: true },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

export default router
