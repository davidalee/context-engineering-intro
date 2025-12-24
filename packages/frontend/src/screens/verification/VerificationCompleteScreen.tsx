import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Text } from '../../components/Text'
import { colors } from '../../theme/colors'
import { getVerificationStatus, getStatusDisplayInfo } from '../../services/verification.service'
import { useAuth } from '../../contexts/AuthContext'
import type { AppStackParamList } from '../../navigation/AppNavigator'
import type { VerificationStatus } from '@betweenus/shared'

type Props = NativeStackScreenProps<AppStackParamList, 'VerificationComplete'>

export function VerificationCompleteScreen({ navigation }: Props) {
  const { refreshProfile } = useAuth()
  const [status, setStatus] = useState<VerificationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await getVerificationStatus()
        setStatus(data?.status || null)
        if (data?.status === 'approved') {
          await refreshProfile()
        }
      } catch (error) {
        console.error('Failed to get verification status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const pollInterval = setInterval(checkStatus, 3000)
    checkStatus()

    return () => clearInterval(pollInterval)
  }, [refreshProfile])

  const statusInfo = getStatusDisplayInfo(status)

  const processingStatuses: VerificationStatus[] = ['in_progress', 'in_review']
  const errorStatuses: VerificationStatus[] = ['declined', 'expired', 'abandoned', 'kyc_expired']
  const isProcessing = status && processingStatuses.includes(status)
  const isError = status && errorStatuses.includes(status)

  const getStatusIcon = () => {
    if (isLoading || isProcessing) {
      return <ActivityIndicator size="large" color={colors.primary} />
    }

    if (status === 'approved') {
      return (
        <View style={[styles.iconCircle, { backgroundColor: colors.successBackground }]}>
          <Text variant="h1" style={{ color: colors.success }}>
            ✓
          </Text>
        </View>
      )
    }

    if (isError) {
      return (
        <View style={[styles.iconCircle, { backgroundColor: colors.errorBackground }]}>
          <Text variant="h1" style={{ color: colors.error }}>
            ✗
          </Text>
        </View>
      )
    }

    return (
      <View style={[styles.iconCircle, { backgroundColor: colors.warningBackground }]}>
        <Text variant="h1" style={{ color: colors.warning }}>
          ⏳
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>{getStatusIcon()}</View>

        <Text variant="h2" style={styles.title}>
          {isLoading ? 'Checking Status...' : statusInfo.label}
        </Text>

        <Text variant="body" color="textSecondary" style={styles.description}>
          {isLoading
            ? 'Please wait while we check your verification status.'
            : statusInfo.description}
        </Text>

        {isProcessing && (
          <View style={styles.processingNote}>
            <Text variant="caption" color="textSecondary" style={styles.processingText}>
              This usually takes just a few seconds. We'll update this page automatically.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {statusInfo.canRetry && !isLoading && status !== 'approved' && (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.replace('VerificationIntro')}
          >
            <Text variant="body" color="white" style={styles.buttonText}>
              Try Again
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text variant="body" color="textSecondary" style={styles.buttonText}>
            {status === 'approved' ? 'Done' : 'Go Home'}
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
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  processingNote: {
    backgroundColor: colors.backgroundDark,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  processingText: {
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
  buttonText: {
    fontWeight: '600',
  },
})
