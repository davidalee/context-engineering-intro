# Moderation System PRP - BetweenUs

**Version:** 1.0
**Created:** 2025-12-24
**Status:** Ready for Implementation
**Confidence Score:** 7/10

---

## Goal

Build a comprehensive moderation system that enables user reporting, admin/moderator tools, content review queues, AI-assisted flagging, audit logging, and user appeals. The system follows the platform's measured, non-performative tone in all moderation communications.

**End State:**
- Users can report posts and comments with categorized reasons
- Moderators have a dedicated queue to review flagged content
- Admins can manage users (ban, suspend, warn) and posts (edit, remove)
- All moderation actions are audit-logged for accountability
- Users can appeal moderation decisions
- AI pre-flags content for human review (expanding existing OpenAI integration)
- Moderation copy follows brand voice guide strictly

---

## Why

- **Legal Necessity**: Platform must demonstrate good-faith moderation efforts
- **Trust & Safety**: Core to BetweenUs mission - balanced moderation protects both posters and subjects
- **Scalability**: Manual review doesn't scale - AI pre-filtering essential
- **Accountability**: Audit logs protect platform and provide transparency
- **User Respect**: Appeals process respects users' right to contest decisions
- **Brand Integrity**: Moderation tone sets platform culture - "editors not referees"

---

## What

### User-Visible Behavior

1. **User Reporting**
   - Report button on posts and comments
   - Categorized reasons (harassment, false information, privacy violation, etc.)
   - Optional additional context
   - Confirmation with brand voice messaging

2. **Moderator Queue**
   - Dashboard showing flagged content (AI-flagged + user-reported)
   - Filter by flag type, severity, date
   - Actions: Approve, Edit, Remove, Warn User
   - Bulk actions for efficiency
   - Decision notes (internal)

3. **Admin User Management**
   - View user profiles and history
   - Actions: Warn, Suspend (temporary), Ban (permanent)
   - Duration selector for suspensions
   - Reason input (shown to user)
   - View user's moderation history

4. **Post Management**
   - View full post with all metadata
   - Edit content (with revision history)
   - Remove post (soft delete)
   - Restore removed post
   - Add internal notes

5. **Audit Logs**
   - Searchable log of all moderation actions
   - Who, what, when, why
   - Exportable for legal review
   - Admin-only access

6. **User Appeals**
   - Users notified of moderation actions
   - Appeal button with reason input
   - Appeal queue for admin review
   - Appeal resolution with user notification

### Success Criteria

- [ ] Users can report posts with categorized reasons
- [ ] Moderators see combined AI + user reports in queue
- [ ] Admins can warn, suspend, ban users
- [ ] Post edits create revision history
- [ ] All actions logged to audit table
- [ ] Users receive moderation notifications
- [ ] Appeals flow works end-to-end
- [ ] Type-check passes for all packages
- [ ] Moderation copy follows brand voice guide

---

## All Needed Context

### Documentation & References

```yaml
# DEPENDENCIES - Other PRPs
- file: /Users/wookiee/Code/BetweenUs/PRPs/posting-content-mvp.md
  why: Posts table, moderation flags, OpenAI moderation integration
  critical: MUST be complete - posts are primary moderation target

- file: /Users/wookiee/Code/BetweenUs/PRPs/authentication.md
  why: User roles (admin, moderator, member), RBAC middleware
  critical: MUST be complete - moderators need elevated permissions

# MUST READ - Core Project Documentation
- file: /Users/wookiee/Code/BetweenUs/docs/BRAND_VOICE_GUIDE.md
  why: ALL moderation messages must follow brand voice
  critical: "We've paused this post" not "This violates our rules"

- file: /Users/wookiee/Code/BetweenUs/docs/COMMUNITY_GUIDELINES.md
  why: Guidelines define what's reportable/removable
  critical: Report categories should align with guidelines

- file: /Users/wookiee/Code/BetweenUs/CLAUDE.md
  why: TypeScript conventions, file structure rules
  critical: Never exceed 500 LOC, strict TypeScript

# Existing codebase patterns
- file: packages/backend/src/middleware/rbac.middleware.ts
  why: Role-based access control for moderator/admin routes

- file: packages/backend/src/services/moderation.service.ts
  why: Existing OpenAI moderation integration

- file: packages/backend/src/db/schema.ts
  why: Current schema - need to add moderation tables

- file: packages/frontend/src/contexts/AuthContext.tsx
  why: User role available in context for UI gating

# External Documentation
- url: https://platform.openai.com/docs/guides/moderation
  why: OpenAI Moderation API for pre-flagging
  critical: Categories, scores, thresholds

- url: https://getstream.io/chat/docs/react/moderation_dashboard/
  why: Example moderation dashboard patterns
  critical: Queue design, action buttons, workflows
```

### Current Codebase Tree

```bash
packages/
├── backend/src/
│   ├── db/
│   │   └── schema.ts             # Has posts, profiles, userRoles
│   ├── services/
│   │   ├── posts.service.ts
│   │   └── moderation.service.ts # OpenAI moderation (exists)
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── rbac.middleware.ts    # Role checks (exists)
│   └── routes/
│       └── posts.routes.ts
├── frontend/src/
│   ├── screens/
│   │   ├── dashboard/
│   │   └── PostCreationScreen.tsx
│   ├── components/
│   └── contexts/
│       └── AuthContext.tsx       # Has role information
└── shared/src/
    ├── schemas/
    └── types/
        └── auth.types.ts         # Has AppRole type
```

### Desired Codebase Tree with New Files

