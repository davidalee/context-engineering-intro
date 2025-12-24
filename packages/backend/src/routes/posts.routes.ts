import { Router } from 'express'
import {
  createPostSchema,
  rewriteRequestSchema,
  analyzeContentSchema,
} from '@betweenus/shared'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validateRequest } from '../middleware/validation.middleware.js'
import {
  handleCreatePost,
  handleGetPost,
  handleGetMyPosts,
  handleAnalyzeContent,
  handleRewriteRequest,
} from '../controllers/posts.controller.js'

const router = Router()

router.post('/', requireAuth, validateRequest(createPostSchema), handleCreatePost)

router.get('/me', requireAuth, handleGetMyPosts)

router.get('/:id', requireAuth, handleGetPost)

router.post('/analyze', requireAuth, validateRequest(analyzeContentSchema), handleAnalyzeContent)

router.post('/rewrite', requireAuth, validateRequest(rewriteRequestSchema), handleRewriteRequest)

export const postsRoutes = router
