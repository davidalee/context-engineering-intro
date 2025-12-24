import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '../components/Text'
import { colors } from '../theme/colors'
import { healthResponseSchema } from '@betweenus/shared'

export function HomeScreen() {
  const schemaFields = Object.keys(healthResponseSchema.shape)

  return (
    <View style={styles.container}>
      <Text variant="h1" style={styles.title}>
        BetweenUs
      </Text>
      <Text variant="body" color="textSecondary" style={styles.subtitle}>
        Dating safety, reimagined
      </Text>

      <View style={styles.card}>
        <Text variant="h3" style={styles.cardTitle}>
          Shared Package Test
        </Text>
        <Text variant="caption" color="textMuted">
          Health schema fields: {schemaFields.join(', ')}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  card: {
    backgroundColor: colors.backgroundDark,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    marginBottom: 8,
  },
})
