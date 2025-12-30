import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY

console.log('Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabasePublishableKey,
  keyLength: supabasePublishableKey?.length || 0
})

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Supabase environment variables not set')
}

const webStorageAdapter = {
  getItem: (key: string): Promise<string | null> => {
    const value = localStorage.getItem(key)
    return Promise.resolve(value)
  },
  setItem: (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value)
    return Promise.resolve()
  },
  removeItem: (key: string): Promise<void> => {
    localStorage.removeItem(key)
    return Promise.resolve()
  },
}

const nativeStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    return SecureStore.getItemAsync(key)
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value)
  },
  removeItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key)
  },
}

const storageAdapter = Platform.OS === 'web' ? webStorageAdapter : nativeStorageAdapter

export const supabase: SupabaseClient = createClient(
  supabaseUrl || '',
  supabasePublishableKey || '',
  {
    auth: {
      storage: storageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)

export default supabase
