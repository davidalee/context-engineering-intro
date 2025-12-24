import { Router } from 'express'
import { healthResponseSchema, type HealthResponse } from '@betweenus/shared'
import { checkDatabaseConnection, getDatabase } from '../config/database.js'
import { healthChecks } from '../db/schema.js'
import { logger } from '../utils/logger.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const dbConnected = await checkDatabaseConnection()

    if (dbConnected) {
      try {
        const db = getDatabase()
        await db.insert(healthChecks).values({
          status: 'ok',
        })
      } catch (insertError) {
        logger.warn('Failed to insert health check record', { error: insertError })
      }
    }

    const response: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
    }

    const validated = healthResponseSchema.parse(response)

    res.json(validated)
  } catch (error) {
    next(error)
  }
})

export default router
