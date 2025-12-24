import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from '../../components/Text'
import { colors } from '../../theme/colors'
import { supabase } from '../../lib/supabase'
import { magicLinkSchema, verifyOtpSchema } from '@betweenus/shared'

type MagicLinkScreenProps = {
  navigation: NativeStackNavigationProp<any>
}

export function MagicLinkScreen({ navigation }: MagicLinkScreenProps) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)

  const handleSendMagicLink = async () => {
    const validation = magicLinkSchema.safeParse({ email })
    if (!validation.success) {
      Alert.alert('Validation Error', validation.error.errors[0].message)
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) {
        Alert.alert('Error', error.message)
        return
      }

      setShowOtpInput(true)
      Alert.alert(
        'Check Your Email',
        'We sent you a magic link. You can also enter the code manually.'
      )
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    const validation = verifyOtpSchema.safeParse({ email, token: otp })
    if (!validation.success) {
      Alert.alert('Validation Error', validation.error.errors[0].message)
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })

      if (error) {
        Alert.alert('Error', error.message)
        return
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="h1">Magic Link</Text>
          <Text variant="body" color="textSecondary" style={styles.subtitle}>
            {showOtpInput
              ? 'Enter the code from your email'
              : 'Sign in without a password'}
          </Text>
        </View>

        <View style={styles.form}>
          {!showOtpInput ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSendMagicLink}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text variant="body" color="white">
                    Send Magic Link
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor={colors.textMuted}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text variant="body" color="white">
                    Verify Code
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => setShowOtpInput(false)}
              >
                <Text variant="body" color="primary">
                  Resend code
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text variant="body" color="textSecondary">
            Back to login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  subtitle: {
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 4,
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
  linkButton: {
    alignItems: 'center',
    padding: 12,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 32,
  },
})
