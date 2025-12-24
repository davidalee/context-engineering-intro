# Search PRP - BetweenUs

**Version:** 1.0
**Created:** 2025-12-24
**Status:** Ready for Implementation
**Confidence Score:** 7/10

---

## Goal

Build the Search system allowing users to find posts by name, image, keyword, and location. Includes saved alerts that notify users when new posts match their search criteria. Uses PostgreSQL full-text search for name/keyword search and TinEye API for reverse image search.

**End State:**
- Users can search for posts by name (full-text search)
- Users can perform reverse image search using TinEye API
- Users can search by keywords within post content
- Users can filter by location (city/state)
- Users can save name alerts to receive notifications on matches
- Search results respect brand voice (no sensational language)

---

## Why

- **Core Safety Feature**: Primary way users discover if someone has been mentioned before
- **Pattern Awareness**: Helps users see if multiple people had similar experiences (without "multiple accusations" language)
- **Proactive Protection**: Saved alerts notify users of future mentions
- **Trust Building**: Image search verifies profile authenticity
- **Legal Defensibility**: Search shows "overlapping experiences" not "reports" or "accusations"

---

## What

### User-Visible Behavior

1. **Search Screen**
   - Search bar with type selector (Name, Image, Keyword)
   - Location filter (optional)
   - Recent searches history
   - Saved alerts management

2. **Name Search**
   - Full-text search using PostgreSQL tsvector
   - Weighted results (name in title weighted higher)
   - Fuzzy matching for misspellings
   - Results show post previews (anonymized)

3. **Image Search**
   - Upload image or use camera
   - TinEye API for reverse image lookup
   - Shows matching posts with similar images
   - Displays match confidence score

4. **Keyword Search**
   - Search within post content
   - Highlights matched terms
   - Ranked by relevance

5. **Location Filter**
   - Filter by city, state, or region
   - Works with all search types
   - Approximate location (not precise)

6. **Saved Alerts**
   - Save a name to monitor for future posts
   - Push notification when new match found
   - Manage active alerts (view, delete)
   - Limit: 5 active alerts per user (free tier)

### Success Criteria

- [ ] Name search returns relevant results using PostgreSQL FTS
- [ ] Image search integrates with TinEye API
- [ ] Keyword search works within post content
- [ ] Location filter narrows results appropriately
- [ ] Users can create and manage saved alerts
- [ ] Push notifications work for alert matches (Expo Push)
- [ ] Search results use brand voice (no alarming language)
- [ ] Type-check passes for all packages
- [ ] All search endpoints have proper rate limiting

---

## All Needed Context

### Documentation & References

```yaml
# DEPENDENCIES - Other PRPs
- file: /Users/wookiee/Code/BetweenUs/PRPs/posting-content-mvp.md
  why: Posts table schema, text fields to search
  critical: MUST be complete - search indexes on posts table

- file: /Users/wookiee/Code/BetweenUs/PRPs/authentication.md
  why: Auth middleware, user context for saved alerts
  critical: MUST be complete - alerts linked to users

# MUST READ - Core Project Documentation
- file: /Users/wookiee/Code/BetweenUs/docs/BRAND_VOICE_GUIDE.md
  why: Search result copy must follow brand voice
  critical: "overlapping experiences" not "multiple reports"

- file: /Users/wookiee/Code/BetweenUs/CLAUDE.md
  why: TypeScript conventions, file structure rules
  critical: Never exceed 500 LOC, strict TypeScript

# External Documentation - PostgreSQL Full-Text Search
- url: https://orm.drizzle.team/docs/guides/postgresql-full-text-search
  why: Drizzle ORM full-text search with GIN index
  critical: Custom tsvector type, setweight, ts_rank

- url: https://orm.drizzle.team/docs/guides/full-text-search-with-generated-columns
  why: Generated columns for automatic tsvector updates
  critical: generatedAlwaysAs pattern for search columns

- url: https://www.postgresql.org/docs/current/datatype-textsearch.html
  why: PostgreSQL tsvector/tsquery reference
  critical: Query operators (@@, ||, &)

# External Documentation - TinEye API
- url: https://services.tineye.com/developers/tineyeapi/
  why: TinEye reverse image search API
  critical: Authentication, search endpoint, rate limits

- url: https://services.tineye.com/developers/tineyeapi/getting_started.html
  why: Getting started with TinEye API
  critical: API key, sandbox environment, request format

# External Documentation - Expo Push Notifications
- url: https://docs.expo.dev/push-notifications/overview/
  why: Push notification setup for alerts
  critical: Expo Push tokens, scheduling, deep linking

# Existing codebase patterns
- file: packages/backend/src/db/schema.ts
  why: Current posts table - needs search column added

- file: packages/backend/src/services/posts.service.ts
  why: Service patterns for database queries

- file: packages/frontend/src/services/posts.service.ts
  why: API client patterns
```

