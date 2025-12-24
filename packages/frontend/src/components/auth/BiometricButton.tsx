import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'
import {
  checkBiometricSupport,
  loginWithBiometrics,
  isBiometricLoginEnabled,
  type BiometricSupportResult,
} from '../../services/biometrics.service'
import * as LocalAuthentication from 'expo-local-authentication'

interface BiometricButtonProps {
  onSuccess: () => void
}

export function BiometricButton({ onSuccess }: BiometricButtonProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [biometricType, setBiometricType] = useState<string>('Biometrics')

  useEffect(() => {
    checkSupport()
  }, [])

  const checkSupport = async () => {
    try {
      const support = await checkBiometricSupport()
      setIsSupported(support.isSupported && support.isEnrolled)

      if (support.authenticationType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID')
      } else if (support.authenticationType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Touch ID')
      }

      const enabled = await isBiometricLoginEnabled()
      setIsEnabled(enabled)
    } catch (error) {
      console.error('Error checking biometric support:', error)
    }
  }

  const handleBiometricLogin = async () => {
    setIsLoading(true)
    try {
      const session = await loginWithBiometrics()
      if (session) {
        onSuccess()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Biometric login failed'
      Alert.alert('Error', message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported || !isEnabled) {
    return null
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleBiometricLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text variant="body" color="primary">
          Sign in with {biometricType}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
})
