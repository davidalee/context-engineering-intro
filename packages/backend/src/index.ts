import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { healthRoutes, authRoutes, webhookRoutes, postsRoutes } from './routes/index.js'
import { errorMiddleware } from './middleware/index.js'
import { logger } from './utils/index.js'

const PORT = process.env.PORT || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8081'

export const app = express()

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/webhooks', webhookRoutes)
app.use('/api/posts', postsRoutes)

app.use(errorMiddleware)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`)
    logger.info(`Health check: http://localhost:${PORT}/api/health`)
  })
}
