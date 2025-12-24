# Dashboard PRP - BetweenUs

**Version:** 1.0
**Created:** 2025-12-24
**Status:** Ready for Implementation
**Confidence Score:** 8/10

---

## Goal

Build the Dashboard screen - the first screen users see after authentication. The dashboard provides an overview of recent activity, alerts, comments, and quick actions while following the platform's measured, non-performative tone.

**End State:**
- Authenticated users land on Dashboard after login
- Dashboard displays personalized activity feed
- Users can see alerts for name matches and new comments
- Quick action buttons for common tasks (post, view alerts, manage profile)
- Statistics overview showing engagement metrics
- Pull-to-refresh for latest updates

---

## Why

- **User Orientation**: First impression after login - sets the tone for the entire experience
- **Engagement Hub**: Central location for all user activity and notifications
- **Quick Access**: Reduces friction for common tasks (posting, viewing alerts)
- **Pattern Awareness**: Shows users when there are overlapping experiences (without sensationalism)
- **Integration Point**: Aggregates data from posts, comments, alerts, and verification systems

---

## What

### User-Visible Behavior

1. **Welcome Section**
   - Personalized greeting with verification badge if verified
   - Brief status summary (e.g., "2 new alerts, 1 comment on your experiences")

2. **Activity Feed**
   - Recent activity relevant to the user
   - New comments on their posts
   - Activity on posts they've commented on
   - Alert matches for saved names

3. **Alerts Overview**
   - Count of active name alerts
   - Recent matches with preview
   - Quick link to manage alerts

4. **Quick Actions**
   - "Share an experience" - navigates to PostCreation
   - "View my alerts" - navigates to Alerts screen
   - "View my posts" - navigates to Posts screen
   - "Get verified" (if not verified) - navigates to Verification

5. **Statistics Card**
   - Posts shared count
   - Comments received count
   - Days as member

### Success Criteria

- [ ] Dashboard is the default screen after successful authentication
- [ ] Activity feed shows relevant, personalized content
- [ ] Quick action buttons navigate to correct screens
- [ ] Pull-to-refresh updates all data
- [ ] Loading states display appropriately
- [ ] Empty states show helpful messaging (brand voice compliant)
- [ ] Verification badge shows for verified users
- [ ] Type-check passes for all packages
- [ ] No console errors during navigation

---

## All Needed Context

### Documentation & References

```yaml
# DEPENDENCIES - Other PRPs
- file: /Users/wookiee/Code/BetweenUs/PRPs/authentication.md
  why: AuthContext, user session, verification status
  critical: MUST be complete - dashboard needs authenticated user

- file: /Users/wookiee/Code/BetweenUs/PRPs/posting-content-mvp.md
  why: Posts table schema, posts service
  critical: MUST be complete - dashboard shows post activity

- file: /Users/wookiee/Code/BetweenUs/PRPs/identity-verification-deep-integration.md
  why: Verification status display, badge component
  critical: MUST be complete - dashboard shows verification status

# MUST READ - Core Project Documentation
- file: /Users/wookiee/Code/BetweenUs/docs/BRAND_VOICE_GUIDE.md
  why: All copy must follow brand voice - "measured not moralizing"
  critical: Empty states, greetings, activity descriptions

- file: /Users/wookiee/Code/BetweenUs/CLAUDE.md
  why: TypeScript conventions, file structure, testing requirements
  critical: Never exceed 500 LOC, use 2-space indent, strict TypeScript

# Existing codebase patterns to follow
- file: packages/frontend/src/screens/HomeScreen.tsx
  why: Current home screen pattern - will be replaced by Dashboard

- file: packages/frontend/src/screens/PostCreationScreen.tsx
  why: Screen component structure with navigation

- file: packages/frontend/src/contexts/AuthContext.tsx
  why: Pattern for accessing user data and verification status

- file: packages/frontend/src/components/verification/VerificationBadge.tsx
  why: Existing badge component to reuse

- file: packages/backend/src/routes/posts.routes.ts
  why: API route patterns for dashboard endpoints

- file: packages/backend/src/controllers/posts.controller.ts
  why: Controller patterns for request handling
```

