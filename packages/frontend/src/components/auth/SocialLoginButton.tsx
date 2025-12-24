import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Text } from '../Text'
import { colors } from '../../theme/colors'
import { supabase } from '../../lib/supabase'
import { getAuthRedirectUrl } from '../../utils/deepLinking'
import type { Provider } from '@supabase/supabase-js'

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook' | 'apple'
}

const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  facebook: 'Facebook',
  apple: 'Apple',
}

const PROVIDER_COLORS: Record<string, string> = {
  google: '#4285F4',
  facebook: '#1877F2',
  apple: '#000000',
}

export function SocialLoginButton({ provider }: SocialLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePress = async () => {
    setIsLoading(true)
    try {
      const redirectUrl = getAuthRedirectUrl()

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      })

      if (error) {
        Alert.alert('Error', error.message)
        return
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        )

        if (result.type === 'success' && result.url) {
          const url = new URL(result.url)
          const accessToken = url.searchParams.get('access_token')
          const refreshToken = url.searchParams.get('refresh_token')

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: PROVIDER_COLORS[provider] }]}
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={PROVIDER_COLORS[provider]} />
      ) : (
        <Text variant="body" style={{ color: PROVIDER_COLORS[provider] }}>
          Continue with {PROVIDER_LABELS[provider]}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
})
