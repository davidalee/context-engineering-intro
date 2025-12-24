import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

export interface Confirmations {
  firstPerson: boolean
  noHarassment: boolean
  understandsPublic: boolean
}

interface ConfirmationChecklistProps {
  confirmations: Confirmations
  onChange: (key: keyof Confirmations) => void
}

const CONFIRMATION_LABELS: Record<keyof Confirmations, string> = {
  firstPerson: 'This reflects my personal experience',
  noHarassment: "I won't harass or threaten anyone",
  understandsPublic: 'I understand this may be read by the person',
}

export function ConfirmationChecklist({
  confirmations,
  onChange,
}: ConfirmationChecklistProps) {
  const allChecked = Object.values(confirmations).every(Boolean)

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Before you share
      </Text>
      <Text variant="caption" color="textSecondary" style={styles.subtitle}>
        Please confirm the following
      </Text>

      {(Object.keys(CONFIRMATION_LABELS) as Array<keyof Confirmations>).map(
        (key) => (
          <TouchableOpacity
            key={key}
            style={styles.checkboxRow}
            onPress={() => onChange(key)}
          >
            <View
              style={[
                styles.checkbox,
                confirmations[key] && styles.checkboxChecked,
              ]}
            >
              {confirmations[key] && (
                <Text variant="body" color="white" style={styles.checkmark}>
                  ✓
                </Text>
              )}
            </View>
            <Text variant="body" style={styles.label}>
              {CONFIRMATION_LABELS[key]}
            </Text>
          </TouchableOpacity>
        )
      )}

      {!allChecked && (
        <Text variant="caption" color="textMuted" style={styles.hint}>
          All boxes must be checked to share
        </Text>
      )}
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
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    flex: 1,
  },
  hint: {
    textAlign: 'center',
    marginTop: 12,
  },
})