### Current Codebase Tree

```bash
packages/
├── backend/src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── supabase.ts
│   │   └── openai.ts
│   ├── db/
│   │   └── schema.ts             # Posts table - needs search column
│   ├── services/
│   │   ├── posts.service.ts
│   │   └── content-filter.service.ts
│   ├── routes/
│   │   └── posts.routes.ts
│   └── middleware/
│       └── auth.middleware.ts
├── frontend/src/
│   ├── screens/
│   │   ├── dashboard/
│   │   └── PostCreationScreen.tsx
│   ├── components/
│   ├── services/
│   │   └── posts.service.ts
│   └── hooks/
└── shared/src/
    ├── schemas/
    └── types/
```

### Desired Codebase Tree with New Files

```bash
# Backend additions
packages/backend/src/
├── config/
│   └── tineye.ts                 # NEW: TinEye API configuration
├── db/
│   └── schema.ts                 # MODIFY: Add search column, alerts table
├── services/
│   ├── search.service.ts         # NEW: Full-text search logic
│   ├── image-search.service.ts   # NEW: TinEye API integration
│   └── alerts.service.ts         # NEW: Saved alerts management
├── controllers/
│   ├── search.controller.ts      # NEW: Search request handling
│   └── alerts.controller.ts      # NEW: Alerts request handling
├── routes/
│   ├── search.routes.ts          # NEW: Search API endpoints
│   └── alerts.routes.ts          # NEW: Alerts API endpoints
└── utils/
    └── tsvector.ts               # NEW: Custom tsvector type for Drizzle

# Frontend additions
packages/frontend/src/
├── screens/
│   └── search/
│       ├── index.ts              # NEW: Barrel export
│       ├── SearchScreen.tsx      # NEW: Main search interface
│       ├── SearchResultsScreen.tsx # NEW: Results display
│       └── AlertsManageScreen.tsx # NEW: Manage saved alerts
├── components/
│   └── search/
│       ├── index.ts              # NEW: Barrel export
│       ├── SearchBar.tsx         # NEW: Search input with type selector
│       ├── SearchTypeSelector.tsx # NEW: Name/Image/Keyword toggle
│       ├── ImageUploader.tsx     # NEW: Image picker for reverse search
│       ├── LocationFilter.tsx    # NEW: Location selection
│       ├── SearchResultCard.tsx  # NEW: Individual result display
│       └── SaveAlertButton.tsx   # NEW: Save name as alert
├── services/
│   ├── search.service.ts         # NEW: Search API client
│   └── alerts.service.ts         # NEW: Alerts API client
└── hooks/
    ├── useSearch.ts              # NEW: Search state management
    └── useAlerts.ts              # NEW: Alerts state management

# Shared additions
packages/shared/src/
├── schemas/
│   ├── search.schemas.ts         # NEW: Search API schemas
│   └── alert.schemas.ts          # NEW: Alert schemas
└── types/
    ├── search.types.ts           # NEW: Search types
    └── alert.types.ts            # NEW: Alert types
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL 1: Drizzle ORM doesn't natively support tsvector
// Must define custom type:
export const tsvector = customType<{ data: string }>({
  dataType() { return 'tsvector' }
})

// CRITICAL 2: Generated columns for automatic search indexing
// Use generatedAlwaysAs() to auto-update search column on insert/update
search: tsvector('search')
  .notNull()
  .generatedAlwaysAs((): SQL =>
    sql`setweight(to_tsvector('english', ${posts.subjectName}), 'A') ||
        setweight(to_tsvector('english', ${posts.originalText}), 'B')`
  )

// CRITICAL 3: GIN index for performance
// Without GIN index, full-text search is O(n) scan
index('idx_posts_search').using('gin', t.search)

// CRITICAL 4: TinEye API authentication
// Uses single API key (not OAuth)
// Sandbox available for testing - use before production
// Rate limits: Depends on plan (5 searches/minute on starter)

// CRITICAL 5: TinEye image submission
// Can submit via URL or base64 encoded image
// Max image size: 20MB
// Supported formats: JPEG, PNG, GIF, BMP, TIFF

// CRITICAL 6: Search result language
// NEVER say "reports" or "accusations"
// USE "experiences" or "overlapping experiences"
// Show count as "3 people have shared experiences" not "3 reports"

// CRITICAL 7: Push notification tokens
// Expo Push tokens are device-specific
// Must store token when user logs in
// Token can change - update on each app launch

// CRITICAL 8: Alert matching job
// New posts should check against all alerts
// Run async (not blocking post creation)
// Consider background job/queue for scale

// CRITICAL 9: Location data
// Posts need location field (city, state, country)
// User enters during post creation
// NOT geolocation - user-provided text

// CRITICAL 10: Database migration required
// Adding new columns and tables requires migration
// Run drizzle-kit generate and migrate before testing
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// packages/backend/src/utils/tsvector.ts
import { customType } from 'drizzle-orm/pg-core'

export const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector'
  },
})
```

