import type { Request, Response, NextFunction } from 'express'
import { getDashboardData, getActivityFeed } from '../services/dashboard.service.js'
import { activityQuerySchema } from '@betweenus/shared'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import { getErrorMessage } from '../utils/brand-voice.js'

export async function handleGetDashboard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: getErrorMessage('unauthorized'),
      })
      return
    }

    const dashboardData = await getDashboardData(authReq.user.id)

    res.status(200).json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    next(error)
  }
}

export async function handleGetActivity(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: getErrorMessage('unauthorized'),
      })
      return
    }

    const queryResult = activityQuerySchema.safeParse(req.query)

    if (!queryResult.success) {
      res.status(400).json({
        success: false,
        message: getErrorMessage('validationFailed'),
        errors: queryResult.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      })
      return
    }

    const { cursor, limit } = queryResult.data
    const activity = await getActivityFeed(authReq.user.id, cursor, limit)

    res.status(200).json({
      success: true,
      data: {
        activity,
        hasMore: activity.length >= limit,
        cursor: activity.length > 0 ? activity[activity.length - 1].id : undefined,
      },
    })
  } catch (error) {
    next(error)
  }
}
