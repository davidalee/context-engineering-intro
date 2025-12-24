import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../utils/logger.js'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Request error', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  })

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))

    res.status(400).json({
      success: false,
      error: 'Validation failed. Please check your input.',
      details: formattedErrors,
      timestamp: new Date().toISOString(),
    })
    return
  }

  const statusCode = err.statusCode || 500
  const message =
    err.isOperational || statusCode < 500
      ? err.message
      : 'Something went wrong. Please try again.'

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  })
}