```typescript
// packages/backend/src/db/schema.ts - ADDITIONS

import { tsvector } from '../utils/tsvector.js'

// Update posts table with search fields
export const posts = pgTable('posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(),
  subjectName: text('subject_name'), // NEW: Name being discussed
  originalText: text('original_text').notNull(),
  rewrittenText: text('rewritten_text'),
  location: text('location'), // NEW: City, State format
  status: postStatusEnum('status').notNull().default('draft'),
  moderationFlags: jsonb('moderation_flags').$type<ModerationFlags>(),
  triggerMatches: jsonb('trigger_matches').$type<TriggerMatch[]>(),
  // NEW: Generated search column for full-text search
  search: tsvector('search').generatedAlwaysAs((): SQL =>
    sql`setweight(to_tsvector('english', coalesce(${posts.subjectName}, '')), 'A') ||
        setweight(to_tsvector('english', ${posts.originalText}), 'B')`
  ),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (t) => [
  index('idx_posts_search').using('gin', t.search),
  index('idx_posts_location').on(t.location),
  index('idx_posts_subject_name').on(t.subjectName),
])

// NEW: Name alerts table
export const nameAlerts = pgTable('name_alerts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(),
  searchName: text('search_name').notNull(), // The name to monitor
  normalizedName: text('normalized_name').notNull(), // Lowercased, trimmed
  location: text('location'), // Optional location filter
  isActive: boolean('is_active').default(true).notNull(),
  lastMatchedAt: timestamp('last_matched_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  index('idx_alerts_user').on(t.userId),
  index('idx_alerts_normalized_name').on(t.normalizedName),
])

// NEW: Push tokens table
export const pushTokens = pgTable('push_tokens', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(),
  token: text('token').notNull().unique(),
  platform: text('platform').notNull(), // 'ios' | 'android'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('idx_push_tokens_user').on(t.userId),
])

export type NameAlert = typeof nameAlerts.$inferSelect
export type NewNameAlert = typeof nameAlerts.$inferInsert
export type PushToken = typeof pushTokens.$inferSelect
export type NewPushToken = typeof pushTokens.$inferInsert
```

```typescript
// packages/shared/src/types/search.types.ts

export type SearchType = 'name' | 'image' | 'keyword'

export interface SearchRequest {
  type: SearchType
  query: string // Name or keyword
  imageData?: string // Base64 for image search
  location?: string // Optional location filter
  cursor?: string // Pagination
  limit?: number
}

export interface SearchResult {
  postId: number
  preview: string // First 200 chars of post
  subjectName?: string
  location?: string
  matchScore: number // Relevance score
  createdAt: string
  overlapCount: number // How many others shared about same name
}

export interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  hasMore: boolean
  cursor?: string
}

export interface ImageSearchResult extends SearchResult {
  matchConfidence: number // TinEye confidence score (0-100)
  imageUrl?: string
}
```

```typescript
// packages/shared/src/schemas/search.schemas.ts

import { z } from 'zod'

export const nameSearchSchema = z.object({
  query: z.string().min(2, 'Name must be at least 2 characters').max(100),
  location: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
})

export const keywordSearchSchema = z.object({
  query: z.string().min(3, 'Keyword must be at least 3 characters').max(200),
  location: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
})

export const imageSearchSchema = z.object({
  imageData: z.string().min(1, 'Image data required'), // Base64
  location: z.string().optional(),
  limit: z.number().min(1).max(20).default(10),
})

export type NameSearchInput = z.infer<typeof nameSearchSchema>
export type KeywordSearchInput = z.infer<typeof keywordSearchSchema>
export type ImageSearchInput = z.infer<typeof imageSearchSchema>
```

```typescript
// packages/shared/src/schemas/alert.schemas.ts

import { z } from 'zod'

export const createAlertSchema = z.object({
  name: z.string().min(2).max(100),
  location: z.string().optional(),
})

export const alertResponseSchema = z.object({
  id: z.number(),
  searchName: z.string(),
  location: z.string().nullable(),
  isActive: z.boolean(),
  lastMatchedAt: z.string().nullable(),
  createdAt: z.string(),
})

export type CreateAlertInput = z.infer<typeof createAlertSchema>
export type AlertResponse = z.infer<typeof alertResponseSchema>
```