```bash
# Backend additions
packages/backend/src/
├── db/
│   └── schema.ts                 # MODIFY: Add moderation tables
├── services/
│   ├── reports.service.ts        # NEW: User report handling
│   ├── moderation-queue.service.ts # NEW: Queue management
│   ├── user-actions.service.ts   # NEW: Ban/suspend/warn
│   ├── audit.service.ts          # NEW: Audit logging
│   └── appeals.service.ts        # NEW: Appeals handling
├── controllers/
│   ├── reports.controller.ts     # NEW
│   ├── moderation.controller.ts  # NEW: Queue actions
│   ├── admin.controller.ts       # NEW: User management
│   └── appeals.controller.ts     # NEW
├── routes/
│   ├── reports.routes.ts         # NEW: User-facing reports
│   ├── moderation.routes.ts      # NEW: Mod queue (moderator+)
│   ├── admin.routes.ts           # NEW: User actions (admin only)
│   └── appeals.routes.ts         # NEW: User appeals
└── utils/
    └── moderation-copy.ts        # NEW: Brand voice messages

# Frontend additions - User-facing
packages/frontend/src/
├── screens/
│   └── reports/
│       └── ReportScreen.tsx      # NEW: Report form modal
├── components/
│   └── reports/
│       ├── index.ts              # NEW
│       ├── ReportButton.tsx      # NEW: Trigger for report
│       └── ReportReasonPicker.tsx # NEW
├── services/
│   └── reports.service.ts        # NEW: Report API

# Frontend additions - Moderator/Admin
packages/frontend/src/
├── screens/
│   └── moderation/
│       ├── index.ts              # NEW
│       ├── ModerationQueueScreen.tsx # NEW
│       ├── PostReviewScreen.tsx  # NEW
│       ├── UserManagementScreen.tsx # NEW
│       └── AuditLogScreen.tsx    # NEW
├── components/
│   └── moderation/
│       ├── index.ts              # NEW
│       ├── QueueItem.tsx         # NEW
│       ├── ActionButtons.tsx     # NEW
│       ├── UserActionModal.tsx   # NEW
│       └── DecisionNoteInput.tsx # NEW
├── services/
│   ├── moderation.service.ts     # NEW
│   └── admin.service.ts          # NEW
└── hooks/
    ├── useModerationQueue.ts     # NEW
    └── useAdminActions.ts        # NEW

# Shared additions
packages/shared/src/
├── schemas/
│   ├── report.schemas.ts         # NEW
│   ├── moderation.schemas.ts     # NEW
│   └── appeal.schemas.ts         # NEW
└── types/
    ├── report.types.ts           # NEW
    ├── moderation.types.ts       # NEW
    └── appeal.types.ts           # NEW
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL 1: Moderation messages must use brand voice
// ❌ BAD: "Your post violates our community guidelines"
// ✅ GOOD: "We've paused this post to adjust the language"
// Source all messages from moderation-copy.ts utility

// CRITICAL 2: Soft deletes for posts
// Never hard delete - always set deletedAt
// Reason: Legal discovery, appeals, audit trail

// CRITICAL 3: Audit log immutability
// Audit logs should be INSERT only, never UPDATE/DELETE
// Consider separate table or even separate database for compliance

// CRITICAL 4: Role checks at route AND service level
// Don't trust frontend - always verify role server-side
// Use requireRole('moderator') or requireRole('admin') middleware

// CRITICAL 5: User notification strategy
// Moderation actions should notify users
// Use in-app notifications (not just push)
// Message must be brand-voice compliant

// CRITICAL 6: AI flagging thresholds
// OpenAI moderation returns scores 0-1
// Don't auto-remove - auto-flag for human review
// Threshold: >0.7 for any category → add to queue

// CRITICAL 7: Edit vs Remove distinction
// Edit: Content modified, post stays visible
// Remove: Post hidden, author notified
// Both create audit entries

// CRITICAL 8: Suspension vs Ban
// Suspend: Temporary (days), can still log in but restricted
// Ban: Permanent, cannot access account
// Both must have reason shown to user

// CRITICAL 9: Appeals have time limit
// Users have 14 days to appeal
// After that, decision is final

// CRITICAL 10: Moderator notes are internal only
// Users should NOT see moderator discussion notes
// Only final decision reason is shared
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// packages/backend/src/db/schema.ts - ADDITIONS

// Report reasons aligned with community guidelines
export const reportReasonEnum = pgEnum('report_reason', [
  'harassment',           // Targeting or attacking individuals
  'false_information',    // Claims presented as fact without basis
  'privacy_violation',    // Doxxing, personal info sharing
  'inappropriate_content', // Sexual, violent, graphic
  'spam',                 // Commercial, repetitive, off-topic
  'impersonation',        // Pretending to be someone else
  'self_harm',            // Content promoting self-harm
  'other',                // Catch-all with required explanation
])

export const moderationActionEnum = pgEnum('moderation_action', [
  'approve',              // Content is fine
  'edit',                 // Content was modified
  'remove',               // Content was hidden
  'warn',                 // User received warning
  'suspend',              // User temporarily restricted
  'ban',                  // User permanently banned
  'restore',              // Previously removed content restored
  'dismiss_report',       // Report was unfounded
])

export const appealStatusEnum = pgEnum('appeal_status', [
  'pending',
  'approved',             // Appeal granted, action reversed
  'denied',               // Appeal denied, action stands
  'expired',              // Past 14-day window
])

// User reports table
export const reports = pgTable('reports', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  reporterId: uuid('reporter_id').notNull(), // Who reported
  postId: integer('post_id'), // Can be null if reporting user
  targetUserId: uuid('target_user_id'), // Can be null if reporting post
  reason: reportReasonEnum('reason').notNull(),
  description: text('description'), // Additional context
  status: text('status').default('pending').notNull(), // pending, reviewed, dismissed
  reviewedBy: uuid('reviewed_by'), // Moderator who reviewed
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  index('idx_reports_status').on(t.status),
  index('idx_reports_post').on(t.postId),
  index('idx_reports_target').on(t.targetUserId),
])

// Moderation queue table (combines AI flags + reports)
export const moderationQueue = pgTable('moderation_queue', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  postId: integer('post_id').notNull(),
  source: text('source').notNull(), // 'ai' | 'report' | 'manual'
  severity: text('severity').notNull(), // 'low' | 'medium' | 'high'
  aiScores: jsonb('ai_scores').$type<Record<string, number>>(), // OpenAI scores
  reportIds: jsonb('report_ids').$type<number[]>(), // Associated report IDs
  status: text('status').default('pending').notNull(), // pending, in_review, resolved
  assignedTo: uuid('assigned_to'), // Moderator working on it
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
}, (t) => [
  index('idx_queue_status').on(t.status),
  index('idx_queue_severity').on(t.severity),
  index('idx_queue_assigned').on(t.assignedTo),
])

// User moderation status (warns, suspensions, bans)
export const userModerationStatus = pgTable('user_moderation_status', {
  userId: uuid('user_id').primaryKey(),
  status: text('status').default('active').notNull(), // active, warned, suspended, banned
  warningCount: integer('warning_count').default(0).notNull(),
  suspendedUntil: timestamp('suspended_until'),
  bannedAt: timestamp('banned_at'),
  lastActionReason: text('last_action_reason'),
  lastActionBy: uuid('last_action_by'),
  lastActionAt: timestamp('last_action_at'),
})

// Audit log table (append-only)
export const auditLogs = pgTable('audit_logs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  actorId: uuid('actor_id').notNull(), // Who performed action
  actorRole: appRoleEnum('actor_role').notNull(),
  action: moderationActionEnum('action').notNull(),
  targetType: text('target_type').notNull(), // 'post' | 'user' | 'report'
  targetId: text('target_id').notNull(), // ID of affected entity
  reason: text('reason'), // Reason shown to user
  internalNote: text('internal_note'), // Moderator-only note
  previousState: jsonb('previous_state'), // State before action
  newState: jsonb('new_state'), // State after action
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  index('idx_audit_actor').on(t.actorId),
  index('idx_audit_target').on(t.targetType, t.targetId),
  index('idx_audit_action').on(t.action),
  index('idx_audit_date').on(t.createdAt),
])

// Post revisions for edit history
export const postRevisions = pgTable('post_revisions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  postId: integer('post_id').notNull(),
  previousText: text('previous_text').notNull(),
  newText: text('new_text').notNull(),
  editedBy: uuid('edited_by').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  index('idx_revisions_post').on(t.postId),
])

// User appeals
export const appeals = pgTable('appeals', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(),
  auditLogId: integer('audit_log_id').notNull(), // Which action being appealed
  reason: text('reason').notNull(), // User's appeal reason
  status: appealStatusEnum('status').default('pending').notNull(),
  reviewedBy: uuid('reviewed_by'),
  reviewNote: text('review_note'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(), // 14 days from action
}, (t) => [
  index('idx_appeals_user').on(t.userId),
  index('idx_appeals_status').on(t.status),
])

// Type exports
export type Report = typeof reports.$inferSelect
export type NewReport = typeof reports.$inferInsert
export type ModerationQueueItem = typeof moderationQueue.$inferSelect
export type AuditLog = typeof auditLogs.$inferSelect
export type PostRevision = typeof postRevisions.$inferSelect
export type Appeal = typeof appeals.$inferSelect
export type UserModerationStatus = typeof userModerationStatus.$inferSelect
```

