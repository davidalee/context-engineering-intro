import { Router } from 'express'
import { createAlertSchema } from '@betweenus/shared'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validateRequest } from '../middleware/validation.middleware.js'
import {
  handleCreateAlert,
  handleGetAlerts,
  handleDeleteAlert,
} from '../controllers/alerts.controller.js'

const router = Router()

router.get('/', requireAuth, handleGetAlerts)

router.post('/', requireAuth, validateRequest(createAlertSchema), handleCreateAlert)

router.delete('/:id', requireAuth, handleDeleteAlert)

export default router
