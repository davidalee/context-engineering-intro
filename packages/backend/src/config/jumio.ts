import { logger } from '../utils/logger.js'

export interface JumioConfig {
  apiToken: string
  apiSecret: string
  baseUrl: string
  datacenter: 'US' | 'EU' | 'SG'
}

const DATACENTER_URLS: Record<string, string> = {
  US: 'https://account.amer-1.jumio.ai',
  EU: 'https://account.emea-1.jumio.ai',
  SG: 'https://account.apac-1.jumio.ai',
}

export function getJumioConfig(): JumioConfig {
  const apiToken = process.env.JUMIO_API_TOKEN
  const apiSecret = process.env.JUMIO_API_SECRET
  const datacenter = (process.env.JUMIO_DATACENTER || 'US') as 'US' | 'EU' | 'SG'

  if (!apiToken || !apiSecret) {
    logger.warn('Jumio credentials not configured - identity verification disabled')
    return {
      apiToken: '',
      apiSecret: '',
      baseUrl: '',
      datacenter: 'US',
    }
  }

  return {
    apiToken,
    apiSecret,
    baseUrl: DATACENTER_URLS[datacenter],
    datacenter,
  }
}

export function getJumioAuthHeader(): string {
  const config = getJumioConfig()
  const credentials = Buffer.from(`${config.apiToken}:${config.apiSecret}`).toString('base64')
  return `Basic ${credentials}`
}

export const jumioConfig = {
  get config() {
    return getJumioConfig()
  },
  get authHeader() {
    return getJumioAuthHeader()
  },
  get isConfigured() {
    const config = getJumioConfig()
    return !!config.apiToken && !!config.apiSecret
  },
}