```typescript
// packages/shared/src/types/report.types.ts

export type ReportReason =
  | 'harassment'
  | 'false_information'
  | 'privacy_violation'
  | 'inappropriate_content'
  | 'spam'
  | 'impersonation'
  | 'self_harm'
  | 'other'

export interface CreateReportInput {
  postId?: number
  targetUserId?: string
  reason: ReportReason
  description?: string
}

export interface ReportResponse {
  id: number
  reason: ReportReason
  status: string
  createdAt: string
}
```

```typescript
// packages/shared/src/types/moderation.types.ts

export type ModerationAction =
  | 'approve'
  | 'edit'
  | 'remove'
  | 'warn'
  | 'suspend'
  | 'ban'
  | 'restore'
  | 'dismiss_report'

export type QueueItemSeverity = 'low' | 'medium' | 'high'
export type QueueItemSource = 'ai' | 'report' | 'manual'

export interface QueueItem {
  id: number
  postId: number
  source: QueueItemSource
  severity: QueueItemSeverity
  aiScores?: Record<string, number>
  reportCount: number
  status: string
  assignedTo?: string
  createdAt: string
  // Joined post data
  postPreview: string
  postAuthorId: string
}

export interface QueueActionInput {
  queueItemId: number
  action: ModerationAction
  reason?: string // Shown to user
  internalNote?: string // Moderator only
  editedContent?: string // If action is 'edit'
  suspensionDays?: number // If action is 'suspend'
}

export interface UserModerationProfile {
  userId: string
  email: string
  status: 'active' | 'warned' | 'suspended' | 'banned'
  warningCount: number
  suspendedUntil?: string
  bannedAt?: string
  recentActions: AuditLogEntry[]
  postCount: number
  reportCount: number
}

export interface AuditLogEntry {
  id: number
  actorId: string
  actorEmail?: string
  action: ModerationAction
  targetType: 'post' | 'user' | 'report'
  targetId: string
  reason?: string
  createdAt: string
}
```