### List of Tasks to Complete

```yaml
Task 1: Create custom tsvector type
  CREATE packages/backend/src/utils/tsvector.ts:
    - Custom Drizzle type for PostgreSQL tsvector

Task 2: Update database schema
  MODIFY packages/backend/src/db/schema.ts:
    - Add subjectName column to posts
    - Add location column to posts
    - Add generated search column with tsvector
    - Add GIN index on search column
    - CREATE nameAlerts table
    - CREATE pushTokens table
  RUN: yarn workspace @betweenus/backend db:generate
  RUN: yarn workspace @betweenus/backend db:migrate

Task 3: Create shared types and schemas
  CREATE packages/shared/src/types/search.types.ts
  CREATE packages/shared/src/types/alert.types.ts
  CREATE packages/shared/src/schemas/search.schemas.ts
  CREATE packages/shared/src/schemas/alert.schemas.ts
  MODIFY packages/shared/src/index.ts:
    - Export new schemas and types

Task 4: Create TinEye configuration
  CREATE packages/backend/src/config/tineye.ts:
    - TINEYE_API_KEY from env
    - API base URL
    - Sandbox mode toggle
    - Request helper function

Task 5: Create search service
  CREATE packages/backend/src/services/search.service.ts:
    - searchByName(query, location?, limit, cursor)
    - searchByKeyword(query, location?, limit, cursor)
    - Uses PostgreSQL full-text search with ts_rank
    - Calculates overlap count per subject name

Task 6: Create image search service
  CREATE packages/backend/src/services/image-search.service.ts:
    - searchByImage(imageData, location?)
    - Calls TinEye API
    - Maps TinEye results to SearchResult format
    - Handles rate limits and errors

Task 7: Create alerts service
  CREATE packages/backend/src/services/alerts.service.ts:
    - createAlert(userId, name, location?)
    - getAlerts(userId)
    - deleteAlert(alertId, userId)
    - checkAlertsForPost(postId) - called when new post created
    - Enforces 5 alerts limit per user

Task 8: Create push notification service
  CREATE packages/backend/src/services/push.service.ts:
    - registerToken(userId, token, platform)
    - sendPushNotification(userId, title, body, data)
    - Uses Expo Push API

Task 9: Create search controller
  CREATE packages/backend/src/controllers/search.controller.ts:
    - handleNameSearch(req, res, next)
    - handleKeywordSearch(req, res, next)
    - handleImageSearch(req, res, next)

Task 10: Create alerts controller
  CREATE packages/backend/src/controllers/alerts.controller.ts:
    - handleCreateAlert(req, res, next)
    - handleGetAlerts(req, res, next)
    - handleDeleteAlert(req, res, next)

Task 11: Create search routes
  CREATE packages/backend/src/routes/search.routes.ts:
    - GET /name → handleNameSearch (requires auth)
    - GET /keyword → handleKeywordSearch (requires auth)
    - POST /image → handleImageSearch (requires auth)
  MODIFY packages/backend/src/index.ts:
    - Mount at /api/search

Task 12: Create alerts routes
  CREATE packages/backend/src/routes/alerts.routes.ts:
    - GET / → handleGetAlerts (requires auth)
    - POST / → handleCreateAlert (requires auth)
    - DELETE /:id → handleDeleteAlert (requires auth)
  MODIFY packages/backend/src/index.ts:
    - Mount at /api/alerts

Task 13: Update post creation to trigger alert check
  MODIFY packages/backend/src/services/posts.service.ts:
    - After creating post, call alerts.service.checkAlertsForPost()
    - Run async (don't block response)

Task 14: Create frontend search service
  CREATE packages/frontend/src/services/search.service.ts:
    - searchByName(query, location?, cursor?)
    - searchByKeyword(query, location?, cursor?)
    - searchByImage(imageData, location?)

Task 15: Create frontend alerts service
  CREATE packages/frontend/src/services/alerts.service.ts:
    - createAlert(name, location?)
    - getAlerts()
    - deleteAlert(id)

Task 16: Create useSearch hook
  CREATE packages/frontend/src/hooks/useSearch.ts:
    - Manages search state, results, loading
    - Handles pagination
    - Debounces input

Task 17: Create useAlerts hook
  CREATE packages/frontend/src/hooks/useAlerts.ts:
    - Manages alerts list
    - Create, delete operations

Task 18: Create SearchBar component
  CREATE packages/frontend/src/components/search/SearchBar.tsx:
    - Text input with clear button
    - Search type selector (tabs or dropdown)
    - Debounced onChange

Task 19: Create SearchTypeSelector component
  CREATE packages/frontend/src/components/search/SearchTypeSelector.tsx:
    - Toggle between Name, Keyword, Image
    - Icon + label for each type

Task 20: Create ImageUploader component
  CREATE packages/frontend/src/components/search/ImageUploader.tsx:
    - Pick from gallery or camera
    - Preview selected image
    - Convert to base64

Task 21: Create LocationFilter component
  CREATE packages/frontend/src/components/search/LocationFilter.tsx:
    - Text input for location
    - Optional - can be cleared

Task 22: Create SearchResultCard component
  CREATE packages/frontend/src/components/search/SearchResultCard.tsx:
    - Shows post preview
    - Shows overlap count ("3 people shared similar experiences")
    - Shows location if available
    - Navigation to full post

Task 23: Create SaveAlertButton component
  CREATE packages/frontend/src/components/search/SaveAlertButton.tsx:
    - Button to save current name as alert
    - Shows feedback on success
    - Disabled if at limit

Task 24: Create search components barrel export
  CREATE packages/frontend/src/components/search/index.ts

Task 25: Create SearchScreen
  CREATE packages/frontend/src/screens/search/SearchScreen.tsx:
    - SearchBar with type selector
    - LocationFilter
    - Recent searches (local storage)
    - Quick access to saved alerts

Task 26: Create SearchResultsScreen
  CREATE packages/frontend/src/screens/search/SearchResultsScreen.tsx:
    - FlatList of SearchResultCards
    - Loading states
    - Empty state with brand voice
    - Pagination (infinite scroll)
    - Save alert button for name searches

Task 27: Create AlertsManageScreen
  CREATE packages/frontend/src/screens/search/AlertsManageScreen.tsx:
    - List of saved alerts
    - Delete button per alert
    - Empty state
    - Alerts limit indicator

Task 28: Create search screens barrel export
  CREATE packages/frontend/src/screens/search/index.ts

Task 29: Update navigation
  MODIFY packages/frontend/src/navigation/AppNavigator.tsx:
    - Add Search to tab navigator or AppStack
    - Add SearchResults screen
    - Add AlertsManage screen

Task 30: Update post creation for subject name
  MODIFY packages/frontend/src/screens/PostCreationScreen.tsx:
    - Add subject name input field
    - Add location input field
  MODIFY packages/frontend/src/components/posts/PostForm.tsx:
    - Include subjectName and location in form

Task 31: Register push tokens on login
  MODIFY packages/frontend/src/contexts/AuthContext.tsx:
    - On successful auth, get Expo push token
    - Send to backend to register

Task 32: Type-check and manual test
  RUN: yarn workspace @betweenus/shared build
  RUN: yarn type-check
  FIX: Any type errors
  TEST: Manual flow in Expo Go
```

