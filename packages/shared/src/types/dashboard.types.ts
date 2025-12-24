import type { VerificationStatus } from './auth.types'

export interface DashboardData {
  welcome: WelcomeData
  activity: ActivityItem[]
  alerts: AlertsPreview
  stats: UserStats
  hasMore: boolean
  cursor?: string
}

export interface WelcomeData {
  displayName: string
  isVerified: boolean
  verificationStatus: VerificationStatus
  summaryText: string
}

export type ActivityType =
  | 'comment_received'
  | 'comment_on_followed'
  | 'alert_match'
  | 'post_published'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  preview: string
  createdAt: string
  relatedPostId?: number
  relatedUserId?: string
}

export interface AlertsPreview {
  totalCount: number
  recentMatches: AlertMatch[]
}

export interface AlertMatch {
  id: string
  name: string
  matchedPostId: number
  matchedAt: string
}

export interface UserStats {
  postsCount: number
  commentsReceivedCount: number
  memberSinceDays: number
}