```typescript
// packages/shared/src/schemas/moderation.schemas.ts

import { z } from 'zod'

export const createReportSchema = z.object({
  postId: z.number().optional(),
  targetUserId: z.string().uuid().optional(),
  reason: z.enum([
    'harassment',
    'false_information',
    'privacy_violation',
    'inappropriate_content',
    'spam',
    'impersonation',
    'self_harm',
    'other',
  ]),
  description: z.string().max(1000).optional(),
}).refine(
  data => data.postId || data.targetUserId,
  { message: 'Must report either a post or a user' }
)

export const queueActionSchema = z.object({
  queueItemId: z.number(),
  action: z.enum(['approve', 'edit', 'remove', 'warn', 'suspend', 'ban', 'restore', 'dismiss_report']),
  reason: z.string().max(500).optional(),
  internalNote: z.string().max(1000).optional(),
  editedContent: z.string().optional(),
  suspensionDays: z.number().min(1).max(365).optional(),
})

export const userActionSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum(['warn', 'suspend', 'ban', 'unban', 'unsuspend']),
  reason: z.string().min(10).max(500),
  suspensionDays: z.number().min(1).max(365).optional(),
})

export const appealSchema = z.object({
  auditLogId: z.number(),
  reason: z.string().min(20).max(2000),
})

export const appealReviewSchema = z.object({
  appealId: z.number(),
  decision: z.enum(['approve', 'deny']),
  note: z.string().max(1000).optional(),
})
```

### List of Tasks to Complete