### Per-Task Pseudocode

```typescript
// Task 5: Search service
// packages/backend/src/services/search.service.ts

import { eq, desc, sql, and, ilike, count } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { posts } from '../db/schema.js'
import { logger } from '../utils/logger.js'
import type { SearchResult, SearchResponse } from '@betweenus/shared'

export async function searchByName(
  query: string,
  location?: string,
  limit: number = 20,
  cursor?: string
): Promise<SearchResponse> {
  const db = getDatabase()

  // Normalize query for tsquery
  const tsQuery = query
    .trim()
    .split(/\s+/)
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 0)
    .join(' & ')

  const conditions = [
    sql`${posts.search} @@ to_tsquery('english', ${tsQuery})`,
    eq(posts.status, 'published'),
  ]

  if (location) {
    conditions.push(ilike(posts.location, `%${location}%`))
  }

  if (cursor) {
    conditions.push(sql`${posts.id} < ${parseInt(cursor, 10)}`)
  }

  const results = await db
    .select({
      id: posts.id,
      subjectName: posts.subjectName,
      originalText: posts.originalText,
      location: posts.location,
      createdAt: posts.createdAt,
      rank: sql<number>`ts_rank(${posts.search}, to_tsquery('english', ${tsQuery}))`,
    })
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(sql`ts_rank(${posts.search}, to_tsquery('english', ${tsQuery}))`))
    .limit(limit + 1) // +1 to check if more exist

  const hasMore = results.length > limit
  const items = hasMore ? results.slice(0, -1) : results

  // Calculate overlap counts for each unique subject name
  const searchResults: SearchResult[] = await Promise.all(
    items.map(async (item) => {
      let overlapCount = 1
      if (item.subjectName) {
        const [countResult] = await db
          .select({ count: count() })
          .from(posts)
          .where(and(
            ilike(posts.subjectName, item.subjectName),
            eq(posts.status, 'published')
          ))
        overlapCount = countResult?.count || 1
      }

      return {
        postId: item.id,
        preview: item.originalText.slice(0, 200) + (item.originalText.length > 200 ? '...' : ''),
        subjectName: item.subjectName || undefined,
        location: item.location || undefined,
        matchScore: item.rank,
        createdAt: item.createdAt.toISOString(),
        overlapCount,
      }
    })
  )

  return {
    results: searchResults,
    totalCount: searchResults.length,
    hasMore,
    cursor: hasMore && items.length > 0 ? String(items[items.length - 1].id) : undefined,
  }
}

export async function searchByKeyword(
  query: string,
  location?: string,
  limit: number = 20,
  cursor?: string
): Promise<SearchResponse> {
  // Similar to searchByName but searches originalText content
  const db = getDatabase()

  const tsQuery = query
    .trim()
    .split(/\s+/)
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 0)
    .join(' | ') // OR for keywords

  const conditions = [
    sql`${posts.search} @@ to_tsquery('english', ${tsQuery})`,
    eq(posts.status, 'published'),
  ]

  if (location) {
    conditions.push(ilike(posts.location, `%${location}%`))
  }

  if (cursor) {
    conditions.push(sql`${posts.id} < ${parseInt(cursor, 10)}`)
  }

  const results = await db
    .select({
      id: posts.id,
      subjectName: posts.subjectName,
      originalText: posts.originalText,
      location: posts.location,
      createdAt: posts.createdAt,
      rank: sql<number>`ts_rank(${posts.search}, to_tsquery('english', ${tsQuery}))`,
    })
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(sql`ts_rank(${posts.search}, to_tsquery('english', ${tsQuery}))`))
    .limit(limit + 1)

  const hasMore = results.length > limit
  const items = hasMore ? results.slice(0, -1) : results

  return {
    results: items.map(item => ({
      postId: item.id,
      preview: item.originalText.slice(0, 200) + (item.originalText.length > 200 ? '...' : ''),
      subjectName: item.subjectName || undefined,
      location: item.location || undefined,
      matchScore: item.rank,
      createdAt: item.createdAt.toISOString(),
      overlapCount: 1, // Keywords don't aggregate
    })),
    totalCount: items.length,
    hasMore,
    cursor: hasMore && items.length > 0 ? String(items[items.length - 1].id) : undefined,
  }
}
```

