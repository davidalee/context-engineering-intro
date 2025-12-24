import type { Request, Response, NextFunction } from 'express'
import type { CreateAlertInput } from '@betweenus/shared'
import { createAlert, getAlerts, deleteAlert, AlertLimitError } from '../services/alerts.service.js'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'

type ValidatedRequest<T> = Request & { validated: T }

export async function handleCreateAlert(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
      return
    }

    const validatedReq = req as ValidatedRequest<CreateAlertInput>
    const { name, location } = validatedReq.validated

    const alert = await createAlert(authReq.user.id, name, location)

    res.status(201).json({
      success: true,
      message: "You'll be notified when someone shares an experience about this name.",
      data: alert,
    })
  } catch (error) {
    if (error instanceof AlertLimitError) {
      res.status(400).json({
        success: false,
        message: "You've reached the limit of 5 saved names. Remove one to add another.",
      })
      return
    }
    next(error)
  }
}

export async function handleGetAlerts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
      return
    }

    const result = await getAlerts(authReq.user.id)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export async function handleDeleteAlert(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
      return
    }

    const alertId = parseInt(req.params.id, 10)

    if (isNaN(alertId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid alert ID',
      })
      return
    }

    const deleted = await deleteAlert(alertId, authReq.user.id)

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Alert not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Alert removed successfully',
    })
  } catch (error) {
    next(error)
  }
}
