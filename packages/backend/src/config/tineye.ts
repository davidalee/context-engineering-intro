import { logger } from '../utils/index.js'

export interface TinEyeConfig {
  apiKey: string | undefined
  baseUrl: string
  isSandbox: boolean
}

const TINEYE_API_KEY = process.env.TINEYE_API_KEY
const TINEYE_SANDBOX = process.env.TINEYE_SANDBOX === 'true'

if (!TINEYE_API_KEY) {
  logger.warn('TINEYE_API_KEY is not set. Image search will not work.')
}

export function getTinEyeConfig(): TinEyeConfig {
  return {
    apiKey: TINEYE_API_KEY,
    baseUrl: TINEYE_SANDBOX
      ? 'https://api.tineye.com/rest/sandbox'
      : 'https://api.tineye.com/rest',
    isSandbox: TINEYE_SANDBOX,
  }
}

export function isTinEyeConfigured(): boolean {
  return !!TINEYE_API_KEY
}
