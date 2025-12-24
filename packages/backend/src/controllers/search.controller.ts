import type { Request, Response, NextFunction } from 'express'
import type { NameSearchInput, KeywordSearchInput, ImageSearchInput } from '@betweenus/shared'
import { searchByName, searchByKeyword } from '../services/search.service.js'
import { searchByImage, ImageSearchError } from '../services/image-search.service.js'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'

type ValidatedRequest<T> = Request & { validated: T }

export async function handleNameSearch(
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

    const validatedReq = req as ValidatedRequest<NameSearchInput>
    const { query, location, limit, cursor } = validatedReq.validated

    const result = await searchByName(query, location, limit, cursor)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export async function handleKeywordSearch(
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

    const validatedReq = req as ValidatedRequest<KeywordSearchInput>
    const { query, location, limit, cursor } = validatedReq.validated

    const result = await searchByKeyword(query, location, limit, cursor)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export async function handleImageSearch(
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

    const validatedReq = req as ValidatedRequest<ImageSearchInput>
    const { imageData, location, limit } = validatedReq.validated

    const result = await searchByImage(imageData, location, limit)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    if (error instanceof ImageSearchError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      })
      return
    }
    next(error)
  }
}
