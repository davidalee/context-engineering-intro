import type { Request, Response, NextFunction } from 'express'
import type { CreatePostInput, RewriteRequestInput, AnalyzeContentInput } from '@betweenus/shared'
import {
  createPost,
  getPostById,
  getPostsByUserId,
  analyzePostContent,
  getRewriteSuggestions,
  getPostFooter,
} from '../services/posts.service.js'
import { getSuccessMessage, getErrorMessage } from '../utils/brand-voice.js'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'

type ValidatedRequest<T> = Request & { validated: T }

export async function handleCreatePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest
    const validatedReq = req as ValidatedRequest<CreatePostInput>

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: getErrorMessage('unauthorized'),
      })
      return
    }

    const result = await createPost(authReq.user.id, validatedReq.validated)

    res.status(201).json({
      success: true,
      message: getSuccessMessage('postCreated'),
      data: {
        post: {
          id: result.post.id,
          originalText: result.post.originalText,
          rewrittenText: result.post.rewrittenText,
          status: result.post.status,
          createdAt: result.post.createdAt,
          footer: getPostFooter(),
        },
        analysis: {
          triggerCount: result.analysis.matches.length,
          tooltips: result.analysis.tooltips,
          requiresReview: result.requiresReview,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function handleGetPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest
    const postId = parseInt(req.params.id, 10)

    if (isNaN(postId)) {
      res.status(400).json({
        success: false,
        message: getErrorMessage('validationFailed'),
        errors: [{ field: 'id', message: 'Invalid post ID' }],
      })
      return
    }

    const post = await getPostById(postId)

    if (!post) {
      res.status(404).json({
        success: false,
        message: getErrorMessage('postNotFound'),
      })
      return
    }

    if (post.userId !== authReq.user?.id && post.status !== 'published') {
      res.status(404).json({
        success: false,
        message: getErrorMessage('postNotFound'),
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        post: {
          id: post.id,
          originalText: post.originalText,
          rewrittenText: post.rewrittenText,
          status: post.status,
          createdAt: post.createdAt,
          footer: getPostFooter(),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function handleGetMyPosts(
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

    const posts = await getPostsByUserId(authReq.user.id)

    res.status(200).json({
      success: true,
      data: {
        posts: posts.map((post) => ({
          id: post.id,
          originalText: post.originalText,
          rewrittenText: post.rewrittenText,
          status: post.status,
          createdAt: post.createdAt,
          footer: getPostFooter(),
        })),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function handleAnalyzeContent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedReq = req as ValidatedRequest<AnalyzeContentInput>

    const result = await analyzePostContent(validatedReq.validated.text)

    res.status(200).json({
      success: true,
      data: {
        triggerCount: result.analysis.matches.length,
        tooltips: result.analysis.tooltips,
        hasBlockingContent: result.analysis.hasBlockingTriggers,
        requiresReview: result.requiresReview,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function handleRewriteRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedReq = req as ValidatedRequest<RewriteRequestInput>

    const suggestions = await getRewriteSuggestions(
      validatedReq.validated.text,
      validatedReq.validated.triggerCategory
    )

    if (suggestions.length === 0) {
      res.status(500).json({
        success: false,
        message: getErrorMessage('serverError'),
      })
      return
    }

    res.status(200).json({
      success: true,
      message: getSuccessMessage('rewriteGenerated'),
      data: {
        suggestions,
        originalText: validatedReq.validated.text,
        triggerCategory: validatedReq.validated.triggerCategory,
      },
    })
  } catch (error) {
    next(error)
  }
}
