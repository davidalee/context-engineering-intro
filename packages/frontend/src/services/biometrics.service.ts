import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

const BIOMETRIC_TOKEN_PREFIX = 'biometric_token_'
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled'
const LAST_USER_ID_KEY = 'last_user_id'

export interface BiometricSupportResult {
  isSupported: boolean
  isEnrolled: boolean
  authenticationType: LocalAuthentication.AuthenticationType[]
}

export async function checkBiometricSupport(): Promise<BiometricSupportResult> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  const authenticationType = await LocalAuthentication.supportedAuthenticationTypesAsync()

  return {
    isSupported: hasHardware,
    isEnrolled,
    authenticationType,
  }
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to continue',
    disableDeviceFallback: false,
    cancelLabel: 'Cancel',
  })

  return result.success
}

export async function enableBiometricLogin(userId: string): Promise<void> {
  const support = await checkBiometricSupport()

  if (!support.isSupported || !support.isEnrolled) {
    throw new Error('Biometric authentication not available on this device')
  }

  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.refresh_token) {
    throw new Error('No active session')
  }

  await SecureStore.setItemAsync(
    `${BIOMETRIC_TOKEN_PREFIX}${userId}`,
    session.refresh_token
  )

  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true')
  await SecureStore.setItemAsync(LAST_USER_ID_KEY, userId)
}

export async function disableBiometricLogin(): Promise<void> {
  const userId = await SecureStore.getItemAsync(LAST_USER_ID_KEY)

  if (userId) {
    await SecureStore.deleteItemAsync(`${BIOMETRIC_TOKEN_PREFIX}${userId}`)
  }

  await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY)
  await SecureStore.deleteItemAsync(LAST_USER_ID_KEY)
}

export async function isBiometricLoginEnabled(): Promise<boolean> {
  const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY)
  return enabled === 'true'
}

export async function loginWithBiometrics(): Promise<Session | null> {
  const enabled = await isBiometricLoginEnabled()
  if (!enabled) {
    return null
  }

  const userId = await SecureStore.getItemAsync(LAST_USER_ID_KEY)
  if (!userId) {
    return null
  }

  const authenticated = await authenticateWithBiometrics()
  if (!authenticated) {
    return null
  }

  const refreshToken = await SecureStore.getItemAsync(
    `${BIOMETRIC_TOKEN_PREFIX}${userId}`
  )

  if (!refreshToken) {
    await disableBiometricLogin()
    throw new Error('Biometric login expired. Please log in with your password.')
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: '',
    refresh_token: refreshToken,
  })

  if (error) {
    throw error
  }

  return data.session
}

export const biometricsService = {
  checkBiometricSupport,
  authenticateWithBiometrics,
  enableBiometricLogin,
  disableBiometricLogin,
  isBiometricLoginEnabled,
  loginWithBiometrics,
}
