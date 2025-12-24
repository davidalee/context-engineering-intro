import type { Request, Response, NextFunction, RequestHandler } from 'express'
import type { ZodSchema, ZodError } from 'zod'
import { getErrorMessage } from '../utils/brand-voice.js'

type ValidatedRequest<T> = Request & { validated: T }

export function validateRequest<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body) as T
      ;(req as ValidatedRequest<T>).validated = validated
      next()
    } catch (error) {
      const zodError = error as ZodError

      const formattedErrors = zodError.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      res.status(400).json({
        success: false,
        message: getErrorMessage('validationFailed'),
        errors: formattedErrors,
      })
    }
  }
}

export function validateQuery<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query) as T
      ;(req as ValidatedRequest<T>).validated = validated
      next()
    } catch (error) {
      const zodError = error as ZodError

      const formattedErrors = zodError.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      res.status(400).json({
        success: false,
        message: getErrorMessage('validationFailed'),
        errors: formattedErrors,
      })
    }
  }
}

export function validateParams<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params) as T
      ;(req as ValidatedRequest<T>).validated = validated
      next()
    } catch (error) {
      const zodError = error as ZodError

      const formattedErrors = zodError.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      res.status(400).json({
        success: false,
        message: getErrorMessage('validationFailed'),
        errors: formattedErrors,
      })
    }
  }
}
