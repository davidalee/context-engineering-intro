import OpenAI from 'openai'
import { logger } from '../utils/index.js'

if (!process.env.OPENAI_API_KEY) {
  logger.warn('OPENAI_API_KEY is not set. AI features will not work.')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const OPENAI_MODEL = 'gpt-4o-mini'
export const OPENAI_REWRITE_MAX_TOKENS = 500
export const OPENAI_REWRITE_TEMPERATURE = 0.7
