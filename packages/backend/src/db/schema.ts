import { pgTable, integer, text, timestamp, uuid, boolean, pgEnum, jsonb, index } from 'drizzle-orm/pg-core'

export const appRoleEnum = pgEnum('app_role', ['admin', 'moderator', 'member'])

export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'pending_review',
  'published',
  'rejected',
])

export const verificationStatusEnum = pgEnum('verification_status', [
  'pending',
  'processing',
  'approved',
  'denied',
  'error',
])

export const healthChecks = pgTable('health_checks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  status: text('status').notNull(),
})

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').unique().notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').primaryKey(),
  role: appRoleEnum('role').default('member').notNull(),
  assignedBy: uuid('assigned_by'),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
})

export const userVerificationStatus = pgTable('user_verification_status', {
  userId: uuid('user_id').primaryKey(),
  status: verificationStatusEnum('status').default('pending').notNull(),
  provider: text('provider'),
  verifiedAt: timestamp('verified_at'),
  idType: text('id_type'),
  idCountry: text('id_country'),
  rejectReason: text('reject_reason'),
  transactionReference: text('transaction_reference').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type HealthCheck = typeof healthChecks.$inferSelect
export type NewHealthCheck = typeof healthChecks.$inferInsert
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type UserRole = typeof userRoles.$inferSelect
export type NewUserRole = typeof userRoles.$inferInsert
export type UserVerificationStatus = typeof userVerificationStatus.$inferSelect
export type NewUserVerificationStatus = typeof userVerificationStatus.$inferInsert

export type ModerationFlags = {
  flagged: boolean
  categories: {
    hate: boolean
    harassment: boolean
    sexual: boolean
    violence: boolean
    'self-harm': boolean
  }
  category_scores: Record<string, number>
}

export type TriggerMatch = {
  category: string
  matched_text: string
  position: number
  severity: 'warn' | 'block'
}

export const posts = pgTable('posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(),
  subjectName: text('subject_name'),
  originalText: text('original_text').notNull(),
  rewrittenText: text('rewritten_text'),
  location: text('location'),
  status: postStatusEnum('status').notNull().default('draft'),
  moderationFlags: jsonb('moderation_flags').$type<ModerationFlags>(),
  triggerMatches: jsonb('trigger_matches').$type<TriggerMatch[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (t) => [
  index('idx_posts_subject_name').on(t.subjectName),
  index('idx_posts_location').on(t.location),
])

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

export const nameAlerts = pgTable('name_alerts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(),
  searchName: text('search_name').notNull(),
  normalizedName: text('normalized_name').notNull(),
  location: text('location'),
  isActive: boolean('is_active').default(true).notNull(),
  lastMatchedAt: timestamp('last_matched_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  index('idx_alerts_user').on(t.userId),
  index('idx_alerts_normalized_name').on(t.normalizedName),
])

export type NameAlert = typeof nameAlerts.$inferSelect
export type NewNameAlert = typeof nameAlerts.$inferInsert

export const pushTokens = pgTable('push_tokens', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(),
  token: text('token').notNull().unique(),
  platform: text('platform').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('idx_push_tokens_user').on(t.userId),
])

export type PushToken = typeof pushTokens.$inferSelect
export type NewPushToken = typeof pushTokens.$inferInsert
