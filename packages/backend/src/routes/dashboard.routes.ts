import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import {
  handleGetDashboard,
  handleGetActivity,
} from '../controllers/dashboard.controller.js'

const router = Router()

router.get('/', requireAuth, handleGetDashboard)

router.get('/activity', requireAuth, handleGetActivity)

export default router
