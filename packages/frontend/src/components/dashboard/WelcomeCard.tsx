import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '../Text'
import { VerificationBadge } from '../verification/VerificationBadge'
import { colors } from '../../theme/colors'
import type { WelcomeData } from '@betweenus/shared'

interface WelcomeCardProps {
  welcome: WelcomeData
}

export function WelcomeCard({ welcome }: WelcomeCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2" color="text">
          Welcome back, {welcome.displayName}
        </Text>
        {welcome.isVerified && (
          <View style={styles.badgeContainer}>
            <VerificationBadge size="medium" showLabel />
          </View>
        )}
      </View>
      <Text variant="body" color="textSecondary" style={styles.summary}>
        {welcome.summaryText}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeContainer: {
    marginLeft: 4,
  },
  summary: {
    marginTop: 8,
  },
})