```yaml
Task 1: Create moderation copy utility
  CREATE packages/backend/src/utils/moderation-copy.ts:
    - Brand voice compliant messages for all moderation actions
    - Templates: postPaused, postRemoved, userWarned, userSuspended, userBanned
    - Appeal instructions
    - Report confirmation messages

Task 2: Update database schema
  MODIFY packages/backend/src/db/schema.ts:
    - Add reportReasonEnum, moderationActionEnum, appealStatusEnum
    - CREATE reports table
    - CREATE moderationQueue table
    - CREATE userModerationStatus table
    - CREATE auditLogs table
    - CREATE postRevisions table
    - CREATE appeals table
  RUN: yarn workspace @betweenus/backend db:generate
  RUN: yarn workspace @betweenus/backend db:migrate

Task 3: Create shared types and schemas
  CREATE packages/shared/src/types/report.types.ts
  CREATE packages/shared/src/types/moderation.types.ts
  CREATE packages/shared/src/types/appeal.types.ts
  CREATE packages/shared/src/schemas/report.schemas.ts
  CREATE packages/shared/src/schemas/moderation.schemas.ts
  CREATE packages/shared/src/schemas/appeal.schemas.ts
  MODIFY packages/shared/src/index.ts:
    - Export all new types and schemas

Task 4: Create audit service
  CREATE packages/backend/src/services/audit.service.ts:
    - logAction(actorId, actorRole, action, targetType, targetId, reason, internalNote, previousState, newState)
    - getAuditLogs(filters) with pagination
    - getAuditLogsByTarget(targetType, targetId)

Task 5: Create reports service
  CREATE packages/backend/src/services/reports.service.ts:
    - createReport(reporterId, input)
    - getReportsByPost(postId)
    - getReportsByUser(userId)
    - updateReportStatus(reportId, status, reviewerId)
    - After report created, add to moderation queue

Task 6: Create moderation queue service
  CREATE packages/backend/src/services/moderation-queue.service.ts:
    - addToQueue(postId, source, severity, aiScores?, reportIds?)
    - getQueueItems(filters, pagination)
    - assignToModerator(queueItemId, moderatorId)
    - resolveQueueItem(queueItemId, action, actorId)
    - getQueueStats() - counts by status/severity

Task 7: Create user actions service
  CREATE packages/backend/src/services/user-actions.service.ts:
    - warnUser(userId, reason, actorId)
    - suspendUser(userId, days, reason, actorId)
    - banUser(userId, reason, actorId)
    - unsuspendUser(userId, actorId)
    - unbanUser(userId, actorId)
    - getUserModerationProfile(userId)
    - Each action logs to audit

Task 8: Create appeals service
  CREATE packages/backend/src/services/appeals.service.ts:
    - createAppeal(userId, auditLogId, reason)
    - getAppeals(filters) for admin view
    - getUserAppeals(userId)
    - reviewAppeal(appealId, decision, note, reviewerId)
    - checkAppealEligibility(auditLogId, userId)

Task 9: Expand moderation service for AI flagging
  MODIFY packages/backend/src/services/moderation.service.ts:
    - After moderateContent(), check if any score > 0.7
    - If so, call moderation-queue.service.addToQueue()
    - Return shouldQueue boolean

Task 10: Create reports controller
  CREATE packages/backend/src/controllers/reports.controller.ts:
    - handleCreateReport(req, res, next)
    - handleGetMyReports(req, res, next)

Task 11: Create moderation controller
  CREATE packages/backend/src/controllers/moderation.controller.ts:
    - handleGetQueue(req, res, next)
    - handleGetQueueItem(req, res, next)
    - handleTakeAction(req, res, next)
    - handleAssignItem(req, res, next)
    - handleGetStats(req, res, next)

Task 12: Create admin controller
  CREATE packages/backend/src/controllers/admin.controller.ts:
    - handleGetUserProfile(req, res, next)
    - handleUserAction(req, res, next)
    - handleGetAuditLogs(req, res, next)

Task 13: Create appeals controller
  CREATE packages/backend/src/controllers/appeals.controller.ts:
    - handleCreateAppeal(req, res, next)
    - handleGetMyAppeals(req, res, next)
    - handleGetAppeals(req, res, next) - admin
    - handleReviewAppeal(req, res, next) - admin

Task 14: Create reports routes
  CREATE packages/backend/src/routes/reports.routes.ts:
    - POST / → handleCreateReport (requires auth)
    - GET /mine → handleGetMyReports (requires auth)
  MODIFY packages/backend/src/index.ts:
    - Mount at /api/reports

Task 15: Create moderation routes
  CREATE packages/backend/src/routes/moderation.routes.ts:
    - GET /queue → handleGetQueue (requires moderator+)
    - GET /queue/:id → handleGetQueueItem (requires moderator+)
    - POST /queue/:id/action → handleTakeAction (requires moderator+)
    - POST /queue/:id/assign → handleAssignItem (requires moderator+)
    - GET /stats → handleGetStats (requires moderator+)
  MODIFY packages/backend/src/index.ts:
    - Mount at /api/moderation

Task 16: Create admin routes
  CREATE packages/backend/src/routes/admin.routes.ts:
    - GET /users/:id → handleGetUserProfile (requires admin)
    - POST /users/:id/action → handleUserAction (requires admin)
    - GET /audit → handleGetAuditLogs (requires admin)
  MODIFY packages/backend/src/index.ts:
    - Mount at /api/admin

Task 17: Create appeals routes
  CREATE packages/backend/src/routes/appeals.routes.ts:
    - POST / → handleCreateAppeal (requires auth)
    - GET /mine → handleGetMyAppeals (requires auth)
    - GET / → handleGetAppeals (requires admin)
    - POST /:id/review → handleReviewAppeal (requires admin)
  MODIFY packages/backend/src/index.ts:
    - Mount at /api/appeals

Task 18: Create frontend reports service
  CREATE packages/frontend/src/services/reports.service.ts:
    - createReport(input)
    - getMyReports()

Task 19: Create frontend moderation service
  CREATE packages/frontend/src/services/moderation.service.ts:
    - getQueue(filters, cursor)
    - getQueueItem(id)
    - takeAction(queueItemId, action, reason, note)
    - assignItem(queueItemId)
    - getStats()

Task 20: Create frontend admin service
  CREATE packages/frontend/src/services/admin.service.ts:
    - getUserProfile(userId)
    - performUserAction(userId, action, reason, days?)
    - getAuditLogs(filters, cursor)

Task 21: Create ReportButton component
  CREATE packages/frontend/src/components/reports/ReportButton.tsx:
    - Props: postId?, targetUserId?, size
    - Flag icon button
    - Opens report modal on tap

Task 22: Create ReportReasonPicker component
  CREATE packages/frontend/src/components/reports/ReportReasonPicker.tsx:
    - Radio buttons for each reason
    - Description input for 'other'

Task 23: Create ReportScreen (modal)
  CREATE packages/frontend/src/screens/reports/ReportScreen.tsx:
    - ReportReasonPicker
    - Optional description textarea
    - Submit button
    - Brand voice confirmation message

Task 24: Create useModerationQueue hook
  CREATE packages/frontend/src/hooks/useModerationQueue.ts:
    - queue: QueueItem[]
    - isLoading, error
    - filters, setFilters
    - refresh()
    - loadMore()
    - takeAction()

Task 25: Create QueueItem component
  CREATE packages/frontend/src/components/moderation/QueueItem.tsx:
    - Post preview
    - Source badge (AI/Report)
    - Severity indicator
    - Report count
    - Tap to review

Task 26: Create ActionButtons component
  CREATE packages/frontend/src/components/moderation/ActionButtons.tsx:
    - Approve, Edit, Remove buttons
    - Warn/Suspend/Ban for user actions
    - Confirm dialogs for destructive actions

Task 27: Create UserActionModal component
  CREATE packages/frontend/src/components/moderation/UserActionModal.tsx:
    - Action selector (warn/suspend/ban)
    - Reason input (required)
    - Duration picker for suspend
    - Submit with confirmation

Task 28: Create ModerationQueueScreen
  CREATE packages/frontend/src/screens/moderation/ModerationQueueScreen.tsx:
    - Filter tabs (All, AI Flagged, Reported, High Priority)
    - FlatList of QueueItems
    - Pull to refresh
    - Empty state

Task 29: Create PostReviewScreen
  CREATE packages/frontend/src/screens/moderation/PostReviewScreen.tsx:
    - Full post content
    - AI moderation scores visualization
    - Report reasons list
    - User history summary
    - ActionButtons
    - Decision note input

Task 30: Create UserManagementScreen
  CREATE packages/frontend/src/screens/moderation/UserManagementScreen.tsx:
    - User search
    - User profile with moderation history
    - Action buttons (warn/suspend/ban)
    - Recent posts list

Task 31: Create AuditLogScreen
  CREATE packages/frontend/src/screens/moderation/AuditLogScreen.tsx:
    - Searchable, filterable log
    - Date range picker
    - Action type filter
    - Export button (admin only)

Task 32: Create moderation screens barrel export
  CREATE packages/frontend/src/screens/moderation/index.ts

Task 33: Update navigation for moderation
  MODIFY packages/frontend/src/navigation/AppNavigator.tsx:
    - Add ModerationQueue, PostReview, UserManagement, AuditLog screens
    - Gate visibility based on user role (moderator/admin)

Task 34: Add ReportButton to post components
  MODIFY packages/frontend/src/components/posts/PostForm.tsx or PostCard.tsx:
    - Add ReportButton in post actions

Task 35: Type-check and manual test
  RUN: yarn workspace @betweenus/shared build
  RUN: yarn type-check
  FIX: Any type errors
  TEST: Manual flow for reporting, moderation queue, admin actions
```

