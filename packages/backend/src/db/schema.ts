import { pgTable, integer, text, timestamp, uuid, boolean, pgEnum } from 'drizzle-orm/pg-core'

export const appRoleEnum = pgEnum('app_role', ['admin', 'moderator', 'member'])

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