### Current Codebase Tree

```bash
packages/
├── backend/src/
│   ├── config/
│   │   ├── database.ts           # Database connection
│   │   └── supabase.ts           # Supabase client
│   ├── controllers/
│   │   └── posts.controller.ts   # Posts request handling
│   ├── services/
│   │   ├── posts.service.ts      # Posts business logic
│   │   └── verification.service.ts
│   ├── routes/
│   │   ├── posts.routes.ts       # Posts API
│   │   └── auth.routes.ts        # Auth API
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT validation
│   │   └── validation.middleware.ts
│   └── db/
│       └── schema.ts             # Database schema
├── frontend/src/
│   ├── screens/
│   │   ├── HomeScreen.tsx        # Current home (to be replaced)
│   │   ├── PostCreationScreen.tsx
│   │   ├── auth/                 # Auth screens
│   │   └── verification/         # Verification screens
│   ├── components/
│   │   ├── Text.tsx
│   │   ├── posts/
│   │   └── verification/
│   │       └── VerificationBadge.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx       # Auth + verification state
│   ├── navigation/
│   │   └── AppNavigator.tsx      # Navigation setup
│   └── services/
│       └── posts.service.ts      # Posts API client
└── shared/src/
    ├── schemas/
    │   └── post.schema.ts
    └── types/
        └── auth.types.ts
```

### Desired Codebase Tree with New Files

```bash
# Backend additions
packages/backend/src/
├── services/
│   └── dashboard.service.ts      # NEW: Dashboard data aggregation
├── controllers/
│   └── dashboard.controller.ts   # NEW: Dashboard request handling
├── routes/
│   └── dashboard.routes.ts       # NEW: GET /api/dashboard

# Frontend additions
packages/frontend/src/
├── screens/
│   └── dashboard/
│       ├── index.ts              # NEW: Barrel export
│       └── DashboardScreen.tsx   # NEW: Main dashboard screen
├── components/
│   └── dashboard/
│       ├── index.ts              # NEW: Barrel export
│       ├── WelcomeCard.tsx       # NEW: Welcome + verification status
│       ├── ActivityFeed.tsx      # NEW: Recent activity list
│       ├── AlertsPreview.tsx     # NEW: Alerts overview
│       ├── QuickActions.tsx      # NEW: Action buttons
│       └── StatsCard.tsx         # NEW: User statistics
├── services/
│   └── dashboard.service.ts      # NEW: Dashboard API client
├── hooks/
│   └── useDashboard.ts           # NEW: Dashboard data hook
└── types/
    └── dashboard.types.ts        # NEW: Dashboard-specific types

# Shared additions
packages/shared/src/
├── schemas/
│   └── dashboard.schemas.ts      # NEW: Dashboard API schemas
└── types/
    └── dashboard.types.ts        # NEW: Dashboard types
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL 1: Dashboard must handle empty states gracefully
// New users have no posts, comments, or alerts
// Use brand voice: "Start sharing to see activity here" not "No activity"

// CRITICAL 2: Activity feed pagination
// Don't load all activity at once - use cursor-based pagination
// Initial load: 10 items, load more on scroll

// CRITICAL 3: Verification badge reuse
// Use existing VerificationBadge component from components/verification/
// Don't create a new badge component

// CRITICAL 4: Navigation update required
// Dashboard replaces HomeScreen as initial route in AppStack
// Update AppNavigator to make Dashboard the first screen

// CRITICAL 5: Pull-to-refresh handling
// Use React Native's RefreshControl with FlatList/ScrollView
// Refresh all data sources in parallel

// CRITICAL 6: Brand voice compliance
// Avoid words: alerts, warnings, notifications (too alarming)
// Use instead: updates, activity, what's new

// CRITICAL 7: Statistics calculation
// Stats should be calculated server-side, not client-side
// Include: postsCount, commentsReceivedCount, memberSinceDays

// CRITICAL 8: Real-time updates (future consideration)
// Dashboard will eventually use WebSocket for live updates
// Design data structures to support real-time refresh
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// packages/shared/src/types/dashboard.types.ts

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
  summaryText: string // e.g., "2 updates since your last visit"
}

export interface ActivityItem {
  id: string
  type: 'comment_received' | 'comment_on_followed' | 'alert_match' | 'post_published'
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
```

