import { eq, desc, count, isNull, and } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { posts, profiles, userVerificationStatus } from '../db/schema.js'
import type {
  DashboardData,
  WelcomeData,
  ActivityItem,
  AlertsPreview,
  UserStats,
  VerificationStatus,
} from '@betweenus/shared'

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [welcome, activity, alerts, stats] = await Promise.all([
    getWelcomeData(userId),
    getActivityFeed(userId),
    getAlertsPreview(userId),
    getUserStats(userId),
  ])

  return {
    welcome,
    activity,
    alerts,
    stats,
    hasMore: activity.length >= 10,
    cursor: activity.length > 0 ? activity[activity.length - 1].id : undefined,
  }
}

export async function getWelcomeData(userId: string): Promise<WelcomeData> {
  const db = getDatabase()

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1)

  const [verification] = await db
    .select()
    .from(userVerificationStatus)
    .where(eq(userVerificationStatus.userId, userId))
    .limit(1)

  const displayName = profile?.fullName || 'there'
  const isVerified = verification?.status === 'approved'
  const verificationStatus: VerificationStatus = verification?.status || 'pending'

  const summaryText = 'Welcome back'

  return {
    displayName,
    isVerified,
    verificationStatus,
    summaryText,
  }
}

export async function getActivityFeed(
  userId: string,
  _cursor?: string,
  limit: number = 10
): Promise<ActivityItem[]> {
  const db = getDatabase()

  const userPosts = await db
    .select({
      id: posts.id,
      status: posts.status,
      createdAt: posts.createdAt,
      originalText: posts.originalText,
    })
    .from(posts)
    .where(and(eq(posts.userId, userId), isNull(posts.deletedAt)))
    .orderBy(desc(posts.createdAt))
    .limit(limit)

  return userPosts.map((post) => ({
    id: `post-${post.id}`,
    type: 'post_published' as const,
    title: 'Your experience was shared',
    preview: post.originalText.slice(0, 100) + (post.originalText.length > 100 ? '...' : ''),
    createdAt: post.createdAt.toISOString(),
    relatedPostId: post.id,
  }))
}

export async function getAlertsPreview(_userId: string): Promise<AlertsPreview> {
  return {
    totalCount: 0,
    recentMatches: [],
  }
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const db = getDatabase()

  const [postsResult] = await db
    .select({ count: count() })
    .from(posts)
    .where(and(eq(posts.userId, userId), isNull(posts.deletedAt)))

  const [profile] = await db
    .select({ createdAt: profiles.createdAt })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1)

  const memberSinceDays = profile
    ? Math.floor((Date.now() - profile.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return {
    postsCount: postsResult?.count || 0,
    commentsReceivedCount: 0,
    memberSinceDays,
  }
}

export const dashboardService = {
  getDashboardData,
  getWelcomeData,
  getActivityFeed,
  getAlertsPreview,
  getUserStats,
}
