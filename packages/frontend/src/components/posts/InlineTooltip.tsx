import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'
import type { TriggerCategory } from '@betweenus/shared'

interface InlineTooltipProps {
  category: TriggerCategory
  message: string
  matchedText: string
  onRewriteRequest: () => void
  isLoading?: boolean
}

export function InlineTooltip({
  category,
  message,
  matchedText,
  onRewriteRequest,
  isLoading = false,
}: InlineTooltipProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text variant="caption" color="white" style={styles.badgeText}>
            {formatCategory(category)}
          </Text>
        </View>
        <Text variant="caption" color="textMuted" style={styles.matchedText}>
          &ldquo;{matchedText}&rdquo;
        </Text>
      </View>
      <Text variant="body" style={styles.message}>
        {message}
      </Text>
      <TouchableOpacity
        style={[styles.rewriteButton, isLoading && styles.rewriteButtonDisabled]}
        onPress={onRewriteRequest}
        disabled={isLoading}
      >
        <Text variant="body" color="primary">
          {isLoading ? 'Getting suggestions...' : 'Rewrite this'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

function formatCategory(category: TriggerCategory): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDark,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  matchedText: {
    fontStyle: 'italic',
    flex: 1,
  },
  message: {
    marginBottom: 12,
  },
  rewriteButton: {
    alignSelf: 'flex-start',
  },
  rewriteButtonDisabled: {
    opacity: 0.6,
  },
})