```typescript
// packages/shared/src/schemas/dashboard.schemas.ts

import { z } from 'zod'

export const dashboardResponseSchema = z.object({
  welcome: z.object({
    displayName: z.string(),
    isVerified: z.boolean(),
    verificationStatus: z.enum(['pending', 'processing', 'approved', 'denied', 'error']),
    summaryText: z.string(),
  }),
  activity: z.array(z.object({
    id: z.string(),
    type: z.enum(['comment_received', 'comment_on_followed', 'alert_match', 'post_published']),
    title: z.string(),
    preview: z.string(),
    createdAt: z.string(),
    relatedPostId: z.number().optional(),
    relatedUserId: z.string().optional(),
  })),
  alerts: z.object({
    totalCount: z.number(),
    recentMatches: z.array(z.object({
      id: z.string(),
      name: z.string(),
      matchedPostId: z.number(),
      matchedAt: z.string(),
    })),
  }),
  stats: z.object({
    postsCount: z.number(),
    commentsReceivedCount: z.number(),
    memberSinceDays: z.number(),
  }),
  hasMore: z.boolean(),
  cursor: z.string().optional(),
})

export type DashboardResponse = z.infer<typeof dashboardResponseSchema>
```

### List of Tasks to Complete

```yaml
Task 1: Create shared types and schemas
  CREATE packages/shared/src/types/dashboard.types.ts:
    - DashboardData, WelcomeData, ActivityItem, AlertsPreview, AlertMatch, UserStats
  CREATE packages/shared/src/schemas/dashboard.schemas.ts:
    - dashboardResponseSchema with Zod validation
  MODIFY packages/shared/src/schemas/index.ts:
    - Export dashboard schemas
  MODIFY packages/shared/src/types/index.ts:
    - Export dashboard types

Task 2: Create backend dashboard service
  CREATE packages/backend/src/services/dashboard.service.ts:
    - getDashboardData(userId: string): Promise<DashboardData>
    - getWelcomeData(userId: string): Promise<WelcomeData>
    - getActivityFeed(userId: string, cursor?: string): Promise<ActivityItem[]>
    - getAlertsPreview(userId: string): Promise<AlertsPreview>
    - getUserStats(userId: string): Promise<UserStats>

Task 3: Create backend dashboard controller
  CREATE packages/backend/src/controllers/dashboard.controller.ts:
    - handleGetDashboard(req, res, next)
    - handleGetActivity(req, res, next) with pagination

Task 4: Create backend dashboard routes
  CREATE packages/backend/src/routes/dashboard.routes.ts:
    - GET / → handleGetDashboard (requires auth)
    - GET /activity → handleGetActivity (requires auth, with cursor param)
  MODIFY packages/backend/src/index.ts:
    - Import and mount at /api/dashboard

Task 5: Create frontend dashboard service
  CREATE packages/frontend/src/services/dashboard.service.ts:
    - getDashboard(): Promise<DashboardResponse>
    - getMoreActivity(cursor: string): Promise<ActivityItem[]>

Task 6: Create frontend dashboard hook
  CREATE packages/frontend/src/hooks/useDashboard.ts:
    - useDashboard() hook with:
      - data: DashboardData | null
      - isLoading: boolean
      - error: Error | null
      - refresh(): Promise<void>
      - loadMoreActivity(): Promise<void>

Task 7: Create WelcomeCard component
  CREATE packages/frontend/src/components/dashboard/WelcomeCard.tsx:
    - Props: welcome (WelcomeData)
    - Display personalized greeting
    - Show VerificationBadge if verified
    - Show summary text

Task 8: Create ActivityFeed component
  CREATE packages/frontend/src/components/dashboard/ActivityFeed.tsx:
    - Props: items (ActivityItem[]), onLoadMore, hasMore, isLoading
    - FlatList with activity items
    - Different icons/styles per activity type
    - Empty state with brand voice copy
    - Pull-to-refresh support

Task 9: Create AlertsPreview component
  CREATE packages/frontend/src/components/dashboard/AlertsPreview.tsx:
    - Props: alerts (AlertsPreview), onViewAll
    - Show alert count
    - Preview recent matches
    - "View all" button

Task 10: Create QuickActions component
  CREATE packages/frontend/src/components/dashboard/QuickActions.tsx:
    - Props: navigation, isVerified
    - "Share an experience" button
    - "View my posts" button
    - "Get verified" button (if not verified)

Task 11: Create StatsCard component
  CREATE packages/frontend/src/components/dashboard/StatsCard.tsx:
    - Props: stats (UserStats)
    - Display posts count, comments count, member days
    - Clean, minimal design

Task 12: Create dashboard components barrel export
  CREATE packages/frontend/src/components/dashboard/index.ts:
    - Export all dashboard components

Task 13: Create DashboardScreen
  CREATE packages/frontend/src/screens/dashboard/DashboardScreen.tsx:
    - Use useDashboard hook
    - ScrollView with RefreshControl
    - Compose: WelcomeCard, ActivityFeed, AlertsPreview, QuickActions, StatsCard
    - Loading skeleton while fetching
    - Error state with retry

Task 14: Create dashboard screens barrel export
  CREATE packages/frontend/src/screens/dashboard/index.ts:
    - Export DashboardScreen

Task 15: Update navigation
  MODIFY packages/frontend/src/navigation/AppNavigator.tsx:
    - Add Dashboard to AppStackParamList
    - Import DashboardScreen
    - Replace HomeScreen with DashboardScreen as initial route
    - Keep Home as alias for backwards compatibility

Task 16: Type-check and manual test
  RUN: yarn workspace @betweenus/shared build
  RUN: yarn type-check
  FIX: Any type errors
  TEST: Manual flow in Expo Go
```

