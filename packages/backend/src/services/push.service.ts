import { eq } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { pushTokens } from '../db/schema.js'
import { logger } from '../utils/index.js'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

interface ExpoPushMessage {
  to: string
  title: string
  body: string
  data?: Record<string, unknown>
  sound?: 'default' | null
  badge?: number
  channelId?: string
}

interface ExpoPushResponse {
  data: Array<{
    status: 'ok' | 'error'
    id?: string
    message?: string
    details?: { error: string }
  }>
}

export async function registerPushToken(
  userId: string,
  token: string,
  platform: 'ios' | 'android'
): Promise<void> {
  const db = getDatabase()

  const [existing] = await db
    .select()
    .from(pushTokens)
    .where(eq(pushTokens.token, token))
    .limit(1)

  if (existing) {
    if (existing.userId !== userId) {
      await db
        .update(pushTokens)
        .set({ userId, platform, updatedAt: new Date() })
        .where(eq(pushTokens.token, token))
    }
    return
  }

  await db
    .insert(pushTokens)
    .values({ userId, token, platform })

  logger.info('Push token registered', { userId, platform })
}

export async function removePushToken(token: string): Promise<void> {
  const db = getDatabase()

  await db
    .delete(pushTokens)
    .where(eq(pushTokens.token, token))

  logger.info('Push token removed')
}

export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<boolean> {
  const db = getDatabase()

  const userTokens = await db
    .select()
    .from(pushTokens)
    .where(eq(pushTokens.userId, userId))

  if (userTokens.length === 0) {
    logger.info('No push tokens for user', { userId })
    return false
  }

  const messages: ExpoPushMessage[] = userTokens.map(({ token }) => ({
    to: token,
    title,
    body,
    data,
    sound: 'default',
  }))

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(messages),
    })

    if (!response.ok) {
      logger.error('Expo Push API error', { status: response.status })
      return false
    }

    const result = await response.json() as ExpoPushResponse

    const invalidTokens: string[] = []
    result.data.forEach((receipt, index) => {
      if (receipt.status === 'error') {
        logger.warn('Push notification failed', {
          token: messages[index].to,
          error: receipt.details?.error,
        })

        if (receipt.details?.error === 'DeviceNotRegistered') {
          invalidTokens.push(messages[index].to)
        }
      }
    })

    for (const token of invalidTokens) {
      await removePushToken(token)
    }

    logger.info('Push notifications sent', {
      userId,
      sent: messages.length,
      invalid: invalidTokens.length,
    })

    return true
  } catch (error) {
    logger.error('Failed to send push notification', { error, userId })
    return false
  }
}

export async function sendBulkPushNotifications(
  notifications: Array<{
    userId: string
    title: string
    body: string
    data?: Record<string, unknown>
  }>
): Promise<void> {
  for (const notification of notifications) {
    await sendPushNotification(
      notification.userId,
      notification.title,
      notification.body,
      notification.data
    )
  }
}