```typescript
// Task 6: Image search service
// packages/backend/src/services/image-search.service.ts

import { getTinEyeConfig } from '../config/tineye.js'
import { logger } from '../utils/logger.js'
import type { ImageSearchResult } from '@betweenus/shared'

interface TinEyeMatch {
  score: number
  image_url: string
  backlinks: Array<{
    url: string
    backlink: string
  }>
}

interface TinEyeResponse {
  results: {
    total_results: number
    matches: TinEyeMatch[]
  }
}

export async function searchByImage(
  imageData: string,
  location?: string,
  limit: number = 10
): Promise<ImageSearchResult[]> {
  const config = getTinEyeConfig()

  if (!config.apiKey) {
    throw new Error('Image search is not configured')
  }

  try {
    const formData = new FormData()
    // Convert base64 to blob for TinEye
    const imageBuffer = Buffer.from(imageData, 'base64')
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
    formData.append('image', blob, 'search.jpg')
    formData.append('limit', String(limit))

    const response = await fetch(`${config.baseUrl}/search/`, {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey,
      },
      body: formData,
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      throw new Error(`TinEye API error: ${response.status}`)
    }

    const data = await response.json() as TinEyeResponse

    // Map TinEye results to our format
    // Note: TinEye finds matching images across the web
    // We would need to cross-reference with our posts table
    // For MVP, return TinEye results directly
    return data.results.matches.map((match, index) => ({
      postId: 0, // Would need to match against our posts
      preview: `Found on: ${match.backlinks[0]?.url || 'Unknown source'}`,
      matchScore: match.score,
      matchConfidence: Math.round(match.score * 100),
      createdAt: new Date().toISOString(),
      overlapCount: 1,
      imageUrl: match.image_url,
    }))
  } catch (error) {
    logger.error('TinEye search failed', { error })
    throw error
  }
}
```

