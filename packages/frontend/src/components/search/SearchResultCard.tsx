import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import type { SearchResult } from '@betweenus/shared'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

interface SearchResultCardProps {
  result: SearchResult
  onPress: () => void
}

export function SearchResultCard({ result, onPress }: SearchResultCardProps) {
  const formattedDate = new Date(result.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const overlapText = result.overlapCount > 1
    ? `${result.overlapCount} people have shared similar experiences`
    : 'Someone shared an experience'

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {result.subjectName && (
        <View style={styles.header}>
          <Text variant="h3" color="text" numberOfLines={1}>
            {result.subjectName}
          </Text>
          {result.location && (
            <Text variant="caption" color="textMuted">
              📍 {result.location}
            </Text>
          )}
        </View>
      )}

      <Text variant="body" color="textSecondary" numberOfLines={3} style={styles.preview}>
        {result.preview}
      </Text>

      <View style={styles.footer}>
        <View style={styles.overlapBadge}>
          <Text variant="caption" color="primary">
            {overlapText}
          </Text>
        </View>
        <Text variant="caption" color="textMuted">
          {formattedDate}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  preview: {
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlapBadge: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
})
