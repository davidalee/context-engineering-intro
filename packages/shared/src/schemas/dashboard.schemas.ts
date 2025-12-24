import { z } from 'zod'

export const welcomeDataSchema = z.object({
  displayName: z.string(),
  isVerified: z.boolean(),
  verificationStatus: z.enum(['pending', 'processing', 'approved', 'denied', 'error']),
  summaryText: z.string(),
})

export const activityItemSchema = z.object({
  id: z.string(),
  type: z.enum(['comment_received', 'comment_on_followed', 'alert_match', 'post_published']),
  title: z.string(),
  preview: z.string(),
  createdAt: z.string(),
  relatedPostId: z.number().optional(),
  relatedUserId: z.string().optional(),
})

export const alertMatchSchema = z.object({
  id: z.string(),
  name: z.string(),
  matchedPostId: z.number(),
  matchedAt: z.string(),
})

export const alertsPreviewSchema = z.object({
  totalCount: z.number(),
  recentMatches: z.array(alertMatchSchema),
})

export const userStatsSchema = z.object({
  postsCount: z.number(),
  commentsReceivedCount: z.number(),
  memberSinceDays: z.number(),
})

export const dashboardResponseSchema = z.object({
  welcome: welcomeDataSchema,
  activity: z.array(activityItemSchema),
  alerts: alertsPreviewSchema,
  stats: userStatsSchema,
  hasMore: z.boolean(),
  cursor: z.string().optional(),
})

export const activityQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
})

export type DashboardResponse = z.infer<typeof dashboardResponseSchema>
export type ActivityQuery = z.infer<typeof activityQuerySchema>
