import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from './auth.middleware.js'
import type { AppRole } from '@betweenus/shared'
import jwt from 'jsonwebtoken'
import { logger } from '../utils/logger.js'

const ROLE_HIERARCHY: Record<AppRole, number> = {
  admin: 3,
  moderator: 2,
  member: 1,
}

export function getUserRoleFromToken(authHeader: string | undefined): AppRole {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return 'member'
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.decode(token) as { user_role?: string } | null
    const role = decoded?.user_role as AppRole | undefined
    return role && ROLE_HIERARCHY[role] ? role : 'member'
  } catch {
    return 'member'
  }
}

export function requireRole(requiredRole: AppRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
        timestamp: new Date().toISOString(),
      })
      return
    }

    const userRole = getUserRoleFromToken(req.headers.authorization)
    const userLevel = ROLE_HIERARCHY[userRole]
    const requiredLevel = ROLE_HIERARCHY[requiredRole]

    if (userLevel < requiredLevel) {
      logger.warn('Access denied - insufficient permissions', {
        userId: req.user.id,
        userRole,
        requiredRole,
      })
      res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action.',
        timestamp: new Date().toISOString(),
      })
      return
    }

    next()
  }
}

export function requireAnyRole(...roles: AppRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
        timestamp: new Date().toISOString(),
      })
      return
    }

    const userRole = getUserRoleFromToken(req.headers.authorization)

    if (!roles.includes(userRole)) {
      logger.warn('Access denied - role not in allowed list', {
        userId: req.user.id,
        userRole,
        allowedRoles: roles,
      })
      res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action.',
        timestamp: new Date().toISOString(),
      })
      return
    }

    next()
  }
}