### Per-Task Pseudocode

```typescript
// Task 2: Dashboard service
// packages/backend/src/services/dashboard.service.ts

import { eq, desc, count, sql } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { posts, profiles, userVerificationStatus } from '../db/schema.js'
import { logger } from '../utils/logger.js'
import type { DashboardData, WelcomeData, ActivityItem, AlertsPreview, UserStats } from '@betweenus/shared'

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
  const verificationStatus = verification?.status || 'pending'

  // Calculate summary text based on recent activity
  // TODO: Implement activity counting once comments table exists
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
  cursor?: string,
  limit: number = 10
): Promise<ActivityItem[]> {
  const db = getDatabase()

  // For MVP, show user's own posts as activity
  // TODO: Expand to include comments when comments table exists
  const userPosts = await db
    .select({
      id: posts.id,
      status: posts.status,
      createdAt: posts.createdAt,
      originalText: posts.originalText,
    })
    .from(posts)
    .where(eq(posts.userId, userId))
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

export async function getAlertsPreview(userId: string): Promise<AlertsPreview> {
  // TODO: Implement when alerts table exists
  // For now, return empty
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
    .where(eq(posts.userId, userId))

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
    commentsReceivedCount: 0, // TODO: Implement when comments table exists
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
```

```typescript
// Task 6: Dashboard hook
// packages/frontend/src/hooks/useDashboard.ts

import { useState, useEffect, useCallback } from 'react'
import { dashboardService } from '../services/dashboard.service'
import type { DashboardData, ActivityItem } from '@betweenus/shared'

interface UseDashboardResult {
  data: DashboardData | null
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
  loadMoreActivity: () => Promise<void>
  isLoadingMore: boolean
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await dashboardService.getDashboard()
      setData(response)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load dashboard'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchDashboard()
  }, [fetchDashboard])

  const loadMoreActivity = useCallback(async () => {
    if (!data?.hasMore || !data?.cursor || isLoadingMore) return

    try {
      setIsLoadingMore(true)
      const moreActivity = await dashboardService.getMoreActivity(data.cursor)
      setData((prev) => prev ? {
        ...prev,
        activity: [...prev.activity, ...moreActivity],
        hasMore: moreActivity.length >= 10,
        cursor: moreActivity.length > 0 ? moreActivity[moreActivity.length - 1].id : prev.cursor,
      } : prev)
    } catch (err) {
      // Silently fail for load more - don't replace main error
      console.error('Failed to load more activity:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [data, isLoadingMore])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    data,
    isLoading,
    error,
    refresh,
    loadMoreActivity,
    isLoadingMore,
  }
}
```

