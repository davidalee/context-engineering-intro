import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Text } from '../../components/Text'
import { colors } from '../../theme/colors'
import { initiateVerification } from '../../services/verification.service'
import type { AppStackParamList } from '../../navigation/AppNavigator'

type Props = NativeStackScreenProps<AppStackParamList, 'VerificationIntro'>

const PRIVACY_POINTS = [
  {
    title: 'Government ID Required',
    description: 'You\'ll need a valid government-issued ID (passport, driver\'s license, or national ID card).',
  },
  {
    title: 'Selfie Verification',
    description: 'A quick selfie to confirm your identity matches your ID.',
  },
  {
    title: 'Secure & Private',
    description: 'Your data is encrypted and handled by our trusted verification partner, Didit.me.',
  },
  {
    title: 'One-Time Process',
    description: 'Once verified, you won\'t need to do this again.',
  },
]

export function VerificationIntroScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStartVerification = async () => {
    setIsLoading(true)
    try {
      const response = await initiateVerification()
      navigation.replace('VerificationWebView', {
        verificationUrl: response.data.verificationUrl,
        sessionId: response.data.sessionId,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
      Alert.alert('Error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>
          Verify Your Identity
        </Text>
        <Text variant="body" color="textSecondary" style={styles.subtitle}>
          Help us keep our community safe by verifying your identity. This helps build trust between members.
        </Text>
      </View>

      <View style={styles.pointsContainer}>
        {PRIVACY_POINTS.map((point, index) => (
          <View key={index} style={styles.point}>
            <View style={styles.pointNumber}>
              <Text variant="body" color="white" style={styles.pointNumberText}>
                {index + 1}
              </Text>
            </View>
            <View style={styles.pointContent}>
              <Text variant="body" style={styles.pointTitle}>
                {point.title}
              </Text>
              <Text variant="caption" color="textSecondary">
                {point.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text variant="caption" color="textSecondary" style={styles.infoText}>
          By proceeding, you agree to share your ID information with our verification partner for identity verification purposes. Your data is protected under our Privacy Policy.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleStartVerification}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text variant="body" color="white" style={styles.buttonText}>
              Start Verification
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text variant="body" color="textSecondary" style={styles.buttonText}>
            Maybe Later
          </Text>
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
  contentContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  pointsContainer: {
    marginBottom: 24,
  },
  point: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pointNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  pointNumberText: {
    fontWeight: '600',
  },
  pointContent: {
    flex: 1,
  },
  pointTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  infoBox: {
    backgroundColor: colors.backgroundDark,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  infoText: {
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundDark,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: '600',
  },
})
