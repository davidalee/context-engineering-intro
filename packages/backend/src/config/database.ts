import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../db/schema.js'

let dbInstance: ReturnType<typeof drizzle> | null = null
let client: ReturnType<typeof postgres> | null = null

export function getDatabase() {
  if (dbInstance) {
    return dbInstance
  }

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  dbInstance = drizzle(client, { schema })

  return dbInstance
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const db = getDatabase()
    await db.select().from(schema.healthChecks).limit(1)
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.end()
    client = null
    dbInstance = null
  }
}

export const db = {
  get instance() {
    return getDatabase()
  },
  check: checkDatabaseConnection,
  close: closeDatabase,
}
