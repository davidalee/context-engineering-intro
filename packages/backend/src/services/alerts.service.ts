import { eq, and, ilike, count } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { nameAlerts, posts } from '../db/schema.js'
import { sendPushNotification } from './push.service.js'
import { logger } from '../utils/index.js'
import type { NameAlert } from '../db/schema.js'
import type { Alert, AlertsResponse } from '@betweenus/shared'

const MAX_ALERTS_PER_USER = 5

export class AlertLimitError extends Error {
  constructor() {
    super(`Maximum ${MAX_ALERTS_PER_USER} alerts allowed`)
    this.name = 'AlertLimitError'
  }
}

export async function createAlert(
  userId: string,
  name: string,
  location?: string
): Promise<Alert> {
  const db = getDatabase()

  const [countResult] = await db
    .select({ count: count() })
    .from(nameAlerts)
    .where(and(
      eq(nameAlerts.userId, userId),
      eq(nameAlerts.isActive, true)
    ))

  if ((countResult?.count || 0) >= MAX_ALERTS_PER_USER) {
    throw new AlertLimitError()
  }

  const normalizedName = name.toLowerCase().trim()
  const trimmedName = name.trim()

  const [alert] = await db
    .insert(nameAlerts)
    .values({
      userId,
      searchName: trimmedName,
      normalizedName,
      location: location?.trim() || null,
    })
    .returning()

  logger.info('Alert created', { userId, name: normalizedName })

  return formatAlert(alert)
}

export async function getAlerts(userId: string): Promise<AlertsResponse> {
  const db = getDatabase()

  const alerts = await db
    .select()
    .from(nameAlerts)
    .where(and(
      eq(nameAlerts.userId, userId),
      eq(nameAlerts.isActive, true)
    ))
    .orderBy(nameAlerts.createdAt)

  return {
    alerts: alerts.map(formatAlert),
    limit: MAX_ALERTS_PER_USER,
    current: alerts.length,
  }
}

export async function deleteAlert(alertId: number, userId: string): Promise<boolean> {
  const db = getDatabase()

  const [updated] = await db
    .update(nameAlerts)
    .set({ isActive: false })
    .where(and(
      eq(nameAlerts.id, alertId),
      eq(nameAlerts.userId, userId)
    ))
    .returning()

  if (updated) {
    logger.info('Alert deleted', { alertId, userId })
    return true
  }

  return false
}

export async function checkAlertsForPost(postId: number): Promise<void> {
  const db = getDatabase()

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (!post || !post.subjectName) {
    return
  }

  const normalizedPostName = post.subjectName.toLowerCase().trim()

  const matchingAlerts = await db
    .select()
    .from(nameAlerts)
    .where(and(
      eq(nameAlerts.isActive, true),
      ilike(nameAlerts.normalizedName, `%${normalizedPostName}%`)
    ))

  const notificationPromises: Promise<boolean>[] = []

  for (const alert of matchingAlerts) {
    if (alert.userId === post.userId) {
      continue
    }

    await db
      .update(nameAlerts)
      .set({ lastMatchedAt: new Date() })
      .where(eq(nameAlerts.id, alert.id))

    notificationPromises.push(
      sendPushNotification(
        alert.userId,
        'New experience shared',
        `Someone shared an experience about "${alert.searchName}"`,
        { postId, screen: 'SearchResults', query: alert.searchName }
      )
    )
  }

  await Promise.allSettled(notificationPromises)

  logger.info('Checked alerts for post', {
    postId,
    subjectName: normalizedPostName,
    matchCount: matchingAlerts.length,
    notificationsSent: notificationPromises.length,
  })
}

function formatAlert(alert: NameAlert): Alert {
  return {
    id: alert.id,
    searchName: alert.searchName,
    location: alert.location,
    isActive: alert.isActive,
    lastMatchedAt: alert.lastMatchedAt?.toISOString() || null,
    createdAt: alert.createdAt.toISOString(),
  }
}