```typescript
// Task 7: Alerts service
// packages/backend/src/services/alerts.service.ts

import { eq, and, ilike, count } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { nameAlerts, posts, pushTokens } from '../db/schema.js'
import { sendPushNotification } from './push.service.js'
import { logger } from '../utils/logger.js'
import type { NameAlert } from '../db/schema.js'

const MAX_ALERTS_PER_USER = 5

export async function createAlert(
  userId: string,
  name: string,
  location?: string
): Promise<NameAlert> {
  const db = getDatabase()

  // Check current alert count
  const [countResult] = await db
    .select({ count: count() })
    .from(nameAlerts)
    .where(and(
      eq(nameAlerts.userId, userId),
      eq(nameAlerts.isActive, true)
    ))

  if ((countResult?.count || 0) >= MAX_ALERTS_PER_USER) {
    throw new Error(`Maximum ${MAX_ALERTS_PER_USER} alerts allowed`)
  }

  const normalizedName = name.toLowerCase().trim()

  const [alert] = await db
    .insert(nameAlerts)
    .values({
      userId,
      searchName: name.trim(),
      normalizedName,
      location: location?.trim() || null,
    })
    .returning()

  logger.info('Alert created', { userId, name: normalizedName })
  return alert
}

export async function getAlerts(userId: string): Promise<NameAlert[]> {
  const db = getDatabase()

  return db
    .select()
    .from(nameAlerts)
    .where(and(
      eq(nameAlerts.userId, userId),
      eq(nameAlerts.isActive, true)
    ))
    .orderBy(nameAlerts.createdAt)
}

export async function deleteAlert(alertId: number, userId: string): Promise<void> {
  const db = getDatabase()

  await db
    .update(nameAlerts)
    .set({ isActive: false })
    .where(and(
      eq(nameAlerts.id, alertId),
      eq(nameAlerts.userId, userId)
    ))
}

export async function checkAlertsForPost(postId: number): Promise<void> {
  const db = getDatabase()

  // Get the post
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (!post || !post.subjectName) return

  const normalizedPostName = post.subjectName.toLowerCase().trim()

  // Find matching alerts
  const matchingAlerts = await db
    .select()
    .from(nameAlerts)
    .where(and(
      eq(nameAlerts.isActive, true),
      ilike(nameAlerts.normalizedName, `%${normalizedPostName}%`)
    ))

  // Send notifications
  for (const alert of matchingAlerts) {
    // Don't notify the post author about their own post
    if (alert.userId === post.userId) continue

    // Update last matched timestamp
    await db
      .update(nameAlerts)
      .set({ lastMatchedAt: new Date() })
      .where(eq(nameAlerts.id, alert.id))

    // Send push notification
    await sendPushNotification(
      alert.userId,
      'New experience shared',
      `Someone shared an experience about "${alert.searchName}"`,
      { postId, screen: 'SearchResults', query: alert.searchName }
    )
  }

  logger.info('Checked alerts for post', {
    postId,
    subjectName: normalizedPostName,
    matchCount: matchingAlerts.length,
  })
}
```

### Integration Points

```yaml
DATABASE:
  - ADD columns to posts table: subjectName, location, search (tsvector)
  - ADD GIN index on posts.search
  - CREATE nameAlerts table
  - CREATE pushTokens table
  - RUN drizzle-kit generate && drizzle-kit migrate

CONFIG:
  - ADD to packages/backend/src/index.ts:
    import searchRoutes from './routes/search.routes.js'
    import alertsRoutes from './routes/alerts.routes.js'
    app.use('/api/search', searchRoutes)
    app.use('/api/alerts', alertsRoutes)

NAVIGATION:
  - ADD to AppStackParamList:
    Search: undefined
    SearchResults: { type: SearchType; query: string; location?: string }
    AlertsManage: undefined

ENVIRONMENT:
  Backend (.env):
    - TINEYE_API_KEY: API key from TinEye dashboard
    - TINEYE_SANDBOX: "true" for testing, "false" for production
    - EXPO_ACCESS_TOKEN: For sending push notifications

POST CREATION UPDATES:
  - Add subjectName field (required for name search)
  - Add location field (optional)
  - Trigger alert check after post creation
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

### Level 2: Database Migration

```bash
# Generate and run migration
yarn workspace @betweenus/backend db:generate
yarn workspace @betweenus/backend db:migrate

# Verify tables exist
psql $DATABASE_URL -c "\d posts"
psql $DATABASE_URL -c "\d name_alerts"
```

### Level 3: Backend Test

```bash
# Start backend
yarn workspace @betweenus/backend dev

# Test name search
curl "http://localhost:3000/api/search/name?query=John&limit=10" \
  -H "Authorization: Bearer TOKEN"

# Expected: { "success": true, "data": { "results": [...], "hasMore": false } }

# Test keyword search
curl "http://localhost:3000/api/search/keyword?query=uncomfortable&limit=10" \
  -H "Authorization: Bearer TOKEN"

# Test create alert
curl -X POST http://localhost:3000/api/alerts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "location": "New York"}'

# Expected: { "success": true, "data": { "id": 1, "searchName": "John Doe", ... } }

# Test get alerts
curl http://localhost:3000/api/alerts \
  -H "Authorization: Bearer TOKEN"
```

### Level 4: Frontend Manual Test

```bash
# Start frontend
yarn workspace @betweenus/frontend dev

