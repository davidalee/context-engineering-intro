import { logger } from '../utils/logger.js'

export interface DiditConfig {
  apiKey: string
  workflowId: string
  webhookSecret: string
  baseUrl: string
}

export function getDiditConfig(): DiditConfig {
  const apiKey = process.env.DIDIT_API_KEY || ''
  const workflowId = process.env.DIDIT_WORKFLOW_ID || ''
  const webhookSecret = process.env.DIDIT_WEBHOOK_SECRET || ''

  if (!apiKey || !workflowId) {
    logger.warn('Didit credentials not configured - identity verification disabled')
  }

  return {
    apiKey,
    workflowId,
    webhookSecret,
    baseUrl: 'https://verification.didit.me/v2',
  }
}

export function getDiditHeaders(): Record<string, string> {
  const config = getDiditConfig()
  return {
    'x-api-key': config.apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

export const diditConfig = {
  get isConfigured(): boolean {
    const config = getDiditConfig()
    return !!config.apiKey && !!config.workflowId
  },
}
