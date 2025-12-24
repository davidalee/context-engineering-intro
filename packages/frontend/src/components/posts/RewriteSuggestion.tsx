import React from 'react'
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

interface RewriteSuggestionProps {
  suggestions: string[]
  onSelect: (text: string) => void
  onDismiss: () => void
}

export function RewriteSuggestion({
  suggestions,
  onSelect,
  onDismiss,
}: RewriteSuggestionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3" style={styles.title}>
          Suggested Rewrites
        </Text>
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <Text variant="body" color="textMuted">
            Dismiss
          </Text>
        </TouchableOpacity>
      </View>

      <Text variant="caption" color="textSecondary" style={styles.hint}>
        This rewrite keeps your experience intact — it only adjusts wording for
        clarity and fairness.
      </Text>

      <ScrollView style={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionCard}
            onPress={() => onSelect(suggestion)}
          >
            <Text variant="body" style={styles.suggestionText}>
              {suggestion}
            </Text>
            <View style={styles.useButton}>
              <Text variant="caption" color="primary">
                Use this
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text variant="caption" color="textMuted" style={styles.footer}>
        These are suggestions — you decide what to share.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
  },
  dismissButton: {
    padding: 4,
  },
  hint: {
    marginBottom: 16,
  },
  suggestionsContainer: {
    maxHeight: 300,
  },
  suggestionCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    marginBottom: 8,
  },
  useButton: {
    alignSelf: 'flex-end',
  },
  footer: {
    textAlign: 'center',
    marginTop: 8,
  },
})
