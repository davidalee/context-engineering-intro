import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'
import type { AlertsPreview as AlertsPreviewData } from '@betweenus/shared'

interface AlertsPreviewProps {
  alerts: AlertsPreviewData
  onViewAll: () => void
}

export function AlertsPreview({ alerts, onViewAll }: AlertsPreviewProps) {
  if (alerts.totalCount === 0 && alerts.recentMatches.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="h3" color="text" style={styles.title}>
          Name Updates
        </Text>
        <View style={styles.emptyContainer}>
          <Text variant="body" color="textSecondary" style={styles.emptyText}>
            No name alerts set up yet. You can create alerts to be notified of
            matching experiences.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3" color="text">
          Name Updates
        </Text>
        {alerts.totalCount > 0 && (
          <View style={styles.countBadge}>
            <Text variant="caption" color="white">
              {alerts.totalCount}
            </Text>
          </View>
        )}
      </View>
      {alerts.recentMatches.map((match) => (
        <View key={match.id} style={styles.matchItem}>
          <Text variant="body" color="text">
            New activity for "{match.name}"
          </Text>
          <Text variant="caption" color="textMuted">
            {new Date(match.matchedAt).toLocaleDateString()}
          </Text>
        </View>
      ))}
      <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
        <Text variant="body" color="primary">
          View all updates
        </Text>
      </TouchableOpacity>
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
    gap: 8,
    marginBottom: 12,
  },
  title: {
    marginBottom: 12,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  matchItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emptyContainer: {
    paddingVertical: 12,
  },
  emptyText: {
    textAlign: 'left',
  },
  viewAllButton: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    marginTop: 4,
  },
})
