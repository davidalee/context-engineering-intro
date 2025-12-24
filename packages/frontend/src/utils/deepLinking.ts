import * as Linking from 'expo-linking'
import { supabase } from '../lib/supabase'

export interface DeepLinkResult {
  type: 'auth' | 'verification' | 'unknown'
  success: boolean
  error?: string
}

export async function handleDeepLink(url: string): Promise<DeepLinkResult> {
  try {
    const parsedUrl = Linking.parse(url)

    if (parsedUrl.path?.includes('auth/callback')) {
      const params = parsedUrl.queryParams
      const accessToken = params?.access_token as string | undefined
      const refreshToken = params?.refresh_token as string | undefined

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          return { type: 'auth', success: false, error: error.message }
        }

        return { type: 'auth', success: true }
      }

      const type = params?.type as string | undefined
      if (type === 'signup' || type === 'email') {
        return { type: 'auth', success: true }
      }
    }

    if (parsedUrl.path?.includes('verify')) {
      return { type: 'verification', success: true }
    }

    return { type: 'unknown', success: false }
  } catch (error) {
    console.error('Deep link handling error:', error)
    return {
      type: 'unknown',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export function getAuthRedirectUrl(): string {
  return Linking.createURL('auth/callback')
}

export function setupDeepLinkListener(
  callback: (result: DeepLinkResult) => void
): () => void {
  const handleUrl = async (event: { url: string }) => {
    const result = await handleDeepLink(event.url)
    callback(result)
  }

  const subscription = Linking.addEventListener('url', handleUrl)

  Linking.getInitialURL().then((url) => {
    if (url) {
      handleDeepLink(url).then(callback)
    }
  })

  return () => {
    subscription.remove()
  }
}