### Per-Task Pseudocode

```typescript
// Task 1: Moderation copy utility
// packages/backend/src/utils/moderation-copy.ts

export const moderationCopy = {
  // Post actions
  postPaused: `We've paused this post to review the language. You're welcome to edit and resubmit.`,
  postRemoved: `This post has been removed because it didn't align with our community guidelines. You may appeal this decision within 14 days.`,
  postEdited: `Your post has been adjusted to better align with our guidelines. You can view the changes on your post.`,
  postApproved: `Your post has been reviewed and is now visible.`,
  postRestored: `Your post has been restored and is now visible again.`,

  // User actions
  userWarned: `We've noticed some of your content didn't quite fit our guidelines. Please review our community standards to continue sharing thoughtfully.`,
  userSuspended: (days: number) => `Your account has been temporarily paused for ${days} days to review recent activity. You may appeal this decision.`,
  userBanned: `Your account has been permanently restricted due to repeated guideline violations. You may appeal this decision within 14 days.`,

  // Report confirmation
  reportReceived: `Thank you for letting us know. We'll review this and take appropriate action.`,
  reportDismissed: `After review, we've determined this content aligns with our guidelines.`,

  // Appeal
  appealReceived: `We've received your appeal and will review it carefully. You'll hear back within 5 business days.`,
  appealApproved: `Your appeal has been reviewed and approved. The previous action has been reversed.`,
  appealDenied: `After careful review, we've decided to uphold the original decision. This decision is final.`,

  // Moderator templates
  internalNotePrefix: '[Internal] ',

  // Helper to get reason display text
  getReasonDisplay: (reason: string): string => {
    const reasons: Record<string, string> = {
      harassment: 'Content that targets or attacks individuals',
      false_information: 'Claims presented as fact without basis',
      privacy_violation: 'Sharing of personal or private information',
      inappropriate_content: 'Content that violates content standards',
      spam: 'Commercial or repetitive content',
      impersonation: 'Misrepresenting identity',
      self_harm: 'Content related to self-harm',
      other: 'Other guideline concern',
    }
    return reasons[reason] || reason
  },
}
```

```typescript
// Task 4: Audit service
// packages/backend/src/services/audit.service.ts

import { desc, eq, and, sql, or } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { auditLogs, profiles } from '../db/schema.js'
import { logger } from '../utils/logger.js'
import type { ModerationAction, AppRole } from '@betweenus/shared'

interface LogActionParams {
  actorId: string
  actorRole: AppRole
  action: ModerationAction
  targetType: 'post' | 'user' | 'report'
  targetId: string
  reason?: string
  internalNote?: string
  previousState?: Record<string, unknown>
  newState?: Record<string, unknown>
}

export async function logAction(params: LogActionParams): Promise<number> {
  const db = getDatabase()

  const [entry] = await db
    .insert(auditLogs)
    .values({
      actorId: params.actorId,
      actorRole: params.actorRole,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      reason: params.reason,
      internalNote: params.internalNote,
      previousState: params.previousState,
      newState: params.newState,
    })
    .returning({ id: auditLogs.id })

  logger.info('Audit log created', {
    id: entry.id,
    action: params.action,
    targetType: params.targetType,
    targetId: params.targetId,
  })

  return entry.id
}

interface AuditLogFilters {
  actorId?: string
  action?: ModerationAction
  targetType?: 'post' | 'user' | 'report'
  targetId?: string
  startDate?: Date
  endDate?: Date
}