```typescript
// Task 13: DashboardScreen
// packages/frontend/src/screens/dashboard/DashboardScreen.tsx

import React, { useCallback } from 'react'
import { View, ScrollView, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Text } from '../../components/Text'
import {
  WelcomeCard,
  ActivityFeed,
  AlertsPreview,
  QuickActions,
  StatsCard,
} from '../../components/dashboard'
import { useDashboard } from '../../hooks/useDashboard'
import { colors } from '../../theme/colors'
import type { AppStackParamList } from '../../navigation/AppNavigator'

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>

export function DashboardScreen({ navigation }: Props) {
  const {
    data,
    isLoading,
    error,
    refresh,
    loadMoreActivity,
    isLoadingMore,
  } = useDashboard()

  const handleViewAlerts = useCallback(() => {
    navigation.navigate('Alerts')
  }, [navigation])

  const handlePostPress = useCallback((postId: number) => {
    navigation.navigate('PostDetail', { postId })
  }, [navigation])

  if (isLoading && !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="body" color="textSecondary" style={styles.loadingText}>
          Loading your dashboard...
        </Text>
      </View>
    )
  }

  if (error && !data) {
    return (
      <View style={styles.centered}>
        <Text variant="h3" color="text">Something went wrong</Text>
        <Text variant="body" color="textSecondary" style={styles.errorText}>
          We couldn't load your dashboard. Pull down to try again.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refresh}
          tintColor={colors.primary}
        />
      }
    >
      {data && (
        <>
          <WelcomeCard welcome={data.welcome} />

          <QuickActions
            navigation={navigation}
            isVerified={data.welcome.isVerified}
          />

          <StatsCard stats={data.stats} />

          <AlertsPreview
            alerts={data.alerts}
            onViewAll={handleViewAlerts}
          />

          <ActivityFeed
            items={data.activity}
            hasMore={data.hasMore}
            isLoading={isLoadingMore}
            onLoadMore={loadMoreActivity}
            onPostPress={handlePostPress}
          />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
})
```

### Integration Points

```yaml
DATABASE:
  - No new tables required for MVP
  - Uses existing: posts, profiles, userVerificationStatus
  - Future: comments table (for comments count)
  - Future: alerts table (for name match alerts)

CONFIG:
  - ADD to packages/backend/src/index.ts:
    import dashboardRoutes from './routes/dashboard.routes.js'
    app.use('/api/dashboard', dashboardRoutes)

NAVIGATION:
  - MODIFY AppStackParamList:
    Dashboard: undefined
    Alerts: undefined (placeholder)
    PostDetail: { postId: number } (placeholder)
  - Set Dashboard as initialRouteName

ENVIRONMENT:
  - No new environment variables required
```

---

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run from project root
yarn type-check

# Expected: No type errors
# If errors: Read error message, fix type issues, re-run
```

### Level 2: Build Check

```bash
# Build shared package first
yarn workspace @betweenus/shared build

# Then type-check all packages
yarn type-check

# Expected: All packages pass
```

### Level 3: Backend Test

```bash
# Start backend
yarn workspace @betweenus/backend dev

