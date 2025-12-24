import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'
import type { UserStats } from '@betweenus/shared'

interface StatsCardProps {
  stats: UserStats
}

interface StatItemProps {
  value: number
  label: string
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text variant="h2" color="primary">
        {value}
      </Text>
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
    </View>
  )
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <View style={styles.container}>
      <StatItem value={stats.postsCount} label="Experiences shared" />
      <View style={styles.divider} />
      <StatItem value={stats.commentsReceivedCount} label="Comments received" />
      <View style={styles.divider} />
      <StatItem value={stats.memberSinceDays} label="Days as member" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
})
