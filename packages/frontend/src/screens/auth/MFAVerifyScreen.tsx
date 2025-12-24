import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Text } from '../../components/Text'
import { colors } from '../../theme/colors'
import { supabase } from '../../lib/supabase'
import type { AuthStackParamList } from '../../navigation/AppNavigator'

type MFAVerifyScreenProps = NativeStackScreenProps<AuthStackParamList, 'MFAVerify'>

export function MFAVerifyScreen({ navigation, route }: MFAVerifyScreenProps) {
  const { factorId } = route.params
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code')
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
        code,
      })

      if (error) {
        Alert.alert('Error', 'Invalid code. Please try again.')
        setCode('')
        return
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="h2">Two-Factor Authentication</Text>
          <Text variant="body" color="textSecondary" style={styles.subtitle}>
            Enter the code from your authenticator app
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="000000"
            placeholderTextColor={colors.textMuted}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
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
                Verify
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text variant="body" color="textSecondary">
            Use a different account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
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
    fontSize: 32,
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
  backButton: {
    alignItems: 'center',
    marginTop: 32,
  },
})
