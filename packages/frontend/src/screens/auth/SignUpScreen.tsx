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
  ScrollView,
} from 'react-native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from '../../components/Text'
import { colors } from '../../theme/colors'
import { supabase } from '../../lib/supabase'
import { signUpSchema } from '@betweenus/shared'

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<any>
}

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    const validation = signUpSchema.safeParse({ email, password, fullName })
    if (!validation.success) {
      Alert.alert('Validation Error', validation.error.errors[0].message)
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        Alert.alert('Sign Up Failed', error.message)
        return
      }

      Alert.alert(
        'Check Your Email',
        'We sent you a verification link. Please check your email to complete sign up.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      )
    } catch (error) {
      console.error('SignUp Error Details:', error)
      const errorMessage = error instanceof Error
        ? `${error.message}\n\nCheck console for details.`
        : 'An unexpected error occurred. Please try again.'
      Alert.alert('Error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="h1">Create Account</Text>
          <Text variant="body" color="textSecondary" style={styles.subtitle}>
            Join the community
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={colors.textMuted}
            value={fullName}
            onChangeText={setFullName}
            autoComplete="name"
          />

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

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />

          <Text variant="caption" color="textMuted" style={styles.passwordHint}>
            Password must be 8+ characters with uppercase, lowercase, and number
          </Text>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text variant="body" color="white">
                Create Account
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text variant="caption" color="textSecondary">
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text variant="caption" color="primary">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
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
  },
  passwordHint: {
    marginTop: -8,
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
})
