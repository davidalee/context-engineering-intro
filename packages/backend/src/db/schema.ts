import { pgTable, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const healthChecks = pgTable('health_checks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  status: text('status').notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type HealthCheck = typeof healthChecks.$inferSelect
export type NewHealthCheck = typeof healthChecks.$inferInsert