# Test flow in Expo Go:
# 1. Navigate to Search screen
# 2. Select "Name" search type
# 3. Enter a name and search
# 4. Verify results show with proper brand voice
# 5. Tap "Save Alert" on a name search
# 6. Navigate to Alerts Management
# 7. Verify alert appears in list
# 8. Delete alert and verify removal

# For image search (requires TinEye API key):
# 1. Select "Image" search type
# 2. Upload or take a photo
# 3. Verify TinEye results (or error if no API key)
```

---

## Final Validation Checklist

- [ ] All type checks pass: `yarn type-check`
- [ ] Database migration runs successfully
- [ ] GIN index created on posts.search
- [ ] GET /api/search/name returns ranked results
- [ ] GET /api/search/keyword returns relevant results
- [ ] POST /api/search/image integrates with TinEye (if configured)
- [ ] POST /api/alerts creates new alert
- [ ] GET /api/alerts returns user's alerts
- [ ] DELETE /api/alerts/:id deactivates alert
- [ ] Alert limit (5) is enforced
- [ ] New post triggers alert check
- [ ] Push notification sent on alert match
- [ ] Search results use brand voice copy
- [ ] Empty states are helpful, not alarming

---

## Anti-Patterns to Avoid

- Don't say "reports" or "accusations" - use "experiences"
- Don't show exact match counts as "3 reports about John" - use "3 people shared experiences"
- Don't expose full post content in search results - only preview
- Don't allow searches without authentication
- Don't skip rate limiting on search endpoints
- Don't call TinEye API on every keystroke - only on explicit search
- Don't store raw image data in database - only TinEye reference
- Don't send push notifications to post author about their own post

---

## Brand Voice for Search

```typescript
// Search result headers
"Experiences shared about {name}"  // Not "Reports about {name}"

// Overlap counts
"{count} people have shared similar experiences"  // Not "{count} reports"

// Empty search results
"No matching experiences found. This name hasn't been mentioned yet."

// Alert creation success
"You'll be notified when someone shares an experience about this name."

// Alert limit reached
"You've reached the limit of 5 saved names. Remove one to add another."

// Image search no results
"We couldn't find matching images. Try a different photo."
```

---

## Quality Score

### Confidence Level: **7/10**

**Reasons for 7/10:**

**Strong foundations:**
- PostgreSQL full-text search is well-documented
- Drizzle ORM has clear FTS patterns
- Existing posts/auth infrastructure supports extension

**Achievable scope:**
- Core name/keyword search is straightforward
- TinEye integration is documented
- Push notifications use Expo's built-in service

**Moderate challenges:**
- Database migration adds columns to existing table
- TinEye API requires paid subscription for production
- Push notification setup requires Expo credentials
- Real-time alert matching needs careful async handling

**Higher risk areas:**
- Image search depends on external API availability/cost
- Overlap count calculation could be expensive at scale
- Alert matching on every post creation needs optimization

**Mitigation strategies:**
- Make TinEye optional (graceful degradation)
- Cache overlap counts or calculate periodically
- Use database trigger or queue for alert matching
- Start with sandbox/free tier for testing

**Expected outcome:** Working search system with name and keyword search, optional image search, and saved alerts with push notifications. May need optimization for scale.

---

## Next Steps After Completion

Once this PRP is implemented:

1. **Search Analytics** - Track search queries, popular names, conversion
2. **Advanced Filters** - Date range, post status, verification status
3. **Fuzzy Matching** - Handle typos and name variations
4. **Image Matching with Posts** - Cross-reference TinEye with uploaded post images
5. **Real-time Search** - WebSocket for instant results as user types

---

## External API Pricing Reference

### TinEye API
- Starter: $200 for 5,000 searches ($0.04/search)
- Basic: $300 for 10,000 searches ($0.03/search)
- Corporate: $1,000 for 50,000 searches ($0.02/search)
- Sandbox: Free for testing

### Alternative: Google Cloud Vision
- Web Detection: $1.50 per 1,000 images
- Vision API has broader features but different use case
- Consider for future enhancement

### Expo Push Notifications
- Free with Expo managed workflow
- Included in Expo Application Services (EAS)

---

## Sources

- [Drizzle ORM PostgreSQL Full-Text Search](https://orm.drizzle.team/docs/guides/postgresql-full-text-search)
- [Drizzle Full-Text Search with Generated Columns](https://orm.drizzle.team/docs/guides/full-text-search-with-generated-columns)
- [TinEye API Developer Documentation](https://services.tineye.com/developers/tineyeapi/)
- [PostgreSQL Text Search Types](https://www.postgresql.org/docs/current/datatype-textsearch.html)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [Google Cloud Vision API](https://cloud.google.com/vision)