export async function getAuditLogs(
  filters: AuditLogFilters,
  limit: number = 50,
  cursor?: string
) {
  const db = getDatabase()

  const conditions = []

  if (filters.actorId) {
    conditions.push(eq(auditLogs.actorId, filters.actorId))
  }
  if (filters.action) {
    conditions.push(eq(auditLogs.action, filters.action))
  }
  if (filters.targetType) {
    conditions.push(eq(auditLogs.targetType, filters.targetType))
  }
  if (filters.targetId) {
    conditions.push(eq(auditLogs.targetId, filters.targetId))
  }
  if (filters.startDate) {
    conditions.push(sql`${auditLogs.createdAt} >= ${filters.startDate}`)
  }
  if (filters.endDate) {
    conditions.push(sql`${auditLogs.createdAt} <= ${filters.endDate}`)
  }
  if (cursor) {
    conditions.push(sql`${auditLogs.id} < ${parseInt(cursor, 10)}`)
  }

  const results = await db
    .select({
      id: auditLogs.id,
      actorId: auditLogs.actorId,
      actorRole: auditLogs.actorRole,
      action: auditLogs.action,
      targetType: auditLogs.targetType,
      targetId: auditLogs.targetId,
      reason: auditLogs.reason,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit + 1)

  const hasMore = results.length > limit
  const items = hasMore ? results.slice(0, -1) : results

  return {
    items,
    hasMore,
    cursor: hasMore && items.length > 0 ? String(items[items.length - 1].id) : undefined,
  }
}

export async function getAuditLogsByTarget(
  targetType: 'post' | 'user' | 'report',
  targetId: string
) {
  const db = getDatabase()

  return db
    .select()
    .from(auditLogs)
    .where(and(
      eq(auditLogs.targetType, targetType),
      eq(auditLogs.targetId, targetId)
    ))
    .orderBy(desc(auditLogs.createdAt))
}
```

```typescript
// Task 6: Moderation queue service
// packages/backend/src/services/moderation-queue.service.ts

import { eq, and, desc, sql, count } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { moderationQueue, posts, reports } from '../db/schema.js'
import { logger } from '../utils/logger.js'
import type { QueueItemSource, QueueItemSeverity } from '@betweenus/shared'

export async function addToQueue(
  postId: number,
  source: QueueItemSource,
  severity: QueueItemSeverity,
  aiScores?: Record<string, number>,
  reportIds?: number[]
): Promise<number> {
  const db = getDatabase()

  // Check if post already in queue
  const [existing] = await db
    .select()
    .from(moderationQueue)
    .where(and(
      eq(moderationQueue.postId, postId),
      eq(moderationQueue.status, 'pending')
    ))
    .limit(1)

  if (existing) {
    // Update existing queue item with additional reports
    const updatedReportIds = [
      ...(existing.reportIds || []),
      ...(reportIds || []),
    ]

    // Upgrade severity if needed
    const severityRank = { low: 0, medium: 1, high: 2 }
    const newSeverity = severityRank[severity] > severityRank[existing.severity as QueueItemSeverity]
      ? severity
      : existing.severity

    await db
      .update(moderationQueue)
      .set({
        reportIds: updatedReportIds,
        severity: newSeverity,
        aiScores: aiScores || existing.aiScores,
      })
      .where(eq(moderationQueue.id, existing.id))

    return existing.id
  }

  // Create new queue item
  const [item] = await db
    .insert(moderationQueue)
    .values({
      postId,
      source,
      severity,
      aiScores,
      reportIds,
    })
    .returning({ id: moderationQueue.id })

  logger.info('Added to moderation queue', { postId, source, severity })
  return item.id
}

interface QueueFilters {
  status?: string
  severity?: QueueItemSeverity
  source?: QueueItemSource
  assignedTo?: string
}

export async function getQueueItems(
  filters: QueueFilters,
  limit: number = 20,
  cursor?: string
) {
  const db = getDatabase()

  const conditions = [eq(moderationQueue.status, filters.status || 'pending')]

  if (filters.severity) {
    conditions.push(eq(moderationQueue.severity, filters.severity))
  }
  if (filters.source) {
    conditions.push(eq(moderationQueue.source, filters.source))
  }
  if (filters.assignedTo) {
    conditions.push(eq(moderationQueue.assignedTo, filters.assignedTo))
  }
  if (cursor) {
    conditions.push(sql`${moderationQueue.id} < ${parseInt(cursor, 10)}`)
  }

  const results = await db
    .select({
      id: moderationQueue.id,
      postId: moderationQueue.postId,
      source: moderationQueue.source,
      severity: moderationQueue.severity,
      aiScores: moderationQueue.aiScores,
      reportIds: moderationQueue.reportIds,
      status: moderationQueue.status,
      assignedTo: moderationQueue.assignedTo,
      createdAt: moderationQueue.createdAt,
      postPreview: posts.originalText,
      postAuthorId: posts.userId,
    })
    .from(moderationQueue)
    .innerJoin(posts, eq(moderationQueue.postId, posts.id))
    .where(and(...conditions))
    .orderBy(
      desc(sql`CASE ${moderationQueue.severity} WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END`),
      moderationQueue.createdAt
    )
    .limit(limit + 1)

  const hasMore = results.length > limit
  const items = hasMore ? results.slice(0, -1) : results

  return {
    items: items.map(item => ({
      ...item,
      postPreview: item.postPreview.slice(0, 200) + (item.postPreview.length > 200 ? '...' : ''),
      reportCount: item.reportIds?.length || 0,
    })),
    hasMore,
    cursor: hasMore && items.length > 0 ? String(items[items.length - 1].id) : undefined,
  }
}

export async function getQueueStats() {
  const db = getDatabase()

  const [stats] = await db
    .select({
      total: count(),
      pending: sql<number>`count(*) filter (where ${moderationQueue.status} = 'pending')`,
      highPriority: sql<number>`count(*) filter (where ${moderationQueue.severity} = 'high' and ${moderationQueue.status} = 'pending')`,
      aiSource: sql<number>`count(*) filter (where ${moderationQueue.source} = 'ai' and ${moderationQueue.status} = 'pending')`,
      reportSource: sql<number>`count(*) filter (where ${moderationQueue.source} = 'report' and ${moderationQueue.status} = 'pending')`,
    })
    .from(moderationQueue)

  return stats
}

export async function resolveQueueItem(
  queueItemId: number,
  actorId: string
): Promise<void> {
  const db = getDatabase()

  await db
    .update(moderationQueue)
    .set({
      status: 'resolved',
      resolvedAt: new Date(),
    })
    .where(eq(moderationQueue.id, queueItemId))
}
```

### Integration Points

```yaml
DATABASE:
  - CREATE reports, moderationQueue, userModerationStatus, auditLogs, postRevisions, appeals tables
  - CREATE enums: reportReasonEnum, moderationActionEnum, appealStatusEnum
  - RUN drizzle-kit generate && drizzle-kit migrate

CONFIG:
  - ADD to packages/backend/src/index.ts:
    import reportsRoutes from './routes/reports.routes.js'
    import moderationRoutes from './routes/moderation.routes.js'
    import adminRoutes from './routes/admin.routes.js'
    import appealsRoutes from './routes/appeals.routes.js'
    app.use('/api/reports', reportsRoutes)
    app.use('/api/moderation', moderationRoutes)
    app.use('/api/admin', adminRoutes)
    app.use('/api/appeals', appealsRoutes)

NAVIGATION:
  - ADD to AppStackParamList:
    ReportPost: { postId: number }
    ModerationQueue: undefined
    PostReview: { queueItemId: number }
    UserManagement: { userId?: string }
    AuditLog: undefined
  - Conditionally show moderation screens based on role

EXISTING INTEGRATION:
  - MODIFY moderation.service.ts to auto-add high-score posts to queue
  - MODIFY posts.service.ts to check user moderation status before allowing post

ENVIRONMENT:
  - No new environment variables required
```

---

## Validation Loop

### Level 1: Syntax & Style

```bash
yarn type-check

# Expected: No type errors
```

### Level 2: Database Migration

```bash
yarn workspace @betweenus/backend db:generate
yarn workspace @betweenus/backend db:migrate

# Verify tables
psql $DATABASE_URL -c "\d reports"
psql $DATABASE_URL -c "\d moderation_queue"
psql $DATABASE_URL -c "\d audit_logs"
```

### Level 3: Backend Test

```bash
yarn workspace @betweenus/backend dev

# Test report creation (as regular user)
curl -X POST http://localhost:3000/api/reports \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"postId": 1, "reason": "harassment", "description": "Test report"}'

# Expected: { "success": true, "data": { "id": 1, ... } }

# Test moderation queue (as moderator)
curl http://localhost:3000/api/moderation/queue \
  -H "Authorization: Bearer MODERATOR_TOKEN"

# Expected: { "success": true, "data": { "items": [...], "hasMore": false } }

# Test user action (as admin)
curl -X POST http://localhost:3000/api/admin/users/USER_ID/action \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "warn", "reason": "Test warning message"}'

# Test audit log (as admin)
curl http://localhost:3000/api/admin/audit \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Level 4: Frontend Manual Test

```bash
yarn workspace @betweenus/frontend dev

# As regular user:
# 1. Find a post and tap report button
# 2. Select reason and submit
# 3. Verify confirmation message

# As moderator:
# 1. Navigate to Moderation Queue
# 2. See flagged items
# 3. Tap to review
# 4. Take action (approve/edit/remove)
# 5. Verify item removed from queue

# As admin:
# 1. Navigate to User Management
# 2. Search for a user
# 3. View their moderation history
# 4. Apply warn/suspend/ban
# 5. Check Audit Log for action record
```

---

## Final Validation Checklist

- [ ] All type checks pass: `yarn type-check`
- [ ] Database migration creates all tables
- [ ] Users can create reports on posts
- [ ] Reports appear in moderation queue
- [ ] AI-flagged posts appear in queue
- [ ] Moderators can approve/edit/remove posts
- [ ] Admins can warn/suspend/ban users
- [ ] All actions create audit log entries
- [ ] Users receive moderation notifications
- [ ] Users can submit appeals
- [ ] Admins can review and resolve appeals
- [ ] Role-based access enforced on all routes
- [ ] Moderation copy follows brand voice guide

---

## Anti-Patterns to Avoid

- Don't say "violated rules" - use "didn't align with guidelines"
- Don't auto-ban based on AI scores - always require human review
- Don't expose internal notes to users
- Don't allow hard deletes - always soft delete
- Don't skip audit logging for any action
- Don't allow moderators to action their own content
- Don't send harsh notification language
- Don't allow appeals after 14 days

---

## Brand Voice for Moderation

```typescript
// Post paused (not removed yet)
"We've paused this post to review the language. You're welcome to edit and resubmit."

// Post removed
"This post has been removed because it didn't align with our community guidelines."

// User warning
"We've noticed some of your content didn't quite fit our guidelines. Please review our community standards."

// User suspended
"Your account has been temporarily paused for {days} days to review recent activity."

// Appeal received
"We've received your appeal and will review it carefully. You'll hear back within 5 business days."

// Report confirmation
"Thank you for letting us know. We'll review this and take appropriate action."

// AVOID:
// "Your post violates our rules"
// "You have been banned for abuse"
// "This content is inappropriate"
// "Your report has been filed"
```

---

## Quality Score

### Confidence Level: **7/10**

**Reasons for 7/10:**

**Strong foundations:**
- RBAC middleware already exists
- OpenAI moderation already integrated
- Clear patterns from existing services
- Comprehensive brand voice guide

**Achievable scope:**
- All features are well-understood patterns
- No external API dependencies (except existing OpenAI)
- Progressive complexity (reports → queue → admin)

**Moderate challenges:**
- Many new database tables
- Complex relationships between entities
- Role-based UI gating
- Notification system integration

**Higher risk areas:**
- Audit log volume could grow large
- Queue management at scale
- Appeal workflow complexity
- Moderator training requirements

**Mitigation strategies:**
- Start with core reporting/queue functionality
- Add admin features progressively
- Defer appeal system if needed
- Use audit log pagination from start

**Expected outcome:** Working moderation system with user reporting, moderator queue, admin tools, and audit logging. Appeals can be added as follow-up if needed.

---

## Next Steps After Completion

Once this PRP is implemented:

1. **Moderator Training** - Create training materials for moderators
2. **Moderation Analytics** - Dashboard showing moderation metrics
3. **Auto-Moderation Rules** - Rule-based auto-actions for obvious cases
4. **Moderator Scheduling** - Assign moderators to time slots
5. **Escalation Workflow** - Route complex cases to senior moderators
6. **External Integration** - Connect to legal review for serious cases

---

## Sources

- [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)
- [Stream Chat Moderation Dashboard](https://getstream.io/chat/docs/react/moderation_dashboard/)
- [BetweenUs Brand Voice Guide](docs/BRAND_VOICE_GUIDE.md)
- [BetweenUs Community Guidelines](docs/COMMUNITY_GUIDELINES.md)
