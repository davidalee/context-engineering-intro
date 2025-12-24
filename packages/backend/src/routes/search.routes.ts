import { Router } from 'express'
import { nameSearchSchema, keywordSearchSchema, imageSearchSchema } from '@betweenus/shared'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validateQuery, validateRequest } from '../middleware/validation.middleware.js'
import {
  handleNameSearch,
  handleKeywordSearch,
  handleImageSearch,
} from '../controllers/search.controller.js'

const router = Router()

router.get('/name', requireAuth, validateQuery(nameSearchSchema), handleNameSearch)

router.get('/keyword', requireAuth, validateQuery(keywordSearchSchema), handleKeywordSearch)

router.post('/image', requireAuth, validateRequest(imageSearchSchema), handleImageSearch)

export default router