# Test dashboard endpoint (replace TOKEN with valid JWT)
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer TOKEN"

# Expected: { "success": true, "data": { "welcome": {...}, "activity": [...], ... } }

# Test activity pagination
curl "http://localhost:3000/api/dashboard/activity?cursor=post-1" \
  -H "Authorization: Bearer TOKEN"

# Expected: { "success": true, "data": [...] }
```

### Level 4: Frontend Manual Test

```bash
# Start frontend
yarn workspace @betweenus/frontend dev

# Test flow in Expo Go:
# 1. Login to app
# 2. Verify Dashboard is first screen after auth
# 3. Check welcome card shows correct name
# 4. Verify verification badge shows (if verified)
# 5. Pull down to refresh
# 6. Tap "Share an experience" - should navigate to PostCreation
# 7. Check activity feed shows posts (if any)
# 8. Verify empty states show proper messaging
```

---

## Final Validation Checklist

- [ ] All type checks pass: `yarn type-check`
- [ ] Backend starts without errors: `yarn workspace @betweenus/backend dev`
- [ ] Frontend starts without errors: `yarn workspace @betweenus/frontend dev`
- [ ] GET /api/dashboard returns complete data
- [ ] Dashboard is first screen after login
- [ ] WelcomeCard shows personalized greeting
- [ ] VerificationBadge shows for verified users
- [ ] QuickActions navigate correctly
- [ ] ActivityFeed shows user's posts
- [ ] Pull-to-refresh works
- [ ] Empty states use brand voice copy
- [ ] No console errors during navigation

---

## Anti-Patterns to Avoid

- Don't use alarming language: "alerts", "warnings", "notifications"
- Don't show raw timestamps - use relative time ("2 hours ago")
- Don't fetch all activity at once - use pagination
- Don't block UI while loading - show skeleton/spinner
- Don't create new badge component - reuse VerificationBadge
- Don't hardcode strings - use brand voice utility
- Don't mix concerns in service - keep dashboard service focused

---

## Brand Voice Copy Examples

```typescript
// Welcome messages
"Welcome back, {name}"
"Good to see you, {name}"

// Empty activity
"Nothing new yet. Share an experience to get started."
"Your activity will appear here."

// Empty alerts
"No name alerts set up. You can create alerts to be notified of matching experiences."

// Statistics labels
"Experiences shared"  // Not "Posts"
"Days as member"      // Not "Account age"

// Quick action buttons
"Share an experience" // Not "Create post"
"View activity"       // Not "View notifications"
```

---

## Quality Score

### Confidence Level: **8/10**

**Reasons for 8/10:**

**Strong foundations:**
- Clear patterns from existing PRPs to follow
- Simple data aggregation from existing tables
- Reuses existing components (VerificationBadge)
- No external API integrations required

**Achievable scope:**
- MVP focused on posts activity (comments/alerts are stubs)
- Well-defined 16 tasks in logical order
- All dependencies already implemented

**Self-validating:**
- Type-check catches most issues
- Manual testing with clear steps
- Existing patterns reduce unknowns

**Moderate challenges:**
- Empty states need careful brand voice compliance
- Activity pagination needs proper cursor handling
- Navigation refactor (HomeScreen -> Dashboard)

**Mitigation strategies:**
- Stub alerts/comments functionality for future PRPs
- Use existing HomeScreen as reference for screen structure
- Pull brand voice copy from BRAND_VOICE_GUIDE.md

**Expected outcome:** Working Dashboard screen that serves as the authenticated landing page, with personalized content, quick actions, and proper brand voice compliance.

---

## Next Steps After Completion

Once this PRP is successfully implemented, the Dashboard will need:

1. **Comments Integration** - When comments table is added, update activity feed
2. **Alerts Integration** - When Search PRP is implemented, show real alert matches
3. **Real-time Updates** - WebSocket integration for live activity
4. **Analytics** - Track dashboard engagement metrics

Each enhancement should be a separate task or incorporated into related PRPs.
