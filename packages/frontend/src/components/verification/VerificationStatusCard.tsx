import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'
import { getStatusDisplayInfo } from '../../services/verification.service'
import type { VerificationStatus } from '@betweenus/shared'

interface VerificationStatusCardProps {
  status: VerificationStatus | null
  onStartVerification?: () => void
  onRetry?: () => void
}

const STATUS_COLORS = {
  success: {
    background: colors.successBackground,
    border: colors.success,
    icon: colors.success,
  },
  warning: {
    background: colors.warningBackground,
    border: colors.warning,
    icon: colors.warning,
  },
  error: {
    background: colors.errorBackground,
    border: colors.error,
    icon: colors.error,
  },
  info: {
    background: colors.infoBackground,
    border: colors.info,
    icon: colors.info,
  },
}

const STATUS_ICONS = {
  success: '✓',
  warning: '⏳',
  error: '✗',
  info: '🔒',
}

export function VerificationStatusCard({
  status,
  onStartVerification,
  onRetry,
}: VerificationStatusCardProps) {
  const statusInfo = getStatusDisplayInfo(status)
  const colorScheme = STATUS_COLORS[statusInfo.color]
  const icon = STATUS_ICONS[statusInfo.color]

  const handlePress = () => {
    if (statusInfo.canRetry) {
      if (status === 'denied' || status === 'error') {
        onRetry?.()
      } else {
        onStartVerification?.()
      }
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colorScheme.background,
          borderColor: colorScheme.border,
        },
      ]}
      onPress={handlePress}
      disabled={!statusInfo.canRetry}
      activeOpacity={statusInfo.canRetry ? 0.7 : 1}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colorScheme.border }]}>
          <Text variant="body" color="white" style={styles.icon}>
            {icon}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text variant="body" style={[styles.label, { color: colorScheme.border }]}>
            {statusInfo.label}
          </Text>
          <Text variant="caption" color="textSecondary">
            {statusInfo.description}
          </Text>
        </View>
        {statusInfo.canRetry && (
          <View style={styles.arrow}>
            <Text variant="body" color="textSecondary">
              →
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 2,
  },
  arrow: {
    marginLeft: 8,
  },
})
