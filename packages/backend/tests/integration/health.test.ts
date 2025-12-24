import request from 'supertest'
import { app } from '../../src/index.js'
import { healthResponseSchema } from '@betweenus/shared'

describe('Health Check API', () => {
  describe('GET /api/health', () => {
    it('should return 200 with health status', async () => {
      const response = await request(app).get('/api/health').expect(200)

      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body.status).toBe('ok')
    })

    it('should return response matching schema', async () => {
      const response = await request(app).get('/api/health').expect(200)

      const result = healthResponseSchema.safeParse(response.body)
      expect(result.success).toBe(true)
    })

    it('should include database connection status', async () => {
      const response = await request(app).get('/api/health').expect(200)

      expect(response.body).toHaveProperty('database')
      expect(['connected', 'disconnected']).toContain(response.body.database)
    })

    it('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/api/health').expect(200)

      const timestamp = new Date(response.body.timestamp)
      expect(timestamp.toISOString()).toBe(response.body.timestamp)
    })
  })
})
