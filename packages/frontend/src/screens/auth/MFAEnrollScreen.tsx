import React, { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from '../../components/Text'
import { colors } from '../../theme/colors'
import { supabase } from '../../lib/supabase'
import { QRCodeDisplay } from '../../components/auth/QRCodeDisplay'

type MFAEnrollScreenProps = {
  navigation: NativeStackNavigationProp<any>
}

export function MFAEnrollScreen({ navigation }: MFAEnrollScreenProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(true)

  useEffect(() => {
    enrollMFA()
  }, [])

  const enrollMFA = async () => {
    setIsEnrolling(true)
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      })

      if (error) {
        Alert.alert('Error', error.message)
        navigation.goBack()
        return
      }

      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
      setFactorId(data.id)
    } catch (error) {
      Alert.alert('Error', 'Failed to set up 2FA. Please try again.')
      navigation.goBack()
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleVerify = async () => {
    if (!factorId || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code from your authenticator app')
      return
    }

    setIsLoading(true)
    try {
      const { data: challengeData, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId })

      if (challengeError) {
        Alert.alert('Error', challengeError.message)
        return
      }

      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verificationCode,
      })

      if (error) {
        Alert.alert('Error', 'Invalid code. Please try again.')
        return
      }

      Alert.alert('Success', 'Two-factor authentication has been enabled!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      Alert.alert('Error', 'Failed to verify code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEnrolling) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="body" color="textSecondary" style={styles.loadingText}>
          Setting up 2FA...
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="h2">Set Up 2FA</Text>
        <Text variant="body" color="textSecondary" style={styles.subtitle}>
          Scan the QR code with your authenticator app
        </Text>
      </View>

      {qrCode && <QRCodeDisplay qrCode={qrCode} />}

      <View style={styles.secretContainer}>
        <Text variant="caption" color="textMuted">
          Or enter this code manually:
        </Text>
        <Text variant="body" style={styles.secretText}>
          {secret}
        </Text>
      </View>

      <View style={styles.form}>
        <Text variant="body" style={styles.label}>
          Enter verification code:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="000000"
          placeholderTextColor={colors.textMuted}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text variant="body" color="white">
              Verify & Enable
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
  },
  secretContainer: {
    backgroundColor: colors.backgroundDark,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  secretText: {
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
  },
  form: {
    marginTop: 24,
    gap: 16,
  },
  label: {
    marginBottom: -8,
  },
  input: {
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
})
