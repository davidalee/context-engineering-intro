import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is required')
  }

  if (!supabaseSecretKey) {
    throw new Error('SUPABASE_SECRET_KEY environment variable is required')
  }

  supabaseInstance = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseInstance
}

export function getSupabaseAdmin(): SupabaseClient {
  return getSupabaseClient()
}

export const supabase = {
  get client() {
    return getSupabaseClient()
  },
  get admin() {
    return getSupabaseAdmin()
  },
}
