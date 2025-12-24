import type { Response } from 'express'
import type { ApiResponse } from '@betweenus/shared'

export function success<T>(res: Response, data: T, statusCode = 200): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }
  return res.status(statusCode).json(response)
}

export function error(res: Response, message: string, statusCode = 500): Response {
  const response: ApiResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  }
  return res.status(statusCode).json(response)
}

export const response = {
  success,
  error,
}
