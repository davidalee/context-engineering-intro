import type { Request, Response, NextFunction } from 'express'
import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from '../config/supabase.js'
import { logger } from '../utils/logger.js'

export interface AuthenticatedRequest extends Request {
  user?: User
}

export async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No authorization token provided. Please log in to continue.',
        timestamp: new Date().toISOString(),
      })
      return
    }

    const token = authHeader.split(' ')[1]
    const supabase = getSupabaseClient()

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      logger.warn('Authentication failed', { error: error?.message })
      res.status(401).json({
        success: false,
        error: 'Your session has expired. Please log in again.',
        timestamp: new Date().toISOString(),
      })
      return
    }

    req.user = user
    next()
  } catch (error) {
    logger.error('Authentication error', { error })
    res.status(500).json({
      success: false,
      error: 'We encountered an issue verifying your identity. Please try again.',
      timestamp: new Date().toISOString(),
    })
  }
}

export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next()
    return
  }

  authenticateUser(req, res, next)
}
